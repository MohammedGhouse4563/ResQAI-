import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { 
  AlertCircle, 
  Activity, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  SlidersHorizontal, 
  FileText, 
  ShieldCheck, 
  Radio, 
  LifeBuoy, 
  Truck, 
  CheckCircle2, 
  Zap, 
  Droplets,
  HeartPulse,
  PhoneCall
} from 'lucide-react';
import { DisasterPhase } from '../../types';
import { ResQLogo } from '../common/ResQLogo';

export const TopSituationBar: React.FC = () => {
  const { 
    zones, 
    resourceRequirements, 
    incidents, 
    disasterPhase, 
    setDisasterPhase,
    setActiveModal,
    whatIf,
    safeCount,
    safeCheckIns
  } = useDisaster();

  // Aggregate stats across zones
  const totalExposedPop = zones.reduce((sum, z) => sum + z.exposedPopulation, 0);
  const activeCriticalZones = zones.filter(z => z.severity === 'CRITICAL').length;
  
  const totalAmbAvailable = Object.values(resourceRequirements).reduce((sum, r) => sum + r.ambulances.available, 0);
  const totalAmbGap = Object.values(resourceRequirements).reduce((sum, r) => sum + r.ambulances.gap, 0);
  
  const totalShelterGap = Object.values(resourceRequirements).reduce((sum, r) => sum + r.shelterBeds.gap, 0);
  const totalRescueGap = Object.values(resourceRequirements).reduce((sum, r) => sum + r.rescueTeams.gap, 0);

  const isSimulated = whatIf.rainfallIncreasePercent > 0 || whatIf.mainBridgeBlocked || whatIf.shelterWestCompromised;

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 select-none space-y-2.5">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        
        {/* Left: Overall Threat Status & Phase Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Phase Status Badge */}
          {disasterPhase === 'before' && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-950/70 border border-amber-700/80 text-amber-300">
              <ResQLogo size={22} className="shrink-0" />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-bold tracking-wide font-mono">STATUS: EARLY WARNING & PREPAREDNESS</span>
            </div>
          )}

          {disasterPhase === 'during' && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-rose-950/70 border border-rose-800/80 text-rose-300">
              <ResQLogo size={22} className="shrink-0" />
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-xs font-bold tracking-wide font-mono">STATUS: ACTIVE DISASTER RESPONSE - HIGH ALERT</span>
            </div>
          )}

          {disasterPhase === 'after' && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-700/80 text-emerald-300">
              <ResQLogo size={22} className="shrink-0" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold tracking-wide font-mono">STATUS: POST-DISASTER RELIEF & RECOVERY</span>
            </div>
          )}

          {/* Responsive Phase Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
            {(['before', 'during', 'after'] as DisasterPhase[]).map((phase) => {
              const isActive = disasterPhase === phase;
              let activeColor = 'bg-rose-600 text-white shadow-sm';
              if (phase === 'before') activeColor = 'bg-amber-600 text-white shadow-sm';
              if (phase === 'after') activeColor = 'bg-emerald-600 text-white shadow-sm';

              return (
                <button
                  key={phase}
                  onClick={() => setDisasterPhase(phase)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                    isActive ? activeColor : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {phase === 'before' ? 'Pre-Disaster' : phase === 'during' ? 'Active Disaster' : 'Post-Disaster'}
                </button>
              );
            })}
          </div>

          {/* Specific Symbol for SAFE AND SECURE Indicator in Command Service */}
          <div 
            title="Command Service: Verified Citizen Safe & Secure Status"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-600/90 text-emerald-300 text-xs font-mono shadow-[0_0_12px_rgba(16,185,129,0.25)]"
          >
            <span className="text-sm">🛡️</span>
            <span className="font-black tracking-wider text-emerald-300">SAFE & SECURE:</span>
            <span className="font-bold text-white tabular-nums">{safeCount.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 font-sans font-medium">({safeCheckIns.length} new)</span>
          </div>

          {isSimulated && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/70 border border-amber-700 text-amber-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>WHAT-IF ACTIVE</span>
            </div>
          )}
        </div>

        {/* Center: Phase-Responsive Essential KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          
          {/* PRE-DISASTER PHASE KPIS */}
          {disasterPhase === 'before' && (
            <>
              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-amber-900/50 flex flex-col justify-center">
                <div className="text-[10px] text-amber-300/80">Forecasted At-Risk Pop</div>
                <div className="text-sm font-bold font-mono text-white tabular-nums">
                  {totalExposedPop.toLocaleString()}
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Early Warning Level</div>
                <div className="text-sm font-bold font-mono text-amber-400 tabular-nums">
                  Level 2 (Inflow Crest)
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Staging Hubs Ready</div>
                <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                  4 of 4 Operational
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Pumps & Boats Staged</div>
                <div className="text-sm font-bold font-mono text-cyan-300 tabular-nums">
                  18 Units on Standby
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Surge Beds Reserved</div>
                <div className="text-sm font-bold font-mono text-amber-300 tabular-nums">
                  2,700 Prepped
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-emerald-900/60 flex flex-col justify-center">
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span>🛡️ Safe Registered</span>
                </div>
                <div className="text-sm font-bold font-mono text-emerald-300 tabular-nums">
                  {safeCount.toLocaleString()}
                </div>
              </div>
            </>
          )}

          {/* ACTIVE DISASTER PHASE KPIS */}
          {disasterPhase === 'during' && (
            <>
              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Exposed Population</div>
                <div className="text-sm font-bold font-mono text-white tabular-nums">
                  {totalExposedPop.toLocaleString()}
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Active SOS Alerts</div>
                <div className="text-sm font-bold font-mono text-rose-400 tabular-nums">
                  {incidents.filter(i => i.status !== 'resolved').length}
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Critical Zones</div>
                <div className="text-sm font-bold font-mono text-amber-400 tabular-nums">
                  {activeCriticalZones} of {zones.length}
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Ambulance Gap</div>
                <div className="text-sm font-bold font-mono text-rose-300 tabular-nums">
                  {totalAmbAvailable} avail <span className="text-rose-500 font-normal">/ -{totalAmbGap} gap</span>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Rescue Team Gap</div>
                <div className="text-sm font-bold font-mono text-amber-300 tabular-nums">
                  -{totalRescueGap} teams
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Shelter Bed Gap</div>
                <div className="text-sm font-bold font-mono text-rose-400 tabular-nums">
                  -{totalShelterGap.toLocaleString()} beds
                </div>
              </div>
            </>
          )}

          {/* POST-DISASTER PHASE KPIS */}
          {disasterPhase === 'after' && (
            <>
              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-emerald-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span>🛡️ SAFE & SECURE</span>
                </div>
                <div className="text-sm font-bold font-mono text-emerald-300 tabular-nums">
                  {safeCount.toLocaleString()} (94.2%)
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Shelter Intake</div>
                <div className="text-sm font-bold font-mono text-amber-300 tabular-nums">
                  1,660 Displaced
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Ration & Water Delivered</div>
                <div className="text-sm font-bold font-mono text-cyan-300 tabular-nums">
                  8,420 Kits Issued
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Arterial Roads Cleared</div>
                <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                  3 of 4 Corridors (75%)
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Power Substations</div>
                <div className="text-sm font-bold font-mono text-cyan-300 tabular-nums">
                  3 of 4 Energized
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">Mobile Health Clinics</div>
                <div className="text-sm font-bold font-mono text-purple-300 tabular-nums">
                  6 Active Units
                </div>
              </div>
            </>
          )}

        </div>

        {/* Right: Quick Action Modals */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AI Auto Voice Call & Notify Option (Before & When Disaster Occurs) */}
          <button
            onClick={() => setActiveModal('voiceBroadcast')}
            title="Launch AI Automated Emergency Voice Calls and Sirens to residents in risk sectors"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer shadow-md ${
              disasterPhase === 'before'
                ? 'bg-amber-950/80 hover:bg-amber-900 border-amber-600 text-amber-200'
                : disasterPhase === 'during'
                ? 'bg-rose-950/80 hover:bg-rose-900 border-rose-500 text-rose-200 animate-pulse shadow-rose-950/50'
                : 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-600 text-emerald-200'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            <span>AI Voice Call &amp; Alert</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          </button>

          <button
            onClick={() => setActiveModal('whatIf')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>What-If Simulator</span>
          </button>

          <button
            onClick={() => setActiveModal('auditLog')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Audit Trail</span>
          </button>
        </div>

      </div>

      {/* Dynamic Operational Directive Ribbon based on Phase */}
      <div className={`px-3 py-1.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
        disasterPhase === 'before'
          ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
          : disasterPhase === 'during'
          ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
          : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
      }`}>
        <div className="flex items-center gap-2">
          {disasterPhase === 'before' && <span className="font-bold text-amber-400">🟡 PRE-DISASTER DIRECTIVE:</span>}
          {disasterPhase === 'during' && <span className="font-bold text-rose-400">🔴 ACTIVE DISASTER DIRECTIVE:</span>}
          {disasterPhase === 'after' && <span className="font-bold text-emerald-400">🟢 POST-DISASTER DIRECTIVE:</span>}
          
          <span className="text-[11px] text-slate-300">
            {disasterPhase === 'before' && 'Early warning broadcast active. Sandbag & pump staging underway. Vulnerable elderly citizens flagged for early evacuation before flood crest.'}
            {disasterPhase === 'during' && 'Immediate life-safety triage. Directing NDRF boat extractions in Zone A & B. Routing emergency ambulances around flooded Apex Bridge.'}
            {disasterPhase === 'after' && 'Safe & Secure roll-call reconciliation. Mobile water chlorination deployed. Debris clearance on Riverbank Blvd & bridge load certification.'}
          </span>
        </div>

        <div className="text-[11px] font-mono shrink-0 flex items-center gap-2">
          <span className="text-slate-400">Phase Engine:</span>
          <span className="font-bold uppercase tracking-wider text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {disasterPhase === 'before' ? 'Early Alert' : disasterPhase === 'during' ? 'Tactical Ops' : 'Recovery & Relief'}
          </span>
        </div>
      </div>
    </div>
  );
};

