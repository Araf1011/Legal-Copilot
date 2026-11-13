import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Lock, 
  Link2, 
  Share2, 
  Sidebar, 
  SplitSquareVertical,
  BookOpen
} from 'lucide-react';

export default function WhizzyBrowserBar({ url = "whizzy.com" }) {
  return (
    <div className="h-10 border-b border-slate-200/90 bg-white/95 px-4 flex items-center justify-between text-slate-500 text-xs shrink-0 select-none">
      
      {/* Left Navigation Buttons */}
      <div className="flex items-center gap-3">
        <button className="text-slate-400 hover:text-slate-600 transition">
          <BookOpen className="w-3.5 h-3.5" />
        </button>
        <button className="text-slate-400 hover:text-slate-600 transition">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="text-slate-300 transition cursor-default">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="text-slate-400 hover:text-slate-600 transition">
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center URL Pill */}
      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-full px-3.5 py-1 text-slate-700 text-[11px] font-medium shadow-2xs">
        <Link2 className="w-3 h-3 text-slate-400" />
        <span>{url}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 text-slate-400">
        <button className="hover:text-slate-600 transition p-1">
          <SplitSquareVertical className="w-3.5 h-3.5" />
        </button>
        <button className="hover:text-slate-600 transition p-1">
          <Sidebar className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}

