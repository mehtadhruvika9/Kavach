import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  ShieldCheck, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  HeartHandshake,
  Check,
  CreditCard,
  X
} from 'lucide-react';
import { FamilyMember, Policy, VaultDocument, ScreenId } from '../types';

interface FamilyProps {
  family: FamilyMember[];
  onAddPolicy: (policy: Policy) => void;
  onAddDocument: (doc: VaultDocument) => void;
  onNavigate: (screen: ScreenId) => void;
  onUpdateFamilyCoverage: (memberId: string, policyName: string) => void;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'action') => void;
}

export const FamilyHub: React.FC<FamilyProps> = ({
  family,
  onAddPolicy,
  onAddDocument,
  onNavigate,
  onUpdateFamilyCoverage,
  addLog
}) => {
  const [showSeniorPlans, setShowSeniorPlans] = useState<boolean>(false);
  const [seniorSuccess, setSeniorSuccess] = useState<boolean>(false);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const seniorPlans = [
    {
      id: 'sen-gold',
      name: 'Indus Senior Care Gold',
      premium: 14200,
      sumInsured: 500000,
      badge: 'Most Popular',
      benefits: [
        'Zero co-payment option for pre-existing disease treatments',
        'Direct 24/7 priority line to senior care hospital specialists',
        'Home care nursing assistance and cashless ambulance dispatch'
      ],
      covered: ['Pre-existing diseases covered from day 1', 'Alternative AYUSH remedies', 'Free bi-annual health screenings'],
      notCovered: ['Voluntary cosmetic procedures', 'Non-accident dental treatments']
    },
    {
      id: 'sen-plat',
      name: 'Indus Senior Care Platinum',
      premium: 22800,
      sumInsured: 1000000,
      badge: 'Comprehensive Cover',
      benefits: [
        'Global critical cover including air ambulance emergency transports',
        'Annual premium fully tax-deductible under Section 80D up to ₹50,000',
        'Daily cash hospital allowance of ₹5,000 for incidental expenses'
      ],
      covered: ['International emergency support', 'Private room suite upgrades', 'Specialist physician home consultations'],
      notCovered: ['Standard non-medical accessories charges (syringes/gloves/aprons)']
    }
  ];

  const handleTriggerFatherFlow = (member: FamilyMember) => {
    if (member.relation === 'Father') {
      addLog(`Tapped on ${member.name} (Father). Opening Senior Citizen Health Plans.`, 'action');
      setShowSeniorPlans(true);
    } else {
      addLog(`Clicked family member: ${member.name}`, 'info');
    }
  };

  const handleInitiateSeniorBuy = (plan: any) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
    addLog(`Initiating senior citizen coverage purchase: ${plan.name}`, 'info');
  };

  const confirmSeniorPurchase = () => {
    // 1. Create Senior Citizen Policy
    const newPolicy: Policy = {
      id: `senior-health-${Date.now()}`,
      name: selectedPlan.name,
      category: 'health',
      insurer: 'HDFC Ergo General Insurance',
      status: 'active',
      renewDate: '16 Jul 2027',
      sumInsured: selectedPlan.sumInsured,
      premium: selectedPlan.premium,
      nomineeName: 'Rahul Sharma (Son)',
      policyNo: `IND-HL-SEN-${Math.floor(100000 + Math.random() * 900000)}`,
      coverageDetails: {
        covered: selectedPlan.covered.map((c: string) => `${c} protection under senior-citizen terms`),
        notCovered: selectedPlan.notCovered.map((nc: string) => `${nc} is excluded under senior terms`)
      }
    };

    // 2. Create Vault Document
    const newDoc: VaultDocument = {
      id: `doc-senior-${Date.now()}`,
      name: `Father_Ramesh_${selectedPlan.name.replace(/\s+/g, '_')}_Policy.pdf`,
      category: 'Policies',
      size: '1.6 MB',
      dateAdded: '16 Jul 2026'
    };

    onAddPolicy(newPolicy);
    onAddDocument(newDoc);
    onUpdateFamilyCoverage('fam-ramesh', 'Senior Health Insurance');

    setShowCheckout(false);
    setSeniorSuccess(true);
    addLog(`Successfully enrolled Father Ramesh Sharma in ${selectedPlan.name}. Coverage limits active.`, 'success');

    setTimeout(() => {
      setSeniorSuccess(false);
      setShowSeniorPlans(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans" id="screen-family-container">
      {/* Header */}
      <div className="bg-[#8B1A1A] text-white pt-5 pb-4 px-4 shadow-sm flex items-center justify-between shrink-0" id="family-header">
        <div className="flex items-center gap-3">
          <button 
            id="family-back-btn"
            onClick={() => onNavigate('dashboard')} 
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-display font-semibold">Family Protection Hub</h1>
        </div>
        <Users className="h-5 w-5 text-white/80" />
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 no-scrollbar flex flex-col justify-between" id="family-scroll-content">
        
        {showSeniorPlans ? (
          /* Senior Citizen Plan Selection sub-flow */
          <div className="space-y-3 flex-1 flex flex-col justify-between animate-fadeIn" id="senior-plans-flow">
            <div className="space-y-3">
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-4.5 w-4.5 text-[#8B1A1A]" />
                  <h2 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Senior Citizen Health Plans</h2>
                </div>
                <button 
                  onClick={() => setShowSeniorPlans(false)}
                  className="text-[9px] font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-0.5 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {seniorSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-start gap-2 text-[11px] text-emerald-950 animate-fadeIn" id="senior-success-toast">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Father Enrolled Successfully</p>
                    <p className="mt-0.5 text-emerald-700">Premium of ₹{selectedPlan.premium.toLocaleString('en-IN')} debited from AC/4921. Tax benefits locked.</p>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-slate-500 leading-relaxed px-1">
                Protect your parents. Tailored senior health plans with instant cashless support in Mumbai, zero co-payments, and pre-existing disease protection.
              </p>

              {/* Plans side-by-side / list cards */}
              <div className="space-y-2.5" id="senior-plans-list">
                {seniorPlans.map((plan) => (
                  <div key={plan.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-3xs space-y-2.5 relative overflow-hidden" id={`senior-plan-${plan.id}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] bg-[#8B1A1A] text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                          {plan.badge}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 mt-1">{plan.name}</h3>
                        <p className="text-[9px] text-slate-500 mt-0.5">₹{plan.sumInsured.toLocaleString('en-IN')} Cashless Cover Limit</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#8B1A1A] block">₹{plan.premium.toLocaleString('en-IN')}</span>
                        <span className="text-[9px] text-slate-400 font-bold">/ year</span>
                      </div>
                    </div>

                    <ul className="space-y-1 border-t border-slate-100 pt-2.5">
                      {plan.benefits.map((b, idx) => (
                        <li key={idx} className="flex gap-1.5 items-start text-[10px] text-slate-600 leading-tight">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <button 
                      id={`buy-senior-btn-${plan.id}`}
                      onClick={() => handleInitiateSeniorBuy(plan)}
                      className="w-full bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-[10px] py-2 rounded-lg cursor-pointer transition-colors text-center"
                    >
                      Enrol Father Ramesh Sharma
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Normal Family Members Listing view */
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1" id="family-stats-header">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Family Coverage Analysis</span>
                <span className="text-[9px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">4 Registered</span>
              </div>

              {/* Members Grid Stack */}
              <div className="space-y-2.5" id="family-cards-list">
                {family.map((member) => {
                  const hasIssue = member.hasCoverageIssue;

                  return (
                    <div 
                      key={member.id}
                      id={`family-card-${member.id}`}
                      onClick={() => handleTriggerFatherFlow(member)}
                      className={`bg-white border rounded-lg p-2.5 shadow-3xs cursor-pointer hover:border-[#8B1A1A] transition-all flex items-center justify-between ${
                        hasIssue ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${member.avatarColor}`}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-bold text-slate-900 leading-none">{member.name}</h3>
                            <span className="text-[9px] text-slate-400 font-bold font-mono">({member.relation}, {member.age})</span>
                          </div>
                          
                          {/* Active policies chips */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {member.policiesList.length === 0 ? (
                              <span className="text-[9px] text-amber-800 font-bold bg-amber-100 border border-amber-200 px-1.5 py-0.2 rounded">
                                No active insurance coverage
                              </span>
                            ) : (
                              member.policiesList.map((p, idx) => (
                                <span key={idx} className="text-[8px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded font-bold">
                                  ✓ {p}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      {hasIssue ? (
                        <button 
                          id="family-hub-add-coverage-btn"
                          onClick={(e) => { e.stopPropagation(); handleTriggerFatherFlow(member); }}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[9px] px-2.5 py-1 rounded flex items-center gap-0.5 shadow-3xs cursor-pointer transition-colors shrink-0"
                        >
                          <Plus className="h-3 w-3" /> Cover
                        </button>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Indus AI Assistant Tip (Styled premium sky-blue AI diagnosis panel) */}
              <div className="bg-[#E0F2FE] border border-sky-200 rounded-lg p-2.5 flex items-start gap-2 text-[10px] text-slate-700 font-medium" id="family-ai-banner">
                <Sparkles className="h-4 w-4 text-[#0369A1] shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="font-bold text-[#0369A1]">Indus AI Coverage Diagnosis</p>
                  <p className="mt-0.5 leading-relaxed text-slate-600">
                    Senior citizens carry a <strong>74% higher risk</strong> of emergency medical hospitalizations. Adding father Ramesh Sharma under the Gold plan saves up to ₹15,000 under Section 80D.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Add Family Member Button */}
            <div className="pt-3 border-t border-slate-150 shrink-0">
              <button 
                id="family-add-new-member-btn"
                onClick={() => addLog('Opened dialog to register additional family members', 'info')}
                className="w-full bg-white hover:bg-slate-50 text-[#8B1A1A] border border-[#8B1A1A]/35 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <UserPlus className="h-4.5 w-4.5" /> Add New Family Member
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Senior Citizen Checkout Drawer */}
      {showCheckout && (
        <div className="absolute inset-0 bg-black/60 z-30 flex flex-col justify-end" id="senior-checkout-backdrop">
          <div className="bg-white rounded-t-xl p-4.5 space-y-3 shadow-xl max-h-[85%] overflow-y-auto animate-slideUp" id="senior-checkout-drawer">
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-[#8B1A1A]" /> Secure Parent Enrollment
              </h3>
              <button 
                onClick={() => setShowCheckout(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-[11px] leading-relaxed">
              <p className="text-slate-600 font-medium">
                You are purchasing <strong className="text-slate-800">{selectedPlan.name}</strong> to insure your father <strong>Ramesh Sharma (65)</strong>.
              </p>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Debited From</span>
                  <span className="font-bold text-slate-800">Savings AC/4921</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Account Balance</span>
                  <span className="font-bold text-slate-700">₹1,84,320.50</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-150 font-bold text-xs">
                  <span className="text-slate-955">Annual Premium Charge</span>
                  <span className="text-[#8B1A1A]">₹{selectedPlan.premium.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[9px] text-slate-500 flex items-start gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <p>Tax saving certificate (Section 80D) for ₹{selectedPlan.premium.toLocaleString('en-IN')} will be generated instantly and saved under Father's documents.</p>
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
                id="senior-confirm-pay-btn"
                onClick={confirmSeniorPurchase}
                className="flex-1 bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-xs py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Enrol & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
