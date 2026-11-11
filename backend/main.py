from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from rag_engine import rag_knowledge_base
from crewai_agents import CrewAILegalCoordinator

app = FastAPI(
    title="Bangladesh Legal Copilot - Multi-Agent RAG Backend",
    description="Python FastAPI backend powered by LangChain RAG & CrewAI 5-Agent Pipeline for Bangladesh Legal System",
    version="1.0.0"
)

# Enable CORS for React Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

coordinator = CrewAILegalCoordinator(rag_knowledge_base)

class QueryRequest(BaseModel):
    query: str
    model: Optional[str] = "gemini-1.5-flash"

class QueryResponse(BaseModel):
    query: str
    domain: str
    language: str
    retrieved_count: int
    verified: bool
    pipeline_steps: List[str]
    response: str

@app.get("/")
def read_root():
    return {
        "system": "Bangladesh Legal Copilot Backend",
        "status": "online",
        "rag_engine": "Statutory Vector & Lexical RAG",
        "multi_agent": "CrewAI 5-Agent Pipeline Architecture",
        "jurisdiction": "People's Republic of Bangladesh"
    }

@app.post("/api/query", response_model=QueryResponse)
def handle_legal_query(req: QueryRequest):
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    result = coordinator.run(req.query.strip())
    return result

@app.get("/api/sources")
def get_sources():
    return {
        "portal": "https://bdlaws.minlaw.gov.bd/?lang=bn",
        "master_pdf": "/Allfile.pdf",
        "indexed_statutes_count": len(rag_knowledge_base.documents),
        "documents": rag_knowledge_base.documents
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
