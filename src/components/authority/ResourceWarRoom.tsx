import React, { useState } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { ShieldAlert, RefreshCw, ArrowRightLeft, CheckCircle2, AlertOctagon, Box, Edit3, Check, X } from 'lucide-react';

export const ResourceWarRoom: React.FC = () => {
  const { 
    resourceRequirements, 
    rebalanceResource,
    activeSelectedZoneId,
    setActiveSelectedZoneId,
    updateZoneName
  } = useDisaster();

  const [conflictResolved, setConflictResolved] = useState(false);
  const [isEditingZone, setIsEditingZone] = useState(false);
  const [zoneNameInput, setZoneNameInput] = useState('');

  // Selected Zone requirements
  const selectedReq = activeSelectedZoneId && resourceRequirements[activeSelectedZoneId]
    ? resourceRequirements[activeSelectedZoneId]
    : resourceRequirements['zone-a'];

  const zoneA = resourceRequirements['zone-a'];
  const zoneB = resourceRequirements['zone-b'];
  const zoneC = resourceRequirements['zone-c'];

  const handleStartRename = () => {
    setZoneNameInput(selectedReq.zoneName);
    setIsEditingZone(true);
  };

  const handleSaveRename = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (zoneNameInput.trim() && selectedReq) {
      updateZoneName(selectedReq.zoneId, zoneNameInput.trim());
    }
    setIsEditingZone(false);
  };

  // Conflict Detection: Zone C has 3 ambulances (surplus relative to danger) while Zone A & B have gaps of 7
  const hasConflict = !conflictResolved && zoneC.ambulances.available >= 2 && (zoneA.ambulances.gap > 0 || zoneB.ambulances.gap > 0);

  const handleResolveConflict = () => {
    // Rebalance 2 ambulances from Zone C to Zone A
    rebalanceResource('zone-c', 'zone-a', 'ambulance', 2);
    setConflictResolved(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 select-none">
      
      {/* Header and Zone Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Predictive Resource Demand & Gap Matrix
          </h3>
        </div>

        {/* Zone Selector Buttons and Zone Rename Tool */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800">
          {Object.values(resourceRequirements).map((req) => (
            <button
              key={req.zoneId}
              onClick={() => setActiveSelectedZoneId(req.zoneId)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                (activeSelectedZoneId === req.zoneId)
                  ? 'bg-rose-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {req.zoneName}
            </button>
          ))}

          {/* Quick Rename Button for Active Zone */}
          {isEditingZone ? (
            <form onSubmit={handleSaveRename} className="flex items-center gap-1 ml-1 bg-slate-900 px-2 py-0.5 rounded border border-rose-500">
              <input
                type="text"
                autoFocus
                value={zoneNameInput}
                onChange={(e) => setZoneNameInput(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none w-36 font-semibold"
                placeholder="Rename zone..."
              />
              <button type="submit" className="text-emerald-400 hover:text-white p-0.5">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => setIsEditingZone(false)} className="text-slate-400 hover:text-white p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={handleStartRename}
              title={`Rename ${selectedReq.zoneName}`}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors ml-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Rename Sector</span>
            </button>
          )}
        </div>
      </div>

      {/* Resource Conflict Detection Alert (Section 29) */}
      {hasConflict && (
        <div className="mb-4 p-3 rounded-lg bg-amber-950/60 border border-amber-600/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                RESOURCE CONFLICT DETECTED: SPATIAL MISMATCH
              </div>
              <div className="text-xs text-amber-300/90 mt-0.5">
                <b>Zone C:</b> 3 ambulances active (low flood threat) vs <b>Zone A:</b> Deficit of 7 ambulances (91% flood threat).
              </div>
            </div>
          </div>

          <button
            onClick={handleResolveConflict}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Authorize Rebalance (2 to Zone A)</span>
          </button>
        </div>
      )}

      {conflictResolved && (
        <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-700/80 flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Resource conflict resolved: 2 ambulances redeployed from Zone C to Zone A staging point. Audit log recorded.</span>
        </div>
      )}

      {/* Resource Table for Selected Zone */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
              <th className="py-2 px-3">Resource Asset</th>
              <th className="py-2 px-3 text-right">Predicted Demand</th>
              <th className="py-2 px-3 text-right">Currently Available</th>
              <th className="py-2 px-3 text-right">Net Gap (Deficit)</th>
              <th className="py-2 px-3">Readiness Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {/* Ambulances */}
            <tr className="hover:bg-slate-800/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-slate-200 flex items-center gap-2">
                <span>🚑</span> Advanced Life Support Ambulances
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-white tabular-nums">
                {selectedReq.ambulances.required}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-300 tabular-nums">
                {selectedReq.ambulances.available}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-400 tabular-nums">
                -{selectedReq.ambulances.gap}
              </td>
              <td className="py-2.5 px-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedReq.ambulances.gap > 0 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {selectedReq.ambulances.gap > 0 ? 'CRITICAL DEFICIT' : 'OPTIMAL'}
                </span>
              </td>
            </tr>

            {/* Rescue Teams */}
            <tr className="hover:bg-slate-800/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-slate-200 flex items-center gap-2">
                <span>🚤</span> Flood Rescue Teams (Boats & Divers)
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-white tabular-nums">
                {selectedReq.rescueTeams.required}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-300 tabular-nums">
                {selectedReq.rescueTeams.available}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400 tabular-nums">
                -{selectedReq.rescueTeams.gap}
              </td>
              <td className="py-2.5 px-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedReq.rescueTeams.gap > 0 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {selectedReq.rescueTeams.gap > 0 ? 'SHORTAGE' : 'SUFFICIENT'}
                </span>
              </td>
            </tr>

            {/* Fire Engines */}
            <tr className="hover:bg-slate-800/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-slate-200 flex items-center gap-2">
                <span>🚒</span> Heavy Duty Fire & De-watering Pumping Units
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-white tabular-nums">
                {selectedReq.fireEngines.required}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-300 tabular-nums">
                {selectedReq.fireEngines.available}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400 tabular-nums">
                -{selectedReq.fireEngines.gap}
              </td>
              <td className="py-2.5 px-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedReq.fireEngines.gap > 0 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {selectedReq.fireEngines.gap > 0 ? 'SHORTAGE' : 'COVERED'}
                </span>
              </td>
            </tr>

            {/* Shelter Beds */}
            <tr className="hover:bg-slate-800/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-slate-200 flex items-center gap-2">
                <span>⛺</span> Emergency Shelter Beds
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-white tabular-nums">
                {selectedReq.shelterBeds.required.toLocaleString()}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-300 tabular-nums">
                {selectedReq.shelterBeds.available.toLocaleString()}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-400 tabular-nums">
                -{selectedReq.shelterBeds.gap.toLocaleString()}
              </td>
              <td className="py-2.5 px-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedReq.shelterBeds.gap > 0 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {selectedReq.shelterBeds.gap > 0 ? 'OVERCROWD RISK' : 'ADEQUATE'}
                </span>
              </td>
            </tr>

            {/* Water Kits */}
            <tr className="hover:bg-slate-800/40 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-slate-200 flex items-center gap-2">
                <span>💧</span> Potable Water Rations (Kits)
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-white tabular-nums">
                {selectedReq.waterKits.required.toLocaleString()}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-300 tabular-nums">
                {selectedReq.waterKits.available.toLocaleString()}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-400 tabular-nums">
                -{selectedReq.waterKits.gap.toLocaleString()}
              </td>
              <td className="py-2.5 px-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedReq.waterKits.gap > 0 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {selectedReq.waterKits.gap > 0 ? 'DEFICIT' : 'STOCKED'}
                </span>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};
