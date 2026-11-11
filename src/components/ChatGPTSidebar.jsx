import React, { useState } from 'react';
import { 
  SquarePen, 
  Search, 
  PanelLeft, 
  Pin, 
  PinOff,
  Trash2, 
  MessageSquare,
  Scale,
  Gift,
  X
} from 'lucide-react';

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
  const recentSessions = filteredSessions; // All chats remain in Recent, and pinned ones ALSO appear in Pinned section

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
          className="mt-3 w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition shadow-2xs"
          title="New Chat"
        >
          <SquarePen className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Expanded Sidebar: Exact Hierarchy Requested
  return (
    <aside className="w-64 bg-[#fbfbfb] text-slate-800 border-r border-slate-200/90 h-screen flex flex-col select-none shrink-0 z-30 font-sans transition-all duration-200">
      
      {/* 1. Header: Brand + Collapse Button */}
      <div className="h-14 px-3.5 flex items-center justify-between shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 text-teal-600 flex items-center justify-center">
            <svg 
              className="w-5 h-5 text-teal-600" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            >
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
            </svg>
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5 font-sans">
            <span>Legal Copilot</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-teal-50 text-teal-700 font-bold border border-teal-200">
              AI
            </span>
          </span>
        </div>

        <button 
          onClick={onToggle}
          className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
          title="Collapse sidebar"
        >
          <svg 
            className="w-4 h-4" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
          </svg>
        </button>
      </div>

      {/* 2. New Chat Option (At the very top) */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={onNewChat}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-between transition shadow-2xs group"
        >
          <div className="flex items-center gap-2 text-slate-800">
            <SquarePen className="w-4 h-4 text-teal-600" />
            <span>New chat</span>
          </div>
          <kbd className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 3. Search Section (To find any chat) */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 shadow-2xs transition"
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
        
        {/* 4. Pinned Section (Shown when chats are pinned) */}
        {pinnedSessions.length > 0 && (
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1 flex items-center gap-1.5">
              <Pin className="w-3 h-3 text-teal-600 fill-teal-600" />
              <span>Pinned</span>
              <span className="text-[10px] font-mono text-teal-700 ml-auto">{pinnedSessions.length}</span>
            </div>

            {pinnedSessions.map((sess) => {
              const isActive = sess.id === currentSessionId && activeTab === 'chat';
              return (
                <div
                  key={sess.id}
                  onClick={() => onSelectSession(sess.id)}
                  className={`group flex items-center justify-between px-3 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Pin className="w-3 h-3 text-teal-600 fill-teal-600 shrink-0" />
                    <span className="truncate">{sess.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                    {/* Unpin action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(sess.id);
                      }}
                      className="p-1 hover:text-teal-700 text-slate-400 transition"
                      title="Unpin chat"
                    >
                      <PinOff className="w-3 h-3" />
                    </button>

                    {/* Delete action */}
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

        {/* 5. Recent Chat Section */}
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1 flex items-center justify-between">
            <span>Recent</span>
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
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    {sess.isPinned && (
                      <Pin className="w-2.5 h-2.5 text-teal-600 fill-teal-600 shrink-0" />
                    )}
                    <span className="truncate">{sess.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                    {/* Pin / Unpin action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(sess.id);
                      }}
                      className="p-1 hover:text-teal-700 text-slate-400 transition"
                      title={sess.isPinned ? "Unpin chat" : "Pin chat to top"}
                    >
                      {sess.isPinned ? <PinOff className="w-3 h-3 text-teal-600" /> : <Pin className="w-3 h-3" />}
                    </button>

                    {/* Delete action */}
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
                No recent chats yet.<br />
                <span className="text-teal-700 font-medium">Type a prompt to begin.</span>
              </div>
            )
          )}
        </div>

      </div>

      {/* Bottom Profile */}
      <div className="p-3 border-t border-slate-100 shrink-0 bg-white">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
            alt="Counsel" 
            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 shadow-2xs"
          />
          <div className="min-w-0 leading-tight">
            <div className="font-semibold text-xs text-slate-900 truncate">In-House Counsel</div>
            <div className="text-[11px] text-slate-400 font-mono">Legal Copilot AI</div>
          </div>
        </div>
      </div>

    </aside>
  );
}
