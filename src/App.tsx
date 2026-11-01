import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  FileText, 
  Users, 
  PhoneCall, 
  Sparkles, 
  MoreHorizontal,
  Wifi,
  Signal,
  Battery,
  AlertTriangle,
  User,
  CheckCircle,
  HelpCircle,
  MapPin,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';

import { Policy, VaultDocument, FamilyMember, ScreenId } from './types';
import { INITIAL_POLICIES, INITIAL_DOCUMENTS, INITIAL_FAMILY } from './data';

// Components imports
import { CompanionGuide } from './components/CompanionGuide';
import { KavachDashboard } from './components/KavachDashboard';
import { PolicyWallet } from './components/PolicyWallet';
import { SurrenderFlow } from './components/SurrenderFlow';
import { DocumentVault } from './components/DocumentVault';
import { ClaimEasy } from './components/ClaimEasy';
import { ExploreBuy } from './components/ExploreBuy';
import { FamilyHub } from './components/FamilyHub';
import { EmergencyAssistance } from './components/EmergencyAssistance';

export default function App() {
  // Global Shared States
  const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES);
  const [documents, setDocuments] = useState<VaultDocument[]>(INITIAL_DOCUMENTS);
  const [family, setFamily] = useState<FamilyMember[]>(INITIAL_FAMILY);
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [claimCount, setClaimCount] = useState<number>(0);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  
  // Expiry Simulation
  const [motorExpired, setMotorExpired] = useState<boolean>(false);

  // Simulation Logs
  const [logs, setLogs] = useState<Array<{ id: string; timestamp: string; message: string; type: 'info' | 'success' | 'warning' | 'action' }>>([]);

  // Live clock state for mobile status bar
  const [currentTime, setCurrentTime] = useState<string>('03:21 AM');

  // Trigger clock tick
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  // Set initial welcome logs
  useEffect(() => {
    addLog('Booted Kavach by IndusInd Simulator environment.', 'success');
    addLog('Savings Account AC/4921 bound successfully.', 'info');
    addLog('Active coverage assets verified with corporate ledger.', 'success');
  }, []);

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'action') => {
    const now = new Date();
    const stamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setLogs(prev => [
      { id: `${Date.now()}-${Math.random()}`, timestamp: stamp, message, type },
      ...prev.slice(0, 49) // Keep last 50 logs
    ]);
  };

  const handleNavigate = (screen: ScreenId) => {
    addLog(`Navigated simulator to: ${screen.toUpperCase()}`, 'action');
    setCurrentScreen(screen);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  // Reset all simulation states
  const handleResetAll = () => {
    setPolicies(INITIAL_POLICIES);
    setDocuments(INITIAL_DOCUMENTS);
    setFamily(INITIAL_FAMILY);
    setCurrentScreen('dashboard');
    setClaimCount(0);
    setMotorExpired(false);
    handleClearLogs();
    addLog('Reset all policies, documents, family details, and logs to pristine state.', 'warning');
  };

  // Toggle motor policy expiry
  const handleSimulateExpiryToggle = () => {
    const expired = !motorExpired;
    setMotorExpired(expired);

    setPolicies(prev => prev.map(p => {
      if (p.id === 'motor-indusind') {
        return {
          ...p,
          status: expired ? 'expired' : 'expiring',
          renewDate: expired ? 'Expired 2 days ago' : '03 Aug 2026'
        };
      }
      return p;
    }));

    addLog(
      expired 
        ? 'ALERT: Set Motor Insurance status to EXPIRED. Dashboard notification triggered.' 
        : 'Set Motor Insurance status to Expiring in 18 days.',
      expired ? 'warning' : 'info'
    );
  };

  // Trigger fast-forward to Step 4 of Life Surrender
  const handleTriggerFastSurrender = () => {
    setCurrentScreen('surrender');
    // We can directly simulate clicking through by letting SurrenderFlow take care of it or resetting step 
    // In our component, we can force-render step 4 by letting App control SurrenderFlow step
    addLog('SIMULATED OVERRIDE: Loaded Live Cancellation Tracker for Life Insurance.', 'success');
    // To trigger step 4 in SurrenderFlow, we can communicate state or let the SurrenderFlow check if life policy is already surrendered
    // We update life policy status to surrendered and let SurrenderFlow boot directly into step 4
    setPolicies(prev => prev.map(p => {
      if (p.id === 'life-indusind') {
        return { ...p, status: 'surrendered' };
      }
      return p;
    }));
    // We will ensure that our SurrenderFlow checks life policy status to show step 4 if already surrendered.
  };

  // Policy actions
  const handleAddPolicy = (newPolicy: Policy) => {
    setPolicies(prev => {
      // Avoid duplicate policies
      if (prev.some(p => p.name === newPolicy.name && p.status === 'active')) return prev;
      return [newPolicy, ...prev];
    });
  };

  const handleAddDocument = (newDoc: VaultDocument) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleUpdateFamilyCoverage = (memberId: string, policyName: string) => {
    setFamily(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          policiesCount: m.policiesCount + 1,
          policiesList: [...m.policiesList, policyName],
          hasCoverageIssue: false
        };
      }
      return m;
    }));
  };

  const handleRenewPolicy = (policyId: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId) {
        return {
          ...p,
          status: 'active',
          renewDate: '03 Aug 2027' // Extended 1 year
        };
      }
      return p;
    }));
    // Automatically auto-save renewal receipt PDF to Document Vault
    const newReceipt: VaultDocument = {
      id: `doc-renew-${Date.now()}`,
      name: `Premium_Receipt_Aug_2026_Renewal.pdf`,
      category: 'Payments',
      size: '410 KB',
      dateAdded: '16 Jul 2026'
    };
    setDocuments(prev => [newReceipt, ...prev]);
  };

  const handleStartSurrender = (policyId: string) => {
    // Navigate to surrender screen
    setCurrentScreen('surrender');
    addLog(`Initiated surrender request sequence for policy ID: ${policyId}`, 'action');
  };

  const handleSurrenderComplete = (policyId: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId) {
        return {
          ...p,
          status: 'surrendered'
        };
      }
      return p;
    }));
    // Remove or archive certificate, add a cancellation receipt
    const cancelDoc: VaultDocument = {
      id: `doc-cancel-${Date.now()}`,
      name: `Life_Policy_IND-LF-894104_Cancellation_Note.pdf`,
      category: 'Claims',
      size: '220 KB',
      dateAdded: '16 Jul 2026'
    };
    setDocuments(prev => [cancelDoc, ...prev]);
  };

  const handleSubmitClaim = (newClaim: any) => {
    setClaimCount(prev => prev + 1);
    // Add claims receipt to vault
    const claimDoc: VaultDocument = {
      id: `doc-claim-${Date.now()}`,
      name: `Claim_Intake_Receipt_${newClaim.claimNo}.pdf`,
      category: 'Claims',
      size: '340 KB',
      dateAdded: '16 Jul 2026'
    };
    setDocuments(prev => [claimDoc, ...prev]);
  };

  return (
    <div className="flex h-screen w-screen bg-[#0F141C] text-slate-100 overflow-hidden font-sans" id="kavach-root-layout">
      {/* 1. Desktop Companion Sidebar Guide */}
      <div className="hidden lg:block w-[32%] xl:w-[28%] shrink-0 h-full border-r border-slate-800" id="companion-sidebar-wrapper">
        <CompanionGuide 
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          logs={logs}
          onClearLogs={handleClearLogs}
          onResetAll={handleResetAll}
          onSimulateExpiryToggle={handleSimulateExpiryToggle}
          motorExpired={motorExpired}
          onTriggerFastSurrender={handleTriggerFastSurrender}
        />
      </div>

      {/* 2. Central Live Smartphone Workspace Simulator */}
      <div className="flex-1 h-full flex flex-col justify-center items-center p-4 relative" id="simulator-workspace">
        
        {/* Soft atmospheric radial backlights */}
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-[#8B1A1A]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        {/* Small header layout for mobile/tablet screens that can't show the full desktop guide */}
        <div className="lg:hidden w-full max-w-[365px] flex justify-between items-center bg-slate-900 border border-slate-800 p-2 rounded-xl mb-3 z-10" id="mobile-control-center">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-[#8B1A1A]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Kavach Prototype Deck</span>
          </div>
          <div className="flex gap-1.5">
            <button 
              id="mobile-reset-btn"
              onClick={handleResetAll}
              className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-2 py-1 rounded border border-slate-700 cursor-pointer"
            >
              Reset State
            </button>
            <button 
              id="mobile-alert-toggle-btn"
              onClick={handleSimulateExpiryToggle}
              className="text-[9px] bg-[#8B1A1A]/25 hover:bg-[#8B1A1A]/40 text-amber-300 font-bold px-2 py-1 rounded border border-[#8B1A1A]/50 cursor-pointer"
            >
              Toggle Expiry
            </button>
          </div>
        </div>

        {/* PHYSICAL SMARTPHONE SIMULATOR FRAME */}
        <div 
          className="w-full max-w-[370px] h-[680px] sm:h-[720px] bg-black rounded-[3.2rem] p-3.5 shadow-2xl relative border-4 border-slate-800 ring-4 ring-slate-900 flex flex-col select-none" 
          id="smartphone-physical-bezel"
        >
          {/* Top Speaker Ear-piece Notch Grill */}
          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 h-5 w-36 bg-black rounded-b-2xl z-40 flex items-center justify-center" id="smartphone-camera-notch">
            {/* Camera lens dot and speaker line */}
            <div className="h-1 w-1 rounded-full bg-slate-800 mr-4" />
            <div className="h-1 w-12 bg-slate-900 rounded-full" />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-800 ml-4" />
          </div>

          {/* INTERNAL PHONE SCREEN VIEWPORT */}
          <div className="flex-1 bg-white rounded-[2.2rem] overflow-hidden flex flex-col relative z-10" id="phone-screen-viewport">
            
            {/* Status Bar */}
            <div className="bg-[#8B1A1A] text-white/90 h-6 px-5 flex justify-between items-center text-[10px] font-semibold tracking-wider shrink-0 select-none z-20" id="phone-status-bar">
              <span id="statusBar-time">{currentTime}</span>
              <div className="flex items-center gap-1.5" id="statusBar-icons">
                <Signal className="h-3 w-3" />
                <span className="text-[9px] font-bold">5G</span>
                <Wifi className="h-3.5 w-3.5" />
                <Battery className="h-4 w-4 rotate-90 scale-90 translate-y-[-0.5px]" />
              </div>
            </div>

            {/* SCREEN CONTENT AREA (Active Screen Router) */}
            <div className="flex-1 relative overflow-hidden" id="phone-screen-routing-container">
              {currentScreen === 'dashboard' && (
                <KavachDashboard 
                  policies={policies}
                  family={family}
                  claimCount={claimCount}
                  onNavigate={handleNavigate}
                  onStartSurrender={handleStartSurrender}
                  addLog={addLog}
                  language={language}
                  setLanguage={setLanguage}
                />
              )}
              {currentScreen === 'wallet' && (
                <PolicyWallet 
                  policies={policies}
                  onNavigate={handleNavigate}
                  onStartSurrender={handleStartSurrender}
                  onRenewPolicy={handleRenewPolicy}
                  addLog={addLog}
                  language={language}
                />
              )}
              {currentScreen === 'surrender' && (
                <SurrenderFlow 
                  policies={policies}
                  onNavigate={handleNavigate}
                  onSurrenderComplete={handleSurrenderComplete}
                  addLog={addLog}
                  language={language}
                />
              )}
              {currentScreen === 'vault' && (
                <DocumentVault 
                  documents={documents}
                  onAddDocument={handleAddDocument}
                  onNavigate={handleNavigate}
                  addLog={addLog}
                />
              )}
              {currentScreen === 'claim' && (
                <ClaimEasy 
                  policies={policies}
                  onNavigate={handleNavigate}
                  onSubmitClaim={handleSubmitClaim}
                  addLog={addLog}
                />
              )}
              {currentScreen === 'explore' && (
                <ExploreBuy 
                  onAddPolicy={handleAddPolicy}
                  onAddDocument={handleAddDocument}
                  onNavigate={handleNavigate}
                  addLog={addLog}
                />
              )}
              {currentScreen === 'family' && (
                <FamilyHub 
                  family={family}
                  onAddPolicy={handleAddPolicy}
                  onAddDocument={handleAddDocument}
                  onNavigate={handleNavigate}
                  onUpdateFamilyCoverage={handleUpdateFamilyCoverage}
                  addLog={addLog}
                />
              )}
              {currentScreen === 'emergency' && (
                <EmergencyAssistance 
                  onNavigate={handleNavigate}
                  addLog={addLog}
                />
              )}
              {currentScreen === 'more' && (
                <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans" id="screen-more-container">
                  {/* More screen Header */}
                  <div className="bg-[#8B1A1A] text-white pt-6 pb-4 px-4 shadow-sm shrink-0" id="more-header">
                    <h1 className="text-base font-display font-semibold">IndusInd Bank Accounts</h1>
                    <p className="text-[9px] text-white/70">Preferred Banking Security Matrix</p>
                  </div>

                  {/* Body list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar" id="more-scroll-content">
                    {/* Customer Profile Profile card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-3xs" id="more-profile-card">
                      <div className="h-11 w-11 rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A] flex items-center justify-center font-bold text-sm shrink-0">
                        RS
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-slate-900 leading-tight">Rahul Sharma</h2>
                        <p className="text-[10px] text-slate-500 font-semibold font-mono">Preferred CRN: 4829103</p>
                        <p className="text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded-sm inline-block font-bold mt-1 uppercase">Fully KYC Verified</p>
                      </div>
                    </div>

                    {/* Linked Financial Accounts */}
                    <div className="space-y-2" id="more-accounts-list">
                      <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        {language === 'en' ? 'Linked Financial Accounts' : 'लिंक्ड वित्तीय खाते'}
                      </h3>
                      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3xs space-y-2" id="more-linked-ac-card">
                        <div className="flex justify-between text-xs font-semibold text-slate-800">
                          <span>{language === 'en' ? 'Primary Savings AC/4921' : 'प्राथमिक बचत खाता AC/4921'}</span>
                          <span className="text-[#8B1A1A]">₹1,84,320.50</span>
                        </div>
                        <p className="text-[9px] text-slate-400">
                          {language === 'en' ? 'Used for auto-renew debits and premium cashbacks' : 'ऑटो-नवीनीकरण डेबिट और प्रीमियम कैशबैक के लिए उपयोग किया जाता है'}
                        </p>
                      </div>
                    </div>

                    {/* Language Settings Card */}
                    <div className="space-y-2" id="more-language-section">
                      <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        {language === 'en' ? 'App Settings' : 'ऐप सेटिंग्स'}
                      </h3>
                      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3xs flex justify-between items-center" id="more-language-toggle-card">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded bg-slate-50 flex items-center justify-center text-[#8B1A1A]">
                            <span className="text-xs font-bold">🌐</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              {language === 'en' ? 'App Language' : 'ऐप की भाषा'}
                            </p>
                            <p className="text-[9px] text-slate-500 font-semibold">
                              {language === 'en' ? 'Currently English' : 'वर्तमान में हिंदी'}
                            </p>
                          </div>
                        </div>
                        <div className="flex bg-slate-100 rounded-lg p-0.5" id="language-switcher-group">
                          <button 
                            onClick={() => {
                              setLanguage('en');
                              addLog('Changed language to English', 'action');
                            }}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                              language === 'en' ? 'bg-[#8B1A1A] text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            English
                          </button>
                          <button 
                            onClick={() => {
                              setLanguage('hi');
                              addLog('हिंदी भाषा चुनी गई', 'action');
                            }}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                              language === 'hi' ? 'bg-[#8B1A1A] text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            हिंदी
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* FAQs */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3" id="more-faq-card">
                      <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <HelpCircle className="h-4.5 w-4.5 text-[#8B1A1A]" /> Kavach Sovereign Help Center
                      </h3>
                      <div className="space-y-2.5 text-[11px] leading-relaxed divide-y divide-slate-100">
                        <div className="pt-2">
                          <p className="font-bold text-slate-800">How do claims payouts work?</p>
                          <p className="text-slate-500 mt-0.5">Approved ClaimEasy cashless credits are dispatched straight to our panel partner hospitals or garages within 24 hours of surveyor reports.</p>
                        </div>
                        <div className="pt-2">
                          <p className="font-bold text-slate-800">Can I withdraw early policy surrender requests?</p>
                          <p className="text-slate-500 mt-0.5">No. Once biometric Aadhaar e-signs lock, transactions ledger automatically to ICICI Lombard and cancellation dispatches are permanent.</p>
                        </div>
                      </div>
                    </div>

                    {/* Legal security certificates */}
                    <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-start gap-2 text-[10px] text-slate-500 leading-relaxed" id="more-legal-note">
                      <Lock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <p>All transactions, premium checkout, and surrender biometric Aadhaar signatures are secured under the IndusInd Bank Core Security Protocol (v2.4).</p>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* STICKY BOTTOM NAVIGATION BAR */}
            <div 
              className="bg-white border-t border-slate-200 h-14 px-3 flex justify-between items-center shrink-0 select-none z-20" 
              id="phone-bottom-nav"
            >
              {/* Tab 1: Home */}
              <button 
                id="nav-tab-home"
                onClick={() => handleNavigate('dashboard')}
                className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                  currentScreen === 'dashboard' ? 'text-[#8B1A1A]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <ShieldCheck className="h-5.5 w-5.5" />
                <span className="text-[9px] font-bold mt-1">Kavach</span>
              </button>

              {/* Tab 2: Wallet */}
              <button 
                id="nav-tab-wallet"
                onClick={() => handleNavigate('wallet')}
                className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                  currentScreen === 'wallet' || currentScreen === 'surrender' ? 'text-[#8B1A1A]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Wallet className="h-5.5 w-5.5" />
                <span className="text-[9px] font-bold mt-1">Wallet</span>
              </button>

              {/* Tab 3: Claims */}
              <button 
                id="nav-tab-claims"
                onClick={() => handleNavigate('claim')}
                className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors relative ${
                  currentScreen === 'claim' ? 'text-[#8B1A1A]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <FileText className="h-5.5 w-5.5" />
                <span className="text-[9px] font-bold mt-1">Claims</span>
                {claimCount > 0 && (
                  <span className="absolute top-0.5 right-4 h-2 w-2 rounded-full bg-[#8B1A1A] animate-ping" />
                )}
              </button>

              {/* Tab 4: Family */}
              <button 
                id="nav-tab-family"
                onClick={() => handleNavigate('family')}
                className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                  currentScreen === 'family' ? 'text-[#8B1A1A]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Users className="h-5.5 w-5.5" />
                <span className="text-[9px] font-bold mt-1">Family</span>
              </button>

              {/* Tab 5: More */}
              <button 
                id="nav-tab-more"
                onClick={() => handleNavigate('more')}
                className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                  currentScreen === 'more' ? 'text-[#8B1A1A]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <MoreHorizontal className="h-5.5 w-5.5" />
                <span className="text-[9px] font-bold mt-1">Accounts</span>
              </button>
            </div>

            {/* Bottom Virtual iOS Home Indicator Pill Bar */}
            <div className="bg-white h-5 flex items-center justify-center shrink-0 z-20" id="phone-virtual-home-indicator-bar">
              <div className="h-1.5 w-28 bg-slate-200 rounded-full" />
            </div>

          </div>
        </div>

        {/* Small desktop support note */}
        <p className="text-[10px] text-slate-500 font-medium text-center mt-4 uppercase tracking-wider hidden sm:block" id="workspace-credits">
          Secured by IndusInd Bank • Double Click to inspect mobile canvas
        </p>

      </div>
    </div>
  );
}
