import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  Globe, 
  Sparkles, 
  Scale, 
  BookOpen, 
  ShieldCheck, 
  Mic, 
  MicOff,
  ExternalLink,
  Search,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { OFFICIAL_SOURCES, SAMPLE_BANGLADESH_QUESTIONS, BANGLADESH_CORE_STATUTES } from '../data/bangladeshLaws';

export default function WhizzyHomeView({ 
  onSendMessage, 
  selectedModel, 
  setSelectedModel 
}) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'bn-BD'; // Default to Bangla, also understands mixed English

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

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 relative overflow-y-auto select-none bg-radial from-emerald-50/30 via-white to-white">
      
      {/* Decorative subtle header badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Bangladesh Legal RAG Copilot</span>
        <span className="text-[10px] bg-white px-1.5 py-0.5 rounded-full border border-emerald-200 font-mono text-emerald-700">
          5-Agent Pipeline
        </span>
      </div>

      {/* Main Title & Bilingual Tagline */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-serif">
          Bangladesh Legal Copilot
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
          বাংলাদেশের সংবিধান, আইন ও সংবিধিবদ্ধ বিধিবিধান অনুসন্ধানের নির্ভুল এআই সহায়ক
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-slate-500 pt-1">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero Hallucination
          </span>
          <span>•</span>
          <a 
            href={OFFICIAL_SOURCES.portalUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-emerald-700 hover:underline flex items-center gap-0.5"
          >
            bdlaws.minlaw.gov.bd
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <span>•</span>
          <a 
            href={OFFICIAL_SOURCES.masterPdfPath} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-emerald-700 hover:underline flex items-center gap-0.5"
          >
            Master Legal PDF (429p)
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Main Chat Input Box */}
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200/90 shadow-lg hover:border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all p-3 sm:p-4 mb-8">
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="আপনার আইনি প্রশ্ন বাংলায় বা ইংরেজিতে লিখুন... (যেমন: চেক ডিজঅনার নোটিশ, জিডি ও এফআইআরের পার্থক্য, আয়কর রিটার্ন বা উত্তরাধিকার বণ্টন বিধান)"
          className="w-full resize-none border-0 bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none select-text leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
          
          {/* Left action: Voice Dictation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleVoiceListening}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition ${
                isListening 
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={isListening ? "Listening... Click to stop" : "Voice dictation (Bangla & English)"}
            >
              {isListening ? <MicOff className="w-4 h-4 text-rose-600" /> : <Mic className="w-4 h-4 text-slate-500" />}
              <span className="text-xs hidden sm:inline">{isListening ? 'Listening...' : 'ভয়েস টাইপ'}</span>
            </button>

            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              Enter to send, Shift+Enter for new line
            </span>
          </div>

          {/* Right action: Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition shadow-xs"
            title="Send query to Bangladesh Legal Copilot"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Suggested Legal Inquiries (Pills) */}
      <div className="w-full max-w-3xl space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>নমুনা আইনি গবেষণা ও অনুসন্ধান (Suggested Research Prompts)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_BANGLADESH_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(item.query)}
              className="text-left p-3 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/40 hover:shadow-2xs transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {item.categoryBn}
                </span>
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-700 transition">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-slate-700 group-hover:text-slate-900 leading-snug font-medium line-clamp-2">
                {item.query}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Authorized Knowledge Base Sources Footer */}
      <div className="w-full max-w-3xl mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Grounded in Official Bangladesh Legal Sources (BD Laws & Master Legal PDF)</span>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href={OFFICIAL_SOURCES.portalUrl}
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-emerald-700 hover:underline font-semibold"
          >
            bdlaws.minlaw.gov.bd
          </a>
          <span>•</span>
          <a 
            href={OFFICIAL_SOURCES.masterPdfPath}
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-emerald-700 hover:underline font-semibold"
          >
            Allfile.pdf
          </a>
        </div>
      </div>

    </div>
  );
}
