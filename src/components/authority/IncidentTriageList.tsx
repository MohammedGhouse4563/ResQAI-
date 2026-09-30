import React, { useState } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { AlertCircle, User, Phone, MapPin, Radio, Send, CheckCircle2, ShieldCheck, Check } from 'lucide-react';

export const IncidentTriageList: React.FC = () => {
  const { incidents, units, assignUnitToIncident, safeCheckIns, disasterPhase } = useDisaster();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'incidents' | 'safeRollCall'>(
    disasterPhase === 'after' ? 'safeRollCall' : 'incidents'
  );

  const availableUnits = units.filter(u => u.status === 'available' || u.status === 'staging');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 select-none space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {activeTab === 'incidents' ? (
            <Radio className="w-4 h-4 text-rose-400" />
          ) : (
            <span className="text-base">🛡️</span>
          )}
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            {activeTab === 'incidents' 
              ? 'Live SOS Incident Triage & Unit Dispatch' 
              : 'Citizen Safe & Secure Verified Roll-Call'}
          </h3>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'incidents' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🚨 SOS Calls ({incidents.length})
          </button>
          <button
            onClick={() => setActiveTab('safeRollCall')}
            className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'safeRollCall' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <span>🛡️</span>
            <span>Safe & Secure ({safeCheckIns.length})</span>
          </button>
        </div>
      </div>

      {/* SAFE & SECURE ROLL-CALL VIEW (COMMAND SERVICE GETS SPECIFIC SYMBOL FOR SAFE AND SECURE) */}
      {activeTab === 'safeRollCall' && (
        <div className="space-y-2.5">
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <span className="font-semibold">Official Safe &amp; Secure Registry active in Command Service</span>
            </div>
            <span className="font-mono text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-600 text-white font-bold">
              SYMBOL: 🛡️ SAFE &amp; SECURE
            </span>
          </div>

          {safeCheckIns.map((checkIn) => (
            <div
              key={checkIn.id}
              className="p-3 rounded-lg border bg-slate-950 border-emerald-800/60 shadow-md hover:border-emerald-500/80 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-800/80 mb-2">
                <div className="flex items-center gap-2">
                  {/* Specific Symbol for Safe & Secure */}
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500 text-emerald-300 font-black text-[11px] flex items-center gap-1">
                    <span>🛡️</span>
                    <span>SAFE &amp; SECURE</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {checkIn.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>VERIFIED ROLL-CALL</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex flex-wrap items-center gap-3 text-slate-300">
                  <span className="font-bold text-white flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {checkIn.citizenName}
                  </span>
                  {checkIn.userPhone && (
                    <span className="text-slate-400 flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {checkIn.userPhone}
                    </span>
                  )}
                  <span className="text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {checkIn.address}
                  </span>
                </div>

                {checkIn.notes && (
                  <p className="text-emerald-200/90 text-xs italic bg-emerald-950/30 p-2 rounded border border-emerald-900/40">
                    "{checkIn.notes}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                  <span>GPS: {checkIn.location[0].toFixed(4)}° N, {checkIn.location[1].toFixed(4)}° E</span>
                  <span className="text-emerald-400 font-medium">Logged in Authority GIS Map</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIVE SOS CALLS VIEW */}
      {activeTab === 'incidents' && (
        <div className="space-y-2.5">
          {incidents.map((incident) => {
            const isCritical = incident.severity === 'CRITICAL';
            const isDispatched = incident.status === 'dispatched';
            const isSelecting = selectedIncidentId === incident.id;

            return (
              <div 
                key={incident.id}
                className={`p-3 rounded-lg border transition-all ${
                  isCritical 
                    ? 'bg-slate-950 border-rose-900/80' 
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isCritical ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {incident.severity}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-200 uppercase">
                      {incident.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {incident.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      isDispatched 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                        : 'bg-amber-950 text-amber-300'
                    }`}>
                      {incident.status === 'dispatched' ? `DISPATCHED (${incident.assignedUnitCallSign || 'Unit'})` : incident.status}
                    </span>
                  </div>
                </div>

                {/* Citizen Details */}
                <div className="space-y-1 text-xs mb-2">
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="font-semibold text-white flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {incident.userName} ({incident.peopleCount} pax)
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {incident.userPhone}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {incident.address}
                    </span>
                  </div>

                  <p className="text-slate-200 text-xs italic bg-slate-900/90 p-2 rounded border border-slate-800/60">
                    "{incident.message}"
                  </p>
                </div>

                {/* AI Recommendation & Dispatch Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                  <div className="text-[11px] text-slate-400">
                    Recommended: <span className="text-cyan-300 font-medium">{incident.recommendedResponse}</span>
                  </div>

                  {!isDispatched ? (
                    <div>
                      {isSelecting ? (
                        <div className="flex items-center gap-1.5">
                          <select
                            className="bg-slate-900 text-xs text-white border border-slate-700 rounded px-2 py-1 font-mono"
                            onChange={(e) => {
                              if (e.target.value) {
                                assignUnitToIncident(incident.id, e.target.value);
                                setSelectedIncidentId(null);
                              }
                            }}
                            defaultValue=""
                          >
                            <option value="" disabled>Select Unit to Dispatch...</option>
                            {availableUnits.map(u => (
                              <option key={u.id} value={u.id}>
                                {u.callSign} ({u.status})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setSelectedIncidentId(null)}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-1 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedIncidentId(incident.id)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Assign Response Unit</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ETA ~{incident.etaMinutes || 6} mins (Real-time telemetry tracked)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
