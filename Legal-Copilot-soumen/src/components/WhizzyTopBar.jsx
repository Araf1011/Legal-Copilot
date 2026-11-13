import React, { useState, useEffect } from 'react';
import { PanelLeft, ExternalLink, BookOpen, Scale, ShieldCheck } from 'lucide-react';
import { OFFICIAL_SOURCES } from '../data/bangladeshLaws';
import { fetchHealth } from '../services/aiService';

// Live backend status: replaces the old browser-side Gemini key dialog.
function useBackendStatus() {
  const [status, setStatus] = useState({ state: 'checking', label: 'Checking backend…' });
  useEffect(() => {
    const controller = new AbortController();
    fetchHealth(controller.signal)
      .then((h) => {
        if (!h.llm_configured) {
          setStatus({ state: 'warn', label: 'Backend up – GROQ_API_KEY missing' });
        } else {
          setStatus({
            state: 'ok',
            label: `Groq ready · ${h.retrieval_mode === 'hybrid' ? 'vector+BM25' : 'BM25 only'} · ${h.passages_indexed} passages`,
          });
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus({ state: 'down', label: 'Backend offline' });
      });
    return () => controller.abort();
  }, []);
  return status;
}

const STATUS_STYLE = {
  ok: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  warn: 'border-amber-300 bg-amber-50 text-amber-800',
  down: 'border-rose-300 bg-rose-50 text-rose-800',
  checking: 'border-slate-200 bg-white text-slate-600',
};

export default function WhizzyTopBar({ isSidebarOpen, onToggleSidebar }) {
  const status = useBackendStatus();
  return (
    <div className="h-14 px-4 sm:px-6 flex items-center justify-between select-none shrink-0 z-10 bg-white border-b border-slate-200/80">
      {/* Left: Sidebar toggle + App Identity */}
      <div className="flex items-center gap-3">
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title="Open sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">🇧🇩</div>
          <div>
            <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">Bangladesh Legal Copilot</span>
            <div className="text-[10px] text-slate-500 font-medium hidden sm:block">Multi-Agent Legal Research &amp; Assistance System</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${STATUS_STYLE[status.state]}`}
          title="Status of the FastAPI backend (CrewAI + Groq + RAG)"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden md:inline font-semibold">{status.label}</span>
        </span>

        <a
          href={OFFICIAL_SOURCES.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-900 text-xs font-medium transition"
          title="Browse Official Bangladesh Laws (bdlaws.minlaw.gov.bd)"
        >
          <Scale className="w-3.5 h-3.5 text-emerald-700" />
          <span className="font-semibold hidden sm:inline">BD Laws Portal</span>
          <span className="sm:hidden font-semibold">BD Laws</span>
          <ExternalLink className="w-3 h-3 text-emerald-600" />
        </a>

        <a
          href={OFFICIAL_SOURCES.masterPdfPath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
          title="Open Master Legal PDF Document (429 pages)"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Master Legal PDF</span>
          <span className="text-[10px] bg-slate-800 border border-slate-700 px-1 rounded text-slate-300 font-mono">429p</span>
        </a>
      </div>
    </div>
  );
}
