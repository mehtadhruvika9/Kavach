import React, { useState } from 'react';
import { 
  ArrowLeft, 
  PhoneCall, 
  HeartPulse, 
  Wrench, 
  Stethoscope, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  X, 
  Volume2, 
  PhoneOff, 
  Loader2, 
  Activity,
  AlertTriangle,
  Compass,
  Info
} from 'lucide-react';
import { ScreenId } from '../types';

interface EmergencyProps {
  onNavigate: (screen: ScreenId) => void;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'action') => void;
}

export const EmergencyAssistance: React.FC<EmergencyProps> = ({
  onNavigate,
  addLog
}) => {
  const [activeModal, setActiveModal] = useState<'ambulance' | 'roadside' | 'doctor' | 'hospitals' | 'contacts' | null>(null);
  const [sosStatus, setSosStatus] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  const triggerEmergencyService = (service: 'ambulance' | 'roadside' | 'doctor' | 'hospitals' | 'contacts') => {
    setActiveModal(service);
    addLog(`TRIGGERED EMERGENCY RESOURCE: ${service.toUpperCase()}`, 'warning');

    if (service === 'ambulance') {
      setSosStatus('Connecting to IndusInd Central Ambulance dispatcher...');
      setProgress(15);
      setTimeout(() => setProgress(50), 800);
      setTimeout(() => {
        setProgress(100);
        setSosStatus('LINE CONNECTED. Dispatching nearest cashless paramedic...');
      }, 1800);
    } else if (service === 'roadside') {
      setSosStatus('Locking GPS coordinates via mobile tower...');
      setProgress(20);
      setTimeout(() => setProgress(65), 1000);
      setTimeout(() => {
        setProgress(100);
        setSosStatus('GPS Position Locked. Dispatching Allianz Tow Partner.');
      }, 2000);
    } else if (service === 'doctor') {
      setSosStatus('Connecting to on-call physician desk...');
      setProgress(30);
      setTimeout(() => {
        setProgress(100);
        setSosStatus('Dr. Amit Verma (MD, Cardiology) on video line...');
      }, 1500);
    }
  };

  const cashlessHospitals = [
    {
      name: 'Lilavati Hospital & Research Centre',
      address: 'A-791, Bandra Reclamation, Bandra West, Mumbai - 400050',
      distance: '1.2 km',
      cashless: 'HDFC Ergo / ICICI Lombard Authorized',
      phone: '022 2675 1000'
    },
    {
      name: 'Kokilaben Dhirubhai Ambani Hospital',
      address: 'Rao Saheb, Achutrao Patwardhan Marg, Andheri West, Mumbai - 400053',
      distance: '4.8 km',
      cashless: 'Bajaj Allianz / HDFC Ergo Authorized',
      phone: '022 4269 6969'
    },
    {
      name: 'Breach Candy Hospital Trust',
      address: '60 A, Bhulabhai Desai Road, Cumballa Hill, Mumbai - 400026',
      distance: '8.5 km',
      cashless: 'All Kavach Policies Supported',
      phone: '022 2366 7788'
    },
    {
      name: 'Fortis Hospital Mulund',
      address: 'Mulund Goregaon Link Road, Industrial Area, Mulund West, Mumbai - 400078',
      distance: '12.4 km',
      cashless: 'HDFC Ergo / Bajaj Allianz Authorized',
      phone: '022 4365 4365'
    }
  ];

  const emergencyContactsList = [
    { label: 'Kavach Dedicated Helpdesk', number: '1800 267 7777', note: 'Toll-free 24/7' },
    { label: 'Health Cashless Authorization Desk', number: '1800 102 4477', note: 'Lilavati / Kokilaben desk direct' },
    { label: 'Motor Roadside Assistance Dispatch', number: '1800 209 8585', note: 'Bajaj Allianz towing partner' },
    { label: 'ICICI Lombard International Travel SOS', number: '+91 22 6734 7821', note: 'Overseas emergency call collect' },
    { label: 'National Disaster Response Desk', number: '108', note: 'Primary paramedic' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans" id="screen-emergency-container">
      {/* Header */}
      <div className="bg-[#8B1A1A] text-white pt-5 pb-4 px-4 shadow-sm flex items-center gap-3 shrink-0" id="emergency-header">
        <button 
          id="emergency-back-btn"
          onClick={() => onNavigate('dashboard')} 
          className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-display font-semibold">SOS Emergency Desk</h1>
          <p className="text-[9px] text-amber-300">Available 24/7 • Offline Protocol Active</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 no-scrollbar flex flex-col justify-between" id="emergency-scroll-content">
        
        {/* Upper status note */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-start gap-2 shrink-0" id="emergency-banner-top">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-white">Works on Low Connectivity</p>
            <p className="text-[10px] text-slate-400 leading-normal mt-0.5 font-medium">
              The SOS desk stores direct satellite parameters. Tapping actions will route via secure SMS if internet drops during a crisis.
            </p>
          </div>
        </div>

        {/* Big Tap Grid */}
        <div className="grid grid-cols-1 gap-2.5 flex-1 justify-center py-1" id="emergency-buttons-stack">
          {/* Button 1: Call Ambulance */}
          <button 
            id="sos-btn-ambulance"
            onClick={() => triggerEmergencyService('ambulance')}
            className="bg-red-600 hover:bg-red-700 active:scale-98 rounded-lg p-3.5 flex items-center justify-between text-left shadow-lg cursor-pointer transition-all border border-red-500"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/15 rounded-lg text-white">
                <HeartPulse className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">🚑 Call Ambulance</p>
                <p className="text-[10px] text-red-100 font-medium">Paramedic dispatch • Cashless hospital routing</p>
              </div>
            </div>
            <ChevronRight className="h-4.5 w-4.5 text-red-200" />
          </button>

          {/* Button 2: Roadside Towing */}
          <button 
            id="sos-btn-roadside"
            onClick={() => triggerEmergencyService('roadside')}
            className="bg-amber-600 hover:bg-amber-700 active:scale-98 rounded-lg p-3.5 flex items-center justify-between text-left shadow-lg cursor-pointer transition-all border border-amber-500"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/15 rounded-lg text-white">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">🚗 Roadside Assistance</p>
                <p className="text-[10px] text-amber-100 font-medium">Allianz flatbed towing • Tyre change • Fuel refil</p>
              </div>
            </div>
            <ChevronRight className="h-4.5 w-4.5 text-amber-200" />
          </button>

          {/* Button 3: Doctor on Call */}
          <button 
            id="sos-btn-doctor"
            onClick={() => triggerEmergencyService('doctor')}
            className="bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-lg p-3.5 flex items-center justify-between text-left shadow-lg cursor-pointer transition-all border border-blue-500"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/15 rounded-lg text-white">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">👨‍⚕️ Doctor on Call</p>
                <p className="text-[10px] text-blue-100 font-medium">Licensed MD physician teleconsult • Prescriptions</p>
              </div>
            </div>
            <ChevronRight className="h-4.5 w-4.5 text-blue-200" />
          </button>

          {/* Button 4: Find Cashless Hospital */}
          <button 
            id="sos-btn-hospitals"
            onClick={() => triggerEmergencyService('hospitals')}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-lg p-3.5 flex items-center justify-between text-left shadow-lg cursor-pointer transition-all border border-emerald-500"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/15 rounded-lg text-white">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">🏥 Find Cashless Hospital</p>
                <p className="text-[10px] text-emerald-100 font-medium">Lilavati / Kokilaben / Breach Candy lookup</p>
              </div>
            </div>
            <ChevronRight className="h-4.5 w-4.5 text-emerald-200" />
          </button>

          {/* Button 5: Helplines */}
          <button 
            id="sos-btn-contacts"
            onClick={() => triggerEmergencyService('contacts')}
            className="bg-slate-700 hover:bg-slate-800 active:scale-98 rounded-lg p-3.5 flex items-center justify-between text-left shadow-lg cursor-pointer transition-all border border-slate-600"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/15 rounded-lg text-white">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">📞 Emergency Contacts</p>
                <p className="text-[10px] text-slate-300 font-medium">Toll-free corporate risk helpdesks</p>
              </div>
            </div>
            <ChevronRight className="h-4.5 w-4.5 text-slate-400" />
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[8px] text-slate-500 py-0.5 shrink-0 uppercase tracking-widest leading-none">
          Kavach SOS Core System • IndusInd Bank Ltd
        </p>

      </div>

      {/* EMERGENCY DISPATCH MODALS (AMBULANCE / ROADSIDE / DOCTOR) */}
      {(activeModal === 'ambulance' || activeModal === 'roadside' || activeModal === 'doctor') && (
        <div className="absolute inset-0 bg-slate-950/95 z-40 flex flex-col justify-between p-5 text-center text-white" id="dispatch-backdrop">
          
          {/* Speaker head */}
          <div className="flex justify-between items-center" id="dispatch-header">
            <span className="text-[8px] bg-[#8B1A1A] text-white px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              {activeModal.toUpperCase()} TELE-DISPATCH
            </span>
            <button 
              onClick={() => setActiveModal(null)}
              className="p-1 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Calling Animation */}
          <div className="space-y-5" id="calling-animation-box">
            <div className="relative flex items-center justify-center">
              {/* Ripple circles */}
              <div className="absolute h-32 w-32 rounded-full bg-red-500/10 animate-ping" />
              <div className="absolute h-24 w-24 rounded-full bg-red-500/20 animate-pulse" />
              
              <div className={`h-16 w-16 rounded-full flex items-center justify-center shadow-lg ${
                activeModal === 'ambulance' ? 'bg-red-600' : activeModal === 'roadside' ? 'bg-amber-600' : 'bg-blue-600'
              }`}>
                {activeModal === 'ambulance' ? (
                  <HeartPulse className="h-8 w-8 animate-bounce text-white" />
                ) : activeModal === 'roadside' ? (
                  <Wrench className="h-8 w-8 text-white" />
                ) : (
                  <Stethoscope className="h-8 w-8 text-white" />
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white tracking-wide">
                {activeModal === 'ambulance' ? 'DIALING SOS PARAMEDIC (102)' : 
                 activeModal === 'roadside' ? 'TOWING DISPATCH SERVICES' : 'MD TELECONSULT HOST'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono flex justify-center items-center gap-1.5">
                {progress < 100 && <Loader2 className="h-3 w-3 animate-spin text-[#8B1A1A]" />}
                {sosStatus}
              </p>
            </div>

            {/* GPS meta block for Roadside Assistance */}
            {activeModal === 'roadside' && progress === 100 && (
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-lg max-w-sm mx-auto space-y-1.5 text-left animate-fadeIn" id="roadside-meta">
                <div className="flex gap-2 items-start text-[11px]">
                  <Compass className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-bold text-[8px] text-slate-400 uppercase tracking-wider">Locked Coordinates</span>
                    <span className="font-semibold text-white">Plot 12, Senapati Bapat Marg, Lower Parel, Mumbai</span>
                  </div>
                </div>
                <div className="flex gap-2 items-start text-[11px] border-t border-white/10 pt-2">
                  <Activity className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-bold text-[8px] text-slate-400 uppercase tracking-wider">Truck Dispatch Status</span>
                    <span className="font-semibold text-emerald-400">En route from Mahim Workshop • ETA 22 Mins</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-3 max-w-sm mx-auto w-full" id="dispatch-footer">
            <div className="flex justify-center gap-5">
              <button 
                className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
                onClick={() => addLog('Toggled speakerphone in call', 'info')}
              >
                <Volume2 className="h-4.5 w-4.5" />
              </button>
              <button 
                onClick={() => setActiveModal(null)}
                className="h-10 w-10 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md"
              >
                <PhoneOff className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-[9px] text-slate-500 font-bold">Secure AES-256 VoIP Voice stream line</p>
          </div>

        </div>
      )}

      {/* CASHLESS HOSPITAL LOCATOR MODAL */}
      {activeModal === 'hospitals' && (
        <div className="absolute inset-0 bg-white text-slate-800 z-40 flex flex-col justify-between" id="hospitals-modal-backdrop">
          
          <div className="bg-[#8B1A1A] text-white pt-5 pb-4 px-4 flex items-center gap-3 shrink-0" id="hospitals-modal-header">
            <button 
              onClick={() => setActiveModal(null)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-display font-semibold">Cashless Network Locator</h1>
              <p className="text-[9px] text-emerald-300 font-bold">Mumbai West • GPS Autolocate active</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 no-scrollbar" id="hospitals-modal-scroll">
            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              These network medical centres support direct <strong>ClaimEasy 1-click cashless authorizations</strong> with zero advance deposit requirements.
            </p>

            <div className="space-y-2" id="hospitals-list-items">
              {cashlessHospitals.map((hosp, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 shadow-3xs space-y-1.5" id={`hosp-item-${idx}`}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-bold text-slate-900 leading-tight max-w-[180px]">{hosp.name}</h3>
                    <span className="text-[9px] font-bold text-emerald-700 font-mono shrink-0">{hosp.distance}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-medium">{hosp.address}</p>
                  
                  <div className="border-t border-slate-200/80 pt-2 flex justify-between items-center text-[9px] font-bold">
                    <span className="text-[#8B1A1A] bg-[#8B1A1A]/5 border border-[#8B1A1A]/10 px-1.5 py-0.5 rounded uppercase">
                      {hosp.cashless}
                    </span>
                    <a 
                      href={`tel:${hosp.phone}`}
                      onClick={() => addLog(`Placing call to cashless hospital desk: ${hosp.name}`, 'info')}
                      className="text-[#8B1A1A] hover:underline flex items-center gap-0.5"
                    >
                      Call Desk {hosp.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-slate-150 shrink-0">
            <button 
              onClick={() => setActiveModal(null)}
              className="w-full bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-xs py-2 rounded-lg cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      )}

      {/* HELPLINE CONTACTS LIST MODAL */}
      {activeModal === 'contacts' && (
        <div className="absolute inset-0 bg-white text-slate-800 z-40 flex flex-col justify-between" id="contacts-modal-backdrop">
          
          <div className="bg-[#8B1A1A] text-white pt-5 pb-4 px-4 flex items-center gap-3 shrink-0" id="contacts-modal-header">
            <button 
              onClick={() => setActiveModal(null)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-display font-semibold">Toll-Free Helplines</h1>
              <p className="text-[9px] text-white/70">Sovereign Encryption Dial Desks</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 no-scrollbar" id="contacts-modal-scroll">
            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              Designated corporate assistance networks aligned with your active health, motor, and overseas travel policy certificates:
            </p>

            <div className="space-y-2" id="contacts-list-items">
              {emergencyContactsList.map((contact, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between" id={`contact-item-${idx}`}>
                  <div className="space-y-0.5">
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{contact.note}</p>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">{contact.label}</h3>
                  </div>
                  <a 
                    href={`tel:${contact.number}`}
                    onClick={() => addLog(`Calling corporate helpline: ${contact.label}`, 'info')}
                    className="bg-[#8B1A1A]/10 hover:bg-[#8B1A1A]/20 text-[#8B1A1A] font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <PhoneCall className="h-3 w-3" /> Call
                  </a>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-blue-50 border border-blue-150 rounded-lg text-[10px] text-slate-600 flex items-start gap-2" id="contacts-disclaimer">
              <Info className="h-4.5 w-4.5 text-[#8B1A1A] mt-0.5 shrink-0" />
              <p className="leading-normal font-medium">These numbers are configured with carrier routing overlays to bypass mobile congestion filters during emergency call-loads.</p>
            </div>
          </div>

          <div className="p-3 border-t border-slate-150 shrink-0">
            <button 
              onClick={() => setActiveModal(null)}
              className="w-full bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-xs py-2 rounded-lg cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
