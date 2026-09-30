import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { FileText, Sparkles, X, ShieldCheck, Clock } from 'lucide-react';

export const AuditLogModal: React.FC = () => {
  const { auditLogs, setActiveModal } = useDisaster();

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Operational Command Audit Trail & Accountability Log
              </h3>
              <p className="text-xs text-slate-400">
                Immutable chronological log of human authorizations, AI recommendations, and field dispatches.
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

        {/* Audit Log Table */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2.5">
            {auditLogs.map((log) => (
              <div 
                key={log.id}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {log.timestamp}
                    </span>
                    <span className="font-mono text-cyan-300 font-bold px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/80 text-[10px]">
                      {log.action}
                    </span>
                    {log.isAiAssisted && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-900/60">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        AI-ASSISTED
                      </span>
                    )}
                  </div>

                  <p className="text-slate-200 text-xs font-medium">
                    {log.details}
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-3 shrink-0">
                  <div className="font-semibold text-slate-300 text-[11px]">{log.actor}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{log.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically sealed for statutory post-disaster inquiry review.</span>
          </span>
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
