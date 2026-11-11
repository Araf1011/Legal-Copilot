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
      id: 'think-bigger',
      label: 'Think Bigger',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4m-3.5-6.5-2.8 2.8m-7.4 7.4-2.8 2.8m0-13 2.8 2.8m7.4 7.4 2.8 2.8" />
        </svg>
      ),
      query: `Analyze ${currentContract.title} for systemic commercial vulnerabilities and disproportionate indemnification exposure.`
    },
    {
      id: 'deep-research',
      label: 'Deep Research',
      icon: <Globe className="w-3.5 h-3.5" />,
      query: `Run deep research on Delaware UCC Section 2-719 enforceability regarding the 1-month liability cap in ${currentContract.title}.`
    },
    {
      id: 'more',
      label: 'More',
      icon: <PlusSquare className="w-3.5 h-3.5" />,
      query: `Provide an executive 3-bullet summary of ${currentContract.title} for the CEO before signing.`
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
        
        {/* Editorial Serif Headline */}
        <h1 className="font-editorial text-4xl sm:text-[46px] font-bold text-slate-900 tracking-tight text-center mb-8">
          What can I do for you today?
        </h1>

        {/* Central Search / Prompt Card */}
        <div className="w-full whizzy-input-card rounded-[22px] p-4 transition-all">
          
          {/* Text Area */}
          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening to your voice..." : "What do you want to know..."}
            className={`w-full bg-transparent border-0 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none resize-none px-1 py-1 ${
              isListening ? 'animate-pulse text-teal-700 font-medium' : ''
            }`}
          />

          {/* Action Row Inside Card */}
          <div className="flex items-center justify-between pt-2">
            
            {/* Left Tools & Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Paperclip Button */}
              <button 
                type="button"
                className="w-8 h-8 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white flex items-center justify-center text-slate-600 transition shadow-2xs"
                title="Attach Document or Contract"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>

              {/* Think Bigger Pill */}
              <button
                type="button"
                onClick={() => setInput(quickPills[0].query)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
              >
                {quickPills[0].icon}
                <span>Think Bigger</span>
              </button>

              {/* Deep Research Pill */}
              <button
                type="button"
                onClick={() => setInput(quickPills[1].query)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
              >
                {quickPills[1].icon}
                <span>Deep Research</span>
              </button>

              {/* More Pill */}
              <button
                type="button"
                onClick={() => setInput(quickPills[2].query)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
              >
                {quickPills[2].icon}
                <span>More</span>
              </button>
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
                    : 'border-slate-200/90 hover:border-slate-300 bg-white text-slate-600'
                }`}
                title={isListening ? "Stop listening" : "Real-time Voice Dictation"}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              {/* Teal Up-Arrow Send Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full bg-teal-600 hover:bg-teal-700 disabled:opacity-30 text-white flex items-center justify-center transition shadow-xs"
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
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Google Gemini API Connected"></span>
              <span>{selectedModel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute right-0 mt-2 top-full w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-30">
                {[
                  { name: 'GPT-4o', desc: 'OpenAI Omnimodal flagship' },
                  { name: 'Legal-Gemini 2.5 Pro', desc: 'Fine-tuned on commercial contracts' },
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

      </div>

    </div>
  );
}

