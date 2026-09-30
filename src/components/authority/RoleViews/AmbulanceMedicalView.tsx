import React from 'react';
import { useDisaster } from '../../../context/DisasterContext';
import { Activity, MapPin, BatteryCharging, Radio, ShieldCheck, HeartPulse } from 'lucide-react';

export const AmbulanceMedicalView: React.FC = () => {
  const { units, hospitals, resourceRequirements } = useDisaster();

  const ambulances = units.filter(u => u.type === 'ambulance');
  const availableCount = ambulances.filter(u => u.status === 'available').length;
  const stagingCount = ambulances.filter(u => u.status === 'staging').length;
  const enRouteCount = ambulances.filter(u => u.status === 'assigned' || u.status === 'en_route').length;

  return (
    <div className="space-y-4 select-none">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Total Fleet</div>
          <div className="text-xl font-bold font-mono text-white mt-0.5">{ambulances.length} Units</div>
          <div className="text-[10px] text-slate-500 mt-1">4 ALS · 3 BLS · 1 High-Water</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Available</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{availableCount} Units</div>
          <div className="text-[10px] text-emerald-500/80 mt-1">Immediate dispatch ready</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Pre-Positioned / Staging</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{stagingCount} Units</div>
          <div className="text-[10px] text-amber-500/80 mt-1">At high-ground perimeters</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Active Missions</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{enRouteCount} Units</div>
          <div className="text-[10px] text-rose-500/80 mt-1">Navigating to critical SOS</div>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-rose-400" />
          <span>Ambulance Telemetry & Strategic Staging Grid</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2 px-3">Call Sign</th>
                <th className="py-2 px-3">Zone</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Destination / Staging</th>
                <th className="py-2 px-3">Crew & Equipment</th>
                <th className="py-2 px-3 text-right">Battery / Fuel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ambulances.map(amb => (
                <tr key={amb.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-200 font-mono">
                    {amb.callSign}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300 uppercase">
                    {amb.assignedZone}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold capitalize ${
                      amb.status === 'available' ? 'bg-emerald-950 text-emerald-300' :
                      amb.status === 'staging' ? 'bg-amber-950 text-amber-300' :
                      'bg-rose-950 text-rose-300'
                    }`}>
                      {amb.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {amb.currentDestinationName || 'Holding at Sector Station'}
                    {amb.etaMinutes && <span className="ml-1 text-cyan-300 font-mono">· ETA {amb.etaMinutes}m</span>}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {amb.crewCount} crew · {amb.equipment.join(', ')}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-cyan-300 font-semibold tabular-nums">
                    {amb.fuelBatteryPercent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hospital Intake Surge Board */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          Receiving Trauma Center Surge Capacity
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {hospitals.map(h => (
            <div key={h.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-semibold text-white text-xs">{h.name}</div>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>General Bed Load:</span>
                  <span className="font-mono text-white">{h.occupiedBeds} / {h.totalBeds} ({Math.round(h.occupiedBeds/h.totalBeds*100)}%)</span>
                </div>
                <div className="flex justify-between">
                  <span>ICU Saturation:</span>
                  <span className="font-mono text-rose-400 font-bold">{h.icuBedsOccupied} / {h.icuBedsTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Predicted 4h Inflow:</span>
                  <span className="font-mono text-amber-300 font-bold">+{h.predictedSurgeNext4h} patients</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
