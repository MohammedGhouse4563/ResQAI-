import { 
  DisasterZone, 
  ZoneResourceRequirements, 
  EmergencyResourceUnit, 
  Hospital, 
  Shelter, 
  RoadSegment, 
  IncidentSOS, 
  AiRecommendation,
  SafeCitizenCheckIn
} from '../types';

// Map Center: Metro River Basin area (around 13.0450, 80.2200)
export const MAP_CENTER_DEFAULT: [number, number] = [13.0475, 80.2250];

export const INITIAL_DISASTER_ZONES: DisasterZone[] = [
  {
    id: 'zone-a',
    name: 'Zone A — Riverfront Delta',
    riskScore: 91,
    severity: 'CRITICAL',
    center: [13.0420, 80.2210],
    polygon: [
      [13.0360, 80.2150],
      [13.0490, 80.2180],
      [13.0470, 80.2290],
      [13.0380, 80.2270]
    ],
    exposedPopulation: 4800,
    waterLevelMeters: 2.1,
    predictedPeakTime: '15:30 – 17:00 (In 45 mins)',
    spreadStage: 0,
    criticalInfra: ['Apex River Bridge', 'Substation 4', 'Delta Elementary School']
  },
  {
    id: 'zone-b',
    name: 'Zone B — Commercial Market & Transit Hub',
    riskScore: 78,
    severity: 'WARNING',
    center: [13.0530, 80.2310],
    polygon: [
      [13.0470, 80.2260],
      [13.0580, 80.2280],
      [13.0590, 80.2390],
      [13.0490, 80.2370]
    ],
    exposedPopulation: 6200,
    waterLevelMeters: 1.2,
    predictedPeakTime: '16:30 – 18:00 (In 90 mins)',
    spreadStage: 1,
    criticalInfra: ['Central Metro Station', 'Market Plaza', 'Community Health Center']
  },
  {
    id: 'zone-c',
    name: 'Zone C — West Valley Residential Colony',
    riskScore: 54,
    severity: 'WATCH',
    center: [13.0610, 80.2440],
    polygon: [
      [13.0560, 80.2380],
      [13.0670, 80.2410],
      [13.0660, 80.2520],
      [13.0540, 80.2490]
    ],
    exposedPopulation: 3100,
    waterLevelMeters: 0.4,
    predictedPeakTime: '18:00 – 20:30 (In 3 hrs)',
    spreadStage: 2,
    criticalInfra: ['Valley Water Treatment Facility', 'Ring Road Interchange']
  }
];

export const INITIAL_RESOURCE_REQUIREMENTS: Record<string, ZoneResourceRequirements> = {
  'zone-a': {
    zoneId: 'zone-a',
    zoneName: 'Zone A — Riverfront Delta',
    exposedPopulation: 4800,
    ambulances: { required: 12, available: 5, gap: 7 },
    fireEngines: { required: 6, available: 3, gap: 3 },
    rescueTeams: { required: 8, available: 4, gap: 4 },
    shelterBeds: { required: 1100, available: 700, gap: 400 },
    waterKits: { required: 4800, available: 3000, gap: 1800 },
    foodPackets: { required: 4800, available: 3200, gap: 1600 },
    medicalKits: { required: 600, available: 350, gap: 250 }
  },
  'zone-b': {
    zoneId: 'zone-b',
    zoneName: 'Zone B — Commercial Market & Transit Hub',
    exposedPopulation: 6200,
    ambulances: { required: 10, available: 3, gap: 7 },
    fireEngines: { required: 5, available: 2, gap: 3 },
    rescueTeams: { required: 6, available: 2, gap: 4 },
    shelterBeds: { required: 1400, available: 800, gap: 600 },
    waterKits: { required: 6200, available: 4000, gap: 2200 },
    foodPackets: { required: 6200, available: 4100, gap: 2100 },
    medicalKits: { required: 800, available: 450, gap: 350 }
  },
  'zone-c': {
    zoneId: 'zone-c',
    zoneName: 'Zone C — West Valley Residential Colony',
    exposedPopulation: 3100,
    ambulances: { required: 4, available: 3, gap: 1 },
    fireEngines: { required: 2, available: 2, gap: 0 },
    rescueTeams: { required: 2, available: 2, gap: 0 },
    shelterBeds: { required: 600, available: 600, gap: 0 },
    waterKits: { required: 3100, available: 2800, gap: 300 },
    foodPackets: { required: 3100, available: 2900, gap: 200 },
    medicalKits: { required: 300, available: 250, gap: 50 }
  }
};

export const INITIAL_RESOURCE_UNITS: EmergencyResourceUnit[] = [
  // Ambulances
  {
    id: 'amb-01',
    callSign: 'MEDIC-01 (ALS Unit)',
    type: 'ambulance',
    status: 'en_route',
    location: [13.0410, 80.2240],
    assignedZone: 'zone-a',
    equipment: ['Ventilator', 'ECG', 'Trauma Kit', 'Pediatric Pack'],
    crewCount: 3,
    fuelBatteryPercent: 88,
    assignedIncidentId: 'sos-01',
    currentDestinationName: 'Apex Riverfront St.',
    etaMinutes: 6
  },
  {
    id: 'amb-02',
    callSign: 'MEDIC-02 (BLS Unit)',
    type: 'ambulance',
    status: 'staging',
    location: [13.0485, 80.2225],
    assignedZone: 'zone-a',
    equipment: ['Oxygen', 'First Aid', 'AED'],
    crewCount: 2,
    fuelBatteryPercent: 94,
    currentDestinationName: 'North High Staging Area'
  },
  {
    id: 'amb-03',
    callSign: 'MEDIC-03 (ALS Unit)',
    type: 'ambulance',
    status: 'available',
    location: [13.0560, 80.2295],
    assignedZone: 'zone-b',
    equipment: ['Ventilator', 'Advanced Defib', 'Splints'],
    crewCount: 3,
    fuelBatteryPercent: 82
  },
  {
    id: 'amb-04',
    callSign: 'MEDIC-04 (High-Water Ambulance)',
    type: 'ambulance',
    status: 'available',
    location: [13.0520, 80.2260],
    assignedZone: 'zone-a',
    equipment: ['4x4 Snorkel', 'Water-tight Med Chest', 'Stretcher Lift'],
    crewCount: 3,
    fuelBatteryPercent: 90
  },
  {
    id: 'amb-05',
    callSign: 'MEDIC-05 (BLS Unit)',
    type: 'ambulance',
    status: 'assigned',
    location: [13.0440, 80.2190],
    assignedZone: 'zone-a',
    equipment: ['Oxygen', 'Trauma Dressing'],
    crewCount: 2,
    fuelBatteryPercent: 76,
    assignedIncidentId: 'sos-02',
    currentDestinationName: 'Canal Road East',
    etaMinutes: 9
  },
  {
    id: 'amb-06',
    callSign: 'MEDIC-06 (Mobile ICU)',
    type: 'ambulance',
    status: 'available',
    location: [13.0640, 80.2410],
    assignedZone: 'zone-c',
    equipment: ['ICU Monitor', 'Dual Infusion', 'Ventilator'],
    crewCount: 4,
    fuelBatteryPercent: 95
  },
  {
    id: 'amb-07',
    callSign: 'MEDIC-07 (BLS Unit)',
    type: 'ambulance',
    status: 'available',
    location: [13.0620, 80.2450],
    assignedZone: 'zone-c',
    equipment: ['AED', 'Oxygen', 'First Aid'],
    crewCount: 2,
    fuelBatteryPercent: 85
  },
  {
    id: 'amb-08',
    callSign: 'MEDIC-08 (BLS Unit)',
    type: 'ambulance',
    status: 'staging',
    location: [13.0600, 80.2470],
    assignedZone: 'zone-c',
    equipment: ['AED', 'Stretcher'],
    crewCount: 2,
    fuelBatteryPercent: 91
  },

  // Fire Engines
  {
    id: 'fire-01',
    callSign: 'PUMPER-01 (Heavy Duty)',
    type: 'fire_engine',
    status: 'available',
    location: [13.0460, 80.2215],
    assignedZone: 'zone-a',
    equipment: ['High-Volume De-watering Pump', 'Foam Tank', 'Cutting Torches'],
    crewCount: 5,
    fuelBatteryPercent: 85
  },
  {
    id: 'fire-02',
    callSign: 'RESCUE-TRUCK-02',
    type: 'fire_engine',
    status: 'staging',
    location: [13.0540, 80.2330],
    assignedZone: 'zone-b',
    equipment: ['Aerial Ladder', 'Hydraulic Jaws of Life', 'Thermal Cameras'],
    crewCount: 4,
    fuelBatteryPercent: 92
  },
  {
    id: 'fire-03',
    callSign: 'WATER-TENDER-03',
    type: 'fire_engine',
    status: 'available',
    location: [13.0630, 80.2430],
    assignedZone: 'zone-c',
    equipment: ['10,000L Water Reservoir', 'Portable Submersible Pumps'],
    crewCount: 3,
    fuelBatteryPercent: 88
  },

  // Rescue Teams
  {
    id: 'res-01',
    callSign: 'NDRF-BOAT-ALPHA',
    type: 'rescue_team',
    status: 'assigned',
    location: [13.0390, 80.2185],
    assignedZone: 'zone-a',
    equipment: ['Inflatable Raft (12 Pax)', 'Diver Gear', 'Life Vests x25'],
    crewCount: 6,
    fuelBatteryPercent: 90,
    assignedIncidentId: 'sos-03',
    currentDestinationName: 'Submerged Lowland Hamlet',
    etaMinutes: 12
  },
  {
    id: 'res-02',
    callSign: 'DISASTER-BOAT-BETA',
    type: 'rescue_team',
    status: 'available',
    location: [13.0480, 80.2240],
    assignedZone: 'zone-a',
    equipment: ['Rigid Inflatable Boat (RIB)', 'Winch', 'Flotation Ropes'],
    crewCount: 5,
    fuelBatteryPercent: 84
  },
  {
    id: 'res-03',
    callSign: 'FLOOD-RESCUE-03',
    type: 'rescue_team',
    status: 'staging',
    location: [13.0550, 80.2350],
    assignedZone: 'zone-b',
    equipment: ['Motorized Zodiac Boat', 'Echo Depth Finder', 'Night Floodlights'],
    crewCount: 4,
    fuelBatteryPercent: 96
  }
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-01',
    name: 'Apex Memorial District Hospital',
    location: [13.0570, 80.2280],
    address: '45 Apex River Highway, Sector 4B',
    totalBeds: 450,
    occupiedBeds: 410,
    icuBedsTotal: 50,
    icuBedsOccupied: 46,
    bloodUnitsReserve: 84,
    predictedSurgeNext4h: 85,
    status: 'critical_overload',
    availableOxygenDays: 4.2,
    assignedZones: ['zone-a', 'zone-b']
  },
  {
    id: 'hosp-02',
    name: 'St. Jude Metro Healthcare Center',
    location: [13.0645, 80.2395],
    address: '112 Metro Boulevard, Safe Zone C',
    totalBeds: 300,
    occupiedBeds: 215,
    icuBedsTotal: 30,
    icuBedsOccupied: 18,
    bloodUnitsReserve: 130,
    predictedSurgeNext4h: 40,
    status: 'nominal',
    availableOxygenDays: 8.5,
    assignedZones: ['zone-c']
  },
  {
    id: 'hosp-03',
    name: 'Valley Community Trauma Clinic',
    location: [13.0590, 80.2520],
    address: '88 Eastern Valley Corridor',
    totalBeds: 80,
    occupiedBeds: 71,
    icuBedsTotal: 10,
    icuBedsOccupied: 9,
    bloodUnitsReserve: 28,
    predictedSurgeNext4h: 30,
    status: 'approaching_capacity',
    availableOxygenDays: 2.1,
    assignedZones: ['zone-c']
  }
];

export const INITIAL_SHELTERS: Shelter[] = [
  {
    id: 'shelter-01',
    name: 'North High School Disaster Relief Complex',
    location: [13.0515, 80.2235],
    zoneId: 'zone-a',
    totalCapacity: 1200,
    currentOccupancy: 700,
    foodDaysSupply: 3.5,
    waterKitsStock: 850,
    hasMedicalPost: true,
    hasBackupPower: true,
    status: 'open',
    safeAccessRoad: 'North Elevated Expressway'
  },
  {
    id: 'shelter-02',
    name: 'Civic Auditorium Evacuation Center',
    location: [13.0585, 80.2340],
    zoneId: 'zone-b',
    totalCapacity: 900,
    currentOccupancy: 810,
    foodDaysSupply: 1.8,
    waterKitsStock: 320,
    hasMedicalPost: true,
    hasBackupPower: true,
    status: 'near_capacity',
    safeAccessRoad: 'Market Bypass Boulevard'
  },
  {
    id: 'shelter-03',
    name: 'West Polytech Sports Pavilion',
    location: [13.0680, 80.2460],
    zoneId: 'zone-c',
    totalCapacity: 600,
    currentOccupancy: 150,
    foodDaysSupply: 6.0,
    waterKitsStock: 1400,
    hasMedicalPost: false,
    hasBackupPower: true,
    status: 'open',
    safeAccessRoad: 'Hilltop Ring Road'
  }
];

export const INITIAL_ROADS: RoadSegment[] = [
  {
    id: 'road-01',
    name: 'Riverbank Boulevard (Low-Lying)',
    points: [
      [13.0370, 80.2170],
      [13.0410, 80.2210],
      [13.0450, 80.2250]
    ],
    status: 'waterlogged',
    estimatedClearanceHours: 8,
    detourAdvice: 'Water depth 1.4m. Impassable for standard vehicles. Use North Elevated Bypass.'
  },
  {
    id: 'road-02',
    name: 'Apex River Bridge & Cause-way',
    points: [
      [13.0450, 80.2250],
      [13.0490, 80.2270]
    ],
    status: 'blocked',
    estimatedClearanceHours: 12,
    detourAdvice: 'Water overtopping parapet. Structural integrity inspection required.'
  },
  {
    id: 'road-03',
    name: 'North Elevated Expressway (Safe Corridor)',
    points: [
      [13.0430, 80.2130],
      [13.0500, 80.2210],
      [13.0590, 80.2310],
      [13.0680, 80.2440]
    ],
    status: 'clear',
    detourAdvice: 'Designated primary emergency evacuation corridor. 100% elevated and dry.'
  },
  {
    id: 'road-04',
    name: 'Valley Linkway Avenue',
    points: [
      [13.0540, 80.2350],
      [13.0610, 80.2420],
      [13.0670, 80.2510]
    ],
    status: 'clear',
    detourAdvice: 'Operational. Suitable for relief supply trucks.'
  }
];

export const INITIAL_SOS_INCIDENTS: IncidentSOS[] = [
  {
    id: 'sos-01',
    timestamp: '14:22',
    category: 'medical',
    userName: 'Kavitha Rangarajan',
    userPhone: '+91 98401 23891',
    location: [13.0415, 80.2235],
    address: 'Flat 3B, Delta Riverside Apts, Zone A',
    message: 'Elderly father suffering acute respiratory distress. Power out for nebulizer, ground floor flooded 4 feet.',
    severity: 'CRITICAL',
    status: 'dispatched',
    recommendedResponse: 'Advanced Life Support Ambulance with oxygen cylinder',
    recommendedUnitId: 'amb-01',
    assignedUnitId: 'amb-01',
    assignedUnitCallSign: 'MEDIC-01 (ALS Unit)',
    dispatchedAt: '14:25',
    etaMinutes: 5,
    peopleCount: 2
  },
  {
    id: 'sos-02',
    timestamp: '14:28',
    category: 'trapped',
    userName: 'Mohammed Arshad',
    userPhone: '+91 98205 61129',
    location: [13.0442, 80.2195],
    address: 'Shop 14, Riverbank Market, Zone A',
    message: 'Water breached storefront shutters. 4 adults and 1 infant trapped on mezzanine storage loft. Water level rising fast.',
    severity: 'CRITICAL',
    status: 'dispatched',
    recommendedResponse: 'Rescue Boat Team with infant flotation vests',
    recommendedUnitId: 'res-01',
    assignedUnitId: 'res-01',
    assignedUnitCallSign: 'NDRF-BOAT-ALPHA',
    dispatchedAt: '14:31',
    etaMinutes: 11,
    peopleCount: 5
  },
  {
    id: 'sos-03',
    timestamp: '14:35',
    category: 'flood',
    userName: 'Priya Sharma',
    userPhone: '+91 97112 44320',
    location: [13.0510, 80.2290],
    address: 'Cross Rd 4, Near Metro Pillar 114, Zone B',
    message: 'Vehicles floating, water entering homes rapidly. Need guidance on safe evacuation path.',
    severity: 'HIGH',
    status: 'reviewed',
    recommendedResponse: 'Safe evacuation guidance to Civic Auditorium shelter via Market Bypass',
    peopleCount: 3
  },
  {
    id: 'sos-04',
    timestamp: '14:41',
    category: 'accident',
    userName: 'Vikramaditya Rao',
    userPhone: '+91 99008 19283',
    location: [13.0545, 80.2325],
    address: 'West Corner of Market Plaza, Zone B',
    message: 'Electric transformer spark followed by tree collapse blocking rear entrance of tenement building.',
    severity: 'HIGH',
    status: 'pending',
    recommendedResponse: 'Fire & Rescue engine with hydraulic clearance winch',
    recommendedUnitId: 'fire-02',
    peopleCount: 8
  }
];

export const INITIAL_AI_RECOMMENDATIONS: AiRecommendation[] = [
  {
    id: 'rec-01',
    timestamp: '14:40',
    priority: 'CRITICAL',
    targetZone: 'Zone B',
    title: 'Pre-Position 3 Ambulances at Zone B Safe Access Point',
    predictionSummary: 'Disaster spread engine forecasts floodwaters propagating from Zone A into Zone B within 45–75 mins. Commercial district population of 6,200 at risk with only 3 ambulances currently staged.',
    timeWindow: '15:15 – 16:30 (Pre-peak window)',
    exposedPopulation: 6200,
    resourceGapText: 'Current deficit of 7 Ambulances in Zone B before demand surges.',
    recommendedAction: 'Stage 3 Ambulances (transfer MEDIC-06, MEDIC-07 from Zone C surplus) at North High School Junction safe staging area.',
    explainableReasons: [
      'Disaster cascade model shows +1.2m water level arrival in Zone B by 16:00',
      'Apex Bridge closure will lengthen response times from 8 min to 24 min if not pre-positioned',
      'Zone C currently has 0 ambulance deficit with 3 active units available',
      'Staging now preserves clear access along North Elevated Expressway'
    ],
    status: 'pending_review',
    suggestedUnitType: 'ambulance',
    suggestedActionType: 'stage_resources',
    fromZone: 'zone-c',
    toZone: 'zone-b',
    unitCount: 3
  },
  {
    id: 'rec-02',
    timestamp: '14:38',
    priority: 'HIGH',
    targetZone: 'Zone A & North Shelter',
    title: 'Mobilize 1,800 Additional Potable Water Kits to North High Shelter',
    predictionSummary: 'Evacuation pressure model predicts 400 additional displaced residents reaching North High Complex within 60 mins. Water inventory will exhaust in 14 hours at current rate.',
    timeWindow: 'Immediate (Next 30 mins)',
    exposedPopulation: 4800,
    resourceGapText: 'Water kit deficit: 1,800 kits in Zone A relief corridor.',
    recommendedAction: 'Release 1,200 water kits from West Polytech reserve hub and dispatch via Relief Truck-01.',
    explainableReasons: [
      'Shelter occupancy currently at 58% (700/1,200) and increasing at 15 arrivals/min',
      'Civic Auditorium shelter in Zone B is already at 90% capacity and turning people north',
      'West Polytech Hub holds 1,400 kits with only 150 current evacuees'
    ],
    status: 'pending_review',
    suggestedActionType: 'water_distribution',
    fromZone: 'zone-c',
    toZone: 'zone-a',
    unitCount: 1200
  },
  {
    id: 'rec-03',
    timestamp: '14:30',
    priority: 'HIGH',
    targetZone: 'Zone A',
    title: 'Formalize Arterial Closure & Broadcast Reroute for Apex River Bridge',
    predictionSummary: 'Telemetry sensor 04 reports water level 0.2m over parapet. 2 citizen vehicles observed attempting crossing.',
    timeWindow: 'Immediate',
    exposedPopulation: 11000,
    resourceGapText: 'Traffic obstruction risk on critical emergency transit lane.',
    recommendedAction: 'Trigger police barricade deployment & push citizen geofence alert to reroute to North Elevated Expressway.',
    explainableReasons: [
      'Bridge scour telemetry exceeds threshold of 1.8kN/m²',
      'Avoids trapping ambulances en route between Zone A incidents and Apex Hospital'
    ],
    status: 'approved',
    suggestedActionType: 'road_closure_alert'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'audit-01',
    timestamp: '14:25:12',
    actor: 'Dr. S. Narayanan',
    role: 'Disaster Authority Chief',
    action: 'DISPATCH_AUTHORIZED',
    details: 'Authorized MEDIC-01 dispatch to critical incident sos-01 (Respiratory emergency)',
    isAiAssisted: true
  },
  {
    id: 'audit-02',
    timestamp: '14:31:05',
    actor: 'Capt. R. Thomas',
    role: 'Fire & Rescue Commander',
    action: 'RESCUE_TEAM_DEPLOYED',
    details: 'Approved NDRF-BOAT-ALPHA deployment to trapped family at Riverbank Market',
    isAiAssisted: true
  },
  {
    id: 'audit-03',
    timestamp: '14:32:44',
    actor: 'System AI Engine',
    role: 'AI Cascade Forecaster',
    action: 'PREDICTION_RECALCULATED',
    details: 'Updated Zone B flood arrival timeline from +90m to +60m based on upstream rain sensor delta (+24mm/hr)',
    isAiAssisted: true
  }
];

export const INITIAL_SAFE_CITIZENS: SafeCitizenCheckIn[] = [
  {
    id: 'safe-01',
    timestamp: '14:38',
    citizenName: 'Meenakshi Sundaram',
    userPhone: '+91 94440 18234',
    address: 'High Ground Apt 4, Sector 3, Zone C',
    location: [13.0620, 80.2450],
    zoneId: 'zone-c',
    status: 'SAFE_AND_SECURE',
    symbol: '🛡️ SAFE & SECURE',
    verified: true,
    notes: 'Family of 4 evacuated to upper dry ridge; electricity active.'
  },
  {
    id: 'safe-02',
    timestamp: '14:42',
    citizenName: 'Deepak Varma',
    userPhone: '+91 98841 55091',
    address: '12 North Expressway Villa, Zone C',
    location: [13.0660, 80.2480],
    zoneId: 'zone-c',
    status: 'SAFE_AND_SECURE',
    symbol: '🛡️ SAFE & SECURE',
    verified: true,
    notes: 'Sheltered safely with 3 neighbors; adequate drinking water.'
  },
  {
    id: 'safe-03',
    timestamp: '14:47',
    citizenName: 'Ananya Krishnan',
    userPhone: '+91 97909 33214',
    address: 'North High School Relief Complex (Shelter 1)',
    location: [13.0515, 80.2235],
    zoneId: 'zone-a',
    status: 'SAFE_AND_SECURE',
    symbol: '🛡️ SAFE & SECURE',
    verified: true,
    notes: 'Safely admitted to North High Relief Center with elderly mother.'
  },
  {
    id: 'safe-04',
    timestamp: '14:50',
    citizenName: 'Suresh Babu',
    userPhone: '+91 98410 77651',
    address: 'Civic Auditorium Evac Center, Zone B',
    location: [13.0585, 80.2340],
    zoneId: 'zone-b',
    status: 'SAFE_AND_SECURE',
    symbol: '🛡️ SAFE & SECURE',
    verified: true,
    notes: 'Safe intake confirmed by Camp Officer. Rations provided.'
  },
  {
    id: 'safe-05',
    timestamp: '14:53',
    citizenName: 'Farzana Begum',
    userPhone: '+91 98402 99812',
    address: 'Valley View Heights, Sector 7, Zone C',
    location: [13.0595, 80.2510],
    zoneId: 'zone-c',
    status: 'SAFE_AND_SECURE',
    symbol: '🛡️ SAFE & SECURE',
    verified: true,
    notes: 'Safe on 2nd floor, no ground water seepage.'
  }
];

export const PRE_DISASTER_RECOMMENDATIONS: AiRecommendation[] = [
  {
    id: 'rec-pre-01',
    timestamp: '09:15',
    priority: 'CRITICAL',
    targetZone: 'Zone A',
    title: 'Pre-Stage 6 High-Capacity Dewatering Pumps at Sluice Embankment',
    predictionSummary: 'Hydrological radar predicts river inflow reaching 32,000 cusecs by 15:00. Pre-positioning dewatering pumps prevents early overflow into 1,200 riverside residences.',
    timeWindow: 'Next 90 mins (Before cloudburst onset)',
    exposedPopulation: 4800,
    resourceGapText: 'Current staging gap of 4 mobile pumps along Adyar basin.',
    recommendedAction: 'Deploy 6 emergency pump trailers and 2,500 sandbags to Delta Embankment gate 4.',
    explainableReasons: [
      'Inundation forecast model predicts water level breach within 3 hours',
      'Road access to riverbank will become impassable once crest exceeds 1.1m',
      'Reduces peak inundation depth across Zone A by an estimated 0.45m'
    ],
    status: 'pending_review',
    suggestedActionType: 'stage_resources'
  },
  {
    id: 'rec-pre-02',
    timestamp: '09:30',
    priority: 'HIGH',
    targetZone: 'Zone B',
    title: 'Issue Targeted Early Evacuation SMS Alert to Zone B Ground Floor Residents',
    predictionSummary: 'Commercial market lowlands will experience water ponding first. 1,400 vulnerable families require 2 hours lead time before arterial transit gridlocks.',
    timeWindow: 'Pre-evacuation window: 10:00 – 12:30',
    exposedPopulation: 6200,
    resourceGapText: 'Shelter intake staging at Civic Auditorium needs opening authorization.',
    recommendedAction: 'Broadcast cell-broadcast warning and open Civic Auditorium intake early.',
    explainableReasons: [
      'Market district drainage network at 92% capacity from antecedent rains',
      'Early staggered evacuation prevents panic bottleneck at Metro interchange'
    ],
    status: 'pending_review',
    suggestedActionType: 'shelter_expansion'
  },
  {
    id: 'rec-pre-03',
    timestamp: '10:00',
    priority: 'MEDIUM',
    targetZone: 'Zone C',
    title: 'Pre-Position Reserve Medical Blood Supplies & Oxygen Generators at High Ground Clinic',
    predictionSummary: 'Apex Hospital in low zone may face transit difficulty; routing elective cases to St. Jude and Valley Trauma Clinic.',
    timeWindow: 'Next 3 hours',
    exposedPopulation: 3100,
    resourceGapText: 'Reserve blood supply buffer at 45% of disaster readiness target.',
    recommendedAction: 'Transfer 50 units blood plasma and 20 oxygen manifolds to St. Jude Healthcare Center.',
    explainableReasons: [
      'St. Jude sits on elevated terrain with unaffected highway corridor access',
      'Guarantees trauma capacity if lowland hospital approaches critical overload'
    ],
    status: 'pending_review',
    suggestedActionType: 'stage_resources'
  }
];

export const POST_DISASTER_RECOMMENDATIONS: AiRecommendation[] = [
  {
    id: 'rec-post-01',
    timestamp: '17:10',
    priority: 'CRITICAL',
    targetZone: 'Zone A',
    title: 'Deploy 8 Mobile Water Purification Tankers & Chlorine Disinfection Teams',
    predictionSummary: 'Floodwaters in Riverfront Delta have receded to 0.8m, but municipal water pipelines have suffered severe silt intrusion. High risk of waterborne gastroenteritis.',
    timeWindow: 'Immediate 4-hour recovery window',
    exposedPopulation: 4800,
    resourceGapText: 'Potable water deficit of 14,000 liters across 3 relief clusters.',
    recommendedAction: 'Dispatch 8 mobile water purification units and distribute 5,000 chlorine purification tablets.',
    explainableReasons: [
      'Municipal pipeline pressure loss created negative suction backflow',
      'Early chlorination stops cholera and typhoid transmission chains',
      'Safe roll-call confirms 2,100 citizens returning to ground-floor homes'
    ],
    status: 'pending_review',
    suggestedActionType: 'water_distribution'
  },
  {
    id: 'rec-post-02',
    timestamp: '17:25',
    priority: 'HIGH',
    targetZone: 'Zone B',
    title: 'Structural Integrity & Load Deflection Audit for Apex River Bridge',
    predictionSummary: 'Overtopping waters have subsided below bridge deck. Structural inspection required before allowing public transit and supply freight.',
    timeWindow: 'Next 2 hours',
    exposedPopulation: 6200,
    resourceGapText: 'Requires 2 certified structural engineers with ultrasound deflection sensors.',
    recommendedAction: 'Deploy Engineering Inspection Unit 02 to certify bridge piers and reopen 2 lanes under escorted convoy.',
    explainableReasons: [
      'Reopening restores standard 8-minute transit time between Zone A and Metro hospital',
      'Reduces congestion detour pressure on North Elevated Expressway by 65%'
    ],
    status: 'pending_review',
    suggestedActionType: 'road_closure_alert'
  },
  {
    id: 'rec-post-03',
    timestamp: '17:40',
    priority: 'HIGH',
    targetZone: 'Zone B',
    title: 'Reconciliation of Safe & Secure Citizen Roll-Call & Shelter Repatriation',
    predictionSummary: '4,892 citizens verified Safe & Secure. 310 families ready for phased shelter discharge with emergency restoration dry rations.',
    timeWindow: 'Daylight recovery window (until 19:30)',
    exposedPopulation: 6200,
    resourceGapText: '3,200 dry ration food packets required for transitioning evacuees.',
    recommendedAction: 'Authorize distribution of 7-day emergency relief packs and free transport vouchers.',
    explainableReasons: [
      'Safe & Secure registry validates verified status of 94.2% displaced population',
      'Decongests North High School shelter to allow deep cleaning for school resumption'
    ],
    status: 'pending_review',
    suggestedActionType: 'shelter_expansion'
  }
];

