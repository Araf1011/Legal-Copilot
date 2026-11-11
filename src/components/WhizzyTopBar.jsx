import React, { useState, useEffect } from 'react';
import { 
  PanelLeft,
  ExternalLink,
  BookOpen,
  Scale,
  ShieldCheck,
  Key,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { OFFICIAL_SOURCES } from '../data/bangladeshLaws';

export default function WhizzyTopBar({ 
  isSidebarOpen, 
  onToggleSidebar
}) {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('legal_copilot_gemini_key');
      if (stored && stored.trim().length > 10) {
        setApiKeyInput(stored.trim());
        setHasCustomKey(true);
      }
    }
  }, []);

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      if (apiKeyInput.trim()) {
        localStorage.setItem('legal_copilot_gemini_key', apiKeyInput.trim());
        setHasCustomKey(true);
      } else {
        localStorage.removeItem('legal_copilot_gemini_key');
        setHasCustomKey(false);
      }
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setIsApiKeyModalOpen(false);
      }, 1000);
    }
  };

  const handleClearApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('legal_copilot_gemini_key');
      setApiKeyInput('');
      setHasCustomKey(false);
    }
  };

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
          <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            🇧🇩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">
                Bangladesh Legal Copilot
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                BD RAG Verified
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium hidden sm:block">
              Multi-Agent Legal Research & Assistance System
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions & Knowledge Base Links */}
      <div className="flex items-center gap-2">
        
        {/* Gemini API Key Setting Button */}
        <button
          onClick={() => setIsApiKeyModalOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition shadow-2xs cursor-pointer ${
            hasCustomKey 
              ? 'border-emerald-300 bg-emerald-50 text-emerald-800' 
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
          }`}
          title="Configure Gemini API Key"
        >
          <Key className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden md:inline font-semibold">
            {hasCustomKey ? 'API Key Active' : 'API Key'}
          </span>
        </button>

        {/* Official BD Laws Portal Link */}
        <a 
          href={OFFICIAL_SOURCES.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-900 text-xs font-medium transition shadow-2xs group"
          title="Browse Official Bangladesh Laws (bdlaws.minlaw.gov.bd)"
        >
          <Scale className="w-3.5 h-3.5 text-emerald-700" />
          <span className="font-semibold hidden sm:inline">BD Laws Portal</span>
          <span className="sm:hidden font-semibold">BD Laws</span>
          <ExternalLink className="w-3 h-3 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
        </a>

        {/* Master PDF Handbook Link */}
        <a 
          href={OFFICIAL_SOURCES.masterPdfPath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-2xs"
          title="Open Master Legal PDF Document (429 pages)"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Master Legal PDF</span>
          <span className="text-[10px] bg-slate-800 border border-slate-700 px-1 rounded text-slate-300 font-mono">
            429p
          </span>
        </a>
      </div>

      {/* API Key Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative select-text">
            
            <button
              onClick={() => setIsApiKeyModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Key className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Google Gemini API Key</h3>
                <p className="text-xs text-slate-500">Live AI model streaming configuration</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Enter your Google AI Studio Gemini API key to stream answers live directly from Google Gemini. If empty, the system automatically uses the verified built-in Bangladesh Legal Reasoning Engine.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Gemini API Key (starts with AIzaSy...)
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-[11px] text-emerald-950 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  Keys are stored safely only in your local browser storage. You can generate a free key at{' '}
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-800 underline inline-flex items-center gap-0.5"
                  >
                    Google AI Studio
                    <ExternalLink className="w-2.5 h-2.5 inline" />
                  </a>.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClearApiKey}
                className="text-xs font-medium text-slate-500 hover:text-rose-600 transition"
              >
                Clear Key
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsApiKeyModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{isSaved ? 'Saved!' : 'Save Key'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
