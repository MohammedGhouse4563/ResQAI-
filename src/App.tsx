import React, { useState } from 'react';
import { DisasterProvider, useDisaster } from './context/DisasterContext';
import { Header } from './components/common/Header';
import { TopSituationBar } from './components/authority/TopSituationBar';
import { DisasterCommandMap } from './components/gis/DisasterCommandMap';
import { TimelineScrubber } from './components/authority/TimelineScrubber';
import { CascadePredictor } from './components/authority/CascadePredictor';
import { ResourceWarRoom } from './components/authority/ResourceWarRoom';
import { AiRecommendationsList } from './components/authority/AiRecommendationsList';
import { IncidentTriageList } from './components/authority/IncidentTriageList';
import { AmbulanceMedicalView } from './components/authority/RoleViews/AmbulanceMedicalView';
import { FireRescueView } from './components/authority/RoleViews/FireRescueView';
import { HospitalView } from './components/authority/RoleViews/HospitalView';
import { ReliefView } from './components/authority/RoleViews/ReliefView';
import { WhatIfSimulator } from './components/authority/WhatIfSimulator';
import { AuditLogModal } from './components/authority/AuditLogModal';
import { CitizenHomeView } from './components/citizen/CitizenHomeView';
import { SosModal } from './components/citizen/SosModal';
import { VoiceAssistantModal } from './components/citizen/VoiceAssistantModal';
import { SafeRouteModal } from './components/citizen/SafeRouteModal';
import { ShelterListModal } from './components/citizen/ShelterListModal';
import { HazardReportModal } from './components/citizen/HazardReportModal';
import { AiAutoVoiceCallModal } from './components/authority/AiAutoVoiceCallModal';
import { IncomingVoiceCallModal } from './components/citizen/IncomingVoiceCallModal';

const AppContent: React.FC = () => {
  const { role, activeModal, activeIncomingCall } = useDisaster();
  const [activeTab, setActiveTab] = useState<string>('situation');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Body */}
      {role === 'citizen' ? (
        /* CITIZEN MOBILE INTERFACE (Section 4) */
        <main className="flex-1 flex items-center justify-center p-0 sm:p-4 bg-slate-950">
          <div className="w-full max-w-md bg-slate-950 sm:border sm:border-slate-800 sm:rounded-3xl sm:shadow-2xl overflow-hidden min-h-[90vh]">
            <CitizenHomeView />
          </div>
        </main>
      ) : (
        /* AUTHORITY EMERGENCY COMMAND SYSTEM (Section 19 & 40) */
        <main className="flex-1 flex flex-col bg-slate-950">
          
          {/* Situation Room KPI Bar */}
          <TopSituationBar />

          {/* Subview Content based on active navigation tab */}
          <div className="p-4 flex-1 space-y-4">
            
            {activeTab === 'situation' && (
              <div className="space-y-4">
                {/* Upper Grid: GIS Command Map & Right Column with AI Recommendations & Triage */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[580px]">
                  
                  {/* Left GIS Map & Scrubber Column (8 Cols) */}
                  <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="flex-1 rounded-xl overflow-hidden border border-slate-800 min-h-[440px] shadow-xl">
                      <DisasterCommandMap />
                    </div>

                    {/* Timeline Scrubber */}
                    <TimelineScrubber />
                  </div>

                  {/* Right Column: AI Recommendations & Live Incident Triage (4 Cols) */}
                  <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto max-h-[820px]">
                    <AiRecommendationsList />
                    <IncidentTriageList />
                  </div>

                </div>

                {/* Horizontal Disaster Cascade Intelligence Pipeline */}
                <CascadePredictor />

                {/* Predictive Resource War Room */}
                <ResourceWarRoom />
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-4">
                <CascadePredictor />
                <ResourceWarRoom />
                <AiRecommendationsList />
              </div>
            )}

            {activeTab === 'triage' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <IncidentTriageList />
                <AiRecommendationsList />
              </div>
            )}

            {activeTab === 'cascade' && (
              <div className="space-y-4">
                <CascadePredictor />
                <TimelineScrubber />
              </div>
            )}

            {activeTab === 'medical' && (
              <AmbulanceMedicalView />
            )}

            {activeTab === 'rescue' && (
              <FireRescueView />
            )}

            {activeTab === 'hospitals' && (
              <HospitalView />
            )}

            {activeTab === 'relief' && (
              <ReliefView />
            )}

          </div>
        </main>
      )}

      {/* Global Modals */}
      {activeModal === 'whatIf' && <WhatIfSimulator />}
      {activeModal === 'auditLog' && <AuditLogModal />}
      {activeModal === 'sos' && <SosModal />}
      {activeModal === 'voice' && <VoiceAssistantModal />}
      {activeModal === 'safeRoute' && <SafeRouteModal />}
      {activeModal === 'shelters' && <ShelterListModal />}
      {activeModal === 'hazard' && <HazardReportModal />}
      {activeModal === 'voiceBroadcast' && <AiAutoVoiceCallModal />}

      {/* Incoming AI Emergency Voice Call Overlay (Citizen & Authority Demo) */}
      {activeIncomingCall && <IncomingVoiceCallModal />}
    </div>
  );
};

export default function App() {
  return (
    <DisasterProvider>
      <AppContent />
    </DisasterProvider>
  );
}
