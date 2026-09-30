import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { Home, MapPin, Droplets, Zap, ShieldCheck, X, Navigation } from 'lucide-react';

export const ShelterListModal: React.FC = () => {
  const { shelters, t, setActiveModal } = useDisaster();

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {t.findShelter}
              </h3>
              <p className="text-[11px] text-slate-400">
                Official Designated High-Ground Evacuation Facilities
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
        <div className="p-4 space-y-3 max-h-[75vh] overflow-y-auto text-xs">
          {shelters.map((shelter) => {
            const vacantBeds = Math.max(0, shelter.totalCapacity - shelter.currentOccupancy);
            const isFull = vacantBeds === 0 || shelter.status === 'overcrowded';
            const isCompromised = shelter.status === 'compromised';

            return (
              <div 
                key={shelter.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCompromised 
                    ? 'bg-rose-950/20 border-rose-900 text-slate-400' 
                    : isFull 
                      ? 'bg-slate-950 border-amber-900/60' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 pb-1.5 mb-2 border-b border-slate-800/80">
                  <div>
                    <h4 className="font-bold text-white text-xs">{shelter.name}</h4>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {shelter.safeAccessRoad}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    isCompromised ? 'bg-rose-950 text-rose-300' :
                    isFull ? 'bg-amber-950 text-amber-300' :
                    'bg-emerald-950 text-emerald-300'
                  }`}>
                    {isCompromised ? 'INACCESSIBLE' : `${vacantBeds} BEDS OPEN`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Water: <b className="font-mono text-white">{shelter.waterKitsStock} kits</b></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Zap className={`w-3.5 h-3.5 ${shelter.hasBackupPower ? 'text-amber-400' : 'text-slate-600'}`} />
                    <span>Power: {shelter.hasBackupPower ? 'Generator Ready' : 'Off-grid'}</span>
                  </div>
                </div>

                {!isCompromised && (
                  <button
                    onClick={() => setActiveModal('safeRoute')}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{t.openDirections} (Elevated Corridor)</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
