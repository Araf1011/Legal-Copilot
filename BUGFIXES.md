# Bug report & fixes

## Critical
1. **No Groq anywhere.** Backend never called an LLM; frontend called Google Gemini (1.5 models) straight from the browser. -> Backend now calls Groq through CrewAI; frontend only talks to the backend.
2. **"CrewAI agents" were plain Python classes** returning hardcoded templates. -> Real CrewAI crew (Analyst, Researcher, Verifier, Writer) + deterministic retrieval stage.
3. **ChromaDB was connected but never filled or queried**, yet `chroma_available=True` was logged. -> Real persistent collection with multilingual-e5 embeddings, fused with BM25; `/api/health` reports the true mode.
4. **~1,000 lines of canned legal answers in `aiService.js`** were shown as "RAG verified", and silently replaced real answers whenever the backend was down. -> Removed; the UI now shows a clear error.
5. **Outdated / unverifiable law.** Cyber Security Act 2023 was repealed on 21 May 2025 (Cyber Security Ordinance 2025); cited sections 24/25 were among those omitted. "Family Courts Act 2023" -> Family Courts Ordinance 1985. Hardcoded phone numbers removed. Everything unchecked is now flagged `verified:false` and the answer says so.
6. **PDF can't be read.** Legacy non-Unicode Bangla font (pages ~1-190) + scans -> text extraction returns garbage. -> `ingest_pdf.py` OCRs with Tesseract (ben+eng), caches, chunks.

## Retrieval bugs (old `rag_engine.py`)
- substring matching: "tin", "tax", "কর", "gd" matched inside unrelated words; section "8"/"9"/"4" matched any query containing that digit
- Bangla digits (১৩৮) never matched "138"; no Bangla inflection handling; always returned top-k even for off-topic queries
- Fixed with a Unicode tokenizer, digit normalisation, light Bangla stemming, BM25, relevance cut-offs (off-topic -> "not found", no guessing)

## Backend / config
- `CORS allow_origins=["*"]` + `allow_credentials=True` is invalid -> explicit origins via `CORS_ORIGINS`
- `.env` never loaded; `python-dotenv` unused; no `GROQ_API_KEY` handling -> clear 503 when missing, 502/429 on LLM failure
- unpinned/conflicting `requirements.txt` with unused langchain/requests/bs4 -> trimmed
- no input limits -> 2000-char cap; response now includes sources, warnings, unsupported citations
- LLM output citations re-checked in code against retrieved passages; disclaimer appended in code
- recent CrewAI has no LiteLLM and no native Groq provider -> Groq reached via its OpenAI-compatible endpoint

## Frontend
- API key stored in browser localStorage -> removed (key lives in `backend/.env`)
- hardcoded `localhost:8000` -> `VITE_API_URL`
- misleading labels ("Legal-Gemini 2.5 Pro fine-tuned", "BD RAG Verified") -> corrected; top bar now shows live backend status
- errors were swallowed (`console.error` only) -> shown in chat
- README referred to Gemini, a missing `.env.example`, and another repo -> rewritten

## Known leftovers
- The "Agent 1..5" progress text in the chat is a timer, not live pipeline progress.
- Contract review / clause / compliance screens are leftovers from a different product and don't use the backend.
- 40 pre-existing oxlint warnings (0 errors).
