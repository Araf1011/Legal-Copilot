import React, { useState } from 'react';
import ChatGPTSidebar from './components/ChatGPTSidebar';
import WhizzyTopBar from './components/WhizzyTopBar';
import WhizzyHomeView from './components/WhizzyHomeView';
import WhizzyChatView from './components/WhizzyChatView';
import WhizzyInspectorDrawer from './components/WhizzyInspectorDrawer';
import ContractReview from './components/ContractReview';
import ClauseGenerator from './components/ClauseGenerator';
import ContractComparison from './components/ContractComparison';
import ComplianceChecker from './components/ComplianceChecker';
import UploadModal from './components/UploadModal';
import AuditReportModal from './components/AuditReportModal';
import { SAMPLE_CONTRACTS } from './data/sampleContracts';

export default function App() {
  const [contracts, setContracts] = useState(SAMPLE_CONTRACTS);
  const [currentContract, setCurrentContract] = useState(SAMPLE_CONTRACTS[0]);
  const [viewMode, setViewMode] = useState('home'); // 'home', 'chat', 'audit', 'draft', 'compare', 'compliance'
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedModel, setSelectedModel] = useState('Legal-Gemini 2.5 Pro');

  // Dynamic user chat sessions (Zero hardcoded chats)
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Right Inspector drawer toggle
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const activeSession = sessions.find(s => s.id === currentSessionId) || sessions[0] || null;

  // Start a fresh new chat
  const handleNewChat = () => {
    setCurrentSessionId(null);
    setViewMode('home');
    setActiveTab('chat');
  };

  // Select a chat from recent/pinned list
  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setViewMode('chat');
    setActiveTab('chat');
  };

  // Toggle pin on a chat
  const handleTogglePin = (sessionId) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, isPinned: !s.isPinned };
      }
      return s;
    }));
  };

  // Delete a chat from session list
  const handleDeleteSession = (sessionId) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (currentSessionId === sessionId) {
        if (filtered.length > 0) {
          setCurrentSessionId(filtered[0].id);
        } else {
          setCurrentSessionId(null);
          setViewMode('home');
        }
      }
      return filtered;
    });
  };

  // AI response engine
  const createAiResponse = (query) => {
    const qLower = query.toLowerCase();
    if (qLower.includes('human') || qLower.includes('replace')) {
      return {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        timestamp: 'Today',
        leadText: 'AI can accelerate high-volume document review and redlining, but cannot replace legal judgment as a whole.',
        heading: "Here's a breakdown:",
        sections: [
          {
            title: 'What AI Legal Copilot replaces & automates:',
            items: [
              'Repetitive clause parsing: extracting indemnities, caps, and governing law instantly.',
              'Cross-statute benchmarking: flagging unconscionable clauses against Delaware UCC & FTC regulations.',
              'First-pass redline generation: drafting counter-language with balanced market standards.',
              'Risk scoring: surfacing asymmetric exposure in minutes rather than hours.'
            ]
          },
          {
            title: 'What human legal counsel uniquely provides:',
            items: [
              'Commercial negotiation judgment: deciding which business risks are acceptable to close a deal.',
              'Client empathy and strategic relationship management with opposing counsel.',
              'Ethical duties and fiduciary responsibility under state bar professional standards.',
              'High-stakes litigation and bespoke courtroom strategy.'
            ]
          }
        ],
        callout: 'Think of AI as a legal multiplier — not an attorney replacement.',
        conclusion: 'Legal Copilot handles the tedious mechanical review of 50-page agreements, freeing legal teams to focus on commercial negotiation strategy.'
      };
    } else if (qLower.includes('liabilit') || qLower.includes('indemn') || qLower.includes('trap')) {
      return {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        timestamp: 'Today',
        leadText: `I reviewed **${currentContract.title}** and identified two critical liability imbalances under Delaware Commercial Law:`,
        heading: "Critical Contract Risks:",
        sections: [
          {
            title: 'Key Vulnerabilities Detected:',
            items: [
              'Asymmetric Liability Cap (Section 8.1): Vendor liability is capped at merely 1 month fees, while excluding Gross Negligence and Data Breaches.',
              'Unilateral Indemnification (Section 9.3): Client indemnifies Vendor unconditionally even if defect arises from Vendor software.',
              'Predatory 36-Month Auto-Renewal (Section 3.2): 90-day certified postal mail requirement makes cancellation intentionally burdensome.'
            ]
          },
          {
            title: 'Statutory & Enforceability Assessment:',
            items: [
              'Delaware UCC § 2-719: Capping liability for gross negligence is disfavored and often held unconscionable.',
              'FTC Rule on Negative Option Subscriptions: Post-2024 standards mandate click-to-cancel parity.'
            ]
          }
        ],
        callout: 'Recommendation: Do not execute in present form. Counter-propose our 12-month mutual trailing fee cap.',
        conclusion: 'Would you like me to draft an assertive email to opposing counsel rejecting Section 8.1 and Section 3.2?',
        legalRedline: {
          clauseId: 'c-3',
          section: 'Section 8.1',
          original: 'IN NO EVENT SHALL VENDOR AGGREGATE LIABILITY EXCEED TOTAL AMOUNTS ACTUALLY PAID IN THE ONE (1) MONTH PRECEDING...',
          replacement: 'EACH PARTY\'S TOTAL AGGREGATE LIABILITY SHALL BE CAPPED AT TOTAL FEES PAID IN THE PRECEDING TWELVE (12) MONTHS. NEITHER PARTY SHALL BE CAPPED WITH RESPECT TO GROSS NEGLIGENCE OR DATA BREACHES.'
        }
      };
    } else {
      return {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        timestamp: 'Today',
        leadText: `Based on an analysis of **${currentContract.title}** and relevant jurisprudence:`,
        heading: "Detailed Findings:",
        sections: [
          {
            title: 'Primary Observations:',
            items: [
              `Contractual risk allocation directly impacts client obligations under ${currentContract.governingLaw}.`,
              'Commercial exposure can be balanced through reciprocal covenants and market-standard liability caps.'
            ]
          }
        ],
        callout: 'Legal Decision Intelligence: Standard enterprise clauses protect both parties symmetrically.',
        conclusion: 'I can generate a balanced clause or draft a counter-proposal redline for your negotiation.'
      };
    }
  };

  // Submit from Home view -> creates session dynamically with the user message
  const handleSendMessageFromHome = (promptText) => {
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: 'Today',
      text: promptText
    };

    const title = promptText.length > 36 ? promptText.slice(0, 34) + '...' : promptText;

    const newSession = {
      id: 'sess-' + Date.now(),
      title: title,
      timestamp: 'Just now',
      isPinned: false,
      contractId: currentContract.id,
      messages: [userMsg] // Streamed in real-time by WhizzyChatView
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setViewMode('chat');
  };

  // Submit inside active Chat view or commit streamed message
  const handleSendMessageInChat = (promptText, aiMsg, userMsg) => {
    if (!currentSessionId) {
      if (promptText) handleSendMessageFromHome(promptText);
      return;
    }

    setSessions(prev => {
      return prev.map(s => {
        if (s.id !== currentSessionId) return s;

        let nextMessages = [...s.messages];
        if (userMsg) {
          nextMessages.push(userMsg);
        }
        if (aiMsg) {
          nextMessages.push(aiMsg);
        }
        return {
          ...s,
          messages: nextMessages
        };
      });
    });
  };

  // Clause redline update
  const handleUpdateClause = (contractId, clauseId, updatedFields) => {
    setContracts(prevContracts => {
      return prevContracts.map(c => {
        if (c.id !== contractId) return c;

        const updatedClauses = c.clauses.map(clause => {
          if (clause.id === clauseId) {
            return { ...clause, ...updatedFields };
          }
          return clause;
        });

        const criticalCount = updatedClauses.filter(cl => cl.risk === 'critical').length;
        const highCount = updatedClauses.filter(cl => cl.risk === 'high').length;
        const mediumCount = updatedClauses.filter(cl => cl.risk === 'medium').length;
        
        let newScore = 100 - (criticalCount * 22 + highCount * 14 + mediumCount * 6);
        if (newScore < 20) newScore = 20;
        if (newScore > 98) newScore = 98;

        let newLevel = 'Low Risk (Balanced)';
        if (newScore < 50) newLevel = 'Critical Risk';
        else if (newScore < 75) newLevel = 'Moderate Risk';

        const updatedContract = {
          ...c,
          clauses: updatedClauses,
          riskScore: newScore,
          riskLevel: newLevel
        };

        if (currentContract.id === contractId) {
          setCurrentContract(updatedContract);
        }

        return updatedContract;
      });
    });
  };

  // Apply all redlines
  const handleApplyAllRedlines = () => {
    setContracts(prevContracts => {
      return prevContracts.map(c => {
        if (c.id !== currentContract.id) return c;

        const updatedClauses = c.clauses.map(clause => {
          if (clause.suggestedRedline) {
            return {
              ...clause,
              text: clause.suggestedRedline,
              risk: 'low',
              riskLabel: 'AI Mitigated',
              issue: 'Mitigated by Whizzy Legal Copilot: standard balanced enterprise terms.',
              isApplied: true
            };
          }
          return clause;
        });

        const updatedContract = {
          ...c,
          clauses: updatedClauses,
          riskScore: 92,
          riskLevel: 'Low Risk (Signatory Ready)',
          summary: 'All unilateral and predatory clauses have been redlined to conform to standard Delaware commercial practice. Signatory ready.'
        };

        setCurrentContract(updatedContract);
        return updatedContract;
      });
    });
  };

  // Insert generated clause
  const handleInsertClause = (newClause) => {
    setContracts(prev => {
      return prev.map(c => {
        if (c.id !== currentContract.id) return c;
        const updated = {
          ...c,
          clauses: [...c.clauses, newClause]
        };
        setCurrentContract(updated);
        return updated;
      });
    });
    setViewMode('audit');
  };

  // Add uploaded contract
  const handleAddContract = (newContract) => {
    setContracts(prev => [newContract, ...prev]);
    setCurrentContract(newContract);
    setViewMode('home');
  };

  // Navigate to chat with clause prompt prefilled
  const handleNavigateToChat = (clause) => {
    handleSendMessageFromHome(`Please analyze ${clause.section} (${clause.title}) and explain how we should negotiate this against opposing counsel: "${clause.issue}"`);
  };

  return (
    <div className="flex h-screen w-screen bg-white text-slate-800 font-sans overflow-hidden select-none">
      
      {/* Clean Light Sidebar (New Chat -> Search -> Pinned -> Recents) */}
      <ChatGPTSidebar 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onTogglePin={handleTogglePin}
        activeTab={viewMode}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        
        {/* Clean Header Bar */}
        <WhizzyTopBar 
          onOpenExport={() => setIsExportOpen(true)}
          onOpenUpload={() => setIsUploadOpen(true)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          currentContract={currentContract}
          contracts={contracts}
          setCurrentContract={setCurrentContract}
        />

          {/* Central Workspace View */}
          <div className="flex-1 flex overflow-hidden">
            
            <div className="flex-1 flex flex-col overflow-y-auto">
              
              {/* EXACT Whizzy Home Screen */}
              {viewMode === 'home' && (
                <WhizzyHomeView 
                  onSendMessage={handleSendMessageFromHome}
                  currentContract={currentContract}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                />
              )}

              {/* Whizzy Active Chat Conversation */}
              {viewMode === 'chat' && (
                <WhizzyChatView 
                  contract={currentContract}
                  session={activeSession || {
                    id: 'temp',
                    title: 'New Conversation',
                    messages: []
                  }}
                  onSendMessage={handleSendMessageInChat}
                  onApplyRedline={handleUpdateClause}
                  onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
                  isInspectorOpen={isInspectorOpen}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                />
              )}

              {/* Contract Audit Workbench */}
              {viewMode === 'audit' && (
                <div className="p-8 max-w-7xl mx-auto w-full">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setViewMode('home')}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                    >
                      ← Back to Whizzy Home
                    </button>
                    <div className="text-xs text-slate-400">
                      Active: <strong className="text-slate-800">{currentContract.title}</strong>
                    </div>
                  </div>
                  <ContractReview 
                    contract={currentContract}
                    onUpdateClause={handleUpdateClause}
                    onNavigateToChat={handleNavigateToChat}
                  />
                </div>
              )}

              {/* Drafting Studio */}
              {viewMode === 'draft' && (
                <div className="p-8 max-w-7xl mx-auto w-full">
                  <button
                    onClick={() => setViewMode('home')}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 mb-4"
                  >
                    ← Back to Whizzy Home
                  </button>
                  <ClauseGenerator 
                    onInsertClause={handleInsertClause}
                  />
                </div>
              )}

              {/* Redline & Diff */}
              {viewMode === 'compare' && (
                <div className="p-8 max-w-7xl mx-auto w-full">
                  <button
                    onClick={() => setViewMode('home')}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 mb-4"
                  >
                    ← Back to Whizzy Home
                  </button>
                  <ContractComparison 
                    contract={currentContract}
                    onApplyAllRedlines={handleApplyAllRedlines}
                  />
                </div>
              )}

              {/* Compliance Matrix */}
              {viewMode === 'compliance' && (
                <div className="p-8 max-w-7xl mx-auto w-full">
                  <button
                    onClick={() => setViewMode('home')}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 mb-4"
                  >
                    ← Back to Whizzy Home
                  </button>
                  <ComplianceChecker 
                    contract={currentContract}
                  />
                </div>
              )}

            </div>

            {/* Document Inspector Drawer (Toggleable) */}
            <WhizzyInspectorDrawer 
              isOpen={isInspectorOpen}
              onClose={() => setIsInspectorOpen(false)}
              contract={currentContract}
              onUpdateClause={handleUpdateClause}
            />

          </div>

        </div>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddContract={handleAddContract}
      />

      {/* Audit Report Modal */}
      <AuditReportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        contract={currentContract}
      />

    </div>
  );
}
