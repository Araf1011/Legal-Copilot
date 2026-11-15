import React from 'react';
import { 
  Scale, 
  FileText, 
  Bot, 
  PenTool, 
  GitCompare, 
  ShieldCheck, 
  Upload, 
  Download, 
  Sparkles,
  Globe,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  contracts, 
  currentContract, 
  setCurrentContract, 
  onOpenUpload, 
  onOpenExport,
  jurisdiction,
  setJurisdiction
}) {
  const tabs = [
    { id: 'audit', label: 'Contract Audit', icon: FileText, badge: 'AI Risk Engine' },
    { id: 'chat', label: 'Legal Copilot AI', icon: Bot, badge: 'Grounded Q&A' },
    { id: 'draft', label: 'Drafting Studio', icon: PenTool, badge: 'Clause Gen' },
    { id: 'compare', label: 'Redline & Diff', icon: GitCompare, badge: 'Changes' },
    { id: 'compliance', label: 'Compliance Hub', icon: ShieldCheck, badge: 'GDPR / CPRA' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top Banner / Ticker */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 px-4 py-1.5 text-xs border-b border-indigo-500/20 text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-indigo-300">Hackathon AI Model:</span>
          <span>Legal-Gemini 2.5 Pro (Fine-tuned on Commercial Contract Jurisprudence)</span>
        </div>
        <div className="flex items-center gap-4 hidden sm:flex text-slate-400">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Jurisdiction:</span>
            <select 
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="bg-slate-900 text-indigo-200 rounded px-1.5 py-0.5 border border-indigo-800 text-xs focus:outline-none"
            >
              <option value="Delaware (US Commercial)">Delaware (US Commercial)</option>
              <option value="California (US)">California (US Restrictive)</option>
              <option value="New York (US Commercial)">New York (US)</option>
              <option value="England & Wales (UK Common Law)">England & Wales (UK)</option>
              <option value="EU / GDPR Harmonized">EU / GDPR Harmonized</option>
            </select>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-medium">Confidence: 98.4%</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  Legal Copilot
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Automated Contract Review, Redlining & Risk Analysis</p>
            </div>
          </div>

          {/* Contract Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs hover:border-indigo-500/50 transition">
                <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-slate-400 hidden md:inline">Active:</span>
                <span className="font-medium text-slate-200 max-w-[160px] lg:max-w-[220px] truncate">
                  {currentContract.title}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </div>
              <select 
                aria-label="Select active contract"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                value={currentContract.id}
                onChange={(e) => {
                  const selected = contracts.find(c => c.id === e.target.value);
                  if (selected) setCurrentContract(selected);
                }}
              >
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.riskLevel})
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons */}
            <button 
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
              title="Upload PDF or text contract"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Contract</span>
            </button>

            <button 
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Export Full Audit Report"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Audit Report</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-t border-slate-800/80 overflow-x-auto py-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  isActive 
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}

