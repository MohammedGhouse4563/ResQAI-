import React, { useRef } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { Activity, ArrowRight, ChevronLeft, ChevronRight, AlertTriangle, ShieldCheck, Zap, Droplets, CheckCircle2 } from 'lucide-react';

interface CascadeNode {
  id: string;
  step: number;
  trigger: string;
  consequence: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  metrics: string;
  actionRequired: string;
}

const PRE_DISASTER_CASCADE: CascadeNode[] = [
  {
    id: 'pre-1',
    step: 1,
    trigger: 'Doppler Radar Cloudburst Alert (38mm/hr)',
    consequence: 'Upstream Basin Runoff Saturation',
    severity: 'HIGH',
    metrics: 'Catchment inflow at 28,000 cusecs',
    actionRequired: 'Initiate automated flood siren test and alert cell broadcast'
  },
  {
    id: 'pre-2',
    step: 2,
    trigger: 'Reservoir Inflow Surpassing 90% Pool',
    consequence: 'Controlled Spillway Discharge Mandatory',
    severity: 'CRITICAL',
    metrics: '4 gates lifted 1.5m · +14,000 cusecs to river',
    actionRequired: 'Broadcast immediate riverbank evacuation directives'
  },
  {
    id: 'pre-3',
    step: 3,
    trigger: 'Stormwater Surcharge in Market Sector',
    consequence: 'Early Gutter Backflow into Basements',
    severity: 'MEDIUM',
    metrics: 'Zone B drainage at 94% capacity',
    actionRequired: 'Pre-stage dewatering pump trailers at commercial subway hubs'
  },
  {
    id: 'pre-4',
    step: 4,
    trigger: 'Approaching High Tide Barrier (15:45)',
    consequence: 'River Drain Outflow Blockage at Sea Mouth',
    severity: 'CRITICAL',
    metrics: 'Tidal surge adds +0.6m back-crest',
    actionRequired: 'Seal floodgates and establish emergency detour checkpoints'
  },
  {
    id: 'pre-5',
    step: 5,
    trigger: 'Anticipated Apex Bridge Cut-off',
    consequence: 'Emergency Response Route Severance in 2.5h',
    severity: 'CRITICAL',
    metrics: 'East-West transit split impending',
    actionRequired: 'Pre-position 3 ALS ambulances and 2 fire rescue boats in Zone B'
  },
  {
    id: 'pre-6',
    step: 6,
    trigger: 'Vulnerable Population Pre-Evacuation',
    consequence: 'Shelter Intake Staging Demands',
    severity: 'HIGH',
    metrics: '1,400 senior citizens & infant households',
    actionRequired: 'Open North High School & Civic Auditorium reception desks'
  },
  {
    id: 'pre-7',
    step: 7,
    trigger: 'Pre-Storm Safe Roll-Call Activation',
    consequence: 'Citizen Safety Verification Registration',
    severity: 'MEDIUM',
    metrics: '4,892 citizens already checked in',
    actionRequired: 'Encourage citizens to submit 🛡️ Safe & Secure status early'
  }
];

const ACTIVE_DISASTER_CASCADE: CascadeNode[] = [
  {
    id: 'c1',
    step: 1,
    trigger: 'Heavy Inflow (28mm/hr)',
    consequence: 'River Delta Flash Flooding (2.1m crest)',
    severity: 'CRITICAL',
    metrics: 'Zone A risk 91% · 4,800 people',
    actionRequired: 'Issue immediate automated citizen evacuation warning'
  },
  {
    id: 'c2',
    step: 2,
    trigger: 'Water Inundation Level > 1.2m',
    consequence: 'Riverbank Blvd & Apex Bridge Blockage',
    severity: 'CRITICAL',
    metrics: '2 major transit corridors cut off',
    actionRequired: 'Reroute all responders to North Elevated Expressway'
  },
  {
    id: 'c3',
    step: 3,
    trigger: 'Bridge & Arterial Closure',
    consequence: 'Ambulance Response Delay (+18 to +24 mins)',
    severity: 'CRITICAL',
    metrics: 'Normal 8 min ETA -> 26 min ETA',
    actionRequired: 'Pre-position 3 ALS units inside Zone B before bridge closure'
  },
  {
    id: 'c4',
    step: 4,
    trigger: 'Ground Floor Flooding',
    consequence: 'Mass Population Displacement (1,800 families)',
    severity: 'HIGH',
    metrics: '70% moving north, 30% moving west',
    actionRequired: 'Mobilize safe evacuation buses & police escorts'
  },
  {
    id: 'c5',
    step: 5,
    trigger: 'Displaced Population Influx',
    consequence: 'Shelter Saturation & Overcrowding',
    severity: 'HIGH',
    metrics: 'North High at 58% -> 95% within 1 hr',
    actionRequired: 'Open West Polytech auxiliary pavilion early'
  },
  {
    id: 'c6',
    step: 6,
    trigger: 'Trauma & Hypothermia Cases',
    consequence: 'Hospital Emergency Room Surge (+85 cases)',
    severity: 'CRITICAL',
    metrics: 'Apex Memorial ICU beds: 46 / 50 filled',
    actionRequired: 'Activate Code Triage & divert non-criticals to St. Jude'
  },
  {
    id: 'c7',
    step: 7,
    trigger: 'Surge Sustained > 3 Hours',
    consequence: 'Medical Supply & Potable Water Deficit',
    severity: 'HIGH',
    metrics: 'Water kit deficit: -1,800 kits',
    actionRequired: 'Release regional reserve inventory from central warehouse'
  }
];

const POST_DISASTER_CASCADE: CascadeNode[] = [
  {
    id: 'post-1',
    step: 1,
    trigger: 'Floodwaters Subsiding Below 0.8m',
    consequence: 'Heavy Silt, Sludge & Debris Accumulation',
    severity: 'MEDIUM',
    metrics: '14 metric tons debris per kilometer',
    actionRequired: 'Deploy municipal earthmovers & skid-steer sweepers'
  },
  {
    id: 'post-2',
    step: 2,
    trigger: 'Municipal Pipeline Pressure Drop',
    consequence: 'Drinking Water Negative Backflow Contamination',
    severity: 'CRITICAL',
    metrics: '14,000 households without potable tap water',
    actionRequired: 'Dispatch 8 mobile chlorination water tanker trucks'
  },
  {
    id: 'post-3',
    step: 3,
    trigger: 'Water Receded from Apex Bridge Deck',
    consequence: 'Pier Scour & Bearing Stress Deflection Risk',
    severity: 'CRITICAL',
    metrics: 'Structural load test required before reopening',
    actionRequired: 'Conduct acoustic ultrasound structural inspection'
  },
  {
    id: 'post-4',
    step: 4,
    trigger: 'Displaced Citizen Repatriation Roll-Call',
    consequence: 'Reconciliation of Safe & Secure Status',
    severity: 'HIGH',
    metrics: '4,892 verified Safe · 310 families in transit',
    actionRequired: 'Verify safe registry records with official 🛡️ Safe & Secure symbol'
  },
  {
    id: 'post-5',
    step: 5,
    trigger: 'Stagnant Water Pool Residue',
    consequence: 'Vector-Borne Disease & Mosquito Proliferation',
    severity: 'HIGH',
    metrics: 'Epidemic risk window starts at +48 hours',
    actionRequired: 'Deploy thermal fogging and larvicide misting teams'
  },
  {
    id: 'post-6',
    step: 6,
    trigger: 'Ground-Floor Structure Desiccation',
    consequence: 'Electrical Grid Tripping on Wet Insulation',
    severity: 'MEDIUM',
    metrics: 'Substation 4 moisture isolation test pending',
    actionRequired: 'Certified electrician clearance before re-energizing circuits'
  },
  {
    id: 'post-7',
    step: 7,
    trigger: 'Transition to Community Reconstruction',
    consequence: 'Emergency Aid & Insurance Claim Processing',
    severity: 'MEDIUM',
    metrics: '2,400 rehabilitation dossiers logged',
    actionRequired: 'Distribute direct cash transfer vouchers & building kits'
  }
];

export const CascadePredictor: React.FC = () => {
  const { disasterPhase } = useDisaster();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const chain = disasterPhase === 'before' 
    ? PRE_DISASTER_CASCADE 
    : disasterPhase === 'after' 
    ? POST_DISASTER_CASCADE 
    : ACTIVE_DISASTER_CASCADE;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 select-none w-full space-y-3">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${
            disasterPhase === 'before' ? 'text-amber-400' : disasterPhase === 'after' ? 'text-emerald-400' : 'text-rose-400'
          }`} />
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Horizontal Disaster Cascade Pipeline</span>
              <span className={`text-[10px] font-mono px-2 py-0.2 rounded border font-semibold ${
                disasterPhase === 'before'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : disasterPhase === 'after'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border-rose-800'
              }`}>
                {disasterPhase === 'before' ? 'PRE-DISASTER CHAIN' : disasterPhase === 'after' ? 'POST-DISASTER RECOVERY CHAIN' : 'ACTIVE DISASTER CHAIN'}
              </span>
            </h3>
            <span className="text-[11px] text-slate-400">
              {disasterPhase === 'before' 
                ? 'Sequential Inflow & Reservoir Saturation Model (Meteorology → Drainage Surcharge → Pre-Staging)'
                : disasterPhase === 'after'
                ? 'Sequential Recovery & Rehabilitation Model (Flood Subsidence → Potable Water → Roll-Call Reconciliation)'
                : 'Sequential Direct & Secondary Failure Chain (Trigger → Physical Impact → Response Mitigation)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${
            disasterPhase === 'before'
              ? 'bg-amber-950 border-amber-800 text-amber-300'
              : disasterPhase === 'after'
              ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
              : 'bg-rose-950 border-rose-800 text-rose-300'
          }`}>
            {disasterPhase === 'before' ? 'Forecast Lead Time: 3.5h' : disasterPhase === 'after' ? 'Recovery Horizon: 24h' : 'Impact Velocity: High'}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Sequential Flow Track */}
      <div 
        ref={scrollRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {chain.map((node, index) => {
          const isCritical = node.severity === 'CRITICAL';
          const isHigh = node.severity === 'HIGH';

          return (
            <React.Fragment key={node.id}>
              {/* Individual Stage Card (Strict Horizontal Node) */}
              <div 
                className={`flex-shrink-0 w-[270px] sm:w-[290px] rounded-xl border p-3 flex flex-col justify-between transition-all hover:border-slate-500/80 ${
                  isCritical 
                    ? 'bg-slate-950/90 border-rose-900/80 shadow-lg shadow-rose-950/20' 
                    : isHigh
                    ? 'bg-slate-950/90 border-amber-900/80 shadow-md shadow-amber-950/10'
                    : 'bg-slate-950/90 border-slate-800'
                }`}
              >
                <div>
                  {/* Step and Severity */}
                  <div className="flex items-center justify-between gap-1 mb-2 pb-1.5 border-b border-slate-800/80">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white flex items-center justify-center shrink-0">
                      {node.step}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                      isCritical 
                        ? 'bg-rose-950 text-rose-300 border-rose-800' 
                        : isHigh 
                        ? 'bg-amber-950 text-amber-300 border-amber-800' 
                        : 'bg-sky-950 text-sky-300 border-sky-800'
                    }`}>
                      {node.severity}
                    </span>
                  </div>

                  {/* Trigger */}
                  <div className="text-[11px] text-slate-400 font-mono mb-1">
                    CAUSE / TRIGGER:
                  </div>
                  <div className="text-xs font-bold text-white mb-2 leading-tight">
                    {node.trigger}
                  </div>

                  {/* Consequence */}
                  <div className="text-[11px] text-slate-400 font-mono mb-1">
                    CASCADING CONSEQUENCE:
                  </div>
                  <div className={`text-xs font-semibold mb-2 leading-tight ${isCritical ? 'text-rose-300' : isHigh ? 'text-amber-300' : 'text-sky-300'}`}>
                    {node.consequence}
                  </div>

                  {/* Impact Metric */}
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2 py-1 rounded border border-slate-800/70 mb-2">
                    {node.metrics}
                  </div>
                </div>

                {/* Mitigation Action */}
                <div className="pt-2 border-t border-slate-800/80 mt-1">
                  <div className="text-[10px] font-mono text-emerald-400 font-semibold mb-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>PREVENTIVE MITIGATION:</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium leading-tight">
                    {node.actionRequired}
                  </div>
                </div>
              </div>

              {/* Arrow connector between nodes */}
              {index < chain.length - 1 && (
                <div className="flex items-center justify-center text-slate-600 shrink-0 px-1">
                  <ArrowRight className="w-4 h-4 text-slate-600 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
