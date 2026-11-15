import React, { useState } from 'react';
import { 
  PenTool, 
  Sparkles, 
  Copy, 
  Check, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  FileCheck, 
  Download,
  PlusCircle
} from 'lucide-react';
import { LEGAL_TEMPLATES } from '../data/sampleContracts';

export default function ClauseGenerator({ onInsertClause }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(LEGAL_TEMPLATES[0].id);
  const [stance, setStance] = useState('balanced');
  const [jurisdiction, setJurisdiction] = useState('State of Delaware, USA');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inserted, setInserted] = useState(false);

  const selectedTemplate = LEGAL_TEMPLATES.find(t => t.id === selectedTemplateId) || LEGAL_TEMPLATES[0];

  const [formVariables, setFormVariables] = useState(() => {
    const initial = {};
    selectedTemplate.variables.forEach(v => {
      initial[v.name] = v.default;
    });
    return initial;
  });

  const handleSelectTemplate = (tId) => {
    setSelectedTemplateId(tId);
    const tmpl = LEGAL_TEMPLATES.find(t => t.id === tId);
    if (tmpl) {
      const vars = {};
      tmpl.variables.forEach(v => {
        vars[v.name] = v.default;
      });
      setFormVariables(vars);
    }
  };

  const handleInputChange = (key, value) => {
    setFormVariables(prev => ({ ...prev, [key]: value }));
  };

  const getDraftedClause = () => {
    if (selectedTemplate.id === 'mutual-nda') {
      const p1 = formVariables.party1 || 'Party A';
      const p2 = formVariables.party2 || 'Party B';
      const purpose = formVariables.purpose || 'commercial evaluation';
      const term = formVariables.durationYears || '2';

      if (stance === 'pro-customer') {
        return `SECTION: MUTUAL NON-DISCLOSURE AND TRADE SECRET PROTECTION\n\n1. Purpose. This Agreement is entered into between ${p1} and ${p2} solely to facilitate discussions regarding ${purpose}.\n\n2. Duty of Confidentiality. The Receiving Party shall hold all Confidential Information in strictest confidence and use no less than the highest standard of commercial care. Receiving Party shall not disclose, duplicate, or reverse-engineer any proprietary information.\n\n3. Survival. Obligations hereunder shall survive for a period of ${term} years, except that with respect to technical Trade Secrets, source code, and customer data, obligations shall continue perpetually until publicly disclosed without breach.\n\n4. Governing Law & Equitable Remedies. This Agreement is governed by the laws of ${jurisdiction}. Disclosing Party is immediately entitled to ex parte injunctive relief without posting bond in the event of threatened breach.`;
      } else if (stance === 'pro-vendor') {
        return `SECTION: CONFIDENTIALITY & PROPRIETARY INFORMATION\n\n1. Scope. ${p1} and ${p2} acknowledge that disclosures regarding ${purpose} may occur. Only information clearly stamped "CONFIDENTIAL" in writing within five (5) days of disclosure shall be protected.\n\n2. Standard of Care. Receiving Party shall apply ordinary commercial care.\n\n3. Term. All obligations expire exactly ${term} years from initial disclosure with no perpetual survival.\n\n4. Disclaimers. Neither party makes any warranty regarding the accuracy or completeness of disclosed materials. Liability is capped at direct proven damages not exceeding $5,000. Governed by ${jurisdiction}.`;
      } else {
        return `SECTION: MUTUAL CONFIDENTIALITY AND NON-DISCLOSURE\n\n1. Purpose & Mutual Undertaking. ${p1} and ${p2} mutually agree to protect proprietary information disclosed in connection with ${purpose}.\n\n2. Standard of Care. Each Receiving Party shall exercise at least reasonable care to prevent unauthorized dissemination. Disclosures are permitted only to employees, contractors, and legal advisors with a strict need-to-know.\n\n3. Term & Survival. Obligations shall continue for a period of ${term} years following termination; provided that Trade Secrets shall remain protected for as long as deemed a trade secret under applicable laws of ${jurisdiction}.\n\n4. Remedies. Each party reserves all remedies at law and equity, including appropriate injunctive relief upon substantial evidentiary showing.`;
      }
    } else if (selectedTemplate.id === 'saas-sla-clause') {
      const target = formVariables.uptimeTarget || '99.9%';
      const c1 = formVariables.credit1 || '10% monthly fee';
      const c2 = formVariables.credit2 || '25% monthly fee';
      const termCond = formVariables.terminationThreshold || '3 consecutive months';

      return `SECTION: SERVICE LEVEL AGREEMENT (SLA) & AVAILABILITY COMMITMENT\n\n1. Target Uptime. Vendor commits to maintaining Service Availability of at least ${target} during each calendar month, excluding scheduled maintenance announced with at least forty-eight (48) hours notice.\n\n2. Service Credits.\n   - Availability < 99.5% but ≥ 99.0%: Client shall receive a Service Credit equal to ${c1}.\n   - Availability < 99.0%: Client shall receive a Service Credit equal to ${c2}.\n\n3. Chronic Failure Right to Terminate. In the event Service Availability drops below 99.0% for ${termCond}, Client may immediately terminate the Agreement for material breach without penalty and receive a pro-rata refund of all prepaid unearned subscription fees.\n\n4. Governing Law: Interpreted under the laws of ${jurisdiction}.`;
    } else if (selectedTemplate.id === 'limitation-liability-balanced') {
      const cap = formVariables.capMultiplier || '12 months aggregate fees';
      const superCap = formVariables.superCapMultiplier || '2x trailing 12 months';

      return `SECTION: LIMITATION OF LIABILITY & RISK ALLOCATION\n\n1. Aggregate Liability Cap. EXCEPT AS EXPRESSLY PROVIDED IN SUBSECTION 2 BELOW, EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT, WHETHER UNDER CONTRACT, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE, SHALL BE CAPPED AT ${cap.toUpperCase()}.\n\n2. Customary Carve-Outs & Super-Cap. THE LIMITATIONS IN SUBSECTION 1 SHALL NOT APPLY TO:\n   (A) EITHER PARTY'S INDEMNIFICATION OBLIGATIONS;\n   (B) GROSS NEGLIGENCE OR WILLFUL MISCONDUCT;\n   (C) INTENTIONAL BREACH OF CONFIDENTIALITY OBLIGATIONS; OR\n   (D) BREACHES OF DATA PRIVACY AND SECURITY RESULTING IN UNAUTHORIZED DISCLOSURE OF PERSONALLY IDENTIFIABLE INFORMATION, WHICH SHALL BE SUBJECT TO A SEPARATE SUPER-CAP OF ${superCap.toUpperCase()}.\n\n3. Exclusion of Consequential Damages. In no event shall either party be liable for punitive, indirect, or speculative lost profits.\n4. Venue & Law: ${jurisdiction}.`;
    } else {
      const comp = formVariables.companyName || 'Company';
      const dev = formVariables.developerName || 'Consultant';
      const date = formVariables.effectiveDate || '2026-04-01';

      return `SECTION: INTELLECTUAL PROPERTY & INVENTIONS ASSIGNMENT\n\n1. Work for Hire. Effective as of ${date}, all software code, documentation, algorithms, and technical artifacts created by ${dev} specifically for ${comp} under this engagement shall constitute a "work made for hire" under US Copyright law.\n\n2. Comprehensive Assignment. To the extent any deliverables do not qualify as a work made for hire, ${dev} irrevocably assigns to ${comp} all worldwide right, title, and interest in and to such Inventions, patents, trade secrets, and copyrights.\n\n3. Statutory Carve-Out Notice. Pursuant to California Labor Code Section 2870 (and equivalent state statutes), this assignment does not apply to any invention developed entirely on personal time without using ${comp}'s equipment, supplies, or trade secrets, unless related directly to ${comp}'s business at the time of conception.\n\n4. Governing Law: ${jurisdiction}.`;
    }
  };

  const currentDraft = getDraftedClause();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (onInsertClause) {
      onInsertClause({
        id: 'gen-' + Date.now(),
        section: 'Custom Section',
        title: selectedTemplate.title,
        text: currentDraft,
        risk: 'low',
        riskLabel: 'AI Generated (Balanced)',
        issue: `Custom drafted with ${stance} stance for ${jurisdiction}.`,
        suggestedRedline: currentDraft,
        category: selectedTemplate.category,
        isApplied: true
      });
      setInserted(true);
      setTimeout(() => setInserted(false), 2500);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              Drafting Studio
            </span>
            <span className="text-xs text-slate-400">Clause Synthesis Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-editorial">
            Contract & Clause Generator
          </h1>
          <p className="text-xs text-slate-500">
            Synthesize balanced, enterprise-ready legal provisions adapted to your preferred stance and jurisdiction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Regenerate Clause'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Template Selection & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Template Selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-600" /> Select Legal Template
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{LEGAL_TEMPLATES.length} available</span>
            </div>

            <div className="space-y-2">
              {LEGAL_TEMPLATES.map(t => (
                <div
                  key={t.id}
                  onClick={() => handleSelectTemplate(t.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    selectedTemplateId === t.id
                      ? 'bg-teal-50/50 border-teal-500 text-slate-900 ring-1 ring-teal-500/30'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-slate-800 flex items-center justify-between">
                    <span>{t.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stance & Jurisdiction Controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Sliders className="w-4 h-4 text-teal-600" /> Negotiation Stance / Bias
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pro-customer', label: 'Pro-Buyer', sub: 'Strict terms' },
                { id: 'balanced', label: 'Balanced', sub: 'Market standard' },
                { id: 'pro-vendor', label: 'Pro-Vendor', sub: 'Favorable caps' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setStance(s.id)}
                  className={`p-2 rounded-xl border text-center transition ${
                    stance === s.id
                      ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{s.label}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{s.sub}</div>
                </button>
              ))}
            </div>

            {/* Jurisdiction selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700">Target Legal Jurisdiction</label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
              >
                <option value="State of Delaware, USA">Delaware (Standard US Commercial)</option>
                <option value="State of California, USA">California (AB 1076 Compliant)</option>
                <option value="State of New York, USA">New York (Commercial Division)</option>
                <option value="England & Wales, UK">England & Wales (UK Common Law)</option>
                <option value="European Union (GDPR Harmonized)">European Union (GDPR Civil Law)</option>
              </select>
            </div>

            {/* Dynamic Template Parameters */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Clause Variables</span>
              {selectedTemplate.variables.map(v => (
                <div key={v.name} className="space-y-1">
                  <label className="text-[11px] text-slate-500">{v.label}</label>
                  <input
                    type="text"
                    value={formVariables[v.name] || ''}
                    onChange={(e) => handleInputChange(v.name, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column: Generated Clause Preview & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-600" />
                <span className="font-bold text-sm text-slate-900">Synthesized Clause Preview</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-teal-50 text-teal-700 font-mono border border-teal-200">
                  {stance.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 border border-slate-200 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleInsert}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                >
                  {inserted ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                  <span>{inserted ? 'Inserted to Contract!' : 'Insert to Active Contract'}</span>
                </button>
              </div>
            </div>

            {/* Clause Display Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[360px] font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed overflow-y-auto selection:bg-teal-500/20">
              {currentDraft}
            </div>

            {/* AI Legal Rationale Note */}
            <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-3.5 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-teal-900">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>AI Legal Enforceability Notes</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Calibrated for <strong>{jurisdiction}</strong>. This wording eliminates asymmetric commercial exposure while preserving essential remedies under prevailing commercial law.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
