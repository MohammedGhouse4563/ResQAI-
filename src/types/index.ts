export type UserRole = 
  | 'citizen' 
  | 'authority' 
  | 'ambulance' 
  | 'fire_rescue' 
  | 'hospital' 
  | 'relief';

export type DisasterPhase = 'before' | 'during' | 'after';

export type DisasterSeverity = 'INFORMATION' | 'WATCH' | 'WARNING' | 'CRITICAL';

export interface DisasterZone {
  id: string;
  name: string;
  riskScore: number; // 0 - 100%
  severity: DisasterSeverity;
  center: [number, number]; // [lat, lng]
  polygon: [number, number][];
  exposedPopulation: number;
  waterLevelMeters: number;
  predictedPeakTime: string;
  spreadStage: number; // 0: Origin, 1: +30m, 2: +1h, 3: +2h, 4: +4h
  criticalInfra: string[];
}

export interface ResourceGapMetrics {
  required: number;
  available: number;
  gap: number; // required - available
}

export interface ZoneResourceRequirements {
  zoneId: string;
  zoneName: string;
  exposedPopulation: number;
  ambulances: ResourceGapMetrics;
  fireEngines: ResourceGapMetrics;
  rescueTeams: ResourceGapMetrics;
  shelterBeds: ResourceGapMetrics;
  waterKits: ResourceGapMetrics;
  foodPackets: ResourceGapMetrics;
  medicalKits: ResourceGapMetrics;
}

export type ResourceUnitType = 'ambulance' | 'fire_engine' | 'rescue_team';
export type ResourceUnitStatus = 'available' | 'assigned' | 'en_route' | 'staging' | 'maintenance';

export interface EmergencyResourceUnit {
  id: string;
  callSign: string;
  type: ResourceUnitType;
  status: ResourceUnitStatus;
  location: [number, number];
  assignedZone: string;
  equipment: string[];
  crewCount: number;
  fuelBatteryPercent: number;
  assignedIncidentId?: string;
  currentDestinationName?: string;
  etaMinutes?: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: [number, number];
  address?: string;
  totalBeds: number;
  occupiedBeds: number;
  icuBedsTotal: number;
  icuBedsOccupied: number;
  bloodUnitsReserve: number;
  predictedSurgeNext4h: number;
  status: 'nominal' | 'approaching_capacity' | 'critical_overload';
  availableOxygenDays: number;
  assignedZones?: string[];
}

export interface HospitalSuggestion {
  hospital: Hospital;
  distanceKm: number;
  travelTimeMin: number;
  availableBeds: number;
  availableIcu: number;
  floodSafeRoute: boolean;
  score: number;
  rationale: string;
}

export interface Shelter {
  id: string;
  name: string;
  location: [number, number];
  zoneId: string;
  totalCapacity: number;
  currentOccupancy: number;
  foodDaysSupply: number;
  waterKitsStock: number;
  hasMedicalPost: boolean;
  hasBackupPower: boolean;
  status: 'open' | 'near_capacity' | 'overcrowded' | 'compromised';
  safeAccessRoad: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  points: [number, number][];
  status: 'clear' | 'waterlogged' | 'blocked' | 'caution';
  estimatedClearanceHours?: number;
  detourAdvice?: string;
}

export type EmergencyCategory = 
  | 'medical' 
  | 'fire' 
  | 'flood' 
  | 'trapped' 
  | 'accident' 
  | 'missing' 
  | 'rescue' 
  | 'other';

export interface IncidentSOS {
  id: string;
  timestamp: string;
  category: EmergencyCategory;
  userName: string;
  userPhone: string;
  location: [number, number];
  address: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'pending' | 'reviewed' | 'dispatched' | 'resolved';
  recommendedResponse: string;
  recommendedUnitId?: string;
  assignedUnitId?: string;
  assignedUnitCallSign?: string;
  dispatchedAt?: string;
  etaMinutes?: number;
  peopleCount: number;
  audioNoteUrl?: string;
}

export interface AiRecommendation {
  id: string;
  timestamp: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  targetZone: string;
  title: string;
  predictionSummary: string;
  timeWindow: string;
  exposedPopulation: number;
  resourceGapText: string;
  recommendedAction: string;
  explainableReasons: string[];
  status: 'pending_review' | 'approved' | 'dismissed';
  suggestedUnitType?: ResourceUnitType;
  suggestedActionType: 'stage_resources' | 'shelter_expansion' | 'water_distribution' | 'road_closure_alert';
  fromZone?: string;
  toZone?: string;
  unitCount?: number;
}

export interface WhatIfScenarioState {
  rainfallIncreasePercent: number; // 0, 15, 30, 50%
  mainBridgeBlocked: boolean;
  shelterWestCompromised: boolean;
  hospitalCapacityReduction: boolean;
  rescueBoatsUnavailable: boolean;
  populationSurgePercent: number; // 0 to 50%
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  isAiAssisted: boolean;
}

export interface CitizenSafetyProfile {
  name: string;
  currentLocation: [number, number];
  address: string;
  isSafeChecked: boolean;
  lastCheckInTime?: string;
  assignedShelterId?: string;
  offlineQueuedSOS?: IncidentSOS[];
}

export interface SafeCitizenCheckIn {
  id: string;
  timestamp: string;
  citizenName: string;
  userPhone?: string;
  address: string;
  location: [number, number];
  zoneId?: string;
  status: 'SAFE_AND_SECURE';
  symbol: string; // '🛡️ SAFE & SECURE'
  verified: boolean;
  notes?: string;
}

export type SupportedLanguage = 'en' | 'ta' | 'hi';

