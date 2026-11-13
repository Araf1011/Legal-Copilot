// Client for the FastAPI backend (CrewAI agents + Groq + RAG).
// Default: relative URLs, so Vite's dev proxy forwards /api to port 8000.
// Set VITE_API_URL only if the backend is hosted somewhere else.
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
      `Cannot reach the legal backend${API_BASE ? ' at ' + API_BASE : ''}. Start it with: cd backend && uvicorn main:app --reload (port 8000)`
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

export function fetchHealth(signal) {
  return request('/api/health', { signal });
}

export function askLegalCopilot(query, signal) {
  return request('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    signal,
  });
}

// Reveals the finished answer progressively for the chat UI.
export async function* streamAIResponse({ query, signal }) {
  const data = await askLegalCopilot(query, signal);
  const parts = (data.response || '').split(/(\s+)/);
  for (const part of parts) {
    if (signal?.aborted) return;
    yield part;
    await new Promise((r) => setTimeout(r, 6));
  }
}