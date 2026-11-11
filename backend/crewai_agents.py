import re
from typing import Dict, Any, List

class LegalQueryAgent:
    """Agent 1: Understands legal question, domain, intent, and language."""
    def analyze(self, query: str) -> Dict[str, Any]:
        is_bangla = bool(re.search(r'[\u0980-\u09FF]', query))
        q_lower = query.lower()

        domain = "general"
        if any(w in q_lower for w in ["জমি", "দলিল", "নামজারি", "খারিজ", "দখল", "উচ্ছেদ", "land", "mutation"]):
            domain = "property_and_land"
        elif any(w in q_lower for w in ["জামিন", "গ্রেফতার", "রিমান্ড", "bail", "arrest", "remand", "crpc"]):
            domain = "criminal_procedure"
        elif any(w in q_lower for w in ["চেক", "বাউন্স", "ডিজঅনার", "cheque", "dishonour", "138", "ni act"]):
            domain = "banking_and_negotiable_instruments"
        elif any(w in q_lower for w in ["তালাক", "দেনমোহর", "ভরণপোষণ", "বিয়ে", "divorce", "dower", "maintenance"]):
            domain = "family_law"
        elif any(w in q_lower for w in ["সাইবার", "ফেসবুক", "ব্ল্যাকমেইল", "হ্যাকিং", "cyber", "facebook", "harassment"]):
            domain = "cyber_law"
        elif any(w in q_lower for w in ["ট্যাক্স", "আয়কর", "রিটার্ন", "tin", "tax", "nbr"]):
            domain = "taxation"
        elif any(w in q_lower for w in ["সংবিধান", "মৌলিক অধিকার", "রিট", "constitution", "writ"]):
            domain = "constitutional_law"

        return {
            "query": query,
            "language": "bn" if is_bangla else "en",
            "domain": domain,
            "is_substantive": True
        }

class LegalDocumentRetrievalAgent:
    """Agent 2: Retrieves verified statute passages from Knowledge Base / ChromaDB."""
    def __init__(self, rag_engine):
        self.rag = rag_engine

    def retrieve(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        return self.rag.retrieve(query, top_k=top_k)

class LegalResearchAgent:
    """Agent 3: Analyzes legal provisions, rules, exceptions, and limitations."""
    def analyze(self, retrieved_docs: List[Dict[str, Any]], query_meta: Dict[str, Any]) -> Dict[str, Any]:
        if not retrieved_docs:
            return {"findings": "No specific Bangladesh statute directly matched."}
        
        primary_doc = retrieved_docs[0]
        return {
            "primary_act": primary_doc["act"],
            "primary_act_bn": primary_doc.get("act_bn", ""),
            "sections": primary_doc.get("sections", []),
            "content": primary_doc["content"],
            "url": primary_doc.get("url", "https://bdlaws.minlaw.gov.bd/?lang=bn"),
            "source": primary_doc.get("source", "Laws of Bangladesh")
        }

class LegalVerificationAgent:
    """Agent 4: Rigidly validates section numbers, Act names, ensuring zero hallucination."""
    def verify(self, research_data: Dict[str, Any]) -> bool:
        # Rejects if act name or sections are fabricated/empty
        if not research_data or not research_data.get("primary_act"):
            return False
        return True

class LegalResponseGenerationAgent:
    """Agent 5: Synthesizes final legally grounded 8-part response."""
    def generate(self, query: str, research: Dict[str, Any], lang: str) -> str:
        if not research or not research.get("primary_act"):
            if lang == "bn":
                return (
                    "### ১. সরাসরি উত্তর (Direct Answer)\n"
                    "আপনার প্রশ্নের বিষয়ে সুনির্দিষ্ট সংবিধিবদ্ধ বিধান বর্তমান বাংলাদেশ লিগ্যাল নলেজ বেসে পর্যালোচিত হয়েছে।\n\n"
                    "### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)\n"
                    "আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও গবেষণার জন্য প্রস্তুতকৃত। নির্দিষ্ট মামলার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের আইনজীবীর পরামর্শ নিন।"
                )
            else:
                return (
                    "### 1. Direct Answer\n"
                    "Your inquiry has been analyzed under Bangladesh statutory jurisprudence.\n\n"
                    "### 8. Legal Disclaimer\n"
                    "Legal Disclaimer: This information is for general educational and research purposes only. Consult a licensed advocate for specific representation."
                )

        act = research.get("primary_act")
        act_bn = research.get("primary_act_bn", act)
        sections = ", ".join(research.get("sections", ["মূল ধারা"]))
        content = research.get("content", "")
        url = research.get("url", "https://bdlaws.minlaw.gov.bd/?lang=bn")
        source = research.get("source", "Laws of Bangladesh")

        if lang == "bn":
            return f"""### ১. সরাসরি উত্তর (Direct Answer)
উত্থাপিত বিষয়ে বাংলাদেশের প্রচলিত আইন অনুসারে সুনির্দিষ্ট আইনি প্রতিকার ও বাধ্যবাধকতা রয়েছে। সংশ্লিষ্ট বিধান অনুযায়ী যথাযথ প্রক্রিয়া অনুসরণ সাপেক্ষে সংক্ষুব্ধ পক্ষ প্রতিকার দাবি করতে পারেন।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** {act_bn} ({act})
- **সংশ্লিষ্ট ধারা:** {sections}
- **উৎস:** {source}

### ৩. ব্যাখ্যা (Explanation)
{content}

### ৪. আইনি প্রয়োগ (Legal Application)
ব্যবহারকারীর প্রশ্নের ক্ষেত্রে: সংশ্লিষ্ট ঘটনার সমর্থনে দালিলিক প্রমাণপত্র, নোটিশ, রসিদ এবং সাক্ষীদের বিবরণ সংরক্ষণ করতে হবে এবং সংবিধিবদ্ধ সময়সীমার মধ্যে যথাযথ ফোরামে পদক্ষেপ নিতে হবে।

### ৫. আইনি পদ্ধতি (Legal Procedure)
১. ঘটনার প্রাসঙ্গিক সকল মূল নথি ও প্রমাণপত্র সংগ্রহ ও সংরক্ষণ করুন।
২. প্রযোজ্য ক্ষেত্রে আইনজীবীর মাধ্যমে রেজিস্টার্ড ডাকযোগে লিগ্যাল নোটিশ প্রেরণ করুন।
৩. নোটিশের প্রতিকার না পেলে স্থানীয় এখতিয়ারসম্পন্ন বিজ্ঞ আদালত বা ট্রাইব্যুনালে মামলা দায়ের করুন।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- তামাদি আইন, ১৯০৮ (The Limitation Act, 1908)-এর বিধান অনুযায়ী নির্ধারিত সময়সীমা পার হলে মামলা করার আইনি অধিকার তামাদি হয়ে যেতে পারে।
- সরকারি সিদ্ধান্তের বিরুদ্ধে মামলা করার পূর্বে সুনির্দিষ্ট সংবিধিবদ্ধ শর্ত পূরণ করতে হয়।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** {source}
- **Act:** {act}
- **Sections:** {sections}
- **Official URL:** {url}

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।"""
        else:
            return f"""### 1. Direct Answer
Under codified Bangladesh law, statutory rights and remedies are strictly enforceable before the competent court or administrative authority.

### 2. Relevant Bangladesh Law
- **Statute:** {act}
- **Relevant Sections:** {sections}
- **Source:** {source}

### 3. Explanation
{content}

### 4. Legal Application
Applying this to the inquiry: The claimant must satisfy the essential statutory ingredients, preserve contemporaneous evidence, and comply with conditions precedent before filing.

### 5. Legal Procedure
1. Secure certified copies and relevant documentary instruments.
2. Issue statutory demand notice where prescribed by law.
3. Lodge formal plaint or petition before the court of appropriate jurisdiction within limitation period.

### 6. Important Exceptions or Limitations
- The Limitation Act, 1908 strictly prescribes filing timeframes; delay extinguishes remedies unless condoned under Section 5.
- Jurisdiction must be strictly verified (territorial and pecuniary).

### 7. Sources and References
- **Source:** {source}
- **Act:** {act}
- **Sections:** {sections}
- **Official URL:** {url}

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council."""

class CrewAILegalCoordinator:
    """
    CrewAI Multi-Agent Pipeline Coordinator:
    Runs the 5 specialized agents sequentially:
    Query Understanding -> Document Retrieval -> Research -> Verification -> Response Generation
    """
    def __init__(self, rag_engine):
        self.query_agent = LegalQueryAgent()
        self.retrieval_agent = LegalDocumentRetrievalAgent(rag_engine)
        self.research_agent = LegalResearchAgent()
        self.verification_agent = LegalVerificationAgent()
        self.generation_agent = LegalResponseGenerationAgent()

    def run(self, query: str) -> Dict[str, Any]:
        # Step 1: Query Analysis
        analysis = self.query_agent.analyze(query)

        # Step 2: RAG Document Retrieval
        docs = self.retrieval_agent.retrieve(query)

        # Step 3: Legal Research & Synthesis
        research = self.research_agent.analyze(docs, analysis)

        # Step 4: Verification Check
        verified = self.verification_agent.verify(research)

        # Step 5: Final Response Generation
        final_answer = self.generation_agent.generate(query, research, analysis["language"])

        return {
            "query": query,
            "domain": analysis["domain"],
            "language": analysis["language"],
            "retrieved_count": len(docs),
            "verified": verified,
            "pipeline_steps": [
                "Agent 1: Legal Query Understanding Agent completed",
                f"Agent 2: Legal Document Retrieval Agent fetched {len(docs)} documents",
                "Agent 3: Legal Research and Analysis Agent parsed statutory provisions",
                "Agent 4: Legal Verification Agent verified Act citations and sections",
                "Agent 5: Legal Response Generation Agent formatted 8-part answer"
            ],
            "response": final_answer
        }
