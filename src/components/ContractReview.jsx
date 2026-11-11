import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  Copy, 
  Sparkles, 
  MessageSquare, 
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';

export default function ContractReview({ 
  contract, 
  onUpdateClause, 
  onNavigateToChat 
}) {
  const [selectedClauseId, setSelectedClauseId] = useState(contract.clauses[0]?.id || null);
  const [filterRisk, setFilterRisk] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const selectedClause = contract.clauses.find(c => c.id === selectedClauseId) || contract.clauses[0];

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'critical':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          indicator: 'bg-rose-500',
          label: 'Critical Risk',
          icon: ShieldAlert
        };
      case 'high':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          indicator: 'bg-amber-500',
          label: 'High Risk',
          icon: AlertTriangle
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          indicator: 'bg-yellow-500',
          label: 'Medium Risk',
          icon: AlertTriangle
        };
      case 'low':
      default:
        return {
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
          indicator: 'bg-teal-500',
          label: 'Standard / Safe',
          icon: ShieldCheck
        };
    }
  };

  const filteredClauses = contract.clauses.filter(clause => {
    const matchesRisk = filterRisk === 'all' || clause.risk === filterRisk;
    const matchesSearch = 
      clause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.section.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const criticalCount = contract.clauses.filter(c => c.risk === 'critical').length;
  const highCount = contract.clauses.filter(c => c.risk === 'high').length;
  const mediumCount = contract.clauses.filter(c => c.risk === 'medium').length;
  const lowCount = contract.clauses.filter(c => c.risk === 'low').length;

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
      issue: 'Mitigated by Whizzy Legal Copilot: rebalanced to market standard terms.',
      isApplied: true
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Executive Health & Summary Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                Contract Audit
              </span>
              <span className="text-xs text-slate-500">Governing Law: <strong className="text-slate-800">{contract.governingLaw}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">Effective: <strong className="text-slate-800">{contract.effectiveDate}</strong></span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-editorial">
              {contract.title}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {contract.summary}
            </p>
            
            <p className="text-xs text-slate-400 italic">
              Parties: {contract.parties}
            </p>
          </div>

          {/* Risk Score Widget */}
          <div className="flex items-center gap-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-4 shrink-0 shadow-2xs">
            <div className="relative flex items-center justify-center">
              <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${
                contract.riskScore < 50 ? 'border-rose-400 text-rose-600 bg-rose-50' :
                contract.riskScore < 75 ? 'border-amber-400 text-amber-600 bg-amber-50' :
                'border-teal-500 text-teal-700 bg-teal-50'
              }`}>
                <span className="text-2xl font-black font-mono">{contract.riskScore}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs text-slate-500 font-medium">Risk Assessment</div>
              <div className={`text-sm font-bold ${
                contract.riskScore < 50 ? 'text-rose-600' :
                contract.riskScore < 75 ? 'text-amber-600' :
                'text-teal-700'
              }`}>
                {contract.riskLevel}
              </div>
              
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                {criticalCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-mono font-medium border border-rose-200">
                    {criticalCount} Critical
                  </span>
                )}
                {highCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-mono font-medium border border-amber-200">
                    {highCount} High
                  </span>
                )}
                {mediumCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 font-mono font-medium border border-yellow-200">
                    {mediumCount} Med
                  </span>
                )}
                {lowCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-mono font-medium border border-teal-200">
                    {lowCount} Safe
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Split Workbench: Document View (Left 60%) + Deep Clause Inspector (Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Document View */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Controls & Search */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search contract clauses, terms, sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All' },
                { id: 'critical', label: 'Critical' },
                { id: 'high', label: 'High' },
                { id: 'medium', label: 'Medium' },
                { id: 'low', label: 'Safe' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterRisk(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    filterRisk === f.id
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Document Content Canvas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 max-h-[750px] overflow-y-auto">
            <div className="border-b border-slate-100 pb-3 mb-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono uppercase tracking-wider text-teal-700 font-bold">Document Body ({filteredClauses.length} clauses)</span>
              <span>Click clause to inspect redline</span>
            </div>

            {filteredClauses.map((clause) => {
              const badge = getRiskBadge(clause.risk);
              const isSelected = selectedClause?.id === clause.id;
              const Icon = badge.icon;

              return (
                <div
                  key={clause.id}
                  onClick={() => setSelectedClauseId(clause.id)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/40 border-teal-500 shadow-xs ring-1 ring-teal-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Clause Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {clause.section}
                      </span>
                      <h3 className="font-semibold text-sm text-slate-900">
                        {clause.title}
                      </h3>
                      {clause.isApplied && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Redlined
                        </span>
                      )}
                    </div>

                    <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.bg}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{clause.riskLabel}</span>
                    </div>
                  </div>

                  {/* Clause Body Text */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif pl-2 border-l-2 border-slate-200">
                    {clause.text}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                      Category: {clause.category}
                    </span>
                    <span className="text-teal-700 font-medium flex items-center gap-1 hover:underline">
                      View AI Redline <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredClauses.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                No clauses found matching your filter criteria.
              </div>
            )}
          </div>

        </div>

        {/* Right: AI Clause Inspector & Redline Studio */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4">
          
          {selectedClause ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-sm text-slate-900">Clause Analysis & Redline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-teal-700 font-bold">{selectedClause.section}</span>
                </div>
              </div>

              {/* Identified Problem / Legal Vulnerability */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Legal Vulnerability & Imbalance:</span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed">
                  {selectedClause.issue}
                </p>
              </div>

              {/* Original Wording */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Current Clause Text</span>
                  <button 
                    onClick={() => handleCopy(selectedClause.text, 'original')}
                    className="flex items-center gap-1 text-slate-500 hover:text-teal-700 transition text-[11px]"
                  >
                    {copiedId === 'original' ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                    {copiedId === 'original' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-mono leading-relaxed max-h-36 overflow-y-auto">
                  {selectedClause.text}
                </div>
              </div>

              {/* AI Suggested Redline */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-teal-800">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>AI Recommended Redline (Balanced)</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(selectedClause.suggestedRedline, 'redline')}
                    className="flex items-center gap-1 text-slate-500 hover:text-teal-700 transition text-[11px]"
                  >
                    {copiedId === 'redline' ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                    {copiedId === 'redline' ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 text-xs text-teal-900 font-mono leading-relaxed max-h-40 overflow-y-auto">
                  {selectedClause.suggestedRedline}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleApplyRedline(selectedClause)}
                  disabled={selectedClause.isApplied}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition ${
                    selectedClause.isApplied
                      ? 'bg-teal-100 text-teal-800 border border-teal-300 cursor-default'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {selectedClause.isApplied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Applied to Active Agreement
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Accept & Replace with AI Redline
                    </>
                  )}
                </button>

                <button
                  onClick={() => onNavigateToChat(selectedClause)}
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                  Ask Whizzy to Negotiate Counter-Offer
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs shadow-sm">
              Select a clause from the left to inspect legal risks and view redlines.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
