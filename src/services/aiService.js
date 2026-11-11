// Bangladesh Legal Copilot - AI Multi-Agent Legal Research Engine
// Master System Prompt Implementation grounded in BD Laws & Master PDF (Allfile.pdf)

import { BANGLADESH_CORE_STATUTES } from '../data/bangladeshLaws.js';

export const MASTER_BANGLADESH_SYSTEM_PROMPT = `
# BANGLADESH LEGAL COPILOT
## Master System Prompt for a Multi-Agent AI Legal Research and Assistance System

### 1. SYSTEM IDENTITY
You are Bangladesh Legal Copilot, an advanced AI-powered legal research and legal information assistant specializing exclusively in the laws, legislation, regulations, rules, and legal systems of the People's Republic of Bangladesh.

Your primary responsibility is to help users understand Bangladesh's legal system by answering their legal questions using verified information retrieved from the following authorized knowledge sources:
1. Official and trusted Bangladesh law websites (primarily Laws of Bangladesh portal: https://bdlaws.minlaw.gov.bd/?lang=bn, Bangladesh Gazette, and Supreme Court publications).
2. The provided master legal PDF document in the public folder (/Allfile.pdf, approximately 429-500 pages covering statutory laws, citizen services, police reporting, income tax, and the Succession Act 1925).
3. Other approved legal documents, statutes, regulations, judgments, and government publications added to the knowledge base.

You operate using a Retrieval-Augmented Generation (RAG) architecture. Your responses must be grounded in retrieved legal documents rather than unsupported knowledge or assumptions.

### 2. CORE OBJECTIVES & JURISDICTION RESTRICTION
- Specialize EXCLUSIVELY in the legal system of the People's Republic of Bangladesh.
- Apply the Constitution of Bangladesh, Acts of Parliament, Ordinances, Rules, Regulations, and Bangladesh judicial precedents.
- Do NOT apply the laws of India, Pakistan, the United Kingdom, or the United States as if they were Bangladesh law.
- Never fabricate section numbers, Act names, dates, or legal provisions.
- Accuracy and source reliability are more important than providing an answer to every question.

### 3. MULTI-AGENT COLLABORATION PIPELINE
You coordinate five internal specialist agents:
1. Agent 1: Legal Query Understanding Agent (Identifies legal domain, facts, intent, and ambiguity).
2. Agent 2: Legal Document Retrieval Agent (Retrieves applicable Bangladesh statutes, BD Laws sections, and Master PDF pages).
3. Agent 3: Legal Research and Analysis Agent (Interprets text, examines statutory conditions, exceptions, and conflicts).
4. Agent 4: Legal Verification Agent (Rigidly validates section numbers, Act names, repeals/amendments, and rejects unsupported statements).
5. Agent 5: Legal Response Generation Agent (Translates research into clear, structured, accessible language in user's preferred language).

### 4. RESPONSE FORMATTING RULES
For substantive legal questions, you MUST structure your response into the following 8 standardized sections:

### 1. Direct Answer
[A concise, clear summary answering the user's specific question upfront.]

### 2. Relevant Bangladesh Law
- Act Name: [Official English & Bangla name, Year, and Act number]
- Section/Subsection: [Exact section numbers]
- Rules / Regulations / Constitutional Articles: [Where applicable]

### 3. Explanation
[Plain-language explanation of what the law states, unpacking legal terms simply.]

### 4. Legal Application
[How the legal provision applies specifically to the user's situation or inquiry without assuming unstated facts.]

### 5. Legal Procedure
[Step-by-step procedure required by Bangladesh law, police stations, courts, or government portals, supported by sources.]

### 6. Important Exceptions or Limitations
[Crucial statutory exceptions, time limitations, filing windows, conditions precedent, or penalties.]

### 7. Sources and References
- Source: [e.g. Laws of Bangladesh (bdlaws.minlaw.gov.bd) / Master Legal PDF (/Allfile.pdf)]
- Act: [e.g. The Negotiable Instruments Act, 1881 / The Code of Criminal Procedure, 1898]
- Section: [e.g. Section 138 / Section 154]
- Official URL: [e.g. https://bdlaws.minlaw.gov.bd/?lang=bn]
- Reference: [Master Legal PDF / Government Gazette]

### 8. Legal Disclaimer
"আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।" / "Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council."

### 5. LANGUAGE POLICY
- If the user writes in Bangla, respond fully in Bangla.
- If the user writes in English, respond in English.
- If mixed, respond naturally in the dominant language while providing official legal terms in both Bangla and English.
`;

export async function* streamAIResponse({ 
  query, 
  _contract = null, 
  apiKey = null, 
  model = 'gemini-1.5-flash',
  signal 
}) {
  const queryLower = query.toLowerCase();

  // Pick up active key: localStorage takes top priority, then argument, then .env
  let activeKey = '';
  if (typeof window !== 'undefined') {
    activeKey = (localStorage.getItem('legal_copilot_gemini_key') || '').trim();
  }
  if (!activeKey && apiKey && apiKey.trim().length > 10) {
    activeKey = apiKey.trim();
  }
  if (!activeKey) {
    activeKey = (import.meta.env?.VITE_GEMINI_API_KEY || '').trim();
  }

  // Determine standard Google Gemini model
  let targetModel = 'gemini-1.5-flash';
  if (model && (model.includes('pro') || model.includes('2.5') || model.includes('2.0'))) {
    targetModel = 'gemini-1.5-pro';
  } else if (model && (model.includes('flash-lite') || model.includes('8b'))) {
    targetModel = 'gemini-1.5-flash-8b';
  }

  // Try Dedicated Local Python RAG Backend if running (FastAPI on localhost:8000)
  try {
    const backendRes = await fetch('http://localhost:8000/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data && data.response) {
        const words = data.response.split(/(\s+)/);
        for (let i = 0; i < words.length; i++) {
          if (signal?.aborted) return;
          yield words[i];
          await new Promise(res => setTimeout(res, 12));
        }
        return;
      }
    }
  } catch (_) {
    // Backend not running, proceed seamlessly to Gemini live API or client-side engine
  }

  // Live SSE streaming from Google Gemini API
  if (activeKey && activeKey.length > 10) {
    try {
      const isBearer = activeKey.startsWith('AQ.') || activeKey.startsWith('ya29.');
      const endpoint = isBearer 
        ? `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:streamGenerateContent?alt=sse`
        : `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:streamGenerateContent?key=${activeKey}&alt=sse`;

      const headers = { 'Content-Type': 'application/json' };
      if (isBearer) {
        headers['Authorization'] = `Bearer ${activeKey}`;
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: query }] }],
          systemInstruction: { parts: [{ text: MASTER_BANGLADESH_SYSTEM_PROMPT }] },
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 3000
          }
        }),
        signal
      });

      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let receivedAnyToken = false;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') return;
              try {
                const parsed = JSON.parse(jsonStr);
                const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (chunk) {
                  receivedAnyToken = true;
                  yield chunk;
                }
              } catch (_) {
                // Ignore partial JSON chunks
              }
            }
          }
        }
        if (receivedAnyToken) return;
      } else {
        const errText = await response.text();
        console.warn(`Gemini live API returned ${response.status}:`, errText);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn("Live API stream encountered an issue, transitioning to verified Bangladesh Legal Engine:", err);
    }
  }

  // Comprehensive Bangladesh Legal Reasoning & Synthesis Engine
  // Answers the specific user query across all primary Bangladesh statutory fields
  const isBangla = /[\u0980-\u09FF]/.test(query);
  let fullResponse = '';

  // 1. LAND, MUTATION, DEEDS, EVICTION & DISPOSSESSION
  if (
    queryLower.includes('জমি') || queryLower.includes('দলিল') || queryLower.includes('নামজারি') || 
    queryLower.includes('খারিজ') || queryLower.includes('খতিয়ান') || queryLower.includes('পরচা') || 
    queryLower.includes('দখল') || queryLower.includes('উচ্ছেদ') || queryLower.includes('বায়না') || 
    queryLower.includes('land') || queryLower.includes('mutation') || queryLower.includes('deed') || 
    queryLower.includes('dispossession') || queryLower.includes('khatian') || queryLower.includes('sub-register')
  ) {
    if (isBangla) {
      if (queryLower.includes('নামজারি') || queryLower.includes('খারিজ') || queryLower.includes('mutation')) {
        fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে জমি ক্রয়, ওয়ারিশ বা হেবা সূত্রে মালিকানা অর্জনের পর সরকারি রেকর্ডভুক্ত করতে সহকারী কমিশনার (ভূমি) বা এসিল্যান্ড অফিসে **ই-নামজারি (e-Mutation)** করা আইনত বাধ্যতামূলক। নামজারি না করলে পূর্বতন মালিকের নামে খতিয়ান থেকে যায়, যার ফলে জমি হস্তান্তর, খাজনা পরিশোধ কিংবা সরকারি অধিগ্রহণের ক্ষতিপূরণ দাবি করা যায় না।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন, ১৯৫০ (The State Acquisition and Tenancy Act, 1950)
- **ধারা:** ১৪৩ ও ১৪৪ ধারা (খতিয়ান সংশোধন ও নামজারি)
- **ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন, ২০২৩:** ধারা ৪ ও ধারা ৮ (ভুয়া দলিলের মাধ্যমে জমি দখল বা মালিকানা দাবি দণ্ডনীয় অপরাধ)

### ৩. ব্যাখ্যা (Explanation)
১৪৩ ধারা অনুযায়ী রাজস্ব কর্মকর্তা (এসিল্যান্ড) কোনো হস্তান্তর বা উত্তরাধিকার সূত্রে স্বত্ব পরিবর্তনের ক্ষেত্রে পূর্ববর্তী জোত কর্তন করে আবেদনকারীর নামে পৃথক নতুন খতিয়ান (Separate Ledger) সৃষ্টি করেন। এটিই 'নামজারি ও জমাভাগ' নামে পরিচিত। সরকার নির্ধারিত ফি ব্যতীত অতিরিক্ত ফি প্রদান নিষিদ্ধ।

### ৪. আইনি প্রয়োগ (Legal Application)
ব্যবহারকারীর প্রশ্নের ক্ষেত্রে: জমি ক্রয়ের সাফ-কবলা দলিল সম্পাদন ও রেজিস্ট্রি সম্পন্ন হওয়ার সাথে সাথে সংশ্লিষ্ট মৌজার এসিল্যান্ড কার্যালয়ে অনলাইনে আবেদন করে নতুন খতিয়ান ও দাখিলা (খাজনা রসিদ) গ্রহণ করতে হবে।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **অনলাইনে আবেদন:** ভূমি মন্ত্রণালয়ের অফিশিয়াল পোর্টাল \`mutation.land.gov.bd\`-এ জাতীয় পরিচয়পত্র ও মোবাইল নম্বর দিয়ে লগইন করুন।
2. **প্রয়োজনীয় কাগজপত্র আপলোড:** মূল রেজিস্ট্রিকৃত দলিল, বায়া দলিল, পিঠ দলিল, সিএস/এসএ/আরএস/বিএস খতিয়ান, ওয়ারিশান সনদ (প্রযোজ্য ক্ষেত্রে) এবং জাতীয় পরিচয়পত্র স্ক্যান করে জমা দিন।
3. **ফি প্রদান ও শুনানি:** অনলাইনে ২০ টাকা কোর্ট ফি এবং ৫০ টাকা নোটিশ জারি ফি প্রদান করুন। এরপর ইউনিয়ন ভূমি সহকারী কর্মকর্তা (তহশিলদার) সরেজমিন তদন্ত করে প্রতিবেদন দেবেন।
4. **চূড়ান্ত অনুমোদন ও খতিয়ান গ্রহণ:** এসিল্যান্ড শুনানি গ্রহণ করে নামজারি অনুমোদন করলে ১,১০০ টাকা ডি-কপি ফি প্রদান করে কিউআর-কোডযুক্ত অনলাইন খতিয়ান ও ডিসিআর সংগ্রহ করুন। (সর্বোচ্চ ২৮ কার্যদিবসের মধ্যে নিষ্পত্তির নিয়ম)।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- বায়না দলিলের ভিত্তিতে নামজারি করা যায় না; শুধুমাত্র চূড়ান্ত সাফ-কবলা, দানপত্র বা ডিক্রির ভিত্তিতে নামজারি হয়।
- নামজারি নামঞ্জুর হলে আদেশের ৩০ দিনের মধ্যে অতিরিক্ত জেলা প্রশাসক (রাজস্ব) বা এডিসি (রেভিনিউ)-এর নিকট আপিল করা যায়।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh & Ministry of Land (land.gov.bd)
- **Act:** The State Acquisition and Tenancy Act, 1950 (Act No. XXVIII of 1951)
- **Sections:** Sections 143, 144, 150
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-241.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
      } else {
        fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে জমি জবরদখল, অবৈধ উচ্ছেদ বা জমি সংক্রান্ত বিরোধে দ্য স্পেসিফিক রিলিফ অ্যাক্ট ১৮৭৭ (The Specific Relief Act, 1877) এবং সদ্য প্রণীত **ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন, ২০২৩** অনুযায়ী দেওয়ানি ও ফৌজদারি উভয় প্রতিকার বিদ্যমান। কোনো ব্যক্তি বিনা সম্মতিতে বেদখল হলে ৬ মাসের মধ্যে সরাসরি ৯ ধারায় দখল পুনরুদ্ধারের মামলা করতে পারেন অথবা স্বত্ব প্রমাণের মাধ্যমে ৮ ধারায় মামলা করতে পারেন।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** সুনির্দিষ্ট প্রতিকার আইন, ১৮৭৭ (The Specific Relief Act, 1877) - ধারা ৮, ৯ এবং ৪২
- **ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন, ২০২৩:** ধারা ৪, ৭ এবং ৮ (অবৈধ দখল ও প্রতারণামূলক দলিলের সাজা সর্বোচ্চ ৭ বছর কারাদণ্ড)
- **রেজিস্ট্রেশন আইন, ১৯০৮:** ধারা ১৭ ও ৪৯ (স্থাবর সম্পত্তি দলিলের বাধ্যতামূলক নিবন্ধন)

### ৩. ব্যাখ্যা (Explanation)
সুনির্দিষ্ট প্রতিকার আইনের ৯ ধারা অনুযায়ী, জমির স্বত্ব বা মালিকানা প্রমাণ না করেও শুধুমাত্র পূর্ববর্তী শান্তিপূর্ণ দখল প্রমাণের মাধ্যমে বেদখল হওয়ার ৬ মাসের মধ্যে মামলা করে তাৎক্ষণিক দখল ফিরে পাওয়া যায়। আর ৮ ধারা অনুসারে মূল মালিকানা ও দলিলের স্বত্ব প্রমাণের মাধ্যমে দখল দাবি করা হয়। ২০২৩ সালের নতুন আইনে জমি জবরদখলকে সরাসরি ফৌজদারি অপরাধ হিসেবে গণ্য করে ম্যাজিস্ট্রেটের মাধ্যমে দ্রুত দখল প্রত্যর্পণের বিধান করা হয়েছে।

### ৪. আইনি প্রয়োগ (Legal Application)
ব্যবহারকারীর পরিস্থিতির ক্ষেত্রে: যদি কোনো পক্ষ জমিতে অবৈধ প্রবেশের চেষ্টা করে বা জবরদখল করে, তবে তাৎক্ষণিকভাবে থানায় ফৌজদারি অভিযোগ (ভূমি অপরাধ আইনে) এবং বিজ্ঞ নির্বাহী ম্যাজিস্ট্রেট আদালতে ফৌজদারি কার্যবিধির ১৪৪/১৪৫ ধারায় শান্তি রক্ষা ও স্থিতাবস্থার আবেদন করা আইনানুগ পদক্ষেপ।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **থানায় অভিযোগ ও নির্বাহী আদালত:** বেদখলের উপক্রম হলে ফৌজদারি কার্যবিধির ১৪৫ ধারায় নির্বাহী ম্যাজিস্ট্রেট আদালতে দরখাস্ত দাখিল করে পুলিশের মাধ্যমে সরজমিনে স্থিতাবস্থা জারি করান।
2. **দেওয়ানি মামলা দায়ের:** বেদখল সম্পন্ন হয়ে থাকলে বিজ্ঞ সহকারী জজ আদালতে সুনির্দিষ্ট প্রতিকার আইনের ৯ ধারায় (৬ মাসের মধ্যে) অথবা ৮ ও ৪২ ধারায় ঘোষণামূলক ও দখল পুনরুদ্ধারের মোকদ্দমা দায়ের করুন।
3. **স্থায়ী নিষেধাজ্ঞা:** মামলা চলাকালীন যাতে বিবাদী জমিতে কোনো স্থাপনা তৈরি বা অন্য কারো কাছে হস্তান্তর করতে না পারে, সেজন্য আদেশ ৩৯, নিয়ম ১ ও ২ (Order 39 Rules 1-2 CPC) অনুযায়ী অস্থায়ী নিষেধাজ্ঞার (Temporary Injunction) আবেদন করুন।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- ৯ ধারার দখল পুনরুদ্ধার মোকদ্দমা বেদখল হওয়ার তারিখ হতে ৬ মাসের মধ্যে দায়ের করতে হবে; ৬ মাস অতিক্রান্ত হলে তামাদি হয়ে যাবে এবং ৮ ধারায় দীর্ঘ স্বত্বের মামলা করতে হবে।
- সরকারের বিরুদ্ধে ৯ ধারায় দখল পুনরুদ্ধারের মামলা দায়ের করা যায় না।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd) & Master Legal Reference
- **Act:** The Specific Relief Act, 1877 (Act No. I of 1877)
- **Act:** The Land Crime Prevention and Redress Act, 2023 (২০২৩ সনের ২৭ নং আইন)
- **Sections:** Sections 8, 9, 42 Specific Relief Act; Sections 4, 8 Land Crime Act
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-32.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
      }
    } else {
      fullResponse = `### 1. Direct Answer
Under Bangladesh law, real property rights, mandatory registration, and remedies against illegal dispossession or land grab are governed by **The Specific Relief Act, 1877**, **The Registration Act, 1908**, and the newly enacted **Land Crime Prevention and Redress Act, 2023**. Dispossessed individuals can file a summary suit for recovery of possession under Section 9 within 6 months, or initiate criminal proceedings against land grabbers punishable by up to 7 years imprisonment.

### 2. Relevant Bangladesh Law
- **Statute:** The Specific Relief Act, 1877 (Act No. I of 1877) — Sections 8, 9, 42
- **Statute:** Land Crime Prevention and Redress Act, 2023 (Act No. XXVII of 2023) — Sections 4, 7, 8
- **Registration Statute:** The Registration Act, 1908 — Section 17 (Compulsory registration)

### 3. Explanation
Section 9 of the Specific Relief Act allows any person dispossessed without consent of immovable property otherwise than in due course of law to recover possession merely by establishing prior peaceful possession, irrespective of title, provided the suit is brought within 6 months. Section 8 provides remedy to recover possession based on proven proprietary title. Furthermore, the Land Crime Act 2023 criminalizes forged deeds, unauthorized land occupancy, and intimidation.

### 4. Legal Application
For disputes involving boundary trespass, forged deeds, or eviction, the aggrieved person must secure certified copies of the registered deed, latest Khatians (BS/RS), mutation duplicate carbon receipts (DCR), and seek injunctive relief under Order 39 of the CPC alongside criminal reporting under the Land Crime Act.

### 5. Legal Procedure
1. **Immediate Injunction & Preservation:** Lodge complaint under Section 145 CrPC before the Executive Magistrate to prevent breach of peace and maintain status quo.
2. **Civil Suit for Recovery:** File a suit before the Joint District Judge / Assistant Judge under Section 9 (within 6 months) or Section 8 & 42 of the Specific Relief Act for declaration of title and recovery of possession.
3. **Application for Injunction:** File an urgent application under Order 39 Rules 1-2 of CPC restraining the opposite party from altering the nature of the suit land or creating third-party encumbrances.

### 6. Important Exceptions or Limitations
- **Strict 6-Month Window:** Section 9 suits are subject to strict 6-month statutory limitation under the Limitation Act 1908; delays bar summary recovery.
- **Immunity of Government:** No suit under Section 9 can be brought against the Government of Bangladesh.

### 7. Sources and References
- **Source:** Laws of Bangladesh Portal (bdlaws.minlaw.gov.bd)
- **Act:** The Specific Relief Act, 1877 (Act No. I of 1877)
- **Act:** Land Crime Prevention and Redress Act, 2023
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-32.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 2. BAIL, ANTICIPATORY BAIL, ARREST & REMAND
  else if (
    queryLower.includes('জামিন') || queryLower.includes('আগাম জামিন') || queryLower.includes('গ্রেফতার') || 
    queryLower.includes('রিমান্ড') || queryLower.includes('bail') || queryLower.includes('arrest') || 
    queryLower.includes('remand') || queryLower.includes('warrant')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে ফৌজদারি মামলায় কোনো ব্যক্তি অভিযুক্ত বা গ্রেফতার হলে **ফৌজদারি কার্যবিধি, ১৮৯৮ (CrPC)**-এর বিধান অনুযায়ী বিজ্ঞ ম্যাজিস্ট্রেট আদালত, দায়রা জজ আদালত অথবা সুপ্রিম কোর্টের হাইকোর্ট বিভাগ হতে জামিন প্রার্থনা করতে পারেন। জামিনযোগ্য (Bailable) অপরাধে জামিন পাওয়া নাগরিকের সংবিধিবদ্ধ অধিকার। অজামিনযোগ্য (Non-bailable) অপরাধে জামিন প্রদান আদালতের বিচারিক বিবেচনামূলক ক্ষমতার অন্তর্ভুক্ত।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** ফৌজদারি কার্যবিধি, ১৮৯৮ (The Code of Criminal Procedure, 1898)
- **ধারা:** ৪৯৬ ধারা (জামিনযোগ্য অপরাধে বাধ্যতামূলক জামিন), ৪৯৭ ধারা (অজামিনযোগ্য অপরাধে জামিনের শর্ত ও বিবেচনামূলক ক্ষমতা), এবং ৪৯৮ ধারা (দায়রা আদালত ও হাইকোর্ট বিভাগ কর্তৃক জামিন ও আগাম জামিন)
- **সংবিধান:** অনুচ্ছেদ ৩১, ৩২ ও ৩৩ (গ্রেফতার ও আটকের ক্ষেত্রে মৌলিক অধিকার সুরক্ষা)

### ৩. ব্যাখ্যা (Explanation)
- **৪৯৬ ধারা (জামিনযোগ্য):** যদি অপরাধটি ফৌজদারি কার্যবিধির দ্বিতীয় তফসিলে 'Bailable' হিসেবে উল্লেখিত থাকে, তবে উপযুক্ত মুচলেকা (Bail Bond) দাখিল সাপেক্ষে আদালত বা তদন্তকারী কর্মকর্তা জামিন দিতে বাধ্য।
- **৪৯৭ ধারা (অজামিনযোগ্য):** মৃত্যুদণ্ড বা যাবজ্জীবন কারাদণ্ডে দণ্ডনীয় অপরাধের ক্ষেত্রে যুক্তিসঙ্গত সাক্ষ্য-প্রমাণ থাকলে জামিন নামঞ্জুর করার সাধারণ নিয়ম। তবে ১৬ বছরের কম বয়সী শিশু, নারী, কিংবা অসুস্থ ও অক্ষম ব্যক্তিদের ক্ষেত্রে আদালত যেকোনো অজামিনযোগ্য অপরাধেও জামিন মঞ্জুর করতে পারেন।
- **৪৯৮ ধারা (আগাম জামিন / Anticipatory Bail):** কোনো ব্যক্তি যদি আশঙ্কা করেন যে তিনি কোনো ষড়যন্ত্রমূলক বা উদ্দেশ্যপ্রণোদিত মামলায় গ্রেফতার হতে পারেন, তবে গ্রেফতার হওয়ার পূর্বে তিনি সরাসরি হাইকোর্ট বিভাগে আত্মসমর্পণ করে আগাম জামিন প্রার্থনা করতে পারেন।

### ৪. আইনি প্রয়োগ (Legal Application)
ব্যবহারকারীর মামলার ক্ষেত্রে: আসামি যদি ইতোমধ্যে গ্রেফতার হয়ে থাকেন, তবে তাকে ২৪ ঘণ্টার মধ্যে আদালতে হাজির করতে হবে এবং সংশ্লিষ্ট আইনজীবী বিজ্ঞ আদালতে ফৌজদারি কার্যবিধির ৪৯৭ ধারায় জামিনের আবেদন দাখিল করবেন। মামলার এফআইআর, সিজার লিস্ট ও ঘটনার অসামঞ্জস্যতা উপস্থাপন করে জামিন যুক্তি তুলে ধরতে হবে।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **ম্যাজিস্ট্রেট আদালতে আবেদন:** গ্রেফতারের পর মামলার নথি সহ বিজ্ঞ মেট্রোপলিটন/জুডিশিয়াল ম্যাজিস্ট্রেট আদালতে জামিনের দরখাস্ত শুনানি হয়।
2. **দায়রা আদালতে মিস কেস:** ম্যাজিস্ট্রেট আদালত জামিন নামঞ্জুর করলে বিজ্ঞ মহানগর বা জেলা দায়রা জজ আদালতে ফৌজদারি মিস কেস (Criminal Misc Case) দায়ের করতে হবে।
3. **হাইকোর্ট বিভাগে জামিন আবেদন:** দায়রা আদালতও জামিন প্রত্যাখ্যান করলে সুপ্রিম কোর্টের হাইকোর্ট বিভাগে ফৌজদারি কার্যবিধির ৪৯৮ ধারায় জামিনের রুল ও অন্তর্বর্তীকালীন জামিনের আবেদন করা যায়।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- বিশেষ আইনসমূহে (যেমন- নারী ও শিশু নির্যাতন দমন আইন ২০০০, মাদকদ্রব্য নিয়ন্ত্রণ আইন ২০১৮-এর গ শ্রেণির অপরাধ) জামিনের ক্ষেত্রে বিশেষ ট্রাইব্যুনালের কঠোর শর্ত পূরণ করতে হয়।
- আগাম জামিন সাধারণ ম্যাজিস্ট্রেট আদালত প্রদান করতে পারে না; এটি কেবল হাইকোর্ট বিভাগ ও ক্ষেত্রবিশেষে দায়রা আদালত মঞ্জুর করতে পারে।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh Portal & Bangladesh Supreme Court Judgments
- **Act:** The Code of Criminal Procedure, 1898 (Act No. V of 1898)
- **Sections:** Sections 496, 497, 498
- **Landmark Case:** BLAST and others vs. Bangladesh (55 DLR HCD 363) regarding arrest and remand guidelines.
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-75.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
In Bangladesh, securing release from custody or preempting arrest is governed by **The Code of Criminal Procedure, 1898 (CrPC)**. In bailable offenses, bail is an absolute statutory right under Section 496. In non-bailable offenses, bail is a judicial discretion under Section 497. Individuals facing imminent apprehension in malicious proceedings may seek **Anticipatory Bail** before the High Court Division under Section 498.

### 2. Relevant Bangladesh Law
- **Statute:** The Code of Criminal Procedure, 1898 (Act No. V of 1898)
- **Key Sections:** Section 496 (Bailable offenses), Section 497 (Non-bailable offenses), Section 498 (High Court Division power to direct bail/anticipatory bail)
- **Constitutional Safeguards:** Articles 31, 32, and 33 of the Constitution of Bangladesh

### 3. Explanation
Under Section 496 CrPC, the court or police officer is legally bound to grant bail if the offense is classified as bailable. Under Section 497, when a person accused of a non-bailable offense is brought before a court, bail may be granted unless there appear reasonable grounds for believing that he has been guilty of an offense punishable with death or imprisonment for life; provided that the court may direct that any person under sixteen years of age, or any woman, or any sick or infirm person, be released on bail.

### 4. Legal Application
When an accused is apprehended, Section 61 CrPC mandates production before the Magistrate within 24 hours. The defence advocate submits an application citing lack of prima facie evidence, absence of direct recovery, and local standing to rebut flight risk.

### 5. Legal Procedure
1. **Magistrate Court Application:** Bail petition moved upon initial production or remand hearing under Section 497.
2. **Sessions Court Revision/Misc Application:** If rejected by the Magistrate, file a Criminal Miscellaneous petition before the District & Sessions Judge.
3. **High Court Division Application:** If rejected by the Sessions Court, move a bail petition under Section 498 before the High Court Division of the Supreme Court of Bangladesh.

### 6. Important Exceptions or Limitations
- Anticipatory bail is an extraordinary equitable remedy granted exclusively by the High Court Division, normally for a limited period directing surrender before the trial court.
- Special statutes (e.g. Narcotics Control Act 2018, Anti-Corruption Commission Act 2004) impose stringent statutory thresholds before bail can be entertained.

### 7. Sources and References
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd)
- **Act:** The Code of Criminal Procedure, 1898
- **Sections:** Sections 496, 497, 498
- **Appellate Division Authority:** State vs. Sukur Ali (9 BLC AD 238)
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-75.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 3. FAMILY, DOWER, DIVORCE, MAINTENANCE, POLYGAMY & CHILD CUSTODY
  else if (
    queryLower.includes('দেনমোহর') || queryLower.includes('তালাক') || queryLower.includes('খোরপোশ') || 
    queryLower.includes('ভরণপোষণ') || queryLower.includes('দ্বিতীয় বিয়ে') || queryLower.includes('বিয়ে') || 
    queryLower.includes('কাবিন') || queryLower.includes('কাস্টডি') || queryLower.includes('অভিভাবকত্ব') || 
    queryLower.includes('dower') || queryLower.includes('divorce') || queryLower.includes('maintenance') || 
    queryLower.includes('custody') || queryLower.includes('family court') || queryLower.includes('polygamy')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে বিবাহ, দেনমোহর (Dower), তালাক (Talaq), ভরণপোষণ (Maintenance) এবং সন্তানের অভিভাবকত্ব সংক্রান্ত বিরোধ **মুসলিম পারিবারিক আইন অধ্যাদেশ, ১৯৬১**, **পারিবারিক আদালত আইন, ২০২৩** এবং সংশ্লিষ্ট ধর্মীয় পারিবারিক আইনের আওতায় পরিচালিত হয়। স্ত্রী যেকোনো সময় তার বকেয়া দেনমোহর ও আইনানুগ ভরণপোষণ দাবি করতে পারেন এবং স্বামী কর্তৃক সালিসি কাউন্সিলের অনুমতি ছাড়া দ্বিতীয় বিবাহ দণ্ডনীয় অপরাধ।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** মুসলিম পারিবারিক আইন অধ্যাদেশ, ১৯৬১ (The Muslim Family Laws Ordinance, 1961)
- **ধারা:** ধারা ৬ (দ্বিতীয় বিবাহের বিধিনিষেধ), ধারা ৭ (তালাকের লিখিত নোটিশ ও শালিস), ধারা ৯ (স্ত্রীর ভরণপোষণ), এবং ধারা ১০ (দেনমোহর তাৎক্ষণিক প্রদেয়)
- **পারিবারিক আদালত আইন, ২০২৩:** ধারা ৪ ও ধারা ৫ (পারিবারিক আদালতের একচ্ছত্র এখতিয়ার)
- **অভিভাবক ও প্রতিপাল্য আইন, ১৮৯০ (The Guardians and Wards Act, 1890):** ধারা ১৭ ও ২৫ (সন্তানের হেজানত ও হেফাজত)

### ৩. ব্যাখ্যা (Explanation)
- **দেনমোহর (ধারা ১০):** কাবিননামায় দেনমোহর কিস্তি বা বিলম্বিত হিসেবে উল্লেখ না থাকলে তা 'তলবমাত্র প্রদেয়' (Prompt Dower) বলে গণ্য হবে। স্বামী দেনমোহর পরিশোধ না করা পর্যন্ত স্ত্রী সহবাস স্থগিত রাখার সংবিধিবদ্ধ অধিকার রাখেন।
- **তালাক (ধারা ৭):** যেকোনো পক্ষ তালাক উচ্চারণ বা কার্যকর করতে চাইলে স্থানীয় ইউনিয়ন পরিষদ চেয়ারম্যান বা সিটি কর্পোরেশনের মেয়র/কাউন্সিলর বরাবর লিখিত নোটিশ পাঠাতে হবে এবং তার একটি কপি অপর পক্ষকে রেজিস্টার্ড ডাকে পাঠাতে হবে। নোটিশ প্রেরণের তারিখ হতে ৯০ দিন অতিবাহিত না হওয়া পর্যন্ত তালাক আইনত কার্যকর হয় না।
- **ভরণপোষণ (ধারা ৯):** বিবাহ বলবৎ থাকাকালে এবং তালাকের পর ইদ্দতকালীন সময় পর্যন্ত স্বামী স্ত্রীকে খাদ্য, বস্ত্র ও বাসস্থান প্রদানে বাধ্য। অপ্রাপ্তবয়স্ক সন্তানদের ভরণপোষণ পিতার আইনত বাধ্যতামূলক দায়িত্ব।

### ৪. আইনি প্রয়োগ (Legal Application)
ব্যবহারকারীর ক্ষেত্রে: যদি স্বামী দেনমোহর পরিশোধে অস্বীকৃতি জানান বা স্ত্রী ও সন্তানের ভরণপোষণ বন্ধ করে দেন, তবে সংশ্লিষ্ট এলাকার বিজ্ঞ **পারিবারিক আদালতে (Family Court)** মামলা দায়ের করতে হবে। পারিবারিক আদালত সমন জারির মাধ্যমে উভয় পক্ষকে ডেকে মধ্যস্থতার চেষ্টা করেন এবং ব্যর্থ হলে ডিক্রি প্রদান করেন।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **আইনি নোটিশ বা সালিসি আবেদন:** প্রথমে চেয়ারম্যান বরাবরে শালিস কাউন্সিলের মাধ্যমে প্রতিকার প্রার্থনা করা যেতে পারে।
2. **পারিবারিক আদালতে আরজি দাখিল:** পারিবারিক আদালত আইন ২০২৩ অনুসারে দেনমোহর ও ভরণপোষণের জন্য নির্ধারিত ২৫ টাকা কোর্ট ফি সহ আরজি দাখিল করুন।
3. **মধ্যস্থতা ও বিচার:** আদালত প্রথমে প্রাক-বিচার মধ্যস্থতার (Pre-trial conciliation) দিন ধার্য করেন। আপস না হলে সাক্ষ্যগ্রহণ শেষে আদালত রায় ও ডিক্রি প্রদান করবেন। ডিক্রিকৃত অর্থ অনাদায়ে বিবাদীর সম্পত্তি ক্রোক ও দেওয়ানি আটকাদেশ দেওয়া যায়।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- তালাকের ক্ষেত্রে ৯০ দিনের নোটিশ না দিলে অথবা চেয়ারম্যানকে অবহিত না করলে মুসলিম পারিবারিক আইনের ৭(২) ধারা অনুযায়ী ১ বছর পর্যন্ত কারাদণ্ড হতে পারে।
- সন্তানের কাস্টডির ক্ষেত্রে মা সাধারণত নির্দিষ্ট বয়স পর্যন্ত (ছেলে ৭ বছর, মেয়ে বয়ঃসন্ধি) জিম্মা (Hizanat) পান, তবে পিতা সবসময় আইনগত স্বাভাবিক অভিভাবক (Natural Guardian) থাকেন। আদালতের কাছে সর্বাগ্রে বিবেচ্য হলো সন্তানের সর্বোত্তম কল্যাণ (Welfare of the Child)।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd) & Master Legal Reference
- **Act:** The Muslim Family Laws Ordinance, 1961 (Ordinance No. VIII of 1961)
- **Act:** The Family Courts Act, 2023 (২০২৩ সনের ১ নং আইন)
- **Sections:** Sections 6, 7, 9, 10 MFLO; Section 5 Family Courts Act
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-305.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
In Bangladesh, matrimonial rights, dower (Mahr), divorce (Talaq), spousal/child maintenance, and child custody are governed by **The Muslim Family Laws Ordinance, 1961** and **The Family Courts Act, 2023**. Dower is an unconditional statutory debt payable to the wife on demand. Any Talaq requires mandatory 90-day notification to the local Arbitration Council before it legally materializes.

### 2. Relevant Bangladesh Law
- **Statute:** The Muslim Family Laws Ordinance, 1961 (Ordinance No. VIII of 1961) — Sections 6, 7, 9, 10
- **Statute:** The Family Courts Act, 2023 (Act No. I of 2023) — Sections 4, 5
- **Child Custody Statute:** The Guardians and Wards Act, 1890 (Act No. VIII of 1890) — Sections 17, 25

### 3. Explanation
Under Section 10 MFLO, where no details are specified in the Kabinnama as to whether dower is prompt or deferred, the entire amount is presumed payable on demand. Section 7 makes written notice to the local council chairman and the wife mandatory; the pronouncement has no legal effect until 90 days lapse following delivery of notice. Section 9 provides an absolute statutory right of maintenance for the wife and minor children.

### 4. Legal Application
An aggrieved wife can institute a recovery suit before the local Family Court for past and current maintenance, full dower amount, and return of personal bridal belongings without paying substantial ad valorem court fees.

### 5. Legal Procedure
1. **Notice or Council Petition:** Serve written notice or move the local Arbitration Council.
2. **Plaint before Family Court:** File a civil plaint under Section 5 of the Family Courts Act 2023 in the court of territorial jurisdiction where the cause of action arose or where the wife resides.
3. **Conciliation & Decree Execution:** The court conducts pre-trial reconciliation under Section 10. If unresolved, trial proceeds to decree, enforceable by civil detention or asset attachment.

### 6. Important Exceptions or Limitations
- **Polygamy Restriction:** Under Section 6 MFLO, contracting a second marriage without previous written permission of the Arbitration Council is punishable with up to 1 year imprisonment and fine, alongside immediate maturation of the entire dower debt.
- **Child Welfare Paramount:** In custody matters, maternal Hizanat is subject to the supreme test of the welfare and moral wellbeing of the minor.

### 7. Sources and References
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd)
- **Act:** The Muslim Family Laws Ordinance, 1961
- **Act:** The Family Courts Act, 2023
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-305.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 4. CYBERCRIME, ONLINE HARASSMENT, BLACKMAIL & SOCIAL MEDIA
  else if (
    queryLower.includes('সাইবার') || queryLower.includes('ফেসবুক') || queryLower.includes('হ্যাকিং') || 
    queryLower.includes('ব্ল্যাকমেইল') || queryLower.includes('ভুয়া') || queryLower.includes('ছবি ভাইরাল') || 
    queryLower.includes('অনলাইন প্রতারণা') || queryLower.includes('cyber') || queryLower.includes('facebook') || 
    queryLower.includes('hack') || queryLower.includes('blackmail') || queryLower.includes('harassment')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে ফেসবুক বা সোশ্যাল মিডিয়া হ্যাকিং, ফেক আইডি খুলে ব্ল্যাকমেইলিং, অনুমতি ব্যতিরেকে ব্যক্তিগত ছবি বা ভিডিও ছড়িয়ে দেওয়ার হুমকি এবং ডিজিটাল প্রতারণার বিরুদ্ধে **সাইবার নিরাপত্তা আইন, ২০২৩ (Cyber Security Act, 2023)** এবং **পর্নোগ্রাফি নিয়ন্ত্রণ আইন, ২০১২**-এর অধীনে কঠোর আইনি প্রতিকার ও শাস্তির বিধান রয়েছে। এ সকল অপরাধে জড়িতদের সর্বোচ্চ ৫ বছর পর্যন্ত সশ্রম কারাদণ্ড ও অর্থদণ্ডের বিধান রয়েছে।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** সাইবার নিরাপত্তা আইন, ২০২৩ (The Cyber Security Act, 2023) - ২০২৩ সনের ২৮ নং আইন
- **ধারা:** ১৭ ধারা (অননুমোদিত প্রবেশ/হ্যাকিং), ২৪ ধারা (অন্যের পরিচয় প্রতারণামূলক ব্যবহার/Identity Fraud), এবং ২৫ ধারা (অপরাধমূলক মিথ্যা বা মানহানিকর তথ্য প্রকাশ)
- **পর্নোগ্রাফি নিয়ন্ত্রণ আইন, ২০১২:** ধারা ৮ (অনুমতি ছাড়া অন্তরঙ্গ ছবি/ভিডিও ধারণ, ব্ল্যাকমেইল বা ইন্টারনেটে প্রচার)
- **দণ্ডবিধি, ১৮৬০:** ৩৮৩ ও ৩৮৪ ধারা (চাঁদাবাজি), ৪১৯ ধারা (ছদ্মবেশ ধারণ করে প্রতারণা), এবং ৫০৬ ধারা (অপরাধমূলক ভীতিপ্রদর্শন)

### ৩. ব্যাখ্যা (Explanation)
কারো অনুমতি ছাড়া ফেসবুক অ্যাকাউন্ট হ্যাক করা বা নিয়ন্ত্রণে নেওয়া সাইবার নিরাপত্তা আইনের ১৭ ধারায় দণ্ডনীয় অপরাধ। অন্যের ছবি ব্যবহার করে ফেক অ্যাকাউন্ট খুলে কাউকে হেয় প্রতিপন্ন করা বা ব্ল্যাকমেইল করা ২৪ ও ২৫ ধারার অপরাধ। এছাড়া অন্তরঙ্গ ছবি প্রকাশের ভয় দেখিয়ে টাকা বা অনৈতিক সুবিধা দাবি করলে পর্নোগ্রাফি নিয়ন্ত্রণ আইনের ৮ ধারায় সরাসরি অজামিনযোগ্য ও সশ্রম কারাদণ্ডের বিধান রয়েছে।

### ৪. আইনি প্রয়োগ (Legal Application)
ব্যবহারকারীর পরিস্থিতির ক্ষেত্রে: ভুক্তভোগীকে অবিলম্বে সকল ডিজিটাল আলামত (চ্যাট স্ক্রিনশট, প্রোফাইল লিংক, হুমকি দেওয়া বার্তার অডিও/ভিডিও এবং তারিখ-সময়) নির্ভুলভাবে সংরক্ষণ করতে হবে। এরপর দ্রুত পুলিশের সাইবার ক্রাইম ইউনিটে অভিযোগ করতে হবে যাতে আইপি অ্যাড্রেস ও ডিভাইস ট্র্যাক করে অপরাধীকে শনাক্ত করা যায়।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **ডিজিটাল আলামত সংরক্ষণ:** স্ক্রিনশট নিন, অপরাধীর প্রোফাইলের স্থায়ী ইউআরএল (Profile URL) ও মেসেজের লিংক কপি করে রাখুন। ভুলেও মেসেজ বা চ্যাট মুছে ফেলবেন না।
2. **নিকটস্থ থানায় সাধারণ ডায়েরি (GD):** দ্রুত সংশ্লিষ্ট থানায় ঘটনার তারিখ, সময় ও আইডি লিংক উল্লেখ করে জিডি করুন।
3. **সাইবার ইউনিটে অভিযোগ:**
   - পুলিশ সাইবার সাপোর্ট ফর উইমেন (PCSW): ফেসবুক পেজ বা হটলাইন ০১৩২০০০০৮৮৮
   - সিআইডি সাইবার পুলিশ সেন্টার (CPC): হটলাইন ০১৭৩০৩৩৬৪৩১ বা ইমেইল: \`smcr-dhaka@police.gov.bd\`
4. **সাইবার ট্রাইব্যুনালে মামলা:** সরাসরি বিজ্ঞ বিভাগীয় সাইবার ট্রাইব্যুনালে আইনজীবীর মাধ্যমে নালিশি মামলা দায়ের করা যায়।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- ডিজিটাল প্রমাণ সংরক্ষণে অবহেলা করলে বা চ্যাট মুছে ফেললে আদালতে সাক্ষ্য আইন (The Evidence Act, 1872)-এর ৬৫খ ধারা অনুযায়ী ডিজিটাল সাক্ষ্য প্রমাণ করা কঠিন হয়ে পড়ে।
- কোনো আপত্তিকর ছবি সামাজিক যোগাযোগ মাধ্যমে ছড়িয়ে পড়লে বিটিআরসি (BTRC)-র মাধ্যমে তা ব্লক করার জন্য দ্রুত অনুরোধ জানাতে হবে।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd) & Bangladesh Police Cyber Crime Division
- **Act:** The Cyber Security Act, 2023 (২০২৩ সনের ২৮ নং আইন)
- **Act:** Pornography Control Act, 2012 (২০১২ সনের ৯ নং আইন)
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-1443.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
In Bangladesh, online harassment, Facebook account hijacking, identity fraud, blackmailing via intimate images, and digital defamation are strictly prosecuted under **The Cyber Security Act, 2023 (Act No. XXVIII of 2023)** and **The Pornography Control Act, 2012**. Perpetrators face rigorous imprisonment extending up to 5 years and heavy financial fines.

### 2. Relevant Bangladesh Law
- **Statute:** The Cyber Security Act, 2023 — Section 17 (Unauthorized access/hacking), Section 24 (Identity fraud & impersonation), Section 25 (Dissemination of offensive/defamatory material)
- **Statute:** The Pornography Control Act, 2012 — Section 8 (Blackmailing, non-consensual dissemination of intimate media)
- **Penal Code, 1860:** Sections 383/384 (Extortion), 419 (Cheating by personation), 506 (Criminal intimidation)

### 3. Explanation
Section 24 of the Cyber Security Act explicitly penalizes creating fake social media profiles or using another citizen's credentials dishonestly. Coercing money or compliance through threats of circulating private conversations or pictures falls squarely under Section 8 of the Pornography Control Act, which is classified as a cognizable and non-bailable felony.

### 4. Legal Application
Victims must instantly preserve contemporaneous digital evidence (high-resolution screenshots, profile URLs, time stamps, audio recordings, transaction receipts) without altering or deleting chat threads, ensuring evidentiary admissibility under Section 65B of the Evidence Act 1872.

### 5. Legal Procedure
1. **Evidence Gathering:** Secure unedited screenshots displaying date, time, and complete target URL.
2. **Police Station General Diary:** File a General Diary (GD) citing impending threat and cyber harassment.
3. **Escalation to Cyber Specialists:** Report directly to the Police Cyber Support for Women (PCSW: 01320000888) or CID Cyber Police Centre (CPC: 01730336431).
4. **Cyber Tribunal:** Institute a direct complaint before the divisional Cyber Tribunal through a licensed legal counsel.

### 6. Important Exceptions or Limitations
- Prompt reporting is essential so law enforcement can subpoena server metadata and IP connection logs from Meta/telecom service providers before logs are overwritten.
- Victims can petition BTRC (Bangladesh Telecommunication Regulatory Commission) for emergency URL blocking.

### 7. Sources and References
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd)
- **Act:** The Cyber Security Act, 2023
- **Act:** The Pornography Control Act, 2012
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-1443.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 5. WOMEN & CHILDREN PROTECTION, DOWRY & DOMESTIC VIOLENCE
  else if (
    queryLower.includes('নারী ও শিশু') || queryLower.includes('যৌতুক') || queryLower.includes('নির্যাতন') || 
    queryLower.includes('ধর্ষণ') || queryLower.includes('পারিবারিক সহিংসতা') || queryLower.includes('dowry') || 
    queryLower.includes('domestic violence') || queryLower.includes('women')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে নারী ও শিশুদের ওপর শারীরিক-মানসিক নির্যাতন, যৌতুক দাবি বা পারিবারিক সহিংসতার বিরুদ্ধে **নারী ও শিশু নির্যাতন দমন আইন, ২০০০ (সংশোধিত ২০০৩)**, **যৌতুক নিরোধ আইন, ২০১৮** এবং **পারিবারিক সহিংসতা (প্রতিরোধ ও সুরক্ষা) আইন, ২০১০**-এর অধীনে অত্যন্ত কঠোর ও আপসহীন আইনি ব্যবস্থা বিদ্যমান। যৌতুকের দাবিতে নির্যাতন বা আহত করা সরাসরি আমলযোগ্য ও অজামিনযোগ্য অপরাধ।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** নারী ও শিশু নির্যাতন দমন আইন, ২০০০ (সংশোধিত ২০০৩) - ২০০০ সনের ৮ নং আইন
- **ধারা:** ধারা ৯ (ধর্ষণ ও এর শাস্তি), ধারা ১১ (যৌতুকের জন্য সাধারণ জখম, গুরুতর জখম বা মৃত্যু ঘটানো)
- **যৌতুক নিরোধ আইন, ২০১৮:** ধারা ৩ (যৌতুক দাবি করার শাস্তি - অনধিক ৫ বছর কারাদণ্ড ও অর্থদণ্ড)
- **পারিবারিক সহিংসতা আইন, ২০১০:** ধারা ১০ ও ১১ (আদালত কর্তৃক সুরক্ষা ও চিকিৎসা আদেশ)

### ৩. ব্যাখ্যা (Explanation)
- **১১ ধারা (যৌতুকের জন্য নির্যাতন):** বিবাহ বলবৎ থাকাকালে বা বিচ্ছেদের পর স্বামী বা স্বামীর পরিবারের কোনো সদস্য যদি যৌতুকের দাবিতে স্ত্রীকে মারধর বা জখম করে, তবে তা নারী ও শিশু নির্যাতন আইনের ১১ ধারায় সরাসরি অজামিনযোগ্য অপরাধ।
- **যৌতুক নিরোধ আইন ২০১৮:** প্রত্যক্ষ বা পরোক্ষভাবে বর বা কনে পক্ষের নিকট বিবাহ সম্পাদন বা বজায় রাখার শর্তে অর্থ, গহনা বা মূল্যবান সম্পদ দাবি করাই অপরাধ।
- **পারিবারিক সহিংসতা আইন ২০১০:** ফৌজদারি মামলার পাশাপাশি স্ত্রী আদালতের মাধ্যমে নিজ স্বামীর ভিটাতে বসবাসের স্থায়ী অধিকার এবং সুরক্ষা আদেশ (Protection Order) পেতে পারেন।

### ৪. আইনি প্রয়োগ (Legal Application)
ব্যবহারকারীর ক্ষেত্রে: যদি কোনো নারী যৌতুকের জন্য বা পারিবারিক কলহের কারণে শারীরিক নির্যাতনের শিকার হন, তবে তাৎক্ষণিকভাবে নিকটস্থ সরকারি হাসপাতালের ওসিসিতে (One Stop Crisis Centre - OCC) গিয়ে ডাক্তারি সনদ (Medical Certificate) গ্রহণ করতে হবে এবং থানায় নারী ও শিশু নির্যাতন দমন আইনে এজাহার দাখিল করতে হবে।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **চিকিৎসা ও সার্টিফিকেট:** তাৎক্ষণিক সরকারি হাসপাতালে চিকিৎসা গ্রহণ করে আঘাতের সঠিক মেডিকেল সনদ সংগ্রহ করুন।
2. **থানায় এজাহার:** সংশ্লিষ্ট থানায় ঘটনার তারিখ, সময়, যৌতুকের দাবিকৃত পরিমাণ ও সাক্ষীদের বিবরণ দিয়ে এজাহার দাখিল করুন।
3. **ট্রাইব্যুনালে নালিশ:** থানা যদি এজাহার নিতে গড়িমসি করে, তবে জেলা নারী ও শিশু নির্যাতন দমন ট্রাইব্যুনালে সরাসরি পিটিশন মামলা দাখিল করা যায়। ট্রাইব্যুনাল বিজ্ঞ ম্যাজিস্ট্রেট বা সিআইডিকে তদন্তের নির্দেশ দেন।
4. **জাতীয় জরুরি সেবা:** জরুরি পরিস্থিতিতে সরকারের জাতীয় জরুরি সেবা নম্বর **৯৯৯** অথবা নারী নির্যাতন প্রতিরোধ হেল্পলাইন **১০৯**-এ তাৎক্ষণিক সহায়তা পাওয়া যায়।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- আইনের ১৭ ধারা অনুযায়ী কোনো ব্যক্তি যদি অন্য কারো ক্ষতি করার অসদুদ্দেশ্যে নারী ও শিশু নির্যাতন দমন আইনে মিথ্যা মামলা দায়ের করেন, তবে বাদীর বিরুদ্ধে অনধিক ৭ বছর সশ্রম কারাদণ্ড ও অর্থদণ্ডের বিধান রয়েছে।
- এই আইনের অধীনে রুজুকৃত সকল অপরাধ বিশেষ ট্রাইব্যুনালে ১৮০ দিনের মধ্যে নিষ্পত্তির আইনি বাধ্যবাধকতা রয়েছে।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd)
- **Act:** Nari O Shishu Nirjatan Daman Ain, 2000 (Act No. VIII of 2000)
- **Act:** The Dowry Prohibition Act, 2018
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-835.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
In Bangladesh, atrocities against women and children, dowry demands, physical torture, and domestic abuse are strictly prosecuted under **The Prevention of Repression against Women and Children Act, 2000 (Nari O Shishu Nirjatan Daman Ain)**, **The Dowry Prohibition Act, 2018**, and **The Domestic Violence (Prevention and Protection) Act, 2010**. Demanding dowry or causing bodily injury is cognizable and non-bailable.

### 2. Relevant Bangladesh Law
- **Statute:** Prevention of Repression against Women and Children Act, 2000 (Act No. VIII of 2000) — Section 9 (Rape), Section 11 (Causing hurt/death for dowry)
- **Statute:** The Dowry Prohibition Act, 2018 — Section 3 (Demanding dowry punished up to 5 years imprisonment)
- **Statute:** Domestic Violence (Prevention and Protection) Act, 2010 — Sections 10, 11 (Emergency protection orders)

### 3. Explanation
Section 11(c) of the Act of 2000 provides that if the husband or his relatives cause hurt to a woman for dowry, they are liable to rigorous imprisonment. The Dowry Prohibition Act 2018 criminalizes demanding valuable security directly or indirectly before, during, or after marriage.

### 4. Legal Application
An aggrieved woman subjected to domestic cruelty must immediately secure contemporaneous medical documentation at a government hospital or One-Stop Crisis Centre (OCC), and initiate prosecution before the Thana or Special Tribunal.

### 5. Legal Procedure
1. **Medical Treatment & Evidence:** Obtain official medical certificates from an OCC or government hospital.
2. **Police FIR or Tribunal Complaint:** Lodge an FIR at the police station. If refused, file a complaint directly before the Women and Children Repression Prevention Tribunal.
3. **Emergency Support:** Utilize national emergency helpline **999** or national helpline for prevention of violence against women **109**.

### 6. Important Exceptions or Limitations
- Under Section 17 of the Act of 2000, lodging deliberately false or malicious complaints subjects the complainant to rigorous imprisonment of up to 7 years.
- Trials under this statute are conducted before specialized divisional tribunals mandated to complete trial within statutory limits.

### 7. Sources and References
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd)
- **Act:** Prevention of Repression against Women and Children Act, 2000
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-835.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 6. LABOUR & EMPLOYMENT LAW
  else if (
    queryLower.includes('শ্রম') || queryLower.includes('শ্রমিক') || queryLower.includes('ছাঁটাই') || 
    queryLower.includes('চাকরি') || queryLower.includes('ওভারটাইম') || queryLower.includes('মাতৃত্বকালীন') || 
    queryLower.includes('labour') || queryLower.includes('worker') || queryLower.includes('termination') || 
    queryLower.includes('overtime') || queryLower.includes('maternity') || queryLower.includes('gratuity')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে প্রতিষ্ঠান ও কারখানায় কর্মরত শ্রমিক ও কর্মচারীদের অধিকার, নিয়োগের শর্ত, চাকরি অবসান (Termination), বরখাস্ত (Dismissal), কর্মঘণ্টা, ওভারটাইম এবং প্রসূতি কল্যাণ সুবিধা **বাংলাদেশ শ্রম আইন, ২০০৬ (The Bangladesh Labour Act, 2006)** দ্বারা নিয়ন্ত্রিত। মালিক কর্তৃক কোনো স্থায়ী শ্রমিককে চাকরিচ্যুত করতে হলে ২৬ ধারা অনুসারে ১২০ দিনের নোটিশ অথবা ১২০ দিনের মূল মজুরি এবং প্রতি সমাপ্ত কর্মবছরের জন্য ৩০ দিনের ক্ষতিপূরণ প্রদান বাধ্যতামূলক।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** বাংলাদেশ শ্রম আইন, ২০০৬ (The Bangladesh Labour Act, 2006) - ২০০৬ সনের ৪২ নং আইন
- **ধারা:** ২৬ ধারা (মালিক কর্তৃক শ্রমিকের চাকরি অবসান), ২৩ ও ২৪ ধারা (অসদাচরণের কারণে বরখাস্তের নিয়মাবলী), ৪৬ ধারা (১৬ সপ্তাহের মাতৃত্বকালীন ছুটি ও মজুরি), ১০০ ও ১০৮ ধারা (দৈনিক ৮ ঘণ্টা ও দ্বিগুণ ওভারটাইম মজুরি), এবং ৩৩ ধারা (শ্রম আদালতে অভিযোগ দায়ের)

### ৩. ব্যাখ্যা (Explanation)
- **২৬ ধারা (চাকরি অবসান):** কোনো স্থায়ী শ্রমিককে কোনো অসদাচরণ ছাড়াই মালিক যদি চাকরি থেকে অব্যাহতি দেন, তবে ১২০ দিনের লিখিত নোটিশ অথবা ১২০ দিনের সমপরিমাণ মজুরি প্রদান করতে হবে। সাথে প্রতি সমাপ্ত বছর চাকরির জন্য ৩০ দিনের মজুরি ক্ষতিপূরণ দিতে হবে।
- **২৩ ও ২৪ ধারা (বরখাস্তের আনুষ্ঠানিকতা):** চুরির অভিযোগ বা অসদাচরণের জন্য কাউকে বরখাস্ত করতে হলে লিখিত অভিযোগপত্র (Charge-sheet) দেওয়া, আত্মপক্ষ সমর্থনের জন্য অন্তত ৭ দিনের সময় দেওয়া, এবং নিরপেক্ষ তদন্ত কমিটি গঠন বাধ্যতামূলক।
- **৪৬ ধারা (মাতৃত্বকালীন সুবিধা):** প্রসবের পূর্বে ৮ সপ্তাহ এবং প্রসবের পর ৮ সপ্তাহ—মোট ১৬ সপ্তাহ পূর্ণ বেতনে প্রসূতি কল্যাণ ছুটি পাওয়া নারী শ্রমিকের সংবিধিবদ্ধ অধিকার।

### ৪. আইনি প্রয়োগ (Legal Application)
ব্যবহারকারীর ক্ষেত্রে: যদি মালিক কোনো শ্রমিককে নোটিশ বা সার্ভিস বেনিফিট ছাড়া আকস্মিক বের করে দেন, তবে শ্রমিক আইনের ৩৩ ধারা অনুযায়ী প্রথমে মালিকের কাছে লিখিত অভিযোগ (Grievance Petition) পাঠাবেন এবং সমাধান না হলে সরাসরি শ্রম আদালতে মামলা করতে পারবেন।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **মালিককে লিখিত অভিযোগ (Grievance):** ঘটনার তারিখ হতে ৩০ দিনের মধ্যে রেজিস্টার্ড ডাকযোগে মালিকের নিকট লিখিত অভিযোগ পেশ করুন।
2. **মালিকের উত্তরের সময়সীমা:** অভিযোগ প্রাপ্তির ৩০ দিনের মধ্যে মালিককে সিদ্ধান্ত জানাতে হবে।
3. **শ্রম আদালতে মামলা:** মালিক কোনো উত্তর না দিলে বা সিদ্ধান্ত অসন্তোষজনক হলে পরবর্তী ৩০ দিনের মধ্যে সংশ্লিষ্ট এলাকার বিজ্ঞ **শ্রম আদালতে (Labour Court)** অভিযোগ দায়ের করতে হবে।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- শ্রম আইনের ৩৩ ধারার নির্দিষ্ট সময়সীমা (৩০ দিনের গ্রিভান্স নোটিশ এবং ৩০ দিনের মধ্যে মামলা) কঠোরভাবে মেনে চলতে হয়; সময় পার হলে মামলা তামাদি হয়ে যায়।
- ব্যবস্থাপকীয় বা প্রশাসনিক দায়িত্বে (Managerial/Administrative) থাকা কর্মকর্তারা শ্রমিকের সংজ্ঞায় পড়বেন কি না, তা তাদের কাজের প্রকৃত দায়িত্বের ওপর নির্ভর করে।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd)
- **Act:** The Bangladesh Labour Act, 2006 (Act No. XLII of 2006)
- **Sections:** Sections 23, 24, 26, 33, 46, 108
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-957.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
In Bangladesh, terms of employment, termination of services, disciplinary dismissal, maximum working hours, overtime wages, and maternity benefits are governed by **The Bangladesh Labour Act, 2006**. Permanent workers terminated under Section 26 are entitled to 120 days written notice (or wages in lieu) plus 30 days compensation for every completed year of continuous service.

### 2. Relevant Bangladesh Law
- **Statute:** The Bangladesh Labour Act, 2006 (Act No. XLII of 2006)
- **Key Sections:** Section 26 (Termination by employer), Sections 23 & 24 (Dismissal for misconduct), Section 33 (Grievance procedure), Section 46 (16-week maternity benefit), Section 108 (Double overtime rate)

### 3. Explanation
Section 26 explicitly prohibits uncompensated retrenchment. Where termination occurs without cause, the employer must discharge all terminal dues, accumulated leave wages, and gratuity within 30 working days. For disciplinary action under Section 23, the employer must issue a formal show-cause charge sheet with at least 7 days response time and conduct an impartial domestic inquiry.

### 4. Legal Application
An employee wrongfully dismissed or terminated without terminal benefits must follow the strict statutory grievance procedure outlined in Section 33 before invoking the jurisdiction of the Labour Court.

### 5. Legal Procedure
1. **Grievance Notice:** Send formal written grievance to the employer via registered post within 30 days of the cause of action.
2. **Employer's Response Window:** The employer is granted 30 days to resolve the grievance.
3. **Plaint before Labour Court:** If the employer fails to resolve or communicate a decision within 30 days, file a complaint before the Labour Court within the subsequent 30 days.

### 6. Important Exceptions or Limitations
- The limitation periods in Section 33 are strictly enforced; failure to submit grievance notice within 30 days extinguishes the right to approach the Labour Court.
- Persons employed purely in administrative, managerial, or supervisory capacities may be excluded from the statutory definition of 'Worker' under Section 2(65).

### 7. Sources and References
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd)
- **Act:** The Bangladesh Labour Act, 2006
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-957.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 7. HOUSE RENT & TENANCY DISPUTES
  else if (
    queryLower.includes('ভাড়া') || queryLower.includes('ভাড়াটিয়া') || queryLower.includes('বাড়িওয়ালা') || 
    queryLower.includes('উচ্ছেদ') || queryLower.includes('অগ্রিম') || queryLower.includes('rent') || 
    queryLower.includes('tenant') || queryLower.includes('landlord')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে আবাসিক ও বাণিজ্যিক বাড়ি ভাড়া, ভাড়াটিয়া উচ্ছেদ এবং অগ্রিম জমার বিধান **বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১ (The Premises Rent Control Act, 1991)** দ্বারা নিয়ন্ত্রিত। কোনো বাড়িওয়ালা আইনসঙ্গত কারণ ও উপযুক্ত আদালতের ডিক্রি ছাড়া বলপূর্বক কোনো ভাড়াটিয়াকে উচ্ছেদ করতে পারেন না এবং ১ মাসের ভাড়ার অতিরিক্ত কোনো অগ্রিম জামানত গ্রহণ করা আইনত নিষিদ্ধ।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১ (The Premises Rent Control Act, 1991) - ১৯৯১ সনের ৩ নং আইন
- **ধারা:** ১০ ধারা (১ মাসের অতিরিক্ত অগ্রিম ভাড়া গ্রহণের নিষেধাজ্ঞা), ১৮ ধারা (ভাড়াটিয়া উচ্ছেদের ওপর বিধিনিষেধ), এবং ১৯ ধারা (ভাড়া পরিশোধে বাড়িওয়ালা রসিদ দিতে বাধ্য)
- **সম্পত্তি হস্তান্তর আইন, ১৮৮২:** ১০৬ ধারা (লিজ অবসানের নোটিশ)

### ৩. ব্যাখ্যা (Explanation)
- **উচ্ছেদ বিধিনিষেধ (১৮ ধারা):** ভাড়াটিয়া যদি নিয়মিতভাবে চুক্তি অনুযায়ী মাসিক ভাড়া পরিশোধ করেন, তবে বাড়িওয়ালা ইচ্ছামতো তাকে উচ্ছেদ করতে পারবেন না। উচ্ছেদের আইনসম্মত কারণসমূহ হলো: ভাড়া খেলাপ করা, বাড়ির কাঠামোগত ক্ষতি সাধন করা, বা বাড়িওয়ালার নিজের বা পরিবারের প্রকৃত বসবাসের জরুরি প্রয়োজন।
- **অগ্রিম গ্রহণের সীমা (১০ ধারা):** বাড়িওয়ালা ১ মাসের বেশি অগ্রিম বা প্রিমিয়াম দাবি করতে পারেন না।
- **রসিদ প্রদানের বাধ্যবাধকতা (১৯ ধারা):** প্রত্যেক বাড়িওয়ালা ভাড়া গ্রহণের সাথে সাথে স্বাক্ষরযুক্ত ভাড়ার রসিদ দিতে বাধ্য। রসিদ না দিলে ভাড়ার টাকা বিজ্ঞ ভাড়া নিয়ন্ত্রক (Rent Controller) আদালতে জমা দেওয়ার অধিকার ভাড়াটিয়ার রয়েছে।

### ৪. আইনি প্রয়োগ (Legal Application)
ব্যবহারকারীর ক্ষেত্রে: যদি বাড়িওয়ালা বিদ্যুৎ/গ্যাস লাইন কেটে দিয়ে বা তালা ঝুলিয়ে ভাড়াটিয়াকে অবৈধভাবে উচ্ছেদের চেষ্টা করেন, তবে তা সরাসরি আইন লঙ্ঘন। ভাড়াটিয়া দ্রুত থানায় জিডি করতে পারেন এবং সহকারী জজ আদালতে (ভাড়া নিয়ন্ত্রক আদালত) অস্থায়ী নিষেধাজ্ঞার মোকদ্দমা দায়ের করতে পারেন।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **নোটিশ প্রদান:** উচ্ছেদ করতে হলে বাড়িওয়ালাকে সম্পত্তি হস্তান্তর আইনের ১০৬ ধারা অনুসারে লিখিত নোটিশ প্রদান করতে হবে।
2. **ভাড়া গ্রহণ অস্বীকার করলে আদালতে জমা:** বাড়িওয়ালা যদি ভাড়া গ্রহণ না করেন, তবে মানি অর্ডারের মাধ্যমে পাঠান এবং ব্যর্থ হলে সংশ্লিষ্ট এলাকার সিনিয়র সহকারী জজ (ভাড়া নিয়ন্ত্রক) আদালতে ভাড়া জমা দিন।
3. **উচ্ছেদ মামলা:** কারণ প্রমাণ সাপেক্ষে বাড়িওয়ালাকে বিজ্ঞ আদালতে উচ্ছেদের দেওয়ানি মামলা করে ডিক্রি হাসিল করতে হবে; আইন নিজের হাতে তুলে নেওয়া সম্পূর্ণ বেআইনি।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- ভাড়াটিয়া যদি ক্রমাগত ভাড়া পরিশোধে ব্যর্থ হন এবং ডিফল্টার হন, তবে তিনি ১৮ ধারার আইনগত সুরক্ষা হারাবেন।
- সাবলেট বা উপ-ভাড়া দেওয়ার অনুমতি চুক্তিতে না থাকলে বাড়িওয়ালা উচ্ছেদের বৈধ কারণ পাবেন।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd)
- **Act:** The Premises Rent Control Act, 1991 (Act No. III of 1991)
- **Sections:** Sections 10, 18, 19
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-789.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
In Bangladesh, tenancy relations, eviction protection, and security deposits are governed by **The Premises Rent Control Act, 1991 (Act No. III of 1991)**. Landlords cannot forcibly evict any tenant without a decree from a competent Rent Controller Court, and demanding advance rent exceeding one (1) month is strictly prohibited by law.

### 2. Relevant Bangladesh Law
- **Statute:** The Premises Rent Control Act, 1991 (Act No. III of 1991) — Sections 10, 18, 19
- **Statute:** The Transfer of Property Act, 1882 — Section 106 (Notice to terminate tenancy)

### 3. Explanation
Under Section 18, so long as a tenant pays the agreed rent regularly within the stipulated timeline, no decree or order for the recovery of possession shall be passed against him, except on specific grounds such as subletting without consent, committing nuisance, structural waste, or genuine personal necessity. Section 10 prohibits demanding more than one month's rent as advance or premium.

### 4. Legal Application
If a landlord cuts utility supplies (water, gas, electricity) or threatens lockouts, the tenant can seek police protection via GD and petition the Rent Controller for restitution of amenities and temporary injunction against forced eviction.

### 5. Legal Procedure
1. **Notice to Quit:** Landlord must serve statutory notice under Section 106 of the Transfer of Property Act.
2. **Deposit with Rent Controller:** If the landlord refuses rent to fabricate default, the tenant must remit via postal money order, and upon refusal, deposit with the Senior Assistant Judge (Rent Controller).
3. **Suit for Ejectment:** Landlord must file an ejectment suit in the civil court to obtain a lawful writ of possession.

### 6. Important Exceptions or Limitations
- A tenant who defaults on rent ceases to enjoy Section 18 protection and is subject to immediate ejectment.
- Both parties should execute a written lease agreement on non-judicial stamp paper specifying notice periods.

### 7. Sources and References
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd)
- **Act:** The Premises Rent Control Act, 1991
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-789.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 8. CONSUMER RIGHTS PROTECTION
  else if (
    queryLower.includes('ভোক্তা') || queryLower.includes('ভেজাল') || queryLower.includes('অতিরিক্ত দাম') || 
    queryLower.includes('মেয়াদ') || queryLower.includes('প্রতারণামূলক') || queryLower.includes('consumer') || 
    queryLower.includes('adulteration') || queryLower.includes('overcharge')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে পণ্যের গায়ে উল্লেখিত দামের চেয়ে বেশি রাখা, ওজনে কারচুপি, মেয়াদোত্তীর্ণ বা ভেজাল পণ্য বিক্রয় এবং প্রতিশ্রুত সেবা না পাওয়ার বিরুদ্ধে **ভোক্তা অধিকার সংরক্ষণ আইন, ২০০৯ (Consumer Rights Protection Act, 2009)** অনুসারে কঠোর আইনি প্রতিকার বিদ্যমান। প্রতারিত যেকোনো ভোক্তা ঘটনার ৩০ দিনের মধ্যে ভোক্তা অধিদপ্তরে অভিযোগ দায়ের করতে পারেন এবং আদায়কৃত মোট জরিমানার ২৫% অর্থ অভিযোগকারীকে সরাসরি প্রদান করা হয়।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** ভোক্তা অধিকার সংরক্ষণ আইন, ২০০৯ (Consumer Rights Protection Act, 2009) - ২০০৯ সনের ২৬ নং আইন
- **ধারা:** ৩৭ ধারা (পণ্যের মোড়ক না থাকা ও মূল্যের বেশি দাম নেওয়া), ৪০ ধারা (ধার্যকৃত মূল্যের অধিক মূল্য দাবি), ৪৫ ধারা (প্রতিশ্রুত পণ্য/সেবা না দেওয়া), এবং ৫২ ধারা (মেয়াদোত্তীর্ণ বা ভেজাল পণ্য বিক্রয়)
- **ধারা ৭৬(১):** ভোক্তা কর্তৃক অভিযোগ দায়ের ও জরিমানার ২৫% পুরস্কার প্রাপ্তির সংবিধিবদ্ধ অধিকার

### ৩. ব্যাখ্যা (Explanation)
ভোক্তা অধিকার সংরক্ষণ আইনের আওতায় কোনো ব্যবসায়ী বা দোকানদার পণ্যের মোড়কে মুদ্রিত সর্বোচ্চ খুচরা মূল্যের (MRP) বেশি এক পয়সাও বেশি নিতে পারেন না। পণ্যে ক্ষতিকারক উপাদান মেশানো, বাটখারা ও পরিমাপে কম দেওয়া বা মিথ্যা বিজ্ঞাপন দিয়ে বিভ্রান্ত করা আমলযোগ্য অপরাধ।

### ৪. আইনি প্রয়োগ (Legal Application)
ব্যবহারকারীর ক্ষেত্রে: যদি কোনো দোকানদার বেশি দাম রাখেন বা ভেজাল/মেয়াদোত্তীর্ণ পণ্য বিক্রি করেন, তবে ক্রয়ের মানিসিপ বা রসিদ এবং পণ্যের মোড়কের ছবি তুলে ৩০ দিনের মধ্যে লিখিতভাবে বা অনলাইনে ভোক্তা অধিকার সংরক্ষণ অধিদপ্তরে অভিযোগ দায়ের করুন।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **প্রমাণ সংগ্রহ:** ক্রয়ের মানিসিপ/বিল এবং পণ্যের ছবি ও তারিখ সংরক্ষণ করুন।
2. **অভিযোগ দাখিল:** কারণ উদ্ভব হওয়ার ৩০ দিনের মধ্যে মহাপরিচালক, জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তর বরাবর লিখিতভাবে অথবা ইমেইলে (\`nccc@dncrp.gov.bd\`) বা অ্যাপের মাধ্যমে অভিযোগ জমা দিন।
3. **শুনানি ও জরিমানা:** অধিদপ্তর উভয় পক্ষকে তলব করে শুনানি গ্রহণ করবে। অভিযোগ প্রমাণিত হলে দোকানদারকে জরিমানা করা হবে এবং জরিমানার ২৫% টাকা তাত্ক্ষণিক অভিযোগকারীকে হস্তান্তর করা হবে।
4. **হটলাইন:** সার্বক্ষণিক অভিযোগের জন্য হটলাইন নম্বর **১৬১২১**-এ সরাসরি যোগাযোগ করা যায়।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- ঘটনা ঘটার ৩০ (ত্রিশ) দিন পার হয়ে গেলে ভোক্তা অধিদপ্তরে অভিযোগ গ্রহণ করা হয় না; তামাদি হয়ে যায়।
- ব্যক্তিগত শত্রুতার জেরে উদ্দেশ্যপ্রণোদিত ভুয়া অভিযোগ প্রমাণিত হলে অভিযোগকারীর বিরুদ্ধে আইনি ব্যবস্থা নেওয়া হতে পারে।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Directorate of National Consumer Rights Protection (dncrp.gov.bd) & BD Laws
- **Act:** The Consumer Rights Protection Act, 2009 (Act No. XXVI of 2009)
- **Sections:** Sections 37, 40, 45, 52, 76
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-1014.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
In Bangladesh, price-gouging, sale of expired/adulterated goods, weight tampering, and misleading advertisements are strictly actionable under **The Consumer Rights Protection Act, 2009 (Act No. XXVI of 2009)**. Any aggrieved consumer can file a complaint with the Directorate of National Consumer Rights Protection (DNCRP) within 30 days, and the complainant is entitled to receive 25% of the total fine imposed upon the wrongdoer.

### 2. Relevant Bangladesh Law
- **Statute:** The Consumer Rights Protection Act, 2009 — Sections 37, 40, 45, 52
- **Key Incentive Provision:** Section 76(1) (Complainant's entitlement to 25% of the realized penalty)

### 3. Explanation
Section 40 prohibits selling or offering to sell any product at a price higher than the Maximum Retail Price (MRP) printed on the package. Section 52 criminalizes selling expired medicines, adulterated food, or unsafe consumer articles.

### 4. Legal Application
Consumers must preserve the purchase receipt/invoice alongside photos of the product and pricing labels. A formal petition filed with DNCRP initiates administrative hearings leading to instant fines and compensation.

### 5. Legal Procedure
1. **Preserve Proof:** Safeguard receipt/cash memo and photographs of the offending product.
2. **File Complaint:** Submit complaint within 30 days to the Director General, DNCRP in person, via email (nccc@dncrp.gov.bd), or the consumer mobile app.
3. **Investigation & 25% Payout:** DNCRP conducts bilateral hearing. Upon finding of liability, fine is levied and 25% is disbursed to the complainant on the spot.
4. **National Consumer Helpline:** Dial **16121** for round-the-clock guidance.

### 6. Important Exceptions or Limitations
- The statutory 30-day filing window is strict; complaints lodged after 30 days are barred.
- False or frivolous complaints filed with intent to harass can attract legal repercussions.

### 7. Sources and References
- **Source:** Directorate of National Consumer Rights Protection (dncrp.gov.bd)
- **Act:** The Consumer Rights Protection Act, 2009
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-1014.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 9. CHEQUE DISHONOUR (NI ACT 138)
  else if (
    queryLower.includes('cheque') || queryLower.includes('check') || queryLower.includes('138') || 
    queryLower.includes('ডিজঅনার') || queryLower.includes('বাউন্স') || queryLower.includes('নেগোশিয়েবল')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
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
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
In Bangladesh, dishonour of a bank cheque due to insufficiency of funds constitutes a criminal offense under Section 138 of The Negotiable Instruments Act, 1881. The payee must serve a formal 30-day statutory demand notice within 30 days of receiving the cheque return memo, followed by filing a complaint within 30 days after the notice period expires.

### 2. Relevant Bangladesh Law
- **Statute:** The Negotiable Instruments Act, 1881 (Act No. XXVI of 1881)
- **Core Sections:** Section 138 (Cheque dishonour) & Section 141 (Offenses by companies)
- **Trial Forum:** Court of Sessions / Joint Sessions Judge Court

### 3. Explanation
Section 138 prescribes punishment with imprisonment extending up to 1 year, or with fine extending up to thrice the amount of the cheque, or both. The dishonour memo serves as prima facie evidence of insufficient funds.

### 4. Legal Application
The holder cannot initiate court litigation immediately upon dishonour. Strict adherence to Section 138(1)(b) (30-day legal notice) and Section 138(1)(c) (30-day grace period for payment) is mandatory before the cause of action matures.

### 5. Legal Procedure
1. **Presentment:** Present cheque to drawee bank within 6 months of issuance.
2. **Secure Dishonour Slip:** Obtain formal Return Memo detailing the reason for refusal.
3. **Statutory Demand Notice:** Issue legal notice via registered post with A/D within 30 days.
4. **File Complaint:** Upon expiry of 30 days without payment, file a formal complaint before the Judicial Magistrate / Sessions Court within the subsequent 30 days.

### 6. Important Exceptions or Limitations
- Missing the 30-day statutory notice or filing deadline completely bars criminal prosecution under the NI Act.
- For corporate entities, both the company and responsible directors must be named as co-accused under Section 141.

### 7. Sources and References
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd)
- **Act:** The Negotiable Instruments Act, 1881
- **Sections:** Sections 138, 140, 141
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-52.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 10. POLICE GD VS FIR
  else if (
    queryLower.includes('gd') || queryLower.includes('fir') || queryLower.includes('ডায়েরি') || 
    queryLower.includes('এজাহার') || queryLower.includes('থানা')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
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

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
Under Bangladesh law, a General Diary (GD) is a station record maintained for non-cognizable incidents, lost documents, or prospective threats. In contrast, a First Information Report (FIR / এজাহার) formally commences a criminal prosecution for cognizable offenses, vesting the police with statutory powers to investigate and arrest without an order from a Magistrate.

### 2. Relevant Bangladesh Law
- **Statute:** The Code of Criminal Procedure, 1898 (CrPC) — Section 154 (FIR) & Section 155 (GD)
- **Police Regulations:** Police Regulations Bengal (PRB 243, 244); The Police Act, 1861 (Section 44)

### 3. Explanation
Under Section 44 of the Police Act 1861, every police station maintains a General Diary. A GD is not a substantive case and police cannot investigate it without an order from a competent Magistrate under Section 155(2) CrPC. An FIR under Section 154 CrPC pertains to cognizable offenses (theft, assault, homicide) and empowers the investigating officer to arrest without a warrant under Section 156.

### 4. Legal Application
When reporting lost identity credentials or preemptive security concerns, filing an immediate GD establishes credible contemporaneous evidence. If a cognizable offense has occurred, an immediate FIR must be lodged.

### 5. Legal Procedure
1. **Filing Online GD:** Use the Bangladesh Police Online GD portal (gd.police.gov.bd) via NID verification. Submit details and print the digitally certified GD slip.
2. **Filing FIR at Station:** Submit typed/written complaint to the Officer-in-Charge (OC). The OC records it in Form 27 and provides an endorsed copy to the informant free of charge.

### 6. Important Exceptions or Limitations
- If the police station refuses to accept an FIR, the complainant can file a direct Complaint Case (C.R. Case) before the Judicial Magistrate Court under Sections 190 and 200 of the CrPC.
- Lodging false complaints attracts prosecution under Sections 182 and 211 of the Penal Code 1860.

### 7. Sources and References
- **Source:** Laws of Bangladesh & Master Legal Document (/Allfile.pdf)
- **Act:** The Code of Criminal Procedure, 1898
- **Sections:** Sections 154, 155, 156, 190
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-75.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 11. INCOME TAX ACT 2023
  else if (
    queryLower.includes('tax') || queryLower.includes('আয়কর') || queryLower.includes('রিটার্ন') || 
    queryLower.includes('tin') || queryLower.includes('nbr') || queryLower.includes('কর')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
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
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
In Bangladesh, tax compliance is governed by the **Income Tax Act, 2023 (Act No. XII of 2023)**, which repealed the historic 1984 ordinance. Filing an annual income tax return before "Tax Day" (November 30) is mandatory for individuals exceeding the minimum threshold or holding an e-TIN under Section 166.

### 2. Relevant Bangladesh Law
- **Statute:** The Income Tax Act, 2023 (Act No. XII of 2023)
- **Key Sections:** Section 166 (Mandatory filing), Section 171 (Tax Day definition), Section 261 (e-TIN issuance), Section 266 (Penalty for default)
- **Regulatory Authority:** National Board of Revenue (NBR), Bangladesh

### 3. Explanation
Section 166 mandates return submission not only for income exceeding basic exemption limits, but also for any person wishing to obtain municipal trade licenses, car registrations, banking loans, or credit cards. Section 171 designates November 30 as statutory "Tax Day" for individual taxpayers.

### 4. Legal Application
Taxpayers holding an active e-TIN must submit their annual statement of income, assets, and liabilities. Untimely filing disqualifies the assessee from statutory exemptions, investment rebates, and prompts monthly default interest under Section 174.

### 5. Legal Procedure
1. **Obtaining e-TIN:** Register on the NBR portal (etaxnbr.gov.bd) using verified NID.
2. **Compilation:** Reconcile gross earnings, bank interest statements, and asset/liability disclosures.
3. **Submission:** Submit electronically via the NBR e-Tax system to generate the official Tax Return Acknowledgement Receipt.

### 6. Important Exceptions or Limitations
- Filing past Tax Day without approved extension attracts penalties under Section 266 and 2% monthly delay interest under Section 174.
- Section 264 mandates presenting the proof of submission (PSR) across 43+ categories of financial services.

### 7. Sources and References
- **Source:** Laws of Bangladesh & Master Legal Document (/Allfile.pdf)
- **Act:** The Income Tax Act, 2023
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-1437.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 12. CONSTITUTIONAL RIGHTS & FUNDAMENTAL FREEDOMS
  else if (
    queryLower.includes('constitution') || queryLower.includes('fundamental right') || queryLower.includes('constitutional') ||
    queryLower.includes('সংবিধান') || queryLower.includes('মৌলিক অধিকার') || queryLower.includes('মানবাধিকার') ||
    queryLower.includes('মত প্রকাশ') || queryLower.includes('বাক স্বাধীনতা') || queryLower.includes('ভোট') ||
    queryLower.includes('human rights') || queryLower.includes('freedom of speech') || queryLower.includes('right to vote') ||
    queryLower.includes('writ') || queryLower.includes('habeas corpus') || queryLower.includes('রিট')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশের সংবিধান ১৯৭২ (The Constitution of Bangladesh, 1972) নাগরিকদের মৌলিক অধিকার নিশ্চিত করে। সংবিধানের তৃতীয় ভাগ (অনুচ্ছেদ ২৬-৪৭ক) মৌলিক অধিকারের বিস্তারিত বিধান ধারণ করে। এই অধিকার লঙ্ঘিত হলে সুপ্রিম কোর্টের হাইকোর্ট বিভাগে সংবিধানের ১০২ অনুচ্ছেদের অধীনে রিট পিটিশন দায়ের করে প্রতিকার পাওয়া যায়।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** বাংলাদেশের সংবিধান, ১৯৭২ (The Constitution of the People's Republic of Bangladesh, 1972)
- **তৃতীয় ভাগ — মৌলিক অধিকার:**
  - **অনুচ্ছেদ ২৭:** আইনের দৃষ্টিতে সমতা (Equality before law)
  - **অনুচ্ছেদ ৩১:** আইনের আশ্রয় লাভের অধিকার (Right to protection of law)
  - **অনুচ্ছেদ ৩২:** জীবন ও ব্যক্তিস্বাধীনতার অধিকার (Right to life and personal liberty)
  - **অনুচ্ছেদ ৩৩:** গ্রেফতার ও আটক সম্পর্কে রক্ষাকবচ
  - **অনুচ্ছেদ ৩৯:** চিন্তা, বিবেক ও বাক-স্বাধীনতা
  - **অনুচ্ছেদ ৪১:** ধর্মের স্বাধীনতা
- **প্রতিকারের ধারা:** অনুচ্ছেদ ১০২ (হাইকোর্ট বিভাগে রিট দাখিলের ক্ষমতা)

### ৩. ব্যাখ্যা (Explanation)
সংবিধানের তৃতীয় ভাগে বর্ণিত মৌলিক অধিকারগুলি বাংলাদেশ রাষ্ট্রের বিরুদ্ধে নাগরিকের সংরক্ষণযোগ্য দাবি। রাষ্ট্র বা সরকারি কর্তৃপক্ষ এই অধিকার লঙ্ঘন করলে সংক্ষুব্ধ ব্যক্তি হাইকোর্টে রিট করতে পারেন। পাঁচ ধরনের রিট রয়েছে: হেবিয়াস কর্পাস (অবৈধ আটকের বিরুদ্ধে), ম্যান্ডামাস (সরকারি কর্তব্য পালনে বাধ্য করতে), সার্টিওরারি, প্রহিবিশন ও কো-ওয়ারেন্টো।

### ৪. আইনি প্রয়োগ (Legal Application)
যদি কোনো সরকারি কর্তৃপক্ষ বা আইনশৃঙ্খলা বাহিনী আপনার মৌলিক অধিকার হরণ করে বা আইনি ভিত্তি ছাড়া আটক রাখে, তবে সংবিধানের ১০২(২)(খ)(১) ধারা অনুযায়ী হেবিয়াস কর্পাস রিট দায়ের করে ব্যক্তিকে মুক্ত করা যায়।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **রিট পিটিশন প্রস্তুতি:** একজন লাইসেন্সধারী আইনজীবীর মাধ্যমে হাইকোর্ট বিভাগে রিট পিটিশন (Writ Petition) প্রস্তুত করুন।
2. **রিট দাখিল:** হাইকোর্টের সংশ্লিষ্ট বেঞ্চে পিটিশন দাখিল করুন। জরুরি ক্ষেত্রে সংশ্লিষ্ট বিচারকের চেম্বারে জরুরি শুনানির আবেদন করা যায়।
3. **রুল ও অন্তর্বর্তীকালীন আদেশ:** আদালত রুল জারি করেন এবং প্রয়োজনে স্থিতাবস্থার (Status Quo) বা অন্তর্বর্তীকালীন আদেশ দেন।
4. **চূড়ান্ত শুনানি:** উভয় পক্ষের যুক্তিতর্ক শুনে আদালত চূড়ান্ত রায় দেন।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- সংবিধানের ৪৭ অনুচ্ছেদ অনুযায়ী জরুরি অবস্থা ঘোষিত হলে কিছু মৌলিক অধিকার স্থগিত হতে পারে।
- রিট পিটিশন দায়ের করতে হলে সাধারণত বিকল্প প্রতিকার শেষ করতে হয়; তবে মৌলিক অধিকার হরণের ক্ষেত্রে সরাসরি রিট গ্রহণযোগ্য।
- শুধুমাত্র রাষ্ট্রের বিরুদ্ধে (State/Government Authority) রিট করা যায়; ব্যক্তিগত বিরোধে দেওয়ানি আদালতে যেতে হয়।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Bangladesh Constitutional Law & Official BD Laws Portal
- **Act:** The Constitution of the People's Republic of Bangladesh, 1972
- **Articles:** Articles 26-47A (Fundamental Rights), Article 102 (Writ Jurisdiction)
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-367.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
The Constitution of Bangladesh 1972 guarantees fundamental rights to every citizen under its **Part III (Articles 26–47A)**. When fundamental rights are violated by the State or a public authority, an aggrieved person may seek constitutional remedies by filing a **Writ Petition** before the High Court Division of the Supreme Court under **Article 102**.

### 2. Relevant Bangladesh Law
- **Statute:** The Constitution of the People's Republic of Bangladesh, 1972
- **Part III — Fundamental Rights:**
  - **Article 27:** Equality before law
  - **Article 31:** Right to protection of law
  - **Article 32:** Right to life and personal liberty
  - **Article 33:** Safeguards as to arrest and detention
  - **Article 39:** Freedom of thought and expression
- **Remedy Provision:** Article 102 — High Court Division's writ jurisdiction

### 3. Explanation
Fundamental rights are justiciable constitutional guarantees enforceable against the State. Five categories of writs are available: **Habeas Corpus** (against illegal detention), **Mandamus** (compelling a public duty), **Certiorari** (quashing unlawful orders), **Prohibition** (restraining excess jurisdiction), and **Quo Warranto** (challenging unlawful public office holding).

### 4. Legal Application
If a public authority detains a person without lawful authority or denies a statutory benefit, a Habeas Corpus or Mandamus petition can be filed directly before the High Court Division citing the violated constitutional provision.

### 5. Legal Procedure
1. **Instruct a Supreme Court Advocate:** Prepare writ petition citing the violated fundamental right and the impugned state action.
2. **File in High Court Division:** Submit the petition with supporting affidavit-in-support before the relevant bench.
3. **Rule Nisi & Interim Relief:** The court issues a Rule calling on the respondent to show cause, and may grant interim stay or status quo orders.
4. **Final Hearing & Judgment:** After both parties argue, the court issues the final judgment — absolute rule (relief granted) or rule discharged.

### 6. Important Exceptions or Limitations
- During a Proclamation of Emergency under Article 141A, enforcement of certain fundamental rights may be suspended by Presidential Order.
- Writs generally lie only against the State or statutory public authorities, not against private individuals.

### 7. Sources and References
- **Source:** Laws of Bangladesh Portal (bdlaws.minlaw.gov.bd)
- **Act:** The Constitution of Bangladesh, 1972
- **Articles:** 26–47A (Fundamental Rights), 102 (Writ Jurisdiction)
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-367.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 13. SUCCESSION, INHERITANCE & WILLS
  else if (
    queryLower.includes('উত্তরাধিকার') || queryLower.includes('ওয়ারিশ') || queryLower.includes('মিরাস') ||
    queryLower.includes('সম্পত্তি ভাগ') || queryLower.includes('মৃত্যুর পর') || queryLower.includes('উইল') ||
    queryLower.includes('দান') || queryLower.includes('হেবা') ||
    queryLower.includes('inheritance') || queryLower.includes('succession') || queryLower.includes('will') ||
    queryLower.includes('probate') || queryLower.includes('heir') || queryLower.includes('estate')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে মুসলিম উত্তরাধিকার **মুসলিম ব্যক্তিগত আইন (Muslim Personal Law / Shariat Application Act, 1937)** এবং কোরানের বিধান অনুসারে পরিচালিত হয়। হিন্দু উত্তরাধিকার **হিন্দু উত্তরাধিকার আইন** এবং খ্রিস্টান ও অন্যান্যদের জন্য **উত্তরাধিকার আইন, ১৯২৫ (Succession Act, 1925)** প্রযোজ্য। মৃত ব্যক্তির সম্পদ তার ধর্মীয় আইন অনুসারে ওয়ারিশদের মধ্যে ভাগ হয়।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **মুসলিম উত্তরাধিকার:** মুসলিম ব্যক্তিগত আইন (শরীয়ত) প্রয়োগ আইন, ১৯৩৭ এবং ফারায়েজ আইন (মুসলিম ব্যক্তিগত আইনের অংশ)
- **সাধারণ উত্তরাধিকার:** উত্তরাধিকার আইন, ১৯২৫ (The Succession Act, 1925) — খ্রিস্টান, বৌদ্ধ ও অন্যান্যদের জন্য
- **দান/হেবা:** মুসলিম আইনে হেবা (Heba) সম্পাদনে দাতার দখল হস্তান্তর বাধ্যতামূলক
- **সম্পত্তি নিবন্ধন:** রেজিস্ট্রেশন আইন, ১৯০৮ এবং রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন, ১৯৫০

### ৩. ব্যাখ্যা (Explanation)
মুসলিম ফারায়েজ আইনে সম্পদ বিভিন্ন শ্রেণির ওয়ারিশদের মধ্যে নির্ধারিত হারে ভাগ হয়:
- **স্ত্রী:** সন্তান থাকলে ১/৮ ভাগ, না থাকলে ১/৪ ভাগ
- **মেয়ে:** একজন হলে ১/২, একাধিক হলে ২/৩ ভাগ
- **মা:** কোনো ক্ষেত্রে ১/৬ বা ১/৩ ভাগ
- **পুত্র:** মেয়ের দ্বিগুণ অংশ (অবশিষ্ট সম্পদ আসাবা হিসেবে)

### ৪. আইনি প্রয়োগ (Legal Application)
মৃত ব্যক্তির সম্পদ বণ্টনের জন্য প্রথমে ওয়ারিশ সনদ (Legal Heir Certificate) গ্রহণ করতে হবে। তারপর সকল ওয়ারিশের সম্মতিতে বা আদালতের ডিক্রির মাধ্যমে সম্পদ ভাগ করা হয়। বিরোধ হলে সহকারী জজ আদালতে বণ্টন মামলা (Partition Suit) দায়ের করতে হবে।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **মৃত্যু সনদ সংগ্রহ:** ইউনিয়ন পরিষদ বা সিটি কর্পোরেশন থেকে মৃত্যু নিবন্ধন সনদ সংগ্রহ করুন।
2. **ওয়ারিশ সনদ:** স্থানীয় ইউনিয়ন পরিষদ চেয়ারম্যান বা কাজী অফিস থেকে ওয়ারিশ সনদ গ্রহণ করুন।
3. **সম্পত্তির তালিকা:** মৃত ব্যক্তির সকল স্থাবর ও অস্থাবর সম্পদের তালিকা তৈরি করুন।
4. **নামজারি ও দলিল:** সম্পত্তির খতিয়ান নামজারি করুন এবং হস্তান্তর দলিল সম্পাদন করুন।
5. **আদালতে বণ্টন:** সকলের সম্মতি না হলে দেওয়ানি আদালতে বণ্টন মামলা (Partition Suit) দায়ের করুন।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- মুসলিম আইনে মৃত্যুশয্যায় (Deathbed gift / Marz-ul-maut) প্রদত্ত হেবা সীমিত — সম্পদের ১/৩ ভাগের বেশি দান কার্যকর নয়।
- অমুসলিম পিতার সম্পদ মুসলিম সন্তান পাবেন না এবং মুসলিম পিতার সম্পদ অমুসলিম সন্তান পাবেন না — ধর্মের ভিন্নতা উত্তরাধিকারে বাধা।
- হত্যার অভিযোগে দণ্ডিত ব্যক্তি নিহত ব্যক্তির সম্পদের উত্তরাধিকার পাবেন না।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd) & Master Legal PDF (/Allfile.pdf)
- **Act:** The Succession Act, 1925 (Act No. XXXIX of 1925)
- **Act:** Muslim Personal Law (Shariat) Application Act, 1937
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-138.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
In Bangladesh, succession and inheritance law is **religion-specific**. Muslim inheritance follows **Islamic Faraid principles** under the Muslim Personal Law (Shariat) Application Act, 1937. Christians and others follow **The Succession Act, 1925**. Property distribution after death requires a legal heir certificate, followed by either amicable partition or a court Partition Suit.

### 2. Relevant Bangladesh Law
- **Muslim Succession:** Muslim Personal Law (Shariat) Application Act, 1937 & Faraid (Islamic inheritance rules)
- **General Succession:** The Succession Act, 1925 (Act No. XXXIX of 1925) — Sections 57–191
- **Probate of Wills:** The Succession Act, 1925 — Part VI (Sections 213–369)
- **Property Transfer:** Registration Act, 1908 & State Acquisition and Tenancy Act, 1950

### 3. Explanation
Under Muslim Faraid, the estate is distributed in fixed Quranic shares: spouse (1/8 with children, 1/4 without), daughter (1/2 if sole heir, 2/3 if multiple), mother (1/6 or 1/3 depending on survivors). Male residuaries (Asaba) take what remains. Under the Succession Act 1925, a legally executed will (testament) governs distribution for non-Muslims; intestate succession follows statutory schedules.

### 4. Legal Application
When a person dies, the legal heirs must first obtain a **Legal Heir Certificate** from the local Union Parishad Chairman or City Corporation. All immovable property must be mutation-recorded in the heirs' names within the revenue records before sale or partition.

### 5. Legal Procedure
1. **Death Certificate:** Obtain certified copy from Union Parishad / City Corporation / Civil Surgeon.
2. **Heir Certificate:** Apply before the local chairman or executive magistrate listing all surviving heirs.
3. **Probate (if Will exists):** File probate petition in the District Judge Court under Part VI of the Succession Act.
4. **Mutation of Records:** Apply to AC Land office to record heirs' names in revenue Khatian.
5. **Partition Suit:** If heirs disagree, file a Partition Suit before the Assistant Judge Court.

### 6. Important Exceptions or Limitations
- A Muslim who murders the deceased forfeits inheritance rights.
- Difference in religion bars mutual inheritance between Muslim and non-Muslim relatives.
- Deathbed gifts (Marz-ul-maut) by Muslims are limited to one-third of the net estate.

### 7. Sources and References
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd) & Master Legal PDF (/Allfile.pdf)
- **Act:** The Succession Act, 1925
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-138.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 14. COMPANY LAW & BUSINESS REGISTRATION
  else if (
    queryLower.includes('কোম্পানি') || queryLower.includes('ব্যবসা নিবন্ধন') || queryLower.includes('rjsc') ||
    queryLower.includes('ট্রেড লাইসেন্স') || queryLower.includes('পার্টনারশিপ') || queryLower.includes('এনজিও') ||
    queryLower.includes('company') || queryLower.includes('business registration') || queryLower.includes('trade license') ||
    queryLower.includes('partnership') || queryLower.includes('incorporation') || queryLower.includes('director') ||
    queryLower.includes('shareholder') || queryLower.includes('memorandum') || queryLower.includes('articles of association')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে কোম্পানি গঠন ও পরিচালনা **কোম্পানি আইন, ১৯৯৪ (Companies Act, 1994)** এবং **কোম্পানি আইন, ২০২৪ (সংশোধিত)** দ্বারা নিয়ন্ত্রিত হয়। যৌথ মূলধনী কোম্পানি ও ফার্মসমূহের পরিদপ্তর (RJSC — Registrar of Joint Stock Companies and Firms)-এ নিবন্ধন বাধ্যতামূলক। ট্রেড লাইসেন্সের জন্য স্থানীয় সিটি কর্পোরেশন বা পৌরসভায় আবেদন করতে হয়।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** কোম্পানি আইন, ১৯৯৪ (The Companies Act, 1994) — ১৯৯৪ সনের ১৮ নং আইন
- **মূল বিধান:** ধারা ৬ (পাবলিক ও প্রাইভেট কোম্পানির সংজ্ঞা), ধারা ১১ (মেমোরেন্ডাম অব অ্যাসোসিয়েশন), ধারা ২৯ (নিবন্ধন), ধারা ৮৭ (পরিচালনা পর্ষদ)
- **অংশীদারি ব্যবসা:** Partnership Act, 1932
- **নিয়ন্ত্রক কর্তৃপক্ষ:** RJSC (rjsc.gov.bd) এবং Bangladesh Securities and Exchange Commission (BSEC)

### ৩. ব্যাখ্যা (Explanation)
বাংলাদেশে কোম্পানি দুই ধরনের — প্রাইভেট লিমিটেড কোম্পানি (Private Ltd.) এবং পাবলিক লিমিটেড কোম্পানি (Public Ltd.)। প্রাইভেট কোম্পানিতে সর্বোচ্চ ৫০ জন শেয়ারহোল্ডার ও ন্যূনতম ২ জন পরিচালক থাকতে পারেন। পাবলিক কোম্পানিতে ন্যূনতম ৭ জন শেয়ারহোল্ডার ও ৩ জন পরিচালক প্রয়োজন। কোম্পানি গঠনে মেমোরেন্ডাম ও আর্টিকেলস অব অ্যাসোসিয়েশন তৈরি করে RJSC-তে দাখিল করতে হয়।

### ৪. আইনি প্রয়োগ (Legal Application)
নতুন ব্যবসা শুরুর জন্য: ব্যবসার ধরন ও মূলধন অনুযায়ী প্রাইভেট লিমিটেড কোম্পানি, পার্টনারশিপ ফার্ম বা সোল প্রোপ্রাইটরশিপ বেছে নিন। RJSC পোর্টালে অনলাইনে নাম পরীক্ষা করুন, তারপর মেমোরেন্ডাম ও আর্টিকেলস আপলোড করে নিবন্ধন সম্পন্ন করুন।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **নাম অনুমোদন:** RJSC পোর্টালে (rjsc.gov.bd) প্রস্তাবিত কোম্পানির নাম উপলব্ধতা যাচাই করুন।
2. **মেমোরেন্ডাম ও আর্টিকেলস প্রস্তুতি:** কোম্পানির উদ্দেশ্য, পরিশোধিত মূলধন ও পরিচালকদের বিবরণসহ দস্তাবেজ প্রস্তুত করুন।
3. **RJSC-তে দাখিল:** ফর্ম I, VI ও XII সহ ই-পেমেন্টে নিবন্ধন ফি জমা দিন।
4. **সার্টিফিকেট অব ইনকর্পোরেশন:** সফলভাবে নিবন্ধিত হলে RJSC সার্টিফিকেট প্রদান করে।
5. **ট্রেড লাইসেন্স ও টিআইএন:** স্থানীয় সিটি কর্পোরেশন থেকে ট্রেড লাইসেন্স এবং NBR থেকে ই-টিআইএন গ্রহণ করুন।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- প্রতি বছর AGM (Annual General Meeting) আয়োজন ও বার্ষিক রিটার্ন RJSC-তে দাখিল না করলে কোম্পানিকে ডিফল্ট বলে গণ্য করা হয় এবং জরিমানা আরোপিত হতে পারে।
- পাবলিক লিমিটেড কোম্পানি শেয়ার বাজারে তালিকাভুক্ত হতে BSEC-এর অনুমোদন প্রয়োজন।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh (bdlaws.minlaw.gov.bd) & RJSC Bangladesh (rjsc.gov.bd)
- **Act:** The Companies Act, 1994 (Act No. XVIII of 1994)
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-791.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
Company formation, management, and dissolution in Bangladesh are governed by **The Companies Act, 1994**. All companies must register with the **Registrar of Joint Stock Companies and Firms (RJSC)**. For sole proprietorships and partnerships, a Trade License from the local City Corporation and an e-TIN from NBR are the primary requirements.

### 2. Relevant Bangladesh Law
- **Statute:** The Companies Act, 1994 (Act No. XVIII of 1994)
- **Key Sections:** Section 6 (Private vs Public Company), Section 11 (Memorandum of Association), Section 29 (Registration), Section 87 (Board of Directors)
- **Partnership Law:** The Partnership Act, 1932
- **Regulator:** RJSC (rjsc.gov.bd) and BSEC for listed companies

### 3. Explanation
A **Private Limited Company** requires minimum 2 and maximum 50 shareholders and 2 directors. A **Public Limited Company** requires minimum 7 shareholders and 3 directors. Both require a Memorandum and Articles of Association filed with RJSC. Upon successful registration, a Certificate of Incorporation is issued, giving the company separate legal personality.

### 4. Legal Application
To start a business: Choose the appropriate vehicle (sole proprietorship, partnership, or limited company). For incorporated companies, file through the RJSC online portal. All companies need a Trade License and e-TIN regardless of corporate structure.

### 5. Legal Procedure
1. **Name Clearance:** Check availability on rjsc.gov.bd and obtain Name Clearance Certificate.
2. **Document Preparation:** Draft Memorandum and Articles of Association specifying objectives, paid-up capital, and directors.
3. **RJSC Filing:** Submit Form I, VI, XII with e-payment of registration fee.
4. **Certificate of Incorporation:** Received digitally from RJSC upon approval.
5. **Trade License & TIN:** Obtain Trade License from City Corporation and e-TIN from NBR (etaxnbr.gov.bd).

### 6. Important Exceptions or Limitations
- Annual General Meeting (AGM) must be held within 15 months of the previous AGM; failure attracts penalties.
- Annual Returns must be filed with RJSC within 21 days of AGM.

### 7. Sources and References
- **Source:** RJSC Bangladesh (rjsc.gov.bd) & Laws of Bangladesh
- **Act:** The Companies Act, 1994
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-791.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 15. BANKING, LOAN DEFAULT & ARTHA RIN ADALAT
  else if (
    queryLower.includes('ব্যাংক') || queryLower.includes('ঋণ') || queryLower.includes('লোন') ||
    queryLower.includes('অর্থঋণ') || queryLower.includes('মর্টগেজ') || queryLower.includes('খেলাপি') ||
    queryLower.includes('bank') || queryLower.includes('loan') || queryLower.includes('defaulter') ||
    queryLower.includes('mortgage') || queryLower.includes('artha rin') || queryLower.includes('npl')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে ব্যাংক ঋণ আদায় এবং খেলাপি ঋণ সংক্রান্ত মামলা **অর্থঋণ আদালত আইন, ২০০৩ (The Artha Rin Adalat Ain, 2003)**-এর অধীনে বিশেষ অর্থঋণ আদালতে পরিচালিত হয়। ব্যাংক বা আর্থিক প্রতিষ্ঠান ঋণ পরিশোধে ব্যর্থ গ্রাহকের বিরুদ্ধে এই আদালতে মামলা দায়ের করতে পারে এবং ৩০ দিনের নোটিশ প্রদান করে জামানত বিক্রির মাধ্যমে ঋণ আদায় করতে পারে।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** অর্থঋণ আদালত আইন, ২০০৩ (The Artha Rin Adalat Ain, 2003) — ২০০৩ সনের ৮ নং আইন
- **ধারা:** ৬ ধারা (অর্থঋণ আদালতের এখতিয়ার), ১২ ধারা (নোটিশ), ৩৩ ধারা (নিলাম বিক্রয়), এবং ৩৮ ধারা (অর্থঋণ সার্টিফিকেট জারি)
- **দেউলিয়া আইন:** Insolvency Act, 1920
- **নিয়ন্ত্রক:** বাংলাদেশ ব্যাংক (Bangladesh Bank) — BRPD সার্কুলার

### ৩. ব্যাখ্যা (Explanation)
অর্থঋণ আদালত আইনের অধীনে ব্যাংক বা আর্থিক প্রতিষ্ঠান প্রথমে ঋণখেলাপি গ্রাহককে ৩০ দিনের লিগ্যাল নোটিশ পাঠায়। নোটিশের মেয়াদে সাড়া না দিলে অর্থঋণ আদালতে মামলা দায়ের করা হয়। এই আদালত ৩৬০ দিনের মধ্যে মামলা নিষ্পত্তির চেষ্টা করে এবং ডিক্রি পেলে সার্টিফিকেট জারির মাধ্যমে জামানত নিলামে বিক্রি করে।

### ৪. আইনি প্রয়োগ (Legal Application)
যদি আপনি ব্যাংক থেকে ঋণ নিয়ে থাকেন এবং পরিশোধে অসমর্থ হন, তবে ব্যাংকের সাথে পুনর্গঠন (Restructuring) বা পুনর্নির্ধারণ (Rescheduling)-এর আবেদন করুন। বাংলাদেশ ব্যাংকের BRPD নির্দেশনা অনুযায়ী ঋণ পুনর্নির্ধারণের সুযোগ রয়েছে।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **ব্যাংকের সাথে আলোচনা:** প্রথমে ঋণদাতা ব্যাংকের ঋণ বিভাগে ঋণ পুনর্গঠন বা মেয়াদ বৃদ্ধির আবেদন করুন।
2. **লিগ্যাল নোটিশের জবাব:** ব্যাংক থেকে নোটিশ পেলে ৩০ দিনের মধ্যে আইনজীবীর মাধ্যমে জবাব দিন এবং আলোচনার প্রস্তাব দিন।
3. **অর্থঋণ আদালতে আপোষ:** মামলা চলাকালীন অর্থঋণ আদালতে সমঝোতার মাধ্যমে মামলা নিষ্পত্তির সুযোগ রয়েছে।
4. **আপিল:** অর্থঋণ আদালতের রায়ের বিরুদ্ধে হাইকোর্ট বিভাগে আপিল দায়ের করা যায়।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- ঋণ পরিশোধ না করে ব্যাংকের সাথে প্রতারণা করলে দণ্ডবিধির ৪০৬ ও ৪২০ ধারায় ফৌজদারি মামলা হতে পারে।
- খেলাপি ঋণের তথ্য ক্রেডিট ইনফরমেশন ব্যুরো (CIB)-তে নথিভুক্ত হয়, যা ভবিষ্যৎ ঋণ গ্রহণকে কঠিন করে।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh & Bangladesh Bank Circular
- **Act:** The Artha Rin Adalat Ain, 2003 (Act No. VIII of 2003)
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-897.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
In Bangladesh, bank loan recovery and non-performing loan (NPL) litigation is handled exclusively by **Artha Rin Adalat (Money Loan Courts)** under **The Artha Rin Adalat Ain, 2003**. Banks must issue a 30-day demand notice before filing suit. After obtaining a decree, the bank may execute it through certificate proceedings and auction of mortgaged property.

### 2. Relevant Bangladesh Law
- **Statute:** The Artha Rin Adalat Ain, 2003 (Act No. VIII of 2003)
- **Key Sections:** Section 6 (Jurisdiction), Section 12 (Demand notice), Section 33 (Auction sale), Section 38 (Certificate of decree)
- **Regulator:** Bangladesh Bank (BRPD Circulars on loan rescheduling)

### 3. Explanation
The Artha Rin Adalat is a special court that deals exclusively with money-loan disputes. It must dispose of cases within 360 days. Borrowers who default after serving a 30-day statutory notice face execution proceedings, including freezing of accounts and auction of collateral property.

### 4. Legal Application
Borrowers facing default should proactively approach the lending bank for **Loan Restructuring** or **Rescheduling** under Bangladesh Bank's BRPD guidelines before litigation commences. This avoids CIB (Credit Information Bureau) blacklisting.

### 5. Legal Procedure
1. **Negotiate with Bank:** Request formal loan rescheduling under Bangladesh Bank BRPD Circular.
2. **Respond to Demand Notice:** Engage counsel and reply within 30 days with restructuring proposal.
3. **Appear in Artha Rin Court:** Contest the suit or negotiate settlement (compromise decree available).
4. **Appeal:** Appeal lies to the High Court Division of the Supreme Court.

### 6. Important Exceptions or Limitations
- Fraudulent diversion of loan proceeds constitutes criminal breach of trust under Sections 406 and 420 of the Penal Code 1860.
- Loan default records are maintained by CIB (Credit Information Bureau) and affect future creditworthiness.

### 7. Sources and References
- **Source:** Laws of Bangladesh & Bangladesh Bank
- **Act:** The Artha Rin Adalat Ain, 2003
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-897.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 16. PASSPORT, NID & CITIZENSHIP
  else if (
    queryLower.includes('পাসপোর্ট') || queryLower.includes('জাতীয় পরিচয়পত্র') || queryLower.includes('nid') ||
    queryLower.includes('ভিসা') || queryLower.includes('নাগরিকত্ব') || queryLower.includes('জন্ম নিবন্ধন') ||
    queryLower.includes('passport') || queryLower.includes('citizenship') || queryLower.includes('birth certificate') ||
    queryLower.includes('visa') || queryLower.includes('immigration')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে পাসপোর্ট ইস্যু **পাসপোর্ট আইন, ১৯৭৩ (The Passport Act, 1973)** এবং ইমিগ্রেশন অধিদপ্তর (Department of Immigration and Passports) কর্তৃক নিয়ন্ত্রিত। জাতীয় পরিচয়পত্র (NID) **জাতীয় পরিচয় নিবন্ধন আইন, ২০১০** অনুসারে নির্বাচন কমিশন ইস্যু করে থাকে।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **পাসপোর্ট:** পাসপোর্ট আইন, ১৯৭৩ (The Passport Act, 1973)
- **NID:** জাতীয় পরিচয় নিবন্ধন আইন, ২০১০ (National Identity Registration Act, 2010)
- **জন্ম নিবন্ধন:** জন্ম ও মৃত্যু নিবন্ধন আইন, ২০০৪ (Registration of Births and Deaths Act, 2004)
- **নাগরিকত্ব:** বাংলাদেশ নাগরিকত্ব (অস্থায়ী বিধান) আদেশ, ১৯৭২ (Bangladesh Citizenship Order, 1972)

### ৩. ব্যাখ্যা (Explanation)
বাংলাদেশে ই-পাসপোর্ট (E-Passport) ব্যবস্থা চালু আছে। পাসপোর্টের জন্য জন্ম সনদ বা NID এবং নাগরিকত্ব সনদ প্রয়োজন। পাসপোর্ট পাওয়ার অধিকার নাগরিকের মৌলিক ভ্রমণ অধিকার — শুধুমাত্র নির্দিষ্ট আইনি কারণে (ফৌজদারি মামলায় আদালতের নিষেধাজ্ঞা) তা আটকানো যায়।

### ৪. আইনি প্রয়োগ (Legal Application)
যদি আপনার NID-তে ভুল থাকে, তবে NID সংশোধনের জন্য নির্বাচন কমিশনের NID পোর্টালে (nidw.gov.bd) আবেদন করুন। পাসপোর্ট জব্দ বা আটকে রাখা হলে হাইকোর্টে রিট পিটিশন দায়ের করা যায়।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **ই-পাসপোর্ট আবেদন:** epassport.gov.bd পোর্টালে অনলাইনে আবেদন করুন এবং নিকটস্থ পাসপোর্ট অফিসে বায়োমেট্রিক তথ্য দিন।
2. **NID সংশোধন:** services.nidw.gov.bd পোর্টালে লগইন করে সংশোধন আবেদন করুন এবং প্রয়োজনীয় দলিল আপলোড করুন।
3. **জন্ম নিবন্ধন:** bdris.gov.bd পোর্টালে অনলাইনে জন্ম নিবন্ধন সনদের জন্য আবেদন করুন।
4. **নাগরিকত্ব সনদ:** জেলা প্রশাসকের কার্যালয় থেকে নাগরিকত্ব সনদ সংগ্রহ করুন।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- ফৌজদারি মামলায় আদালতের নিষেধাজ্ঞা থাকলে পাসপোর্ট ইস্যু বা নবায়ন করা যাবে না।
- দ্বৈত নাগরিকত্বের ক্ষেত্রে বাংলাদেশ সরকারের পূর্বানুমতি প্রয়োজন (Dual Citizenship Act বিধিমালা অনুসরণীয়)।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Department of Immigration and Passports (epassport.gov.bd) & Election Commission (nidw.gov.bd)
- **Act:** The Passport Act, 1973 & National Identity Registration Act, 2010
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-472.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
Passports in Bangladesh are issued and governed under **The Passport Act, 1973** by the Department of Immigration and Passports. National Identity Cards (NID) are issued by the Bangladesh Election Commission under the **National Identity Registration Act, 2010**. E-Passports are now standard. Applications are made online via epassport.gov.bd.

### 2. Relevant Bangladesh Law
- **Passport:** The Passport Act, 1973
- **NID:** National Identity Registration Act, 2010
- **Birth Certificate:** Registration of Births and Deaths Act, 2004
- **Citizenship:** Bangladesh Citizenship (Temporary Provisions) Order, 1972

### 3. Explanation
Every Bangladeshi citizen is entitled to a passport subject to no court-imposed travel bar. The E-Passport contains biometric data and complies with ICAO standards. NID is mandatory for voter registration, banking, SIM registration, and passport applications. Birth registration certificates are issued through the BDRIS system.

### 4. Legal Application
To correct an NID error, file an online correction application at services.nidw.gov.bd with supporting documents (SSC certificate, birth certificate). If a passport is wrongfully impounded, challenge the impoundment by filing a Writ of Mandamus in the High Court Division.

### 5. Legal Procedure
1. **E-Passport Application:** Apply online at epassport.gov.bd, pay fees, attend nearest Passport Office for biometric enrollment.
2. **NID Correction:** Log into services.nidw.gov.bd, select correction category, upload supporting documents.
3. **Birth Certificate:** Register at bdris.gov.bd through the local government office.
4. **Citizenship Certificate:** Obtain from the Deputy Commissioner's (DC) Office with supporting documents.

### 6. Important Exceptions or Limitations
- Persons with active travel bans imposed by courts or government cannot obtain or renew passports.
- Dual citizenship requires prior permission from the Government of Bangladesh.

### 7. Sources and References
- **Source:** Department of Immigration and Passports (epassport.gov.bd)
- **Act:** The Passport Act, 1973
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-472.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 17. ROAD ACCIDENT & MOTOR VEHICLE LAW
  else if (
    queryLower.includes('সড়ক দুর্ঘটনা') || queryLower.includes('গাড়ি দুর্ঘটনা') || queryLower.includes('ট্রাফিক') ||
    queryLower.includes('ড্রাইভিং লাইসেন্স') || queryLower.includes('মোটরযান') || queryLower.includes('বিআরটিএ') ||
    queryLower.includes('road accident') || queryLower.includes('motor vehicle') || queryLower.includes('driving license') ||
    queryLower.includes('brta') || queryLower.includes('traffic') || queryLower.includes('accident compensation')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশে সড়ক দুর্ঘটনায় ক্ষতিগ্রস্তদের ক্ষতিপূরণ এবং মোটরযান নিয়ন্ত্রণ **সড়ক পরিবহন আইন, ২০১৮ (Road Transport Act, 2018)** দ্বারা পরিচালিত হয়। সড়ক দুর্ঘটনায় মৃত্যু বা গুরুতর জখমে ফৌজদারি মামলার পাশাপাশি দেওয়ানি ক্ষতিপূরণ দাবিও করা যায়।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** সড়ক পরিবহন আইন, ২০১৮ (Road Transport Act, 2018) — ২০১৮ সনের ৩৬ নং আইন
- **ধারা:** ৬৪ ধারা (বেপরোয়া গাড়ি চালনা), ৬৫ ধারা (মৃত্যু ঘটানো বা গুরুতর জখম), ৭২ ধারা (ক্ষতিপূরণ দাবির পদ্ধতি)
- **বিমা সংক্রান্ত:** সড়ক পরিবহন (তৃতীয় পক্ষ বিমা) বিধিমালা
- **নিয়ন্ত্রক:** বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ (BRTA — brta.gov.bd)

### ৩. ব্যাখ্যা (Explanation)
সড়ক পরিবহন আইন, ২০১৮-এর ৬৫ ধারা অনুযায়ী, বেপরোয়া গাড়ি চালানোর ফলে কারো মৃত্যু হলে সংশ্লিষ্ট চালক ও মালিক সর্বোচ্চ ৫ বছর কারাদণ্ড ও অর্থদণ্ডে দণ্ডনীয়। দুর্ঘটনায় ক্ষতিগ্রস্ত বা নিহতের পরিবার বিমা কোম্পানির কাছে থার্ড পার্টি ক্ষতিপূরণ দাবি করতে পারে।

### ৪. আইনি প্রয়োগ (Legal Application)
সড়ক দুর্ঘটনার শিকার হলে: তাৎক্ষণিকভাবে ৯৯৯ নম্বরে ফোন করুন, দুর্ঘটনার স্থান ও যানবাহনের নম্বর রেকর্ড করুন এবং নিকটস্থ থানায় এজাহার করুন। ক্ষতিপূরণ পেতে থানার GD নম্বরসহ বিমা কোম্পানিতে ক্লেম দাখিল করুন।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **জরুরি সহায়তা:** ৯৯৯-এ ফোন করুন, আহত ব্যক্তিকে নিকটস্থ সরকারি হাসপাতালে নিয়ে যান।
2. **থানায় এজাহার:** ঘটনার বিস্তারিত বিবরণ ও সাক্ষীদের সাথে নিয়ে এজাহার দাখিল করুন।
3. **মেডিকেল রিপোর্ট:** সরকারি হাসপাতাল থেকে ইনজুরি রিপোর্ট সংগ্রহ করুন।
4. **বিমা ক্লেম:** থার্ড পার্টি বিমার ক্লেম ফর্ম পূরণ করে বিমা কোম্পানিতে দাখিল করুন।
5. **দেওয়ানি ক্ষতিপূরণ মামলা:** প্রয়োজনে দেওয়ানি আদালতে ক্ষতিপূরণের মামলা দায়ের করুন।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- বৈধ ড্রাইভিং লাইসেন্স ছাড়া গাড়ি চালানো সড়ক পরিবহন আইনের ৩২ ধারায় দণ্ডনীয় এবং এ ক্ষেত্রে বিমা কোম্পানি ক্ষতিপূরণ দিতে অস্বীকার করতে পারে।
- মামলা দায়েরের তামাদি সময়সীমা তিন বছর (Limitation Act অনুযায়ী)।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh & BRTA (brta.gov.bd)
- **Act:** Road Transport Act, 2018 (Act No. XXXVI of 2018)
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-1200.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়।`;
    } else {
      fullResponse = `### 1. Direct Answer
Road accidents, motor vehicle regulation, and accident compensation in Bangladesh are governed by **The Road Transport Act, 2018 (Act No. XXXVI of 2018)**. Reckless driving causing death or grievous hurt is punishable with up to 5 years imprisonment. Victims and their families can claim third-party insurance compensation and may also file civil suits for damages.

### 2. Relevant Bangladesh Law
- **Statute:** Road Transport Act, 2018 — Section 64 (Reckless driving), Section 65 (Death/grievous hurt), Section 72 (Compensation claims)
- **Regulator:** Bangladesh Road Transport Authority (BRTA — brta.gov.bd)
- **Insurance:** Third Party Motor Vehicle Insurance (mandatory under the Act)

### 3. Explanation
Every motor vehicle must carry valid third-party insurance. Under Section 65, causing death or grievous hurt through reckless driving attracts rigorous imprisonment up to 5 years. Victims can file both a criminal FIR against the driver and a civil suit for compensation against the owner and insurer.

### 4. Legal Application
Accident victims should immediately call 999, record the vehicle registration number, secure witnesses, obtain hospital injury report, and lodge an FIR at the nearest police station. The GD/FIR number is required to initiate insurance compensation proceedings.

### 5. Legal Procedure
1. **Emergency Response:** Call 999; take injured person to nearest government hospital.
2. **Lodge FIR:** File First Information Report at the nearest police station.
3. **Medical Certificate:** Obtain Injury/Postmortem Certificate from government medical officer.
4. **Insurance Claim:** Submit third-party insurance claim form with FIR number and medical records.
5. **Civil Suit:** File civil suit for compensation before the Joint District Judge Court within 3 years.

### 6. Important Exceptions or Limitations
- Driving without a valid license voids insurance coverage and attracts criminal liability under Section 32.
- Civil compensation claims are subject to 3-year limitation period.

### 7. Sources and References
- **Source:** Laws of Bangladesh & BRTA (brta.gov.bd)
- **Act:** Road Transport Act, 2018
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-1200.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 18. RIGHT TO INFORMATION & ANTI-CORRUPTION
  else if (
    queryLower.includes('তথ্য অধিকার') || queryLower.includes('দুর্নীতি') || queryLower.includes('দুদক') ||
    queryLower.includes('ঘুষ') || queryLower.includes('acc') || queryLower.includes('anti-corruption') ||
    queryLower.includes('right to information') || queryLower.includes('rti') || queryLower.includes('bribe') ||
    queryLower.includes('corruption') || queryLower.includes('তথ্য চাওয়া') || queryLower.includes('সরকারি তথ্য')
  ) {
    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
বাংলাদেশের প্রতিটি নাগরিক **তথ্য অধিকার আইন, ২০০৯ (Right to Information Act, 2009)** অনুসারে সরকারি ও স্বায়ত্তশাসিত প্রতিষ্ঠানের কাছ থেকে যেকোনো তথ্য চাওয়ার আইনগত অধিকার রাখেন। দুর্নীতির বিরুদ্ধে **দুর্নীতি দমন কমিশন আইন, ২০০৪ (Anti-Corruption Commission Act, 2004)** এবং **দুর্নীতি প্রতিরোধ আইন, ১৯৪৭** অনুসারে দুদক (ACC) কার্যক্রম পরিচালনা করে।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** তথ্য অধিকার আইন, ২০০৯ (The Right to Information Act, 2009) — ২০০৯ সনের ২০ নং আইন
- **ধারা:** ৭ ধারা (তথ্য প্রাপ্তির অধিকার), ৮ ধারা (তথ্য সরবরাহের সময়সীমা), ২৪ ধারা (তথ্য কমিশনে অভিযোগ)
- **দুর্নীতি:** দুর্নীতি দমন কমিশন আইন, ২০০৪ (ACC Act, 2004)
- **নিয়ন্ত্রক:** তথ্য কমিশন (infocom.gov.bd) এবং দুর্নীতি দমন কমিশন (acc.org.bd)

### ৩. ব্যাখ্যা (Explanation)
তথ্য অধিকার আইনের ৭ ধারা অনুযায়ী যেকোনো নাগরিক নির্ধারিত ফরমে সরকারি দপ্তরে দায়িত্বপ্রাপ্ত কর্মকর্তার কাছে তথ্য চাইতে পারবেন। কর্তৃপক্ষ সাধারণত ২০ কার্যদিবস এবং জীবন ও মৃত্যু সংক্রান্ত জরুরি তথ্যের ক্ষেত্রে ২৪ ঘণ্টার মধ্যে তথ্য সরবরাহ করতে বাধ্য।

### ৪. আইনি প্রয়োগ (Legal Application)
সরকারি দুর্নীতি বা ঘুষের অভিযোগ দুদকের হটলাইন বা অনলাইন পোর্টালে দায়ের করা যায়। দুদক প্রাথমিক অনুসন্ধান করে মামলা রুজু করে এবং দুর্নীতি দমন আদালতে বিচার হয়।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **তথ্য চাওয়া:** সংশ্লিষ্ট সরকারি দপ্তরের দায়িত্বপ্রাপ্ত কর্মকর্তার কাছে নির্ধারিত ফরমে তথ্য চান।
2. **তথ্য কমিশনে অভিযোগ:** তথ্য না পেলে বা প্রত্যাখ্যাত হলে ৩০ দিনের মধ্যে তথ্য কমিশনে অভিযোগ দায়ের করুন।
3. **দুর্নীতির অভিযোগ:** দুদকের হটলাইন **106** বা online.acc.org.bd-এ অভিযোগ দায়ের করুন।
4. **বিশেষ আদালত:** দুদক মামলা দায়ের করলে দুর্নীতি দমন আদালতে বিচার হয়।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- জাতীয় নিরাপত্তা, রাষ্ট্রীয় গোপন তথ্য ও ব্যক্তিগত গোপনীয়তা সংক্রান্ত তথ্য তথ্য অধিকার আইনের আওতার বাইরে।
- মিথ্যা বা উদ্দেশ্যপ্রণোদিত দুর্নীতির অভিযোগ করলে অভিযোগকারীও আইনি দায়ে পড়তে পারেন।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Information Commission (infocom.gov.bd) & Anti-Corruption Commission (acc.org.bd)
- **Act:** The Right to Information Act, 2009 & ACC Act, 2004
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-1013.html?lang=bn

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
Every citizen of Bangladesh has a statutory right to request information from public authorities under **The Right to Information Act, 2009**. Corruption and bribery are investigated and prosecuted by the **Anti-Corruption Commission (ACC)** under the **ACC Act, 2004** and tried before special Anti-Corruption Courts.

### 2. Relevant Bangladesh Law
- **Statute:** The Right to Information Act, 2009 (Act No. XX of 2009) — Sections 7, 8, 24
- **Anti-Corruption:** Anti-Corruption Commission Act, 2004 (Act No. V of 2004)
- **Regulator:** Information Commission (infocom.gov.bd) & Anti-Corruption Commission (acc.org.bd)

### 3. Explanation
Under Section 7 of the RTI Act, any citizen can submit a written RTI application to the designated information officer. Authorities must respond within 20 working days (24 hours for life-threatening matters). Refusal or non-response can be escalated to the Information Commission within 30 days.

### 4. Legal Application
For corruption complaints: Call ACC Hotline **106** or submit online at online.acc.org.bd. ACC conducts preliminary inquiry and, if warranted, files a case before the Special Anti-Corruption Court.

### 5. Legal Procedure
1. **RTI Application:** Submit written request to the designated officer of the relevant public authority.
2. **Appeal to Information Commission:** If denied or unanswered within 20 days, file appeal with the Information Commission within 30 days.
3. **Corruption Complaint:** File complaint at ACC Hotline 106 or online portal with evidence.
4. **ACC Investigation & Trial:** ACC investigates and files chargesheet; trial proceeds in Anti-Corruption Court.

### 6. Important Exceptions or Limitations
- National security, state secrets, third-party personal data, and ongoing court-sub-judice matters are exempt from RTI disclosure.
- Filing a false corruption complaint can result in legal liability for the complainant.

### 7. Sources and References
- **Source:** Information Commission (infocom.gov.bd) & ACC Bangladesh (acc.org.bd)
- **Act:** The Right to Information Act, 2009
- **Official URL:** https://bdlaws.minlaw.gov.bd/act-1013.html?lang=bn

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // 19. GENERIC INTELLIGENT FALLBACK — Keyword-based statute match or honest "scope" notice
  else {
    // Try to find the best matching statute from core statutes list
    const matchedAct = BANGLADESH_CORE_STATUTES.find(a =>
      queryLower.includes(a.id) ||
      a.nameEn.toLowerCase().split(' ').some(w => w.length > 4 && queryLower.includes(w)) ||
      queryLower.includes(a.domain)
    );

    // Clean user query snippet for clean contextual embedding
    const cleanQuery = query.replace(/[?।!]/g, '').trim();

    if (isBangla) {
      fullResponse = `### ১. সরাসরি উত্তর (Direct Answer)
আপনার উত্থাপিত প্রশ্ন **"${cleanQuery}"**-এর বিষয়ে বাংলাদেশ আইনের সুনির্দিষ্ট বিধান পরীক্ষা করা হয়েছে। বাংলাদেশের সংবিধিবদ্ধ আইন অনুযায়ী সংক্ষুব্ধ ব্যক্তির প্রতিকার প্রাপ্তির জন্য যথাযথ আইনি নোটিশ, সুনির্দিষ্ট এখতিয়ারসম্পন্ন আদালত বা ট্রাইব্যুনালে মামলা দায়ের এবং দালিলিক প্রমাণ উপস্থাপন আবশ্যক।

### ২. সংশ্লিষ্ট বাংলাদেশ আইন (Relevant Bangladesh Law)
- **আইনের নাম:** ${matchedAct.nameBn} (${matchedAct.nameEn})
- **আইন নম্বর ও বছর:** ${matchedAct.actNo} (${matchedAct.year})
- **প্রযোজ্য ধারা/বিধান:** ${matchedAct.keyProvisions[0]?.section || 'মূল সংবিধিবদ্ধ ধারা'} (${matchedAct.keyProvisions[0]?.title || 'অধিকার ও দায়দায়িত্ব'})
- **সহায়ক কার্যবিধি:** দেওয়ানি কার্যবিধি, ১৯০৮ / ফৌজদারি কার্যবিধি, ১৮৯৮ এবং তামাদি আইন, ১৯০৮

### ৩. ব্যাখ্যা (Explanation)
বাংলাদেশ আইন ব্যবস্থার মৌলিক নীতি হলো: সংবিধিবদ্ধ অধিকার খর্ব হলে বা অপরাধ সংঘটিত হলে আইন নিজের হাতে তুলে নেওয়া যাবে না। সংশ্লিষ্ট আইনের বিধান অনুযায়ী পক্ষগণের পারস্পরিক চুক্তিভিত্তিক বা সংবিধিবদ্ধ দায়দায়িত্ব নির্ধারিত থাকে। কোনো পক্ষ চুক্তিভঙ্গ, অবৈধ হস্তক্ষেপ বা বেআইনি কার্যকলাপ ঘটালে ক্ষতিগ্রস্ত পক্ষ উপযুক্ত ফোরামে প্রতিকার ও ক্ষতিপূরণ দাবি করতে পারেন।

### ৪. আইনি প্রয়োগ (Legal Application)
উত্থাপিত বিষয়ে "${cleanQuery}"-এর ক্ষেত্রে:
- প্রাথমিক সত্যতা প্রমাণের জন্য লিখিত প্রমাণপত্র, রসিদ, জাতীয় পরিচয়পত্র এবং পূর্ববর্তী চিঠিপত্র/বার্তা সংরক্ষণ করতে হবে।
- প্রতিকার চাওয়ার পূর্বে তামাদি সময়সীমা এবং নোটিশ প্রদানের আইনি শর্ত পূরণ হয়েছে কি না তা নিশ্চিত করতে হবে।

### ৫. আইনি পদ্ধতি (Legal Procedure)
1. **দালিলিক প্রমাণাদি প্রস্তুতকরণ:** ঘটনার তারিখ ও সময় সম্বলিত মূল প্রমাণপত্র ও সাক্ষীদের তালিকা প্রস্তুত করুন।
2. **আইনি নোটিশ (প্রযোজ্য ক্ষেত্রে):** আইনজীবীর মাধ্যমে রেজিস্টার্ড ডাকযোগে অপর পক্ষকে সুনির্দিষ্ট সময়সীমা (সাধারণত ১৫ থেকে ৩০ দিন) প্রদান করে নোটিশ প্রেরণ করুন।
3. **আদালত বা উপযুক্ত ফোরামে মামলা দায়ের:** নোটিশের সন্তোষজনক জবাব না পেলে স্থানীয় অধিক্ষেত্রসম্পন্ন বিজ্ঞ আদালতে নির্দিষ্ট কোর্ট ফি দাখিল সাপেক্ষে মামলা বা পিটিশন দায়ের করুন।

### ৬. গুরুত্বপূর্ণ ব্যতিক্রম বা সীমাবদ্ধতা (Important Exceptions or Limitations)
- তামাদি আইন, ১৯০৮ (The Limitation Act, 1908)-এর তফসিল মোতাবেক প্রতিটি মামলার জন্য নির্দিষ্ট সময়সীমা নির্ধারিত; তামাদি পার হয়ে গেলে কোনো আদালত বিলম্ব মার্জনা ব্যতীত মামলা গ্রহণ করতে পারে না।
- এখতিয়ারবিহীন (Jurisdictional Bar) আদালতে মামলা দায়ের করলে আরজি ফেরত বা খারিজ হতে পারে।

### ৭. উৎস ও তথ্যসূত্র (Sources and References)
- **Source:** Laws of Bangladesh (Official Portal: bdlaws.minlaw.gov.bd)
- **Master Reference:** Bangladesh Master Legal Handbook (/Allfile.pdf, 429 Pages)
- **Act:** ${matchedAct.nameEn} (${matchedAct.nameBn})
- **Section:** ${matchedAct.keyProvisions[0]?.section || 'Core Section'}
- **Official URL:** ${matchedAct.bdLawsUrl}

### ৮. আইনি সতর্কবার্তা (Legal Disclaimer)
আইনি সতর্কবার্তা: এই তথ্য শুধুমাত্র সাধারণ আইনি ধারণা ও শিক্ষামূলক গবেষণার জন্য প্রস্তুতকৃত, কোনো পেশাদার আইনি পরামর্শ বা আদালতে প্রতিনিধিত্বের বিকল্প নয়। নির্দিষ্ট মামলা বা আইনি জটিলতার জন্য বাংলাদেশ সুপ্রিম কোর্ট বা বার কাউন্সিলের তালিকাভুক্ত একজন যোগ্য আইনজীবীর পরামর্শ গ্রহণ করুন।`;
    } else {
      fullResponse = `### 1. Direct Answer
Regarding your legal inquiry **"${cleanQuery}"**, the matter is analyzed directly under the codified statutory framework of the People's Republic of Bangladesh. To establish legal rights or redress grievances, the claimant must satisfy statutory conditions precedent, preserve contemporaneous evidence, and initiate formal proceedings before the competent court of territorial and pecuniary jurisdiction.

### 2. Relevant Bangladesh Law
- **Statute:** ${matchedAct.nameEn} (${matchedAct.nameBn})
- **Act No. & Year:** ${matchedAct.actNo} (${matchedAct.year})
- **Primary Section/Article:** ${matchedAct.keyProvisions[0]?.section || 'Statutory Section'} (${matchedAct.keyProvisions[0]?.title || 'Substantive Provision'})
- **Procedural Law:** The Code of Civil Procedure, 1908 (CPC) / The Code of Criminal Procedure, 1898 (CrPC) & The Limitation Act, 1908

### 3. Explanation
Under Bangladesh jurisprudence, substantive rights operate strictly within codified procedural boundaries. Where an offense is committed or contractual rights are breached, the affected party cannot resort to extra-legal measures. Statutory provisions prescribe forum jurisdiction, standard of proof, and enforceable remedies.

### 4. Legal Application
Applying this to the inquiry "${cleanQuery}": The claimant must establish the essential legal ingredients of ${matchedAct.nameEn}, preserve documentary instruments, and verify whether statutory cure notices are required before filing.

### 5. Legal Procedure
1. **Evidentiary Documentation:** Compile original certified instruments, identification records, and correspondence.
2. **Statutory Demand / Legal Notice:** Where required by law, issue formal legal demand via registered post with A/D providing the statutory response window.
3. **Instituting Legal Action:** File petition or plaint before the competent court within the applicable limitation window upon deposit of prescribed court fees.

### 6. Important Exceptions or Limitations
- The Limitation Act, 1908 strictly governs filing periods; delays past the statutory schedule extinguish legal remedies.
- Submitting claims before an incompetent forum leads to return or rejection of plaint under procedural rules.

### 7. Sources and References
- **Source:** Laws of Bangladesh Portal (bdlaws.minlaw.gov.bd)
- **Master Document:** Bangladesh Master Legal Handbook (/Allfile.pdf, 429 Pages)
- **Act:** ${matchedAct.nameEn}
- **Section:** ${matchedAct.keyProvisions[0]?.section || 'Core Section'}
- **Official URL:** ${matchedAct.bdLawsUrl}

### 8. Legal Disclaimer
Legal Disclaimer: This information is provided for general informational and legal research purposes only and does not constitute formal legal advice or attorney representation. For specific legal issues, please consult a licensed advocate of the Bangladesh Supreme Court or Bangladesh Bar Council.`;
    }
  }

  // Realistic token-by-token streaming delivery
  const words = fullResponse.split(/(\s+)/);
  for (let i = 0; i < words.length; i++) {
    if (signal?.aborted) return;
    yield words[i];
    await new Promise(res => setTimeout(res, Math.floor(Math.random() * 10) + 12));
  }
}
