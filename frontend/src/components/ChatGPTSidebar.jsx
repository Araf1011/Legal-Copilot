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
  activeTab,
  onNavigateToLanding,
  lang = 'bn'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const isEn = lang === 'en';

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedSessions = filteredSessions.filter(s => s.isPinned);
  const recentSessions = filteredSessions; // All chats remain in Recent, and pinned ones ALSO appear in Pinned section

  // Collapsed: render nothing — TopBar has the open button
  if (!isOpen) return null;

  // Expanded Sidebar: Exact Hierarchy Requested
  return (
    <aside className="w-64 bg-[#fbfbfb] text-slate-800 border-r border-slate-200/90 h-screen flex flex-col select-none shrink-0 z-30 font-sans transition-all duration-200">
      
      {/* 1. Header: Brand + Collapse Button */}
      <div className="h-14 px-3.5 flex items-center justify-between shrink-0 border-b border-slate-100">
        <div 
          onClick={onNavigateToLanding}
          className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition group"
          title="Return to Product Landing Page"
        >
          <div className="w-7 h-7 rounded-lg bg-[#006a4e] flex items-center justify-center shrink-0 border border-emerald-400/30 shadow-xs relative overflow-hidden group-hover:scale-105 transition">
            <svg viewBox="0 0 100 100" className="w-5 h-5" fill="none">
              <path
                d="M38 18 C45 15, 52 18, 56 24 C62 26, 68 32, 72 38 C74 46, 70 52, 68 56 C72 60, 77 67, 78 76 C76 83, 72 90, 66 90 C62 88, 59 82, 55 80 C50 78, 45 81, 41 80 C36 78, 32 72, 30 67 C28 61, 26 56, 27 50 C26 44, 23 38, 26 31 C29 25, 33 22, 38 18 Z"
                fill="#ffffff"
              />
              <circle cx="48" cy="52" r="11" fill="#f42a41" />
            </svg>
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5 font-sans">
            <span>Legal Copilot</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-[#006a4e] font-bold border border-emerald-300">
              BD
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
            <SquarePen className="w-4 h-4 text-[#006a4e]" />
            <span>{isEn ? 'New chat' : 'নতুন কথোপকথন'}</span>
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
            placeholder={isEn ? 'Search chats...' : 'চ্যাট খুঁজুন...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#006a4e] shadow-2xs transition"
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
              <Pin className="w-3 h-3 text-[#006a4e] fill-[#006a4e]" />
              <span>{isEn ? 'Pinned' : 'পিন করা'}</span>
              <span className="text-[10px] font-mono text-[#006a4e] ml-auto font-bold">{pinnedSessions.length}</span>
            </div>

            {pinnedSessions.map((sess) => {
              const isActive = sess.id === currentSessionId && activeTab === 'chat';
              return (
                <div
                  key={sess.id}
                  onClick={() => onSelectSession(sess.id)}
                  className={`group flex items-center justify-between px-3 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                    isActive
                      ? 'bg-[#006a4e] text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-emerald-50/80 hover:text-[#006a4e]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Pin className={`w-3 h-3 shrink-0 ${isActive ? 'text-white fill-white' : 'text-[#006a4e] fill-[#006a4e]'}`} />
                    <span className="truncate">{sess.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                    {/* Unpin action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(sess.id);
                      }}
                      className={`p-1 transition ${isActive ? 'hover:text-amber-200 text-white/80' : 'hover:text-[#006a4e] text-slate-400'}`}
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
                      className={`p-1 transition ${isActive ? 'hover:text-rose-200 text-white/80' : 'hover:text-rose-600 text-slate-400'}`}
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
            <span>{isEn ? 'Recent' : 'সাম্প্রতিক'}</span>
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
                      ? 'bg-[#006a4e] text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-emerald-50/80 hover:text-[#006a4e]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    {sess.isPinned && (
                      <Pin className={`w-2.5 h-2.5 shrink-0 ${isActive ? 'text-white fill-white' : 'text-[#006a4e] fill-[#006a4e]'}`} />
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
                      className={`p-1 transition ${isActive ? 'hover:text-amber-200 text-white/80' : 'hover:text-[#006a4e] text-slate-400'}`}
                      title={sess.isPinned ? "Unpin chat" : "Pin chat to top"}
                    >
                      {sess.isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                    </button>

                    {/* Delete action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(sess.id);
                      }}
                      className={`p-1 transition ${isActive ? 'hover:text-rose-200 text-white/80' : 'hover:text-rose-600 text-slate-400'}`}
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
                {isEn ? 'No recent chats yet.' : 'এখনো কোনো কথোপকথন নেই।'}<br />
                <span className="text-[#006a4e] font-medium">{isEn ? 'Type a prompt to begin.' : 'শুরু করতে একটি প্রশ্ন লিখুন।'}</span>
              </div>
            )
          )}
        </div>

      </div>

      {/* Bottom Legal Statutory Badge */}
      <div className="p-3 border-t border-slate-100 shrink-0 bg-white">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#006a4e] flex items-center justify-center border border-emerald-200 shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="font-bold text-xs text-slate-900 truncate">{isEn ? 'Bangladesh Legal Counsel' : 'বাংলাদেশ আইনি সহকারী'}</div>
            <div className="text-[10px] text-[#006a4e] font-mono font-medium">{isEn ? '520+ Acts & Gazettes' : '৫২০+ আইন ও গেজেট'}</div>
          </div>
        </div>
      </div>

    </aside>
  );
}
