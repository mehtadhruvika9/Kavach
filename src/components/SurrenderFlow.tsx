import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  ChevronRight, 
  Lock, 
  KeyRound, 
  PenTool, 
  CheckCircle, 
  RefreshCw, 
  Clock, 
  HelpCircle,
  TrendingDown,
  Sparkles,
  Info
} from 'lucide-react';
import { Policy, ScreenId, SurrenderState } from '../types';

interface SurrenderProps {
  policies: Policy[];
  onNavigate: (screen: ScreenId) => void;
  onSurrenderComplete: (policyId: string) => void;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'action') => void;
  language?: 'en' | 'hi';
}

export const SurrenderFlow: React.FC<SurrenderProps> = ({
  policies,
  onNavigate,
  onSurrenderComplete,
  addLog,
  language = 'en'
}) => {
  const [step, setStep] = useState<number>(1);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasSigned, setHasSigned] = useState<boolean>(false);
  const [trackerStep, setTrackerStep] = useState<number>(1); // 1 = Requested, 2 = Verified, 3 = Processing, 4 = Approved, 5 = Credited
  const [timer, setTimer] = useState<number>(30);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Timer for OTP resend
  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Setup canvas for drawing signature
  useEffect(() => {
    if (step === 3 && canvasRef.current) {
      const canvas = canvasRef.current;
      // Handle high-density screens
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;

      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = '#8B1A1A'; // brand maroon
        context.lineWidth = 2.5;
        contextRef.current = context;
      }
    }
  }, [step]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    if (!contextRef.current) return;
    
    // Get mouse/touch coordinates
    let clientX, clientY;
    if ('touches' in nativeEvent) {
      clientX = nativeEvent.touches[0].clientX;
      clientY = nativeEvent.touches[0].clientY;
    } else {
      clientX = nativeEvent.clientX;
      clientY = nativeEvent.clientY;
    }

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return;

    let clientX, clientY;
    if ('touches' in nativeEvent) {
      clientX = nativeEvent.touches[0].clientX;
      clientY = nativeEvent.touches[0].clientY;
    } else {
      clientX = nativeEvent.clientX;
      clientY = nativeEvent.clientY;
    }

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (!canvasRef.current || !contextRef.current) return;
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    addLog('Cleared e-Signature pad', 'info');
  };

  // OTP Box inputs
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError(null);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleStep1Continue = () => {
    if (!termsAccepted) return;
    addLog('Accepted terms. Navigated to OTP authorization stage.', 'action');
    setStep(2);
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setOtpError('Please enter complete 4-digit OTP code');
      return;
    }
    // Simple mock check
    if (enteredOtp !== '4821') {
      setOtpError('Invalid OTP code. Please enter 4821 for simulation.');
      addLog('Failed surrender OTP verification.', 'warning');
      return;
    }

    addLog('OTP verification successful.', 'success');
    setStep(3);
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    setTimer(30);
    setOtp(['', '', '', '']);
    setOtpError(null);
    addLog('Simulated OTP re-sent to mobile number +91 98*** **421 (Default Code: 4821)', 'info');
    const firstInput = document.getElementById('otp-input-0');
    if (firstInput) (firstInput as HTMLInputElement).focus();
  };

  const handleSubmitSurrender = () => {
    if (!hasSigned) {
      addLog('Signature required to submit surrender request', 'warning');
      return;
    }

    addLog('E-signed surrender mandate. Submitting to IndusInd Bank.', 'info');
    onSurrenderComplete('life-indusind'); // Update policy state to surrendered
    setStep(4);
    addLog('Policy surrender submitted successfully. Started stage-1 tracking.', 'success');
  };

  const advanceTracker = () => {
    if (trackerStep < 5) {
      const next = trackerStep + 1;
      setTrackerStep(next);
      const stageNames = [
        language === 'en' ? 'Surrender Requested' : 'सरेंडर अनुरोध दर्ज',
        language === 'en' ? 'Documents Verified by Team' : 'दस्तावेजों का सत्यापन पूर्ण',
        language === 'en' ? 'Processing at IndusInd Bank' : 'इंडसइंड बैंक में प्रोसेसिंग जारी',
        language === 'en' ? 'Approved & Cancellation Completed' : 'स्वीकृत और पॉलिसी रद्द',
        language === 'en' ? '₹1,81,500 Credited to IndusInd Savings Account' : '₹1,81,500 इंडसइंड बचत खाते में जमा'
      ];
      addLog(`Surrender progress advanced to: ${stageNames[next - 1]}`, 'success');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans" id="screen-surrender-container">
      {/* Header */}
      <div className="bg-[#8B1A1A] text-white pt-5 pb-4 px-4 shadow-sm flex items-center gap-3 shrink-0" id="surrender-header">
        <button 
          id="surrender-back-btn"
          onClick={() => {
            if (step === 1) onNavigate('wallet');
            else if (step === 2) setStep(1);
            else if (step === 3) setStep(2);
            else onNavigate('dashboard');
          }} 
          className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-display font-semibold">
            {language === 'en' ? 'Surrender Life Insurance' : 'लाइफ इंश्योरेंस सरेंडर'}
          </h1>
          <p className="text-[9px] text-white/70">IndusInd Bank • Policy IND-LF-894104</p>
        </div>
      </div>

      {/* Progress bar at top */}
      {step < 4 && (
        <div className="bg-slate-200 h-1 w-full flex" id="surrender-step-bar">
          <div className={`h-full transition-all duration-300 ${step >= 1 ? 'bg-[#8B1A1A]' : 'bg-slate-200'}`} style={{ width: '33.3%' }}></div>
          <div className={`h-full transition-all duration-300 ${step >= 2 ? 'bg-[#8B1A1A]' : 'bg-slate-200'}`} style={{ width: '33.3%' }}></div>
          <div className={`h-full transition-all duration-300 ${step >= 3 ? 'bg-[#8B1A1A]' : 'bg-slate-200'}`} style={{ width: '33.4%' }}></div>
        </div>
      )}

      {/* Main Flow Contents */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 no-scrollbar flex flex-col justify-between" id="surrender-scroll-content">
        
        {/* STEP 1: SURRENDER VALUE ASSESSMENT */}
        {step === 1 && (
          <div className="space-y-3 flex-1 flex flex-col justify-between" id="surrender-step1">
            <div className="space-y-3">
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-3 shadow-2xs" id="surrender-step1-banner">
                <TrendingDown className="h-4.5 w-4.5 text-rose-600 mt-0.5 shrink-0 animate-bounce" />
                <div>
                  <h3 className="text-xs font-bold text-rose-950">
                    {language === 'en' ? 'Confirm Early Termination' : 'जल्दी सरेंडर की पुष्टि करें'}
                  </h3>
                  <p className="text-[11px] text-rose-700 leading-relaxed mt-0.5">
                    {language === 'en' 
                      ? "Policy surrender is the voluntary cancellation of a life insurance policy before it matures. When you surrender a policy, your life cover immediately ends, and you receive a 'surrender value' (a portion of premiums paid minus charges)."
                      : "पॉलिसी सरेंडर मैच्योरिटी से पहले जीवन बीमा पॉलिसी को स्वेच्छा से रद्द करना है। जब आप पॉलिसी सरेंडर करते हैं, तो आपका जीवन बीमा तुरंत समाप्त हो जाता है, और आपको एक 'सरेंडर मूल्य' प्राप्त होता है।"}
                  </p>
                </div>
              </div>

              {/* Surrender Value Box */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-3xs space-y-2.5" id="surrender-calc-sheet">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'en' ? 'Refund Assessment breakdown' : 'रिफंड मूल्यांकन विश्लेषण'}
                </h4>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {language === 'en' ? 'Total Paid Premiums' : 'कुल भुगतान किया गया प्रीमियम'}
                    </span>
                    <span className="font-semibold text-slate-800">₹3,00,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {language === 'en' ? 'Surrender Payout Value' : 'सरेंडर भुगतान मूल्य'}
                    </span>
                    <span className="font-bold text-slate-800">₹1,85,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {language === 'en' ? 'Cancellation Processing Fee' : 'रद्दीकरण प्रोसेसिंग शुल्क'}
                    </span>
                    <span className="text-rose-600 font-semibold">- ₹3,500</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-100 font-bold text-xs">
                    <span className="text-slate-900">
                      {language === 'en' ? 'Net Credit to Savings Account' : 'बचत खाते में शुद्ध क्रेडिट'}
                    </span>
                    <span className="text-emerald-700">₹1,81,500</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500 space-y-0.5">
                  <p className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Clock className="h-3.5 w-3.5 text-slate-500" /> {language === 'en' ? 'Settled within 5-7 working days' : '5-7 कार्य दिवसों में निपटान'}
                  </p>
                  <p>
                    {language === 'en' 
                      ? 'Funds will be credited directly to your registered IndusInd Savings Account AC/4921.' 
                      : 'राशि सीधे आपके पंजीकृत इंडसइंड बचत खाता AC/4921 में जमा की जाएगी।'}
                  </p>
                </div>
              </div>

              {/* Warning box */}
              <div className="p-2.5 bg-[#FFBF00] border border-amber-500 rounded-lg text-[10px] text-slate-950 flex items-start gap-2 font-bold" id="surrender-warning">
                <ShieldAlert className="h-4.5 w-4.5 text-slate-950 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="font-bold text-slate-950">
                    {language === 'en' ? 'This action cannot be undone' : 'इस कार्रवाई को पूर्ववत नहीं किया जा सकता'}
                  </p>
                  <p className="mt-0.5 text-slate-900 font-semibold leading-relaxed">
                    {language === 'en' 
                      ? 'Once submitted, cancellation instructions are dispatched immediately to IndusInd Bank. Policies cannot be restored or re-activated.' 
                      : 'एक बार सबमिट करने के बाद, रद्दीकरण निर्देश तुरंत इंडसइंड बैंक को भेज दिए जाते हैं। पॉलिसियों को बहाल या फिर से सक्रिय नहीं किया जा सकता है।'}
                  </p>
                </div>
              </div>
            </div>

            {/* Checkbox and button */}
            <div className="space-y-2.5 pt-3 border-t border-slate-150 shrink-0">
              <div 
                id="surrender-terms-checkbox"
                onClick={() => setTermsAccepted(!termsAccepted)}
                className="flex items-center gap-2 cursor-pointer py-0.5 select-none"
              >
                {termsAccepted ? (
                  <CheckSquare className="h-4.5 w-4.5 text-[#8B1A1A] shrink-0" />
                ) : (
                  <Square className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                )}
                <span className="text-[11px] text-slate-700 font-medium leading-tight">
                  I understand and accept the early surrender terms, penalty charges, and payout calculations.
                </span>
              </div>

              <button 
                id="surrender-step1-continue"
                disabled={!termsAccepted}
                onClick={handleStep1Continue}
                className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                  termsAccepted 
                    ? 'bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Continue to Verify <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 2 && (
          <div className="space-y-4 flex-1 flex flex-col justify-between" id="surrender-step2">
            <div className="space-y-5">
              <div className="text-center py-4 space-y-1.5" id="otp-header-info">
                <div className="h-12 w-12 bg-[#8B1A1A]/10 rounded-full flex items-center justify-center text-[#8B1A1A] mx-auto">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-2">Mobile Verification</h3>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  We have sent a 4-digit security code to your registered mobile number <strong className="text-slate-800">+91 98*** **421</strong>
                </p>
                <p className="text-[9px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded inline-block font-mono font-semibold">
                  Demo Code: 4821
                </p>
              </div>

              {/* Input Fields Row */}
              <div className="space-y-3" id="otp-inputs-wrapper">
                <div className="flex justify-center gap-3.5">
                  {otp.map((digit, idx) => (
                    <input 
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className={`h-12 w-12 border rounded-xl text-center text-lg font-bold font-mono focus:border-[#8B1A1A] focus:ring-1 focus:ring-[#8B1A1A] outline-none shadow-3xs ${
                        otpError ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                      }`}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-[10px] text-red-600 text-center font-semibold" id="otp-error-msg">{otpError}</p>
                )}
              </div>

              {/* Resend Link */}
              <div className="text-center" id="otp-resend-box">
                {timer > 0 ? (
                  <p className="text-[10px] text-slate-400 font-medium">Resend OTP in {timer}s</p>
                ) : (
                  <button 
                    onClick={handleResendOtp}
                    className="text-[11px] text-[#8B1A1A] font-bold hover:underline cursor-pointer"
                  >
                    Resend Code Via SMS
                  </button>
                )}
              </div>
            </div>

            {/* Verification Button */}
            <div className="pt-4 border-t border-slate-150 shrink-0">
              <button 
                id="otp-verify-btn"
                onClick={handleVerifyOtp}
                className="w-full bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Verify Code
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: E-SIGN SIGNATURE */}
        {step === 3 && (
          <div className="space-y-4 flex-1 flex flex-col justify-between" id="surrender-step3">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Aadhaar e-Sign Confirmation</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Provide your signature on the screen pad below to authorize and securely lock this digital surrender request.
                </p>
              </div>

              {/* Drawing Box */}
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-2.5 relative flex flex-col h-48 shadow-3xs" id="signature-board">
                <div className="flex-1 rounded-lg bg-slate-50 relative overflow-hidden">
                  <canvas 
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                    id="canvas-signature-pad"
                  />
                  {!hasSigned && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2 pointer-events-none">
                      <PenTool className="h-6 w-6 stroke-1.5" />
                      <span className="text-[10px] font-medium">Draw your signature inside this box</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-2 px-1">
                  <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Encrypted biometric signature hash
                  </span>
                  <button 
                    onClick={clearSignature}
                    className="text-[10px] font-bold text-[#8B1A1A] hover:bg-[#8B1A1A]/10 px-2 py-1 rounded transition-colors cursor-pointer"
                  >
                    Clear pad
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-[10px] text-slate-600 flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  By signing, you agree that this electronic signature is a legally binding authorization of policy cancellation and account credit.
                </p>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 border-t border-slate-150 shrink-0">
              <button 
                id="submit-surrender-btn"
                disabled={!hasSigned}
                onClick={handleSubmitSurrender}
                className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer ${
                  hasSigned 
                    ? 'bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Sign and Submit Request
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: LIVE STATUS TRACKER */}
        {step === 4 && (
          <div className="space-y-4 flex-1 flex flex-col justify-between" id="surrender-step4">
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-1.5 shadow-2xs" id="surrender-success-card">
                <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-950 mt-1">Cancellation Dispatched</h3>
                <p className="text-[11px] text-emerald-800">Your cancellation request has been logged successfully.</p>
                <div className="text-[10px] font-mono text-emerald-700 bg-white/50 py-1 px-2.5 rounded inline-block font-semibold">
                  Ref ID: IND-CAN-90241
                </div>
              </div>

              {/* Status milestones */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-4" id="surrender-milestones">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Stage Tracking</h4>
                
                <div className="space-y-4 relative pl-5 border-l-2 border-slate-200" id="tracker-lines">
                  
                  {/* Step 1: Requested */}
                  <div className="relative" id="milestone-1">
                    <div className="absolute -left-[27px] top-0 h-4.5 w-4.5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 border border-emerald-300">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-950">Surrender Requested</p>
                      <p className="text-[9px] text-slate-500">Submitted on July 16, 2026 • 03:21 AM</p>
                    </div>
                  </div>

                  {/* Step 2: Docs verified */}
                  <div className="relative" id="milestone-2">
                    <div className={`absolute -left-[27px] top-0 h-4.5 w-4.5 rounded-full flex items-center justify-center border ${
                      trackerStep >= 2 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                        : 'bg-amber-100 text-amber-700 border-amber-300'
                    }`}>
                      {trackerStep >= 2 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      )}
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold ${trackerStep >= 2 ? 'text-slate-950' : 'text-slate-800'}`}>
                        Documents Verified
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {trackerStep >= 2 ? 'Verification check completed successfully' : 'Security review in progress...'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Processing */}
                  <div className="relative" id="milestone-3">
                    <div className={`absolute -left-[27px] top-0 h-4.5 w-4.5 rounded-full flex items-center justify-center border ${
                      trackerStep >= 3 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                        : trackerStep === 2 
                        ? 'bg-amber-100 text-amber-700 border-amber-300' 
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {trackerStep >= 3 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : trackerStep === 2 ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold ${trackerStep >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>
                        Processing at Insurer
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {trackerStep >= 3 ? 'IndusInd Bank finalized calculations' : trackerStep === 2 ? 'Dispatching paperwork...' : 'Pending verification'}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Approved */}
                  <div className="relative" id="milestone-4">
                    <div className={`absolute -left-[27px] top-0 h-4.5 w-4.5 rounded-full flex items-center justify-center border ${
                      trackerStep >= 4 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                        : trackerStep === 3 
                        ? 'bg-amber-100 text-amber-700 border-amber-300' 
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {trackerStep >= 4 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : trackerStep === 3 ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold ${trackerStep >= 4 ? 'text-slate-900' : 'text-slate-400'}`}>
                        Approved & Cancelled
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {trackerStep >= 4 ? 'Policy terminated, credit generated' : 'Pending insurer completion'}
                      </p>
                    </div>
                  </div>

                  {/* Step 5: Amount Credited */}
                  <div className="relative" id="milestone-5">
                    <div className={`absolute -left-[27px] top-0 h-4.5 w-4.5 rounded-full flex items-center justify-center border ${
                      trackerStep >= 5 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                        : trackerStep === 4 
                        ? 'bg-amber-100 text-amber-700 border-amber-300' 
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {trackerStep >= 5 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : trackerStep === 4 ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold ${trackerStep >= 5 ? 'text-slate-900' : 'text-slate-400'}`}>
                        Amount Credited to Account
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {trackerStep >= 5 ? '₹1,81,500 credited to AC/4921' : 'Pending bank transfer clearance'}
                      </p>
                    </div>
                  </div>

                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-lg flex items-start gap-1.5">
                  <Info className="h-4 w-4 text-[#8B1A1A] mt-0.5 shrink-0" />
                  <p>You will receive SMS alerts and push notifications at each status milestone. Expected total credit timeline: 5-7 working days.</p>
                </div>
              </div>

              {/* Simulation Helper */}
              {trackerStep < 5 && (
                <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between" id="simulate-progress-helper">
                  <span className="text-[10px] text-slate-500">Reviewing this flow?</span>
                  <button 
                    id="sim-advance-tracker-btn"
                    onClick={advanceTracker}
                    className="bg-[#8B1A1A]/10 hover:bg-[#8B1A1A]/20 text-[#8B1A1A] font-bold text-[10px] px-2.5 py-1 rounded cursor-pointer transition-colors"
                  >
                    Advance Status Stage →
                  </button>
                </div>
              )}
            </div>

            {/* Back to Home Button */}
            <div className="pt-4 border-t border-slate-150 shrink-0">
              <button 
                id="surrender-flow-done-btn"
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
