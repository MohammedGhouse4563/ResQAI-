import React, { useState } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { EmergencyCategory, IncidentSOS } from '../../types';
import { AlertOctagon, Phone, MapPin, Users, CheckCircle2, X, Send, ShieldAlert, Locate, ExternalLink } from 'lucide-react';
import { getGoogleMapsNavigationUrl } from '../../services/googleMapsService';
import { ManualAddressInput } from './ManualAddressInput';

interface CategoryOption {
  key: EmergencyCategory;
  labelKey: keyof typeof import('../../data/translations').translations['en'];
  icon: string;
}

const CATEGORIES: CategoryOption[] = [
  { key: 'medical', labelKey: 'medical', icon: '🚑' },
  { key: 'trapped', labelKey: 'trapped', icon: '🆘' },
  { key: 'flood', labelKey: 'flood', icon: '🌊' },
  { key: 'rescue', labelKey: 'rescueRequired', icon: '🚤' },
  { key: 'fire', labelKey: 'fire', icon: '🔥' },
  { key: 'accident', labelKey: 'accident', icon: '⚠️' },
  { key: 'missing', labelKey: 'missingPerson', icon: '👤' },
  { key: 'other', labelKey: 'otherEmergency', icon: '🚨' }
];

export const SosModal: React.FC = () => {
  const { t, triggerCitizenSOS, setActiveModal, isOffline } = useDisaster();

  const [category, setCategory] = useState<EmergencyCategory>('medical');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [message, setMessage] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState<IncidentSOS | null>(null);

  // Live Location with Google Maps Geocoding
  const [coords, setCoords] = useState<[number, number]>([13.0465, 80.2220]);
  const [address, setAddress] = useState<string>('Delta Enclave, Sector 4B');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fullMessage = message ? `${message} [Verified via Google Maps: ${address}]` : `Verified via Google Maps: ${address}`;
      const inc = await triggerCitizenSOS(category, fullMessage, peopleCount, userPhone, userName);
      setSubmittedIncident(inc);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-rose-950/50 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-rose-950/80 p-4 border-b border-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide uppercase font-mono">
                {t.sosButton}
              </h3>
              <p className="text-[11px] text-rose-300">
                Direct Emergency Beacon to District Disaster Command
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg hover:bg-rose-900 text-rose-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto text-xs space-y-4">
          
          {submittedIncident ? (
            /* Submission Confirmation Screen */
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-2xl animate-bounce">
                ✓
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">
                  {isOffline ? 'SOS Stored Locally (Offline Queue)' : 'SOS Beacon Transmitted Successfully'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isOffline ? t.offlineQueuedNotice : t.sosSentSuccess}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Beacon ID:</span>
                  <span className="text-rose-400 font-bold">{submittedIncident.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="text-white capitalize">{submittedIncident.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location GPS:</span>
                  <span className="text-cyan-300 font-mono">{coords[0].toFixed(4)}° N, {coords[1].toFixed(4)}° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Google Maps Tag:</span>
                  <span className="text-white font-sans text-right truncate max-w-[220px]">{address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recommended Unit:</span>
                  <span className="text-emerald-400 font-semibold">{submittedIncident.recommendedResponse}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-amber-300 font-bold uppercase">{submittedIncident.status}</span>
                </div>
              </div>

              {/* View in Google Maps Button */}
              <div className="flex justify-center">
                <a
                  href={getGoogleMapsNavigationUrl(coords[0], coords[1])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Verify Beacon on Google Maps</span>
                </a>
              </div>

              {/* Direct Telephone Emergency Call Option (Section 5 & 9) */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <a
                  href="tel:112"
                  className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 112 Emergency Dispatch Now</span>
                </a>
                <p className="text-[10px] text-slate-500 leading-snug">
                  {t.realCallDisclaimer}
                </p>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Close & Return to Safety Map
              </button>
            </div>
          ) : (
            /* SOS Creation Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Emergency Category Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  {t.emergencyType}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat.key;
                    return (
                      <button
                        type="button"
                        key={cat.key}
                        onClick={() => setCategory(cat.key)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                          isSelected 
                            ? 'bg-rose-950 border-rose-500 text-white shadow-md shadow-rose-950/40 scale-102 font-semibold' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="text-[11px] leading-tight">
                          {t[cat.labelKey] as string}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Citizen Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Your Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Mobile Number</label>
                  <input 
                    type="tel"
                    required
                    placeholder="+91 98400 00000"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              {/* People Count & Message */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Persons at Scene</label>
                  <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setPeopleCount(c => Math.max(1, c - 1))}
                      className="px-3 py-2 text-slate-400 hover:text-white bg-slate-900"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-mono font-bold text-white">
                      {peopleCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPeopleCount(c => c + 1)}
                      className="px-3 py-2 text-slate-400 hover:text-white bg-slate-900"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-medium mb-1">Emergency Message / Landmarks</label>
                  <input 
                    type="text"
                    placeholder="Water level, floor number, medical symptoms..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Interactive Address & Geolocation with Manual Typing */}
              <ManualAddressInput
                currentAddress={address}
                currentCoords={coords}
                accentColor="rose"
                onLocationChange={(newAddr, newCoords) => {
                  setAddress(newAddr);
                  setCoords(newCoords);
                }}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? t.sendingSos : t.confirmSos}</span>
              </button>

              {/* Fallback Call Link */}
              <div className="text-center pt-1">
                <a
                  href="tel:112"
                  className="text-rose-400 hover:text-rose-300 font-semibold underline text-xs inline-flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Immediate Life Threat? Tap for Direct 112 Dialer</span>
                </a>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
