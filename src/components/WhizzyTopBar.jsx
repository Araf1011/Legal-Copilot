import React from 'react';
import { 
  Upload, 
  Download, 
  FileText,
  PanelLeft,
  ChevronDown
} from 'lucide-react';

export default function WhizzyTopBar({ 
  onOpenExport, 
  onOpenUpload, 
  isSidebarOpen, 
  onToggleSidebar,
  currentContract,
  contracts,
  setCurrentContract
}) {
  return (
    <div className="h-12 px-5 flex items-center justify-between select-none shrink-0 z-10 bg-white border-b border-slate-100">
      
      {/* Left: Sidebar expand toggle (if sidebar closed) & Active Contract */}
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
            <span className="font-semibold text-slate-900 max-w-[200px] sm:max-w-xs truncate">
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
      </div>

      {/* Right: Clean Action Buttons (NO duplicate profile avatar) */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
        >
          <Upload className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Upload Contract</span>
        </button>

        <button 
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Audit Report</span>
        </button>
      </div>

    </div>
  );
}
