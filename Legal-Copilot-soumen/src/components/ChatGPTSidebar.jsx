import React, { useState } from 'react';
import { 
  SquarePen, 
  Search, 
  PanelLeft, 
  Pin, 
  PinOff,
  Trash2, 
  Scale, 
  BookOpen,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import { OFFICIAL_SOURCES } from '../data/bangladeshLaws';

export default function ChatGPTSidebar({ 
  isOpen, 
  onToggle, 
  onNewChat, 
  sessions = [], 
  currentSessionId, 
  onSelectSession, 
  onDeleteSession,
  onTogglePin,
  activeTab
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedSessions = filteredSessions.filter(s => s.isPinned);
  const recentSessions = filteredSessions;

  // Collapsed Sidebar Rail
  if (!isOpen) {
    return (
      <div className="w-14 bg-[#fbfbfb] border-r border-slate-200/90 flex flex-col items-center py-3 select-none shrink-0 z-30 transition-all">
        <button 
          onClick={onToggle}
          className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
          title="Expand sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <button 
          onClick={onNewChat}
          className="mt-3 w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition shadow-2xs"
          title="New Legal Query"
        >
          <SquarePen className="w-4 h-4" />
        </button>

        <a 
          href={OFFICIAL_SOURCES.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl transition"
          title="Laws of Bangladesh Portal"
        >
          <Scale className="w-4 h-4" />
        </a>

        <a 
          href={OFFICIAL_SOURCES.masterPdfPath}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
          title="Master Legal PDF (429 pages)"
        >
          <BookOpen className="w-4 h-4" />
        </a>
      </div>
    );
  }

  // Expanded Sidebar
  return (
    <aside className="w-64 bg-[#fbfbfb] text-slate-800 border-r border-slate-200/90 h-screen flex flex-col select-none shrink-0 z-30 font-sans transition-all duration-200">
      
      {/* 1. Header: Brand + Collapse Button */}
      <div className="h-14 px-3.5 flex items-center justify-between shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
            🇧🇩
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5 font-sans">
            <span>BD Legal Copilot</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              RAG
            </span>
          </span>
        </div>

        <button 
          onClick={onToggle}
          className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
          title="Collapse sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 2. New Chat Option */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={onNewChat}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-between transition shadow-2xs group"
        >
          <div className="flex items-center gap-2 text-slate-800">
            <SquarePen className="w-4 h-4 text-emerald-700" />
            <span>নতুন আইনি অনুসন্ধান (New Chat)</span>
          </div>
        </button>
      </div>

      {/* Quick Knowledge Base Hub */}
      <div className="px-3 pb-2">
        <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1 text-xs">
          <div className="font-bold text-[10px] text-emerald-900 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            <span>অফিশিয়াল উৎস (Verified Sources)</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <a 
              href={OFFICIAL_SOURCES.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-800 hover:underline flex items-center gap-1 font-medium text-[11px]"
            >
              <Scale className="w-3 h-3" />
              <span>BD Laws Portal</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a 
              href={OFFICIAL_SOURCES.masterPdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-800 hover:underline flex items-center gap-1 font-medium text-[11px]"
            >
              <BookOpen className="w-3 h-3" />
              <span>PDF (429p)</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Search Section */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search previous chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Middle Scrollable Area: Pinned + Recents */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 scrollbar-thin">
        
        {/* Pinned Section */}
        {pinnedSessions.length > 0 && (
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1 flex items-center gap-1.5">
              <Pin className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              <span>Pinned</span>
              <span className="text-[10px] font-mono text-emerald-700 ml-auto">{pinnedSessions.length}</span>
            </div>

            {pinnedSessions.map((sess) => {
              const isActive = sess.id === currentSessionId && activeTab === 'chat';
              return (
                <div
                  key={sess.id}
                  onClick={() => onSelectSession(sess.id)}
                  className={`group flex items-center justify-between px-3 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Pin className="w-3 h-3 text-emerald-600 fill-emerald-600 shrink-0" />
                    <span className="truncate">{sess.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(sess.id);
                      }}
                      className="p-1 hover:text-emerald-700 text-slate-400 transition"
                      title="Unpin chat"
                    >
                      <PinOff className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(sess.id);
                      }}
                      className="p-1 hover:text-rose-600 text-slate-400 transition"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent Chat Section */}
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1 flex items-center justify-between">
            <span>Recent Legal Queries</span>
            {recentSessions.length > 0 && (
              <span className="text-[10px] font-mono text-slate-400">{recentSessions.length}</span>
            )}
          </div>

          {recentSessions.length > 0 ? (
            recentSessions.map((sess) => {
              const isActive = sess.id === currentSessionId && activeTab === 'chat';
              return (
                <div
                  key={sess.id}
                  onClick={() => onSelectSession(sess.id)}
                  className={`group flex items-center justify-between px-3 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    {sess.isPinned && (
                      <Pin className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600 shrink-0" />
                    )}
                    <span className="truncate">{sess.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(sess.id);
                      }}
                      className="p-1 hover:text-emerald-700 text-slate-400 transition"
                      title={sess.isPinned ? "Unpin chat" : "Pin chat"}
                    >
                      {sess.isPinned ? <PinOff className="w-3 h-3 text-emerald-600" /> : <Pin className="w-3 h-3" />}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(sess.id);
                      }}
                      className="p-1 hover:text-rose-600 text-slate-400 transition"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            pinnedSessions.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-slate-400 leading-relaxed">
                কোনো পূর্ববর্তী অনুসন্ধান নেই।<br />
                <span className="text-emerald-700 font-medium">প্রশ্ন লিখে শুরু করুন।</span>
              </div>
            )
          )}
        </div>

      </div>

      {/* Bottom Profile / Assistant Status */}
      <div className="p-3 border-t border-slate-100 shrink-0 bg-white">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs">
            ⚖️
          </div>
          <div className="min-w-0 leading-tight">
            <div className="font-semibold text-xs text-slate-900 truncate">Bangladesh Legal Assistant</div>
            <div className="text-[11px] text-slate-400 font-mono">Jurisdiction: BD Laws</div>
          </div>
        </div>
      </div>

    </aside>
  );
}
