import React, { useState } from 'react';
import { 
  GitCompare, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Check, 
  Copy, 
  Sparkles
} from 'lucide-react';

export default function ContractComparison({ contract, onApplyAllRedlines }) {
  const [viewMode, setViewMode] = useState('split');
  const [copied, setCopied] = useState(false);

  const totalClauses = contract.clauses.length;
  const pendingCount = contract.clauses.filter(c => !c.isApplied && (c.risk === 'critical' || c.risk === 'high')).length;

  const handleCopyRedlineSummary = () => {
    const summary = contract.clauses
      .filter(c => c.suggestedRedline)
      .map(c => `[${c.section} - ${c.title}]\nORIGINAL: ${c.text}\nREVISED: ${c.suggestedRedline}\n`)
      .join('\n---\n\n');
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              Redline & Track Changes
            </span>
            <span className="text-xs text-slate-400">Version Diff Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-editorial">
            Contract Redline Comparison: Original vs. AI Revised
          </h1>
          <p className="text-xs text-slate-500">
            Compare unilateral vendor language against AI balanced provisions with visual markup.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-1 flex items-center text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                viewMode === 'split' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('inline')}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                viewMode === 'inline' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Inline Markup
            </button>
          </div>

          <button
            onClick={handleCopyRedlineSummary}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied All' : 'Copy All Diff'}</span>
          </button>

          {pendingCount > 0 && onApplyAllRedlines && (
            <button
              onClick={onApplyAllRedlines}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply All Revisions ({pendingCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Delta Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-xs text-slate-400">Original Risk Score</div>
            <div className="text-2xl font-bold text-rose-600 font-mono mt-0.5">42 / 100</div>
            <div className="text-[11px] text-rose-700 font-medium">Critical Unilateral Risk</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-rose-300" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-xs text-slate-400">Simulated Redline Score</div>
            <div className="text-2xl font-bold text-teal-700 font-mono mt-0.5">92 / 100</div>
            <div className="text-[11px] text-teal-800 font-medium">+50 Pts Health Improvement</div>
          </div>
          <ShieldCheck className="w-8 h-8 text-teal-400" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-xs text-slate-400">Total Modified Clauses</div>
            <div className="text-2xl font-bold text-slate-800 font-mono mt-0.5">
              {contract.clauses.filter(c => c.suggestedRedline).length} / {totalClauses}
            </div>
            <div className="text-[11px] text-slate-500">Standard enterprise terms</div>
          </div>
          <GitCompare className="w-8 h-8 text-slate-300" />
        </div>
      </div>

      {/* Redline Clauses Listing */}
      <div className="space-y-4">
        {contract.clauses.map((clause) => {
          const hasRedline = Boolean(clause.suggestedRedline && clause.suggestedRedline !== clause.text);

          return (
            <div 
              key={clause.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3"
            >
              {/* Clause Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {clause.section}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{clause.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {clause.isApplied ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Replaced & Finalized
                    </span>
                  ) : hasRedline ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Proposed Redline Available
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                      Standard / No Change
                    </span>
                  )}
                </div>
              </div>

              {/* View Mode Display */}
              {viewMode === 'split' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Original Text */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                      Original Draft (Vendor Stance)
                    </div>
                    <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 font-mono leading-relaxed min-h-[100px]">
                      {clause.text}
                    </div>
                  </div>

                  {/* Right: Revised Text */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                      Proposed AI Revision (Balanced Stance)
                    </div>
                    <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 text-xs text-teal-900 font-mono leading-relaxed min-h-[100px]">
                      {clause.suggestedRedline || clause.text}
                    </div>
                  </div>
                </div>
              ) : (
                /* Inline Unified Diff */
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-800 leading-relaxed line-through">
                    <span className="font-bold text-rose-600 mr-2">[-]</span> {clause.text}
                  </div>
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-teal-900 leading-relaxed">
                    <span className="font-bold text-teal-600 mr-2">[+]</span> {clause.suggestedRedline || clause.text}
                  </div>
                </div>
              )}

              {/* Legal Rationale Note */}
              {clause.issue && (
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Negotiation Rationale:</span>
                  <span>{clause.issue}</span>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
