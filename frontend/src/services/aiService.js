// Real-time AI Service for Legal Copilot
// Connects to FastAPI Backend (CrewAI + Groq + RAG) with automatic fallback to Google Gemini Direct API

export const API_BASE = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');

export class BackendError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'BackendError';
    this.status = status;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, options);
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new BackendError(
      `Cannot reach the legal backend${API_BASE ? ' at ' + API_BASE : ''}. Start it with:\ncd backend && uvicorn main:app --reload (port 8000)`
    );
  }
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
    } catch (_) { /* non-JSON error body */ }
    throw new BackendError(detail || `Backend returned HTTP ${res.status}`, res.status);
  }
  return res.json();
}

// Fetch live backend health (CrewAI + Groq + RAG status)
export function fetchHealth(signal) {
  return request('/api/health', { signal });
}

// Send query to the FastAPI Multi-Agent RAG backend
export function askLegalCopilot(query, signal) {
  return request('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    signal,
  });
}

// Direct Google Gemini fallback if the Python backend is offline
async function* streamGeminiFallback({ query, contract, apiKey, signal }) {
  const targetModel = 'gemini-flash-lite-latest';
  const contractContext = contract ? `
Target Contract Context:
- Document Title: ${contract.title || 'Enterprise Commercial Agreement'}
- Governing Law: ${contract.governingLaw || 'Delaware, USA / Bangladesh Law'}
- Parties Involved: ${contract.parties || 'Disclosed Enterprise Counterparties'}
- Clauses: ${JSON.stringify((contract.clauses || []).map(c => ({ section: c.section, title: c.title, text: c.text, issue: c.issue })))}
` : '';

  const systemInstruction = `You are Legal Copilot, an elite AI attorney and contract intelligence agent fine-tuned on corporate law, commercial negotiation, Delaware Chancery precedents, Bangladesh statutes, and regulatory compliance.
${contractContext}

Instructions:
- Provide structured, authoritative, concise, and plain-English/Bangla answers.
- When reviewing contracts, cite specific sections (e.g. [Section 8.1]) and provide balanced market-standard counter-proposals.
- If asked about Bangladesh law or general statutes, cite the relevant Act and Section accurately.
- Use clean Markdown: bold section titles (**Title**), bullet lists (•), and callout blockquotes (> *Key Takeaway*).`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:streamGenerateContent?key=${apiKey}&alt=sse`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: query }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048
      }
    }),
    signal
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

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
          if (chunk) yield chunk;
        } catch (e) {
          // Ignore partial JSON
        }
      }
    }
  }
}

// Unified streaming AI response generator:
// 1. Tries FastAPI backend (CrewAI + Groq + RAG)
// 2. Falls back to Gemini Direct if backend is down but key is available
export async function* streamAIResponse({ 
  query, 
  contract, 
  apiKey = null, 
  model = 'groq-llama-3.3-70b',
  signal,
  onMeta
}) {
  // First attempt: Connect to the FastAPI backend (CrewAI + Groq + RAG)
  try {
    const data = await askLegalCopilot(query, signal);
    
    // Provide backend response metadata (sources, warnings, pipeline steps)
    if (onMeta) {
      onMeta({
        sources: data.sources || [],
        verified: data.verified,
        pipeline_steps: data.pipeline_steps || [],
        warnings: data.warnings || [],
        unsupported_citations: data.unsupported_citations || []
      });
    }

    // Progressive streaming reveal
    const fullText = data.response || '';
    const parts = fullText.split(/(\s+)/);
    for (const part of parts) {
      if (signal?.aborted) return;
      yield part;
      await new Promise(r => setTimeout(r, 8));
    }
    return;
  } catch (err) {
    if (err.name === 'AbortError') return;

    // Backend is down: check if Gemini fallback key is available
    const activeKey = (apiKey && apiKey.trim().length > 10)
      ? apiKey.trim()
      : (import.meta.env?.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' ? localStorage.getItem('legal_copilot_gemini_key') : '') || '').trim();

    if (activeKey && activeKey.length > 10) {
      if (onMeta) {
        onMeta({
          warnings: ["FastAPI Backend offline. Seamlessly answered via Google Gemini Live fallback. To start CrewAI + RAG backend: cd backend && python -m uvicorn main:app --reload"]
        });
      }
      yield* streamGeminiFallback({ query, contract, apiKey: activeKey, signal });
      return;
    }

    // If neither backend nor Gemini key is available, rethrow with friendly message
    throw err;
  }
}
