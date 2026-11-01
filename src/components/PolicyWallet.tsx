import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Shield, 
  MoreVertical, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  Calendar, 
  FileText, 
  User, 
  Hash, 
  X, 
  Sparkles, 
  ChevronRight,
  Receipt,
  HelpCircle
} from 'lucide-react';
import { Policy, ScreenId } from '../types';

interface WalletProps {
  policies: Policy[];
  onNavigate: (screen: ScreenId) => void;
  onStartSurrender: (policyId: string) => void;
  onRenewPolicy: (policyId: string) => void;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'action') => void;
  language?: 'en' | 'hi';
}

export const PolicyWallet: React.FC<WalletProps> = ({
  policies,
  onNavigate,
  onStartSurrender,
  onRenewPolicy,
  addLog,
  language = 'en'
}) => {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isRenewingId, setIsRenewingId] = useState<string | null>(null);
  const [renewSuccess, setRenewSuccess] = useState<boolean>(false);

  const handleOpenDetails = (policy: Policy) => {
    addLog(`Opened details for policy: ${policy.name}`, 'action');
    setSelectedPolicy(policy);
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleSurrenderFromMenu = (policyId: string) => {
    setActiveMenuId(null);
    onStartSurrender(policyId);
  };

  const triggerRenew = (e: React.MouseEvent, policy: Policy) => {
    e.stopPropagation();
    addLog(`Initiating renewal for policy: ${policy.name}`, 'info');
    setIsRenewingId(policy.id);
  };

  const confirmRenew = (policyId: string) => {
    onRenewPolicy(policyId);
    setIsRenewingId(null);
    setRenewSuccess(true);
    addLog(`Successfully renewed motor policy. Date extended!`, 'success');
    setTimeout(() => {
      setRenewSuccess(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans" id="screen-wallet-container">
      {/* Header */}
      <div className="bg-[#8B1A1A] text-white pt-5 pb-4 px-4 shadow-sm flex items-center justify-between" id="wallet-header">
        <div className="flex items-center gap-3">
          <button 
            id="wallet-back-btn"
            onClick={() => onNavigate('dashboard')} 
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-display font-semibold">My Policy Wallet</h1>
        </div>
        <button 
          id="wallet-add-btn"
          onClick={() => onNavigate('explore')} 
          className="p-1.5 bg-white/15 hover:bg-white/25 rounded text-white flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Buy
        </button>
      </div>

      {/* Main Wallet Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 no-scrollbar" id="wallet-scroll-content">
        {/* Renewal success notification toast */}
        {renewSuccess && (
          <div className="bg-[#FFBF00] border border-amber-500 text-slate-950 rounded-lg p-2.5 flex items-start gap-2 animate-fadeIn" id="renewal-toast">
            <CheckCircle className="h-4.5 w-4.5 text-slate-950 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">Policy Renewed Successfully</p>
              <p className="text-[10px] text-slate-900 font-semibold">Premium of ₹12,300 debited from AC/4921. Validity extended by 1 year.</p>
            </div>
          </div>
        )}

        <div className="space-y-2.5" id="active-policies-list">
          <h2 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-1">Active Protections</h2>
          
          {policies.map((policy) => {
            if (policy.status === 'surrendered') return null;

            const isExpiring = policy.status === 'expiring';
            const isHealth = policy.category === 'health';
            const isMotor = policy.category === 'motor';
            const isLife = policy.category === 'life';

            return (
              <div 
                key={policy.id}
                id={`policy-card-${policy.id}`}
                onClick={() => handleOpenDetails(policy)}
                className={`bg-white border rounded-lg p-3 shadow-3xs cursor-pointer hover:border-[#8B1A1A] transition-all relative ${
                  isExpiring ? 'border-[#FFBF00] ring-1 ring-amber-100 bg-[#FFBF00]/5' : 'border-slate-200'
                }`}
              >
                {/* Header Row */}
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${
                      isHealth ? 'bg-emerald-50 text-emerald-700' : 
                      isMotor ? 'bg-amber-50 text-amber-700' : 
                      isLife ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">{policy.name}</h3>
                      <p className="text-[9px] font-bold text-slate-400">{policy.insurer}</p>
                    </div>
                  </div>

                  {/* Options Menu Trigger */}
                  <div className="relative">
                    <button 
                      id={`menu-trigger-${policy.id}`}
                      onClick={(e) => toggleMenu(e, policy.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {activeMenuId === policy.id && (
                      <div className="absolute right-0 top-6 w-38 bg-white border border-slate-200 rounded shadow-md z-10 py-1" id={`dropdown-${policy.id}`}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleOpenDetails(policy); setActiveMenuId(null); }}
                          className="w-full text-left px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
                        >
                          View Coverage Details
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); addLog('Downloaded policy PDF', 'success'); setActiveMenuId(null); }}
                          className="w-full text-left px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
                        >
                          Download PDF Copy
                        </button>
                        {isLife && (
                          <button 
                            id="menu-btn-surrender"
                            onClick={(e) => { e.stopPropagation(); handleSurrenderFromMenu(policy.id); }}
                            className="w-full text-left px-3 py-1.5 text-[11px] text-red-700 hover:bg-red-50 font-bold border-t border-slate-100 cursor-pointer"
                          >
                            Surrender Policy
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Row */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 mt-2 pb-2 border-b border-slate-100">
                  <div>
                    <span className="block text-[8px] text-slate-400 uppercase font-bold">Sum Insured</span>
                    <span className="font-bold text-slate-900">₹{policy.sumInsured.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-400 uppercase font-bold">Next Renewal</span>
                    <span className={`font-bold ${isExpiring ? 'text-amber-700' : 'text-slate-800'}`}>
                      {policy.renewDate}
                    </span>
                  </div>
                </div>

                {/* Footer Status Row */}
                <div className="flex items-center justify-between mt-2 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${isExpiring ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <span className={`text-[9px] font-bold ${isExpiring ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {isExpiring ? 'Expiring in 18 days' : 'Active Protection'}
                    </span>
                  </div>

                  {isExpiring ? (
                    <button 
                      id="wallet-renew-now-btn"
                      onClick={(e) => triggerRenew(e, policy)}
                      className="bg-[#FFBF00] hover:bg-[#E6AC00] text-slate-950 font-bold text-[9px] px-2.5 py-1 rounded shadow-3xs cursor-pointer transition-colors"
                    >
                      Renew Now
                    </button>
                  ) : (
                    <span className="text-[9px] text-slate-400 font-bold flex items-center">
                      Tap card to view details <ChevronRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Home Insurance Not Added Placeholder */}
        <div className="space-y-2" id="available-policies-placeholders">
          <h2 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-1">Other Assets</h2>
          <div className="bg-slate-100/70 border border-dashed border-slate-300 rounded-lg p-3 flex items-center justify-between" id="home-insurance-placeholder">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-slate-200/80 rounded text-slate-400">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-500">Home Protection</h3>
                <p className="text-[9px] text-slate-400">Not active • Safeguard your property</p>
              </div>
            </div>
            <button 
              id="placeholder-add-home-btn"
              onClick={() => onNavigate('explore')}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[9px] px-2.5 py-1.5 rounded cursor-pointer transition-colors"
            >
              Add Now
            </button>
          </div>
        </div>
      </div>

      {/* Renewal Confirmation Modal/Sheet */}
      {isRenewingId && (
        <div className="absolute inset-0 bg-black/60 z-30 flex flex-col justify-end" id="renewal-dialog-backdrop">
          <div className="bg-white rounded-t-2xl p-5 space-y-4 shadow-xl max-h-[80%] overflow-y-auto animate-slideUp" id="renewal-dialog">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-[#8B1A1A]" /> Confirm Policy Renewal
              </h3>
              <button 
                onClick={() => setIsRenewingId(null)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are renewing <strong className="text-slate-800">Car Secure Comprehensive</strong> with Bajaj Allianz General Insurance.
            </p>

            <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 border border-slate-150">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Insured Asset</span>
                <span className="font-medium text-slate-900">Renault Duster (MH-02-CD-4521)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">New Expiry Date</span>
                <span className="font-medium text-slate-900">03 Aug 2027 (1 Year Extension)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Savings Account Balance</span>
                <span className="font-semibold text-slate-700">₹1,84,320.50</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-slate-200 font-bold">
                <span className="text-slate-800">Renewal Premium</span>
                <span className="text-[#8B1A1A]">₹12,300</span>
              </div>
            </div>

            <div className="p-3 bg-[#8B1A1A]/5 border border-[#8B1A1A]/15 rounded-xl text-[10px] text-slate-600 flex items-start gap-2">
              <Receipt className="h-4 w-4 text-[#8B1A1A] mt-0.5 shrink-0" />
              <p>
                The premium amount of <strong>₹12,300</strong> will be automatically debited from your linked IndusInd Savings Account AC/4921.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setIsRenewingId(null)}
                className="flex-1 border border-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                id="confirm-pay-renew-btn"
                onClick={() => confirmRenew(isRenewingId)}
                className="flex-1 bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Pay & Renew
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Policy Details Bottom Sheet */}
      {selectedPolicy && (
        <div className="absolute inset-0 bg-black/60 z-30 flex flex-col justify-end" id="details-sheet-backdrop">
          <div className="bg-white rounded-t-2xl p-5 space-y-4 shadow-xl max-h-[85%] overflow-y-auto flex flex-col animate-slideUp" id="details-sheet">
            {/* Sheet Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-[#8B1A1A]/10 text-[#8B1A1A] rounded-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedPolicy.name}</h3>
                  <p className="text-[10px] text-slate-500">{selectedPolicy.insurer}</p>
                </div>
              </div>
              <button 
                id="details-sheet-close-btn"
                onClick={() => setSelectedPolicy(null)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sheet Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto space-y-4 py-1 pr-1 no-scrollbar text-xs" id="details-sheet-body">
              {/* Summary Stats Cards */}
              <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">Policy Number</span>
                  <p className="font-mono font-bold text-slate-800">{selectedPolicy.policyNo}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">Sum Insured</span>
                  <p className="font-bold text-[#8B1A1A]">₹{selectedPolicy.sumInsured.toLocaleString('en-IN')}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">Nominee Declared</span>
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> {selectedPolicy.nomineeName.split(' ')[0]}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">Premium Paid</span>
                  <p className="font-bold text-slate-800">₹{selectedPolicy.premium.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Cover Details (Plain Language Hero Section) */}
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-[#8B1A1A]" />
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">What is Covered (Plain Language)</h4>
                </div>
                <div className="space-y-2 bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5">
                  {selectedPolicy.coverageDetails.covered.map((item, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Not Covered */}
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  <HelpCircle className="h-4 w-4 text-slate-500" />
                  <h4 className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">What is NOT Covered</h4>
                </div>
                <div className="space-y-2 bg-rose-50/40 border border-rose-100 rounded-xl p-3.5">
                  {selectedPolicy.coverageDetails.notCovered.map((item, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sheet Footer Action */}
            <div className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
              <button 
                onClick={() => setSelectedPolicy(null)}
                className="flex-1 bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-xs py-2.5 rounded-xl text-center shadow-3xs cursor-pointer transition-all"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
