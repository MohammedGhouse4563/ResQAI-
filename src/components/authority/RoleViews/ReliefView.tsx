import React from 'react';
import { useDisaster } from '../../../context/DisasterContext';
import { Home, Droplets, Utensils, Zap, ShieldCheck } from 'lucide-react';

export const ReliefView: React.FC = () => {
  const { shelters, resourceRequirements } = useDisaster();

  const totalCap = shelters.reduce((acc, s) => acc + s.totalCapacity, 0);
  const totalOcc = shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const totalWaterStock = shelters.reduce((acc, s) => acc + s.waterKitsStock, 0);

  return (
    <div className="space-y-4 select-none">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Total Shelter Occupancy</div>
          <div className="text-xl font-bold font-mono text-white mt-0.5">{totalOcc} / {totalCap}</div>
          <div className="text-[10px] text-slate-500 mt-1">{totalCap - totalOcc} vacancies available across 3 hubs</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Potable Water Kits on Site</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{totalWaterStock} Kits</div>
          <div className="text-[10px] text-cyan-500/80 mt-1">Disaster requirement: ~14,100 kits</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Total Water Kit Deficit</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">-4,300 Kits</div>
          <div className="text-[10px] text-rose-500/80 mt-1">Requires emergency warehouse transfer</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Average Food Supply</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">3.8 Days</div>
          <div className="text-[10px] text-amber-500/80 mt-1">Emergency rations stockpiled</div>
        </div>
      </div>

      {/* Shelter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shelters.map(shelter => {
          const occPercent = shelter.totalCapacity > 0 ? Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100) : 100;
          const isCrowded = occPercent >= 85 || shelter.status === 'near_capacity' || shelter.status === 'overcrowded';
          const isCompromised = shelter.status === 'compromised';

          return (
            <div 
              key={shelter.id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                isCompromised 
                  ? 'bg-rose-950/20 border-rose-800' 
                  : isCrowded 
                    ? 'bg-slate-900 border-amber-800' 
                    : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2 mb-3 border-b border-slate-800">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{shelter.name}</h4>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{shelter.zoneId}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    isCompromised ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    isCrowded ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300'
                  }`}>
                    {shelter.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Occupancy Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Current Bed Capacity</span>
                      <span className="font-mono text-white font-bold">{shelter.currentOccupancy} / {shelter.totalCapacity} ({occPercent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isCrowded ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, occPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Supplies */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] p-2 rounded bg-slate-950 border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Utensils className="w-3.5 h-3.5 text-amber-400" />
                      <span>Food: <b className="font-mono text-white">{shelter.foodDaysSupply} days</b></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Water: <b className="font-mono text-white">{shelter.waterKitsStock} kits</b></span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Zap className={`w-3.5 h-3.5 ${shelter.hasBackupPower ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span>{shelter.hasBackupPower ? 'Generator Active' : 'No Backup Power'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className={`w-3.5 h-3.5 ${shelter.hasMedicalPost ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span>{shelter.hasMedicalPost ? 'Doctor Staged' : 'First Aid Only'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Safe Ingress Route: <span className="text-emerald-400 font-semibold">{shelter.safeAccessRoad}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
