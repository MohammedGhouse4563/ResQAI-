import React, { useState, useEffect, useRef } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  PhoneCall, 
  Radio, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Sparkles, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Play, 
  Square, 
  RotateCw,
  BellRing,
  PhoneForwarded,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  getAutoVoiceCallScript, 
  synthesizeSpeech, 
  stopSpeech, 
  playEmergencySiren, 
  stopAudioEffects 
} from '../../utils/voiceAssistant';
import { SupportedLanguage, DisasterPhase } from '../../types';
import { ResQLogo } from '../common/ResQLogo';

interface CallRecipientLog {
  id: string;
  phone: string;
  name: string;
  zone: string;
  status: 'dialing' | 'connected' | 'safe_confirmed' | 'sos_triggered' | 'voicemail';
  responseKey?: string;
  timestamp: string;
}

export const AiAutoVoiceCallModal: React.FC = () => {
  const { 
    disasterPhase, 
    zones, 
    setActiveModal, 
    safeCount, 
    registerCitizenSafe,
    triggerCitizenSOS,
    triggerIncomingVoiceCall
  } = useDisaster();

  // Campaign Configuration State
  const [selectedPhase, setSelectedPhase] = useState<DisasterPhase>(disasterPhase === 'after' ? 'during' : disasterPhase);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('all');
  const [callLang, setCallLang] = useState<SupportedLanguage>('en');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);

  // Broadcast execution state
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [activeCallStats, setActiveCallStats] = useState({
    totalCalls: 18500,
    dialed: 0,
    connected: 0,
    safeResponses: 0,
    sosResponses: 0
  });

  const [callFeed, setCallFeed] = useState<CallRecipientLog[]>([]);

  // Calculate target population
  const targetZone = zones.find(z => z.id === selectedZoneId);
  const targetPopulation = selectedZoneId === 'all' 
    ? zones.reduce((acc, z) => acc + z.exposedPopulation, 0)
    : (targetZone?.exposedPopulation || 12500);

  const zoneDisplayName = selectedZoneId === 'all' 
    ? 'All Inundation Sectors (Zone A, B, C)' 
    : (targetZone?.name || 'Selected Sector');

  // Dynamic AI Voice script
  const script = getAutoVoiceCallScript(selectedPhase, callLang, zoneDisplayName);
  const broadcastIntervalRef = useRef<any>(null);

  // Stop audio and intervals on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      stopAudioEffects();
      if (broadcastIntervalRef.current) {
        clearInterval(broadcastIntervalRef.current);
      }
    };
  }, []);

  // Audio Preview Handler
  const handlePlayVoicePreview = async () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }
    stopAudioEffects();
    setIsPlayingSiren(false);
    setIsPlayingAudio(true);
    await synthesizeSpeech(script.spokenAudioText, callLang);
    setIsPlayingAudio(false);
  };

  const handleToggleSiren = () => {
    if (isPlayingSiren) {
      stopAudioEffects();
      setIsPlayingSiren(false);
    } else {
      stopSpeech();
      setIsPlayingAudio(false);
      setIsPlayingSiren(true);
      playEmergencySiren(6);
      setTimeout(() => setIsPlayingSiren(false), 6000);
    }
  };

  // Launch Automated Voice Call Campaign
  const handleLaunchCampaign = () => {
    setIsBroadcasting(true);
    setBroadcastProgress(5);
    setActiveCallStats({
      totalCalls: targetPopulation,
      dialed: Math.floor(targetPopulation * 0.15),
      connected: Math.floor(targetPopulation * 0.12),
      safeResponses: 0,
      sosResponses: 0
    });

    const mockNames = [
      'Sundaravel M.', 'Kavitha Rangarajan', 'Arun Kumar', 'Priya Seshadri',
      'Dr. N. Ramanathan', 'Deepa Venkat', 'Rajesh K.', 'Anandhi Selvam',
      'Suresh Babu', 'Meenakshi Iyer', 'Gopinath V.', 'Lakshmi Narayanan'
    ];

    let currentProgress = 15;
    let safeTally = 0;
    let sosTally = 0;

    if (broadcastIntervalRef.current) {
      clearInterval(broadcastIntervalRef.current);
    }

    broadcastIntervalRef.current = setInterval(() => {
      currentProgress += 12;
      const dialedCount = Math.min(targetPopulation, Math.floor(targetPopulation * (currentProgress / 100)));
      const connectedCount = Math.floor(dialedCount * 0.91);
      
      // Randomly simulate responses
      const isSafe = Math.random() > 0.15;
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
      const randomPhone = `+91 984${Math.floor(10 + Math.random() * 89)} ${Math.floor(10000 + Math.random() * 89999)}`;

      if (isSafe) {
        safeTally += 1;
        // Register in Safe Roll-Call
        registerCitizenSafe(true, {
          name: randomName,
          address: `${zoneDisplayName}, Sector ${Math.floor(1 + Math.random() * 5)}`,
          phone: randomPhone,
          location: [13.045 + Math.random() * 0.02, 80.215 + Math.random() * 0.02],
          notes: 'Auto IVR Voice Call: Pressed 1 (Safe & Secure 🛡️)'
        });
      } else {
        sosTally += 1;
        triggerCitizenSOS(
          'flood',
          `Automated Voice Call IVR Key 2 pressed: Citizen requested immediate emergency evacuation in ${zoneDisplayName}.`,
          Math.floor(2 + Math.random() * 4),
          randomPhone,
          randomName
        );
      }

      const newLog: CallRecipientLog = {
        id: `call-${Date.now()}-${Math.random()}`,
        phone: randomPhone,
        name: randomName,
        zone: zoneDisplayName,
        status: isSafe ? 'safe_confirmed' : 'sos_triggered',
        responseKey: isSafe ? 'Key 1 (Safe 🛡️)' : 'Key 2 (SOS 🚨)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setCallFeed(prev => [newLog, ...prev.slice(0, 15)]);

      setActiveCallStats({
        totalCalls: targetPopulation,
        dialed: dialedCount,
        connected: connectedCount,
        safeResponses: safeTally,
        sosResponses: sosTally
      });

      setBroadcastProgress(Math.min(100, currentProgress));

      if (currentProgress >= 100) {
        clearInterval(broadcastIntervalRef.current);
        broadcastIntervalRef.current = null;
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 p-0.5 flex items-center justify-center shadow-lg shadow-rose-950/40">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <PhoneCall className="w-5 h-5 text-rose-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base tracking-tight">
                  AI Automated Emergency Voice Call &amp; Notification Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-700">
                  DISASTER COMMAND IVR
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated outbound voice alerts before disaster strikes &amp; critical life-safety broadcasts during disaster.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              stopAudioEffects();
              setActiveModal(null);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Top Configuration Bar: Disaster Phase & Sector Targeting */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* 1. Disaster Phase Selector */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                <span>1. Disaster Phase Trigger</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedPhase('before')}
                  className={`py-2 px-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                    selectedPhase === 'before'
                      ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-md shadow-amber-950/40'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>Pre-Disaster</span>
                  </div>
                  <div className="text-[10px] text-amber-300/80 mt-0.5">Early Warning &amp; Evac Prep</div>
                </button>

                <button
                  onClick={() => setSelectedPhase('during')}
                  className={`py-2 px-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                    selectedPhase === 'during'
                      ? 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md shadow-rose-950/40'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>When Disaster Occurs</span>
                  </div>
                  <div className="text-[10px] text-rose-300/80 mt-0.5">Immediate Evacuation Alert</div>
                </button>
              </div>
            </div>

            {/* 2. Target Geographic Sectors */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. Target Sector</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {targetPopulation.toLocaleString()} Residents
                </span>
              </div>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="all">🚨 ALL SECTORS (Mass Emergency Broadcast)</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} — Risk {z.riskScore}% ({z.exposedPopulation.toLocaleString()} pop)
                  </option>
                ))}
              </select>
            </div>

            {/* 3. AI Voice Synthesis Language */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Voice Language &amp; Dialect</span>
              </div>
              <div className="flex items-center gap-1.5">
                {(['en', 'ta', 'hi'] as SupportedLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setCallLang(lang);
                      stopSpeech();
                      setIsPlayingAudio(false);
                    }}
                    className={`flex-1 py-1.5 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                      callLang === lang 
                        ? 'bg-rose-600 border-rose-500 text-white shadow-md' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ் (Tamil)' : 'हिन्दी (Hindi)'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* AI Voice Call Script & Audio Simulator Preview Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-white text-xs uppercase tracking-wide">
                  {script.header}
                </span>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayVoicePreview}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isPlayingAudio ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isPlayingAudio ? 'Stop Speech' : 'Listen AI Voice'}</span>
                </button>

                <button
                  onClick={handleToggleSiren}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isPlayingSiren
                      ? 'bg-rose-600 text-white animate-bounce'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <BellRing className="w-3.5 h-3.5 text-rose-400" />
                  <span>{isPlayingSiren ? 'Siren Blasting...' : 'Test Siren Tone'}</span>
                </button>
              </div>
            </div>

            {/* Script Text */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2">
              <p className="text-slate-200 text-xs leading-relaxed font-sans font-medium">
                "{script.spokenAudioText}"
              </p>
              
              {/* Interactive IVR Guide */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                <div className="flex items-center gap-1.5">
                  <PhoneForwarded className="w-3.5 h-3.5 text-cyan-400" />
                  <span>IVR KEYPAD ACTIONS: {script.ivrKeypadGuide}</span>
                </div>
              </div>
            </div>

            {/* Quick Test Call to Citizen App */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-[11px]">
              <span className="text-slate-400">
                Want to test the incoming phone call on the Citizen Mobile Screen?
              </span>
              <button
                onClick={() => {
                  triggerIncomingVoiceCall(selectedPhase);
                  setActiveModal(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Simulate Call to Citizen App</span>
              </button>
            </div>
          </div>

          {/* Broadcast Launch & Live Outbound Campaign Dashboard */}
          {!isBroadcasting ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/60 border border-rose-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">
                  Ready to Dispatch AI Automated Calls to {targetPopulation.toLocaleString()} Phones
                </h4>
                <p className="text-slate-300 text-xs mt-0.5">
                  Calls will deliver spoken emergency instructions in {callLang === 'en' ? 'English' : callLang === 'ta' ? 'Tamil' : 'Hindi'} with 1-tap automated Safe Check-In &amp; SOS Beacon detection.
                </p>
              </div>

              <button
                onClick={handleLaunchCampaign}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm tracking-wider shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <Radio className="w-4 h-4 animate-ping" />
                <span>INITIATE AI AUTO VOICE BROADCAST</span>
              </button>
            </div>
          ) : (
            /* ACTIVE CAMPAIGN DASHBOARD */
            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-800 space-y-4 shadow-xl shadow-rose-950/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="font-black text-white text-sm tracking-wide">
                    OUTBOUND AI CALL BROADCAST IN PROGRESS
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-rose-400">
                  {broadcastProgress}% COMPLETED
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${broadcastProgress}%` }}
                ></div>
              </div>

              {/* Real-time Outbound Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Target Numbers</div>
                  <div className="text-lg font-black font-mono text-white">
                    {activeCallStats.totalCalls.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-cyan-400 uppercase">Answered &amp; Spoke</div>
                  <div className="text-lg font-black font-mono text-cyan-300">
                    {activeCallStats.connected.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/80">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                    <span>🛡️ Safe Confirmed (Key 1)</span>
                  </div>
                  <div className="text-lg font-black font-mono text-emerald-300">
                    +{activeCallStats.safeResponses}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-700/80">
                  <div className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1">
                    <span>🚨 SOS Beacons (Key 2)</span>
                  </div>
                  <div className="text-lg font-black font-mono text-rose-300">
                    +{activeCallStats.sosResponses}
                  </div>
                </div>
              </div>

              {/* Live Outbound Calling Stream */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Live Automated Call Stream &amp; Recipient Responses</span>
                  <span className="text-[10px] font-mono text-slate-400">IVR 112 Dispatch Server</span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {callFeed.map((call) => (
                    <div 
                      key={call.id}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs animate-in fade-in"
                    >
                      <div className="flex items-center gap-2">
                        <PhoneCall className={`w-3.5 h-3.5 ${call.status === 'safe_confirmed' ? 'text-emerald-400' : 'text-rose-400'}`} />
                        <span className="font-bold text-white">{call.name}</span>
                        <span className="font-mono text-slate-400 text-[11px]">({call.phone})</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                          call.status === 'safe_confirmed' 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                            : 'bg-rose-950 text-rose-300 border border-rose-700'
                        }`}>
                          {call.responseKey}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{call.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ResQLogo size={20} />
            <span className="font-mono text-[11px]">ResQAI Multilingual Outbound IVR System · Telephony Gateway</span>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              stopAudioEffects();
              setActiveModal(null);
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
};
