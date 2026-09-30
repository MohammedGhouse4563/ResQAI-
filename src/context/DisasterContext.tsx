import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { 
  UserRole, 
  DisasterPhase, 
  DisasterZone, 
  ZoneResourceRequirements, 
  EmergencyResourceUnit, 
  Hospital, 
  HospitalSuggestion,
  Shelter, 
  RoadSegment, 
  IncidentSOS, 
  AiRecommendation, 
  WhatIfScenarioState, 
  AuditLogEntry, 
  SupportedLanguage,
  EmergencyCategory,
  SafeCitizenCheckIn
} from '../types';
import { 
  INITIAL_DISASTER_ZONES, 
  INITIAL_RESOURCE_REQUIREMENTS, 
  INITIAL_RESOURCE_UNITS, 
  INITIAL_HOSPITALS, 
  INITIAL_SHELTERS, 
  INITIAL_ROADS, 
  INITIAL_SOS_INCIDENTS, 
  INITIAL_AI_RECOMMENDATIONS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_SAFE_CITIZENS,
  PRE_DISASTER_RECOMMENDATIONS,
  POST_DISASTER_RECOMMENDATIONS
} from '../data/mockData';
import { translations, TranslationDictionary } from '../data/translations';
import { analyzeIncidentWithAI } from '../services/geminiService';

interface DisasterContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  disasterPhase: DisasterPhase;
  setDisasterPhase: (phase: DisasterPhase) => void;
  timelineStep: number;
  setTimelineStep: (step: number) => void;
  
  // Data
  zones: DisasterZone[];
  resourceRequirements: Record<string, ZoneResourceRequirements>;
  units: EmergencyResourceUnit[];
  hospitals: Hospital[];
  shelters: Shelter[];
  roads: RoadSegment[];
  incidents: IncidentSOS[];
  recommendations: AiRecommendation[];
  auditLogs: AuditLogEntry[];
  
  // What-If Simulation
  whatIf: WhatIfScenarioState;
  updateWhatIf: (partial: Partial<WhatIfScenarioState>) => void;
  resetWhatIf: () => void;
  
  // Offline & Citizen state
  isOffline: boolean;
  toggleOffline: () => void;
  citizenSafe: boolean;
  setCitizenSafe: (safe: boolean) => void;
  safeCheckIns: SafeCitizenCheckIn[];
  registerCitizenSafe: (
    isSafe: boolean, 
    details?: { name?: string; address?: string; location?: [number, number]; phone?: string; notes?: string }
  ) => void;
  safeCount: number;
  
  // Actions
  triggerCitizenSOS: (
    category: EmergencyCategory, 
    message: string, 
    peopleCount: number, 
    userPhone: string,
    userName: string
  ) => Promise<IncidentSOS>;
  reportHazard: (title: string, details: string, location: [number, number]) => void;
  approveRecommendation: (recId: string) => void;
  dismissRecommendation: (recId: string) => void;
  assignUnitToIncident: (incidentId: string, unitId: string) => void;
  rebalanceResource: (fromZone: string, toZone: string, unitType: string, count: number) => void;
  activeSelectedZoneId: string | null;
  setActiveSelectedZoneId: (zoneId: string | null) => void;

  // Hospital & Zone Operations (Requested Features)
  updateHospital: (id: string, updates: Partial<Hospital>) => void;
  addHospital: (newHosp: Hospital) => void;
  updateZoneName: (zoneId: string, newName: string) => void;
  autoAssignHospitalsForZone: (zoneId: string) => void;
  suggestHospitalsForZone: (zoneId: string) => HospitalSuggestion[];

  // AI Auto Voice Call & Notify System (Before & During Disaster)
  activeIncomingCall: { phase: DisasterPhase } | null;
  triggerIncomingVoiceCall: (phase?: DisasterPhase) => void;
  closeIncomingVoiceCall: () => void;

  // Modals & UI States
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

const DisasterContext = createContext<DisasterContextType | undefined>(undefined);

const DEFAULT_WHAT_IF: WhatIfScenarioState = {
  rainfallIncreasePercent: 0,
  mainBridgeBlocked: false,
  shelterWestCompromised: false,
  hospitalCapacityReduction: false,
  rescueBoatsUnavailable: false,
  populationSurgePercent: 0
};

export const DisasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('authority');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [disasterPhase, setDisasterPhase] = useState<DisasterPhase>('during');
  const [timelineStep, setTimelineStep] = useState<number>(0); // 0: NOW, 1: +30m, 2: +1h, 3: +2h, 4: +4h
  const [activeSelectedZoneId, setActiveSelectedZoneId] = useState<string | null>('zone-a');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Entities state
  const [rawZones, setRawZones] = useState<DisasterZone[]>(INITIAL_DISASTER_ZONES);
  const [rawResourceRequirements, setRawResourceRequirements] = useState(INITIAL_RESOURCE_REQUIREMENTS);
  const [units, setUnits] = useState<EmergencyResourceUnit[]>(INITIAL_RESOURCE_UNITS);
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [roads, setRoads] = useState<RoadSegment[]>(INITIAL_ROADS);
  const [incidents, setIncidents] = useState<IncidentSOS[]>(INITIAL_SOS_INCIDENTS);
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>(INITIAL_AI_RECOMMENDATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Simulation, Offline & Citizen Safety Roll-Call
  const [whatIf, setWhatIf] = useState<WhatIfScenarioState>(DEFAULT_WHAT_IF);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [citizenSafe, setCitizenSafe] = useState<boolean>(false);
  const [safeCheckIns, setSafeCheckIns] = useState<SafeCitizenCheckIn[]>(INITIAL_SAFE_CITIZENS);
  const [activeIncomingCall, setActiveIncomingCall] = useState<{ phase: DisasterPhase } | null>(null);

  const triggerIncomingVoiceCall = useCallback((phase?: DisasterPhase) => {
    setActiveIncomingCall({ phase: phase || disasterPhase });
  }, [disasterPhase]);

  const closeIncomingVoiceCall = useCallback(() => {
    setActiveIncomingCall(null);
  }, []);

  const t = useMemo(() => translations[language], [language]);

  const toggleOffline = () => setIsOffline(prev => !prev);

  // Responsive Disaster Phase Transition Handler
  const handleSetDisasterPhase = useCallback((phase: DisasterPhase) => {
    setDisasterPhase(phase);
    
    // Dynamically change recommendations based on phase
    if (phase === 'before') {
      setRecommendations(PRE_DISASTER_RECOMMENDATIONS);
      setRoads(curr => curr.map(r => ({
        ...r,
        status: r.id === 'road-01' ? 'caution' : 'clear',
        detourAdvice: r.id === 'road-01' 
          ? 'Pre-storm staging active: sandbags placed along curb. Passable.' 
          : 'Normal transit corridor open.'
      })));
    } else if (phase === 'during') {
      setRecommendations(INITIAL_AI_RECOMMENDATIONS);
      setRoads(INITIAL_ROADS);
    } else if (phase === 'after') {
      setRecommendations(POST_DISASTER_RECOMMENDATIONS);
      setRoads(curr => curr.map(r => ({
        ...r,
        status: r.id === 'road-02' ? 'caution' : r.id === 'road-01' ? 'caution' : 'clear',
        detourAdvice: r.id === 'road-02' 
          ? 'Apex Bridge reopened for relief convoy (structural speed limit 20 km/h).' 
          : r.id === 'road-01' 
          ? 'Water subsided; mud clearance crews active.' 
          : 'Clear for relief and repatriation trucks.'
      })));
    }

    const now = new Date().toLocaleTimeString();
    const phaseLabel = phase === 'before' 
      ? 'Pre-Disaster Early Warning & Preparedness' 
      : phase === 'during' 
      ? 'Active Disaster Response & Tactical Rescue' 
      : 'Post-Disaster Recovery, Relief & Rehabilitation';

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: now,
        actor: 'Disaster Command Authority',
        role: 'Operations Director',
        action: 'PHASE_CHANGED',
        details: `Operational command mode set to "${phaseLabel}". Recalculated threat scores, resources, and live recommendations.`,
        isAiAssisted: true
      },
      ...prev
    ]);
  }, []);

  // Citizen Safe & Secure Registration
  const registerCitizenSafe = useCallback((
    isSafe: boolean, 
    details?: { name?: string; address?: string; location?: [number, number]; phone?: string; notes?: string }
  ) => {
    setCitizenSafe(isSafe);
    if (isSafe) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newCheckIn: SafeCitizenCheckIn = {
        id: `safe-live-${Date.now()}`,
        timestamp: timeStr,
        citizenName: details?.name || 'Citizen Verified',
        userPhone: details?.phone || '+91 98401 23891',
        address: details?.address || 'Delta Enclave, Sector 4',
        location: details?.location || [13.0465, 80.2220],
        zoneId: 'zone-a',
        status: 'SAFE_AND_SECURE',
        symbol: '🛡️ SAFE & SECURE',
        verified: true,
        notes: details?.notes || 'Marked safe via ResQAI Citizen Portal'
      };

      setSafeCheckIns(prev => [newCheckIn, ...prev.filter(c => c.id !== newCheckIn.id)]);

      setAuditLogs(prev => [
        {
          id: `audit-${Date.now()}`,
          timestamp: now.toLocaleTimeString(),
          actor: details?.name || 'Citizen User',
          role: 'Citizen Check-In',
          action: 'CITIZEN_SAFE_AND_SECURE',
          details: `Registered SAFE & SECURE status with symbol 🛡️ at ${newCheckIn.address} [${newCheckIn.location[0].toFixed(4)}°, ${newCheckIn.location[1].toFixed(4)}°]. Transmitted to Authority Command Service.`,
          isAiAssisted: false
        },
        ...prev
      ]);
    }
  }, []);

  const safeCount = useMemo(() => {
    // Base 4892 verified in community roll-call + active registered check-ins
    return 4892 + safeCheckIns.length;
  }, [safeCheckIns.length]);

  // Dynamic recalculation of zones based on timelineStep + whatIf scenarios + disasterPhase
  const zones = useMemo(() => {
    return rawZones.map(zone => {
      let riskScore = zone.riskScore;
      let waterLevel = zone.waterLevelMeters;
      let exposedPop = zone.exposedPopulation;
      let severity = zone.severity;

      // Phase scaling: Pre-Disaster, Active, Post-Recovery
      if (disasterPhase === 'before') {
        waterLevel = Number(Math.max(0.18, waterLevel * 0.22).toFixed(2));
        riskScore = Math.max(28, Math.round(riskScore * 0.55));
        severity = zone.id === 'zone-a' ? 'WARNING' : zone.id === 'zone-b' ? 'WATCH' : 'INFORMATION';
      } else if (disasterPhase === 'after') {
        waterLevel = Number(Math.max(0.2, waterLevel * 0.32).toFixed(2));
        riskScore = Math.max(18, Math.round(riskScore * 0.32));
        severity = zone.id === 'zone-a' ? 'WATCH' : 'INFORMATION';
      }

      // Timeline effect: spread propagation (active during disaster or if timeline adjusted)
      if (disasterPhase === 'during') {
        if (zone.id === 'zone-a') {
          if (timelineStep >= 1) waterLevel = Math.min(3.5, waterLevel + 0.5 * timelineStep);
          if (timelineStep >= 2) riskScore = Math.min(99, riskScore + 4);
        } else if (zone.id === 'zone-b') {
          if (timelineStep === 0) {
            riskScore = 78;
          } else if (timelineStep === 1) {
            riskScore = 88;
            waterLevel += 0.4;
            severity = 'CRITICAL';
          } else if (timelineStep >= 2) {
            riskScore = 94;
            waterLevel += 0.9;
            severity = 'CRITICAL';
          }
        } else if (zone.id === 'zone-c') {
          if (timelineStep >= 3) {
            riskScore = 76;
            waterLevel += 0.6;
            severity = 'WARNING';
          }
        }
      }

      // What-If modifiers
      if (whatIf.rainfallIncreasePercent > 0) {
        const factor = 1 + whatIf.rainfallIncreasePercent / 100;
        waterLevel = Number((waterLevel * factor).toFixed(2));
        riskScore = Math.min(99, Math.round(riskScore * (1 + whatIf.rainfallIncreasePercent / 300)));
      }

      if (whatIf.populationSurgePercent > 0) {
        exposedPop = Math.round(exposedPop * (1 + whatIf.populationSurgePercent / 100));
      }

      return {
        ...zone,
        riskScore,
        waterLevelMeters: waterLevel,
        exposedPopulation: exposedPop,
        severity
      };
    });
  }, [rawZones, timelineStep, whatIf, disasterPhase]);

  // Dynamic resource requirements based on exposed population, what-if, and disasterPhase
  const resourceRequirements = useMemo(() => {
    const updated = { ...rawResourceRequirements };
    zones.forEach(zone => {
      const baseReq = updated[zone.id];
      if (!baseReq) return;

      const popRatio = zone.exposedPopulation / INITIAL_DISASTER_ZONES.find(z => z.id === zone.id)!.exposedPopulation;
      const rainFactor = 1 + (whatIf.rainfallIncreasePercent / 150);

      // Phase multipliers
      const ambMult = disasterPhase === 'before' ? 0.6 : disasterPhase === 'after' ? 0.35 : 1;
      const rescueMult = disasterPhase === 'before' ? 0.5 : disasterPhase === 'after' ? 0.4 : 1;
      const shelterMult = disasterPhase === 'before' ? 0.7 : disasterPhase === 'after' ? 1.4 : 1;
      const waterMult = disasterPhase === 'before' ? 0.6 : disasterPhase === 'after' ? 1.5 : 1;

      const ambRequired = Math.round(baseReq.ambulances.required * popRatio * ambMult * (whatIf.mainBridgeBlocked ? 1.3 : 1));
      const rescueReq = Math.round(baseReq.rescueTeams.required * popRatio * rescueMult);
      const waterReq = Math.round(baseReq.waterKits.required * popRatio * waterMult);
      const shelterReq = Math.round(baseReq.shelterBeds.required * popRatio * shelterMult * rainFactor);

      updated[zone.id] = {
        ...baseReq,
        exposedPopulation: zone.exposedPopulation,
        ambulances: {
          ...baseReq.ambulances,
          required: ambRequired,
          gap: Math.max(0, ambRequired - baseReq.ambulances.available)
        },
        rescueTeams: {
          ...baseReq.rescueTeams,
          required: rescueReq,
          gap: Math.max(0, rescueReq - baseReq.rescueTeams.available)
        },
        shelterBeds: {
          ...baseReq.shelterBeds,
          required: shelterReq,
          gap: Math.max(0, shelterReq - baseReq.shelterBeds.available)
        },
        waterKits: {
          ...baseReq.waterKits,
          required: waterReq,
          gap: Math.max(0, waterReq - baseReq.waterKits.available)
        }
      };
    });
    return updated;
  }, [rawResourceRequirements, zones, whatIf, disasterPhase]);

  // Update WhatIf
  const updateWhatIf = useCallback((partial: Partial<WhatIfScenarioState>) => {
    setWhatIf(prev => {
      const next = { ...prev, ...partial };
      // Also update road status if main bridge blocked
      if (next.mainBridgeBlocked) {
        setRoads(currRoads => currRoads.map(r => r.id === 'road-02' ? { ...r, status: 'blocked', detourAdvice: 'SIMULATION OVERRIDE: Bridge blocked by flood surge.' } : r));
      } else {
        setRoads(currRoads => currRoads.map(r => r.id === 'road-02' ? { ...r, status: 'blocked', detourAdvice: 'Water overtopping parapet.' } : r));
      }

      // If shelter compromised
      if (next.shelterWestCompromised) {
        setShelters(currShelters => currShelters.map(s => s.id === 'shelter-03' ? { ...s, status: 'compromised', totalCapacity: 0 } : s));
      } else {
        setShelters(currShelters => currShelters.map(s => s.id === 'shelter-03' ? { ...s, status: 'open', totalCapacity: 600 } : s));
      }

      return next;
    });

    const now = new Date().toLocaleTimeString();
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: now,
        actor: 'Authority Simulator',
        role: 'Disaster Analyst',
        action: 'WHAT_IF_APPLIED',
        details: `Updated simulation parameters: ${JSON.stringify(partial)}`,
        isAiAssisted: true
      },
      ...prev
    ]);
  }, []);

  const resetWhatIf = useCallback(() => {
    setWhatIf(DEFAULT_WHAT_IF);
    setRoads(INITIAL_ROADS);
    setShelters(INITIAL_SHELTERS);
  }, []);

  // Citizen SOS Trigger
  const triggerCitizenSOS = useCallback(async (
    category: EmergencyCategory, 
    message: string, 
    peopleCount: number, 
    userPhone: string,
    userName: string
  ): Promise<IncidentSOS> => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newId = `sos-${Date.now().toString().slice(-4)}`;

    // Call live AI triage (Gemini / OpenRouter)
    let severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
    let recommendedResponse = 'Emergency Response Unit Dispatch';
    let recommendedUnitId = 'amb-04';

    try {
      const triage = await analyzeIncidentWithAI({ category, message, peopleCount, address: 'Delta Enclave, Zone A' });
      severity = triage.severity;
      recommendedResponse = triage.recommendedResponse;
      if (triage.suggestedUnitType === 'rescue_team') {
        recommendedUnitId = 'res-02';
      } else if (triage.suggestedUnitType === 'fire_engine') {
        recommendedUnitId = 'fire-02';
      } else {
        recommendedUnitId = 'amb-04';
      }
    } catch {
      if (category === 'medical' || category === 'trapped') {
        severity = 'CRITICAL';
        recommendedResponse = category === 'medical' 
          ? 'Advanced Life Support Ambulance with oxygen' 
          : 'Flood Rescue Dinghy & diver squad';
        recommendedUnitId = category === 'medical' ? 'amb-04' : 'res-02';
      }
    }

    const newIncident: IncidentSOS = {
      id: newId,
      timestamp: now,
      category,
      userName: userName || 'Citizen Beacon',
      userPhone: userPhone || '+91 99000 00000',
      location: [13.0465, 80.2220], // near riverbank zone A
      address: 'Delta Enclave, Zone A',
      message: message || 'Urgent assistance requested via ResQAI Emergency SOS button.',
      severity,
      status: isOffline ? 'pending' : 'reviewed',
      recommendedResponse,
      recommendedUnitId,
      peopleCount: peopleCount || 1
    };

    setIncidents(prev => [newIncident, ...prev]);

    // Audit log
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: now,
        actor: userName || 'Citizen',
        role: 'Citizen User',
        action: isOffline ? 'SOS_QUEUED_OFFLINE' : 'SOS_TRANSMITTED',
        details: `SOS beacon registered [${category.toUpperCase()}]. Location: Delta Enclave. People: ${peopleCount}`,
        isAiAssisted: false
      },
      ...prev
    ]);

    return newIncident;
  }, [isOffline]);

  // Citizen Hazard Report
  const reportHazard = useCallback((title: string, details: string, location: [number, number]) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: now,
        actor: 'Citizen Patrol',
        role: 'Citizen',
        action: 'HAZARD_REPORTED',
        details: `${title}: ${details} at [${location[0].toFixed(4)}, ${location[1].toFixed(4)}]`,
        isAiAssisted: false
      },
      ...prev
    ]);
  }, []);

  // Approve AI Recommendation
  const approveRecommendation = useCallback((recId: string) => {
    const now = new Date().toLocaleTimeString();
    setRecommendations(prev => prev.map(r => {
      if (r.id === recId) {
        return { ...r, status: 'approved' };
      }
      return r;
    }));

    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;

    // Apply concrete operational changes
    if (rec.suggestedActionType === 'stage_resources' && rec.suggestedUnitType === 'ambulance') {
      // Move 2 available ambulances to staging in Zone B
      setUnits(currUnits => currUnits.map(u => {
        if (u.id === 'amb-06' || u.id === 'amb-07') {
          return {
            ...u,
            status: 'staging',
            assignedZone: 'zone-b',
            currentDestinationName: 'North High Staging Area Zone B'
          };
        }
        return u;
      }));

      // Adjust available and gap metrics
      setRawResourceRequirements(currReq => ({
        ...currReq,
        'zone-c': {
          ...currReq['zone-c'],
          ambulances: {
            ...currReq['zone-c'].ambulances,
            available: Math.max(1, currReq['zone-c'].ambulances.available - 2)
          }
        },
        'zone-b': {
          ...currReq['zone-b'],
          ambulances: {
            ...currReq['zone-b'].ambulances,
            available: currReq['zone-b'].ambulances.available + 2,
            gap: Math.max(0, currReq['zone-b'].ambulances.gap - 2)
          }
        }
      }));
    } else if (rec.suggestedActionType === 'water_distribution') {
      setRawResourceRequirements(currReq => ({
        ...currReq,
        'zone-a': {
          ...currReq['zone-a'],
          waterKits: {
            ...currReq['zone-a'].waterKits,
            available: currReq['zone-a'].waterKits.available + 1200,
            gap: Math.max(0, currReq['zone-a'].waterKits.gap - 1200)
          }
        }
      }));
      setShelters(currShelters => currShelters.map(s => s.id === 'shelter-01' ? { ...s, waterKitsStock: s.waterKitsStock + 1200 } : s));
    }

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: now,
        actor: 'Commander J. Vance',
        role: 'District Authority Officer',
        action: 'AI_RECOMMENDATION_APPROVED',
        details: `Approved AI action: "${rec.title}". Real-world operational staging executed.`,
        isAiAssisted: true
      },
      ...prev
    ]);
  }, [recommendations]);

  // Dismiss Recommendation
  const dismissRecommendation = useCallback((recId: string) => {
    const now = new Date().toLocaleTimeString();
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'dismissed' } : r));

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: now,
        actor: 'Officer in Command',
        role: 'District Authority Officer',
        action: 'AI_RECOMMENDATION_DISMISSED',
        details: `Dismissed AI recommendation id: ${recId}`,
        isAiAssisted: true
      },
      ...prev
    ]);
  }, []);

  // Assign Unit to Incident
  const assignUnitToIncident = useCallback((incidentId: string, unitId: string) => {
    const now = new Date().toLocaleTimeString();
    const unit = units.find(u => u.id === unitId);
    if (!unit) return;

    setUnits(currUnits => currUnits.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          status: 'assigned',
          assignedIncidentId: incidentId,
          currentDestinationName: 'Active Incident Scene',
          etaMinutes: 8
        };
      }
      return u;
    }));

    setIncidents(currIncidents => currIncidents.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'dispatched',
          assignedUnitId: unitId,
          assignedUnitCallSign: unit.callSign,
          dispatchedAt: now,
          etaMinutes: 8
        };
      }
      return inc;
    }));

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: now,
        actor: 'Emergency Dispatcher',
        role: 'Operator',
        action: 'UNIT_DISPATCHED',
        details: `Unit ${unit.callSign} assigned to incident ${incidentId}. ETA 8 minutes.`,
        isAiAssisted: true
      },
      ...prev
    ]);
  }, [units]);

  // Rebalance Resource (Surplus to Deficit)
  const rebalanceResource = useCallback((fromZone: string, toZone: string, unitType: string, count: number) => {
    const now = new Date().toLocaleTimeString();
    setRawResourceRequirements(currReq => {
      const from = currReq[fromZone];
      const to = currReq[toZone];
      if (!from || !to) return currReq;

      return {
        ...currReq,
        [fromZone]: {
          ...from,
          ambulances: {
            ...from.ambulances,
            available: Math.max(0, from.ambulances.available - count),
            gap: Math.max(0, from.ambulances.required - (from.ambulances.available - count))
          }
        },
        [toZone]: {
          ...to,
          ambulances: {
            ...to.ambulances,
            available: to.ambulances.available + count,
            gap: Math.max(0, to.ambulances.required - (to.ambulances.available + count))
          }
        }
      };
    });

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: now,
        actor: 'Resource Coordinator',
        role: 'Authority',
        action: 'RESOURCE_CONFLICT_REBALANCED',
        details: `Rebalanced ${count} ${unitType} units from ${fromZone} to ${toZone}`,
        isAiAssisted: true
      },
      ...prev
    ]);
  }, []);

  // Distance calculator using Haversine formula
  const calculateDistanceKm = useCallback((coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371; // km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Number((R * c).toFixed(1));
  }, []);

  // Suggest hospitals for a zone based on proximity, capacity, ICU, and route safety
  const suggestHospitalsForZone = useCallback((zoneId: string): HospitalSuggestion[] => {
    const targetZone = zones.find(z => z.id === zoneId) || zones[0];
    if (!targetZone) return [];

    return hospitals.map(h => {
      const dist = calculateDistanceKm(targetZone.center, h.location);
      const travelTime = Math.round(dist * (whatIf.mainBridgeBlocked ? 4.2 : 2.5)) + (h.status === 'critical_overload' ? 12 : 3);
      const availBeds = Math.max(0, h.totalBeds - h.occupiedBeds);
      const availIcu = Math.max(0, h.icuBedsTotal - h.icuBedsOccupied);
      const floodSafeRoute = !whatIf.mainBridgeBlocked || dist < 3 || h.id === 'hosp-02';

      // Score: proximity (40%) + bed availability (30%) + ICU (20%) + route safety (10%)
      let score = Math.max(20, 100 - Math.round(dist * 12));
      if (h.status === 'critical_overload') score -= 25;
      if (availBeds > 50) score += 15;
      if (availIcu > 5) score += 10;
      if (!floodSafeRoute) score -= 20;
      score = Math.min(99, Math.max(15, score));

      let rationale = `${dist}km from ${targetZone.name}. `;
      if (availBeds > 30) rationale += `${availBeds} general beds and ${availIcu} ICU units ready. `;
      else rationale += `Limited capacity (${availBeds} beds remaining). `;
      if (!floodSafeRoute) rationale += 'Warning: Bridge overtopped; bypass route recommended.';
      else rationale += 'Corridor clear of flood waters.';

      return {
        hospital: h,
        distanceKm: dist,
        travelTimeMin: travelTime,
        availableBeds: availBeds,
        availableIcu: availIcu,
        floodSafeRoute,
        score,
        rationale
      };
    }).sort((a, b) => b.score - a.score);
  }, [zones, hospitals, whatIf, calculateDistanceKm]);

  // Auto-Assign best nearby hospital to a zone
  const autoAssignHospitalsForZone = useCallback((zoneId: string) => {
    const suggestions = suggestHospitalsForZone(zoneId);
    if (suggestions.length === 0) return;
    const targetZone = zones.find(z => z.id === zoneId) || zones[0];
    const best = suggestions[0].hospital;

    setHospitals(prev => prev.map(h => {
      if (h.id === best.id) {
        const currentAssigned = h.assignedZones || [];
        const newAssigned = currentAssigned.includes(zoneId) ? currentAssigned : [...currentAssigned, zoneId];
        return {
          ...h,
          assignedZones: newAssigned,
          predictedSurgeNext4h: h.predictedSurgeNext4h + 25
        };
      }
      return h;
    }));

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        actor: 'Authority Command',
        role: 'Emergency Medical Director',
        action: 'HOSPITAL_AUTO_ASSIGNED',
        details: `Assigned facility "${best.name}" to prioritize patients from ${targetZone.name} (Proximity: ${suggestions[0].distanceKm}km, ${suggestions[0].availableBeds} beds available).`,
        isAiAssisted: true
      },
      ...prev
    ]);
  }, [suggestHospitalsForZone, zones]);

  // Update Hospital details (rename, capacity, ICU, address, assigned zones)
  const updateHospital = useCallback((id: string, updates: Partial<Hospital>) => {
    setHospitals(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        actor: 'Hospital Administrator',
        role: 'Authority Command',
        action: 'HOSPITAL_MODIFIED',
        details: `Updated facility specifications for ${updates.name || id}.`,
        isAiAssisted: false
      },
      ...prev
    ]);
  }, []);

  // Add/Commission a new hospital
  const addHospital = useCallback((newHosp: Hospital) => {
    setHospitals(prev => [newHosp, ...prev]);
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        actor: 'Regional Health Command',
        role: 'Authority',
        action: 'HOSPITAL_COMMISSIONED',
        details: `Commissioned new healthcare facility: "${newHosp.name}" with ${newHosp.totalBeds} beds.`,
        isAiAssisted: false
      },
      ...prev
    ]);
  }, []);

  // Modify / Rename Disaster Zone
  const updateZoneName = useCallback((zoneId: string, newName: string) => {
    if (!newName || !newName.trim()) return;
    const cleanName = newName.trim();
    setRawZones(prev => prev.map(z => z.id === zoneId ? { ...z, name: cleanName } : z));
    setRawResourceRequirements(prev => {
      if (!prev[zoneId]) return prev;
      return {
        ...prev,
        [zoneId]: {
          ...prev[zoneId],
          zoneName: cleanName
        }
      };
    });
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        actor: 'Disaster Commander',
        role: 'GIS & Command Authority',
        action: 'ZONE_REDESIGNATED',
        details: `Disaster sector [${zoneId}] renamed to "${cleanName}".`,
        isAiAssisted: false
      },
      ...prev
    ]);
  }, []);

  return (
    <DisasterContext.Provider value={{
      role,
      setRole,
      language,
      setLanguage,
      t,
      disasterPhase,
      setDisasterPhase: handleSetDisasterPhase,
      timelineStep,
      setTimelineStep,
      zones,
      resourceRequirements,
      units,
      hospitals,
      shelters,
      roads,
      incidents,
      recommendations,
      auditLogs,
      whatIf,
      updateWhatIf,
      resetWhatIf,
      isOffline,
      toggleOffline,
      citizenSafe,
      setCitizenSafe,
      safeCheckIns,
      registerCitizenSafe,
      safeCount,
      triggerCitizenSOS,
      reportHazard,
      approveRecommendation,
      dismissRecommendation,
      assignUnitToIncident,
      rebalanceResource,
      activeSelectedZoneId,
      setActiveSelectedZoneId,
      updateHospital,
      addHospital,
      updateZoneName,
      autoAssignHospitalsForZone,
      suggestHospitalsForZone,
      activeIncomingCall,
      triggerIncomingVoiceCall,
      closeIncomingVoiceCall,
      activeModal,
      setActiveModal
    }}>
      {children}
    </DisasterContext.Provider>
  );
};

export const useDisaster = () => {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
};
