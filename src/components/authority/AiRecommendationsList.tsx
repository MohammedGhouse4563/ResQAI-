import React, { useState } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { Sparkles, CheckCircle2, XCircle, ChevronDown, ChevronUp, ShieldCheck, AlertCircle, PhoneCall, Radio } from 'lucide-react';
import { AiRecommendation } from '../../types';

export const AiRecommendationsList: React.FC = () => {
  const { recommendations, approveRecommendation, dismissRecommendation, disasterPhase, setActiveModal } = useDisaster();
  const [expandedId, setExpandedId] = useState<string | null>('rec-01');

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const pendingRecs = recommendations.filter(r => r.status === 'pending_review');
  const pastRecs = recommendations.filter(r => r.status !== 'pending_review');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            AI Operational Recommendations (Explainable AI)
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-300">
          {pendingRecs.length} PENDING DECISION
        </span>
      </div>

      {/* Proactive AI Automated Voice Call Directive (Before & During Disaster) */}
      <div className={`mb-3.5 p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-all ${
        disasterPhase === 'before'
          ? 'bg-amber-950/70 border-amber-600/80 text-amber-200'
          : disasterPhase === 'during'
          ? 'bg-rose-950/70 border-rose-600/80 text-rose-200 shadow-md shadow-rose-950/40'
          : 'bg-emerald-950/70 border-emerald-600/80 text-emerald-200'
      }`}>
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-950/90 border border-current flex items-center justify-center shrink-0 mt-0.5">
            <PhoneCall className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-xs text-white flex items-center gap-1.5">
              <span>{disasterPhase === 'before' ? 'Pre-Disaster Automated Voice Warning' : 'Active Disaster Mass Evac Voice Alert'}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-900 border border-current font-bold uppercase">
                AI ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              {disasterPhase === 'before'
                ? 'Forecast predicts 4.2m inundation in 90 mins. Dispatch automated voice calls to 18,500 residents before flood crests.'
                : 'Rapid flood breach across Sector A & B. Broadcast emergency voice sirens & instructions to trapped residents now.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveModal('voiceBroadcast')}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Radio className="w-3.5 h-3.5 animate-ping" />
          <span>Launch AI Voice Call</span>
        </button>
      </div>

      <div className="space-y-3">
        {pendingRecs.length === 0 && (
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
            All AI recommendations reviewed and authorized. Monitoring live sensors for emerging patterns.
          </div>
        )}

        {pendingRecs.map((rec) => {
          const isExpanded = expandedId === rec.id;
          const isCritical = rec.priority === 'CRITICAL';

          return (
            <div 
              key={rec.id}
              className={`rounded-lg border transition-all ${
                isCritical 
                  ? 'bg-slate-950 border-rose-900/80 shadow-lg shadow-rose-950/20' 
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div 
                onClick={() => toggleExpand(rec.id)}
                className="p-3 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-900/50 rounded-t-lg transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isCritical ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {rec.priority} PRIORITY
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      Target: <span className="text-white">{rec.targetZone}</span>
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Window: {rec.timeWindow}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 leading-snug">
                    {rec.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Details & Explainable AI */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/80 text-xs space-y-3">
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {rec.predictionSummary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] p-2 rounded bg-slate-900/90 border border-slate-800">
                    <div>
                      <span className="text-slate-400">Resource Gap: </span>
                      <span className="font-mono text-rose-300 font-semibold">{rec.resourceGapText}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Exposed Population: </span>
                      <span className="font-mono text-white font-semibold">{rec.exposedPopulation.toLocaleString()} citizens</span>
                    </div>
                  </div>

                  {/* Explainable AI: Why */}
                  <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Explainable Reasoning (Why this recommendation?):</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                      {rec.explainableReasons.map((reason, idx) => (
                        <li key={idx} className="leading-snug">{reason}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Recommendation */}
                  <div className="p-2 rounded bg-amber-950/30 border border-amber-900/50 text-[11px] text-amber-200">
                    <span className="font-bold text-amber-400">Action: </span>
                    {rec.recommendedAction}
                  </div>

                  {/* Human-In-The-Loop Approval Buttons (Section 35 & 52) */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500 italic">
                      *Subject to authorized human operational command approval.
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissRecommendation(rec.id);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Dismiss
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          approveRecommendation(rec.id);
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Authorize & Execute</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Past Executed History */}
        {pastRecs.length > 0 && (
          <div className="pt-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Recently Authorized / Handled ({pastRecs.length})
            </div>
            <div className="space-y-1.5">
              {pastRecs.map(rec => (
                <div key={rec.id} className="p-2 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${rec.status === 'approved' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                    <span className="text-slate-300 font-medium truncate max-w-[280px]">{rec.title}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    rec.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {rec.status === 'approved' ? 'AUTHORIZED' : 'DISMISSED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
