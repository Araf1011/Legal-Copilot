export const SAMPLE_CONTRACTS = [
  {
    id: "saas-msa-high-risk",
    title: "Enterprise Cloud SaaS Master Services Agreement",
    parties: "Apex Cloud Systems Inc. (Vendor) vs. Horizon Logistics (Client)",
    effectiveDate: "2026-03-01",
    governingLaw: "State of Delaware, USA",
    riskScore: 42, // out of 100 (lower = higher risk)
    riskLevel: "Critical Risk",
    summary: "This agreement heavily favors the Vendor. It contains unlimited customer indemnification, zero limitation of liability for vendor data breaches, an automatic 3-year auto-renewal trap with 90-day notice, and unilateral price adjustment rights.",
    clauses: [
      {
        id: "c-1",
        section: "Section 3.2",
        title: "Automatic Renewal & Cancellation",
        text: "This Agreement shall automatically renew for successive terms of thirty-six (36) months unless Client provides written notice of non-renewal at least ninety (90) days prior to the expiration of the current Term via certified postal mail only. Any failure to provide timely notice under this exact method results in immediate binding renewal for the entire multi-year fee.",
        risk: "high",
        riskLabel: "Predatory Renewal Trap",
        issue: "36-month lock-in with certified mail-only requirement makes non-renewal intentionally difficult and commercially unreasonable.",
        suggestedRedline: "This Agreement shall automatically renew for successive terms of twelve (12) months unless either Party provides written notice of non-renewal at least thirty (30) days prior to the expiration of the current Term via email or electronic portal.",
        category: "Termination & Renewal"
      },
      {
        id: "c-2",
        section: "Section 5.4",
        title: "Unilateral Price Escalation",
        text: "Vendor reserves the right, in its sole discretion, to increase Subscription Fees at any time by up to twenty-five percent (25%) upon fifteen (15) days electronic notice. Continued use of the Services after notice constitutes irrevocable acceptance of adjusted pricing.",
        risk: "high",
        riskLabel: "Uncapped Fee Escalation",
        issue: "Vendor can arbitrarily increase fees by 25% with just 15 days notice without customer right to terminate without penalty.",
        suggestedRedline: "Vendor may adjust Subscription Fees upon sixty (60) days prior written notice before the commencement of a Renewal Term, provided such increase shall not exceed the lesser of five percent (5%) or the Consumer Price Index (CPI). If Client objects, Client may terminate without penalty.",
        category: "Payment & Fees"
      },
      {
        id: "c-3",
        section: "Section 8.1",
        title: "Limitation of Liability",
        text: "IN NO EVENT SHALL VENDOR'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT, WHETHER IN CONTRACT, TORT, OR OTHERWISE, EXCEED THE TOTAL AMOUNTS ACTUALLY PAID BY CLIENT IN THE ONE (1) MONTH PRECEDING THE EVENT GIVING RISE TO LIABILITY, EVEN IN CASES OF GROSS NEGLIGENCE, WILLFUL MISCONDUCT, OR DATA BREACH.",
        risk: "critical",
        riskLabel: "Extreme Asymmetric Liability Cap",
        issue: "Caps vendor liability to just 1 month of fees while Client bears full unlimited liability. Disclaims liability even for gross negligence and data breach, violating standard enterprise practice.",
        suggestedRedline: "EACH PARTY'S TOTAL AGGREGATE LIABILITY SHALL BE CAPPED AT THE TOTAL FEES PAID OR PAYABLE BY CLIENT UNDER THIS AGREEMENT IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM. NOTWITHSTANDING THE FOREGOING, NEITHER PARTY'S LIABILITY SHALL BE CAPPED WITH RESPECT TO GROSS NEGLIGENCE, WILLFUL MISCONDUCT, BREACH OF CONFIDENTIALITY, OR INDEMNIFICATION OBLIGATIONS.",
        category: "Liability & Indemnity"
      },
      {
        id: "c-4",
        section: "Section 9.3",
        title: "One-Way Indemnification",
        text: "Client agrees to defend, indemnify, and hold harmless Vendor, its affiliates, directors, and employees from any third-party claims, damages, liabilities, costs, and legal fees arising out of Client's use of the platform, regardless of fault or Vendor's underlying system defects.",
        risk: "critical",
        riskLabel: "Non-Mutual Indemnity",
        issue: "Client indemnifies vendor unconditionally even when vendor's code or hardware defects cause the harm, with no reciprocal IP infringement indemnity from Vendor.",
        suggestedRedline: "Each party shall indemnify, defend, and hold harmless the other party against third-party claims arising from: (a) gross negligence or willful misconduct; (b) breach of confidentiality; or (c) in Vendor's case, any claim that the Services infringe a third-party intellectual property right.",
        category: "Liability & Indemnity"
      },
      {
        id: "c-5",
        section: "Section 11.2",
        title: "Intellectual Property & Customer Data",
        text: "Client hereby grants Vendor a perpetual, irrevocable, worldwide, royalty-free license to access, ingest, train artificial intelligence algorithms, and commercially monetize all Customer Data uploaded or transmitted through the Services.",
        risk: "high",
        riskLabel: "Commercial AI Training on Client Data",
        issue: "Allows vendor to use confidential client data to train proprietary AI models and monetize derivative works without restriction or privacy protections.",
        suggestedRedline: "Client retains all right, title, and interest in and to Customer Data. Vendor shall only process Customer Data to the extent necessary to provide the Services and shall not use Customer Data for machine learning model training without Client's prior express written consent.",
        category: "Intellectual Property"
      },
      {
        id: "c-6",
        section: "Section 14.7",
        title: "Governing Law & Mandatory Arbitration",
        text: "This Agreement shall be governed by the laws of the State of Delaware. Any dispute shall be settled by binding arbitration in Wilmington, DE under AAA rules, with each party bearing its own costs and Client waiving any right to class or consolidated actions.",
        risk: "medium",
        riskLabel: "Dispute Forum & Cost Allocation",
        issue: "Arbitration clause contains class action waiver. Standard Delaware law is customary, but fee-shifting for prevailing party is missing.",
        suggestedRedline: "This Agreement shall be governed by the laws of the State of Delaware. In the event of any arbitration or legal proceeding, the prevailing party shall be entitled to recover reasonable attorney fees and costs.",
        category: "Governing Law"
      }
    ]
  },
  {
    id: "nda-mutual-safe",
    title: "Standard Mutual Non-Disclosure Agreement (MNDA)",
    parties: "Vanguard Innovations Ltd. & Stellar Health Corp.",
    effectiveDate: "2026-02-15",
    governingLaw: "State of New York, USA",
    riskScore: 89,
    riskLevel: "Low Risk (Balanced)",
    summary: "A standard, mutually protective two-way NDA with clear confidentiality definitions, reasonable 2-year survival term, standard standard-of-care, and customary trade secret protections.",
    clauses: [
      {
        id: "nda-1",
        section: "Section 1.1",
        title: "Definition of Confidential Information",
        text: "Confidential Information includes all non-public, proprietary information disclosed by one party ('Disclosing Party') to the other ('Receiving Party'), whether orally or in writing, that is designated as confidential or reasonably should be understood to be confidential.",
        risk: "low",
        riskLabel: "Standard Market Definition",
        issue: "No significant risks detected. Protects both tangible marked materials and contextual business confidential disclosures.",
        suggestedRedline: "Retain current standard phrasing.",
        category: "Confidentiality"
      },
      {
        id: "nda-2",
        section: "Section 3.1",
        title: "Standard of Care & Duty",
        text: "The Receiving Party agrees to protect the Confidential Information using the same degree of care it uses for its own confidential materials of like nature, but no less than a reasonable degree of care.",
        risk: "low",
        riskLabel: "Standard Reasonable Care",
        issue: "Benchmark legal wording compliant with common law standard of care.",
        suggestedRedline: "No modifications required.",
        category: "Confidentiality"
      },
      {
        id: "nda-3",
        section: "Section 4.2",
        title: "Term & Survival",
        text: "The obligations of confidentiality shall survive for a period of two (2) years from the date of disclosure; provided that with respect to Trade Secrets, such obligations shall continue for so long as the information remains a trade secret under applicable law.",
        risk: "low",
        riskLabel: "Trade Secret Exception Included",
        issue: "Adequately protects trade secrets beyond the general 2-year limitation period.",
        suggestedRedline: "No modifications required.",
        category: "Termination & Renewal"
      },
      {
        id: "nda-4",
        section: "Section 7.1",
        title: "Injunctive Relief",
        text: "Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm for which monetary damages alone would be inadequate, and Disclosing Party shall be entitled to seek equitable relief, including injunction.",
        risk: "medium",
        riskLabel: "Automatic Irreparable Harm Concession",
        issue: "Some courts disfavor automatic concessions of irreparable harm without evidentiary proof.",
        suggestedRedline: "Disclosing Party may seek injunctive relief from a court of competent jurisdiction without waiving any other rights or remedies available at law or in equity.",
        category: "Remedies & Enforcement"
      }
    ]
  },
  {
    id: "consulting-agreement",
    title: "Independent Contractor & Consulting Services Agreement",
    parties: "Acme Tech Ventures LLC (Company) vs. Jane Doe (Consultant)",
    effectiveDate: "2026-01-10",
    governingLaw: "State of California, USA",
    riskScore: 61,
    riskLevel: "Moderate Risk",
    summary: "Contains overly broad non-compete provisions that are likely void and unenforceable under California law (AB 1076 / SB 699), plus ambiguous work-for-hire IP assignment.",
    clauses: [
      {
        id: "ca-1",
        section: "Section 4.1",
        title: "Non-Competition & Restrictive Covenants",
        text: "Consultant agrees that during the term of this Agreement and for a period of eighteen (18) months following termination, Consultant shall not directly or indirectly provide services to, consult for, or establish any business entity that competes with Company in North America.",
        risk: "critical",
        riskLabel: "Unenforceable & Illegal Non-Compete",
        issue: "Violates California Business and Professions Code § 16600. Post-employment non-compete agreements are void and subject the employer to statutory civil penalties.",
        suggestedRedline: "Delete Section 4.1 in its entirety or replace with a reasonable non-solicitation of active employees and non-disclosure of proprietary trade secrets during the engagement term only.",
        category: "Restrictive Covenants"
      },
      {
        id: "ca-2",
        section: "Section 6.2",
        title: "Work Product & Inventions Assignment",
        text: "Consultant assigns to Company all right, title, and interest in all inventions, software code, concepts, and designs created or conceived during the term, whether or not conceived on Company time or using Company resources.",
        risk: "high",
        riskLabel: "Overreaching IP Assignment",
        issue: "Lacks statutory carve-out for prior inventions and California Labor Code § 2870 employee protection notice.",
        suggestedRedline: "Consultant assigns all Inventions created specifically for Company in connection with the Services. Inventions developed entirely on Consultant's own time without using Company equipment or confidential data are expressly excluded pursuant to applicable labor code exemptions.",
        category: "Intellectual Property"
      },
      {
        id: "ca-3",
        section: "Section 8.1",
        title: "Indemnity & Taxes",
        text: "Consultant shall indemnify Company for any reclassification claims, tax liabilities, or penalties assessed by tax authorities regarding independent contractor classification.",
        risk: "medium",
        riskLabel: "Contractor Misclassification Indemnity",
        issue: "Shifts legal burden of worker misclassification entirely to the individual contractor.",
        suggestedRedline: "Each party shall be responsible for its own tax compliance based upon the bona fide independent contractor relationship agreed upon in good faith.",
        category: "Liability & Indemnity"
      }
    ]
  }
];

export const LEGAL_TEMPLATES = [
  {
    id: "mutual-nda",
    title: "Mutual Non-Disclosure Agreement (NDA)",
    description: "Bilateral protection for sensitive corporate, product, or financial discussions.",
    category: "Confidentiality",
    jurisdictions: ["Delaware (US)", "California (US)", "England & Wales (UK)", "GDPR Compliant (EU)"],
    variables: [
      { name: "party1", label: "Disclosing Party / Party A", default: "Acme Holdings Inc." },
      { name: "party2", label: "Receiving Party / Party B", default: "Nexus Innovations LLC" },
      { name: "purpose", label: "Purpose of Disclosure", default: "Evaluating a strategic joint venture and commercial integration" },
      { name: "durationYears", label: "Confidentiality Term (Years)", default: "2" },
      { name: "jurisdiction", label: "Governing Law", default: "Delaware" }
    ]
  },
  {
    id: "saas-sla-clause",
    title: "Balanced Service Level Agreement (SLA) & Uptime Clause",
    description: "Industry-standard 99.9% availability commitment with scaled service credits.",
    category: "SLA & Performance",
    jurisdictions: ["General Commercial", "Delaware", "New York"],
    variables: [
      { name: "uptimeTarget", label: "Target Uptime (%)", default: "99.9%" },
      { name: "credit1", label: "Credit for <99.5%", default: "10% monthly fee" },
      { name: "credit2", label: "Credit for <99.0%", default: "25% monthly fee" },
      { name: "terminationThreshold", label: "Repeated Failure Termination Days", default: "3 consecutive months" }
    ]
  },
  {
    id: "ip-assignment",
    title: "Proprietary Information & Inventions Assignment Agreement",
    description: "Protects company ownership of all software code, patents, and work products.",
    category: "Intellectual Property",
    jurisdictions: ["California (Sec 2870 compliant)", "Delaware", "Federal US"],
    variables: [
      { name: "companyName", label: "Company Name", default: "Starlight Software Inc." },
      { name: "developerName", label: "Developer / Creator", default: "Alex Mercer" },
      { name: "effectiveDate", label: "Effective Date", default: "2026-04-01" }
    ]
  },
  {
    id: "limitation-liability-balanced",
    title: "Mutual Mutualized Limitation of Liability Clause",
    description: "Enterprise 12-month trailing fee liability cap with carve-outs for gross negligence.",
    category: "Risk Mitigation",
    jurisdictions: ["US Common Law", "UK Commercial Court"],
    variables: [
      { name: "capMultiplier", label: "Liability Cap Formula", default: "12 months aggregate fees paid" },
      { name: "superCapMultiplier", label: "Data Breach Super-Cap (optional)", default: "2x trailing 12 months" }
    ]
  }
];

export const COMPLIANCE_FRAMEWORKS = [
  {
    framework: "GDPR (EU General Data Protection Regulation)",
    status: "Attention Required",
    score: "72%",
    color: "amber",
    items: [
      { check: "Data Processing Agreement (DPA) Referenced", passed: false, note: "Missing mandatory Article 28 DPA schedule." },
      { check: "Cross-Border Data Transfer Safeguards (SCCs)", passed: false, note: "No Standard Contractual Clauses for EU-US data egress." },
      { check: "Sub-processor Notification Requirement", passed: true, note: "Vendor must provide 30 days prior notice for sub-processors." },
      { check: "Data Breach Notification Timeline", passed: true, note: "Notice required within 72 hours of incident confirmation." }
    ]
  },
  {
    framework: "California Privacy Rights Act (CPRA / CCPA)",
    status: "Compliant",
    score: "90%",
    color: "emerald",
    items: [
      { check: "Prohibition on Sale or Sharing of Personal Data", passed: true, note: "Contract explicitly restricts vendor from commercial sale." },
      { check: "Service Provider Certification under CPRA", passed: true, note: "Vendor certified as a statutory Service Provider." },
      { check: "Audit and Compliance Verification Rights", passed: false, note: "Client has limited annual audit access upon 60 days notice." }
    ]
  },
  {
    framework: "SOC 2 Type II & Security Safeguards",
    status: "Strong",
    score: "94%",
    color: "blue",
    items: [
      { check: "Annual Third-Party Audit Report Delivery", passed: true, note: "Vendor provides SOC 2 Type II report upon annual request." },
      { check: "AES-256 Encryption at Rest & in Transit (TLS 1.3)", passed: true, note: "Explicitly defined in Exhibit B Security Policy." },
      { check: "Disaster Recovery RPO / RTO Commitments", passed: true, note: "RPO < 1 hour, RTO < 4 hours specified." }
    ]
  }
];

