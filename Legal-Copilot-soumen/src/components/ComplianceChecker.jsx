import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  FileLock2, 
  Info
} from 'lucide-react';
import { COMPLIANCE_FRAMEWORKS } from '../data/sampleContracts';

export default function ComplianceChecker({ contract }) {
  const [activeFramework, setActiveFramework] = useState(COMPLIANCE_FRAMEWORKS[0].framework);

  const selected = COMPLIANCE_FRAMEWORKS.find(f => f.framework === activeFramework) || COMPLIANCE_FRAMEWORKS[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              Regulatory Compliance Engine
            </span>
            <span className="text-xs text-slate-400">Statutory Cross-Check</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-editorial">
            Data Privacy & Security Regulatory Matrix
          </h1>
          <p className="text-xs text-slate-500">
            Automated scanning of clauses against global privacy frameworks (GDPR, CPRA, SOC 2, HIPAA).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
          <FileLock2 className="w-5 h-5 text-teal-600" />
          <div className="text-xs">
            <div className="text-slate-400">Target Contract:</div>
            <div className="font-semibold text-slate-800 truncate max-w-[200px]">{contract.title}</div>
          </div>
        </div>
      </div>

      {/* Framework Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COMPLIANCE_FRAMEWORKS.map(fw => {
          const isSelected = activeFramework === fw.framework;
          return (
            <div
              key={fw.framework}
              onClick={() => setActiveFramework(fw.framework)}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                isSelected
                  ? 'bg-teal-50/40 border-teal-500 shadow-xs ring-1 ring-teal-500/30'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{fw.framework.split('(')[0]}</span>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                  parseInt(fw.score) >= 90 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {fw.score}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                <span>Status:</span>
                <span className="font-semibold text-slate-700">{fw.status}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {fw.items.filter(i => i.passed).length} of {fw.items.length} safeguards passed
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Framework Deep Dive */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              {selected.framework}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive legal breakdown and verification points detected in contract provisions.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Compliance Readiness</span>
            <div className="text-2xl font-bold font-mono text-teal-700">{selected.score}</div>
          </div>
        </div>

        {/* Audit Items */}
        <div className="space-y-3">
          {selected.items.map((item, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                item.passed 
                  ? 'bg-emerald-50/40 border-emerald-200' 
                  : 'bg-rose-50/50 border-rose-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {item.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className={`text-xs sm:text-sm font-semibold ${item.passed ? 'text-slate-800' : 'text-rose-900'}`}>
                    {item.check}
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {item.note}
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  item.passed 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {item.passed ? 'PASSED' : 'ACTION REQUIRED'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Remediation Guidance */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-900">Legal Copilot Recommended Action:</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              If operating or processing data of European residents, append an explicit <strong>Data Processing Addendum (DPA)</strong> adhering to GDPR Article 28 and incorporate Standard Contractual Clauses (SCCs) to avoid administrative fines up to €20M or 4% of global turnover.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
