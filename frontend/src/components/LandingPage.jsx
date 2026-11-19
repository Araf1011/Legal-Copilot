import React, { useState, useRef, useEffect } from 'react';
import {
  Scale,
  ShieldCheck,
  FileText,
  Sparkles,
  ArrowRight,
  BookOpen,
  MapPin,
  Phone,
  Search,
  Gavel,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Compass,
  FileCheck,
  Award,
  ScrollText,
  Navigation,
  Clock,
  Landmark,
  BadgeCheck,
  ArrowUpRight,
  HelpCircle,
  FolderLock,
  Globe,
  Check,
  User,
  Home,
  SlidersHorizontal,
  PhoneCall,
  Mic,
  MicOff,
  Copy,
  Radio,
  FileCode,
  AlertCircle
} from 'lucide-react';
import bangladeshLegalRulesBg from '../assets/bangladesh-green-nature-map.jpg';
import BangladeshLegalMap from './BangladeshLegalMap';

export default function LandingPage({ onLaunchApp, onLaunchWithPrompt }) {
  // Navigation tabs: 'home' | 'law' | 'locator' | 'helpline'
  const [currentTab, setCurrentTab] = useState('home');
  // Default language is Bengali as per reference UI
  const [lang, setLang] = useState('bn'); // 'bn' | 'en'
  const [searchQuery, setSearchQuery] = useState('');
  const [lawFilter, setLawFilter] = useState('all');
  const [selectedDivision, setSelectedDivision] = useState('dhaka');

  // Navigation dropdown states
  const [isLawDropdownOpen, setIsLawDropdownOpen] = useState(false);
  const [isLocatorDropdownOpen, setIsLocatorDropdownOpen] = useState(false);

  // Feature 5: Real-time voice legal inquiry (English & Bengali)
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');
  const recognitionRef = useRef(null);

  // Feature 1: Interactive Live Legal Simulator
  const [simulatorTab, setSimulatorTab] = useState('ni138'); // 'ni138' | 'gd377' | 'labour26' | 'bail497'
  const [copiedDraft, setCopiedDraft] = useState(false);

  const isEn = lang === 'en';

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === 'bn' ? 'bn-BD' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice(lang === 'bn' ? 'শুনছি... আপনার আইনি প্রশ্ন বলুন' : 'Listening... Speak your legal query');
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join('');
        setSearchQuery(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceNotice('');
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice(lang === 'bn' ? 'মাইক্রোফোন সংযোগ ব্যর্থ' : 'Microphone unavailable');
        setTimeout(() => setVoiceNotice(''), 3000);
      };

      recognitionRef.current = recognition;
    }
  }, [lang]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert(isEn ? 'Speech recognition is not supported in this browser. Please use Google Chrome or Edge.' : 'এই ব্রাউজারে ভয়েস সমর্থন করে না। অনুগ্রহ করে ক্রোম বা এজ ব্যবহার করুন।');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
        recognitionRef.current.start();
      } catch (err) {
        recognitionRef.current.stop();
      }
    }
  };

  const handleCopyDraft = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const switchTab = (tab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Translations
  const t = {
    badge: isEn
      ? 'Sovereign Statutory Intelligence • Bangladesh Jurisprudence'
      : 'গণপ্রজাতন্ত্রী বাংলাদেশ আইন ও বিচারিক অনুসন্ধান প্ল্যাটফর্ম • AI Jurisprudence',
    heroTitlePart1: isEn
      ? 'AI Legal Counsel for Bangladesh Law & '
      : 'বাংলাদেশের আইন, আদালত ও বিধিমালার জন্য ',
    heroTitleAccent: isEn
      ? 'Commercial Practice'
      : 'নিখুঁত',
    heroTitleLine2: isEn
      ? ''
      : 'আইনি সহায়তা',
    heroSub: isEn
      ? 'Instant clause risk auditing, statutory cross-referencing across 500+ Bangladesh Acts, procedural criminal & civil guidance, and territorial court-station jurisdiction.'
      : 'দণ্ডবিধি, ফৌজদারি কার্যবিধি (CrPC), চুক্তি আইন ও এনআই অ্যাক্টসহ ৫০০+ বাংলাদেশ গেজেট স্ট্যাটিউট্যের ধারাভিত্তিক ব্যাখ্যা, আইনি নোটিশ খসড়া ও এখতিয়ারভিত্তিক থানা-আদালত নির্দেশনা।',
    docketTitle: isEn ? 'LEGAL QUERY DESK' : 'আইনি প্রশ্ন অনুসন্ধান (LEGAL QUERY DESK)',
    searchPlaceholder: isEn
      ? 'e.g. Legal steps for check dishonor under NI Act § 138, or Bail under CrPC § 497...'
      : 'যেমন: চেক বাউন্স হলে ধারা ১৩৮ অনুযায়ী করণীয় কী? অথবা জামিনের আবেদন...',
    searchBtn: isEn ? 'Search Law' : 'আইন খুঁজুন',
    popularQueriesLabel: isEn ? 'Popular inquiries:' : 'জনপ্রিয় অনুসন্ধান:',
    navHome: isEn ? 'Home' : 'হোম',
    navLaw: isEn ? 'Laws & Regulations' : 'আইন ও বিধিমালা',
    navLocator: isEn ? 'Courts & Police Stations' : 'আদালত ও থানা',
    navHelpline: isEn ? 'Helplines' : 'হেল্পলাইন',
    navProfile: isEn ? 'Profile' : 'প্রোফাইল',
    navCta: isEn ? 'Start Copilot' : 'কোপাইলট শুরু করুন',
    stat1Val: isEn ? '500+ Acts' : '৫০০+ আইন',
    stat1Label: isEn ? 'Bangladesh Gazette Statutes' : 'বাংলাদেশ গেজেট ও আইন',
    stat2Val: isEn ? '64 Districts' : '৬৪ জেলা',
    stat2Label: isEn ? 'Courts & Police Jurisdiction' : 'আদালত ও পুলিশ এখতিয়ার',
    stat3Val: isEn ? '16430' : '১৬৪৩০',
    stat3Label: isEn ? 'Free Govt Legal Aid' : 'বিনামূল্যে সরকারি আইনি সহায়তা',
    stat4Val: isEn ? '100%' : '\u09E7\u09E6\u09E6%',
    stat4Label: isEn ? 'Statute Reference Verified' : 'ধারাভিত্তিক রেফারেন্স ভেরিফাইড',
    lawSectionBadge: isEn ? 'Corpus Juris • Statutes & Penal Codes' : 'আইন ও সংবিধি আর্কাইভ • Corpus Juris',
    lawSectionTitle: isEn ? 'Bangladesh Acts & Statutory Corpus' : 'বাংলাদেশের প্রধান আইন ও সংবিধি ভাণ্ডার',
    lawSectionSub: isEn
      ? 'Cross-benchmark your legal inquiries against official Ministry of Law (BD Laws) gazettes, sections, and authoritative precedents.'
      : 'আইন মন্ত্রণালয় এবং বিডি লজ (BD Laws) গেজেট অনুসারে প্রণীত প্রতিটি আইনের প্রাসঙ্গিক ধারা, দণ্ডবিধি ও আদালতের নজির পর্যালোচনা করুন।',
    locatorBadge: isEn ? 'Judicial & Territorial Directory' : 'আদালত ও থানা নির্দেশিকা • Jurisdiction',
    locatorTitle: isEn ? 'Court & Police Station Locator' : 'আদালত ও থানা এখতিয়ার নির্দেশিকা',
    locatorSub: isEn
      ? 'Know exactly where to file a General Diary (GD), First Information Report (FIR), or direct Magistrate Complaint Case (C.R. Case).'
      : 'কোন ঘটনায় থানায় সাধারণ ডায়েরি (GD) করতে হবে এবং কোন অপরাধে সরাসরি সিএমএম কোর্টে মামলা (C.R. Case) দায়ের করবেন — বিস্তারিত এখতিয়ার তালিকা।',
    gdTitle: isEn ? 'General Diary (GD)' : 'সাধারণ ডায়েরি (General Diary)',
    gdCode: isEn ? 'PRB Regulation 377 • Non-Cognizable' : 'পুলিশ প্রবিধান (PRB) ৩৭৭ • অহস্তান্তরযোগ্য',
    gdDesc: isEn
      ? 'File at the local police station for loss of documents, security threats, civil disputes, or non-cognizable incidents.'
      : 'হুমকি প্রদর্শন, মূল্যবান জিনিসপত্র বা দলিল হারানো, নিরাপত্তা শঙ্কা কিংবা অহস্তান্তরযোগ্য অপরাধের ক্ষেত্রে সংশ্লিষ্ট থানায় তাৎক্ষণিক জিডি করুন।',
    firTitle: isEn ? 'First Information Report (FIR)' : 'প্রথম তথ্য বিবরণী (এজাহার / FIR)',
    firCode: isEn ? 'CrPC Section 154 • Cognizable Offenses' : 'CrPC ধারা ১৫৪ • আমলযোগ্য অপরাধ',
    firDesc: isEn
      ? 'Formal complaint submitted to the Police Station Officer-in-Charge for serious cognizable crimes (robbery, assault, murder).'
      : 'ডাকাতি, খুন, ধর্ষণ, অপহরণ কিংবা গুরুতর আঘাতের মতো আমলযোগ্য অপরাধ সংঘটিত হলে থানার ওসির নিকট এজাহার পেশ করা হয়।',
    crTitle: isEn ? 'Direct Court Complaint (C.R. Case)' : 'সরাসরি কোর্ট মামলা (Complaint Case)',
    crCode: isEn ? 'CrPC Section 200 • Magistrate Courts' : 'CrPC ধারা ২০০ • ম্যাজিস্ট্রেট আদালত',
    crDesc: isEn
      ? 'Filed directly before the Judicial / Metropolitan Magistrate when police decline to register an FIR or for NI Act § 138 check dishonor.'
      : 'থানা মামলা না নিলে কিংবা চেক ডিজঅনার (NI Act § 138), যৌতুক ও পারিবারিক বিরোধে সরাসরি সংশ্লিষ্ট জুডিশিয়াল বা সিএমএম আদালতে নালিশি মামলা।',
    helplineBadge: isEn ? 'National Legal Aid & Emergency Hotlines' : 'জরুরি সেবা ও আইনি সহায়তা • Emergency Legal Aid',
    helplineTitle: isEn ? 'Official Bangladesh Legal Aid & Emergency Helplines' : 'বাংলাদেশ জাতীয় আইনি সহায়তা ও জরুরি হটলাইন',
    helplineSub: isEn
      ? 'Dial these government toll-free hotlines for immediate legal advice, criminal defense aid, and emergency police interventions.'
      : 'আইনি সংকটে তাৎক্ষণিক সরকারি পরামর্শ ও পুলিশের সহায়তা পেতে নিচের টোল-ফ্রি নম্বরগুলোতে ডায়াল করুন।'
  };

  // Popular prompt chips
  const popularChips = isEn
    ? [
        { label: 'NI Act § 138 (Check Bounce)', query: 'What legal steps must be taken within 30 days of check dishonor under NI Act Section 138 in Bangladesh?' },
        { label: 'Bail under CrPC § 497', query: 'What are the conditions for obtaining bail in non-bailable offenses under CrPC Section 497 in Bangladesh?' },
        { label: 'Fraud & Breach § 420/406', query: 'What are the essential ingredients of Penal Code Section 420 (Cheating) and Section 406 (Criminal Breach of Trust)?' },
        { label: 'Termination & Gratuity', query: 'Under Bangladesh Labour Act 2006, what notice period and severance benefits are mandated for employee termination?' },
        { label: 'GD vs FIR Distinction', query: 'Explain the legal difference between filing a General Diary (GD) and an FIR in Bangladesh with CrPC references.' }
      ]
    : [
        { label: 'ধারা ১৩৮ (NI Act)', query: 'চেক ডিজঅনার হলে নেগোশিয়েবল ইনস্ট্রুমেন্টস অ্যাক্ট এর ধারা ১৩৮ অনুযায়ী কী পদক্ষেপ নিতে হবে? নোটিশের সময়সীমা কত?' },
        { label: 'জামিন ধারা ৪৯৭ (CrPC)', query: 'জামিনযোগ্য ও অজামিনযোগ্য অপরাধের মধ্যে পার্থক্য কী এবং ফৌজদারি কার্যবিধির ধারা ৪৯৬ ও ৪৯৭ অনুযায়ী জামিন পাওয়ার শর্তগুলো কী?' },
        { label: 'ধারা ৪২০ (প্রতারণা)', query: 'দণ্ডবিধি ১৮৬০ এর ধারা ৪০৬ (অপরাধমূলক বিশ্বাসভঙ্গ) এবং ধারা ৪২০ (প্রতারণা) এর মূল উপাদান এবং মামলার প্রক্রিয়া কী?' },
        { label: 'শ্রম আইন বরখাস্ত', query: 'বাংলাদেশ শ্রম আইন ২০০৬ অনুযায়ী কোনো কর্মীকে অব্যাহতি দিলে কত দিনের নোটিশ বা নোটিশ পে দিতে হয় এবং গ্র্যাচুইটি পাওয়ার নিয়ম কী?' },
        { label: 'জিডি বনাম এফআইআর', query: 'ফৌজদারি কার্যবিধি ১৮৯৮ অনুযায়ী জিডি ও এফআইআর এর মধ্যে পার্থক্য এবং প্রক্রিয়া কী?' }
      ];

  // Feature 1: Interactive Live Legal Simulator Scenarios
  const simulatorScenarios = {
    ni138: {
      id: 'ni138',
      tabLabel: isEn ? 'NI Act § 138 (Cheque Bounce)' : 'এনআই অ্যাক্ট ধারা ১৩৮ (চেক ডিজঅনার)',
      title: isEn ? 'Cheque Dishonour Legal Demand Notice' : 'চেক ডিজঅনারের সংবিধিবদ্ধ আইনি নোটিশ',
      statute: 'Negotiable Instruments Act, 1881 § 138 & § 141',
      badge: isEn ? 'Banking & Criminal' : 'ব্যাংকিং ও ফৌজদারি',
      facts: [
        { label: isEn ? 'Cheque Amount' : 'চেকের পরিমাণ', value: 'BDT 1,500,000 (১৫ লক্ষ টাকা)' },
        { label: isEn ? 'Cheque & Bank' : 'চেক ও ব্যাংক', value: 'CQ-982341 • City Bank Ltd. (Gulshan)' },
        { label: isEn ? 'Return Reason' : 'প্রত্যাখ্যানের কারণ', value: isEn ? 'Insufficient Funds' : 'তহবিল অপ্রতুল (Insufficient Funds)' },
        { label: isEn ? 'Statutory Window' : 'আইনি সময়সীমা', value: isEn ? 'Must issue notice within 30 days of memo' : 'মেমো প্রাপ্তির ৩০ দিনের মধ্যে নোটিশ প্রেরণ আবশ্যক' }
      ],
      draftHeading: isEn ? 'STATUTORY DEMAND NOTICE UNDER SECTION 138 OF NI ACT, 1881' : 'এনআই অ্যাক্ট ১৮৮১-এর ধারা ১৩৮ অনুযায়ী আইনি নোটিশ',
      draftBody: isEn
        ? `REGISTERED WITH A/D & COURIER SERVICE
To: Md. Rafiqul Islam, Managing Director, Apex Trading Ltd., Motijheel C/A, Dhaka.

SUBJECT: LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 FOR PAYMENT OF CHEQUE NO. CQ-982341 FOR BDT 1,500,000/-.

Sir,
Under instruction from my client, Mr. Tanvir Ahmed, I hereby serve upon you this Statutory Legal Notice:

1. In discharge of your existing lawful debt, you issued Cheque No. CQ-982341 dated 05/11/2026 for BDT 1,500,000/- drawn on City Bank Ltd.
2. Upon presentment, the cheque was returned dishonoured on 12/11/2026 with remark "INSUFFICIENT FUNDS".
3. YOU ARE HEREBY CALLED UPON to pay the entire sum of BDT 1,500,000/- within thirty (30) days from the receipt of this notice, failing which my client shall proceed to file a criminal Complaint Case (C.R. Case) before the competent Chief Metropolitan Magistrate (CMM) Court under Section 138 of the NI Act, 1881, where you will be liable for imprisonment up to 1 (one) year and/or fine up to three times the cheque amount.`
        : `রেজিস্ট্রি ডাক ও কুরিয়ারযোগে প্রেরিত
প্রাপক: মো: রফিকুল ইসলাম, ব্যবস্থাপনা পরিচালক, অ্যাপেক্স ট্রেডিং লিমিটেড, মতিঝিল বা/এ, ঢাকা।

বিষয়: হস্তান্তরযোগ্য দলিল আইন (NI Act), ১৮৮১-এর ধারা ১৩৮ মোতাবেক ১৫,০০,০০০/- টাকার চেক ডিজঅনার বাবদ আইনি নোটিশ।

জনাব,
আমার মক্কেল জনাব তানভীর আহমেদ-এর নির্দেশক্রমে আপনাকে জানানো যাচ্ছে যে:
১. আপনার আইনসঙ্গত ঋণ পরিশোধের লক্ষ্যে আপনি দ্য সিটি ব্যাংক লি: গুলশান শাখার অনুকূলে ১৫,০০,০০০/- টাকার চেক নং CQ-982341 প্রদান করেন।
২. মক্কেল কর্তৃক ব্যাংকে উপস্থাপন করা হলে গত ১২/১১/২০২৬ তারিখে "অপর্যাপ্ত তহবিল" কারণে চেকটি ডিজঅনার হয়।
৩. অতএব, এই নোটিশ প্রাপ্তির ৩০ (ত্রিশ) দিনের মধ্যে উক্ত ১৫,০০,০০০/- টাকা পরিশোধ করার নির্দেশ দেওয়া হলো। অন্যথায় সংশ্লিষ্ট মেট্রোপলিটন ম্যাজিস্ট্রেট (CMM) আদালতে আপনার বিরুদ্ধে সরাসরি ফৌজদারি মামলা দায়ের করা হবে, যার ফলে আইন অনুযায়ী ১ বছর পর্যন্ত কারাদণ্ড অথবা চেকের ৩ গুণ পর্যন্ত অর্থদণ্ড হতে পারে।`,
      keyTakeaways: [
        isEn ? 'Mandatory 30-day notice period before filing C.R. Case' : 'মামলা দায়েরের পূর্বে নোটিশের ৩০ দিনের সময়সীমা অতিবাহিত হওয়া বাধ্যতামূলক',
        isEn ? 'Maximum punishment: 1-year imprisonment & 3x cheque value' : 'সর্বোচ্চ শাস্তি: ১ বছর কারাদণ্ড এবং চেকের মূল্যের তিন গুণ পর্যন্ত অর্থদণ্ড',
        isEn ? 'Jurisdiction: Solely Judicial Magistrate 1st Class / CMM' : 'শুধুমাত্র জুডিশিয়াল বা মেট্রোপলিটন ম্যাজিস্ট্রেট আদালত এখতিয়ারভুক্ত'
      ],
      samplePrompt: 'What are the exact statutory requirements and court timelines to file a C.R. Case under NI Act Section 138 after serving a legal notice in Bangladesh?'
    },
    gd377: {
      id: 'gd377',
      tabLabel: isEn ? 'PRB 377 (Thana GD Drafter)' : 'পিআরবি ৩৭৭ (থানায় জিডি আবেদন)',
      title: isEn ? 'General Diary (GD) Application for Lost Document' : 'মূল দলিল হারানো সংক্রান্ত সাধারণ ডায়েরি (GD) আবেদন',
      statute: 'Police Regulations of Bengal (PRB), 1943 Reg. 377',
      badge: isEn ? 'Police & Procedural' : 'পুলিশ কার্যবিধি ও সাধারণ ডায়েরি',
      facts: [
        { label: isEn ? 'Incident Type' : 'ঘটনার বিবরণ', value: isEn ? 'Loss of Original Registered Title Deed' : 'মূল জমি রেজিস্ট্রি দলিল হারিয়ে যাওয়া' },
        { label: isEn ? 'Location' : 'ঘটনাস্থল', value: isEn ? 'Dhanmondi Lake area, Road 8/A, Dhaka' : 'ধানমন্ডি লেক এলাকা, সড়ক ৮/এ, ঢাকা' },
        { label: isEn ? 'Competent Station' : 'সংশ্লিষ্ট থানা', value: 'Dhanmondi Model Thana, DMP' },
        { label: isEn ? 'Document Details' : 'দলিল নম্বর', value: 'Deed No: 4821/2018 (Dhanmondi Sub-Registry)' }
      ],
      draftHeading: isEn ? 'GENERAL DIARY (GD) ENTRY APPLICATION' : 'থানায় সাধারণ ডায়েরি (GD) করার আবেদনপত্র',
      draftBody: isEn
        ? `Date: 19 November 2026
To: The Officer-in-Charge (OC), Dhanmondi Model Thana, DMP, Dhaka.

SUBJECT: APPLICATION FOR RECORDING A GENERAL DIARY (GD) REGARDING LOSS OF ORIGINAL TITLE DEED UNDER PRB REGULATION 377.

Sir,
I, Md. Kamal Hossain, NID: 1985269123456789, residing at House 12, Road 8/A, Dhanmondi, Dhaka, hereby state as follows:

1. Today, around 11:30 AM, while commuting from Dhanmondi 27 to my residence, a file containing the ORIGINAL REGISTERED TITLE DEED (Deed No. 4821/2018, Dhanmondi Sub-Registry Office) fell from my bag and was lost.
2. Despite thorough searches, the original document could not be traced.
3. I apprehend that untoward persons may misuse the said lost deed for fraudulent or unlawful purposes.

I therefore request you to record this matter as a General Diary entry in your Thana Register under PRB Regulation 377 and issue a stamped copy for official land records and paper publication.`
        : `তারিখ: ১৯ নভেম্বর ২০২৬
বরাবর, অফিসার ইনচার্জ (OC), ধানমন্ডি মডেল থানা, ডিএমপি, ঢাকা।

বিষয়: মূল্যবান মূল দলিল হারানো মর্মে সাধারণ ডায়েরি (GD) লিপিবদ্ধকরণের আবেদন।

জনাব,
আমি নিম্নস্বাক্ষরকারী মো: কামাল হোসেন, জাতীয় পরিচয়পত্র নং ১৯৮৫২৬৯১২৩৪৫৬৭৮৯, বাড়ি ১২, রোড ৮/এ, ধানমন্ডি, ঢাকা—এই মর্মে জানাচ্ছি যে:
১. অদ্য সকাল আনুমানিক ১১:৩০ ঘটিকায় ধানমন্ডি ২৭ থেকে বাসায় আসার পথে আমার ধানমন্ডি সাব-রেজিস্ট্রি অফিসের মূল ক্রয় দলিল (দলিল নং ৪৮২১/২০১৮) বহনকারী ফাইলটি হারিয়ে যায়।
২. সম্ভাব্য সকল স্থানে খোঁজাখুঁজি করিয়াও উক্ত দলিল পাওয়া যায়নি।
৩. উক্ত দলিল কোনো কুচক্রী মহলের হাতে পড়িলে অসদুপায়ে প্রতারণামূলক কাজে ব্যবহারের আশঙ্কা রহিয়াছে।

অতএব, বিষয়টি আপনার থানার জেনারেল ডায়েরিতে লিপিবদ্ধ করিয়া প্রয়োজনীয় আইনানুগ ব্যবস্থা গ্রহণে মর্জি হয়।`,
      keyTakeaways: [
        isEn ? 'Two identical printouts required: 1 for Thana, 1 signed receipt for applicant' : '২ কপি আবেদন জমা দিন: ১ কপি থানায় থাকবে, অন্য কপি রিসিভ সিলসহ আবেদনকারী পাবেন',
        isEn ? 'No government fee or court stamp required for general diary entry' : 'থানায় জিডি করার জন্য সরকারি কোনো ফি বা কোর্ট ফি প্রযোজ্য নয়',
        isEn ? 'Essential pre-requisite for certified copy from Sub-Registry Office' : 'সাব-রেজিস্ট্রি অফিস থেকে ডুপ্লিকেট বা সার্টিফাইড কপি উত্তোলনের জন্য জিডি আবশ্যক'
      ],
      samplePrompt: 'What is the full legal procedure for filing a General Diary (GD) in a police station under PRB 377, and what to do if police refuse to register it?'
    },
    labour26: {
      id: 'labour26',
      tabLabel: isEn ? 'Labour Act § 26 (Termination Benefits)' : 'শ্রম আইন ধারা ২৬ (চাকরি অবসান ও পাওনা)',
      title: isEn ? 'Statutory Termination Severance & Gratuity Audit' : 'শ্রমিক অবসান সুবিধা ও গ্র্যাচুইটি অডিট',
      statute: 'Bangladesh Labour Act, 2006 (as amended) Section 26 & 27',
      badge: isEn ? 'Labour & Employment' : 'শ্রম ও কর্পোরেট কর্মসংস্থান',
      facts: [
        { label: isEn ? 'Worker Status' : 'শ্রমিকের ধরন', value: isEn ? 'Permanent Monthly-Rated Employee' : 'স্থায়ী মাসিক মজুরিভিত্তিক কর্মী' },
        { label: isEn ? 'Service Tenure' : 'চাকরির মেয়াদ', value: isEn ? '3 Years 8 Months continuous service' : '৩ বছর ৮ মাস নিরবচ্ছিন্ন চাকরি' },
        { label: isEn ? 'Basic Salary' : 'মাসিক মূল মজুরি', value: 'BDT 65,000 / month' },
        { label: isEn ? 'Cause' : 'অব্যাহতির কারণ', value: isEn ? 'Termination without disciplinary cause' : 'বিনা অপরাধে চাকরি অবসান' }
      ],
      draftHeading: isEn ? 'STATUTORY SEVERANCE & COMPENSATION COMPUTATION' : 'শ্রম আইন ধারা ২৬ অনুযায়ী বাধ্যতামূলক পাওনা ও ক্ষতিপূরণ হিসাব',
      draftBody: isEn
        ? `LEGAL AUDIT: MANDATORY TERMINATION BENEFITS UNDER LABOUR ACT 2006 (§ 26)

Under Section 26(1) of the Bangladesh Labour Act, 2006, the employer may terminate the employment of a permanent worker by giving written notice or wages in lieu thereof:

1. NOTICE PERIOD / WAGES IN LIEU (Section 26(1)):
   - Mandated: 120 Days written notice for monthly rated worker.
   - Wage in Lieu: BDT 65,000 × 4 months = BDT 260,000/-.

2. SERVICE COMPENSATION / GRATUITY (Section 26(4)):
   - Mandated: 30 days basic wages for every completed year of service (or part exceeding 6 months = 4 completed years).
   - Compensation: 4 years × BDT 65,000 = BDT 260,000/-.

3. UN-AVAILED ANNUAL LEAVE ENCASHMENT (Section 117):
   - 18 days earned leave = BDT 39,000/-.

TOTAL MANDATORY STATUTORY PAYOUT: BDT 559,000/-.
LEGAL RISK: Failure to pay full amount within 30 working days creates criminal liability under Section 287 (imprisonment and fines) and jurisdiction for Labour Court petition under Section 33.`
        : `আইনি নিরীক্ষা: শ্রম আইন ২০০৬ এর ধারা ২৬ অনুযায়ী অবসান সুবিধা ও ক্ষতিপূরণ

বাংলাদেশ শ্রম আইন, ২০০৬ এর ধারা ২৬ অনুযায়ী কোনো স্থায়ী কর্মীর চাকরি অবসান করতে হলে নিয়োগকারীকে বাধ্যতামূলকভাবে নিচের সুবিধাসমূহ প্রদান করতে হবে:

১. নোটিশ অথবা নোটিশের পরিবর্তে মজুরি (ধারা ২৬(১)):
   - মাসিক মজুরিভিত্তিক স্থায়ী শ্রমিকের ক্ষেত্রে ১২০ দিনের নোটিশ বা ৪ মাসের মজুরি।
   - নোটিশ পে: ৬৫,০০০ × ৪ = ২,৬০,০০০/- টাকা।

২. চাকরিজনিত ক্ষতিপূরণ / গ্র্যাচুইটি (ধারা ২৬(৪)):
   - প্রতি পূর্ণ বছর বা ৬ মাসের অধিক সময়ের জন্য ৩০ দিনের মূল মজুরি (৪ বছর গণ্য)।
   - ক্ষতিপূরণ: ৪ × ৬৫,০০০ = ২,৬০,০০০/- টাকা।

৩. পাওনা অর্জিত ছুটির নগদ অর্থ (ধারা ১১৭):
   - ১৮ দিনের অর্জিত ছুটি = ৩৯,০০০/- টাকা।

মোট সংবিধিবদ্ধ পরিশোধযোগ্য অর্থ: ৫,৫৯,০০০/- টাকা।
আইনি ঝুঁকি: ৩০ কার্যদিবসের মধ্যে এই অর্থ পরিশোধ না করলে নিয়োগকারী শ্রম আদালত ও ধারা ২৮৭ অনুযায়ী দণ্ডনীয় অপরাধের মুখোমুখি হবেন।`,
      keyTakeaways: [
        isEn ? '120-day notice or wages in lieu is mandatory for monthly-rated workers' : 'স্থায়ী মাসিক কর্মীদের ক্ষেত্রে ১২০ দিনের নোটিশ বা সমপরিমাণ মজুরি বাধ্যতামূলক',
        isEn ? 'Service of 6+ months is rounded up to a full year for gratuity calculation' : 'চাকরির মেয়াদ ৬ মাসের বেশি হলে গ্র্যাচুইটি গণনায় পূর্ণ ১ বছর হিসেবে গণ্য হবে',
        isEn ? 'Dispute must be filed in Labour Court under Section 33 within 30 days' : 'পাওনা বঞ্চিত হলে ধারা ৩৩ অনুযায়ী ৩০ দিনের মধ্যে শ্রম আদালতে অভিযোগ দায়ের করতে হয়'
      ],
      samplePrompt: 'Under Bangladesh Labour Act 2006 Section 26, how is severance compensation and gratuity calculated for permanent employees?'
    },
    bail497: {
      id: 'bail497',
      tabLabel: isEn ? 'CrPC § 497 (Bail Arguments)' : 'ফৌজদারি কার্যবিধি ধারা ৪৯৭ (জামিনের যুক্তি)',
      title: isEn ? 'Bail Petition Legal Grounds in Non-Bailable Cases' : 'অজামিনযোগ্য ধারায় জামিন মঞ্জুরের আইনি যুক্তিমালা',
      statute: 'Code of Criminal Procedure (CrPC), 1898 Section 497',
      badge: isEn ? 'Criminal Defense' : 'ফৌজদারি জামিন ও ব্যক্তিস্বাধীনতা',
      facts: [
        { label: isEn ? 'Accused Charges' : 'অভিযোগের ধারা', value: isEn ? 'Penal Code § 420/406 (Cheating & Breach)' : 'দণ্ডবিধি ধারা ৪২০/৪০৬ (প্রতারণা ও বিশ্বাসভঙ্গ)' },
        { label: isEn ? 'Detention Duration' : 'হাজতবাসকাল', value: isEn ? '45 Days in Central Jail custody' : '৪৫ দিন যাবৎ জেলহাজতে আটক' },
        { label: isEn ? 'Investigation Status' : 'তদন্তের অবস্থা', value: isEn ? 'Pending; Charge-sheet not yet submitted' : 'তদন্তাধীন; চার্জশিট এখনও দাখিল হয়নি' },
        { label: isEn ? 'Court Jurisdiction' : 'এখতিয়ারভুক্ত আদালত', value: isEn ? 'Court of Sessions Judge, Dhaka' : 'মহানগর দায়রা জজ আদালত, ঢাকা' }
      ],
      draftHeading: isEn ? 'LEGAL ARGUMENTS FOR BAIL UNDER CRPC SECTION 497' : 'ফৌজদারি কার্যবিধি ৪৯৭ ধারায় জামিন মঞ্জুরের আইনি যুক্তি',
      draftBody: isEn
        ? `MEMORANDUM OF ARGUMENTS FOR BAIL BEFORE SESSIONS JUDGE, DHAKA
IN THE MATTER OF: The State vs. Md. Arif Chowdhury (Accused in Custody)
Case: Banani Thana Case No. 14 / 2026 under Sections 420/406 of the Penal Code.

GROUNDS OF BAIL UNDER CRPC § 497:
1. PURELY CIVIL IN DISPUTE: The allegations arise out of a commercial supply contract. Breach of contract does not ipso facto constitute criminal breach of trust under Section 406 unless fraudulent intention existed at inception (Ref: 42 DLR 352).
2. NO POLICE REMAND REQUIRED: Interrogation is complete, no further custody is needed for investigation, and charge-sheet is not yet submitted.
3. CONSTITUTIONAL PRESUMPTION OF INNOCENCE: Personal liberty guaranteed under Article 31 & 32 of the Constitution of Bangladesh. Detention before conviction is punitive.
4. PERMANENT RESIDENT & NO FLIGHT RISK: Accused has roots in society, surrendered passport, and undertakes to furnish solvent local bailors and attend every court date.

PRAYER: That the Hon'ble Court be pleased to enlarge the accused on bail pending trial.`
        : `মহানগর দায়রা জজ আদালত, ঢাকা-এ জামিনের আইনি যুক্তিমালা
বিষয়: রাষ্ট্র বনাম মো: আরিফ চৌধুরী (হাজতি আসামী)
মামলা: বনানী থানা মামলা নং ১৪/২০২৬, ধারা ৪২০/৪০৬ দণ্ডবিধি।

ধারা ৪৯৭ মোতাবেক জামিন মঞ্জুরের আইনগত কারণসমূহ:
১. দেওয়ানি বিরোধের ফৌজদারি রূপ: অভিযোগটি মূলত একটি ব্যবসায়িক চুক্তি ভঙ্গের ঘটনা। চুক্তির শর্ত লঙ্ঘিত হইলেই তাহা দণ্ডবিধির ৪০৬ বা ৪২০ ধারার অপরাধে রূপ নেয় না (নজির: ৪২ ডিএলআর ৩৫২)।
২. রিমান্ডের প্রয়োজনীয়তা সমাপ্ত: আসামীর জিজ্ঞাসাবাদ শেষ হয়েছে, পুলিশ রিমান্ড বা তদন্তে আসামীর শারীরিক উপস্থিতির আবশ্যকতা নাই।
৩. সংবিধানের অনুচ্ছেদ ৩১ ও ৩২: বিচারে দোষী সাব্যস্ত না হওয়া পর্যন্ত আসামী নির্দোষ এবং বিনা বিচারে দীর্ঘ হাজতবাস সংবিধানের মৌলিক অধিকারের পরিপন্থী।
৪. পালিয়ে যাওয়ার শঙ্কা নাই: আসামী স্থায়ী বাসিন্দা, সামাজিক মর্যাদা সম্পন্ন এবং যেকোনো শর্তে জামিনদার দাখিলে প্রস্তুত।

প্রার্থনা: অতএব, আদালত সুবিবেচনাপূর্বক চার্জশিট দাখিল পর্যন্ত আসামীর জামিন মঞ্জুর করতে মর্জি হয়।`,
      keyTakeaways: [
        isEn ? 'Commercial dispute dressed as criminal case is standard ground for bail' : 'দেওয়ানি বিরোধকে ফৌজদারি মামলা হিসেবে উপস্থাপন করা জামিন লাভের অন্যতম প্রধান কারণ',
        isEn ? 'Prolonged detention without trial violates fundamental constitutional rights' : 'বিচারাধীন অবস্থায় অযৌক্তিক দীর্ঘ আটকাদেশ সংবিধানের মৌলিক অধিকার লঙ্ঘন করে',
        isEn ? 'Ref: 50 DLR (AD) 161 on liberal exercise of bail discretion in non-capital crimes' : 'অ-মৃত্যুদণ্ডযোগ্য অপরাধে জামিন বিবেচনার নজির: ৫০ ডিএলআর (আপিল বিভাগ) ১৬১'
      ],
      samplePrompt: 'What are the main judicial precedents and grounds for securing bail in non-bailable offenses under CrPC Section 497 in Bangladesh?'
    }
  };

  // Core statutes
  const statutes = [
    {
      id: 'penal',
      code: 'Act No. XLV of 1860',
      title: isEn ? 'The Penal Code, 1860' : 'দণ্ডবিধি, ১৮৬০',
      category: 'criminal',
      categoryLabel: isEn ? 'Criminal Law' : 'ফৌজদারি আইন',
      sections: isEn ? '511 Sections' : '৫১১টি ধারা',
      desc: isEn
        ? 'Defines criminal offenses, punishments, rights of private defense, murder, theft, fraud, breach of trust, and criminal conspiracy.'
        : 'অপরাধের সংজ্ঞা, শাস্তি, আত্মরক্ষা, হত্যা, চুরি, প্রতারণা ও অপরাধমূলক ষড়যন্ত্র।',
      samplePrompt: isEn
        ? 'Explain the general exceptions and key offenses under The Penal Code 1860 of Bangladesh.'
        : 'দণ্ডবিধি ১৮৬০ অনুযায়ী ফৌজদারি অপরাধ ও শাস্তির সাধারণ বিধানগুলো বুঝিয়ে বলুন।'
    },
    {
      id: 'crpc',
      code: 'Act No. V of 1898',
      title: isEn ? 'The Code of Criminal Procedure, 1898' : 'ফৌজদারি কার্যবিধি, ১৮৯৮',
      category: 'criminal',
      categoryLabel: isEn ? 'Criminal Procedure' : 'ফৌজদারি কার্যপ্রণালী',
      sections: isEn ? '565 Sections' : '৫৬৫টি ধারা',
      desc: isEn
        ? 'Governs arrest, search warrants, police investigation, GD, FIR, remand procedures, bail petitions, and court trial conducts.'
        : 'গ্রেফতার, তল্লাশি, জিডি (GD), এজাহার (FIR), রিমান্ড, জামিন ও বিচারিক আদালত পরিচালনা।',
      samplePrompt: isEn
        ? 'What is the procedure for anticipatory bail and regular bail under CrPC 1898 in Bangladesh?'
        : 'ফৌজদারি কার্যবিধি ১৮৯৮ অনুযায়ী জিডি ও এফআইআর এর মধ্যে পার্থক্য এবং জামিনের প্রক্রিয়া কী?'
    },
    {
      id: 'contract',
      code: 'Act No. IX of 1872',
      title: isEn ? 'The Contract Act, 1872' : 'চুক্তি আইন, ১৮৭২',
      category: 'commercial',
      categoryLabel: isEn ? 'Commercial & Contract' : 'বাণিজ্যিক চুক্তি',
      sections: isEn ? '238 Sections' : '২৩৮টি ধারা',
      desc: isEn
        ? 'Essential criteria for valid agreements, indemnity, guarantee, bailment, agency, breach of contract, and liquidated damages.'
        : 'বৈধ চুক্তির শর্ত, ক্ষতিপূরণ (Indemnity), জামানত, চুক্তিভঙ্গ ও শর্ত লঙ্ঘনের প্রতিকার।',
      samplePrompt: isEn
        ? 'What are the essential elements of a legally enforceable contract and remedies for breach under Contract Act 1872?'
        : 'চুক্তি আইন ১৮৭২ অনুযায়ী একটি বৈধ চুক্তির আবশ্যিক শর্ত ও চুক্তিভঙ্গের ক্ষতিপূরণ কীভাবে নির্ধারিত হয়?'
    },
    {
      id: 'ni',
      code: 'Act No. XXVI of 1881',
      title: isEn ? 'Negotiable Instruments Act, 1881' : 'হস্তান্তরযোগ্য দলিল আইন, ১৮৮১',
      category: 'commercial',
      categoryLabel: isEn ? 'Banking Law' : 'ব্যাংকিং আইন',
      sections: isEn ? '142 Sections' : '১৪২টি ধারা',
      desc: isEn
        ? 'Section 138 check dishonor provisions, return memos, mandatory 30-day registered legal notices, and limitation deadlines.'
        : 'ধারা ১৩৮ এর অধীনে চেক ডিজঅনার, ব্যাংক মেমো, রেজিস্ট্রি ডাকযোগে আইনি নোটিশ প্রদান।',
      samplePrompt: isEn
        ? 'What are the statutory notice requirements and limitation periods for filing a check bounce case under NI Act § 138?'
        : 'চেক ডিজঅনার মামলায় লিগ্যাল নোটিশ পাঠানো এবং মামলা রুজুর তামাদি সময়সীমা কত?'
    },
    {
      id: 'labor',
      code: 'Act No. XLII of 2006',
      title: isEn ? 'The Bangladesh Labour Act, 2006' : 'বাংলাদেশ শ্রম আইন, ২০০৬',
      category: 'civil',
      categoryLabel: isEn ? 'Labor Law' : 'শ্রম আইন',
      sections: isEn ? '354 Sections' : '৩৫৪টি ধারা',
      desc: isEn
        ? 'Working hours, minimum wage schedules, maternity benefits, workplace safety, dismissal by notice, gratuity, and Labor Court trials.'
        : 'কর্মঘণ্টা, মজুরি, মাতৃত্ব সুবিধা, কারখানা নিরাপত্তা, বরখাস্ত ও শ্রম আদালতের বিচার।',
      samplePrompt: isEn
        ? 'Calculate severance pay, gratuity, and termination compensation according to Bangladesh Labour Act 2006.'
        : 'বাংলাদেশ শ্রম আইন অনুযায়ী বরখাস্ত বা টার্মিনেশনের ক্ষেত্রে ক্ষতিপূরণ ও সার্ভিস বেনিফিট কীভাবে হিসাব করা হয়?'
    },
    {
      id: 'evidence',
      code: 'Act No. I of 1872',
      title: isEn ? 'The Evidence Act, 1872' : 'সাক্ষ্য আইন, ১৮৭২',
      category: 'civil',
      categoryLabel: isEn ? 'Judicial Evidence' : 'সাক্ষ্য আইন',
      sections: isEn ? '167 Sections' : '১৬৭টি ধারা',
      desc: isEn
        ? 'Relevancy of facts, oral and documentary evidence, admissibility of digital and electronic records, burden of proof, and cross-examination.'
        : 'মৌখিক ও দালিলিক সাক্ষ্য, ইলেকট্রনিক রেকর্ড গ্রহণযোগ্যতা, সাক্ষীর জেরা ও প্রমাণের দায়।',
      samplePrompt: isEn
        ? 'How are digital electronic records and emails authenticated and admitted as evidence in Bangladesh courts?'
        : 'বাংলাদেশ সাক্ষ্য আইন অনুযায়ী ডিজিটাল বা ইলেকট্রনিক ডকুমেন্টের গ্রহণযোগ্যতা কীরূপ?'
    }
  ];

  const filteredStatutes = lawFilter === 'all'
    ? statutes
    : statutes.filter(s => s.category === lawFilter);

  // Station locations
  const stationLocations = {
    dhaka: [
      {
        name: isEn ? 'Supreme Court of Bangladesh' : 'বাংলাদেশ সুপ্রিম কোর্ট (আপিল ও হাইকোর্ট বিভাগ)',
        type: isEn ? 'Apex Court' : 'সর্বোচ্চ আদালত',
        address: isEn ? 'Topkhana Road, Segunbagicha, Dhaka-1000' : 'তোপখানা রোড, সেগুনবাগিচা, ঢাকা-১০০০',
        jurisdiction: isEn ? 'Whole of Bangladesh (Appellate & Writ)' : 'সমগ্র বাংলাদেশ (আপিল ও রিট অধিক্ষেত্র)',
        phone: '02-9562881'
      },
      {
        name: isEn ? 'District & Sessions Judge Court, Dhaka' : 'ঢাকা জেলা ও দায়রা জজ আদালত',
        type: isEn ? 'District Court' : 'জেলা আদালত',
        address: isEn ? 'Court House Street, Ray Shaheb Bazar, Dhaka' : 'কোর্ট হাউজ স্ট্রিট, রায়সাহেব বাজার, কোতোয়ালি, ঢাকা',
        jurisdiction: isEn ? 'Civil & Criminal Trials for Dhaka District' : 'ঢাকা জেলা এখতিয়ারভুক্ত দেওয়ানি ও ফৌজদারি মামলা',
        phone: '02-5716567'
      },
      {
        name: isEn ? 'Chief Metropolitan Magistrate (CMM) Court' : 'চিফ মেট্রোপলিটন ম্যাজিস্ট্রেট (CMM) আদালত, ঢাকা',
        type: isEn ? 'Magistrate Court' : 'ম্যাজিস্ট্রেট আদালত',
        address: isEn ? 'Johnson Road, Dhaka Court Complex' : 'জনসন রোড, ঢাকা কোর্ট প্রাঙ্গণ',
        jurisdiction: isEn ? 'All DMP Thana Police & C.R. Complaints' : 'ঢাকা মহানগরীর সকল থানার ফৌজদারি অপরাধ ও সি.আর. মামলা',
        phone: '02-4711882'
      },
      {
        name: isEn ? 'Dhanmondi Model Police Station (DMP)' : 'ধানমন্ডি মডেল থানা (DMP)',
        type: isEn ? 'Police Station' : 'থানা (Thana)',
        address: isEn ? 'Road 6, Dhanmondi R/A, Dhaka' : 'রোড নং ৬, ধানমন্ডি আ/এ, ঢাকা',
        jurisdiction: isEn ? 'Dhanmondi & Adjacent Zones (GD & FIR)' : 'ধানমন্ডি ও সংলগ্ন এলাকা (জিডি ও এফআইআর গ্রহণ)',
        phone: '01320-040795'
      },
      {
        name: isEn ? 'Gulshan Police Station (DMP)' : 'গুলশান থানা (DMP)',
        type: isEn ? 'Police Station' : 'থানা (Thana)',
        address: isEn ? 'Plot 1, Gulshan Link Road, Dhaka' : 'প্লট নং ১, গুলশান লিংক রোড, ঢাকা',
        jurisdiction: isEn ? 'Gulshan 1 & 2 Metropolitan Area' : 'গুলশান ১ ও ২ এলাকা (তদন্ত ও নিরাপত্তা)',
        phone: '01320-040791'
      },
      {
        name: isEn ? 'Uttara East Police Station (DMP)' : 'উত্তরা পূর্ব থানা (DMP)',
        type: isEn ? 'Police Station' : 'থানা (Thana)',
        address: isEn ? 'Sector 4, Uttara Model Town, Dhaka' : 'সেক্টর ৪, উত্তরা মডেল টাউন, ঢাকা',
        jurisdiction: isEn ? 'Uttara East & Airport Corridor' : 'উত্তরা পূর্ব জোন ও বিমানবন্দর সংলগ্ন অঞ্চল',
        phone: '01320-040801'
      }
    ],
    chittagong: [
      {
        name: isEn ? 'Chittagong District & Sessions Judge Court' : 'চট্টগ্রাম জেলা ও দায়রা জজ আদালত',
        type: isEn ? 'District Court' : 'জেলা আদালত',
        address: isEn ? 'Court Hill, Kotwali, Chittagong' : 'কোর্ট হিল, কোতোয়ালি, চট্টগ্রাম',
        jurisdiction: isEn ? 'Chittagong Civil & Criminal Appellate' : 'চট্টগ্রাম জেলা ও মহানগর দেওয়ানি ও ফৌজদারি আপিল',
        phone: '031-619221'
      },
      {
        name: isEn ? 'Kotwali Model Police Station (CMP)' : 'কোতোয়ালি থানা (CMP)',
        type: isEn ? 'Police Station' : 'থানা (Thana)',
        address: isEn ? 'Anderkilla Road, Chittagong' : 'আন্দরকিল্লা রোড, চট্টগ্রাম',
        jurisdiction: isEn ? 'Kotwali Zone Complaints & Investigation' : 'কোতোয়ালি জোন (অভিযোগ, জিডি ও এজাহার)',
        phone: '01320-107501'
      }
    ],
    sylhet: [
      {
        name: isEn ? 'Sylhet District & Sessions Judge Court' : 'সিলেট জেলা ও দায়রা জজ আদালত',
        type: isEn ? 'District Court' : 'জেলা আদালত',
        address: isEn ? 'Court Point, Zindabazar, Sylhet' : 'কোর্ট পয়েন্ট, জিন্দাবাজার সংলগ্ন, সিলেট',
        jurisdiction: isEn ? 'Sylhet Judicial District Jurisdiction' : 'সিলেট জেলা বিচার বিভাগীয় এখতিয়ার',
        phone: '0821-718991'
      },
      {
        name: isEn ? 'Kotwali Model Police Station (SMP)' : 'কোতোয়ালি মডেল থানা (SMP)',
        type: isEn ? 'Police Station' : 'থানা (Thana)',
        address: isEn ? 'Bandar Bazar, Sylhet' : 'বন্দরবাজার, সিলেট',
        jurisdiction: isEn ? 'Sylhet Sadar Police Jurisdiction' : 'সিলেট সদর এলাকা',
        phone: '01320-117901'
      }
    ]
  };

  // Official helplines
  const helplines = [
    {
      number: '16430',
      title: isEn ? 'National Legal Aid Services Organization' : 'জাতীয় আইনগত সহায়তা সংস্থা',
      authority: isEn ? 'Ministry of Law, Justice & Parliamentary Affairs' : 'আইন, বিচার ও সংসদ বিষয়ক মন্ত্রণালয়',
      desc: isEn
        ? 'Government-funded, 24/7 toll-free free legal consultation and court representation for indigent citizens.'
        : 'দরিদ্র ও অস্বচ্ছল নাগরিকদের বিনামূল্যে সরকারি খরচে আইনজীবী ও আইনি পরামর্শ সহায়তা (টোল-ফ্রি ২৪/৭)।',
      badge: isEn ? 'Toll-Free • Free Legal Aid' : 'টোল-ফ্রি • সরকারি সহায়তা'
    },
    {
      number: '999',
      title: isEn ? 'National Emergency Service' : 'জাতীয় জরুরি সেবা (Emergency 999)',
      authority: isEn ? 'Bangladesh Police Headquarters' : 'বাংলাদেশ পুলিশ সদর দপ্তর',
      desc: isEn
        ? 'Immediate emergency response for police intervention, criminal reporting, fire hazard, and ambulance dispatch.'
        : 'জরুরি পরিস্থিতিতে তাৎক্ষণিক পুলিশি সহায়তা, অপরাধের তথ্য প্রদান, অগ্নিনির্বাপণ ও অ্যাম্বুলেন্স সেবা।',
      badge: isEn ? 'Emergency Police • 24/7' : 'জরুরি পুলিশ • ২৪ ঘণ্টা'
    },
    {
      number: '109',
      title: isEn ? 'Violence Against Women & Children Helpline' : 'নারী ও শিশু নির্যাতন প্রতিরোধ হেল্পলাইন',
      authority: isEn ? 'Ministry of Women and Children Affairs' : 'মহিলা ও শিশু বিষয়ক মন্ত্রণালয়',
      desc: isEn
        ? 'Immediate crisis support, dowry & domestic violence prevention, legal aid referrals, and shelter assistance.'
        : 'যৌতুক, পারিবারিক সহিংসতা ও নারী নির্যাতন রোধে তাৎক্ষণিক আইনি সহায়তা ও পুনর্বাসন রেফারাল।',
      badge: isEn ? 'Protection & Legal Support' : 'নারী ও শিশু সুরক্ষা'
    },
    {
      number: '333',
      title: isEn ? 'Citizen Information & Public Services' : 'নাগরিক সেবা ও তথ্য হেল্পলাইন (Citizen 333)',
      authority: isEn ? 'a2i • ICT Division' : 'এটুআই (a2i) • আইসিটি বিভাগ',
      desc: isEn
        ? 'Unified helpline for government laws, administrative procedures, public registry services, and local administration contacts.'
        : 'সরকারি আইন, খসড়া বিধিমালা, ভূমি সংক্রান্ত সেবা এবং স্থানীয় প্রশাসনের তথ্য প্রাপ্তির সমন্বিত কল সেন্টার।',
      badge: isEn ? 'Citizen Information' : 'তথ্য ও নাগরিক সেবা'
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onLaunchWithPrompt(searchQuery.trim());
  };

  return (
    <div className={`min-h-screen text-slate-900 selection:bg-emerald-500/20 selection:text-emerald-900 bg-[#f8f7f2] relative isolate ${isEn ? 'font-sans' : 'font-bengali-sans'}`}>
      
      {/* ── CLEAN AMBIENT LIGHTING: Subtle soft parchment warmth ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ffffff] via-[#f8f7f2] to-[#f2f0e6]" />

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* FLOATING PILL ISLAND NAVIGATION BAR (Reference Design)               */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-3.5 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
        <div className="max-w-5xl mx-auto bg-[#ece7df] border border-stone-300/60 shadow-md shadow-stone-300/25 rounded-full h-15 px-3.5 sm:px-4 flex items-center justify-between gap-3 pointer-events-auto transition-all">

          {/* Left Brand Badge: Green Rounded Square with Scale & Title */}
          <div className="flex items-center gap-2.5 cursor-pointer group shrink-0" onClick={() => switchTab('home')}>
            <div className="w-9 h-9 rounded-xl bg-[#0d5c46] flex items-center justify-center shadow-xs shrink-0 text-white group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="font-bold text-[13px] text-slate-800 tracking-tight">
                {isEn ? 'Legal' : 'বাংলাদেশ'}
              </span>
              <span className="text-[12px] font-bold text-slate-700 -mt-0.5 tracking-tight">
                {isEn ? 'Copilot BD' : 'আইন সহকারী'}
              </span>
            </div>
          </div>

          {/* Center Capsule Nav Links with Mint Container and Active Pill */}
          <nav className="hidden md:flex items-center gap-1 bg-[#e2ebe4] border border-[#d2ded5] rounded-full p-1 text-xs relative">
            <button 
              type="button"
              onClick={() => switchTab('home')}
              className={`px-3.5 py-1 rounded-full font-semibold transition ${
                currentTab === 'home'
                  ? 'bg-white text-[#0d5c46] shadow-xs'
                  : 'text-slate-700 hover:text-[#0d5c46] hover:bg-white/50'
              }`}
            >
              {t.navHome}
            </button>

            {/* Laws & Regulations with Dropdown */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => {
                  switchTab('law');
                  setIsLawDropdownOpen(!isLawDropdownOpen);
                  setIsLocatorDropdownOpen(false);
                }}
                onMouseEnter={() => setIsLawDropdownOpen(true)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition ${
                  currentTab === 'law'
                    ? 'bg-white text-[#0d5c46] shadow-xs'
                    : 'text-slate-700 hover:text-[#0d5c46] hover:bg-white/50'
                }`}
              >
                <span>{t.navLaw}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isLawDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsLawDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 text-left animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isEn ? 'Statute Corpus' : 'প্রধান আইন ও কোডসমূহ'}
                  </div>
                  {statutes.slice(0, 5).map(st => (
                    <button
                      key={st.id}
                      onClick={() => {
                        switchTab('law');
                        setLawFilter(st.category);
                        setIsLawDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 hover:text-[#0d5c46] transition flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-800">{st.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{st.sections}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Courts & Police Stations with Dropdown */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => {
                  switchTab('locator');
                  setIsLocatorDropdownOpen(!isLocatorDropdownOpen);
                  setIsLawDropdownOpen(false);
                }}
                onMouseEnter={() => setIsLocatorDropdownOpen(true)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition ${
                  currentTab === 'locator'
                    ? 'bg-white text-[#0d5c46] shadow-xs'
                    : 'text-slate-700 hover:text-[#0d5c46] hover:bg-white/50'
                }`}
              >
                <span>{t.navLocator}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isLocatorDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsLocatorDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 text-left animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isEn ? 'Jurisdiction & Police' : 'আদালত ও পুলিশ এখতিয়ার'}
                  </div>
                  <button
                    onClick={() => { switchTab('locator'); setIsLocatorDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 hover:text-[#0d5c46] transition"
                  >
                    <div className="font-semibold text-slate-800">{t.gdTitle}</div>
                    <div className="text-[10px] text-slate-500">{t.gdCode}</div>
                  </button>
                  <button
                    onClick={() => { switchTab('locator'); setIsLocatorDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 hover:text-[#0d5c46] transition"
                  >
                    <div className="font-semibold text-slate-800">{t.firTitle}</div>
                    <div className="text-[10px] text-slate-500">{t.firCode}</div>
                  </button>
                  <button
                    onClick={() => { switchTab('locator'); setIsLocatorDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 hover:text-[#0d5c46] transition"
                  >
                    <div className="font-semibold text-slate-800">{t.crTitle}</div>
                    <div className="text-[10px] text-slate-500">{t.crCode}</div>
                  </button>
                </div>
              )}
            </div>

            <button 
              type="button"
              onClick={() => switchTab('helpline')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition ${
                currentTab === 'helpline'
                  ? 'bg-white text-[#0d5c46] shadow-xs'
                  : 'text-slate-700 hover:text-[#0d5c46] hover:bg-white/50'
              }`}
            >
              <span>{t.navHelpline}</span>
            </button>
          </nav>

          {/* Right Action: Language Switcher Capsule + Profile / Copilot Pill */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* EN / BAN Capsule Toggle */}
            <div className="flex items-center bg-white/80 border border-stone-300/70 rounded-full p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                  !isEn 
                    ? 'bg-white text-[#0d5c46] font-bold shadow-xs border border-stone-200/80 font-bengali-sans' 
                    : 'text-slate-600 hover:text-slate-900 font-bengali-sans'
                }`}
                title="বাংলায় পরিবর্তন করুন"
              >
                বাং
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                  isEn 
                    ? 'bg-white text-[#0d5c46] font-bold shadow-xs border border-stone-200/80' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Profile / Workspace Pill Button */}
            <button
              onClick={onLaunchApp}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300/70 hover:border-emerald-600 text-xs font-semibold text-slate-800 shadow-2xs transition group"
              title="Launch Workspace / Profile"
            >
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>{t.navProfile}</span>
            </button>

            {/* Launch Legal Copilot Primary Action Button */}
            <button
              onClick={onLaunchApp}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0d5c46] hover:bg-[#094736] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>{t.navCta}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* PAGE 1: HOME VIEW                                                     */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'home' && (
        <div className="pt-36 sm:pt-40 lg:pt-44 pb-16 animate-in fade-in duration-200">
          
          <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">

            {/* Headline */}
            <h1 className="font-bangla-headline font-bold text-2xl sm:text-[36px] md:text-[42px] lg:text-[46px] tracking-tight leading-[1.25] text-center max-w-5xl mx-auto">
              {isEn ? (
                <>
                  <span className="text-slate-900">{t.heroTitlePart1}</span>
                  <span className="text-[#0d6e56]">{t.heroTitleAccent}</span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="text-slate-900 whitespace-normal sm:whitespace-nowrap">
                    {t.heroTitlePart1}
                    <span className="text-[#0d6e56]">{t.heroTitleAccent}</span>
                  </div>
                  <div className="text-[#0d6e56] mt-1 sm:mt-2">
                    {t.heroTitleLine2}
                  </div>
                </div>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-xs sm:text-sm lg:text-[15px] max-w-2xl mx-auto text-center leading-relaxed mt-5 mb-8 font-normal">
              {t.heroSub}
            </p>

            {/* Search Box Card ("আইনি প্রশ্ন অনুসন্ধান (LEGAL QUERY DESK)") */}
            <div className="max-w-3xl mx-auto bg-white rounded-[24px] sm:rounded-[28px] border border-emerald-100/90 shadow-[0_10px_35px_-8px_rgba(0,0,0,0.05)] p-5 sm:p-6 mb-7 text-left">
              <div className="flex items-center gap-2 text-[#0d6e56] text-xs font-bold mb-3 tracking-wide">
                <BookOpen className="w-4 h-4 text-[#0d6e56]" />
                <span>{t.docketTitle}</span>
              </div>

              <form onSubmit={handleSearchSubmit} className="flex items-center rounded-xl sm:rounded-2xl border border-slate-200/90 bg-[#fafaf8] p-1.5 focus-within:border-[#0d6e56] focus-within:ring-2 focus-within:ring-[#0d6e56]/15 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent border-0 px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`p-2 rounded-lg transition mr-1.5 shrink-0 flex items-center justify-center ${
                    isListening ? 'text-rose-500 animate-pulse bg-rose-50' : 'text-slate-400 hover:text-[#0d6e56]'
                  }`}
                  title={isEn ? (isListening ? 'Stop voice recording' : 'Voice Search (Speak query)') : (isListening ? 'শোনা বন্ধ করুন' : 'ভয়েস সার্চ (বাংলা বা ইংরেজিতে বলুন)')}
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#0d5c46] hover:bg-[#094736] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 transition shadow-xs"
                >
                  <span>{t.searchBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Voice Notice Feedback */}
              {voiceNotice && (
                <div className="mt-2 text-[11px] font-mono text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1 inline-flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>{voiceNotice}</span>
                </div>
              )}

              {/* Popular Query Chips */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
                <span className="text-slate-400 text-xs font-medium mr-1">{t.popularQueriesLabel}</span>
                {popularChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onLaunchWithPrompt(chip.query)}
                    className="px-3 py-1 rounded-full border border-slate-200 bg-white hover:border-[#0d6e56] hover:text-[#0d6e56] text-slate-700 text-xs font-medium transition shadow-2xs"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Floating Stats Bar */}
            <div className="max-w-3xl mx-auto bg-white rounded-[24px] sm:rounded-[28px] border border-stone-200/80 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.04)] p-5 sm:p-6 mb-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#0d6e56] font-bangla-headline">{t.stat1Val}</div>
                  <div className="text-xs font-medium text-slate-700 mt-1">{t.stat1Label}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">bdlaws.minlaw.gov.bd</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#0d6e56] font-bangla-headline">{t.stat2Val}</div>
                  <div className="text-xs font-medium text-slate-700 mt-1">{t.stat2Label}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">CMM, Sessions & Thana</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#0d6e56] font-bangla-headline">{t.stat3Val}</div>
                  <div className="text-xs font-medium text-slate-700 mt-1">{t.stat3Label}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">National Legal Aid 24/7</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#c27803] font-bangla-headline">{t.stat4Val}</div>
                  <div className="text-xs font-medium text-slate-700 mt-1">{t.stat4Label}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">Zero Hallucinated Citations</div>
                </div>
              </div>
            </div>

          </section>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* FEATURE 1: INTERACTIVE LIVE LEGAL SIMULATOR PLAYGROUND              */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-emerald-900/15 shadow-2xl p-6 sm:p-9 relative overflow-hidden">
              
              {/* Top Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-8">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-[#006a4e] font-bold mb-3 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>{isEn ? 'INTERACTIVE LEGAL PLAYGROUND • LIVE SIMULATOR' : 'লাইভ আইনি নোটিশ ও ড্রাফট ডেমো • INTERACTIVE PLAYGROUND'}</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-slate-900 mb-2">
                  {isEn ? 'Experience Bangladesh AI Jurisprudence in Action' : 'বাস্তব আইনি নোটিশ ও ড্রাফট তৈরি স্বচক্ষে দেখুন'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                  {isEn 
                    ? 'Select a real-world scenario to see how Legal Copilot structures court notices, enforces statutory limitation windows, and computes severance liability.' 
                    : 'নিচের বাস্তব পরিস্থিতিগুলো থেকে নির্বাচন করে দেখুন কীভাবে লিগ্যাল কোপাইলট নিখুঁত আইনি নোটিশ, জিডি এবং ধারাভিত্তিক পাওনা নিরূপণ করে।'}
                </p>

                {/* Scenario Selector Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                  {Object.values(simulatorScenarios).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSimulatorTab(s.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                        simulatorTab === s.id
                          ? 'bg-[#006a4e] text-white border-[#006a4e] shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-[#006a4e]'
                      }`}
                    >
                      <ScrollText className="w-3.5 h-3.5" />
                      <span>{s.tabLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Split-Screen Workspace */}
              {(() => {
                const s = simulatorScenarios[simulatorTab] || simulatorScenarios.ni138;
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Left Column (5 Cols): Scenario Brief & Statutory Exposure */}
                    <div className="lg:col-span-5 bg-[#faf8f5] rounded-2xl border border-stone-200 p-5 sm:p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-[#006a4e] font-bold border border-emerald-200">
                            {s.badge}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 font-semibold">
                            {s.statute}
                          </span>
                        </div>

                        <h3 className="font-editorial text-xl font-bold text-slate-900 mb-4">
                          {s.title}
                        </h3>

                        {/* Facts Table */}
                        <div className="space-y-2 mb-5">
                          {s.facts.map((f, i) => (
                            <div key={i} className="flex items-start justify-between text-xs py-1.5 border-b border-stone-200/60 last:border-0">
                              <span className="text-slate-500 font-medium">{f.label}:</span>
                              <span className="text-slate-900 font-semibold text-right max-w-[65%]">{f.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Statutory Key Rules */}
                        <div className="bg-white rounded-xl p-3.5 border border-stone-200/80 mb-4">
                          <span className="text-[11px] font-bold text-[#006a4e] uppercase tracking-wider block mb-2 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#006a4e]" />
                            {isEn ? 'Statutory Compliance Rules' : 'বাধ্যতামূলক আইনি বিধিমালা'}
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            {s.keyTakeaways.map((k, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-[#006a4e] font-bold">•</span>
                                <span>{k}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <button
                        onClick={() => onLaunchWithPrompt(s.samplePrompt)}
                        className="w-full mt-2 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#006a4e] text-xs font-bold text-[#006a4e] flex items-center justify-center gap-2 transition shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Customize in AI Workspace →' : 'কোপাইলটে কাস্টমাইজ করুন →'}</span>
                      </button>
                    </div>

                    {/* Right Column (7 Cols): Live Generated Legal Document */}
                    <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                      <div>
                        {/* Legal Paper Docket Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-[#006a4e]" />
                            <span className="text-xs font-mono font-bold text-slate-700 tracking-tight">
                              {s.draftHeading}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopyDraft(s.draftBody)}
                            className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-[#006a4e] border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                            title="Copy draft to clipboard"
                          >
                            {copiedDraft ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">{isEn ? 'Copied' : 'কপি হয়েছে'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{isEn ? 'Copy Draft' : 'কপি করুন'}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Document Parchment Area */}
                        <div className="bg-[#fcfbf8] rounded-xl p-4 border border-stone-200/80 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[340px] overflow-y-auto select-text shadow-inner">
                          {s.draftBody}
                        </div>
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#006a4e]" />
                          <span>{isEn ? 'Formulated under official BD Law Gazettes' : 'বাংলাদেশ আইন মন্ত্রণালয় গেজেট অনুযায়ী খসড়াকৃত'}</span>
                        </div>
                        <button
                          onClick={() => onLaunchWithPrompt(s.samplePrompt)}
                          className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#006a4e] hover:bg-[#00543e] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                        >
                          <span>{isEn ? 'Launch Case in Copilot' : 'কোপাইলটে মামলা শুরু করুন'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })()}

            </div>
          </section>

          {/* Sovereign Legal Jurisdiction Bar */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-[#d6cebf] shadow-md p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-[#0f766e] font-serif font-medium mb-2.5">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>{isEn ? '64 Districts • 8 Administrative Divisions' : '৬৪ জেলা • ৮ প্রশাসনিক বিভাগ'}</span>
                </div>
                <h3 className="font-editorial text-2xl font-bold text-slate-900 mb-2">
                  {isEn ? 'Universal Legal Jurisdiction Across Bangladesh' : 'সমগ্র বাংলাদেশের জন্য সমন্বিত আইনি কৃত্রিম বুদ্ধিমত্তা'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isEn 
                    ? 'From the Supreme Court Appellate and High Court Divisions in Dhaka to District Judges Courts and local Thana police stations.'
                    : 'সুপ্রিম কোর্ট (আপিল ও হাইকোর্ট বিভাগ) থেকে জেলা জজ আদালত ও থানা পর্যন্ত নির্ভুল আইনি তথ্য ও পরামর্শ।'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => switchTab('locator')}
                  className="px-5 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold shadow-sm inline-flex items-center gap-2 transition"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isEn ? 'District Locator' : 'আদালত ও থানা ডিরেক্টরি'}</span>
                </button>
                <button
                  onClick={() => switchTab('law')}
                  className="px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white border border-stone-300 text-xs font-semibold text-slate-800 transition"
                >
                  {isEn ? 'Browse Statutes' : 'আইনসমূহ দেখুন'}
                </button>
              </div>
            </div>
          </section>

          {/* Quick Access Cards to Law, Locator & Helpline */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div 
                onClick={() => switchTab('law')}
                className="bg-white/95 backdrop-blur-md p-7 rounded-2xl border-2 border-emerald-900/15 hover:border-[#006a4e] shadow-xl hover:shadow-2xl transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006a4e] flex items-center justify-center mb-4 border border-emerald-200">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-slate-900 mb-2 group-hover:text-[#006a4e] transition">
                    {t.navLaw}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {isEn ? 'Browse 500+ Bangladesh Acts, Penal Code 1860, CrPC, Contract Act, and NI Act § 138 with section-level AI cross-referencing.' : 'দণ্ডবিধি, ফৌজদারি কার্যবিধি ও এনআই অ্যাক্টসহ ৫০০+ বাংলাদেশ গেজেট স্ট্যাটিউটের বিস্তারিত ধারা পর্যালোচনা করুন।'}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#006a4e]">
                  <span>{isEn ? 'Explore Law Corpus' : 'আইন ভাণ্ডার দেখুন'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div 
                onClick={() => switchTab('locator')}
                className="bg-white/95 backdrop-blur-md p-7 rounded-2xl border-2 border-emerald-900/15 hover:border-[#006a4e] shadow-xl hover:shadow-2xl transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4 border border-amber-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-slate-900 mb-2 group-hover:text-[#006a4e] transition">
                    {t.navLocator}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {isEn ? 'Clear procedural rules on GD vs FIR vs Court Complaint (C.R. Case) with jurisdiction lookup across District Courts and DMP Thanas.' : 'কোন অপরাধে জিডি, এজাহার (FIR) বা সরাসরি কোর্টে মামলা করতে হবে এবং থানা-আদালত এখতিয়ারের তথ্য।'}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#006a4e]">
                  <span>{isEn ? 'Find Courts & Police Stations' : 'আদালত ও থানা নির্দেশিকা'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div 
                onClick={() => switchTab('helpline')}
                className="bg-white/95 backdrop-blur-md p-7 rounded-2xl border-2 border-emerald-900/15 hover:border-[#006a4e] shadow-xl hover:shadow-2xl transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center mb-4 border border-rose-200">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-slate-900 mb-2 group-hover:text-[#006a4e] transition">
                    {t.navHelpline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {isEn ? 'Direct toll-free access to National Legal Aid 16430, Emergency Police 999, Women & Child Protection 109, and Citizen Hotline 333.' : 'জাতীয় আইনগত সহায়তা ১৬৪৩০ ও জরুরি পুলিশ ৯৯৯ সহ সরকারি সব আইনি হটলাইনে সরাসরি যোগাযোগ করুন।'}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#006a4e]">
                  <span>{isEn ? 'Access Emergency Helplines' : 'জরুরি হেল্পলাইন নম্বর'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center px-4 sm:px-6 max-w-4xl mx-auto py-12 border-t border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-[#0d5c46] text-white flex items-center justify-center mx-auto mb-4 shadow-md">
              <Gavel className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              {isEn ? 'Ready for Authoritative Legal AI Intelligence?' : 'আইনি সিদ্ধান্ত গ্রহণ হোক নির্ভুল ও তাৎক্ষণিক'}
            </h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto mb-6 font-normal">
              {isEn ? 'Ask complex queries, cross-verify statutory clauses, and redline contracts in seconds.' : 'চুক্তি খসড়া, ধারা ক্রস-ভেরিফিকেশন কিংবা থানা-আদালত এখতিয়ারের সঠিক উত্তর পান লিগ্যাল কোপাইলট দিয়ে।'}
            </p>
            <button
              onClick={onLaunchApp}
              className="px-8 py-3.5 rounded-xl bg-[#0d5c46] hover:bg-[#094736] text-white text-sm font-bold shadow-md shadow-stone-400/20 inline-flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <span>{t.navCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* PAGE 2: LAWS & STATUTES INDIVIDUAL PAGE                               */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'law' && (
        <div className="pt-36 sm:pt-40 pb-24 animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-[#0d5c46] font-medium mb-3 shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-[#0d5c46]" />
                <span>{t.lawSectionBadge}</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                {t.lawSectionTitle}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t.lawSectionSub}
              </p>

              {/* Law Category Filter Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                {[
                  { id: 'all', label: isEn ? 'All Statutes' : 'সকল আইন' },
                  { id: 'criminal', label: isEn ? 'Criminal (দণ্ডবিধি ও কার্যবিধি)' : 'ফৌজদারি আইন' },
                  { id: 'commercial', label: isEn ? 'Commercial & Banking (চুক্তি ও ব্যাংক)' : 'বাণিজ্যিক ও ব্যাংক' },
                  { id: 'civil', label: isEn ? 'Civil & Labor (শ্রম ও সাক্ষ্য)' : 'দেওয়ানি ও শ্রম' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setLawFilter(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                      lawFilter === tab.id
                        ? 'bg-[#006a4e] text-white border-[#006a4e] shadow-xs'
                        : 'bg-white/95 text-slate-800 border-stone-200 hover:border-[#006a4e]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Statute Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredStatutes.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border-2 border-[#d6cebf] hover:border-[#0d9488] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {item.code}
                      </span>
                      <span className="text-[10px] font-bold text-[#0f766e] bg-[#0d9488]/10 px-2 py-0.5 rounded-full">
                        {item.sections}
                      </span>
                    </div>

                    <h3 className="font-editorial text-xl font-bold text-slate-900 mb-1 group-hover:text-[#0f766e] transition">
                      {item.title}
                    </h3>

                    <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide mb-2">
                      {item.categoryLabel}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#e2dcd2] flex items-center justify-between">
                    <button
                      onClick={() => onLaunchWithPrompt(item.samplePrompt)}
                      className="text-xs font-bold text-[#0f766e] hover:text-[#0d6e66] flex items-center gap-1.5 transition"
                    >
                      <span>{isEn ? 'Consult AI Analysis' : 'আইনি পরামর্শ জানুন'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">RAG Engine</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Prompt Inquiry Strip */}
            <div className="bg-gradient-to-br from-[#0f766e]/5 to-[#b45309]/5 rounded-2xl p-6 sm:p-8 border border-[#d6cebf]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-slate-900">
                    {isEn ? 'Need an instant opinion on a specific section?' : 'নির্দিষ্ট ধারার তাৎক্ষণিক আইনি মতামত চান?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {isEn ? 'Select any sample inquiry below to immediately launch the AI reasoning engine.' : 'নিচের যে কোনো প্রশ্নে ক্লিক করে সরাসরি এআই লিগ্যাল কোপাইলট ওপেন করুন।'}
                  </p>
                </div>
                <button
                  onClick={onLaunchApp}
                  className="px-6 py-3 rounded-xl bg-[#0f766e] hover:bg-[#0d6e66] text-white text-xs font-bold shadow-sm flex items-center gap-2 shrink-0 transition"
                >
                  <span>{isEn ? 'Open Legal Chat' : 'ওপেন লিগ্যাল চ্যাট'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {popularChips.map((p, i) => (
                  <div
                    key={i}
                    onClick={() => onLaunchWithPrompt(p.query)}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-[#0d9488] cursor-pointer transition shadow-2xs hover:-translate-y-0.5 group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#0f766e] font-bold mb-1">
                      <span>{p.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0f766e] transition" />
                    </div>
                    <div className="text-xs text-slate-600 leading-snug line-clamp-2">
                      {p.query}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* PAGE 3: COURT & POLICE STATION LOCATOR INDIVIDUAL PAGE                */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'locator' && (
        <div className="pt-28 sm:pt-32 pb-20 animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-[#0d5c46] font-medium mb-2.5 shadow-2xs">
                <Compass className="w-3.5 h-3.5 text-[#0d5c46]" />
                <span>{t.locatorBadge}</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-2.5">
                {t.locatorTitle}
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t.locatorSub}
              </p>
            </div>

            {/* Interactive GPS Bangladesh Map & Nearest Facilities Directory */}
            <BangladeshLegalMap lang={lang} onLaunchWithPrompt={onLaunchWithPrompt} />

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* PAGE 4: OFFICIAL HELPLINES INDIVIDUAL PAGE                            */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {currentTab === 'helpline' && (
        <div className="pt-36 sm:pt-40 pb-24 animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-[#0d5c46] font-medium mb-3 shadow-2xs">
                <Phone className="w-3.5 h-3.5 text-[#0d5c46]" />
                <span>{t.helplineBadge}</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                {t.helplineTitle}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t.helplineSub}
              </p>
            </div>

            {/* Helpline Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
              {helplines.map((h, i) => (
                <div 
                  key={i}
                  className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-[#d6cebf] hover:border-[#0d9488] shadow-sm transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl sm:text-4xl font-editorial font-bold text-[#0f766e] tracking-tight">
                        {h.number}
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-50 border border-slate-300 font-bold text-slate-700">
                        {h.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 mb-1">
                      {h.title}
                    </h3>
                    <div className="text-xs font-mono text-slate-500 mb-3">
                      {isEn ? 'Authority:' : 'কর্তৃপক্ষ:'} {h.authority}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      {h.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#e2dcd2] flex items-center justify-between">
                    <a
                      href={`tel:${h.number}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isEn ? `Call ${h.number}` : `কল করুন ${h.number}`}</span>
                    </a>
                    <button
                      onClick={() => onLaunchWithPrompt(isEn ? `How can citizens obtain free state-funded legal aid and lawyers through ${h.title} (${h.number})?` : `${h.title} (${h.number}) এর মাধ্যমে কীভাবে বিনামূল্যে আইনি সহায়তা ও আইনজীবী পাওয়া যায়?`)}
                      className="text-xs font-semibold text-[#0f766e] hover:underline"
                    >
                      {isEn ? 'How to Apply →' : 'পদ্ধতি জানুন →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Legal Aid Notice Banner */}
            <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3.5 text-xs text-amber-900">
              <BadgeCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">
                  {isEn ? 'Legal Aid Services Act, 2000 (National Legal Aid Organization):' : 'আইনগত সহায়তা প্রদান আইন, ২০০০ (Legal Aid Services Act):'}
                </strong>
                {isEn 
                  ? 'Under Bangladesh law, the Supreme Court Legal Aid Committee and 64 District Judge Court offices provide free lawyers and court fees to indigent, disabled, and economically disadvantaged citizens.' 
                  : 'সুপ্রিম কোর্ট লিগ্যাল এইড কমিটি এবং ৬৪টি জেলা জজ আদালত প্রাঙ্গণে জাতীয় আইনগত সহায়তা প্রদান সংস্থার কার্যালয় রয়েছে। কোনো ব্যক্তি অসচ্ছলতার কারণে আইনজীবী নিয়োগে অক্ষম হলে রাষ্ট্র সম্পূর্ণ সরকারি খরচে আইনজীবী প্রদান করে।'}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* FOOTER (Always at bottom of every page)                               */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#e2dcd2] bg-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0f766e] text-white flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Legal Copilot AI</span>
              <span className="text-[11px] text-slate-400">
                © {new Date().getFullYear()} {isEn ? 'Statutory Jurisprudence Platform' : 'বাংলাদেশ আইন ও সংবিধি প্ল্যাটফর্ম'}
              </span>
            </div>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-500 max-w-md">
            {isEn 
              ? 'Legal Disclaimer: Legal Copilot provides automated decision intelligence and statutory cross-referencing. It does not constitute formal legal representation or create an attorney-client relationship.' 
              : 'আইনি সতর্কবার্তা: এই প্ল্যাটফর্মটি স্বয়ংক্রিয় সিদ্ধান্ত সহায়তা এবং আইনের ধারা ভিত্তিক তথ্য সরবরাহ করে। এটি আনুষ্ঠানিক আদালত প্রতিনিধিত্ব বা আইনজীবী-মক্কেল সম্পর্কের বিকল্প নয়।'}
          </div>

        </div>
      </footer>

    </div>
  );
}
