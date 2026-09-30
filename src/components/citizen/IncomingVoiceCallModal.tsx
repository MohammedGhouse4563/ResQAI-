import React, { useState, useEffect } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  Phone, 
  PhoneOff, 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Radio, 
  Navigation, 
  Home,
  Check
} from 'lucide-react';
import { 
  getAutoVoiceCallScript, 
  synthesizeSpeech, 
  stopSpeech, 
  playPhoneRingtone, 
  stopAudioEffects 
} from '../../utils/voiceAssistant';
import { ResQLogo } from '../common/ResQLogo';

export const IncomingVoiceCallModal: React.FC = () => {
  const { 
    disasterPhase, 
    language, 
    registerCitizenSafe, 
    triggerCitizenSOS, 
    activeIncomingCall, 
    closeIncomingVoiceCall,
    setActiveModal
  } = useDisaster();

  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [ivrFeedback, setIvrFeedback] = useState<string>('');

  const phase = activeIncomingCall?.phase || disasterPhase;
  const script = getAutoVoiceCallScript(phase, language, 'Delta Enclave (Your Sector)');

  // Ringtone on mount
  useEffect(() => {
    playPhoneRingtone();
    return () => {
      stopAudioEffects();
      stopSpeech();
    };
  }, []);

  // Duration timer
  useEffect(() => {
    let interval: any = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const handleAnswerCall = async () => {
    stopAudioEffects();
    setCallState('connected');
    // Speak emergency announcement out loud
    await synthesizeSpeech(script.spokenAudioText, language);
  };

  const handleDeclineCall = () => {
    stopAudioEffects();
    stopSpeech();
    setCallState('ended');
    setTimeout(() => {
      closeIncomingVoiceCall();
    }, 400);
  };

  const handlePressKey = async (key: '1' | '2' | '3') => {
    setPressedKey(key);
    stopSpeech();

    if (key === '1') {
      // Safe & Secure
      registerCitizenSafe(true, {
        name: 'Kavitha Rangarajan',
        address: 'Delta Enclave, Sector 4B',
        phone: '+91 98401 23891',
        notes: 'Verified via Emergency AI Voice Call Key 1'
      });
      const confirmText = language === 'ta' 
        ? 'உங்கள் பாதுகாப்பு நிலை உறுதிசெய்யப்பட்டது. பேரிடர் மையத்தில் பதிவு செய்யப்பட்டது. நன்றி.'
        : language === 'hi'
        ? 'आपकी सुरक्षा की पुष्टि हो गई है। कमान केंद्र को सूचित कर दिया गया है। धन्यवाद।'
        : 'Your Safe and Secure status has been verified and registered with District Command. Stay safe.';
      setIvrFeedback(confirmText);
      await synthesizeSpeech(confirmText, language);
    } else if (key === '2') {
      // SOS Rescue
      triggerCitizenSOS(
        'flood',
        'EMERGENCY SOS triggered via incoming AI Voice Call (Key 2 pressed: Citizen trapped / requires immediate rescue)',
        3,
        '+91 98401 23891',
        'Kavitha Rangarajan'
      );
      const confirmText = language === 'ta'
        ? 'அவசர உதவி கோரிக்கை ஏற்கப்பட்டது. மீட்புக்குழு உங்கள் இருப்பிடத்திற்கு உடனடியாக விரைகிறது.'
        : language === 'hi'
        ? 'आपातकालीन सहायता अनुरोध दर्ज कर लिया गया है। बचाव दल तुरंत रवाना हो रहा है।'
        : 'Emergency rescue beacon logged. NDRF boat teams have been dispatched to your GPS location.';
      setIvrFeedback(confirmText);
      await synthesizeSpeech(confirmText, language);
    } else if (key === '3') {
      const confirmText = language === 'ta'
        ? 'அருகிலுள்ள பாதுகாப்பான முகாம் வடக்கு மேல்நிலைப்பள்ளி. வடக்கு மேம்பாலம் வழியாக மட்டுமே செல்லவும்.'
        : language === 'hi'
        ? 'निकटतम सुरक्षित आश्रय नॉर्थ हाई स्कूल है। केवल उत्तरी एलिवेटेड सड़क से जाएं।'
        : 'The safest designated shelter is North High School via North Elevated Expressway. Do not cross riverbank roads.';
      setIvrFeedback(confirmText);
      await synthesizeSpeech(confirmText, language);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col items-center justify-between min-h-[520px] text-center animate-in zoom-in-95">
        
        {/* Top Calling Badge */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>AI EMERGENCY CALL</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {phase === 'before' ? 'PRE-DISASTER' : 'ACTIVE DISASTER'}
          </span>
        </div>

        {/* Center Caller Profile */}
        <div className="py-6 space-y-4 flex flex-col items-center">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              callState === 'ringing' 
                ? 'bg-rose-950/80 border-2 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.4)] animate-pulse'
                : 'bg-emerald-950/80 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.35)]'
            }`}>
              <ResQLogo size={56} />
            </div>
            {callState === 'ringing' && (
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs animate-ping"></span>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-white tracking-tight">
              112 / DISASTER COMMAND
            </h3>
            <p className="text-xs font-mono text-rose-400 font-semibold">
              AI AUTOMATED EVACUATION DISPATCH
            </p>
            <p className="text-[11px] text-slate-400">
              {phase === 'before' 
                ? '🟡 Urgent Pre-Disaster Early Flood Warning' 
                : '🔴 Critical Flood Breach Immediate Evacuation'}
            </p>
          </div>

          {/* Connected Call Timer & Audio wave */}
          {callState === 'connected' && (
            <div className="space-y-2">
              <div className="text-sm font-mono font-bold text-emerald-400">
                {formatTimer(callDuration)}
              </div>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5, 6].map((bar) => (
                  <span 
                    key={bar} 
                    className="w-1 bg-emerald-400 rounded-full animate-pulse"
                    style={{ 
                      height: `${12 + (bar % 3) * 8}px`,
                      animationDelay: `${bar * 150}ms`
                    }}
                  ></span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Spoken Transcript or Guide when Connected */}
        {callState === 'connected' && (
          <div className="w-full space-y-3 mb-4 text-left">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold uppercase">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>AI Emergency Speaker Active:</span>
              </div>
              <p className="text-slate-200 text-[11px] leading-relaxed italic">
                "{ivrFeedback || script.spokenAudioText}"
              </p>
            </div>

            {/* Interactive Keypad Options */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider text-center">
                Press Keypad Option:
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handlePressKey('1')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    pressedKey === '1'
                      ? 'bg-emerald-900 border-emerald-400 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-emerald-600 text-slate-200'
                  }`}
                >
                  <span className="text-base font-black">1</span>
                  <span className="text-[9px] font-bold text-emerald-400">I Am Safe 🛡️</span>
                </button>

                <button
                  onClick={() => handlePressKey('2')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    pressedKey === '2'
                      ? 'bg-rose-900 border-rose-400 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-rose-600 text-slate-200'
                  }`}
                >
                  <span className="text-base font-black">2</span>
                  <span className="text-[9px] font-bold text-rose-400">SOS Rescue 🚨</span>
                </button>

                <button
                  onClick={() => handlePressKey('3')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    pressedKey === '3'
                      ? 'bg-cyan-900 border-cyan-400 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-cyan-600 text-slate-200'
                  }`}
                >
                  <span className="text-base font-black">3</span>
                  <span className="text-[9px] font-bold text-cyan-400">Safe Route 🗺️</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="w-full pt-2">
          {callState === 'ringing' ? (
            <div className="flex items-center justify-around w-full">
              {/* Decline Button */}
              <button
                onClick={handleDeclineCall}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex flex-col items-center justify-center gap-1 shadow-lg shadow-rose-950/60 active:scale-95 transition-all cursor-pointer"
              >
                <PhoneOff className="w-6 h-6" />
                <span className="text-[9px] font-bold uppercase">Decline</span>
              </button>

              {/* Answer Button */}
              <button
                onClick={handleAnswerCall}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-950/60 animate-bounce active:scale-95 transition-all cursor-pointer"
              >
                <Phone className="w-6 h-6" />
                <span className="text-[9px] font-bold uppercase">Answer</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              {/* End Call Button */}
              <button
                onClick={handleDeclineCall}
                className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-red-950/50 cursor-pointer transition-all"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Emergency Call</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
