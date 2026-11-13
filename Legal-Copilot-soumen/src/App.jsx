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
import { INITIAL_DEMO_SESSIONS } from './data/bangladeshLaws';

export default function App() {
  const [contracts, setContracts] = useState(SAMPLE_CONTRACTS);
  const [currentContract, setCurrentContract] = useState(SAMPLE_CONTRACTS[0]);
  const [viewMode, setViewMode] = useState('home'); // 'home', 'chat', 'audit', 'draft', 'compare', 'compliance'
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedModel, setSelectedModel] = useState('groq-llama-3.3-70b');

  // Dynamic user chat sessions with initial Bangladesh demo sessions
  const [sessions, setSessions] = useState(INITIAL_DEMO_SESSIONS);
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
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
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
