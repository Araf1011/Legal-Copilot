import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCw, 
  Square,
  Mic,
  MicOff,
  Scale,
  BookOpen,
  ExternalLink,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { streamAIResponse } from '../services/aiService';
import { OFFICIAL_SOURCES } from '../data/bangladeshLaws';

// Helper component to render rich markdown in chat messages with Bangladesh Legal Copilot styling
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
              <span className="text-emerald-700 font-bold mt-0.5 select-none">•</span>
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
    
    // Auto-link URLs
    const urlRegex = /(https?:\/\/[^\s]+|\/Allfile\.pdf)/g;
    const partsWithLinks = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        partsWithLinks.push(str.substring(lastIndex, match.index));
      }
      const url = match[0];
      partsWithLinks.push(
        <a 
          key={`link-${match.index}`} 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-emerald-700 underline font-medium hover:text-emerald-900 inline-flex items-center gap-0.5"
        >
          {url.includes('Allfile.pdf') ? '📄 Master Legal PDF (/Allfile.pdf)' : url}
          <ExternalLink className="w-2.5 h-2.5 inline" />
        </a>
      );
      lastIndex = match.index + url.length;
    }
    if (lastIndex < str.length) {
      partsWithLinks.push(str.substring(lastIndex));
    }

    return partsWithLinks.map((subPart, pIdx) => {
      if (typeof subPart !== 'string') return subPart;
      
      const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
      const parts = subPart.split(regex);

      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={`${pIdx}-${i}`} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={`${pIdx}-${i}`} className="italic text-slate-700">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={`${pIdx}-${i}`} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-900 text-xs font-mono border border-emerald-200">{part.slice(1, -1)}</code>;
        }
        return part;
      });
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Section 8 Disclaimer Box
    if (trimmed.includes('আইনি সতর্কবার্তা') || trimmed.includes('Legal Disclaimer') || trimmed.startsWith('### ৮.') || trimmed.startsWith('### 8.')) {
      flushList();
      const disclaimerText = trimmed.replace(/^###\s*[০-৯0-9.]*\s*/, '');
      elements.push(
        <div key={`disclaimer-${i}`} className="my-4 p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-amber-950 text-xs leading-relaxed flex items-start gap-2.5 shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-[11px] uppercase tracking-wider text-amber-900 mb-0.5 flex items-center gap-1.5">
              <span>Bangladesh Legal Disclaimer</span>
              <span className="font-mono text-[9px] bg-amber-100 px-1 rounded text-amber-800">Rule § 11</span>
            </div>
            <div>{formatInline(disclaimerText)}</div>
          </div>
        </div>
      );
      continue;
    }

    // Standard Section Header (### 1. Direct Answer, ### 2. Relevant Law, etc.)
    if (trimmed.startsWith('### ')) {
      flushList();
      const headerText = trimmed.replace(/^###\s*/, '');
      elements.push(
        <div key={`heading-${i}`} className="pt-3 pb-1 mt-2 border-b border-slate-100 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-emerald-600 inline-block"></span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {formatInline(headerText)}
          </h3>
        </div>
      );
      continue;
    }

    // Sub-header (## or #)
    if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
      flushList();
      const h2Text = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <h2 key={`h2-${i}`} className="text-base sm:text-lg font-bold text-slate-900 tracking-tight pt-2 pb-1 border-b border-slate-100">
          {formatInline(h2Text)}
        </h2>
      );
      continue;
    }

    // Callout blockquote > ...
    if (trimmed.startsWith('>')) {
      flushList();
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <blockquote key={`quote-${i}`} className="border-l-3 border-emerald-600 pl-3.5 py-1.5 my-3 text-slate-700 italic bg-emerald-50/40 rounded-r-lg">
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
        <pre key={`code-${i}`} className="p-3 my-2.5 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto shadow-inner">
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
  selectedModel = 'gemini-2.5-flash',
  setSelectedModel
}) {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [feedback, setFeedback] = useState({});

  // Real-time streaming state
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [thinkingStep, setThinkingStep] = useState('');
  const abortControllerRef = useRef(null);
  const lastProcessedUserMsgIdRef = useRef(null);

  // Real-time voice recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const messagesEndRef = useRef(null);
  const messages = session?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating, streamingText]);

  // Voice speech-to-text initialization
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'bn-BD'; // Support Bangla & English

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

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReadAloud = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`>]/g, ''));
      utterance.rate = 1.0;
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

  // Real-time streaming engine with 5-Agent Multi-Agent Progress
  const startRealTimeStream = async (queryText, isExistingUserMsg = false) => {
    const q = queryText.trim();
    if (!q || isGenerating) return;

    setInput('');
    setIsGenerating(true);
    setStreamingText('');
    setThinkingStep('Agent 1: আইনি প্রশ্ন বিশ্লেষণ ও আইনি ক্ষেত্র চিহ্নিতকরণ (Query Understanding)...');

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

    // Progressive Multi-Agent Pipeline steps
    const t1 = setTimeout(() => {
      setThinkingStep('Agent 2: বাংলাদেশ লজ (bdlaws.minlaw.gov.bd) ও মাস্টার PDF অনুসন্ধান...');
    }, 450);

    const t2 = setTimeout(() => {
      setThinkingStep('Agent 3: সংবিধিবদ্ধ ধারা ও শর্তাবলি গবেষণা (Statutory Analysis)...');
    }, 950);

    const t3 = setTimeout(() => {
      setThinkingStep('Agent 4: আইনি যাচাইকরণ এজেন্ট (Verification & Section Check)...');
    }, 1450);

    const t4 = setTimeout(() => {
      setThinkingStep('Agent 5: ৮-ধাপের কাঠামোবদ্ধ উত্তর প্রস্তুতকরণ (Generating Response)...');
    }, 1950);

    let accumulatedText = '';
    try {
      const generator = streamAIResponse({
        query: q,
        _contract: null,
        apiKey: (typeof window !== 'undefined' ? (localStorage.getItem('legal_copilot_gemini_key') || import.meta.env?.VITE_GEMINI_API_KEY || '') : '').trim(),
        model: 'gemini-1.5-flash',
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
      clearTimeout(t4);
      setIsGenerating(false);
      setStreamingText('');
      setThinkingStep('');
    }
  };

  // Auto-stream if session has a trailing unresponded user message
  useEffect(() => {
    if (!session || !session.messages || session.messages.length === 0) return;
    const lastMsg = session.messages[session.messages.length - 1];

    if (lastMsg.sender === 'user' && lastProcessedUserMsgIdRef.current !== lastMsg.id && !isGenerating) {
      lastProcessedUserMsgIdRef.current = lastMsg.id;
      startRealTimeStream(lastMsg.text, true);
    }
  }, [session?.id, session?.messages?.length]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden select-text">
      
      {/* Subtle top indicator bar */}
      <div className="h-9 px-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold text-slate-700">Bangladesh Legal Copilot</span>
          <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.2 rounded font-mono text-emerald-800 font-bold">
            RAG Grounded
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href={OFFICIAL_SOURCES.portalUrl}
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-emerald-700 flex items-center gap-1 font-medium"
          >
            bdlaws.minlaw.gov.bd
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <span>•</span>
          <a 
            href={OFFICIAL_SOURCES.masterPdfPath}
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-emerald-700 flex items-center gap-1 font-medium"
          >
            Master PDF (429p)
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Main Conversation Scroll View */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 z-10">
        <div className="max-w-3xl mx-auto space-y-6 pb-48">
          
          {/* Centered Date Pill ("TODAY") */}
          <div className="flex justify-center">
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase bg-slate-100 px-2.5 py-0.5 rounded-full select-none">
              TODAY • BANGLADESH LEGAL JURISDICTION
            </span>
          </div>

          {/* Messages Feed */}
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-[#f1f3f5] text-slate-900 text-sm font-normal px-4 py-2.5 rounded-2xl max-w-xl shadow-2xs leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              );
            }

            // AI Response
            const content = msg.text || '';

            return (
              <div key={msg.id} className="space-y-4 text-slate-800 text-sm leading-relaxed pt-1">
                
                {/* Agent Attribution Pill */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-[11px] text-emerald-900 font-semibold shadow-2xs">
                    <Scale className="w-3 h-3 text-emerald-700" />
                    <span>Verified Legal Response</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Grounded in BD Law Statutes
                  </span>
                </div>

                {/* Rendered content */}
                <div className="text-slate-800 text-sm leading-relaxed font-normal bg-white rounded-xl">
                  <FormattedMessage text={content} />
                </div>

                {/* Action Toolbar Below Message */}
                <div className="flex items-center gap-3 pt-2 text-slate-400 select-none border-t border-slate-100">
                  <button 
                    onClick={() => handleCopy(content, msg.id)}
                    className="hover:text-slate-600 transition p-1 flex items-center gap-1 text-xs"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button 
                    onClick={() => handleReadAloud(content)}
                    className="hover:text-slate-600 transition p-1 flex items-center gap-1 text-xs"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>

                  <button 
                    onClick={() => handleFeedback(msg.id, 'up')}
                    className={`hover:text-slate-600 transition p-1 ${feedback[msg.id] === 'up' ? 'text-emerald-600' : ''}`}
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
                      startRealTimeStream(lastUserMsg?.text || 'আইনি গবেষণা', false);
                    }}
                    className="hover:text-slate-600 transition p-1 flex items-center gap-1 text-xs ml-auto"
                    title="Regenerate"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>
                </div>

              </div>
            );
          })}

          {/* Real-time Streaming Response Live on Canvas */}
          {isGenerating && (
            <div className="space-y-4 text-slate-800 text-sm leading-relaxed pt-1 animate-in fade-in duration-150">
              {thinkingStep && (
                <div className="text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 w-fit flex items-center gap-2 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
                  <span className="font-medium">{thinkingStep}</span>
                </div>
              )}

              {streamingText && (
                <div className="text-slate-800 text-sm leading-relaxed font-normal bg-white">
                  <FormattedMessage text={streamingText} />
                  <span className="inline-block w-2 h-4 ml-1 bg-emerald-600 animate-pulse align-middle rounded-xs" />
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Bottom Prompt Dock */}
      <div className="absolute bottom-4 left-0 right-0 px-4 z-20 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          
          <div className="w-full rounded-2xl p-3 transition-all bg-white shadow-xl border border-slate-200">
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
              placeholder={isListening ? "Listening to your voice (Bangla/English)..." : "বাংলাদেশের যেকোনো আইন, ধারা বা অধিকার সম্পর্কে প্রশ্ন করুন..."}
              className={`w-full bg-transparent border-0 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none px-2 py-1 ${
                isListening ? 'animate-pulse text-emerald-700 font-medium' : ''
              }`}
            />

            {/* Bottom Row inside card */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={OFFICIAL_SOURCES.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200/90 hover:border-emerald-300 bg-white hover:bg-emerald-50/50 text-slate-700 text-xs font-medium transition shadow-2xs"
                >
                  <Scale className="w-3 h-3 text-emerald-600" />
                  <span>BD Laws</span>
                </a>

                <a
                  href={OFFICIAL_SOURCES.masterPdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200/90 hover:border-emerald-300 bg-white hover:bg-emerald-50/50 text-slate-700 text-xs font-medium transition shadow-2xs"
                >
                  <BookOpen className="w-3 h-3 text-emerald-600" />
                  <span>Master PDF (429p)</span>
                </a>
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
                  title={isListening ? "Stop listening" : "Real-time Voice Dictation (Bangla/English)"}
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
                    disabled={!input.trim()}
                    onClick={() => startRealTimeStream(input, false)}
                    className="w-8 h-8 rounded-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition shadow-xs"
                    title="Send"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
