import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  FileText, 
  Wallet, 
  RefreshCw, 
  FileClock, 
  FileUp, 
  PhoneCall, 
  ChevronRight, 
  Clock,
  ArrowRight,
  Sparkles,
  Info,
  Bell
} from 'lucide-react';
import { Policy, FamilyMember, ScreenId } from '../types';

interface DashboardProps {
  policies: Policy[];
  family: FamilyMember[];
  claimCount: number;
  onNavigate: (screen: ScreenId) => void;
  onStartSurrender: (policyId: string) => void;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'action') => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

export const KavachDashboard: React.FC<DashboardProps> = ({
  policies,
  family,
  claimCount,
  onNavigate,
  onStartSurrender,
  addLog,
  language,
  setLanguage
}) => {
  const activeCount = policies.filter(p => p.status !== 'surrendered').length;
  const renewalCount = policies.filter(p => p.status === 'expiring').length;
  const familyCount = family.length;

  const handleAction = (label: string, action: () => void) => {
    addLog(`Clicked Quick Action: ${label}`, 'action');
    action();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans" id="screen-dashboard-container">
      {/* Upper Bank Header Branding */}
      <div className="bg-[#8B1A1A] text-white pt-5 pb-4 px-4 rounded-b-xl shadow-sm" id="dashboard-header-brand">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-amber-300 font-bold">
              {language === 'en' ? 'INDUSIND BANK' : 'इंडसइंड बैंक'}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="h-4.5 w-4.5 text-amber-400" />
              <h1 className="text-lg font-display font-semibold tracking-tight">
                {language === 'en' ? 'KAVACH' : 'कवच'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Change Language Button option */}
            <button
              id="header-lang-toggle"
              onClick={() => {
                const nextLang = language === 'en' ? 'hi' : 'en';
                setLanguage(nextLang);
                addLog(nextLang === 'en' ? 'Switched language to English' : 'हिंदी भाषा चुनी गई', 'action');
              }}
              className="text-[10px] font-bold bg-white/10 hover:bg-white/20 border border-white/25 px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1"
            >
              <span>🌐</span> {language === 'en' ? 'हिं' : 'EN'}
            </button>

            {/* Notification Symbol Bell with red active dot */}
            <div 
              className="relative cursor-pointer hover:bg-white/10 p-1.5 rounded-full transition-colors flex items-center justify-center" 
              id="header-bell-wrapper"
              onClick={() => addLog('Opened notifications screen (Prototype demo)', 'info')}
            >
              <Bell className="h-4 w-4 text-amber-300" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-[#8B1A1A]" />
            </div>

            <div className="h-7 w-7 rounded bg-white/20 flex items-center justify-center font-bold text-xs border border-white/10">
              RS
            </div>
          </div>
        </div>
        
        <p className="text-[10px] text-white/70">
          {language === 'en' ? 'Welcome back,' : 'स्वागत है,'}
        </p>
        <p className="text-base font-semibold tracking-tight">
          {language === 'en' ? 'Rahul Sharma' : 'राहुल शर्मा'}
        </p>
        <p className="text-[9px] text-white/50">
          {language === 'en' ? 'Savings Account AC/4921 • Preferred banking' : 'बचत खाता AC/4921 • पसंदीदा बैंकिंग'}
        </p>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 no-scrollbar" id="dashboard-scroll-content">
        {/* Expiration Alert Banner */}
        {policies.some(p => p.id === 'motor-indusind' && p.status === 'expiring') && (
          <div 
            id="renewal-alert-banner"
            onClick={() => handleAction('Renewal Alert (Motor Insurance)', () => onNavigate('wallet'))}
            className="bg-[#FFBF00] border border-amber-500 rounded-lg p-2.5 flex items-center justify-between shadow-xs cursor-pointer hover:bg-[#E6AC00] transition-colors"
          >
            <div className="flex items-start gap-2">
              <div className="p-1 bg-slate-950/10 rounded text-slate-950 mt-0.5">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-950">
                  {language === 'en' ? 'Motor insurance expires in 18 days' : 'मोटर बीमा 18 दिनों में समाप्त हो जाएगा'}
                </p>
                <p className="text-[10px] text-slate-900 font-semibold">
                  {language === 'en' ? 'Tap to review & renew instantly inside wallet' : 'बटुए के अंदर तुरंत समीक्षा और नवीनीकरण करने के लिए टैप करें'}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-950 shrink-0" />
          </div>
        )}

        {/* 2x2 Status Grid */}
        <div className="grid grid-cols-2 gap-2.5" id="stats-grid-2x2">
          {/* Card 1: Active Policies */}
          <div 
            id="stat-card-active-policies"
            onClick={() => handleAction('View Wallet', () => onNavigate('wallet'))}
            className="bg-white border border-slate-200 rounded-lg p-3 shadow-3xs cursor-pointer hover:border-[#8B1A1A] transition-all"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                {language === 'en' ? 'Active Policies' : 'सक्रिय पॉलिसियाँ'}
              </span>
              <div className="p-1 bg-emerald-50 rounded text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-slate-900">{activeCount}</span>
              <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded">
                {language === 'en' ? 'Secure' : 'सुरक्षित'}
              </span>
            </div>
          </div>

          {/* Card 2: Family Covered */}
          <div 
            id="stat-card-family"
            onClick={() => handleAction('View Family Hub', () => onNavigate('family'))}
            className="bg-white border border-slate-200 rounded-lg p-3 shadow-3xs cursor-pointer hover:border-[#8B1A1A] transition-all"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                {language === 'en' ? 'Family Members' : 'परिवार के सदस्य'}
              </span>
              <div className="p-1 bg-blue-50 rounded text-blue-700">
                <Users className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-slate-900">{familyCount}</span>
              <span className="text-[9px] text-blue-700 font-bold">
                {language === 'en' ? '4 Covered' : '4 सुरक्षित'}
              </span>
            </div>
          </div>

          {/* Card 3: Renewals Due */}
          <div 
            id="stat-card-renewals"
            onClick={() => handleAction('Renewals Due', () => onNavigate('wallet'))}
            className={`border rounded-lg p-3 shadow-3xs cursor-pointer transition-all ${
              renewalCount > 0 
                ? 'bg-amber-50/50 border-amber-300 hover:bg-amber-50' 
                : 'bg-white border-slate-200 hover:border-[#8B1A1A]'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                {language === 'en' ? 'Renewals Due' : 'नवीनीकरण देय'}
              </span>
              <div className={`p-1 rounded ${renewalCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                <FileClock className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-bold tracking-tight ${renewalCount > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                {renewalCount}
              </span>
              {renewalCount > 0 && (
                <span className="text-[8px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                  {language === 'en' ? '18d left' : '18 दिन शेष'}
                </span>
              )}
            </div>
          </div>

          {/* Card 4: Active Claims */}
          <div 
            id="stat-card-claims"
            onClick={() => handleAction('View Claims', () => onNavigate('claim'))}
            className="bg-white border border-slate-200 rounded-lg p-3 shadow-3xs cursor-pointer hover:border-[#8B1A1A] transition-all"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                {language === 'en' ? 'Active Claims' : 'सक्रिय दावे'}
              </span>
              <div className="p-1 bg-purple-50 rounded text-purple-700">
                <FileText className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-slate-900">{claimCount}</span>
              <span className="text-[9px] text-slate-500 font-medium">
                {language === 'en' ? 'In Process' : 'प्रक्रिया में'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Area */}
        <div id="quick-actions-section" className="bg-white border border-slate-200 rounded-lg p-3 shadow-3xs">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            {language === 'en' ? 'Quick Protection Services' : 'त्वरित सुरक्षा सेवाएँ'}
          </h2>
          <div className="grid grid-cols-5 gap-1" id="quick-action-row">
            {/* Action 1: Wallet */}
            <button 
              id="action-btn-wallet"
              onClick={() => handleAction('Policy Wallet', () => onNavigate('wallet'))}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="h-9 w-9 rounded bg-slate-50 group-hover:bg-[#8B1A1A]/10 border border-slate-100 flex items-center justify-center text-[#8B1A1A] transition-colors">
                <Wallet className="h-4.5 w-4.5" />
              </div>
              <span className="text-[9px] font-bold text-slate-600 text-center mt-1 leading-tight group-hover:text-slate-900">
                {language === 'en' ? 'Wallet' : 'वॉलेट'}
              </span>
            </button>

            {/* Action 2: Surrender */}
            <button 
              id="action-btn-surrender"
              onClick={() => handleAction('Surrender Policy (Life)', () => onStartSurrender('life-indusind'))}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="h-9 w-9 rounded bg-slate-50 group-hover:bg-[#8B1A1A]/10 border border-slate-100 flex items-center justify-center text-amber-700 transition-colors">
                <RefreshCw className="h-4.5 w-4.5" />
              </div>
              <span className="text-[9px] font-bold text-slate-600 text-center mt-1 leading-tight group-hover:text-slate-900">
                {language === 'en' ? 'Surrender' : 'सरेंडर'}
              </span>
            </button>

            {/* Action 3: File Claim */}
            <button 
              id="action-btn-claim"
              onClick={() => handleAction('File Claim', () => onNavigate('claim'))}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="h-9 w-9 rounded bg-slate-50 group-hover:bg-[#8B1A1A]/10 border border-slate-100 flex items-center justify-center text-purple-700 transition-colors">
                <FileUp className="h-4.5 w-4.5" />
              </div>
              <span className="text-[9px] font-bold text-slate-600 text-center mt-1 leading-tight group-hover:text-slate-900">
                {language === 'en' ? 'File Claim' : 'दावा फाइल'}
              </span>
            </button>

            {/* Action 4: Vault */}
            <button 
              id="action-btn-vault"
              onClick={() => handleAction('Document Vault', () => onNavigate('vault'))}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="h-9 w-9 rounded bg-slate-50 group-hover:bg-[#8B1A1A]/10 border border-slate-100 flex items-center justify-center text-blue-700 transition-colors">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <span className="text-[9px] font-bold text-slate-600 text-center mt-1 leading-tight group-hover:text-slate-900">
                {language === 'en' ? 'Vault' : 'वॉल्ट'}
              </span>
            </button>

            {/* Action 5: Emergency */}
            <button 
              id="action-btn-emergency"
              onClick={() => handleAction('Emergency Helpline', () => onNavigate('emergency'))}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="h-9 w-9 rounded bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center text-red-700 transition-colors">
                <PhoneCall className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <span className="text-[9px] font-bold text-red-700 text-center mt-1 leading-tight">
                {language === 'en' ? 'Emergency' : 'आपातकालीन'}
              </span>
            </button>
          </div>
        </div>

        {/* Indus AI Assistant Insight Block */}
        <div id="ai-insights-block" className="bg-[#E0F2FE]/15 border border-[#BAE6FD] rounded-lg p-3 shadow-3xs">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="bg-[#E0F2FE] text-[#0369A1] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#BAE6FD] flex items-center gap-0.5">
              <Sparkles className="h-2.5 w-2.5 text-[#0369A1]" />
              INDUS AI
            </div>
            <span className="text-xs font-bold text-slate-800">Smart Shield Recommendations</span>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2 items-start text-[11px] leading-relaxed">
              <div className="h-1.5 w-1.5 rounded-full bg-[#0369A1] mt-1.5 shrink-0" />
              <p className="text-slate-600">
                Your father <strong className="text-slate-800">Ramesh Sharma (65)</strong> has no active medical policy linked. Tap to explore senior citizen plans.
              </p>
            </div>
            <div className="flex gap-2 items-start text-[11px] leading-relaxed">
              <div className="h-1.5 w-1.5 rounded-full bg-[#0369A1] mt-1.5 shrink-0" />
              <p className="text-slate-600">
                You can save up to <strong className="text-slate-800">₹4,200 under Section 80D</strong> by purchasing or renewing your parent's policy.
              </p>
            </div>
          </div>
          <button 
            id="ai-action-explore"
            onClick={() => onNavigate('family')}
            className="flex items-center gap-1 text-[10px] font-bold text-[#0369A1] mt-2.5 bg-white border border-[#BAE6FD] px-2.5 py-1 rounded hover:bg-[#E0F2FE] transition-all cursor-pointer shadow-3xs"
          >
            Review Family Gaps <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Security & Vault Status Summary */}
        <div id="security-vault-preview" className="bg-white border border-slate-200 rounded-lg p-3 shadow-3xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Document Vault Status</h3>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
              AES-256 Secured
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-800">6 Encrypted Documents Saved</p>
              <p className="text-[10px] text-slate-400">Includes policies, receipts, and e-KYC papers</p>
            </div>
            <button 
              id="vault-explore-btn"
              onClick={() => onNavigate('vault')}
              className="text-[10px] text-[#8B1A1A] font-bold hover:underline cursor-pointer flex items-center"
            >
              Open Vault <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        
        {/* Help Desk Footer Note */}
        <div className="flex items-center justify-center gap-1.5 py-1 text-slate-400" id="footer-secure-badges">
          <Info className="h-3.5 w-3.5" />
          <span className="text-[9px] font-medium tracking-wide uppercase">IndusInd 24x7 Support Line: 1860 267 7777</span>
        </div>
      </div>
    </div>
  );
};
