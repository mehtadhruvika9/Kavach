import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Activity, 
  Car, 
  Luggage, 
  Home, 
  ShieldAlert, 
  ChevronRight, 
  CheckCircle, 
  Check, 
  X, 
  CreditCard, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { PolicyCategory, Policy, VaultDocument, ScreenId } from '../types';
import { PLANS_DATA } from '../data';

interface ExploreProps {
  onAddPolicy: (policy: Policy) => void;
  onAddDocument: (doc: VaultDocument) => void;
  onNavigate: (screen: ScreenId) => void;
  preSelectedCategory?: PolicyCategory;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'action') => void;
}

export const ExploreBuy: React.FC<ExploreProps> = ({
  onAddPolicy,
  onAddDocument,
  onNavigate,
  preSelectedCategory = 'health',
  addLog
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PolicyCategory>(preSelectedCategory);
  const [activePlan, setActivePlan] = useState<any>(PLANS_DATA.health[1]); // Default to standard plan
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [buySuccess, setBuySuccess] = useState<boolean>(false);

  const handleCategorySelect = (cat: PolicyCategory) => {
    setSelectedCategory(cat);
    const plans = PLANS_DATA[cat] || PLANS_DATA.health;
    setActivePlan(plans[0]); // default to first plan in category
    addLog(`Switched insurance explore category to: ${cat.toUpperCase()}`, 'action');
  };

  const handleInitiateBuy = (plan: any) => {
    setActivePlan(plan);
    setShowCheckout(true);
    addLog(`Initiating checkout for plan: ${plan.name}`, 'info');
  };

  const confirmPurchase = () => {
    const insuranceProvider = 
      selectedCategory === 'health' ? 'HDFC Ergo General Insurance' :
      selectedCategory === 'motor' ? 'Bajaj Allianz General Insurance' :
      selectedCategory === 'travel' ? 'ICICI Lombard General Insurance' :
      selectedCategory === 'home' ? 'HDFC Ergo General Insurance' : 'IndusInd Cyber Security';

    // 1. Create new policy object
    const newPolicy: Policy = {
      id: `${selectedCategory}-${Date.now()}`,
      name: activePlan.name,
      category: selectedCategory,
      insurer: insuranceProvider,
      status: 'active',
      renewDate: '16 Jul 2027', // 1 year from current date (July 16, 2026)
      sumInsured: activePlan.sumInsured,
      premium: activePlan.premium,
      nomineeName: 'Priya Sharma (Wife)',
      policyNo: `IND-${selectedCategory.slice(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      coverageDetails: {
        covered: activePlan.covered.map((c: string) => `${c} protection under basic terms`),
        notCovered: activePlan.notCovered.map((nc: string) => `${nc} is strictly excluded`)
      }
    };

    // 2. Create new vault document object
    const newDoc: VaultDocument = {
      id: `doc-buy-${Date.now()}`,
      name: `${activePlan.name.replace(/\s+/g, '_')}_Policy_Certificate.pdf`,
      category: 'Policies',
      size: '1.4 MB',
      dateAdded: '16 Jul 2026'
    };

    onAddPolicy(newPolicy);
    onAddDocument(newDoc);
    
    setShowCheckout(false);
    setBuySuccess(true);
    addLog(`Purchased ${activePlan.name} successfully. Debit of ₹${activePlan.premium.toLocaleString('en-IN')} complete. Policy certificate archived to Document Vault!`, 'success');
  };

  const categories: Array<{ id: PolicyCategory; label: string; icon: any }> = [
    { id: 'health', label: 'Health', icon: Activity },
    { id: 'motor', label: 'Motor', icon: Car },
    { id: 'travel', label: 'Travel', icon: Luggage },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'cyber', label: 'Cyber', icon: ShieldCheck },
  ];

  const plansList = PLANS_DATA[selectedCategory] || [];

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans" id="screen-explore-container">
      {/* Header */}
      <div className="bg-[#8B1A1A] text-white pt-5 pb-4 px-4 shadow-sm flex items-center gap-3 shrink-0" id="explore-header">
        <button 
          id="explore-back-btn"
          onClick={() => onNavigate('dashboard')} 
          className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-display font-semibold">Explore & Buy Cover</h1>
          <p className="text-[9px] text-white/70">Instant issuance • Zero paperwork</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 no-scrollbar flex flex-col justify-between" id="explore-scroll-content">
        
        {/* Success state */}
        {buySuccess ? (
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center space-y-3 shadow-md flex-1 flex flex-col justify-center animate-fadeIn" id="purchase-success-view">
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle className="h-6 w-6" />
            </div>
            
            <div className="space-y-0.5">
              <h2 className="text-xs font-bold text-slate-900">Coverage Active Instantly</h2>
              <p className="text-[11px] text-slate-500">Premium payment completed. Welcome to Kavach protection.</p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg space-y-1.5 text-xs text-left font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Insured Plan</span>
                <span className="font-bold text-slate-800">{activePlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Premium Charged</span>
                <span className="font-bold text-[#8B1A1A]">₹{activePlan.premium.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sum Insured Limit</span>
                <span className="font-bold text-slate-800">₹{activePlan.sumInsured.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-[10px]">
                <span className="text-slate-400">Vault Archive ID</span>
                <span className="text-slate-500 font-bold truncate max-w-[120px]">DOC-AUTO-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
              The premium certificate has been automatically AES-256 encrypted and stored in your <strong>Document Vault</strong> folder for convenient tax filing access under Section 80D.
            </p>

            <div className="space-y-2 pt-1 shrink-0">
              <button 
                id="success-view-wallet-btn"
                onClick={() => onNavigate('wallet')}
                className="w-full bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-xs py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Go to Policy Wallet
              </button>
              <button 
                onClick={() => setBuySuccess(false)}
                className="w-full border border-slate-200 text-slate-700 font-bold text-xs py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Buy Another Cover
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Category selector row */}
              <div className="space-y-1 shrink-0">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Select Asset Class</label>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5" id="explore-categories-row">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;

                    return (
                      <button 
                        key={cat.id}
                        id={`category-btn-${cat.id}`}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`px-3 py-2 rounded-lg border flex items-center gap-1.5 text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#8B1A1A] border-[#8B1A1A] text-white shadow-xs' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Plans side-by-side swipe cards list */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Comparison Plans</label>
                
                <div className="flex gap-2.5 overflow-x-auto pb-2 pt-0.5 px-0.5 snap-x snap-mandatory no-scrollbar" id="explore-plans-slider">
                  {plansList.map((plan: any) => (
                    <div 
                      key={plan.id}
                      id={`plan-card-${plan.id}`}
                      className="bg-white border border-slate-200/80 rounded-lg p-3.5 shadow-3xs w-[220px] shrink-0 snap-center flex flex-col justify-between relative"
                    >
                      {plan.badge && (
                        <span className="absolute -top-2 left-4 bg-amber-500 text-white font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {plan.badge}
                        </span>
                      )}

                      <div className="space-y-2.5">
                        {/* Title and pricing */}
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{plan.name}</h3>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-xl font-bold tracking-tight text-slate-900">₹{plan.premium.toLocaleString('en-IN')}</span>
                            <span className="text-[9px] text-slate-400 font-bold">/ year</span>
                          </div>
                          <p className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-1">
                            ₹{plan.sumInsured.toLocaleString('en-IN')} Cover Limit
                          </p>
                        </div>

                        {/* Benefits list (Plain language) */}
                        <div className="space-y-1">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Key Benefits</p>
                          <ul className="space-y-1">
                            {plan.benefits.map((ben: string, idx: number) => (
                              <li key={idx} className="flex gap-1.5 items-start text-[10px] leading-tight text-slate-600 font-medium">
                                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{ben}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Buy Action */}
                      <button 
                        id={`plan-buy-btn-${plan.id}`}
                        onClick={() => handleInitiateBuy(plan)}
                        className="w-full bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-[10px] py-2 rounded-lg shadow-3xs cursor-pointer mt-3.5 transition-colors text-center"
                      >
                        Buy This Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secure note */}
              <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-[10px] text-slate-500 flex items-start gap-2" id="explore-trust-note">
                <ShieldCheck className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                <p className="leading-tight">
                  Policies are processed instantly and secured within the IndusInd core ledger. Under Section 80D of the IT Act, premiums qualify for tax deductions.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Secure Bank Checkout Drawer */}
      {showCheckout && (
        <div className="absolute inset-0 bg-black/60 z-30 flex flex-col justify-end" id="checkout-backdrop">
          <div className="bg-white rounded-t-xl p-4.5 space-y-3 shadow-xl max-h-[85%] overflow-y-auto animate-slideUp" id="checkout-drawer">
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-[#8B1A1A]" /> Secure Payment Terminal
              </h3>
              <button 
                onClick={() => setShowCheckout(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                You are purchasing <strong className="text-slate-800">{activePlan.name}</strong> under the IndusInd Bank Kavach protection portfolio.
              </p>

              {/* Debit Source details */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Linked Account</span>
                  <span className="font-bold text-slate-800">IndusInd Savings AC/4921</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Balance</span>
                  <span className="font-bold text-slate-700">₹1,84,320.50</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-150 font-bold text-xs">
                  <span className="text-slate-950">Net Premium Charge</span>
                  <span className="text-[#8B1A1A]">₹{activePlan.premium.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* AI auto-saving badge note (Styled premium sky-blue AI styling) */}
              <div className="p-2.5 bg-[#E0F2FE] border border-sky-200 rounded-lg text-[10px] text-slate-700 flex items-start gap-2">
                <Sparkles className="h-4.5 w-4.5 text-[#0369A1] shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="font-bold text-[#0369A1]">Auto Vault Archival Active</p>
                  <p className="mt-0.5 leading-relaxed text-slate-600 font-medium">
                    Once paid, your PDF policy certificate is generated in real-time and auto-indexed to your <strong>Document Vault</strong> for digital access.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1.5">
              <button 
                onClick={() => setShowCheckout(false)}
                className="flex-1 border border-slate-200 text-slate-700 font-bold text-xs py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                id="checkout-confirm-payment-btn"
                onClick={confirmPurchase}
                className="flex-1 bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-xs py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Pay ₹{activePlan.premium.toLocaleString('en-IN')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
