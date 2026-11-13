"""Run:  pytest -q   (no API key or network needed)"""
import os
os.environ["GROQ_API_KEY"] = ""
import pytest
from fastapi.testclient import TestClient

from rag_engine import rag_knowledge_base as kb, tokenize
from crewai_agents import extract_cited_numbers, allowed_numbers, detect_language


def top_ids(q, k=3):
    return [d["id"] for d in kb.retrieve(q, top_k=k)]


def test_tokenizer_normalises_bangla_digits_and_stems():
    assert "138" in tokenize("ধারা ১৩৮")
    assert "জামিন" in tokenize("জামিনের আবেদন")


@pytest.mark.parametrize("q,expected", [
    ("চেক ডিজঅনার হলে কী করব?", "ni-act-138-cheque"),
    ("how to get bail in a non-bailable offence", "crpc-bail-496-497"),
    ("difference between GD and FIR", "penal-code-gd-fir-crpc-154"),
    ("আয়কর রিটার্ন দাখিলের শেষ তারিখ", "income-tax-act-2023"),
    ("someone hacked my facebook and is blackmailing me", "cyber-law-2025-status"),
])
def test_retrieval_finds_right_statute(q, expected):
    assert expected in top_ids(q, 4)


def test_no_substring_false_positives():
    # old engine matched the 'tin'/'কর' keywords and section "8" inside unrelated words/numbers
    assert "income-tax-act-2023" not in top_ids("what is the meaning of destiny and routine", 4)
    assert kb.retrieve("what is the best pizza recipe in dhaka") == []


def test_repealed_cyber_act_not_presented_as_current():
    doc = next(d for d in kb.documents if d["id"] == "cyber-law-2025-status")
    assert "repealed" in doc["content"].lower() and "2025" in doc["content"]


def test_citation_checker_flags_invented_sections():
    docs = [d for d in kb.documents if d["id"] == "ni-act-138-cheque"]
    ans = "Under Section 138 and Section 999 of the NI Act, ধারা ১৪১ applies."
    unsupported = extract_cited_numbers(ans) - allowed_numbers(docs)
    assert unsupported == {"999"}


def test_language_detection():
    assert detect_language("জামিন কীভাবে পাব") == "bn"
    assert detect_language("how do I file a GD") == "en"


def test_api_validation_and_clear_error_without_key():
    from main import app
    c = TestClient(app)
    assert c.post("/api/query", json={"query": "   "}).status_code == 422
    assert c.post("/api/query", json={"query": "x" * 2001}).status_code == 422
    r = c.post("/api/query", json={"query": "চেক বাউন্স"})
    assert r.status_code == 503 and "GROQ_API_KEY" in r.json()["detail"]
    h = c.get("/api/health").json()
    assert h["llm_configured"] is False and h["passages_indexed"] >= 20


# ---------------------------------------------------------------- pipeline glue (LLM stages stubbed)
def _coord(monkeypatch, answer):
    import crewai_agents as ca
    monkeypatch.setenv("GROQ_API_KEY", "test-key")
    c = ca.CrewAILegalCoordinator(kb)
    monkeypatch.setattr(c, "_analyze", lambda q, lang: {"language": lang, "domain": "banking", "search_query": q, "in_scope": True})
    monkeypatch.setattr(c, "_research_verify_write", lambda q, lang, ctx: answer)
    return c


def test_pipeline_flags_invented_section_and_appends_disclaimer(monkeypatch):
    c = _coord(monkeypatch, "### 1. Direct Answer\nUnder Section 138 and Section 777 you may file a complaint.")
    r = c.run("cheque dishonour section 138 notice")
    assert r["unsupported_citations"] == ["777"] and r["verified"] is False
    assert "Legal Disclaimer" in r["response"] and "777" in " ".join(r["warnings"])
    assert r["sources"] and r["retrieved_count"] >= 1


def test_pipeline_refuses_to_guess_when_nothing_retrieved(monkeypatch):
    c = _coord(monkeypatch, "SHOULD NOT BE USED")
    r = c.run("what is the best pizza recipe in dhaka")
    assert r["retrieved_count"] == 0 and "SHOULD NOT BE USED" not in r["response"]
    assert "will not guess" in r["response"]


def test_pipeline_bangla_gets_bangla_disclaimer(monkeypatch):
    c = _coord(monkeypatch, "### ১. সরাসরি উত্তর\nধারা ১৩৮ অনুযায়ী মামলা করা যায়।")
    r = c.run("চেক ডিজঅনার হলে ১৩৮ ধারায় কী করব")
    assert r["language"] == "bn" and "আইনি সতর্কবার্তা" in r["response"] and r["unsupported_citations"] == []


# ---------------------------------------------------------------- Chroma path with a deterministic stub embedder
def test_chroma_hybrid_mode_with_stub_embedder(tmp_path):
    pytest.importorskip("chromadb")
    import hashlib

    class StubEmbedder:                       # hashed bag-of-words -> 64-d vector, good enough to exercise Chroma plumbing
        def encode(self, texts, normalize_embeddings=True, show_progress_bar=False):
            import numpy as np
            out = []
            for t in texts:
                v = np.zeros(64)
                for tok in tokenize(t.split(": ", 1)[-1]):
                    v[int(hashlib.md5(tok.encode()).hexdigest(), 16) % 64] += 1
                n = np.linalg.norm(v) or 1.0
                out.append(v / n)
            return np.array(out)

    from rag_engine import LegalKnowledgeBase
    k = LegalKnowledgeBase(embedder=StubEmbedder(), vector_dir=tmp_path / "vs")
    assert k.mode == "hybrid" and k._collection.count() == len(k.documents)
    assert "ni-act-138-cheque" in [d["id"] for d in k.retrieve("cheque bounce dishonour notice", 4)]
    # second start re-uses the persisted collection (no duplicates)
    k2 = LegalKnowledgeBase(embedder=StubEmbedder(), vector_dir=tmp_path / "vs")
    assert k2._collection.count() == len(k2.documents)


def test_crewai_objects_build_with_installed_version(monkeypatch):
    pytest.importorskip("crewai")
    import crewai_agents as ca
    monkeypatch.setenv("GROQ_API_KEY", "test-key")
    c = ca.CrewAILegalCoordinator(kb)
    llm = c._get_llm()
    assert llm.model.endswith(ca.GROQ_MODEL) and "groq.com" in str(getattr(llm, "base_url", ""))
    from crewai import Agent, Task, Crew, Process
    a = Agent(role="r", goal="g", backstory="b", llm=llm, allow_delegation=False, verbose=False)
    t = Task(description="d", expected_output="e", agent=a)
    Crew(agents=[a], tasks=[t], process=Process.sequential, verbose=False, memory=False)
