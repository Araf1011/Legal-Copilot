import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Zap, 
  Mic, 
  Volume2, 
  Lock, 
  GitCompare, 
  FileCheck, 
  Eye, 
  Globe, 
  ArrowUpRight,
  Sliders,
  Check,
  Play
} from 'lucide-react';

export default function LandingPage({ onLaunchApp, onLaunchWithPrompt }) {
  const [activeTab, setActiveTab] = useState('audit');
  const [copiedPill, setCopiedPill] = useState(false);

  const capabilities = [
    {
      id: 'audit',
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
      title: 'Automated Risk Auditing',
      shortDesc: 'Scans 50+ page agreements instantly to flag asymmetric liability, unconscionable clauses, and traps.',
      tag: 'Risk Scoring'
    },
    {
      id: 'redline',
      icon: <GitCompare className="w-5 h-5 text-teal-600" />,
      title: 'Market-Standard Redlines',
      shortDesc: 'Generates balanced, reciprocal counter-proposals that protect your business while keeping negotiations moving.',
      tag: 'One-Click Adoption'
    },
    {
      id: 'statutory',
      icon: <Scale className="w-5 h-5 text-teal-600" />,
      title: 'Statutory Cross-Checking',
      shortDesc: 'Cross-benchmarks provisions against Delaware UCC § 2-719, California AB 1076, FTC Negative Option rules, and EU GDPR.',
      tag: 'Jurisprudence Engine'
    },
    {
      id: 'voice',
      icon: <Mic className="w-5 h-5 text-teal-600" />,
      title: 'Voice-First Interaction',
      shortDesc: 'Dictate complex legal queries naturally with browser speech recognition, and listen to executive audio briefings.',
      tag: 'Hands-Free Briefing'
    },
    {
      id: 'drafting',
      icon: <Sliders className="w-5 h-5 text-teal-600" />,
      title: 'Parameter-Based Drafting',
      shortDesc: 'Generate tailored clauses with adjustable stances: Pro-Buyer, Balanced Enterprise, or Pro-Vendor.',
      tag: 'Stance Controls'
    },
    {
      id: 'compliance',
      icon: <FileCheck className="w-5 h-5 text-teal-600" />,
      title: 'Regulatory Matrix (GDPR / SOC 2)',
      shortDesc: 'Validates Data Processing Agreements against GDPR Article 28 mandatory terms and SOC 2 Type II audit covenants.',
      tag: 'Continuous Audit'
    }
  ];

  const samplePrompts = [
    {
      label: 'Can AI replace legal analysis?',
      category: 'Jurisprudence Strategy',
      prompt: 'Can AI replace legal analysis?'
    },
    {
      label: 'Audit 1-month SaaS liability cap vs Delaware UCC',
      category: 'Liability Exposure',
      prompt: 'Analyze Enterprise Cloud SaaS Master Services Agreement Section 8.1 for Delaware UCC § 2-719 enforceability and unilateral indemnification.'
    },
    {
      label: 'Strike predatory 36-month certified mail auto-renewal',
      category: 'Commercial Traps',
      prompt: 'Draft a balanced counter-proposal for Section 3.2 36-month automatic renewal and certified mail requirements.'
    },
    {
      label: 'GDPR Article 28 AI model training restrictions',
      category: 'Data Privacy & AI Risk',
      prompt: 'Analyze data rights clause: does the vendor have the right to ingest our confidential data to train their proprietary AI models?'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900 relative overflow-x-hidden">
      
      {/* Background Translucent Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-teal-200/25 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-20 right-1/4 w-[420px] h-[420px] bg-cyan-100/35 rounded-full blur-3xl opacity-80" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onLaunchApp}>
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Scale className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-slate-900">Legal Copilot</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold border border-teal-200/70">
                v2.5 AI
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600">
            <a href="#capabilities" className="hover:text-slate-950 transition">Capabilities</a>
            <a href="#how-it-works" className="hover:text-slate-950 transition">How It Works</a>
            <a href="#demo" className="hover:text-slate-950 transition">Live Redline Demo</a>
            <a href="#security" className="hover:text-slate-950 transition">Security & Privacy</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onLaunchApp}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100/80 transition hidden sm:inline-block"
            >
              Sign In
            </button>
            <button 
              onClick={onLaunchApp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs hover:shadow-teal-600/20 transition group"
            >
              <span>Try Legal Copilot</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center relative">
        
        {/* Subtle Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-teal-200/90 shadow-2xs text-xs text-teal-800 font-medium mb-7 animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          <span>Next-Generation Commercial Jurisprudence • Powered by Gemini 2.5</span>
        </div>

        {/* Editorial Serif Headline */}
        <h1 className="font-editorial text-4xl sm:text-6xl lg:text-[68px] font-bold text-slate-900 tracking-tight max-w-4xl leading-[1.1] mb-6">
          The AI counsel that redlines contracts{' '}
          <span className="italic font-normal text-teal-700 underline decoration-teal-300 decoration-wavy decoration-1 underline-offset-8">
            in seconds
          </span>
          , not hours.
        </h1>

        {/* Supporting Subheadline */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-9">
          Instant clause risk scoring, asymmetric liability detection, and real-time market-standard redlines. Built for General Counsel, In-House Legal, and Fast-Moving Deal Teams.
        </p>

        {/* Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-14">
          <button 
            onClick={onLaunchApp}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 transition transform active:scale-95 group"
          >
            <span>Try Legal Copilot</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition" />
          </button>

          <button 
            onClick={onLaunchApp}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium shadow-2xs flex items-center justify-center gap-2 transition"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Open Sample SaaS MSA</span>
          </button>
        </div>

        {/* Key Metrics / Trust Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 pt-4 border-t border-slate-200/60 max-w-4xl w-full text-left sm:text-center">
          <div>
            <div className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900">85%</div>
            <div className="text-xs text-slate-500 mt-0.5">Faster contract turnaround</div>
          </div>
          <div>
            <div className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900">100%</div>
            <div className="text-xs text-slate-500 mt-0.5">Delaware UCC & GDPR aligned</div>
          </div>
          <div>
            <div className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900">$120k+</div>
            <div className="text-xs text-slate-500 mt-0.5">Avg outside counsel savings</div>
          </div>
          <div>
            <div className="font-editorial text-2xl sm:text-3xl font-bold text-teal-700">Zero</div>
            <div className="text-xs text-slate-500 mt-0.5">Model training on your data</div>
          </div>
        </div>

      </section>

      {/* Live Interactive Hero Showcase / Contract Preview */}
      <section id="demo" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden transition-all">
          
          {/* Card Top Chrome */}
          <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="h-4 w-[1px] bg-slate-300 mx-1" />
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>Enterprise Cloud SaaS Master Services Agreement.docx</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                <span>Risk Score: 42/100 (Critical)</span>
              </span>
            </div>
          </div>

          {/* Interactive Split View: Original vs. AI Redline */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/90 p-6 sm:p-8 gap-8">
            
            {/* Left: Original Predatory Clause */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wide">
                    Section 8.1 • Limitation of Liability
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
                    Predatory Asymmetry
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-xs text-slate-700 leading-relaxed font-mono relative">
                <p className="line-through text-rose-800/80 decoration-rose-500 decoration-1">
                  IN NO EVENT SHALL VENDOR’S TOTAL AGGREGATE LIABILITY EXCEED TOTAL AMOUNTS ACTUALLY PAID BY CLIENT IN THE ONE (1) MONTH PRECEDING THE CLAIM. VENDOR DISCLAIMS ALL LIABILITY FOR GROSS NEGLIGENCE, DATA LOSS, AND SECURITY BREACHES.
                </p>
                <div className="mt-3 text-[11px] text-rose-700 font-sans font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Flagged: 1-month cap disclaiming gross negligence violates Delaware UCC § 2-719 enforceability standards.</span>
                </div>
              </div>
            </div>

            {/* Right: AI Market-Standard Redline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-800 uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>AI Recommended Redline</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">
                    Market Standard
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-slate-800 leading-relaxed font-mono relative">
                <p className="text-slate-900 font-medium">
                  EACH PARTY’S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL BE MUTUALLY CAPPED AT TOTAL FEES PAID OR PAYABLE IN THE PRECEDING TWELVE (12) MONTHS. NEITHER PARTY SHALL BE CAPPED WITH RESPECT TO GROSS NEGLIGENCE, WILLFUL MISCONDUCT, OR DATA BREACHES.
                </p>
                <div className="mt-3 text-[11px] text-teal-800 font-sans font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Balanced 12-month mutual trailing cap protects both parties while maintaining deal velocity.</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Ready to adopt in your negotiation draft?
                </span>
                <button 
                  onClick={onLaunchApp}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Redline in App</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* "What Legal Copilot Can Do" (6 Core Capabilities) */}
      <section id="capabilities" className="py-20 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 font-mono">
              Core Capabilities
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mt-2 mb-4">
              Everything in-house legal needs to review with precision.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Designed to handle the high-volume mechanical review of B2B agreements, commercial MSAs, and vendor contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => (
              <div 
                key={cap.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center group-hover:scale-105 transition">
                      {cap.icon}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {cap.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-2 group-hover:text-teal-700 transition">
                    {cap.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {cap.shortDesc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-700 group-hover:underline flex items-center gap-1 cursor-pointer" onClick={onLaunchApp}>
                    <span>Try in Copilot</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* "How It Works" 3-Step Process */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 font-mono">
            Simple 3-Step Workflow
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2 mb-3">
            From ingestion to counter-offer in minutes.
          </h2>
          <p className="text-slate-600 text-sm">
            No complex configuration. Drop your contract in and start analyzing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-2xs relative">
            <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold text-sm flex items-center justify-center mb-5">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Ingest Agreement</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Upload PDF or DOCX agreements, paste raw contract clauses, or select pre-loaded templates (SaaS MSA, Mutual NDA, DPA).
            </p>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              ✓ Multi-format parsing • Instant extraction
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-2xs relative">
            <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold text-sm flex items-center justify-center mb-5">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Asymmetric Risk Audit</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              AI cross-evaluates every clause against state commercial codes, flagging indemnities, hidden auto-renewals, and IP training traps.
            </p>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              ✓ Delaware UCC • FTC Negative Option • GDPR
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-2xs relative">
            <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold text-sm flex items-center justify-center mb-5">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Execute & Negotiate</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Apply market-standard redlines with one click, draft counter-emails to opposing counsel, or export complete executive audit summaries.
            </p>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              ✓ Markdown • Print Audit • Clean DOCX Ready
            </div>
          </div>

        </div>

      </section>

      {/* Interactive "Try a Prompt" Live Sandbox */}
      <section className="py-20 bg-teal-900 text-white relative overflow-hidden">
        
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800 border border-teal-700 text-xs text-teal-200 font-medium mb-4">
            <Zap className="w-3.5 h-3.5 text-teal-400" />
            <span>Interactive Live Prompts</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Test Legal Copilot with one click.
          </h2>
          <p className="text-teal-200 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Click any legal inquiry below to immediately launch Legal Copilot and see real-time streaming analysis in action.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {samplePrompts.map((p, idx) => (
              <div 
                key={idx}
                onClick={() => onLaunchWithPrompt ? onLaunchWithPrompt(p.prompt) : onLaunchApp()}
                className="bg-teal-800/60 hover:bg-teal-800/90 border border-teal-700/80 hover:border-teal-400/50 p-4 rounded-2xl cursor-pointer transition transform hover:-translate-y-0.5 group"
              >
                <div className="flex items-center justify-between text-xs text-teal-300 mb-1.5 font-mono">
                  <span>{p.category}</span>
                  <ArrowUpRight className="w-4 h-4 text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
                <div className="text-sm font-semibold text-white group-hover:text-teal-100 transition">
                  "{p.label}"
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Enterprise Security & Confidentiality */}
      <section id="security" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-teal-700 mb-2">
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              <span>Enterprise Grade Confidentiality</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Your agreements remain 100% confidential.
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Legal documents contain sensitive trade secrets and client pricing. Legal Copilot strictly enforces zero model training on customer contracts, ephemeral browser sessions, and private enterprise LLM routing.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-600" /> SOC 2 Aligned
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-600" /> Zero Data Retention
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-600" /> Client-Side Encryption
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <button 
              onClick={onLaunchApp}
              className="w-full md:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-black text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          Ready to supercharge your commercial contract review?
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8">
          Stop spending 6 hours reviewing a 40-page contract. Join modern in-house counsels who accelerate deals with Legal Copilot.
        </p>

        <button 
          onClick={onLaunchApp}
          className="px-8 py-4 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold shadow-xl shadow-teal-700/25 inline-flex items-center gap-2.5 transition transform hover:scale-105 active:scale-95"
        >
          <span>Try Legal Copilot — It's Free</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
        <p className="text-xs text-slate-400 mt-3 font-mono">
          No credit card required • Pre-loaded with enterprise agreements
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-800">Legal Copilot AI</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-400 max-w-md">
            Disclaimer: Legal Copilot provides automated decision intelligence and clause analysis. It does not provide formal legal representation or create an attorney-client relationship.
          </div>

        </div>
      </footer>

    </div>
  );
}
