import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { SlidersHorizontal, RotateCcw, AlertTriangle, CloudRain, ShieldBan, Hospital as HospIcon, Anchor, X } from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const { whatIf, updateWhatIf, resetWhatIf, setActiveModal } = useDisaster();

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Digital Twin: "What-If?" Simulation Laboratory
              </h3>
              <p className="text-xs text-slate-400">
                Stress-test hydrological conditions, infrastructure failures, and demand shocks before they manifest.
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

        {/* Content Controls */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Rainfall Surge */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-slate-200">Upstream Rainfall Intensity Multiplier</span>
              </div>
              <span className="font-mono text-cyan-300 font-bold text-sm">
                +{whatIf.rainfallIncreasePercent}%
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {[0, 15, 30, 50].map((val) => (
                <button
                  key={val}
                  onClick={() => updateWhatIf({ rainfallIncreasePercent: val })}
                  className={`flex-1 py-1.5 rounded-lg font-mono font-medium transition-colors ${
                    whatIf.rainfallIncreasePercent === val 
                      ? 'bg-cyan-600 text-white shadow-sm' 
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {val === 0 ? 'Baseline' : `+${val}%`}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Simulates cloudburst upstream. Triggers deeper flood depth and expands Zone B/C flood polygon boundary.
            </p>
          </div>

          {/* Infrastructure Shocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Bridge Blocked */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              whatIf.mainBridgeBlocked ? 'bg-rose-950/40 border-rose-700' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <ShieldBan className="w-4 h-4 text-rose-400" />
                  Apex River Bridge Impassable
                </span>
                <input 
                  type="checkbox"
                  checked={whatIf.mainBridgeBlocked}
                  onChange={(e) => updateWhatIf({ mainBridgeBlocked: e.target.checked })}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Cuts off the primary transit artery. Ambulance travel times increase by +18 mins; forces detour via Elevated Highway.
              </p>
            </div>

            {/* Shelter Compromised */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              whatIf.shelterWestCompromised ? 'bg-rose-950/40 border-rose-700' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  West Polytech Shelter Flooded
                </span>
                <input 
                  type="checkbox"
                  checked={whatIf.shelterWestCompromised}
                  onChange={(e) => updateWhatIf({ shelterWestCompromised: e.target.checked })}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Forces 600 shelter beds offline. Overcrowding shifts immediately onto North High School and Civic Auditorium.
              </p>
            </div>

            {/* Hospital Surge Stress */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              whatIf.hospitalCapacityReduction ? 'bg-amber-950/40 border-amber-700' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <HospIcon className="w-4 h-4 text-sky-400" />
                  District Hospital Power Tripped
                </span>
                <input 
                  type="checkbox"
                  checked={whatIf.hospitalCapacityReduction}
                  onChange={(e) => updateWhatIf({ hospitalCapacityReduction: e.target.checked })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Reduces ICU intake capacity by 40%. Requires inter-hospital air/road patient transfers to St. Jude Metro.
              </p>
            </div>

            {/* Population Surge */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              whatIf.populationSurgePercent > 0 ? 'bg-amber-950/40 border-amber-700' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Anchor className="w-4 h-4 text-amber-400" />
                  Population Displacement Surge (+30%)
                </span>
                <input 
                  type="checkbox"
                  checked={whatIf.populationSurgePercent > 0}
                  onChange={(e) => updateWhatIf({ populationSurgePercent: e.target.checked ? 30 : 0 })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Simulates panic evacuation of adjacent informal settlements. Increases potable water demand by +1,800 kits.
              </p>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <button
            onClick={resetWhatIf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline Telemetry</span>
          </button>

          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
          >
            Apply Digital Twin & Close
          </button>
        </div>

      </div>
    </div>
  );
};
