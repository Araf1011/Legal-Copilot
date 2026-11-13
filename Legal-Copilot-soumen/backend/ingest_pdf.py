"""
Turn public/Allfile.pdf into retrievable passages  ->  knowledge_base/pdf_chunks.json

WHY THIS EXISTS: the PDF's text layer is NOT usable. Pages ~1-190 use a legacy (non-Unicode) Bangla font,
so extraction returns garbage such as 'ĺপাটŪ াল', and the remaining pages are scans with no text at all.
Both cases need OCR. This script detects bad text layers, OCRs those pages with Tesseract (ben+eng),
caches every page, then chunks the result.

Requirements:  pip install pymupdf   and   Tesseract with Bangla data
    Ubuntu : sudo apt install tesseract-ocr tesseract-ocr-ben
    macOS  : brew install tesseract tesseract-lang
    Windows: install Tesseract, then add ben.traineddata to its tessdata folder
Usage:
    python ingest_pdf.py                    # whole file, OCR only where needed
    python ingest_pdf.py --ocr always       # distrust the text layer entirely (recommended for this PDF)
    python ingest_pdf.py --pages 1-20       # quick test
    python ingest_pdf.py --workers 4        # parallel OCR (default: CPU cores - 1)
Afterwards restart the API: the vector store re-syncs automatically.
OCR output can contain errors, so every chunk is marked verified=false and the API says so in its answers.
"""
import argparse
import json
import os
import re
import subprocess
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import pymupdf

BASE = Path(__file__).resolve().parent
DEFAULT_PDF = BASE.parent / "public" / "Allfile.pdf"
OUT = BASE / "knowledge_base" / "pdf_chunks.json"
CACHE = BASE / "knowledge_base" / "pdf_page_cache.json"

_BN_WORD = re.compile(r"[\u0980-\u09FF]+")


def text_layer_is_bad(text: str) -> bool:
    t = text.strip()
    if len(t) < 40:
        return True                                   # scan / empty
    chars = [c for c in t if not c.isspace()]
    odd = sum(1 for c in chars if 0x80 <= ord(c) <= 0x2FF or 0x370 <= ord(c) <= 0x3FF or 0x2000 <= ord(c) <= 0x2BFF)
    if odd / len(chars) > 0.01:
        return True                                   # legacy-font mojibake (Latin-ext / Greek letters inside Bangla)
    words = _BN_WORD.findall(t)
    # a dependent vowel sign can never start a real Bangla word; in legacy-encoded text it often does
    bad = sum(1 for w in words if "\u09BE" <= w[0] <= "\u09CC" or w[0] in "\u09D7\u09C4")
    return bool(words) and bad / len(words) > 0.02


def ocr_page(page, dpi: int, lang: str) -> str:
    png = page.get_pixmap(dpi=dpi).tobytes("png")
    r = subprocess.run(["tesseract", "stdin", "stdout", "-l", lang, "--psm", "6"], input=png, capture_output=True, timeout=180)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.decode("utf-8", "ignore")[:300])
    return r.stdout.decode("utf-8", "ignore")


def chunk(text: str, size: int = 1100, overlap: int = 150):
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{2,}", "\n", text).strip()
    i = 0
    while i < len(text):
        end = min(len(text), i + size)
        if end < len(text):                           # prefer to break at a sentence end (Bangla danda or period)
            cut = max(text.rfind("।", i, end), text.rfind(". ", i, end), text.rfind("\n", i, end))
            if cut > i + size // 2:
                end = cut + 1
        yield text[i:end].strip()
        if end >= len(text):
            break
        i = max(end - overlap, i + 1)


def _work(args):
    """Runs in a worker process and returns (page_index, result). Each process opens its own PDF handle."""
    pdf, pno, mode, dpi, lang = args
    page = pymupdf.open(pdf)[pno]
    raw = page.get_text()
    if mode == "always" or text_layer_is_bad(raw):
        return pno, {"text": ocr_page(page, dpi, lang), "ocr": True}
    return pno, {"text": raw, "ocr": False}


def parse_range(s, n):
    if not s:
        return range(n)
    a, _, b = s.partition("-")
    return range(int(a) - 1, min(n, int(b or a)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", default=str(DEFAULT_PDF))
    ap.add_argument("--pages", help="e.g. 1-20 (1-based, inclusive)")
    ap.add_argument("--ocr", choices=["auto", "always"], default="auto")
    ap.add_argument("--dpi", type=int, default=200)
    ap.add_argument("--lang", default="ben+eng")
    ap.add_argument("--workers", type=int, default=max(1, (os.cpu_count() or 2) - 1), help="parallel OCR processes")
    a = ap.parse_args()

    doc = pymupdf.open(a.pdf)
    cache = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}
    todo = [(a.pdf, p, a.ocr, a.dpi, a.lang) for p in parse_range(a.pages, len(doc))
            if f"{p + 1}:{a.ocr}:{a.lang}:{a.dpi}" not in cache]
    print(f"{len(todo)} page(s) to process with {a.workers} worker(s)", flush=True)
    done = 0
    try:
        with ProcessPoolExecutor(max_workers=a.workers) as pool:
            for pno, res in pool.map(_work, todo):
                cache[f"{pno + 1}:{a.ocr}:{a.lang}:{a.dpi}"] = res
                done += 1
                if done % 5 == 0:
                    CACHE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
                    print(f"  {done}/{len(todo)} pages done", flush=True)
    except FileNotFoundError:
        sys.exit("Tesseract not found. Install it (see the top of this file).")
    CACHE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")

    chunks = []
    for key, v in sorted(cache.items(), key=lambda kv: int(kv[0].split(":")[0])):
        pno = int(key.split(":")[0])
        for n, c in enumerate(chunk(v["text"])):
            if len(c) < 60:
                continue
            chunks.append({
                "id": f"pdf-p{pno:03d}-{n}", "act": "Master Legal & Public Services Handbook (Allfile.pdf)",
                "title": f"Handbook page {pno}", "sections": [], "keywords": [], "content": c,
                "url": f"/Allfile.pdf#page={pno}", "source": f"Allfile.pdf p.{pno}" + (" (OCR)" if v["ocr"] else ""),
                "verified": False,
            })
    OUT.write_text(json.dumps(chunks, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Wrote {len(chunks)} chunks from {len(cache)} pages -> {OUT}")


if __name__ == "__main__":
    main()
