import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Check, 
  Copy, 
  Sparkles, 
  ChevronRight, 
  ChevronDown,
  RefreshCw
} from 'lucide-react';

export default function WhizzyInspectorDrawer({ 
  isOpen, 
  onClose, 
  contract, 
  onUpdateClause 
}) {
  const [expandedClauseId, setExpandedClauseId] = useState(contract.clauses[0]?.id || null);
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplyRedline = (clause) => {
    if (!clause.suggestedRedline || clause.isApplied) return;
    onUpdateClause(contract.id, clause.id, {
      text: clause.suggestedRedline,
      risk: 'low',
      riskLabel: 'AI Mitigated',
      issue: 'Mitigated by Whizzy Legal Copilot: standard balanced enterprise terms.',
      isApplied: true
    });
  };

  return (
    <aside className="w-80 sm:w-96 h-full bg-white border-l border-slate-200/90 flex flex-col shrink-0 z-20 shadow-xl overflow-hidden transition-all duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-600"></div>
          <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">Document Inspector</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Contract Executive Widget */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 truncate max-w-[200px]">
            {contract.title}
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
            contract.riskScore < 50 ? 'bg-rose-50 text-rose-700 border border-rose-200' :
            contract.riskScore < 75 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
            'bg-teal-50 text-teal-700 border border-teal-200'
          }`}>
            Score: {contract.riskScore}/100
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              contract.riskScore < 50 ? 'bg-rose-500' :
              contract.riskScore < 75 ? 'bg-amber-500' :
              'bg-teal-600'
            }`}
            style={{ width: `${contract.riskScore}%` }}
          />
        </div>

        <div className="text-[11px] text-slate-500 line-clamp-2">
          {contract.summary}
        </div>
      </div>

      {/* Clauses Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Provisions ({contract.clauses.length})</span>
          <span>Click to Inspect</span>
        </div>

        {contract.clauses.map((clause) => {
          const isExpanded = expandedClauseId === clause.id;
          const isCritical = clause.risk === 'critical';
          const isHigh = clause.risk === 'high';

          return (
            <div
              key={clause.id}
              className={`rounded-xl border transition overflow-hidden ${
                isExpanded 
                  ? 'bg-slate-50 border-teal-400/80 shadow-2xs' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Clause Bar */}
              <div
                onClick={() => setExpandedClauseId(isExpanded ? null : clause.id)}
                className="p-3 cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-teal-700 font-bold">
                      {clause.section}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {clause.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isCritical ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    isHigh ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                    'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}>
                    {clause.isApplied ? 'Mitigated' : clause.risk.toUpperCase()}
                  </span>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 space-y-2.5 border-t border-slate-100 text-xs">
                  {clause.issue && (
                    <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-2 text-[11px] text-rose-800">
                      <strong>Risk:</strong> {clause.issue}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Current Clause:</span>
                      <button 
                        onClick={() => handleCopy(clause.text, `txt-${clause.id}`)}
                        className="hover:text-teal-700 transition flex items-center gap-1"
                      >
                        {copiedId === `txt-${clause.id}` ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 max-h-24 overflow-y-auto">
                      {clause.text}
                    </div>
                  </div>

                  {clause.suggestedRedline && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-teal-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-teal-600" />
                        <span>Proposed Redline:</span>
                      </div>
                      <div className="bg-teal-50/80 p-2.5 rounded-lg border border-teal-200 text-[11px] font-mono text-teal-900 max-h-24 overflow-y-auto">
                        {clause.suggestedRedline}
                      </div>

                      <button
                        onClick={() => handleApplyRedline(clause)}
                        disabled={clause.isApplied}
                        className={`w-full mt-2 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                          clause.isApplied 
                            ? 'bg-teal-100 text-teal-800 border border-teal-300 cursor-default'
                            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-2xs'
                        }`}
                      >
                        {clause.isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Applied
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5" />
                            Apply AI Redline
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </aside>
  );
}
