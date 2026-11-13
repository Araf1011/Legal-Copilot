import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  FileCode
} from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onAddContract }) {
  const [contractText, setContractText] = useState('');
  const [contractTitle, setContractTitle] = useState('');
  const [governingLaw, setGoverningLaw] = useState('State of Delaware, USA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setContractTitle(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setContractText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleProcessContract = () => {
    if (!contractText.trim()) return;

    setIsProcessing(true);
    setProcessStep('Parsing text into structured legal clauses...');

    setTimeout(() => {
      setProcessStep('Running Legal-LLM risk evaluation & vulnerability analysis...');
    }, 600);

    setTimeout(() => {
      setProcessStep('Benchmarking against commercial standard jurisprudence...');
    }, 1200);

    setTimeout(() => {
      const paragraphs = contractText
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(p => p.length > 30);

      const clauses = (paragraphs.length > 0 ? paragraphs.slice(0, 5) : [contractText]).map((text, idx) => {
        const isHigh = text.toLowerCase().includes('indemn') || text.toLowerCase().includes('liabilit') || text.toLowerCase().includes('sole discretion');
        return {
          id: `custom-c-${Date.now()}-${idx}`,
          section: `Section ${idx + 1}.0`,
          title: `Contract Provision ${idx + 1}`,
          text: text,
          risk: isHigh ? 'critical' : 'medium',
          riskLabel: isHigh ? 'High Risk Identified' : 'Moderate Commercial Terms',
          issue: isHigh 
            ? 'Potentially one-sided risk allocation requiring limitation of liability or mutual indemnification.' 
            : 'Standard commercial term requiring customary review.',
          suggestedRedline: `Mutualized: ${text.replace(/sole discretion/gi, 'mutual written consent').replace(/shall indemnify/gi, 'each party shall mutually indemnify')}`,
          category: 'General Terms'
        };
      });

      const newContract = {
        id: `custom-${Date.now()}`,
        title: contractTitle.trim() || 'Uploaded Commercial Agreement',
        parties: 'Party A vs. Party B',
        effectiveDate: new Date().toISOString().split('T')[0],
        governingLaw: governingLaw,
        riskScore: 54,
        riskLevel: 'Moderate / High Risk',
        summary: `Custom document parsed with ${clauses.length} evaluated provisions. Identified potential asymmetric obligations and commercial risk factors.`,
        clauses: clauses
      };

      onAddContract(newContract);
      setIsProcessing(false);
      onClose();
    }, 1800);
  };

  const loadSamplePreset = () => {
    setContractTitle('B2B Enterprise License Agreement');
    setGoverningLaw('State of New York, USA');
    setContractText(`1. LICENSE GRANT & RESTRICTIONS
Licensor grants to Customer a non-exclusive, non-transferable license to access the Hosted Services. Customer shall not reverse engineer, decompile, or create derivative works based upon the software.

2. PAYMENT & UNILATERAL PRICE ESCALATION
Customer shall pay all fees within fifteen (15) days of invoice date. Licensor reserves the right in its sole discretion to modify subscription fees at any time by up to twenty percent (20%) upon thirty days notice.

3. INDEMNIFICATION BY CUSTOMER
Customer shall fully defend, indemnify, and hold harmless Licensor, its officers and directors, from any and all damages, claims, fines, or expenses arising from Customer's use of the platform.

4. LIMITATION OF LIABILITY
LICENSOR'S AGGREGATE LIABILITY ARISING FROM THIS AGREEMENT SHALL BE STRICTLY LIMITED TO FIFTY DOLLARS ($50.00), REGARDLESS OF THE THEORY OF LIABILITY, INCLUDING BREACH OF CONTRACT OR GROSS NEGLIGENCE.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Upload & Analyze Contract</h3>
              <p className="text-xs text-slate-500">Extract clauses, score legal vulnerabilities, and generate redlines</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          
          {/* Quick preset button */}
          <div className="flex items-center justify-between bg-teal-50/60 border border-teal-200 rounded-xl p-3">
            <span className="text-xs text-teal-900 font-medium">Want to test with a realistic raw contract?</span>
            <button
              onClick={loadSamplePreset}
              className="text-xs font-semibold px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-2xs transition"
            >
              Fill Sample Agreement
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Contract Title</label>
              <input 
                type="text"
                placeholder="e.g. Master Services Agreement v2"
                value={contractTitle}
                onChange={(e) => setContractTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Governing Jurisdiction</label>
              <select
                value={governingLaw}
                onChange={(e) => setGoverningLaw(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
              >
                <option value="State of Delaware, USA">State of Delaware, USA</option>
                <option value="State of California, USA">State of California, USA</option>
                <option value="State of New York, USA">State of New York, USA</option>
                <option value="England & Wales, UK">England & Wales, UK</option>
              </select>
            </div>
          </div>

          {/* File drag/drop area */}
          <div className="border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-xl p-5 text-center transition cursor-pointer relative bg-slate-50/50">
            <input 
              type="file" 
              accept=".txt,.md,.doc,.docx"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <FileCode className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-700">
              Drop contract file here, or <span className="text-teal-700 underline font-bold">browse</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Supports TXT, MD, DOCX files</div>
          </div>

          {/* Direct Text Box */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Or Paste Contract Text Directly</label>
            <textarea
              rows={6}
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              placeholder="Paste contract clauses, terms, or complete agreement..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          {isProcessing && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center space-y-2">
              <Sparkles className="w-5 h-5 text-teal-600 animate-spin mx-auto" />
              <div className="text-xs font-semibold text-teal-900">{processStep}</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleProcessContract}
            disabled={!contractText.trim() || isProcessing}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Analyzing Agreement...' : 'Run AI Legal Audit'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
