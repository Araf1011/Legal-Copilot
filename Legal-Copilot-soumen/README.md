# Bangladesh Legal Copilot ⚖️🇧🇩

Ask questions (Bangla or English) about Bangladesh law and government services.
Answers come from a **RAG pipeline** (ChromaDB vectors + BM25) and a **CrewAI multi-agent crew** running on **Groq**.

```
React (Vite)  ──HTTP──▶  FastAPI  ──▶  Agent 1  Query Analyst      (CrewAI · Groq LLM)
                                   ├─▶  Agent 2  Retrieval           (Chroma multilingual-e5 + BM25, RRF-fused)
                                   ├─▶  Agent 3  Legal Researcher    (CrewAI · reads ONLY retrieved passages)
                                   ├─▶  Agent 4  Legal Verifier      (CrewAI · deletes unsupported claims)
                                   ├─▶  Agent 5  Response Writer     (CrewAI · 8-part answer in the user's language)
                                   └─▶  Code-level citation check + disclaimer appended in code
```

If nothing relevant is retrieved, the system says so instead of guessing.

## Run it

**Backend** (Python 3.10–3.13)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                   # then put your key in GROQ_API_KEY (https://console.groq.com/keys)
uvicorn main:app --reload                              # http://localhost:8000/docs
pytest -q                                              # retrieval/citation tests, no key needed
```
Check `http://localhost:8000/api/health` – it tells you whether the key is set and whether retrieval is
`hybrid` (vectors + BM25) or `lexical` (BM25 only, if the embedding model could not load).

**Frontend**
```bash
npm install
cp .env.example .env        # only needed if the backend is not on localhost:8000
npm run dev                 # http://localhost:5173
```

## Index the PDF (`public/Allfile.pdf`)
The PDF's text layer is unusable (legacy non‑Unicode Bangla font on the first ~190 pages, scans after that), so it must be OCR'd:
```bash
sudo apt install tesseract-ocr tesseract-ocr-ben       # macOS: brew install tesseract tesseract-lang
cd backend && python ingest_pdf.py --ocr always        # ~429 pages; resumable, cached per page
```
Restart the API afterwards; new passages are embedded automatically. OCR text is marked *unverified* in answers.

## Keeping the law current
`backend/knowledge_base/statutes.json` is the curated set. Entries with `"verified": false` have **not** been checked against
https://bdlaws.minlaw.gov.bd and the answers say so. Bangladeshi law changes often (e.g. the Cyber Security Act 2023 was repealed
by the Cyber Security Ordinance 2025), so verify an entry, then set `"verified": true`.

*Informational tool only – not legal advice.*
