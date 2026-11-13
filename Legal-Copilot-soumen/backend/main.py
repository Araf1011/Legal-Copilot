import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import List

load_dotenv()
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"), format="%(asctime)s %(levelname)s %(name)s: %(message)s")

from crewai_agents import (CrewAILegalCoordinator, GROQ_MODEL, LLMNotConfigured,  # noqa: E402
                           PipelineError)
from rag_engine import rag_knowledge_base  # noqa: E402

app = FastAPI(
    title="Bangladesh Legal Copilot - Multi-Agent RAG Backend",
    description="FastAPI + ChromaDB/BM25 hybrid RAG + CrewAI agents on Groq",
    version="2.0.0",
)

# credentials + "*" is rejected by browsers, so list real origins (comma-separated in .env)
_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if o.strip()]
app.add_middleware(CORSMiddleware, allow_origins=_origins, allow_methods=["GET", "POST"], allow_headers=["Content-Type"])

coordinator = CrewAILegalCoordinator(rag_knowledge_base)


class QueryRequest(BaseModel):
    query: str = Field(..., max_length=2000)

    @field_validator("query")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Query cannot be empty.")
        return v


class Source(BaseModel):
    act: str
    sections: List[str] = []
    url: str = ""
    verified: bool = False


class QueryResponse(BaseModel):
    query: str
    domain: str
    language: str
    retrieved_count: int
    verified: bool
    pipeline_steps: List[str]
    unsupported_citations: List[str] = []
    warnings: List[str] = []
    sources: List[Source] = []
    response: str


@app.get("/")
def read_root():
    return {"system": "Bangladesh Legal Copilot Backend", "status": "online", "docs": "/docs"}


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "llm_provider": "groq",
        "llm_model": GROQ_MODEL,
        "llm_configured": coordinator.llm_configured,
        "retrieval_mode": rag_knowledge_base.mode,          # "hybrid" = Chroma + BM25, "lexical" = BM25 only
        "retrieval_note": rag_knowledge_base.mode_reason,
        "passages_indexed": len(rag_knowledge_base.documents),
    }


@app.post("/api/query", response_model=QueryResponse)
def handle_legal_query(req: QueryRequest):
    try:
        return coordinator.run(req.query)
    except LLMNotConfigured as e:
        raise HTTPException(status_code=503, detail=str(e))
    except PipelineError as e:
        msg = str(e)
        code = 429 if "RateLimit" in msg or "rate limit" in msg.lower() else 502
        raise HTTPException(status_code=code, detail=f"The language model call failed: {msg[:300]}")


@app.get("/api/sources")
def get_sources():
    return {
        "portal": "https://bdlaws.minlaw.gov.bd/?lang=bn",
        "indexed_passages": len(rag_knowledge_base.documents),
        "documents": [{k: d.get(k) for k in ("id", "act", "title", "sections", "url", "source", "verified")}
                      for d in rag_knowledge_base.documents],
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
