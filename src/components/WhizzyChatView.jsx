import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  ArrowUp, 
  Globe, 
  Sparkles, 
  PlusSquare, 
  ChevronDown, 
  Scan, 
  Copy, 
  Check, 
  Volume2, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCw, 
  Square,
  Mic,
  MicOff,
  Key,
  X
} from 'lucide-react';
import { streamAIResponse } from '../services/aiService';

// Helper component to render rich markdown in chat messages and real-time streaming
function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="space-y-1.5 my-2 pl-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-teal-600 font-bold mt-0.5 select-none">•</span>
              <span className="flex-1 text-slate-800">{formatInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const formatInline = (str) => {
    if (!str) return '';
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    const parts = str.split(regex);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-700">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-teal-800 text-xs font-mono">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Callout blockquote > ...
    if (trimmed.startsWith('>')) {
      flushList();
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <blockquote key={`quote-${i}`} className="border-l-3 border-teal-600 pl-3.5 py-1.5 my-3 text-slate-700 italic bg-teal-50/40 rounded-r-lg">
          {formatInline(quoteText)}
        </blockquote>
      );
      continue;
    }

    // Bullet point • or - or *
    if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletText = trimmed.replace(/^[•\-\*]\s*/, '');
      currentList.push(bulletText);
      continue;
    }

    // Code block ```
    if (trimmed.startsWith('```')) {
      flushList();
      let codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={`code-${i}`} className="p-3 my-2.5 bg-slate-900 text-teal-300 font-mono text-xs rounded-xl overflow-x-auto shadow-inner">
          {codeLines.join('\n')}
        </pre>
      );
      continue;
    }

    // Regular text paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="text-slate-800 leading-relaxed my-1">
        {formatInline(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1">{elements}</div>;
}

export default function WhizzyChatView({ 
  contract, 
  session,
  onSendMessage,
  onApplyRedline,
  onToggleInspector,
  isInspectorOpen,
  selectedModel = 'Legal-Gemini 2.5 Pro',
  setSelectedModel
}) {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [directChatMode, setDirectChatMode] = useState('Direct Chat');
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  // Real-time streaming state
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [thinkingStep, setThinkingStep] = useState('');
  const abortControllerRef = useRef(null);
  const lastProcessedUserMsgIdRef = useRef(null);

  // Real-time voice recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Live API Key state
  const [apiKey, setApiKey] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('legal_copilot_gemini_key') : null;
    if (stored && stored.trim().length > 15) return stored.trim();
    return (import.meta.env?.VITE_GEMINI_API_KEY || '').trim();
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const messages = session?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, isGenerating]);

  // Speech Recognition setup
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

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

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

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReadAloud = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`>]/g, ''));
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFeedback = (msgId, type) => {
    setFeedback(prev => ({ ...prev, [msgId]: type }));
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  // Real-time streaming engine (streams word-by-word or directly via Gemini SSE)
  const startRealTimeStream = async (queryText, isExistingUserMsg = false) => {
    const q = queryText.trim();
    if (!q || isGenerating) return;

    setInput('');
    setIsGenerating(true);
    setStreamingText('');
    setThinkingStep('Analyzing contract clauses & statutory precedents...');

    if (!isExistingUserMsg) {
      const userMsg = {
        id: Date.now().toString(),
        sender: 'user',
        timestamp: 'Today',
        text: q
      };
      onSendMessage(q, null, userMsg);
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Progressive thinking indicators
    const t1 = setTimeout(() => {
      setThinkingStep('Searching Delaware UCC § 2-719 & commercial case law...');
    }, 450);

    const t2 = setTimeout(() => {
      setThinkingStep('Synthesizing market-standard redlines...');
    }, 950);

    const t3 = setTimeout(() => {
      setThinkingStep('');
    }, 1450);

    let accumulatedText = '';
    try {
      const generator = streamAIResponse({
        query: q,
        contract,
        apiKey: (apiKey || import.meta.env?.VITE_GEMINI_API_KEY || '').trim(),
        model: 'gemini-flash-lite-latest',
        signal: controller.signal
      });

      for await (const chunk of generator) {
        accumulatedText += chunk;
        setStreamingText(accumulatedText);
      }

      // Finish streaming, commit AI response to session
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        timestamp: 'Today',
        text: accumulatedText
      };
      onSendMessage(null, aiMsg, null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("Stream error:", err);
      }
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setIsGenerating(false);
      setStreamingText('');
      setThinkingStep('');
    }
  };

  // Auto-stream if session has a trailing unresponded user message (e.g. sent from Home view)
  useEffect(() => {
    if (!session || !session.messages || session.messages.length === 0) return;
    const lastMsg = session.messages[session.messages.length - 1];

    if (lastMsg.sender === 'user' && lastProcessedUserMsgIdRef.current !== lastMsg.id && !isGenerating) {
      lastProcessedUserMsgIdRef.current = lastMsg.id;
      startRealTimeStream(lastMsg.text, true);
    }
  }, [session?.id, session?.messages?.length]);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('legal_copilot_gemini_key', key);
    setIsApiKeyModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden select-text">
      
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

      {/* Main Conversation Scroll View */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 z-10">
        <div className="max-w-2xl mx-auto space-y-6 pb-48">
          
          {/* Centered Date Pill ("TODAY") */}
          <div className="flex justify-center">
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase select-none">
              TODAY
            </span>
          </div>

          {/* Messages Feed */}
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-[#f1f3f5] text-slate-900 text-sm font-normal px-4 py-2 rounded-2xl max-w-lg shadow-2xs">
                    {msg.text}
                  </div>
                </div>
              );
            }

            // AI Response
            const content = msg.text || (msg.leadText ? `${msg.leadText}\n\n${msg.heading || ''}\n${msg.conclusion || ''}` : '');

            return (
              <div key={msg.id} className="space-y-4 text-slate-800 text-sm leading-relaxed pt-1">
                
                {/* Only show web sources pill if real web sources were actually used */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-white shadow-2xs text-xs text-slate-700">
                      <Globe className="w-3.5 h-3.5 text-teal-600" />
                      <span className="font-medium text-slate-600">{msg.sources.length} sources</span>
                    </div>
                    {msg.sources.map((src, idx) => (
                      <a 
                        key={idx} 
                        href={src.url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                      >
                        {src.title || src.domain || 'Source'}
                      </a>
                    ))}
                  </div>
                )}

                {/* Rendered content */}
                <div className="text-slate-800 text-sm leading-relaxed font-normal">
                  <FormattedMessage text={content} />
                </div>

                {/* Action Toolbar Below Message */}
                <div className="flex items-center gap-3 pt-2 text-slate-400 select-none">
                  <button 
                    onClick={() => handleCopy(content, msg.id)}
                    className="hover:text-slate-600 transition p-1"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button 
                    onClick={() => handleReadAloud(content)}
                    className="hover:text-slate-600 transition p-1"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => handleFeedback(msg.id, 'up')}
                    className={`hover:text-slate-600 transition p-1 ${feedback[msg.id] === 'up' ? 'text-teal-600' : ''}`}
                    title="Good response"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => handleFeedback(msg.id, 'down')}
                    className={`hover:text-slate-600 transition p-1 ${feedback[msg.id] === 'down' ? 'text-rose-600' : ''}`}
                    title="Bad response"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => {
                      const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
                      startRealTimeStream(lastUserMsg?.text || 'Analyze contract', false);
                    }}
                    className="hover:text-slate-600 transition p-1"
                    title="Regenerate"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}

          {/* Real-time Streaming Response Live on Canvas */}
          {isGenerating && (
            <div className="space-y-4 text-slate-800 text-sm leading-relaxed pt-1 animate-in fade-in duration-150">
              {thinkingStep && (
                <div className="text-xs text-slate-500 italic flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                  <span>{thinkingStep}</span>
                </div>
              )}

              {streamingText && (
                <div className="text-slate-800 text-sm leading-relaxed font-normal">
                  <FormattedMessage text={streamingText} />
                  <span className="inline-block w-2 h-4 ml-1 bg-teal-600 animate-pulse align-middle rounded-xs" />
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Bottom Prompt Dock */}
      <div className="absolute bottom-4 left-0 right-0 px-4 z-20 pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          
          <div className="w-full whizzy-input-card rounded-[22px] p-3 transition-all bg-white shadow-xl border border-slate-200">
            {/* Input Line */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  startRealTimeStream(input, false);
                }
              }}
              placeholder={isListening ? "Listening to your voice..." : "What do you want to know..."}
              className={`w-full bg-transparent border-0 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none px-2 py-1 ${
                isListening ? 'animate-pulse text-teal-700 font-medium' : ''
              }`}
            />

            {/* Bottom Row inside card */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button 
                  type="button"
                  className="w-8 h-8 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white flex items-center justify-center text-slate-600 transition shadow-2xs"
                  title="Attach file"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => startRealTimeStream(`Analyze ${contract.title} for systemic commercial vulnerabilities.`, false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Think Bigger</span>
                </button>

                <button
                  type="button"
                  onClick={() => startRealTimeStream(`Deep statutory audit on ${contract.governingLaw} precedents.`, false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5 text-teal-600" />
                  <span>Deep Research</span>
                </button>
              </div>

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

                {/* Send or Stop Generation Button */}
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={handleStopGeneration}
                    className="w-8 h-8 rounded-full bg-slate-900 hover:bg-black text-white flex items-center justify-center transition shadow-xs"
                    title="Stop Generating"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => startRealTimeStream(input, false)}
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-full bg-teal-600 hover:bg-teal-700 disabled:opacity-30 text-white flex items-center justify-center transition shadow-xs"
                    title="Send message"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sub-bar below card */}
          <div className="w-full flex items-center justify-between px-2 pt-2 text-xs text-slate-500">
            <div className="relative">
              <button
                onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                className="flex items-center gap-1.5 text-slate-700 font-medium hover:text-slate-900 transition"
              >
                <div className="flex items-center gap-0.5 text-teal-600">
                  <span className="w-0.5 h-2.5 bg-current rounded-full" />
                  <span className="w-0.5 h-4 bg-current rounded-full" />
                  <span className="w-0.5 h-2 bg-current rounded-full" />
                </div>
                <span>{directChatMode}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isModeDropdownOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-30">
                  {['Direct Chat', 'Contract Deep Audit', 'Clause Redlining'].map((m) => (
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

            <div className="relative flex items-center gap-2">
              <span className="text-slate-400">Models</span>
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-1.5 text-slate-700 font-semibold hover:text-slate-900 transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{selectedModel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isModelDropdownOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30">
                  {['Legal-Gemini 2.5 Pro', 'GPT-4o', 'Claude 3.5 Sonnet'].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedModel?.(m);
                        setIsModelDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition"
                    >
                      {m}
                    </button>
                  ))}
                  <div className="pt-1 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        setIsModelDropdownOpen(false);
                        setIsApiKeyModalOpen(true);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-emerald-700 font-medium hover:bg-emerald-50 rounded-lg transition flex items-center gap-1.5"
                    >
                      <Key className="w-3 h-3 text-emerald-600" />
                      <span>{apiKey ? 'Live Gemini Key Connected ✓' : 'Add Gemini API Key'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Optional Live API Key Settings Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-teal-600" />
                <span className="font-bold text-sm text-slate-900">Connect Live Gemini API</span>
              </div>
              <button 
                onClick={() => setIsApiKeyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Legal Copilot includes a real-time streaming legal reasoning engine out of the box. You can optionally paste your free Google Gemini API key to stream directly from live Google AI servers!
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Google Gemini API Key</label>
              <input 
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveApiKey(apiKey)}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
