import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { UserRole } from '../../types';
import { ShieldCheck, Smartphone, MonitorCheck, SlidersHorizontal, Globe, Sparkles } from 'lucide-react';
import { ResQLogo } from './ResQLogo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { role, setRole, language, setLanguage } = useDisaster();

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-slate-800 bg-slate-950 select-none sticky top-0 z-40">
      
      {/* Zone 1: Single text element wordmark with official emblem */}
      <div className="flex items-center gap-3">
        <a href="/" className="text-lg font-black tracking-tight text-white flex items-center gap-2.5 group">
          <ResQLogo size={32} className="transition-transform group-hover:scale-105" />
          <span className="font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            ResQAI
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
          <span aria-hidden="true">·</span>
          <span>Predict the Need. Position the Response.</span>
        </div>
      </div>

      {/* Zone 2: Navigation Links for Authority Command View */}
      {role !== 'citizen' && (
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-400">
          <button
            onClick={() => setActiveTab('situation')}
            className={`transition-colors hover:text-white whitespace-nowrap cursor-pointer ${
              activeTab === 'situation' ? 'text-white border-b-2 border-rose-500 pb-0.5' : ''
            }`}
          >
            Situation Room
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`transition-colors hover:text-white whitespace-nowrap cursor-pointer ${
              activeTab === 'resources' ? 'text-white border-b-2 border-rose-500 pb-0.5' : ''
            }`}
          >
            Resource War Room
          </button>

          <button
            onClick={() => setActiveTab('triage')}
            className={`transition-colors hover:text-white whitespace-nowrap cursor-pointer ${
              activeTab === 'triage' ? 'text-white border-b-2 border-rose-500 pb-0.5' : ''
            }`}
          >
            Incident Triage
          </button>

          <button
            onClick={() => setActiveTab('cascade')}
            className={`transition-colors hover:text-white whitespace-nowrap cursor-pointer ${
              activeTab === 'cascade' ? 'text-white border-b-2 border-rose-500 pb-0.5' : ''
            }`}
          >
            Cascade Predictor
          </button>

          <button
            onClick={() => setActiveTab('medical')}
            className={`transition-colors hover:text-white whitespace-nowrap cursor-pointer ${
              activeTab === 'medical' ? 'text-white border-b-2 border-rose-500 pb-0.5' : ''
            }`}
          >
            Medical & EMS
          </button>

          <button
            onClick={() => setActiveTab('rescue')}
            className={`transition-colors hover:text-white whitespace-nowrap cursor-pointer ${
              activeTab === 'rescue' ? 'text-white border-b-2 border-rose-500 pb-0.5' : ''
            }`}
          >
            Fire & Rescue
          </button>

          <button
            onClick={() => setActiveTab('hospitals')}
            className={`transition-colors hover:text-white whitespace-nowrap cursor-pointer ${
              activeTab === 'hospitals' ? 'text-white border-b-2 border-rose-500 pb-0.5' : ''
            }`}
          >
            Hospitals
          </button>

          <button
            onClick={() => setActiveTab('relief')}
            className={`transition-colors hover:text-white whitespace-nowrap cursor-pointer ${
              activeTab === 'relief' ? 'text-white border-b-2 border-rose-500 pb-0.5' : ''
            }`}
          >
            Shelters & Relief
          </button>
        </nav>
      )}

      {/* Zone 3: 1-2 primary actions - Switch between Citizen App and Authority Command Center */}
      <div className="flex items-center gap-2.5">
        
        {/* Live AI Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-[11px]">AI LIVE</span>
        </div>

        {/* System Switcher (Citizen vs Authority Command) */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800">
          <button
            onClick={() => setRole('citizen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              role === 'citizen' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Citizen Mobile</span>
          </button>

          <button
            onClick={() => setRole('authority')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              role !== 'citizen' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MonitorCheck className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Command Center</span>
          </button>
        </div>

      </div>

    </header>
  );
};
