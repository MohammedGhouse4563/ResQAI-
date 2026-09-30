import React from 'react';
import { useDisaster } from '../../../context/DisasterContext';
import { Flame, Anchor, ShieldAlert, Navigation, LifeBuoy } from 'lucide-react';

export const FireRescueView: React.FC = () => {
  const { units, roads, incidents } = useDisaster();

  const fireUnits = units.filter(u => u.type === 'fire_engine' || u.type === 'rescue_team');
  const boatUnits = units.filter(u => u.type === 'rescue_team');
  const trappedReports = incidents.filter(i => i.category === 'trapped' || i.category === 'rescue');

  return (
    <div className="space-y-4 select-none">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Flood Rescue Dinghies</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{boatUnits.length} Teams</div>
          <div className="text-[10px] text-slate-500 mt-1">Equipped with sonar & night lights</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Heavy Pumping Tenders</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">3 Units</div>
          <div className="text-[10px] text-amber-500/80 mt-1">High-volume de-watering pumps</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Trapped Citizen Reports</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{trappedReports.length} Cases</div>
          <div className="text-[10px] text-rose-500/80 mt-1">Active rooftop/mezzanine rescues</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Available Responders</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
            {fireUnits.filter(u => u.status === 'available' || u.status === 'staging').length} Units
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-1">Ready for deployment</div>
        </div>
      </div>

      {/* Rescue Fleet Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <LifeBuoy className="w-4 h-4 text-cyan-400" />
          <span>Fire, Pumping, and Inflatable Dinghy Operations</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fireUnits.map(unit => (
            <div key={unit.id} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                <span className="font-mono font-bold text-white text-xs">{unit.callSign}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize font-semibold ${
                  unit.status === 'available' ? 'bg-emerald-950 text-emerald-300' :
                  unit.status === 'staging' ? 'bg-amber-950 text-amber-300' :
                  'bg-rose-950 text-rose-300'
                }`}>
                  {unit.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-300 space-y-1">
                <div>Zone: <span className="font-mono text-slate-400 uppercase">{unit.assignedZone}</span></div>
                <div>Crew: <span className="font-mono text-white">{unit.crewCount} personnel</span></div>
                <div>Equipment: <span className="text-slate-400">{unit.equipment.join(' · ')}</span></div>
                {unit.currentDestinationName && (
                  <div className="text-amber-300 font-medium">Navigating to: {unit.currentDestinationName}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Structural & Road Inundation Risks */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          Critical Waterlogging & Bridge Access Impediments
        </h4>
        <div className="space-y-2">
          {roads.filter(r => r.status !== 'clear').map(r => (
            <div key={r.id} className="p-3 rounded-lg bg-slate-950 border border-rose-950/80 flex items-start justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-white">{r.name}</div>
                <p className="text-slate-400 text-[11px] mt-0.5">{r.detourAdvice}</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono text-[10px] uppercase font-bold shrink-0">
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
