import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  PanelLeft,
  Scale,
  Globe
} from 'lucide-react';
import { fetchHealth } from '../services/aiService';

function useBackendStatus() {
  const [status, setStatus] = useState({ state: 'checking', label: 'Checking backend…' });
  
  useEffect(() => {
    const controller = new AbortController();
    fetchHealth(controller.signal)
      .then((h) => {
        if (!h.llm_configured) {
          setStatus({ state: 'warn', label: 'FastAPI up • GROQ_API_KEY missing' });
        } else {
          setStatus({
            state: 'ok',
            label: `Backend Ready (${h.retrieval_mode === 'hybrid' ? 'Vector+BM25' : 'BM25'} • ${h.passages_indexed} passages)`
          });
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setStatus({ state: 'down', label: 'FastAPI Offline' });
        }
      });
    return () => controller.abort();
  }, []);

  return status;
}

const STATUS_STYLE = {
  ok: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  warn: 'border-amber-300 bg-amber-50 text-amber-800',
  down: 'border-rose-200 bg-rose-50 text-rose-700',
  checking: 'border-slate-200 bg-slate-50 text-slate-500'
};

export default function WhizzyTopBar({ 
  onOpenExport, 
  onOpenUpload, 
  isSidebarOpen, 
  onToggleSidebar,
  currentContract,
  contracts,
  setCurrentContract,
  onNavigateToLanding,
  lang,
  onToggleLang
}) {
  const backendStatus = useBackendStatus();
  const isEn = lang === 'en';

  return (
    <div className="h-13 px-4 sm:px-6 flex items-center justify-between select-none shrink-0 z-10 bg-white border-b border-slate-200/80">
      
      {/* Left: Sidebar toggle + Backend status */}
      <div className="flex items-center gap-3">
        {!isSidebarOpen && (
          <button 
            onClick={onToggleSidebar}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
            title="Open sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        {/* Backend Live Health Pill */}
        <span 
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${STATUS_STYLE[backendStatus.state]}`}
          title="Status of FastAPI Multi-Agent RAG Backend (CrewAI + Groq + ChromaDB/BM25)"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${
            backendStatus.state === 'ok' ? 'bg-emerald-500 animate-pulse' :
            backendStatus.state === 'warn' ? 'bg-amber-500' :
            backendStatus.state === 'down' ? 'bg-rose-400' : 'bg-slate-400'
          }`} />
          <span>{backendStatus.label}</span>
        </span>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">

        {/* Language Toggle বাং / EN */}
        <div className="flex items-center rounded-full bg-[#f0ece6] border border-stone-300/60 p-0.5 text-xs font-semibold select-none">
          <button
            onClick={() => onToggleLang('bn')}
            className={`px-2.5 py-1 rounded-full transition ${
              !isEn ? 'bg-white text-[#0d5c46] shadow-xs border border-stone-200/80' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="বাংলায় দেখুন"
          >
            বাং
          </button>
          <button
            onClick={() => onToggleLang('en')}
            className={`px-2.5 py-1 rounded-full transition ${
              isEn ? 'bg-white text-[#0d5c46] shadow-xs border border-stone-200/80' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Switch to English"
          >
            EN
          </button>
        </div>

        {/* Upload Contract */}
        <button 
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
        >
          <Upload className="w-3.5 h-3.5 text-[#006a4e]" />
          <span className="hidden sm:inline">{isEn ? 'Upload' : 'আপলোড'}</span>
        </button>

        {/* Export Audit Report */}
        <button 
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#006a4e] hover:bg-[#00543e] text-white text-xs font-semibold transition shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isEn ? 'Audit' : 'অডিট'}</span>
        </button>

      </div>

    </div>
  );
}
