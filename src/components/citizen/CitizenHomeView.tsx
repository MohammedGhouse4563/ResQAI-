import React, { useState } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Navigation, 
  Home, 
  Mic, 
  Phone, 
  WifiOff, 
  Wifi, 
  CheckCircle2, 
  Radio, 
  Sparkles,
  ArrowRight,
  LifeBuoy,
  Locate,
  Edit3,
  X,
  Check,
  PhoneCall
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { detectCurrentLocationGoogle, getGoogleMapsNavigationUrl } from '../../services/googleMapsService';
import { ManualAddressInput } from './ManualAddressInput';
import { ResQLogo } from '../common/ResQLogo';

export const CitizenHomeView: React.FC = () => {
  const { 
    t, 
    language, 
    setLanguage, 
    zones, 
    disasterPhase,
    isOffline, 
    toggleOffline, 
    citizenSafe, 
    setCitizenSafe, 
    registerCitizenSafe,
    triggerIncomingVoiceCall,
    setActiveModal 
  } = useDisaster();

  const [currentAddress, setCurrentAddress] = useState('Delta Enclave, Sector 4B');
  const [currentCoords, setCurrentCoords] = useState<[number, number]>([13.0465, 80.2220]);
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);
  const [isEditingAddressModal, setIsEditingAddressModal] = useState(false);

  // Safe & Secure Registration Modal State
  const [isSafeModalOpen, setIsSafeModalOpen] = useState(false);
  const [safeCitizenName, setSafeCitizenName] = useState('Kavitha Rangarajan');
  const [safePhone, setSafePhone] = useState('+91 98401 23891');
  const [safeNotes, setSafeNotes] = useState('Family is safe on upper floor with dry supplies.');

  const handleRefreshLocation = async () => {
    setIsDetectingLoc(true);
    try {
      const loc = await detectCurrentLocationGoogle();
      setCurrentAddress(loc.address);
      setCurrentCoords([loc.lat, loc.lng]);
    } finally {
      setIsDetectingLoc(false);
    }
  };

  // Zone A status represents the citizen's immediate area in this demo
  const userZone = zones.find(z => z.id === 'zone-a') || zones[0];
  const isCritical = userZone.severity === 'CRITICAL';
  const statusLabel = isCritical ? t.statusCritical : userZone.severity === 'WARNING' ? t.statusWarning : t.statusWatch;

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pb-10 select-none">
      
      {/* Top Mobile Bar */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ResQLogo size={36} />
          <div>
            <div className="font-bold text-sm text-white tracking-tight">{t.appTitle}</div>
            <div className="text-[10px] text-slate-400 font-mono">CITIZEN SAFETY COMPASS</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Offline Mode Toggle Button */}
          <button
            onClick={toggleOffline}
            title="Toggle Offline Simulation"
            className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-colors ${
              isOffline ? 'bg-amber-950 border-amber-700 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="text-[10px]">{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            {(['en', 'ta', 'hi'] as SupportedLanguage[]).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  language === lang 
                    ? 'bg-rose-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'ta' ? 'தமிழ்' : 'हिन्दी'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 py-4 space-y-4 flex-1">
        
        {/* Offline Banner if Active (Section 36) */}
        {isOffline && (
          <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-700/80 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-amber-300 uppercase tracking-wide">
                {t.offlineBanner}
              </span>
              <p className="text-[11px] text-amber-200/90 leading-tight">
                {t.offlineQueuedNotice}
              </p>
            </div>
          </div>
        )}

        {/* Current Safety Status Banner (Section 4 & 50) */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isCritical 
            ? 'bg-gradient-to-br from-rose-950/90 via-slate-900 to-slate-950 border-rose-600 shadow-xl shadow-rose-950/30' 
            : 'bg-slate-900 border-amber-700'
        }`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-rose-900/60">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              {t.currentStatus}
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono font-bold text-xs shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>{statusLabel}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">{t.nearbyRisk}</span>
              <span className="font-mono text-rose-400 font-bold">2.4 km away</span>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
              <span className="text-amber-400 font-semibold">{t.predictedImpact}</span>
              <p className="text-slate-300 mt-1 leading-snug">
                {t.recommendedAction}
              </p>
            </div>
          </div>
        </div>

        {/* Strong Proactive Emergency Alert (Section 7) */}
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold tracking-wide">
              <AlertTriangle className="w-4 h-4" />
              <span>{t.criticalAlertHeader}</span>
            </div>
            <span className="text-[9px] font-mono text-slate-400 uppercase">
              PREDICTIVE MODEL (AI FORECAST)
            </span>
          </div>

          <p className="text-[11px] text-slate-200 leading-snug">
            {t.evacuateInstruction}
          </p>

          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
            <span>Nearest Safe Shelter: <b className="text-white">North High Complex</b></span>
            <span className="text-emerald-400 font-mono">1.2 km</span>
          </div>
        </div>

        {/* AI Automated Voice Call & Notification System (Before & When Disaster Occurs) */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-950 border border-rose-700 flex items-center justify-center text-rose-400">
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span>AI Auto Voice Alert &amp; Notify</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {disasterPhase === 'before' ? 'Early Warnings Before Flood' : 'Active Disaster Call & Siren'}
                </div>
              </div>
            </div>

            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
              ACTIVE ✓
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Subscribed Number:</span>
              <span className="font-mono text-white font-bold">{safePhone}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Command Center automatically places outbound AI voice calls before flood surge reaches your doorstep and when breaches occur.
            </p>
          </div>

          <button
            onClick={() => triggerIncomingVoiceCall(disasterPhase)}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:text-white"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Incoming AI Voice Call Alert Now</span>
          </button>
        </div>

        {/* PROMINENT PERSISTENT SOS BUTTON (Section 5) */}
        <div className="pt-1 pb-2">
          <button
            onClick={() => setActiveModal('sos')}
            className="w-full h-20 rounded-2xl bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 hover:from-rose-600 hover:to-red-500 active:scale-[0.98] text-white font-black text-xl tracking-wider shadow-2xl shadow-rose-900/60 flex items-center justify-center gap-3 transition-all border-2 border-rose-400/60 cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-white animate-ping"></span>
            <span>{t.sosButton}</span>
          </button>
          <div className="text-center text-[10px] text-slate-400 mt-1.5">
            1-Tap Emergency Beacon · Instant Dispatch to Disaster Command
          </div>
        </div>

        {/* Primary Citizen Action Grid (Section 50) */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          
          {/* Safe Route */}
          <button
            onClick={() => setActiveModal('safeRoute')}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-600/80 flex flex-col justify-between text-left transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mb-2">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">{t.findSafeRoute}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Elevated bypass</div>
            </div>
          </button>

          {/* Find Shelter */}
          <button
            onClick={() => setActiveModal('shelters')}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-600/80 flex flex-col justify-between text-left transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-400 flex items-center justify-center mb-2">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">{t.findShelter}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Verified dry beds</div>
            </div>
          </button>

          {/* AI Voice Assistant */}
          <button
            onClick={() => setActiveModal('voice')}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-rose-600/80 flex flex-col justify-between text-left transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-950 border border-rose-700 text-rose-400 flex items-center justify-center mb-2">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">{t.askAi}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">EN · தமிழ் · हिन्दी</div>
            </div>
          </button>

          {/* Direct 112 Call */}
          <a
            href="tel:112"
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-red-600/80 flex flex-col justify-between text-left transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-red-950 border border-red-700 text-red-400 flex items-center justify-center mb-2">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">{t.emergencyCall}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Official 112 line</div>
            </div>
          </a>

          {/* "I Am Safe" Check-In */}
          <button
            onClick={() => {
              if (!citizenSafe) {
                setIsSafeModalOpen(true);
              } else {
                registerCitizenSafe(false);
              }
            }}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between text-left transition-all active:scale-[0.98] cursor-pointer ${
              citizenSafe 
                ? 'bg-emerald-950/80 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.35)]' 
                : 'bg-slate-900 border-slate-800 hover:border-emerald-600'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-2 ${
              citizenSafe ? 'bg-emerald-800 border-emerald-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              <span className="text-base">{citizenSafe ? '🛡️' : '✓'}</span>
            </div>
            <div>
              <div className="font-bold text-white text-xs">{citizenSafe ? 'Safe & Secure 🛡️' : t.iAmSafe}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {citizenSafe ? 'Command Alerted ✓' : 'Register safety'}
              </div>
            </div>
          </button>

          {/* Report Hazard */}
          <button
            onClick={() => setActiveModal('hazard')}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-600/80 flex flex-col justify-between text-left transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-700 text-amber-400 flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">{t.reportHazard}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Water / Tree fall</div>
            </div>
          </button>

        </div>

        {/* Safety Check-in Confirmation Banner with Specific Symbol */}
        {citizenSafe && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 text-xs space-y-2 shadow-xl shadow-emerald-950/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <div>
                  <div className="font-black text-white text-xs tracking-wider flex items-center gap-1.5">
                    <span>SAFE &amp; SECURE VERIFIED</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-300 border border-emerald-600">COMMAND SYMBOL 🛡️</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">Transmitted to Authority Emergency Service</div>
                </div>
              </div>
              <button
                onClick={() => setIsSafeModalOpen(true)}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white border border-emerald-600 font-bold transition-colors cursor-pointer"
              >
                Update
              </button>
            </div>
            <div className="text-[11px] text-emerald-200/90 pl-7 space-y-0.5 border-t border-emerald-800/60 pt-1.5">
              <div>📍 <b>{currentAddress}</b> ({currentCoords[0].toFixed(4)}°, {currentCoords[1].toFixed(4)}°)</div>
              <div className="text-[10px] text-emerald-400">Responders and GIS command room are notified with your verified safety badge.</div>
            </div>
          </div>
        )}

      </div>

      {/* Persistent Bottom Emergency Dial bar (Section 5) */}
      <div className="sticky bottom-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs">
        <button
          onClick={() => setIsEditingAddressModal(true)}
          title="Click to type address manually or verify GPS"
          className="flex items-center gap-1.5 text-slate-300 text-[11px] hover:text-white transition-colors text-left max-w-[240px] truncate group cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="truncate">{currentAddress}</span>
          <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
        </button>

        <button
          onClick={() => setActiveModal('voice')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-semibold text-xs shadow-md transition-colors"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{t.askAi}</span>
        </button>
      </div>

      {/* Manual Address Selection Modal */}
      {isEditingAddressModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <h4 className="font-bold text-white text-sm">Set Your Emergency Address</h4>
              </div>
              <button 
                onClick={() => setIsEditingAddressModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <ManualAddressInput
                currentAddress={currentAddress}
                currentCoords={currentCoords}
                accentColor="rose"
                onLocationChange={(newAddr, newCoords) => {
                  setCurrentAddress(newAddr);
                  setCurrentCoords(newCoords);
                }}
              />

              <button
                onClick={() => setIsEditingAddressModal(false)}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Confirm Emergency Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safe & Secure Registration Modal */}
      {isSafeModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-700/80 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <div>
                  <h4 className="font-bold text-white text-sm">Register Safe & Secure Status</h4>
                  <div className="text-[10px] text-emerald-400 font-mono">Disaster Command Roll-Call Service</div>
                </div>
              </div>
              <button 
                onClick={() => setIsSafeModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-200 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Confirming safety transmits the official <b className="text-white">🛡️ SAFE &amp; SECURE</b> symbol to emergency services, letting responders focus on critical victims.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={safeCitizenName}
                  onChange={(e) => setSafeCitizenName(e.target.value)}
                  placeholder="e.g. Kavitha Rangarajan"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={safePhone}
                  onChange={(e) => setSafePhone(e.target.value)}
                  placeholder="+91 98401 23891"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Current Safe Location</label>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{currentAddress}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono shrink-0 ml-1">
                    {currentCoords[0].toFixed(3)}°, {currentCoords[1].toFixed(3)}°
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Safety Note / Family Count (Optional)</label>
                <textarea
                  value={safeNotes}
                  onChange={(e) => setSafeNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Family of 3 safe on second floor, electricity active."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => setIsSafeModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    registerCitizenSafe(true, {
                      name: safeCitizenName.trim() || 'Citizen Verified',
                      address: currentAddress,
                      location: currentCoords,
                      phone: safePhone.trim(),
                      notes: safeNotes.trim()
                    });
                    setIsSafeModalOpen(false);
                  }}
                  className="flex-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>🛡️</span>
                  <span>Confirm Safe &amp; Secure</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
