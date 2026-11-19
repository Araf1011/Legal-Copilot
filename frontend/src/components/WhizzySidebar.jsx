import React from 'react';
import { 
  Bot, 
  FileText, 
  PenTool, 
  GitCompare, 
  ShieldCheck, 
  Plus, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  Settings, 
  ExternalLink,
  Scale,
  FolderOpen
} from 'lucide-react';

export default function WhizzySidebar({ 
  activeTab, 
  setActiveTab, 
  contracts, 
  currentContract, 
  setCurrentContract, 
  onNewContract,
  isCollapsed,
  setIsCollapsed
}) {
  const mainNav = [
    { id: 'chat', label: 'Agent Chat', icon: Bot, badge: 'Whizzy AI' },
    { id: 'audit', label: 'Contract Audit', icon: FileText, badge: 'Clauses' },
    { id: 'draft', label: 'Drafting Studio', icon: PenTool },
    { id: 'compare', label: 'Redline & Diff', icon: GitCompare },
    { id: 'compliance', label: 'Compliance Hub', icon: ShieldCheck },
  ];

  return (
    <aside className={`h-screen bg-slate-950 border-r border-slate-800/80 flex flex-col transition-all duration-300 z-30 shrink-0 ${
      isCollapsed ? 'w-20' : 'w-64 sm:w-72'
    }`}>
      
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Whizzy signature teal logo mark */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/20 shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="leading-tight truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-sans">
                  Whizzy
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  Legal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">AI Contract & Agent Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* New Analysis Action Button */}
      <div className="p-3">
        <button
          onClick={onNewContract}
          className={`w-full whizzy-gradient-btn text-slate-950 font-bold rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition group ${
            isCollapsed ? 'px-0' : ''
          }`}
          title="Start New Contract Analysis"
        >
          <Plus className="w-4 h-4 text-slate-950 group-hover:rotate-90 transition-transform duration-200" />
          {!isCollapsed && (
            <>
              <span className="text-xs font-semibold">New Contract Audit</span>
              <kbd className="hidden lg:inline text-[9px] bg-slate-950/20 px-1.5 py-0.5 rounded text-slate-900 font-mono ml-auto">
                ⌘K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="px-3 py-2 space-y-1">
        <div className={`px-2 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 ${isCollapsed ? 'hidden' : 'block'}`}>
          Agent Modes
        </div>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold shadow-sm shadow-teal-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
              }`}
              title={item.label}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              {!isCollapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ml-auto font-mono ${
                      isActive ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Recent Sessions / Documents List */}
      {!isCollapsed && (
        <div className="flex-1 px-3 py-3 overflow-y-auto space-y-1.5 border-t border-slate-800/60 mt-2">
          <div className="px-2 mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-500" /> Active Contracts
            </span>
            <span className="text-[10px] font-mono text-teal-400">{contracts.length} loaded</span>
          </div>

          <div className="space-y-1">
            {contracts.map((c) => {
              const isSelected = currentContract.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setCurrentContract(c)}
                  className={`w-full text-left p-2.5 rounded-xl border transition cursor-pointer group ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500/50 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className={`text-xs font-semibold truncate ${isSelected ? 'text-teal-300' : 'text-slate-300'}`}>
                      {c.title}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 font-bold ${
                      c.riskScore < 50 ? 'bg-rose-500/20 text-rose-300' :
                      c.riskScore < 75 ? 'bg-amber-500/20 text-amber-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {c.riskScore}/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span className="truncate">{c.clauses.length} clauses analyzed</span>
                    <span className="text-slate-400 group-hover:text-teal-400 transition">View</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Profile / Agent Model pill */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center font-bold text-xs text-slate-950">
              LC
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950"></span>
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate flex items-center gap-1">
                <span>Llama 3.3 70B (Groq)</span>
                <Sparkles className="w-3 h-3 text-teal-400" />
              </div>
              <div className="text-[10px] text-teal-400/90 font-mono truncate">
                CrewAI + RAG
              </div>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
}

