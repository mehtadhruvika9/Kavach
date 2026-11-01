import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Car, 
  Activity, 
  Luggage, 
  Calendar, 
  FileText, 
  Camera, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  ChevronRight, 
  RefreshCw, 
  Clock, 
  Upload,
  Info,
  BadgeAlert,
  Loader2
} from 'lucide-react';
import { Claim, ScreenId, Policy } from '../types';

interface ClaimEasyProps {
  policies: Policy[];
  onNavigate: (screen: ScreenId) => void;
  onSubmitClaim: (claim: Claim) => void;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'action') => void;
}

export const ClaimEasy: React.FC<ClaimEasyProps> = ({
  policies,
  onNavigate,
  onSubmitClaim,
  addLog
}) => {
  const [claimStep, setClaimStep] = useState<number>(1); // 1 = Form, 2 = AI Pre-fill, 3 = Camera/Scan, 4 = Results, 5 = Confirmation/Tracker
  const [incidentType, setIncidentType] = useState<'accident' | 'illness' | 'loss_theft' | ''>('');
  const [incidentDate, setIncidentDate] = useState<string>('2026-07-15');
  const [description, setDescription] = useState<string>('');
  
  // Camera simulation states
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [capturedDocName, setCapturedDocName] = useState<string>('');
  
  // Scanner audit checks
  const [firUploaded, setFirUploaded] = useState<boolean>(true);
  const [estimateUploaded, setEstimateUploaded] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  
  // Tracker milestones
  const [claimMilestone, setClaimMilestone] = useState<number>(1);

  const handleSelectIncident = (type: 'accident' | 'illness' | 'loss_theft') => {
    setIncidentType(type);
    addLog(`Selected claim incident type: ${type.toUpperCase()}`, 'action');
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentType) {
      addLog('Please select an incident type', 'warning');
      return;
    }
    addLog('Submitted claim incident intake. Triggering Indus AI pre-fill evaluation...', 'info');
    setClaimStep(2);
  };

  const handleConfirmAiPreFill = () => {
    addLog('Approved Indus AI pre-filled fields. Launching Smart Document Scanner.', 'action');
    setClaimStep(3);
  };

  const handleSimulateCameraCapture = (docType: string) => {
    setIsCapturing(true);
    setCapturedDocName(docType);
    addLog(`Opening simulated camera view for: ${docType}`, 'info');
    
    setTimeout(() => {
      setIsCapturing(false);
      addLog(`Captured document successfully: ${docType}`, 'success');
      if (docType === 'Repair Estimate') {
        setEstimateUploaded(true);
        setClaimStep(4); // Return to list
      }
    }, 3000);
  };

  const handleTriggerScannerResults = () => {
    setIsScanning(true);
    addLog('Reviewing uploaded files with Indus OCR scanner...', 'info');
    setTimeout(() => {
      setIsScanning(false);
      setClaimStep(4);
      addLog('AI Document Scanner audits completed. Repair Estimate flagged as missing.', 'warning');
    }, 1800);
  };

  const handleFinalSubmitClaim = () => {
    const finalClaim: Claim = {
      id: 'claim-4521',
      policyId: incidentType === 'accident' ? 'motor-indusind' : incidentType === 'illness' ? 'health-indusind' : 'life-indusind',
      category: incidentType === 'accident' ? 'motor' : incidentType === 'illness' ? 'health' : 'life',
      type: incidentType,
      date: incidentDate,
      description: description,
      hasFilerDetails: true,
      documents: {
        policyFound: true,
        firUploaded: firUploaded,
        repairEstimateUploaded: estimateUploaded
      },
      status: 'submitted',
      claimNo: 'CLM2026-4521'
    };

    onSubmitClaim(finalClaim);
    setClaimStep(5);
    addLog('Final Claim submitted to cashless panel desk.', 'success');
  };

  const advanceClaimTracker = () => {
    if (claimMilestone < 5) {
      const next = claimMilestone + 1;
      setClaimMilestone(next);
      const stageNames = [
        'Claim Registered',
        'AI Intelligent Document Verified',
        'Surveyor/Claims Assessor Dispatched',
        'Hospitalization/Repair Liability Approved',
        'Cashless Settlement Dispatched to Hospital/Workshop'
      ];
      addLog(`Claim progress advanced to: ${stageNames[next - 1]}`, 'success');
    }
  };

  const getAssociatedPolicy = (): string => {
    if (incidentType === 'accident') return 'Car Secure Comprehensive (IndusInd Bank)';
    if (incidentType === 'illness') return 'Health Optima Super (IndusInd Bank)';
    return 'Indus Term Life Protection (IndusInd Bank)';
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans" id="screen-claim-container">
      {/* Header */}
      <div className="bg-[#8B1A1A] text-white pt-5 pb-4 px-4 shadow-sm flex items-center gap-3 shrink-0" id="claim-header">
        <button 
          id="claim-back-btn"
          onClick={() => {
            if (claimStep === 1) onNavigate('dashboard');
            else setClaimStep(claimStep - 1);
          }} 
          className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-display font-semibold">ClaimEasy™ Desk</h1>
          <p className="text-[9px] text-white/70">AI-Powered Cashless Claim Settlement</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 no-scrollbar flex flex-col justify-between" id="claim-scroll-content">
        
        {/* STEP 1: INITIAL COMPLAINT FORM */}
        {claimStep === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-3 flex-1 flex flex-col justify-between" id="claim-step1-form">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Step 1: What happened?</label>
                <div className="grid grid-cols-3 gap-2" id="incident-type-selector">
                  {/* Accident */}
                  <div 
                    id="type-accident"
                    onClick={() => handleSelectIncident('accident')}
                    className={`border rounded-lg p-2.5 text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      incidentType === 'accident' 
                        ? 'border-[#8B1A1A] bg-[#8B1A1A]/5 font-bold text-slate-900 ring-1 ring-[#8B1A1A]/30' 
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Car className={`h-5 w-5 ${incidentType === 'accident' ? 'text-[#8B1A1A]' : 'text-slate-400'}`} />
                    <span className="text-[10px]">Vehicle Accident</span>
                  </div>

                  {/* Illness */}
                  <div 
                    id="type-illness"
                    onClick={() => handleSelectIncident('illness')}
                    className={`border rounded-lg p-2.5 text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      incidentType === 'illness' 
                        ? 'border-[#8B1A1A] bg-[#8B1A1A]/5 font-bold text-slate-900 ring-1 ring-[#8B1A1A]/30' 
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Activity className={`h-5 w-5 ${incidentType === 'illness' ? 'text-[#8B1A1A]' : 'text-slate-400'}`} />
                    <span className="text-[10px]">Medical Illness</span>
                  </div>

                  {/* Loss */}
                  <div 
                    id="type-loss"
                    onClick={() => handleSelectIncident('loss_theft')}
                    className={`border rounded-lg p-2.5 text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      incidentType === 'loss_theft' 
                        ? 'border-[#8B1A1A] bg-[#8B1A1A]/5 font-bold text-slate-900 ring-1 ring-[#8B1A1A]/30' 
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Luggage className={`h-5 w-5 ${incidentType === 'loss_theft' ? 'text-[#8B1A1A]' : 'text-slate-400'}`} />
                    <span className="text-[10px]">Loss & Theft</span>
                  </div>
                </div>
              </div>

              {/* Date selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Step 2: When did it happen?</label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3 h-4 w-4 text-slate-400" />
                  <input 
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-[11px] font-bold focus:border-[#8B1A1A] outline-none shadow-3xs"
                    id="incident-date-picker"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Step 3: Brief description</label>
                <textarea 
                  rows={2.5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the incident briefly (e.g. car scraped by wall near Bandra, or admitted for viral fever at Lilavati Hospital)"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-[11px] leading-relaxed focus:border-[#8B1A1A] outline-none shadow-3xs"
                  id="incident-description-input"
                />
              </div>

              <div className="p-2.5 bg-[#E0F2FE]/15 border border-[#BAE6FD] rounded-lg text-[10px] text-slate-600 flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-[#0369A1] shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="font-bold text-slate-800">Indus AI Instant Assist</p>
                  <p className="mt-0.5 leading-relaxed">
                    By submitting this basic information, our integrated neural OCR will auto-locate associated policy bounds and check cashless panels for instant clearance.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-3 border-t border-slate-150 shrink-0">
              <button 
                type="submit"
                disabled={!incidentType || !description}
                className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer ${
                  incidentType && description 
                    ? 'bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                id="claim-intake-submit-btn"
              >
                Intake Claim <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: AI FORM PRE-FILLED CONFIRMATION */}
        {claimStep === 2 && (
          <div className="space-y-3 flex-1 flex flex-col justify-between" id="claim-step2-ai-prefill">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 p-1.5 bg-[#E0F2FE]/15 rounded-lg border border-[#BAE6FD]" id="ai-analyzing-panel">
                <div className="bg-[#E0F2FE] text-[#0369A1] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#BAE6FD] flex items-center gap-0.5">
                  <Sparkles className="h-3 w-3 text-[#0369A1] shrink-0 animate-pulse" />
                  INDUS AI
                </div>
                <span className="text-[11px] font-bold text-slate-800">Pre-filled Claim Form</span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed px-1">
                Our model scanned your protection wallet and compiled the following claim dossier. Please verify the matching details:
              </p>

              {/* Pre-fill Grid */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-3xs space-y-2" id="ai-prefilled-fields">
                <div className="grid grid-cols-2 gap-2.5 pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase font-bold">Claimant Name</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      Rahul Sharma <span className="bg-[#E0F2FE] text-[#0369A1] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#BAE6FD] inline-flex items-center gap-0.5"><Sparkles className="h-2 w-2 text-[#0369A1]" /> AI VERIFIED</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase font-bold">Linked Policy</span>
                    <span className="text-xs font-bold text-slate-800 truncate block max-w-[130px]">{getAssociatedPolicy().split(' ')[0]} Policy</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase font-bold">Incident Category</span>
                    <span className="text-xs font-bold text-slate-800 uppercase">{incidentType.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase font-bold">Date of Event</span>
                    <span className="text-xs font-bold text-slate-800">{incidentDate}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] text-slate-400 block uppercase font-bold">Description Summary</span>
                  <p className="text-[10px] text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-150">
                    "{description}"
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[10px] text-emerald-900 flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Cover Active Verified:</strong> Sum Insured limits are sufficient to accommodate cashless processing of this claim.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-3 border-t border-slate-150 shrink-0">
              <button 
                onClick={() => setClaimStep(1)}
                className="flex-1 border border-slate-200 text-slate-700 font-bold text-[11px] py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Re-edit info
              </button>
              <button 
                id="ai-prefill-confirm-btn"
                onClick={handleConfirmAiPreFill}
                className="flex-1 bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-[11px] py-2 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                Confirm & Scan Documents
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MOCK CAMERA / SCANNER VIEWPORT */}
        {claimStep === 3 && (
          <div className="space-y-3 flex-1 flex flex-col justify-between" id="claim-step3-camera">
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="space-y-0.5 shrink-0">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">AI Document Scanner</h3>
                <p className="text-[11px] text-slate-500">
                  Align your document inside the camera frame. The scanner will automatically extract claims data.
                </p>
              </div>

              {/* CAMERA VIEWPORT MOCK */}
              <div className="flex-1 bg-slate-900 rounded-lg border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-4 text-white min-h-[220px]" id="camera-viewport-mock">
                {isCapturing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 space-y-2 font-bold" id="camera-loading-flash">
                    <Loader2 className="h-7 w-7 text-[#8B1A1A] animate-spin" />
                    <div className="space-y-0.5 text-center">
                      <p className="text-[11px] text-white uppercase tracking-wider">AI OCR Scanning</p>
                      <p className="text-[9px] text-slate-400">Extracting fields from {capturedDocName}...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Viewfinder brackets */}
                    <div className="absolute top-4 left-4 h-5 w-5 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute top-4 right-4 h-5 w-5 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute bottom-4 right-4 h-5 w-5 border-b-2 border-r-2 border-emerald-400" />

                    {/* Scanning Laser Line */}
                    <div className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-sm shadow-emerald-500/50 scanning-line" />

                    <div className="text-center space-y-1.5 max-w-xs px-4" id="camera-status-text">
                      <Camera className="h-9 w-9 text-emerald-400 mx-auto animate-pulse" />
                      <p className="text-[11px] font-bold uppercase tracking-wider">Camera Viewfinder Active</p>
                      <p className="text-[9px] text-slate-400">Positioning repair estimate sheet, bills, or medical prescriptions inside bracket limits.</p>
                    </div>
                  </>
                )}
              </div>

              {/* Option to trigger scanner results directly */}
              {!isCapturing && (
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between" id="instant-scan-trigger">
                  <span className="text-[10px] text-slate-500 font-medium">Simulate scanner results directly?</span>
                  <button 
                    id="auto-scan-simulate-btn"
                    onClick={handleTriggerScannerResults}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded cursor-pointer transition-colors flex items-center gap-1"
                  >
                    Run OCR Audit <Sparkles className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-150 shrink-0 flex gap-2">
              <button 
                onClick={() => setClaimStep(2)}
                className="flex-1 border border-slate-200 text-slate-700 font-bold text-xs py-2 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: AI SCANNER RESULTS CHECKLIST */}
        {claimStep === 4 && (
          <div className="space-y-3 flex-1 flex flex-col justify-between" id="claim-step4-checklist">
            <div className="space-y-3">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">AI Scanner Audit Results</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Indus AI scanned your document vault and uploaded media. Please address any missing documents flagged to prevent processing blocks.
                </p>
              </div>

              {/* Checklist Cards */}
              <div className="space-y-2" id="scan-audit-list">
                
                {/* 1. Policy Document */}
                <div className="bg-white border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between shadow-3xs" id="audit-doc-policy">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-emerald-50 rounded text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Policy document</p>
                      <p className="text-[9px] text-slate-400">Found auto-archived in your Secure Vault</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded uppercase">Matched</span>
                </div>

                {/* 2. FIR Copy / Prescription */}
                <div className="bg-white border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between shadow-3xs" id="audit-doc-fir">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-emerald-50 rounded text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">FIR / Accident details copy</p>
                      <p className="text-[9px] text-slate-400">Scanned & verified via AI OCR</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded uppercase">Verified</span>
                </div>

                {/* 3. Repair Estimate (Missing or Uploaded) */}
                {estimateUploaded ? (
                  <div className="bg-white border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between shadow-3xs animate-fadeIn" id="audit-doc-estimate-complete">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-emerald-50 rounded text-emerald-600">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Repair Estimate / Prescriptions</p>
                        <p className="text-[9px] text-slate-400">Uploaded copy successfully extracted</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded uppercase font-mono">OK</span>
                  </div>
                ) : (
                  <div className="bg-[#FFBF00] border border-amber-500 rounded-lg p-2.5 flex items-center justify-between shadow-xs text-slate-950" id="audit-doc-estimate-missing">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-slate-950/10 rounded text-slate-950">
                        <AlertTriangle className="h-4 w-4 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-950">Repair Estimate / Prescription</p>
                        <p className="text-[9px] text-slate-900 font-semibold">Required item missing from scan payload</p>
                      </div>
                    </div>
                    
                    <button 
                      id="scanner-upload-repair-estimate-btn"
                      onClick={() => handleSimulateCameraCapture('Repair Estimate')}
                      className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-[9px] px-2.5 py-1.5 rounded flex items-center gap-1 shadow-3xs cursor-pointer transition-colors"
                    >
                      <Camera className="h-3.5 w-3.5" /> Capture
                    </button>
                  </div>
                )}
              </div>

              {/* Warning/Success Banner */}
              {estimateUploaded ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[10px] text-emerald-950 flex items-start gap-2" id="audit-success-alert">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">All documents verified successfully</p>
                    <p className="mt-0.5 text-emerald-700 leading-relaxed">No delays detected. This claim qualifies for express 1-click cashless panel authorization.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FFBF00] border border-amber-500 rounded-lg p-2.5 flex items-start gap-2 text-[10px] text-slate-950 font-bold" id="audit-warning-alert">
                  <AlertTriangle className="h-4.5 w-4.5 text-slate-950 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <p className="font-bold">Please upload repair estimate to avoid processing delays</p>
                    <p className="mt-0.5 text-slate-900 font-semibold leading-relaxed">Missing estimates will block cashless authorization. Panel garage needs verified damage lists to start repairs.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-150 shrink-0 flex gap-2.5">
              <button 
                onClick={() => setClaimStep(3)}
                className="flex-1 border border-slate-200 text-slate-700 font-bold text-[11px] py-2 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Retake Scans
              </button>
              <button 
                id="submit-claim-final-btn"
                disabled={!estimateUploaded}
                onClick={handleFinalSubmitClaim}
                className={`flex-1 py-2 rounded-lg font-bold text-[11px] shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  estimateUploaded 
                    ? 'bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Cashless Claim
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION & LIVE STATUS TRACKER */}
        {claimStep === 5 && (
          <div className="space-y-4 flex-1 flex flex-col justify-between" id="claim-step5-tracker">
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-1.5 shadow-2xs" id="claim-success-card">
                <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-950 mt-1">Claim Securely Submitted</h3>
                <p className="text-[11px] text-emerald-800">Your claim has been dispatched to Bajaj Allianz panel desk.</p>
                <div className="text-[10px] font-mono text-emerald-700 bg-white/50 py-1 px-2.5 rounded inline-block font-semibold">
                  Claim ID: #CLM2026-4521
                </div>
              </div>

              {/* Live Tracker widget */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-4" id="claim-milestones">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Claim Progress Milestones</h4>
                
                <div className="space-y-4 relative pl-5 border-l-2 border-slate-200" id="claim-tracker-lines">
                  
                  {/* Step 1: Registered */}
                  <div className="relative" id="claim-milestone-1">
                    <div className="absolute -left-[27px] top-0 h-4.5 w-4.5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 border border-emerald-300">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-950">Claim Intake Registered</p>
                      <p className="text-[9px] text-slate-500">Submitted on July 16, 2026 • 03:21 AM</p>
                    </div>
                  </div>

                  {/* Step 2: Docs Verified */}
                  <div className="relative" id="claim-milestone-2">
                    <div className={`absolute -left-[27px] top-0 h-4.5 w-4.5 rounded-full flex items-center justify-center border ${
                      claimMilestone >= 2 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                        : 'bg-amber-100 text-amber-700 border-amber-300'
                    }`}>
                      {claimMilestone >= 2 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      )}
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold ${claimMilestone >= 2 ? 'text-slate-950' : 'text-slate-800'}`}>
                        AI Document Verification Check
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {claimMilestone >= 2 ? 'Security checks, FIR check & estimates completed' : 'OCR verification in progress...'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Assessor Dispatched */}
                  <div className="relative" id="claim-milestone-3">
                    <div className={`absolute -left-[27px] top-0 h-4.5 w-4.5 rounded-full flex items-center justify-center border ${
                      claimMilestone >= 3 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                        : claimMilestone === 2 
                        ? 'bg-amber-100 text-amber-700 border-amber-300' 
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {claimMilestone >= 3 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : claimMilestone === 2 ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold ${claimMilestone >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>
                        Claims Surveyor Assessment
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {claimMilestone >= 3 ? 'Surveyor completed damage report audit' : claimMilestone === 2 ? 'Routing local panel inspector...' : 'Pending assessment'}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Approved */}
                  <div className="relative" id="claim-milestone-4">
                    <div className={`absolute -left-[27px] top-0 h-4.5 w-4.5 rounded-full flex items-center justify-center border ${
                      claimMilestone >= 4 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                        : claimMilestone === 3 
                        ? 'bg-amber-100 text-amber-700 border-amber-300' 
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {claimMilestone >= 4 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : claimMilestone === 3 ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold ${claimMilestone >= 4 ? 'text-slate-900' : 'text-slate-400'}`}>
                        Cashless Liability Authorized
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {claimMilestone >= 4 ? 'Bajaj Allianz approved full cashless repair liability' : 'Pending insurer calculation approval'}
                      </p>
                    </div>
                  </div>

                  {/* Step 5: Dispatched */}
                  <div className="relative" id="claim-milestone-5">
                    <div className={`absolute -left-[27px] top-0 h-4.5 w-4.5 rounded-full flex items-center justify-center border ${
                      claimMilestone >= 5 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                        : claimMilestone === 4 
                        ? 'bg-amber-100 text-amber-700 border-amber-300' 
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {claimMilestone >= 5 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : claimMilestone === 4 ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold ${claimMilestone >= 5 ? 'text-slate-900' : 'text-slate-400'}`}>
                        Settlement Dispatched
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {claimMilestone >= 5 ? 'Direct credit settlement finalized with panel workshop' : 'Pending final clearance payout transfer'}
                      </p>
                    </div>
                  </div>

                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-lg flex items-start gap-1.5">
                  <Info className="h-4 w-4 text-[#8B1A1A] mt-0.5 shrink-0" />
                  <p>Vehicle repairs can begin immediately at any authorized cashless workshop. Estimated complete resolution: 6-8 working days.</p>
                </div>
              </div>

              {/* Simulation Progress Advancer */}
              {claimMilestone < 5 && (
                <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between" id="claim-progress-simulator">
                  <span className="text-[10px] text-slate-500">Testing claim progress?</span>
                  <button 
                    id="sim-advance-claim-tracker-btn"
                    onClick={advanceClaimTracker}
                    className="bg-[#8B1A1A]/10 hover:bg-[#8B1A1A]/20 text-[#8B1A1A] font-bold text-[10px] px-2.5 py-1 rounded cursor-pointer transition-colors"
                  >
                    Advance claim stage →
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Back Button */}
            <div className="pt-4 border-t border-slate-150 shrink-0">
              <button 
                id="claim-flow-done-btn"
                onClick={() => onNavigate('dashboard')}
                className="w-full bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
