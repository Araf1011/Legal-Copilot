import React from 'react';
import { 
  ChevronRight, 
  MessageSquare, 
  Folder, 
  LayoutGrid, 
  HelpCircle, 
  Settings,
  Plus
} from 'lucide-react';

export default function WhizzyRail({ 
  activeNav, 
  setActiveNav, 
  isDrawerOpen, 
  setIsDrawerOpen,
  onNewChat
}) {
  return (
    <div className="w-16 bg-white border-r border-slate-200/80 flex flex-col items-center justify-between py-4 select-none shrink-0 z-30">
      
      {/* Top Group: Starburst Logo & Expand Arrow */}
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex items-center justify-center gap-1">
          {/* Whizzy 8-arm teal starburst logo */}
          <button 
            onClick={onNewChat}
            className="p-1.5 hover:opacity-80 transition cursor-pointer"
            title="New Chat / Whizzy Home"
          >
            <svg 
              className="w-6 h-6 text-teal-600" 
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
          </button>

          {/* Expand Chevron > */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="w-5 h-5 rounded-full border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition shadow-2xs"
            title="Toggle Recent Chats & Drawer"
          >
            <ChevronRight className={`w-3 h-3 transition-transform ${isDrawerOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation Action Icons */}
        <div className="flex flex-col items-center gap-2 mt-4 w-full px-2">
          
          {/* Active: Solid Teal Chat Bubble Pill */}
          <button
            onClick={() => {
              setActiveNav('chat');
              setIsDrawerOpen(false);
            }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition shadow-xs ${
              activeNav === 'chat'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
            title="Legal Copilot Chat"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 fill-current" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-600 ring-1 ring-white"></span>
            </div>
          </button>

          {/* Second: Folder / Contracts library */}
          <button
            onClick={() => {
              setActiveNav('contracts');
              setIsDrawerOpen(true);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeNav === 'contracts' 
                ? 'bg-slate-100 text-teal-600' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
            title="Contracts & Files"
          >
            <Folder className="w-5 h-5" />
          </button>

          {/* Third: 4-square grid */}
          <button
            onClick={() => {
              setActiveNav('apps');
              setIsDrawerOpen(true);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
              activeNav === 'apps' 
                ? 'bg-slate-100 text-teal-600' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
            title="Agent Modes & Workspaces"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

        </div>
      </div>

      {/* Bottom Group: Help & Settings */}
      <div className="flex flex-col items-center gap-2 w-full px-2">
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
          title="Help & Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
