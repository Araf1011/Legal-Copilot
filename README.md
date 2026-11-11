# Legal Copilot ⚖️🤖

> An AI-powered legal assistant web application for commercial contract review, drafting, risk scoring, and real-time redlining.

Built with a clean editorial design language inspired by modern AI agent interfaces (light mode, soft teal gradients, and floating prompt docks).

---

## ✨ Features

- **Real-Time AI Streaming**: Word-by-word streaming generation powered by Google Gemini (with graceful simulated token fallback).
- **Interactive Contract Audit Workbench**: Analyzes commercial agreements, flags high-risk clauses (liability caps, indemnities, unilateral renewals), and provides risk scores.
- **Clause Drafting Studio**: Parameterized clause drafting with adjustable negotiation stances (*Pro-Buyer*, *Balanced*, *Pro-Vendor*).
- **Redlines & Diff Comparison**: Side-by-side and inline redline comparisons with one-click clause adoption.
- **Statutory & Compliance Checking**: Cross-benchmarking against Delaware UCC, California law, EU GDPR (Article 28), and SOC 2 Type II standards.
- **Voice In & Voice Out**: Native browser speech recognition (`webkitSpeechRecognition`) for voice queries and speech synthesis (`speechSynthesis`) for read-aloud.
- **Dynamic ChatGPT-Style Sidebar**: Search chats, pin important legal threads, and switch between active agreements.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Araf1011/Legal-Copilot.git
   cd Legal-Copilot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key (optional; get a free key from [Google AI Studio](https://aistudio.google.com/)):
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **AI Integration**: Google Generative AI (Gemini Flash & Pro) SSE Streaming

---

## 📄 License
MIT License.
