import React from 'react';
import { 
  Compass, 
  Settings, 
  RotateCcw, 
  Sparkles, 
  Terminal, 
  Clock, 
  HelpCircle, 
  PhoneCall, 
  Wallet, 
  FileText, 
  ShieldCheck, 
  RefreshCw,
  Award,
  BookOpen
} from 'lucide-react';
import { ScreenId } from '../types';

interface CompanionProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  logs: Array<{ id: string; timestamp: string; message: string; type: 'info' | 'success' | 'warning' | 'action' }>;
  onClearLogs: () => void;
  onResetAll: () => void;
  onSimulateExpiryToggle: () => void;
  motorExpired: boolean;
  onTriggerFastSurrender: () => void;
}

export const CompanionGuide: React.FC<CompanionProps> = ({
  currentScreen,
  onNavigate,
  logs,
  onClearLogs,
  onResetAll,
  onSimulateExpiryToggle,
  motorExpired,
  onTriggerFastSurrender
}) => {

  const screensMeta: Array<{ id: ScreenId; label: string; icon: any; note: string }> = [
    { id: 'dashboard', label: '1. Home Dashboard', icon: ShieldCheck, note: 'Rahul Sharma overview (2x2 grid, alert)' },
    { id: 'wallet', label: '2. Policy Wallet', icon: Wallet, note: 'HDFC, ICICI, Bajaj list • Plain language details modal' },
    { id: 'surrender', label: '3. Surrender Flow', icon: RefreshCw, note: '4 steps, HTML5 e-sign drawing canvas, tracker' },
    { id: 'vault', label: '4. Document Vault', icon: FileText, note: 'Expandable folders, mock upload, scanner, PDF' },
    { id: 'claim', label: '5. ClaimEasy™ Desk', icon: Sparkles, note: 'Incident intake, AI pre-fill, OCR viewfinder scanner' },
    { id: 'explore', label: '6. Explore & Buy', icon: Compass, note: 'Plans grid, cashless benefits cards, debit AC/4921' },
    { id: 'family', label: '7. Family Protection', icon: HeartHandshakeIcon, note: '4 member coverage analysis • Senior Citizen coverage' },
    { id: 'emergency', label: '8. Emergency SOS', icon: PhoneCall, note: 'Ambulance dispatcher, GPS tow, network hospitals list' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#1e2530] text-slate-200 border-r border-slate-800 p-5 font-sans justify-between overflow-y-auto" id="companion-sidebar-container">
      
      <div className="space-y-6" id="companion-upper-half">
        {/* Header branding */}
        <div className="space-y-1" id="companion-header">
          <div className="flex items-center gap-2">
            <div className="bg-[#8B1A1A] text-white p-1 rounded-md">
              <ShieldCheck className="h-5 w-5 text-amber-300" />
            </div>
            <h1 className="text-sm font-display font-semibold tracking-wider text-white">KAVACH PROTOTYPE DECK</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">IndusInd Protection Companion</p>
        </div>

        {/* Design specs card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2.5 text-xs" id="companion-design-specs">
          <div className="flex items-center gap-1.5 text-white font-bold" id="specs-title">
            <Award className="h-4 w-4 text-amber-400" /> Design Specifications
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div>
              <span className="block font-semibold text-slate-500">PRIMARY THEME</span>
              <span className="font-bold text-white flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#8B1A1A]"></span> Maroon (#8B1A1A)
              </span>
            </div>
            <div>
              <span className="block font-semibold text-slate-500">UI STANDARDS</span>
              <span className="font-bold text-white">Banking-Grade (No Gamification)</span>
            </div>
            <div>
              <span className="block font-semibold text-slate-500">ACCENTS & ICONS</span>
              <span className="font-bold text-white flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#D4AF37]"></span> Gold Accent / Lucide Icons
              </span>
            </div>
            <div>
              <span className="block font-semibold text-slate-500">CURRENCY REF</span>
              <span className="font-bold text-emerald-400">Rupee Symbol (₹)</span>
            </div>
          </div>
        </div>

        {/* Screen selector jumper */}
        <div className="space-y-2.5" id="companion-screen-jump">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" /> Direct Screen Jump Selector
          </h2>
          <div className="grid grid-cols-1 gap-1.5" id="screen-jump-grid">
            {screensMeta.map((screen) => {
              const isActive = currentScreen === screen.id;
              const Icon = screen.icon;

              return (
                <button 
                  key={screen.id}
                  id={`jump-btn-${screen.id}`}
                  onClick={() => onNavigate(screen.id)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center gap-3 ${
                    isActive 
                      ? 'bg-[#8B1A1A]/15 border-[#8B1A1A] text-white font-bold shadow-xs' 
                      : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:bg-slate-900/60 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-[#8B1A1A]' : 'text-slate-500'}`} />
                  <div className="min-w-0">
                    <p className="leading-tight truncate">{screen.label}</p>
                    <p className="text-[9px] text-slate-500 font-medium truncate mt-0.5">{screen.note}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Simulation variables controller */}
        <div className="space-y-2.5" id="companion-scenarios">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Settings className="h-3.5 w-3.5" /> Scenario & State Overrides
          </h2>
          <div className="space-y-1.5 text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-800" id="scenario-triggers-box">
            
            {/* Toggle expiry button */}
            <button 
              id="override-toggle-expired-btn"
              onClick={onSimulateExpiryToggle}
              className="w-full text-left py-2 px-2.5 rounded hover:bg-slate-800 flex justify-between items-center text-[11px] cursor-pointer"
            >
              <span className="text-slate-300">Set Motor Cover Expired Status</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                motorExpired ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {motorExpired ? 'EXPIRED' : 'ACTIVE'}
              </span>
            </button>

            {/* Trigger fast surrender */}
            <button 
              id="override-fast-surrender-btn"
              onClick={onTriggerFastSurrender}
              className="w-full text-left py-2 px-2.5 rounded hover:bg-slate-800 flex justify-between items-center text-[11px] cursor-pointer"
            >
              <span className="text-slate-300">Trigger Travel Surrender Step 4</span>
              <span className="text-[9px] bg-[#8B1A1A] text-white font-bold px-1.5 py-0.2 rounded uppercase">Launch</span>
            </button>

            {/* Clear reset */}
            <button 
              id="override-reset-btn"
              onClick={onResetAll}
              className="w-full text-left py-2 px-2.5 rounded hover:bg-slate-800 flex justify-between items-center text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer border-t border-slate-800 mt-1"
            >
              <span>Reset Prototype Data State</span>
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

          </div>
        </div>

      </div>

      {/* Real-time simulation event log */}
      <div className="space-y-2 mt-4 pt-4 border-t border-slate-800 shrink-0" id="companion-event-logs">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-[#8B1A1A]" /> Simulation Ledger
          </h3>
          <button 
            onClick={onClearLogs}
            className="text-[9px] text-slate-500 hover:text-slate-300 font-mono"
            id="clear-logs-btn"
          >
            Clear logs
          </button>
        </div>

        <div className="h-40 bg-slate-950 rounded-xl p-3 overflow-y-auto font-mono text-[9px] space-y-2 border border-slate-800 no-scrollbar" id="logs-container">
          {logs.length === 0 ? (
            <p className="text-slate-600 italic text-center py-8">Ledger empty. Interact with the phone mockup to generate secure bank authorization audits.</p>
          ) : (
            logs.map((log) => {
              const typeColor = 
                log.type === 'success' ? 'text-emerald-400' : 
                log.type === 'warning' ? 'text-amber-500 font-semibold' : 
                log.type === 'action' ? 'text-blue-400' : 'text-slate-400';

              return (
                <div key={log.id} className="leading-relaxed border-b border-slate-900/50 pb-1.5" id={`log-item-${log.id}`}>
                  <span className="text-slate-500 mr-1">{log.timestamp}</span>
                  <span className={typeColor}>{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};

// Simple icon wrapper fallback in case HeartHandshake is not directly imported
const HeartHandshakeIcon = (props: any) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l1.72 1.5" />
    </svg>
  );
};
