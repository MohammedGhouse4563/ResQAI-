import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { Clock, Play, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';

const TIMELINE_STAGES = [
  {
    step: 0,
    label: 'NOW',
    timeDelta: '00:00',
    summary: 'Flash flood cresting at Zone A delta (2.1m depth). 4,800 exposed.',
    confidence: '95% (High Telemetry)'
  },
  {
    step: 1,
    label: '+30 MIN',
    timeDelta: '+00:30',
    summary: 'Backwater surging into Zone B market entrance. Inundation depth 1.6m.',
    confidence: '88% (Hydrological model)'
  },
  {
    step: 2,
    label: '+1 HOUR',
    timeDelta: '+01:00',
    summary: 'Apex River Bridge overtopped & impassable. Zone B peak flood risk (94%).',
    confidence: '82% (Hydrological model)'
  },
  {
    step: 3,
    label: '+2 HOURS',
    timeDelta: '+02:00',
    summary: 'Shelter occupancy hits saturation. Evacuation pressure shifts to West Polytech.',
    confidence: '76% (Evacuation flow)'
  },
  {
    step: 4,
    label: '+4 HOURS',
    timeDelta: '+04:00',
    summary: 'Flood crest passes into Zone C valley. Hospital emergency intake peaks.',
    confidence: '68% (Medium confidence)'
  }
];

export const TimelineScrubber: React.FC = () => {
  const { timelineStep, setTimelineStep } = useDisaster();
  const currentStage = TIMELINE_STAGES[timelineStep];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Predictive Timeline Scrubber
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Forecast Window: 14:00 – 19:30 · Peak: 15:30 – 17:00
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Prediction Model Confidence:</span>
          <span className="font-mono text-cyan-300 font-semibold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
            {currentStage.confidence}
          </span>
        </div>
      </div>

      {/* Step Buttons and Slider Bar */}
      <div className="relative pt-2 pb-3">
        {/* Track Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-800 -z-0 rounded" />
        <div 
          className="absolute top-6 left-0 h-1 bg-rose-500 transition-all duration-300 -z-0 rounded"
          style={{ width: `${(timelineStep / (TIMELINE_STAGES.length - 1)) * 100}%` }}
        />

        {/* Stage Nodes */}
        <div className="relative z-10 flex justify-between">
          {TIMELINE_STAGES.map((stage) => {
            const isActive = timelineStep === stage.step;
            const isPassed = timelineStep >= stage.step;

            return (
              <button
                key={stage.step}
                onClick={() => setTimelineStep(stage.step)}
                className="flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-all ${
                    isActive 
                      ? 'bg-rose-600 text-white ring-4 ring-rose-950 scale-110' 
                      : isPassed 
                        ? 'bg-slate-700 text-rose-300' 
                        : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {stage.step === 0 ? '0' : `+${stage.step}`}
                </div>
                <span className={`mt-2 text-xs font-semibold tracking-wider font-mono ${isActive ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                  {stage.label}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {stage.timeDelta}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Stage Operational Brief */}
      <div className="mt-3 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-slate-200">PROJECTED SCENARIO ({currentStage.label}): </span>
          <span className="text-slate-300">{currentStage.summary}</span>
        </div>
      </div>
    </div>
  );
};
