"""
Retrieval layer for Bangladesh Legal Copilot.

Two retrievers, fused with Reciprocal Rank Fusion (RRF):
  1. Dense   - ChromaDB persistent collection, multilingual-e5 embeddings (handles Bangla + English)
  2. Lexical - BM25 over a Unicode-aware tokenizer (Bangla digits normalised, light Bangla stemming)

If the embedding model / chromadb cannot be loaded, the engine falls back to lexical-only and says so
through `kb.mode` (exposed on /api/health) instead of pretending to be a vector store.
"""
from __future__ import annotations

import hashlib
import json
import logging
import math
import os
import re
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List, Optional

log = logging.getLogger("legal_rag")

BASE_DIR = Path(__file__).resolve().parent
KNOWLEDGE_DIR = BASE_DIR / "knowledge_base"
VECTOR_DIR = Path(os.getenv("VECTOR_DIR", BASE_DIR / "vector_store"))
EMBED_MODEL = os.getenv("EMBED_MODEL", "intfloat/multilingual-e5-small")
COLLECTION_NAME = "bangladesh_laws_v2"

_BN_DIGITS = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")
_TOKEN_RE = re.compile(r"[\u0980-\u09FF]+|[a-zA-Z]+|\d+")
_BN_SUFFIXES = ("গুলোর", "গুলো", "দের", "ের", "েরা", "কে", "তে", "য়", "র", "ে", "ও")
_STOP = {
    "the", "a", "an", "of", "to", "in", "is", "and", "or", "for", "on", "what", "how", "can", "i", "my",
    "কি", "কী", "কে", "কীভাবে", "এবং", "ও", "বা", "হয়", "করতে", "করা", "আমি", "আমার", "জন্য", "থেকে",
}


def normalize(text: str) -> str:
    return text.lower().translate(_BN_DIGITS)


def tokenize(text: str) -> List[str]:
    """Words + crude Bangla stems. Whole-token matching only (no substring false positives)."""
    out: List[str] = []
    for tok in _TOKEN_RE.findall(normalize(text)):
        if tok in _STOP:
            continue
        out.append(tok)
        if "\u0980" <= tok[0] <= "\u09ff":
            for suf in _BN_SUFFIXES:
                if tok.endswith(suf) and len(tok) - len(suf) >= 2:
                    out.append(tok[: -len(suf)])
                    break
    return out


class BM25:
    def __init__(self, docs_tokens: List[List[str]], k1: float = 1.5, b: float = 0.75):
        self.k1, self.b = k1, b
        self.docs = docs_tokens
        self.tf = [Counter(d) for d in docs_tokens]
        self.dl = [len(d) for d in docs_tokens]
        self.avgdl = (sum(self.dl) / len(self.dl)) if self.dl else 0.0
        df: Counter = Counter()
        for d in self.tf:
            df.update(d.keys())
        n = len(docs_tokens)
        self.idf = {t: math.log(1 + (n - f + 0.5) / (f + 0.5)) for t, f in df.items()}

    def scores(self, query_tokens: List[str]) -> List[float]:
        res = []
        for i, tf in enumerate(self.tf):
            s = 0.0
            for t in set(query_tokens):
                f = tf.get(t)
                if not f:
                    continue
                denom = f + self.k1 * (1 - self.b + self.b * self.dl[i] / (self.avgdl or 1))
                s += self.idf.get(t, 0.0) * f * (self.k1 + 1) / denom
            res.append(s)
        return res


class LegalKnowledgeBase:
    def __init__(self, embedder=None, vector_dir: Optional[Path] = None) -> None:
        self._injected_embedder = embedder      # lets tests/alt backends supply any object with .encode()
        self._vector_dir = Path(vector_dir) if vector_dir else VECTOR_DIR
        self.documents: List[Dict[str, Any]] = []   # one entry per retrievable chunk
        self.mode = "lexical"                        # "hybrid" once Chroma + embeddings are live
        self.mode_reason = ""
        self._collection = None
        self._embedder = None
        self._bm25: Optional[BM25] = None
        self._load_documents()
        self._build_lexical()
        self._try_init_vector_store()

    # ------------------------------------------------------------------ loading
    def _load_documents(self) -> None:
        docs: List[Dict[str, Any]] = []
        for name in ("statutes.json", "statutes_extra.json", "pdf_chunks.json"):
            p = KNOWLEDGE_DIR / name
            if not p.exists():
                continue
            try:
                for d in json.loads(p.read_text(encoding="utf-8")):
                    d.setdefault("sections", [])
                    d.setdefault("keywords", [])
                    d.setdefault("verified", False)
                    d.setdefault("source", name)
                    d.setdefault("url", "https://bdlaws.minlaw.gov.bd/?lang=bn")
                    d["sections"] = [str(s) for s in d["sections"]]
                    docs.append(d)
            except Exception as e:  # a corrupt file must not take the API down
                log.error("Could not load %s: %s", p, e)
        ids = [d["id"] for d in docs]
        if len(ids) != len(set(ids)):
            raise ValueError("Duplicate document ids in knowledge base")
        self.documents = docs
        log.info("Loaded %d knowledge-base passages", len(docs))

    @staticmethod
    def _index_text(d: Dict[str, Any]) -> str:
        return " ".join([d.get("title", ""), d.get("act", ""), d.get("act_bn", ""), " ".join(d["keywords"]),
                         " ".join(d["sections"]), d.get("content", "")])

    def _build_lexical(self) -> None:
        self._bm25 = BM25([tokenize(self._index_text(d)) for d in self.documents]) if self.documents else None

    # ------------------------------------------------------------------ vector store
    def _try_init_vector_store(self) -> None:
        if not self.documents:
            self.mode_reason = "no documents"
            return
        try:
            import chromadb
            if self._injected_embedder is None:
                from sentence_transformers import SentenceTransformer
        except Exception as e:
            self.mode_reason = f"dense retrieval unavailable ({e.__class__.__name__}: {e})"
            log.warning("%s - using BM25 only", self.mode_reason)
            return
        try:
            self._vector_dir.mkdir(parents=True, exist_ok=True)
            self._embedder = self._injected_embedder or SentenceTransformer(EMBED_MODEL)
            client = chromadb.PersistentClient(path=str(self._vector_dir))
            # embeddings are supplied explicitly (e5 needs different prefixes for queries vs passages)
            self._collection = client.get_or_create_collection(
                COLLECTION_NAME, embedding_function=None, metadata={"hnsw:space": "cosine"})
            self._sync_collection()
            self.mode = "hybrid"
        except Exception as e:
            self._collection = None
            self.mode_reason = f"vector store failed ({e.__class__.__name__}: {e})"
            log.exception("Vector store init failed - using BM25 only")

    def _embed(self, texts: List[str], kind: str) -> List[List[float]]:
        prefixed = [f"{kind}: {t}" for t in texts]
        return self._embedder.encode(prefixed, normalize_embeddings=True, show_progress_bar=False).tolist()

    def _sync_collection(self) -> None:
        """Make the collection mirror self.documents (add new, drop removed, re-embed changed)."""
        existing = self._collection.get(include=["metadatas"])
        have = {i: (m or {}).get("hash") for i, m in zip(existing["ids"], existing["metadatas"])}
        want = {d["id"]: hashlib.md5(self._index_text(d).encode("utf-8")).hexdigest() for d in self.documents}
        stale = [i for i in have if i not in want]
        if stale:
            self._collection.delete(ids=stale)
        todo = [d for d in self.documents if have.get(d["id"]) != want[d["id"]]]
        for i in range(0, len(todo), 32):
            batch = todo[i:i + 32]
            self._collection.upsert(
                ids=[d["id"] for d in batch],
                embeddings=self._embed([self._index_text(d)[:2000] for d in batch], "passage"),
                documents=[d["content"][:4000] for d in batch],
                metadatas=[{"hash": want[d["id"]], "act": d.get("act", "")[:200]} for d in batch],
            )
        log.info("Vector store synced: %d added/updated, %d removed", len(todo), len(stale))

    # ------------------------------------------------------------------ retrieval
    def retrieve(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        if not self.documents or not query.strip():
            return []
        n = len(self.documents)
        ranks: Dict[int, float] = {}
        idx_by_id = {d["id"]: i for i, d in enumerate(self.documents)}

        # lexical ranking (only docs that share at least one real token)
        lex = self._bm25.scores(tokenize(query)) if self._bm25 else [0.0] * n
        lex_order = [i for i in sorted(range(n), key=lambda i: lex[i], reverse=True) if lex[i] > 0]
        for rank, i in enumerate(lex_order[:top_k * 3]):
            ranks[i] = ranks.get(i, 0.0) + 1.0 / (60 + rank)

        # dense ranking
        dense_hit = False
        if self._collection is not None:
            try:
                res = self._collection.query(query_embeddings=self._embed([query], "query"),
                                             n_results=min(top_k * 3, n), include=["distances"])
                for rank, (doc_id, dist) in enumerate(zip(res["ids"][0], res["distances"][0])):
                    if dist <= 0.45 and doc_id in idx_by_id:   # cosine distance cut-off: drop clearly unrelated hits
                        dense_hit = True
                        i = idx_by_id[doc_id]
                        ranks[i] = ranks.get(i, 0.0) + 1.0 / (60 + rank)
            except Exception:
                log.exception("Dense query failed; continuing with lexical results")

        if not ranks:
            return []
        # Lexical-only evidence must be reasonably strong, otherwise we'd return noise for off-topic questions.
        if not dense_hit and lex_order and lex[lex_order[0]] < 2.0:
            return []
        top = sorted(ranks, key=ranks.get, reverse=True)[:top_k]
        return [self.documents[i] for i in top]


rag_knowledge_base = LegalKnowledgeBase()
