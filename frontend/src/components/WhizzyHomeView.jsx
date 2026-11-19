import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  ArrowUp, 
  Globe, 
  Sparkles, 
  Atom, 
  Compass, 
  PlusSquare, 
  SlidersHorizontal,
  ChevronDown,
  Volume2,
  Scan,
  Radio,
  Scale,
  Mic,
  MicOff
} from 'lucide-react';

export default function WhizzyHomeView({ 
  onSendMessage, 
  currentContract, 
  selectedModel, 
  setSelectedModel 
}) {
  const [input, setInput] = useState('');
  const [directChatMode, setDirectChatMode] = useState('Direct Chat');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);

  // Real-time voice dictation
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickPills = [
    {
      id: 'ni-138',
      label: 'NI Act § 138 (Check Bounce)',
      icon: <Scale className="w-3.5 h-3.5 text-[#006a4e]" />,
      query: `Draft a statutory legal notice under Section 138 of the Negotiable Instruments Act 1881 for a dishonoured cheque of BDT 1,500,000/- with 'Insufficient Funds'.`
    },
    {
      id: 'crpc-bail',
      label: 'CrPC § 497 Bail',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#006a4e]" />,
      query: `What are the judicial grounds for securing bail in non-bailable offenses under CrPC Section 497 in Bangladesh? Cite 50 DLR (AD) 161.`
    },
    {
      id: 'penal-fraud',
      label: 'Penal Code § 420/406',
      icon: <Globe className="w-3.5 h-3.5 text-[#006a4e]" />,
      query: `Analyze the legal difference between breach of commercial contract versus criminal cheating under Penal Code Section 420 and criminal breach of trust under Section 406.`
    },
    {
      id: 'labour-termination',
      label: 'Labour Act § 26',
      icon: <PlusSquare className="w-3.5 h-3.5 text-[#006a4e]" />,
      query: `Calculate mandatory severance benefits, gratuity, and notice pay for a permanent officer terminated under Section 26 of Bangladesh Labour Act 2006.`
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 relative select-none min-h-[580px]">
      
      {/* Stepped Translucent Cyan Pillars at Bottom (Whizzy Signature) */}
      <div className="whizzy-pillars">
        <div className="whizzy-pillar h-16 opacity-30" />
        <div className="whizzy-pillar h-24 opacity-50" />
        <div className="whizzy-pillar h-36 opacity-70" />
        <div className="whizzy-pillar h-48 opacity-85" />
        <div className="whizzy-pillar h-56 opacity-95" />
        <div className="whizzy-pillar h-48 opacity-85" />
        <div className="whizzy-pillar h-36 opacity-70" />
        <div className="whizzy-pillar h-24 opacity-50" />
        <div className="whizzy-pillar h-16 opacity-30" />
      </div>

      {/* Main Center Content */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center -mt-12 z-10">
        
        {/* Sovereign Legal Badge & Editorial Headline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-[#006a4e] font-semibold mb-3 shadow-2xs">
          <Scale className="w-3.5 h-3.5 text-[#006a4e]" />
          <span>Supreme Court & Bangladesh Statutory Intelligence</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-[44px] font-bold text-slate-900 tracking-tight text-center mb-3">
          AI Legal Counsel for Bangladesh Jurisprudence
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 text-center max-w-lg mb-8 leading-relaxed">
          Cross-reference 500+ official Bangladesh Acts, draft statutory notices, and verify court jurisdiction in seconds.
        </p>

        {/* Central Search / Prompt Card */}
        <div className="w-full whizzy-input-card rounded-[22px] p-4 transition-all">
          
          {/* Text Area */}
          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening to your voice..." : "Ask any query on Bangladesh law, Penal Code, CrPC, NI Act, or contracts..."}
            className={`w-full bg-transparent border-0 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none resize-none px-1 py-1 ${
              isListening ? 'animate-pulse text-[#006a4e] font-medium' : ''
            }`}
          />

          {/* Action Row Inside Card */}
          <div className="flex items-center justify-between pt-2">
            
            {/* Left Tools & Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Paperclip Button */}
              <button 
                type="button"
                className="w-8 h-8 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white flex items-center justify-center text-slate-600 transition shadow-2xs"
                title="Attach Document or Contract"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>

              {quickPills.slice(0, 3).map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setInput(pill.query)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/90 hover:border-[#006a4e] bg-white hover:bg-emerald-50/50 text-slate-700 hover:text-[#006a4e] text-xs font-medium transition shadow-2xs"
                >
                  {pill.icon}
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Voice Dictation Button */}
              <button 
                type="button"
                onClick={toggleVoiceListening}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition shadow-2xs ${
                  isListening 
                    ? 'border-rose-400 bg-rose-50 text-rose-600 animate-bounce' 
                    : 'border-slate-200/90 hover:border-[#006a4e] bg-white text-slate-600'
                }`}
                title={isListening ? "Stop listening" : "Real-time Voice Dictation"}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              {/* Sovereign Green Up-Arrow Send Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full bg-[#006a4e] hover:bg-[#00543e] disabled:opacity-30 text-white flex items-center justify-center transition shadow-xs"
                title="Send query"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

          </div>

        </div>

        {/* Sub-bar Below Card */}
        <div className="w-full flex items-center justify-between px-2 pt-3 text-xs text-slate-500">
          
          {/* Left: Direct Chat Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
              className="flex items-center gap-1.5 text-slate-700 font-medium hover:text-slate-900 transition"
            >
              {/* Waveform icon */}
              <div className="flex items-center gap-0.5 text-teal-600">
                <span className="w-0.5 h-2.5 bg-current rounded-full animate-pulse" />
                <span className="w-0.5 h-4 bg-current rounded-full" />
                <span className="w-0.5 h-2 bg-current rounded-full" />
                <span className="w-0.5 h-3 bg-current rounded-full" />
              </div>
              <span>{directChatMode}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isModeDropdownOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-30">
                {['Direct Chat', 'Contract Deep Audit', 'Clause Redlining', 'Statutory Cross-Check'].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setDirectChatMode(m);
                      setIsModeDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition"
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Models Dropdown */}
          <div className="relative flex items-center gap-2">
            <span className="text-slate-400">Models</span>
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center gap-1.5 text-slate-700 font-semibold hover:text-slate-900 transition"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="FastAPI CrewAI + Groq RAG Engine Active"></span>
              <span>{selectedModel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute right-0 mt-2 top-full w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-30">
                {[
                  { name: 'groq-llama-3.3-70b', desc: 'FastAPI CrewAI Multi-Agent RAG' },
                  { name: 'Legal-Gemini 2.5 Pro', desc: 'Google Gemini Live Fallback' },
                  { name: 'Claude 3.5 Sonnet', desc: 'Anthropic reasoning model' },
                ].map((m) => (
                  <button
                    key={m.name}
                    onClick={() => {
                      setSelectedModel(m.name);
                      setIsModelDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="text-xs font-semibold text-slate-800">{m.name}</div>
                    <div className="text-[10px] text-slate-400">{m.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Quick Bangladesh Statutory & Contract Audit Chips */}
        <div className="w-full flex items-center justify-center gap-2 flex-wrap pt-6">
          {[
            { label: 'চেক ডিজঅনার (NI Act 138)', query: 'চেক ডিজঅনার হলে ধারা ১৩৮ অনুযায়ী কী আইনি পদক্ষেপ নিতে হবে?' },
            { label: 'জামিন আবেদন (CrPC 496/497)', query: 'জামিনের আবেদন করার নিয়ম ও জামিনযোগ্য/অজামিনযোগ্য অপরাধের শর্তাবলী কী?' },
            { label: 'GD vs FIR পার্থক্য', query: 'জিডি (General Diary) এবং এফআইআর (FIR) এর মধ্যে পার্থক্য কী এবং কখন কোনটি করতে হয়?' },
            { label: 'SaaS Liability Cap Audit', query: 'Analyze Enterprise Cloud SaaS Master Services Agreement Section 8.1 for Delaware UCC § 2-719 enforceability.' }
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(chip.query)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 transition shadow-2xs font-medium"
            >
              {chip.label}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}

