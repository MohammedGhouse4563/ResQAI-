import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { Navigation, ShieldCheck, AlertTriangle, ArrowRight, X, MapPin, ExternalLink, Compass } from 'lucide-react';
import { getGoogleMapsNavigationUrl } from '../../services/googleMapsService';

export const SafeRouteModal: React.FC = () => {
  const { t, setActiveModal } = useDisaster();

  // North High School coordinates: 13.0640, 80.2450
  const googleMapsUrl = getGoogleMapsNavigationUrl(13.0640, 80.2450, 13.0465, 80.2220);

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {t.safeRoute}
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium">
                100% Inundation-Free Elevation Route
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Danger Warning on Submerged Roads */}
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px]">
              <span className="font-bold text-rose-200 uppercase">AVOID HAZARDOUS ROADS:</span>
              <p className="text-rose-300/90 leading-tight">
                Riverbank Boulevard and Apex Bridge are submerged under 1.4m of moving current. Do NOT attempt crossing on foot or vehicle.
              </p>
            </div>
          </div>

          {/* Destination Header */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">Safe Destination:</span>
              <div className="font-bold text-white text-sm">North High School Relief Complex</div>
              <div className="text-emerald-400 text-[11px]">Distance: 1.2 km · Est. Walk Time: 14 mins</div>
            </div>
            <div className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono font-bold text-xs">
              500 BEDS VACANT
            </div>
          </div>

          {/* Turn-by-turn safe navigation */}
          <div className="space-y-3">
            <div className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">
              Step-by-Step Evacuation Path:
            </div>

            <div className="space-y-2">
              
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <div className="font-semibold text-white">Exit Delta Riverside Housing via Northern Gate</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Walk 250m north along dry elevation slope. Avoid the southern riverbank footpath.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-emerald-900/60 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-900 text-emerald-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <div className="font-semibold text-white">Ascend Ramp onto North Elevated Expressway</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Expressway is closed to commercial traffic and designated as an active emergency corridor. Traffic police on site.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <div className="font-semibold text-white">Take Stadium Exit into Relief Gate 2</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Hot food, potable water distribution, and first-aid medical desk operating in the main gymnasium.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Safety check confirmation */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Path continuously verified by live hydrological sensors and drone patrol.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 font-bold text-white text-xs transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <span>Open in Google Maps</span>
            </a>

            <button
              onClick={() => setActiveModal(null)}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs transition-colors cursor-pointer"
            >
              View on Safe Tactical Map
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
