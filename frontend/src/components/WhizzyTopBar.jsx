import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  FileText,
  PanelLeft,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Scale,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { fetchHealth } from '../services/aiService';
import { OFFICIAL_SOURCES } from '../data/bangladeshLaws';

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
  onNavigateToLanding
}) {
  const backendStatus = useBackendStatus();

  return (
    <div className="h-13 px-4 sm:px-6 flex items-center justify-between select-none shrink-0 z-10 bg-white border-b border-slate-200/80">
      
      {/* Left: Sidebar toggle + Active Contract / Laws Selector */}
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

        {/* Contract Selector Pill */}
        <div className="relative group">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-700 transition cursor-pointer">
            <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="font-semibold text-slate-900 max-w-[180px] sm:max-w-xs truncate">
              {currentContract.title}
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
              currentContract.riskScore < 50 ? 'bg-rose-50 text-rose-700' :
              currentContract.riskScore < 75 ? 'bg-amber-50 text-amber-700' :
              'bg-teal-50 text-teal-700'
            }`}>
              {currentContract.riskScore}/100
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          <select 
            aria-label="Select active contract"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            value={currentContract.id}
            onChange={(e) => {
              const sel = contracts.find(c => c.id === e.target.value);
              if (sel) setCurrentContract(sel);
            }}
          >
            {contracts.map(c => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.riskLevel})
              </option>
            ))}
          </select>
        </div>

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

      {/* Right: Quick Portals + Action Buttons */}
      <div className="flex items-center gap-2">
        
        {/* Landing Page Overview Pill */}
        <button 
          onClick={onNavigateToLanding}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
          title="Product Landing Page & Overview"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Overview</span>
        </button>

        {/* Official BD Laws Portal Link */}
        <a 
          href={OFFICIAL_SOURCES.portalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-900 text-xs font-medium transition shadow-2xs"
          title="Official Laws of Bangladesh Portal"
        >
          <Scale className="w-3.5 h-3.5 text-emerald-700" />
          <span>BD Laws</span>
          <ExternalLink className="w-2.5 h-2.5 text-emerald-600" />
        </a>

        {/* Master Legal PDF (429 pages) */}
        <a 
          href={OFFICIAL_SOURCES.masterPdfPath} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-2xs"
          title="Open Master Legal PDF Document (429 pages)"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>PDF Guide</span>
          <span className="text-[10px] bg-slate-800 border border-slate-700 px-1 rounded text-slate-300 font-mono">429p</span>
        </a>

        {/* Upload Contract */}
        <button 
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
        >
          <Upload className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* Export Report */}
        <button 
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Audit</span>
        </button>

      </div>

    </div>
  );
}
