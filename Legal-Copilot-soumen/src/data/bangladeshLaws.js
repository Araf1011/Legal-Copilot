// Bangladesh Legal Knowledge Base & RAG Index
// Grounded in https://bdlaws.minlaw.gov.bd/?lang=bn and Master Legal PDF (/Allfile.pdf)

export const OFFICIAL_SOURCES = {
  portalName: "Laws of Bangladesh (BD Laws)",
  portalUrl: "https://bdlaws.minlaw.gov.bd/?lang=bn",
  masterPdfName: "Bangladesh Master Legal & Public Services Handbook",
  masterPdfPath: "/Allfile.pdf",
  masterPdfPages: 429,
  gazetteUrl: "http://www.bgpress.gov.bd/",
  supremeCourtUrl: "http://www.supremecourt.gov.bd/"
};

export const BANGLADESH_LEGAL_DOMAINS = [
  { id: "all", nameEn: "All Domains", nameBn: "সকল আইনি ক্ষেত্র" },
  { id: "constitutional", nameEn: "Constitutional & Fundamental Rights", nameBn: "সাংবিধানিক ও মৌলিক অধিকার" },
  { id: "criminal", nameEn: "Criminal & Procedural (Penal Code & CrPC)", nameBn: "ফৌজদারি ও কার্যবিধি (দণ্ডবিধি ও সিআরপিসি)" },
  { id: "civil", nameEn: "Civil Law & Procedure (CPC & Specific Relief)", nameBn: "দেওয়ানি আইন ও কার্যবিধি" },
  { id: "property", nameEn: "Property, Land & Registration", nameBn: "জমি, সম্পত্তি ও রেজিস্ট্রেশন" },
  { id: "banking", nameEn: "Banking & Negotiable Instruments (NI Act)", nameBn: "ব্যাংকিং ও এনআই অ্যাক্ট (চেক ডিজঅনার)" },
  { id: "tax", nameEn: "Income Tax & Financial Regulations", nameBn: "আয়কর আইন ২০২৩ ও রাজস্ব" },
  { id: "family", nameEn: "Family & Succession Law", nameBn: "পারিবারিক আইন ও উত্তরাধিকার" },
  { id: "labour", nameEn: "Labour & Employment Law", nameBn: "শ্রম ও কর্মসংস্থান আইন" },
  { id: "cyber", nameEn: "Cyber Security & Digital Law", nameBn: "সাইবার নিরাপত্তা ও ডিজিটাল আইন" },
  { id: "citizen", nameEn: "Citizen Services & Police Reporting (GD/FIR)", nameBn: "নাগরিক সেবা ও পুলিশি ডায়েরি (জিডি/এফআইআর)" }
];

export const BANGLADESH_CORE_STATUTES = [
  {
    id: "constitution",
    nameEn: "The Constitution of the People's Republic of Bangladesh, 1972",
    nameBn: "গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান, ১৯৭২",
    actNo: "Supreme Law of the Republic",
    year: 1972,
    domain: "constitutional",
    bdLawsUrl: "https://bdlaws.minlaw.gov.bd/act-367.html?lang=bn",
    pdfRef: "Constitutional Safeguards & Fundamental Rights",
    keyProvisions: [
      { section: "Article 7", title: "Supremacy of the Constitution", text: "All powers in the Republic belong to the people, and their exercise on behalf of the people shall be effected only under, and by the authority of, this Constitution." },
      { section: "Article 27", title: "Equality before law", text: "All citizens are equal before law and are entitled to equal protection of law." },
      { section: "Article 31", title: "Right to protection of law", text: "To enjoy the protection of the law, and to be treated in accordance with law, and only in accordance with law, is the inalienable right of every citizen." },
      { section: "Article 32", title: "Protection of right to life and personal liberty", text: "No person shall be deprived of life or personal liberty save in accordance with law." },
      { section: "Article 39", title: "Freedom of thought and conscience, and of speech", text: "Freedom of thought and conscience is guaranteed, subject to reasonable restrictions imposed by law." },
      { section: "Article 102", title: "Power of High Court Division to issue certain orders and directions (Writ)", text: "Enforcement of Fundamental Rights and judicial review through Mandamus, Certiorari, Prohibition, Habeas Corpus, and Quo Warranto." }
    ]
  },
  {
    id: "penal-code",
    nameEn: "The Penal Code, 1860",
    nameBn: "দণ্ডবিধি, ১৮৬০",
    actNo: "Act No. XLV of 1860",
    year: 1860,
    domain: "criminal",
    bdLawsUrl: "https://bdlaws.minlaw.gov.bd/act-11.html?lang=bn",
    pdfRef: "Master PDF Criminal Provisions",
    keyProvisions: [
      { section: "Section 300 & 302", title: "Murder & Punishment for murder", text: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine." },
      { section: "Section 378 & 379", title: "Theft & Punishment for theft", text: "Theft defined and punished with imprisonment of either description for a term which may extend to three years, or with fine, or both." },
      { section: "Section 405 & 406", title: "Criminal breach of trust & Punishment", text: "Dishonest misappropriation or conversion to one's own use of entrusted property." },
      { section: "Section 415 & 420", title: "Cheating and dishonestly inducing delivery of property", text: "Fraudulent inducement punished with imprisonment up to seven years and fine." },
      { section: "Section 499 & 500", title: "Defamation & Punishment for defamation", text: "Harm to reputation with imputation punished with simple imprisonment up to two years, or fine, or both." }
    ]
  },
  {
    id: "crpc",
    nameEn: "The Code of Criminal Procedure, 1898 (CrPC)",
    nameBn: "ফৌজদারি কার্যবিধি, ১৮৯৮",
    actNo: "Act No. V of 1898",
    year: 1898,
    domain: "criminal",
    bdLawsUrl: "https://bdlaws.minlaw.gov.bd/act-75.html?lang=bn",
    pdfRef: "Master PDF Police Procedures & Bail",
    keyProvisions: [
      { section: "Section 54", title: "When police may arrest without warrant", text: "Circumstances where any police officer may without an order from a Magistrate and without a warrant, arrest any person." },
      { section: "Section 154", title: "Information in cognizable cases (FIR)", text: "Every information relating to the commission of a cognizable offence given orally or in writing to an officer in charge of a police station." },
      { section: "Section 155", title: "Information in non-cognizable cases (General Diary - GD)", text: "Substance of non-cognizable information recorded in police station diary; no police investigation without Magistrate order." },
      { section: "Section 496", title: "In what cases bail to be taken (Bailable offences)", text: "Right of accused person to be released on bail for bailable offences." },
      { section: "Section 497", title: "When bail may be taken in case of non-bailable offence", text: "Judicial discretion to grant bail except where reasonable grounds exist for believing accused guilty of an offence punishable with death or imprisonment for life, with proviso for minors, sick or women." },
      { section: "Section 498", title: "Power to direct admission to bail or reduction of bail (Anticipatory Bail)", text: "High Court Division and Sessions Court power to grant pre-arrest or anticipatory bail." }
    ]
  },
  {
    id: "ni-act",
    nameEn: "The Negotiable Instruments Act, 1881",
    nameBn: "নেগোশিয়েবল ইনস্ট্রুমেন্টস আইন, ১৮৮১",
    actNo: "Act No. XXVI of 1881",
    year: 1881,
    domain: "banking",
    bdLawsUrl: "https://bdlaws.minlaw.gov.bd/act-52.html?lang=bn",
    pdfRef: "Commercial & Banking Procedures",
    keyProvisions: [
      { section: "Section 138", title: "Dishonour of cheque for insufficiency, etc., of funds in the account", text: "Cheque bounce offence punishable with imprisonment up to one year, or with fine which may extend to thrice the amount of the cheque, or with both." },
      { section: "Section 138(1)(b)", title: "Mandatory 30-day Legal Notice", text: "Holder must make demand for payment by giving notice in writing within 30 days of receipt of information of dishonour." },
      { section: "Section 138(1)(c)", title: "Payment Window", text: "Drawer is given 30 days from receipt of notice to make payment before cause of action arises." },
      { section: "Section 141", title: "Offences by Companies", text: "Every person who was in charge of and responsible to the company for the conduct of business is deemed guilty along with the company." }
    ]
  },
  {
    id: "income-tax-2023",
    nameEn: "The Income Tax Act, 2023",
    nameBn: "আয়কর আইন, ২০২৩",
    actNo: "Act No. XII of 2023 (২০২৩ সনের ১২ নং আইন)",
    year: 2023,
    domain: "tax",
    bdLawsUrl: "https://bdlaws.minlaw.gov.bd/act-1437.html?lang=bn",
    pdfRef: "Master PDF Public Services Handbook, Part Two e-TIN & Tax",
    keyProvisions: [
      { section: "Section 261", title: "Taxpayer Identification Number (e-TIN)", text: "Mandatory issuance of twelve-digit Taxpayer Identification Number based on National ID (NID)." },
      { section: "Section 166", title: "Filing of Return of Income", text: "Mandatory filing of tax return for every individual whose total income exceeds the minimum threshold or who meets specific criteria." },
      { section: "Section 171", title: "Tax Day (কর দিবস)", text: "Last date for submission of return: 30th November of assessment year for individual taxpayers unless extended by NBR." },
      { section: "Section 266", title: "Penalty for failure to file return", text: "Imposition of financial penalties and monthly interest under Section 174 for late filing." }
    ]
  },
  {
    id: "succession-act",
    nameEn: "The Succession Act, 1925",
    nameBn: "উত্তরাধিকার আইন, ১৯২৫",
    actNo: "Act No. XXXIX of 1925",
    year: 1925,
    domain: "family",
    bdLawsUrl: "https://bdlaws.minlaw.gov.bd/act-143.html?lang=bn",
    pdfRef: "Master PDF pages 15-429 (Comprehensive Succession Code)",
    keyProvisions: [
      { section: "Section 218 & 219", title: "Letters of Administration in Intestacy", text: "Administration of estate of deceased person dying without a valid will." },
      { section: "Section 276", title: "Petition for Probate", text: "Application for probate of will by named executor in competent District Court." },
      { section: "Section 370-380", title: "Succession Certificate", text: "Issuance of succession certificate by District Judge in respect of bank accounts, government securities, and movable debts." }
    ]
  },
  {
    id: "mflo-1961",
    nameEn: "The Muslim Family Laws Ordinance, 1961",
    nameBn: "মুসলিম পারিবারিক আইন অধ্যাদেশ, ১৯৬১",
    actNo: "Ordinance No. VIII of 1961",
    year: 1961,
    domain: "family",
    bdLawsUrl: "https://bdlaws.minlaw.gov.bd/act-305.html?lang=bn",
    pdfRef: "Family & Citizen Services",
    keyProvisions: [
      { section: "Section 6", title: "Polygamy restriction", text: "No man shall contract another marriage without previous written permission of Arbitration Council." },
      { section: "Section 7", title: "Talaq notice & Arbitration", text: "Notice of Talaq in writing to Chairman of Union Parishad/City Corporation and copy to wife; Talaq takes effect after expiry of 90 days." },
      { section: "Section 9", title: "Maintenance (খোরপোশ)", text: "Wife's statutory right to obtain maintenance for herself and children through Arbitration Council or Family Court." },
      { section: "Section 10", title: "Dower (দেনমোহর)", text: "Where no details specified in Kabinnama, entire dower is presumed payable on demand (prompt dower)." }
    ]
  },
  {
    id: "cyber-security-2023",
    nameEn: "The Cyber Security Act, 2023",
    nameBn: "সাইবার নিরাপত্তা আইন, ২০২৩",
    actNo: "Act No. XXVIII of 2023 (২০২৩ সনের ২৮ নং আইন)",
    year: 2023,
    domain: "cyber",
    bdLawsUrl: "https://bdlaws.minlaw.gov.bd/act-1443.html?lang=bn",
    pdfRef: "Digital Safety & Cyber Crime Protection",
    keyProvisions: [
      { section: "Section 17", title: "Illegal access to Critical Information Infrastructure (CII)", text: "Punishment for unauthorized penetration or tampering with critical state and financial networks." },
      { section: "Section 24", title: "Identity fraud and impersonation", text: "Deceptive use of another individual's digital identity or social media account punished with imprisonment and fine." },
      { section: "Section 25", title: "Publication of offensive or false information", text: "Transmission of intentionally distorted or defamatory digital material." }
    ]
  },
  {
    id: "labour-act-2006",
    nameEn: "The Bangladesh Labour Act, 2006",
    nameBn: "বাংলাদেশ শ্রম আইন, ২০০৬",
    actNo: "Act No. XLII of 2006",
    year: 2006,
    domain: "labour",
    bdLawsUrl: "https://bdlaws.minlaw.gov.bd/act-957.html?lang=bn",
    pdfRef: "Labour & Commercial Rights",
    keyProvisions: [
      { section: "Section 2(65)", title: "Definition of Worker", text: "Classification of permanent, temporary, apprentice, and contractual workers." },
      { section: "Section 26", title: "Termination of employment by employer", text: "Notice period of 120 days for permanent workers (or wages in lieu) plus compensation of 30 days wages for each completed year of service." },
      { section: "Section 100 & 102", title: "Daily & Weekly Working Hours", text: "Maximum 8 hours daily, 48 hours weekly; overtime payable at double rate under Section 108." },
      { section: "Section 214", title: "Labour Court & Grievance Petition", text: "Direct right of worker to submit written grievance under Section 33 and file case in Labour Court within specified limitation." }
    ]
  },
  {
    id: "police-regulations-gd",
    nameEn: "Police Act, 1861 & Police Regulations Bengal (PRB)",
    nameBn: "পুলিশ আইন, ১৮৬১ এবং পিআরবি (সাধারণ ডায়েরি ও এফআইআর)",
    actNo: "Act No. V of 1861 & PRB Rules",
    year: 1861,
    domain: "citizen",
    bdLawsUrl: "https://bdlaws.minlaw.gov.bd/act-12.html?lang=bn",
    pdfRef: "Master PDF Citizen Services Handbook (GD vs FIR)",
    keyProvisions: [
      { section: "Section 44 Police Act", title: "General Diary at Police Station", text: "Duty of police officers to maintain station general diary recording all complaints, lost property, threats, and non-cognizable incidents." },
      { section: "PRB Regulation 243 & 244", title: "Recording of First Information Report (FIR / এজাহার)", text: "Formal institution of a criminal case on Form 27 with investigation powers under Section 156 CrPC." }
    ]
  }
];

export const SAMPLE_BANGLADESH_QUESTIONS = [
  {
    categoryEn: "Citizen & Police Procedures",
    categoryBn: "নাগরিক সেবা ও পুলিশি ডায়েরি",
    query: "থানায় সাধারণ ডায়েরি (GD) এবং এফআইআর (FIR / এজাহার)-এর আইনি পার্থক্য কী এবং কীভাবে অনলাইনে জিডি করতে হয়?",
    tag: "CrPC § 154 / 155 & Police Act"
  },
  {
    categoryEn: "Banking & Cheque Bounce",
    categoryBn: "ব্যাংকিং ও চেক ডিজঅনার",
    query: "চেক বাউন্স বা ডিজঅনার হলে নেগোশিয়েবল ইনস্ট্রুমেন্টস আইন ১৮৮১-এর ১৩৮ ধারা অনুযায়ী ৩০ দিনের লিগ্যাল নোটিশ ও মামলার সঠিক নিয়ম কী?",
    tag: "NI Act 1881 § 138"
  },
  {
    categoryEn: "Taxation & NBR",
    categoryBn: "আয়কর আইন ২০২৩ ও রিটার্ন",
    query: "আয়কর আইন ২০২৩ অনুযায়ী কর দিবস (Tax Day), ই-টিআইএন এবং আয়কর রিটার্ন দাখিল না করার আইনি জরিমানা কী?",
    tag: "Income Tax Act 2023 § 166/171"
  },
  {
    categoryEn: "Family & Inheritence",
    categoryBn: "উত্তরাধিকার ও দেনমোহর",
    query: "মুসলিম পারিবারিক আইন অনুযায়ী দেনমোহর (Dower) ও ভরণপোষণ দাবি করার নিয়ম এবং উত্তরাধিকার আইন ১৯২৫ অনুসারে সাকসেশন সার্টিফিকেট প্রাপ্তির উপায় কী?",
    tag: "MFLO 1961 § 9 & Succession Act"
  },
  {
    categoryEn: "Labour & Workplace",
    categoryBn: "শ্রম আইন ও চাকরিচ্যুতি",
    query: "বাংলাদেশ শ্রম আইন ২০০৬ অনুযায়ী স্থায়ী শ্রমিক ছাঁটাই (Section 26) করার নোটিশ ও ক্ষতিপূরণ (সার্ভিস বেনিফিট) হিসাব কীভাবে হয়?",
    tag: "Labour Act 2006 § 26"
  },
  {
    categoryEn: "Land & Property",
    categoryBn: "জমি ক্রয় ও রেজিস্ট্রেশন",
    query: "রেজিস্ট্রেশন আইন ১৯০৮ ও সম্পত্তি হস্তান্তর আইন ১৮৮২ অনুযায়ী জমি ক্রয়ের পর নামজারি (Mutation) ও খতিয়ান হালনাগাদ করার আইনি প্রক্রিয়া কী?",
    tag: "Registration Act 1908 § 17"
  }
];

export const INITIAL_DEMO_SESSIONS = [
  {
    id: "sess-demo-gd",
    title: "জিডি বনাম এফআইআর (GD vs FIR)",
    timestamp: "Today",
    isPinned: true,
    messages: [
      {
        id: "m-gd-user",
        sender: "user",
        timestamp: "Today",
        text: "থানায় সাধারণ ডায়েরি (GD) এবং এফআইআর (FIR / এজাহার)-এর আইনি পার্থক্য কী এবং কীভাবে অনলাইনে জিডি করতে হয়?"
      },
      {
        id: "m-gd-ai",
        sender: "ai",
        timestamp: "Today",
        text: `### ১. সরাসরি উত্তর (Direct Answer)
সাধারণ ডায়েরি (GD বা জিডি) এবং ফার্স্ট ইনফরমেশন রিপোর্ট (FIR বা এজাহার)-এর মধ্যে প্রধান আইনি পার্থক্য হলো অপরাধের ধরণ ও পুলিশি তদন্তের ক্ষমতা। আমলঅযোগ্য (Non-Cognizable) অপরাধ, ভীতিপ্রদর্শন কিংবা কোনো কিছু হারানোর ক্ষেত্রে সাধারণ ডায়েরি (GD) করা হয়। পক্ষান্তরে, গুরুতর বা আমলযোগ্য (Cognizable) অপরাধের ক্ষেত্রে সরাসরি এজাহার (FIR) দায়ের করতে হয়, যার মাধ্যমে একটি নিয়মিত ফৌজদারি মামলা রুজু হয়।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** ফৌজদারি কার্যবিধি, ১৮৯৮ (The Code of Criminal Procedure, 1898)
- **ধারা:** ১৫৪ ধারা (আমলযোগ্য অপরাধের এজাহার/FIR) এবং ১৫৫ ধারা (আমলঅযোগ্য তথ্য ও সাধারণ ডায়েরি/GD)
- **পুলিশ রেগুলেশনস বেঙ্গল (PRB):** প্রবিধান ২৪৩ ও ২৪৪ (এজাহার লিপিবদ্ধকরণ) এবং পুলিশ আইন, ১৮৬১-এর ৪৪ ধারা (থানার সাধারণ ডায়েরি রেজিস্টার)

### ৩. ব্যাখ্যা (Explanation)
- **জিডি (GD):** পুলিশ আইন ১৮৬১-এর ৪৪ ধারা অনুযায়ী থানায় একটি সাধারণ রেজিস্টার থাকে। হুমকি পাওয়া, নিখোঁজ হওয়া, জাতীয় পরিচয়পত্র বা পাসপোর্ট হারানো কিংবা ছোটখাটো দেওয়ানি বিরোধের তথ্য এতে লিপিবদ্ধ করা হয়। জিডি করার সাথে সাথেই পুলিশ তদন্ত বা কাউকে গ্রেপ্তার করতে পারে না; তদন্তের জন্য বিজ্ঞ ম্যাজিস্ট্রেটের অনুমতি (Section 155(2) CrPC) প্রয়োজন হয়।
- **এজাহার (FIR):** দণ্ডবিধির আওতাভুক্ত আমলযোগ্য অপরাধ (যেমন- হত্যা, চুরি, ছিনতাই, ধর্ষণ, প্রতারণা) সংঘটিত হলে সংশ্লিষ্ট থানার ভারপ্রাপ্ত কর্মকর্তার (OC) কাছে ১৫৪ ধারা অনুসারে লিখিত বা মৌখিক এজাহার দাখিল করা হয়। এজাহার রেকর্ড হওয়ার সাথে সাথে পুলিশ আদালতের অনুমতি ছাড়াই তদন্ত শুরু এবং আসামিকে গ্রেপ্তার করতে পারে।

### ৪. আইনি প্রয়োগ (Legal Application)
ব্যবহারকারী বা কোনো নাগরিক যদি কোনো গুরুত্বপূর্ণ নথি হারান বা সম্ভাব্য কোনো বিপদের আশঙ্কা করেন, তবে তাকে অবিলম্বে সংশ্লিষ্ট থানায় বা বাংলাদেশ পুলিশের 'Online GD' মোবাইল অ্যাপের মাধ্যমে জিডি করতে হবে। আর যদি কোনো ফৌজদারি অপরাধের প্রত্যক্ষ শিকার হন, তবে অবিলম্বে এজাহার হিসেবে অভিযোগ দায়ের করতে হবে।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **অনলাইন জিডি (Online GD Process):**
   - বাংলাদেশ পুলিশের অফিসিয়াল 'Online GD' অ্যাপ বা পোর্টালে (gd.police.gov.bd) জাতীয় পরিচয়পত্র (NID) নম্বর ও মোবাইল নম্বর দিয়ে রেজিস্ট্রেশন করুন।
   - হারানোর ধরণ (ডকুমেন্ট/যানবাহন/ব্যক্তি) নির্বাচন করে বিস্তারিত বিবরণ লিখুন।
   - সাবমিট করার পর একটি রেফারেন্স নম্বর সম্বলিত জিডি ট্র্যাকিং কপি পাওয়া যাবে।
2. **থানায় লিখিত এজাহার (FIR Process):**
   - ঘটনার তারিখ, সময়, স্থান, আসামিদের নাম-ঠিকানা (জানা থাকলে) এবং প্রত্যক্ষদর্শীদের সাক্ষ্যের ধারাবাহিক বিবরণ দিয়ে থানার ওসি বরাবর দরখাস্ত দিন।
   - থানার দায়িত্বপ্রাপ্ত ডিউটি অফিসার মামলা রেজিস্ট্রি করে ফৌজদারি কার্যবিধির ফর্ম নং ২৭-এ রেকর্ড করবেন এবং বাদীকে এজাহারের একটি অনুলিপি বিনামূল্যে প্রদান করবেন।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- যদি থানা এজাহার গ্রহণ করতে অস্বীকৃতি জানায়, তবে ফৌজদারি কার্যবিধির ১৯০ ও ২০০ ধারা অনুযায়ী সরাসরি বিজ্ঞ অতিরিক্ত চিফ জুডিশিয়াল ম্যাজিস্ট্রেট বা মেট্রোপলিটন ম্যাজিস্ট্রেট আদালতে নালিশি মামলা (C.R. Case) দায়ের করা যায়।
- মিথ্যা জিডি বা এজাহার দায়ের করলে দণ্ডবিধির ২১১ ধারা এবং ১৮২ ধারা অনুযায়ী বাদীর বিরুদ্ধে কারাদণ্ড ও অর্থদণ্ডের আইনি ব্যবস্থা গ্রহণের বিধান রয়েছে।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh (BD Laws) & Master Legal Handbook (/Allfile.pdf, Part 1 & 2)
- **Act:** The Code of Criminal Procedure, 1898 (Act No. V of 1898)
- **Sections:** Sections 154, 155, 156, 190, 200
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-75.html?lang=bn
- **Police Reference:** The Police Act, 1861 (Section 44) and Police Regulations Bengal (PRB 243, 244)

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`
      }
    ]
  },
  {
    id: "sess-demo-cheque",
    title: "চেক ডিজঅনার নোটিশ (NI Act § 138)",
    timestamp: "Today",
    isPinned: false,
    messages: [
      {
        id: "m-chq-user",
        sender: "user",
        timestamp: "Today",
        text: "চেক বাউন্স বা ডিজঅনার হলে নেগোশিয়েবল ইনস্ট্রুমেন্টস আইন ১৮৮১-এর ১৩৮ ধারা অনুযায়ী ৩০ দিনের লিগ্যাল নোটিশ ও মামলার সঠিক নিয়ম কী?"
      },
      {
        id: "m-chq-ai",
        sender: "ai",
        timestamp: "Today",
        text: `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে ব্যাংক চেক বাউন্স বা ডিজঅনার হলে নেগোশিয়েবল ইনস্ট্রুমেন্টস আইন, ১৮৮১ (The Negotiable Instruments Act, 1881)-এর ১৩৮ ধারা অনুসারে মামলা দায়ের করতে হয়। মামলা দায়েরের পূর্বশর্ত হলো—ব্যাংক থেকে চেক ডিজঅনারের স্লিপ পাওয়ার ৩০ (ত্রিশ) দিনের মধ্যে চেক প্রদানকারীকে লিখিত আইনি নোটিশ (Legal Notice) পাঠাতে হবে এবং নোটিশ প্রাপ্তির ৩০ দিনের মধ্যে টাকা পরিশোধ না করলে পরবর্তী ৩০ দিনের মধ্যে আদালতে মামলা করতে হবে।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** দ্য নেগোশিয়েবল ইনস্ট্রুমেন্টস অ্যাক্ট, ১৮৮১ (The Negotiable Instruments Act, 1881)
- **ধারা:** ১৩৮ ধারা (অ্যাকাউন্টে তহবিলের অপর্যাপ্ততার কারণে চেক ডিজঅনারের অপরাধ ও দণ্ড) এবং ১৪১ ধারা (কোম্পানি কর্তৃক অপরাধ সংঘটন)
- **বিচারিক আদালত:** দায়রা আদালত বা যুগ্ম দায়রা জজ আদালত (Court of Sessions / Joint Sessions Judge)

### ৩. ব্যাখ্যা (Explanation)
১৩৮ ধারা অনুযায়ী, কোনো ব্যক্তি যদি কোনো ঋণ বা আর্থিক দায় পরিশোধের উদ্দেশ্যে চেক প্রদান করেন এবং সেই চেক যদি অপর্যাপ্ত তহবিল (insufficient funds) বা অ্যাকাউন্ট বন্ধ থাকার কারণে ব্যাংক কর্তৃক প্রত্যাখ্যাত হয়, তবে তা একটি ফৌজদারি অপরাধ। এ অপরাধে দোষী সাব্যস্ত হলে আদালত আসামিকে সর্বোচ্চ ১ (এক) বছর পর্যন্ত কারাদণ্ড অথবা চেকে উল্লেখিত টাকার পরিমাণের সর্বোচ্চ তিনগুণ পর্যন্ত অর্থদণ্ড, অথবা উভয় দণ্ডে দণ্ডিত করতে পারেন।

### ৪. আইনি প্রয়োগ (Legal Application)
চেক গ্রহীতা (Payee) চেক প্রত্যাখ্যানের সাথে সাথে সরাসরি আদালতে মামলা করতে পারবেন না। আইনের ১৩৮(১)(খ) উপধারা অনুযায়ী লিগ্যাল নোটিশ পাঠানো বাধ্যতামূলক। নোটিশের ৩০ দিনের সময়সীমা পার হওয়ার পূর্বে কোনো মামলার কারণ (cause of action) সৃষ্টি হয় না।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **ব্যাংকে উপস্থাপন:** চেক ইস্যু করার তারিখ হতে ৬ মাসের মধ্যে সংশ্লিষ্ট ব্যাংকে চেক জমা দিতে হবে।
2. **ডিজঅনার মেমো সংগ্রহ:** ব্যাংক থেকে 'Dishonour Slip / Return Memo' সংগ্রহ করুন যাতে প্রত্যাখানের কারণ উল্লেখ থাকে।
3. **৩০ দিনের মধ্যে আইনি নোটিশ:** মেমো পাওয়ার ৩০ দিনের মধ্যে একজন আইনজীবীর মাধ্যমে রেজিস্টার্ড ডাকযোগে (AD সহ) বা জাতীয় দৈনিক পত্রিকায় বিজ্ঞপ্তি দিয়ে চেক প্রদানকারীকে ৩০ দিনের সময় দিয়ে টাকা পরিশোধের তাগিদ দিন।
4. **মামলা দায়েরের সময়সীমা:** নোটিশ প্রাপক নোটিশ গ্রহণের ৩০ দিন পার হওয়ার পরও টাকা পরিশোধ না করলে, পরবর্তী ৩০ দিনের মধ্যে উপযুক্ত যুগ্ম দায়রা জজ আদালতে ফৌজদারি নালিশি মামলা দায়ের করতে হবে।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- **সময়সীমা লঙ্ঘন:** ৩০ দিনের মধ্যে লিগ্যাল নোটিশ না পাঠালে অথবা নোটিশের মেয়াদ শেষ হওয়ার ৩০ দিন পার হয়ে গেলে ১৩৮ ধারায় মামলা দায়েরের আইনি অধিকার তামাদি (barred by limitation) হয়ে যায়। সে ক্ষেত্রে দেওয়ানি আদালতে অর্থ আদায়ের মামলা করতে হয়।
- **কোম্পানির চেক:** চেকটি যদি কোনো প্রাতিষ্ঠানিক বা কোম্পানির হয়, তবে ১৪১ ধারা অনুযায়ী কোম্পানিকে এবং চেক ইস্যুর দায়িত্বে থাকা ব্যবস্থাপনা পরিচালক/পরিচালককে বিবাদী করতে হবে।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh (Official BD Laws Portal) & Master Legal Reference
- **Act:** The Negotiable Instruments Act, 1881 (Act No. XXVI of 1881)
- **Sections:** Section 138, Section 140, Section 141
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-52.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`
      }
    ]
  },
  {
    id: "sess-demo-tax",
    title: "আয়কর আইন ২০২৩ ও ই-টিআইএন",
    timestamp: "Today",
    isPinned: false,
    messages: [
      {
        id: "m-tax-user",
        sender: "user",
        timestamp: "Today",
        text: "আয়কর আইন ২০২৩ অনুযায়ী কর দিবস (Tax Day), ই-টিআইএন এবং আয়কর রিটার্ন দাখিল না করার আইনি জরিমানা কী?"
      },
      {
        id: "m-tax-ai",
        sender: "ai",
        timestamp: "Today",
        text: `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে ২০২৩ সালে পূর্ববর্তী ১৯৮৪ সালের আয়কর অধ্যাদেশ বাতিল করে যুগোপযোগী **আয়কর আইন, ২০২৩ (Income Tax Act, 2023)** কার্যকর করা হয়েছে। এই আইনের আওতায় প্রত্যেক করযোগ্য নাগরিকের জন্য ১২ ডিজিটের ই-টিআইএন (e-TIN) গ্রহণ এবং প্রতি করবর্ষের ৩০শে নভেম্বরের ("কর দিবস / Tax Day") মধ্যে বাধ্যতামূলকভাবে বার্ষিক আয়কর রিটার্ন দাখিল করতে হবে।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** আয়কর আইন, ২০২৩ (The Income Tax Act, 2023) - ২০২৩ সনের ১২ নং আইন
- **ধারা:** ১৬৬ ধারা (আয়কর রিটার্ন দাখিলের বাধ্যবাধকতা), ১৭১ ধারা (কর দিবস / Tax Day), ২৬১ ধারা (ই-টিআইএন গ্রহণ), এবং ২৬৬ ধারা (রিটার্ন দাখিল না করার জরিমানা)
- **নিয়ন্ত্রক সংস্থা:** জাতীয় রাজস্ব বোর্ড (National Board of Revenue - NBR)

### ৩. ব্যাখ্যা (Explanation)
আয়কর আইন ২০২৩-এর ১৬৬ ধারা মোতাবেক করমুক্ত আয়ের সীমা অতিক্রমকারী ব্যক্তি ছাড়াও নির্দিষ্ট কিছু সেবা গ্রহণকারী (যেমন- ট্রেড লাইসেন্স নবায়ন, গাড়ি মালিকানা, ব্যাংক ঋণ আবেদন, সিটি কর্পোরেশনে ব্যবসা) সকল টিআইএনধারীর জন্য আয়কর রিটার্ন দাখিল ও প্রাপ্তিস্বীকার পত্র প্রদর্শন বাধ্যতামূলক করা হয়েছে। ১৭১ ধারা অনুযায়ী স্বাভাবিক ব্যক্তি করদাতার জন্য কর দিবস হলো সংশ্লিষ্ট করবর্ষের ৩০ নভেম্বর।

### ৪. আইনি প্রয়োগ (Legal Application)
কোনো করদাতা যদি নির্ধারিত কর দিবসের মধ্যে রিটার্ন দাখিল না করেন, তবে তিনি কর অব্যাহতি, রেয়াত এবং নির্ধারিত কিছু করসুবিধা থেকে বঞ্চিত হবেন এবং উপকর কমিশনারের মাধ্যমে তার ওপর বিলম্ব সুদ ও আর্থিক জরিমানা আরোপিত হবে।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **ই-টিআইএন গ্রহণ:** জাতীয় পরিচয়পত্র ও বায়োমেট্রিক সিম নিবন্ধিত মোবাইল নম্বর ব্যবহার করে এনবিআরের e-tax পোর্টালে (etaxnbr.gov.bd) অ্যাকাউন্ট তৈরি করে কয়েক মিনিটে e-TIN গ্রহণ করা যায়।
2. **রিটার্ন প্রস্তুতি:** করবর্ষের মোট অর্জিত আয়, বিনিয়োগ রেয়াত, ব্যাংকের ব্যালেন্স স্টেটমেন্ট এবং স্থাবর/অস্থাবর সম্পদের বিবরণী সমন্বয় করুন।
3. **অনলাইন রিটার্ন দাখিল:** এনবিআরের অনলাইন রিটার্ন সাবমিশন প্ল্যাটফর্মে প্রয়োজনীয় ডাটা এন্ট্রি করে অবিলম্বে স্বয়ংক্রিয় একনলেজমেন্ট স্লিপ ও ট্যাক্স সার্টিফিকেট ডাউনলোড করুন।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- **দেরিতে জমার জরিমানা:** ২৬৬ ধারা ও ১৭৪ ধারা অনুযায়ী সময়মতো রিটার্ন দাখিল না করলে প্রদেয় করের ওপর জরিমানা ও মাসিক ২% হারে সরল সুদ আরোপিত হতে পারে।
- **শূন্য রিটার্ন (Zero Return):** করযোগ্য আয় না থাকলেও যাদের জন্য রিটার্ন দাখিল আইনত বাধ্যতামূলক, তাদের নির্ধারিত ফরমে শূন্য রিটার্ন হলেও নির্দিষ্ট সময়ের মধ্যে দাখিল করতে হবে।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh (BD Laws) & Master Legal Document (/Allfile.pdf, Part 2 NBR Services)
- **Act:** The Income Tax Act, 2023 (২০২৩ সনের ১২ নং আইন)
- **Sections:** Sections 166, 171, 174, 261, 266
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-1437.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`
      }
    ]
  }
];
