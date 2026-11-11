import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  RefreshCw, 
  CornerDownLeft, 
  ShieldAlert, 
  BookOpen, 
  Scale
} from 'lucide-react';

export default function LegalChat({ 
  contract, 
  initialPrompt, 
  onNavigateToAudit 
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      timestamp: 'Just now',
      text: `Hello! I am your **Legal Copilot AI**. I have fully parsed and indexed **${contract.title}** (${contract.clauses.length} clauses analyzed). \n\nYou can ask me to evaluate financial liability, explain obscure legal jargon in plain English, spot unfair unilateral terms, or draft counter-proposal redlines for your negotiation with opposing counsel.`,
      citations: [contract.clauses[0]?.section, contract.clauses[2]?.section].filter(Boolean)
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  // If passed an initialPrompt from ContractReview
  useEffect(() => {
    if (initialPrompt) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    {
      title: "Worst Liability Traps",
      prompt: "What are the most dangerous liability and indemnification risks in this contract?",
    },
    {
      title: "Check AI & Data Ownership",
      prompt: "Does this agreement allow the vendor to train AI models on our proprietary customer data?",
    },
    {
      title: "Email to Opposing Counsel",
      prompt: "Draft an assertive yet professional email to opposing counsel negotiating Section 8.1 liability cap and Section 3.2 auto-renewal.",
    },
    {
      title: "Executive CEO Summary",
      prompt: "Provide a 3-bullet plain English executive summary for our CEO before signing.",
    },
    {
      title: "Auto-Renewal & Cancellation",
      prompt: "How and when can we terminate this agreement without incurring multi-year penalties?",
    }
  ];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateAIResponse = (userQuestion) => {
    const q = userQuestion.toLowerCase();
    
    // Customized answers based on current contract and keywords
    if (q.includes('liability') || q.includes('indemnification') || q.includes('indemnity') || q.includes('worst')) {
      return {
        text: `### ⚖️ Liability & Indemnity Analysis for **${contract.title}**\n\nI have identified two **critical commercial vulnerabilities**:\n\n1. **Severe Asymmetric Liability Cap ([Section 8.1])**: \n   - Vendor caps their aggregate liability to merely **one (1) month of fees paid**.\n   - Critically, Vendor disclaims liability even for *Gross Negligence*, *Willful Misconduct*, and *Data Breaches*.\n   - **Market Standard**: Enterprise B2B SaaS liability caps typically range between **12 months trailing fees**, with an uncapped exception (or a 2x-3x 'Super Cap') for confidential data breaches and IP infringement.\n\n2. **One-Way Unilateral Indemnification ([Section 9.3])**: \n   - Client is required to indemnify Vendor unconditionally, even if the harm arises from Vendor's own software code defects.\n   - Reciprocal IP infringement indemnity from Vendor is completely missing.\n\n**Action Plan**: Reject Section 8.1 immediately and propose our standardized 12-month mutual liability cap with standard carve-outs.`,
        citations: ['Section 8.1', 'Section 9.3']
      };
    } else if (q.includes('ai') || q.includes('training') || q.includes('data') || q.includes('ownership')) {
      return {
        text: `### 🤖 AI Data Ingestion & Privacy Review\n\n**Alarming Discovery in [Section 11.2] (Intellectual Property & Customer Data)**:\n\n- The current language grants the Vendor a **perpetual, irrevocable, worldwide, royalty-free license** to ingest, train artificial intelligence algorithms, and commercially monetize your confidential Customer Data.\n- **Risk**: This is a direct risk of trade secret leakage and violates EU GDPR / CCPA data residency principles if personal identifiable information (PII) is uploaded.\n\n**Recommended Redline Clause**:\n> *"Vendor shall not use, store, or process Customer Data to train, fine-tune, or validate any machine learning, generative AI, or algorithmic models without Client's express prior written authorization."*`,
        citations: ['Section 11.2']
      };
    } else if (q.includes('email') || q.includes('negotiat') || q.includes('opposing counsel') || q.includes('draft email')) {
      return {
        text: `### ✉️ Drafted Email to Opposing Counsel\n\n**Subject**: *Review Comments & Proposed Revisions - ${contract.title}*\n\nDear Counsel,\n\nThank you for sharing the draft agreement. Our legal team has completed our preliminary review. Overall, we are eager to move forward with the partnership; however, there are a few standard commercial points that require alignment before execution:\n\n1. **Section 8.1 (Limitation of Liability)**: Capping Vendor's liability to one month of fees while excluding gross negligence and data breach does not conform to enterprise commercial standards. We propose a mutual 12-month trailing fee cap with customary carve-outs.\n2. **Section 3.2 (Renewal & Cancellation)**: The 36-month automatic renewal and certified mail requirement are commercially restrictive. We request a standard 12-month renewal term with a 30-day email non-renewal notice.\n3. **Section 11.2 (Customer Data)**: Our corporate governance policy strictly prohibits third-party AI training on our proprietary business data. We have inserted our standard data protection carve-out.\n\nAttached is our redlined draft with tracked changes. Please let us know if you have availability for a brief 15-minute call this Thursday to finalize.\n\nBest regards,\n[Your Name]  \n*Office of the General Counsel*`,
        citations: ['Section 8.1', 'Section 3.2', 'Section 11.2']
      };
    } else if (q.includes('ceo') || q.includes('summary') || q.includes('plain english')) {
      return {
        text: `### 📋 Executive Summary (For CEO / Board)\n\n**Contract**: ${contract.title}  \n**Overall Risk Grade**: **${contract.riskLevel} (${contract.riskScore}/100)**\n\nHere are the 3 essential takeaways you need to know before signing:\n\n1. **Financial Lock-In Danger**: If you forget to send a certified letter 90 days before expiration, you are legally locked into **3 additional years of fees** automatically ([Section 3.2]).\n2. **Zero Protection for Data Breaches**: If the vendor suffers a cybersecurity incident and exposes all company data, your maximum legal recovery is capped at just **1 month of fees** ([Section 8.1]).\n3. **Data Exploitation**: The vendor claims ownership rights to use your company's private files and proprietary data to train their internal AI systems ([Section 11.2]).\n\n**Recommendation**: **DO NOT SIGN IN PRESENT FORM.** Require vendor to accept the 3 redline modifications proposed in the Audit tab.`,
        citations: ['Section 3.2', 'Section 8.1', 'Section 11.2']
      };
    } else if (q.includes('renew') || q.includes('terminat') || q.includes('cancel')) {
      return {
        text: `### ⏳ Termination & Renewal Terms ([Section 3.2])\n\n- **Automatic Renewal**: Renews automatically for **36 months (3 full years)**.\n- **Cancellation Window**: Notice must be given at least **90 days prior** to expiration.\n- **Notice Formalities Trap**: The clause mandates notice **via certified postal mail only**. Email, portal messages, or phone calls will be deemed legally ineffective.\n\n**Mitigation**: Redline to 12 months renewal, 30 days notice via standard electronic notice (email).`,
        citations: ['Section 3.2']
      };
    } else {
      return {
        text: `### ⚖️ Legal Analysis on: "${userQuestion}"\n\nBased on Delaware Commercial Jurisprudence and the terms of **${contract.title}**:\n\n- The agreement establishes asymmetric rights prioritizing the vendor over client protection.\n- Pertinent clauses include **${contract.clauses[0]?.section}** (${contract.clauses[0]?.title}) and **${contract.clauses[2]?.section}** (${contract.clauses[2]?.title}).\n- From a risk mitigation standpoint, we advise aligning this term with standard mutual indemnity covenants and 12-month trailing liability limits.\n\nWould you like me to draft a specific counter-clause or email markup for this section?`,
        citations: [contract.clauses[0]?.section, contract.clauses[2]?.section].filter(Boolean)
      };
    }
  };

  const handleSendPrompt = (promptText) => {
    if (!promptText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: promptText,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = generateAIResponse(promptText);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: aiReply.text,
          citations: aiReply.citations,
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-190px)] min-h-[600px]">
      
      {/* Left Chat Window (8 cols) */}
      <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">JurisAI Legal Copilot</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] text-emerald-400 font-mono">Grounded on Document</span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-sm">
                Context: <span className="text-indigo-300 font-medium">{contract.title}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1 transition"
              title="Reset conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-semibold ${
                  isAi 
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' 
                    : 'bg-slate-700 text-slate-200'
                }`}>
                  {isAi ? <Bot className="w-4 h-4 text-indigo-400" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                  isAi 
                    ? 'bg-slate-950/80 border border-slate-800 text-slate-200' 
                    : 'bg-indigo-600 text-white'
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-1.5 text-[10px] opacity-60">
                    <span className="font-semibold">{isAi ? 'Legal Copilot AI' : 'You (In-House Counsel)'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="prose prose-invert prose-xs max-w-none space-y-2 whitespace-pre-wrap">
                    {msg.text}
                  </div>

                  {/* Citations if AI */}
                  {isAi && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-400" /> Grounded References:
                      </span>
                      {msg.citations.map((cite, i) => (
                        <button
                          key={i}
                          onClick={() => onNavigateToAudit && onNavigateToAudit()}
                          className="px-2 py-0.5 rounded bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/60 text-[10px] text-indigo-300 font-mono transition"
                        >
                          {cite}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Copy Button */}
                  {isAi && (
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === msg.id ? 'Copied' : 'Copy Response'}
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Analyzing contract clauses & statutes...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(input);
            }}
            className="flex items-center gap-2"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about liabilities, auto-renewal, GDPR risk, or request redline text..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl shadow-md transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Right Quick Intelligence Panel (4 cols) */}
      <div className="lg:col-span-4 space-y-4 flex flex-col">
        
        {/* Preset Smart Questions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Recommended Legal Inquiries</span>
          </div>
          <p className="text-[11px] text-slate-400">
            One-click deep legal queries tailored to detect traps and liabilities in {contract.title}.
          </p>

          <div className="space-y-2 pt-1">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(qp.prompt)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-950 transition group flex items-start gap-2.5"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5 group-hover:text-indigo-300" />
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    {qp.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {qp.prompt}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contract Health Quick Insight */}
        <div className="bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-900/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300">Active Grounding Contract</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
              Score: {contract.riskScore}/100
            </span>
          </div>

          <div className="text-xs text-slate-300">
            <strong>{contract.title}</strong>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1">
            <div>• Indexed Clauses: <span className="text-slate-200 font-mono">{contract.clauses.length}</span></div>
            <div>• Governing Law: <span className="text-slate-200">{contract.governingLaw}</span></div>
            <div>• Critical Red Flags: <span className="text-rose-400 font-bold">{contract.clauses.filter(c => c.risk === 'critical').length}</span></div>
          </div>

          <button
            onClick={() => onNavigateToAudit && onNavigateToAudit()}
            className="w-full py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 flex items-center justify-center gap-1.5 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            Switch to Full Document Audit
          </button>
        </div>

      </div>

    </div>
  );
}

