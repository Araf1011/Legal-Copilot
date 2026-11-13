import React from 'react';
import { 
  X, 
  Plus, 
  MessageSquare, 
  Trash2, 
  FileText, 
  Folder, 
  ShieldCheck, 
  GitCompare, 
  PenTool, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function WhizzySlideDrawer({ 
  isOpen, 
  onClose, 
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  contracts, 
  currentContract, 
  setCurrentContract, 
  onNewContract,
  onSelectView,
  activeTab
}) {
  if (!isOpen) return null;

  return (
    <div className="w-72 bg-white border-r border-slate-200/90 h-full flex flex-col z-20 shadow-lg animate-in slide-in-from-left duration-200 shrink-0 select-none">
      
      {/* Drawer Header */}
      <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-600"></div>
          <span className="font-extrabold text-sm text-slate-800">Legal Copilot</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
            AI
          </span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat Action Button (ChatGPT Style) */}
      <div className="p-3">
        <button
          onClick={() => {
            onNewChat();
            onClose();
          }}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl py-2 px-3 text-xs flex items-center justify-between shadow-2xs transition group"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span>New Chat</span>
          </div>
          <kbd className="text-[10px] bg-teal-800/60 px-1.5 py-0.5 rounded text-white font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Recent Chats Section (ChatGPT Style) */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center justify-between">
          <span>Recent Chats</span>
          <span className="font-mono text-teal-700 text-[10px]">{sessions.length}</span>
        </div>

        <div className="space-y-0.5">
          {sessions.map((sess) => {
            const isActive = sess.id === currentSessionId && activeTab === 'chat';
            return (
              <div
                key={sess.id}
                onClick={() => {
                  onSelectSession(sess.id);
                  onClose();
                }}
                className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer transition ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span className="truncate">{sess.title}</span>
                </div>

                {/* Delete Chat on Hover */}
                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(sess.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-600 text-slate-400 transition shrink-0"
                    title="Delete chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Workspaces List */}
        <div className="pt-4 border-t border-slate-100 mt-3 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
            Workspaces
          </div>

          {[
            { id: 'audit', label: 'Clause Audit & Redline', icon: FileText },
            { id: 'draft', label: 'Drafting Studio', icon: PenTool },
            { id: 'compare', label: 'Redline & Diff', icon: GitCompare },
            { id: 'compliance', label: 'Regulatory Matrix', icon: ShieldCheck },
          ].map((m) => {
            const Icon = m.icon;
            const isActive = activeTab === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  onSelectView(m.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  isActive 
                    ? 'bg-teal-50 text-teal-800 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span className="truncate">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contracts Library */}
        <div className="pt-4 border-t border-slate-100 mt-3 space-y-1 pb-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center justify-between">
            <span>Contracts</span>
            <button 
              onClick={onNewContract}
              className="text-[10px] text-teal-700 hover:underline font-bold"
            >
              + Upload
            </button>
          </div>

          {contracts.map((c) => {
            const isSelected = currentContract.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => {
                  setCurrentContract(c);
                  onClose();
                }}
                className={`p-2 rounded-xl border text-xs cursor-pointer transition ${
                  isSelected 
                    ? 'bg-slate-50 border-teal-500/60 shadow-2xs' 
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`font-semibold truncate text-[11px] ${isSelected ? 'text-teal-900' : 'text-slate-700'}`}>
                    {c.title}
                  </span>
                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                    c.riskScore < 50 ? 'bg-rose-50 text-rose-600' :
                    c.riskScore < 75 ? 'bg-amber-50 text-amber-600' :
                    'bg-teal-50 text-teal-700'
                  }`}>
                    {c.riskScore}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
