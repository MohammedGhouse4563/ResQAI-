import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useDisaster } from '../../context/DisasterContext';
import { 
  Layers, Compass, AlertTriangle, ShieldCheck, Eye, EyeOff, Sparkles, 
  RefreshCw, ChevronDown, ChevronUp, Map, Globe2, Search, MapPin, Locate, ExternalLink, X, Navigation 
} from 'lucide-react';
import { generateMapSpatialIntelligence, MapSpatialAnalysis } from '../../services/geminiService';
import { 
  getTileLayerConfig, 
  MapTileMode, 
  searchLocationsGoogle, 
  reverseGeocodeGoogle, 
  detectCurrentLocationGoogle, 
  GeocodedPlace,
  getGoogleMapsNavigationUrl 
} from '../../services/googleMapsService';

export const DisasterCommandMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupsRef = useRef<{
    zones?: L.LayerGroup;
    spreadVector?: L.LayerGroup;
    units?: L.LayerGroup;
    infrastructure?: L.LayerGroup;
    roads?: L.LayerGroup;
    incidents?: L.LayerGroup;
    searchMarker?: L.LayerGroup;
    safeCitizens?: L.LayerGroup;
  }>({});

  const { 
    zones, 
    units, 
    hospitals, 
    shelters, 
    roads, 
    incidents, 
    activeSelectedZoneId,
    setActiveSelectedZoneId,
    timelineStep,
    safeCheckIns
  } = useDisaster();

  // Map Tile Basemap Mode (Google Hybrid, Google Terrain, Google Roadmap, Tactical Dark)
  const [tileMode, setTileMode] = useState<MapTileMode>('google_hybrid');

  // Layer Visibility state
  const [showZones, setShowZones] = useState(true);
  const [showSpread, setShowSpread] = useState(true);
  const [showUnits, setShowUnits] = useState(true);
  const [showInfra, setShowInfra] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showSafeCitizens, setShowSafeCitizens] = useState(true);

  // Google Maps Search and Geolocation State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedPlace[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<GeocodedPlace | null>(null);

  // Search places via Google Maps Geocoding API with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const places = await searchLocationsGoogle(searchQuery);
        setSearchResults(places);
        if (places.length > 0) setShowSearchDropdown(true);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Place Selection
  const handleSelectPlace = (place: GeocodedPlace) => {
    setSelectedPlace(place);
    setShowSearchDropdown(false);
    setSearchQuery(place.formattedAddress);
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo([place.lat, place.lng], 16, { animate: true, duration: 1.2 });

    const sm = layerGroupsRef.current.searchMarker;
    if (sm) {
      sm.clearLayers();
      const pinIcon = L.divIcon({
        className: 'custom-google-pin',
        html: `
          <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
            <div style="width:26px; height:26px; background:#ea4335; border:3px solid #ffffff; border-radius:50%; box-shadow:0 0 15px rgba(234,67,53,0.9); display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:bold;">📍</div>
            <div style="width:8px; height:8px; background:#ea4335; transform:rotate(45deg); margin-top:-4px;"></div>
          </div>
        `,
        iconSize: [26, 32],
        iconAnchor: [13, 30]
      });

      const navUrl = getGoogleMapsNavigationUrl(place.lat, place.lng);
      const marker = L.marker([place.lat, place.lng], { icon: pinIcon });
      marker.bindPopup(`
        <div style="font-family:sans-serif; min-width:220px; color:#0f172a; padding:6px;">
          <div style="font-size:10px; font-weight:bold; color:#ea4335; text-transform:uppercase; letter-spacing:0.5px;">Google Maps Verified Location</div>
          <div style="font-weight:700; font-size:12px; margin-top:2px; line-height:1.3;">${place.formattedAddress}</div>
          <div style="font-size:11px; color:#64748b; margin-top:4px; font-family:monospace;">Coords: ${place.lat.toFixed(4)}° N, ${place.lng.toFixed(4)}° E</div>
          <a href="${navUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-top:8px; font-size:11px; background:#ea4335; color:white; padding:5px 10px; border-radius:6px; text-decoration:none; font-weight:bold;">Open in Google Maps →</a>
        </div>
      `).openPopup();
      sm.addLayer(marker);
    }
  };

  // Detect Current Precise GPS Location via Google Maps
  const handleDetectGPS = async () => {
    setIsLocatingUser(true);
    try {
      const loc = await detectCurrentLocationGoogle();
      handleSelectPlace({
        formattedAddress: loc.address,
        lat: loc.lat,
        lng: loc.lng,
        placeId: 'current-gps-loc'
      });
    } finally {
      setIsLocatingUser(false);
    }
  };

  // Live Map AI Spatial Analysis state
  const [spatialAnalysis, setSpatialAnalysis] = useState<MapSpatialAnalysis | null>(null);
  const [isAnalyzingMap, setIsAnalyzingMap] = useState<boolean>(false);
  const [showAiOverlay, setShowAiOverlay] = useState<boolean>(true);

  // Fetch AI Spatial Telemetry whenever selected zone or timeline changes
  useEffect(() => {
    let isCancelled = false;
    const currentZone = zones.find(z => z.id === activeSelectedZoneId) || zones[0];
    const blockedCount = roads.filter(r => r.status === 'blocked').length;

    setIsAnalyzingMap(true);
    generateMapSpatialIntelligence(currentZone, units.length, blockedCount)
      .then(analysis => {
        if (!isCancelled) {
          setSpatialAnalysis(analysis);
          setIsAnalyzingMap(false);
        }
      })
      .catch(() => {
        if (!isCancelled) setIsAnalyzingMap(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeSelectedZoneId, timelineStep, zones, units.length, roads]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [13.0500, 80.2300],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial Tile Layer
    const tileConf = getTileLayerConfig(tileMode);
    const tileLayer = L.tileLayer(tileConf.url, {
      maxZoom: tileConf.maxZoom,
      subdomains: tileConf.subdomains || 'abcd',
      attribution: tileConf.attribution
    }).addTo(map);
    currentTileLayerRef.current = tileLayer;

    // Initialize Layer Groups
    layerGroupsRef.current.zones = L.layerGroup().addTo(map);
    layerGroupsRef.current.spreadVector = L.layerGroup().addTo(map);
    layerGroupsRef.current.units = L.layerGroup().addTo(map);
    layerGroupsRef.current.infrastructure = L.layerGroup().addTo(map);
    layerGroupsRef.current.roads = L.layerGroup().addTo(map);
    layerGroupsRef.current.incidents = L.layerGroup().addTo(map);
    layerGroupsRef.current.searchMarker = L.layerGroup().addTo(map);
    layerGroupsRef.current.safeCitizens = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Tile Layer when tileMode changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const tileConf = getTileLayerConfig(tileMode);
    const tileLayer = L.tileLayer(tileConf.url, {
      maxZoom: tileConf.maxZoom,
      subdomains: tileConf.subdomains || 'abcd',
      attribution: tileConf.attribution
    }).addTo(map);
    tileLayer.bringToBack();
    currentTileLayerRef.current = tileLayer;
  }, [tileMode]);

  // Update Hazard Zones
  useEffect(() => {
    const lg = layerGroupsRef.current.zones;
    if (!lg) return;
    lg.clearLayers();

    if (!showZones) return;

    zones.forEach(zone => {
      const isCritical = zone.severity === 'CRITICAL';
      const isWarning = zone.severity === 'WARNING';
      const color = isCritical ? '#f43f5e' : isWarning ? '#f59e0b' : '#38bdf8';
      const fillColor = isCritical ? '#e11d48' : isWarning ? '#d97706' : '#0284c7';
      const fillOpacity = isCritical ? 0.35 : isWarning ? 0.25 : 0.15;

      const polygon = L.polygon(zone.polygon, {
        color: color,
        weight: isCritical ? 3 : 2,
        dashArray: isCritical ? undefined : '5, 5',
        fillColor: fillColor,
        fillOpacity: fillOpacity
      });

      polygon.on('click', () => {
        setActiveSelectedZoneId(zone.id);
      });

      polygon.bindPopup(`
        <div class="p-3 text-slate-100 min-w-[200px]">
          <div class="flex items-center justify-between pb-1.5 border-b border-slate-700/60 mb-2">
            <span class="font-bold text-xs text-rose-400 tracking-wider">${zone.name.toUpperCase()}</span>
            <span class="text-[11px] font-mono px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 font-bold">${zone.riskScore}% RISK</span>
          </div>
          <div class="space-y-1 text-xs text-slate-300">
            <div><span class="text-slate-400">Exposed Population:</span> <b class="text-white font-mono">${zone.exposedPopulation.toLocaleString()}</b></div>
            <div><span class="text-slate-400">Inundation Level:</span> <b class="text-cyan-300 font-mono">${zone.waterLevelMeters}m</b></div>
            <div><span class="text-slate-400">Predicted Peak:</span> <span class="text-amber-300">${zone.predictedPeakTime}</span></div>
          </div>
        </div>
      `);

      polygon.addTo(lg);
    });
  }, [zones, showZones, setActiveSelectedZoneId]);

  // Update From -> To Spread Vector
  useEffect(() => {
    const lg = layerGroupsRef.current.spreadVector;
    if (!lg) return;
    lg.clearLayers();

    if (!showSpread) return;

    // Vectors between Zone A -> Zone B -> Zone C
    const spreadLineCoords: [number, number][] = [
      [13.0420, 80.2210], // Zone A
      [13.0530, 80.2310], // Zone B
      [13.0610, 80.2440]  // Zone C
    ];

    const polyline = L.polyline(spreadLineCoords, {
      color: '#fb7185',
      weight: 3,
      dashArray: '8, 8',
      opacity: 0.85
    });

    polyline.addTo(lg);

    // Spread stage nodes
    const stages = [
      { coord: [13.0420, 80.2210], label: 'ORIGIN (Zone A)', time: 'NOW' },
      { coord: [13.0530, 80.2310], label: 'STAGE 1 (Zone B)', time: '+30m to +1h' },
      { coord: [13.0610, 80.2440], label: 'STAGE 2 (Zone C)', time: '+2h to +4h' }
    ];

    stages.forEach(stage => {
      const icon = L.divIcon({
        className: 'custom-spread-icon',
        html: `
          <div class="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/90 border border-rose-500/80 shadow-lg text-[10px] text-rose-300 whitespace-nowrap font-mono font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            <span>${stage.label} · ${stage.time}</span>
          </div>
        `,
        iconSize: [140, 24],
        iconAnchor: [70, 12]
      });

      L.marker(stage.coord as [number, number], { icon }).addTo(lg);
    });
  }, [showSpread, timelineStep]);

  // Update Roads & Bridges
  useEffect(() => {
    const lg = layerGroupsRef.current.roads;
    if (!lg) return;
    lg.clearLayers();

    if (!showRoads) return;

    roads.forEach(road => {
      const isBlocked = road.status === 'blocked';
      const isWaterlogged = road.status === 'waterlogged';
      const isClear = road.status === 'clear';

      const color = isBlocked ? '#e11d48' : isWaterlogged ? '#f59e0b' : '#10b981';
      const weight = isClear ? 4 : 3;

      const polyline = L.polyline(road.points, {
        color,
        weight,
        dashArray: isBlocked ? '6, 6' : undefined,
        opacity: isBlocked ? 0.9 : 0.8
      });

      polyline.bindPopup(`
        <div class="p-2.5 text-xs text-slate-100 min-w-[210px]">
          <div class="font-bold text-slate-200 mb-1 flex items-center justify-between">
            <span>${road.name}</span>
            <span class="text-[10px] uppercase font-mono px-1 py-0.5 rounded ${isClear ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}">${road.status}</span>
          </div>
          <p class="text-slate-300 text-[11px]">${road.detourAdvice || 'Traffic monitoring active.'}</p>
        </div>
      `);

      polyline.addTo(lg);
    });
  }, [roads, showRoads]);

  // Update Emergency Units (Ambulances, Fire, Boats)
  useEffect(() => {
    const lg = layerGroupsRef.current.units;
    if (!lg) return;
    lg.clearLayers();

    if (!showUnits) return;

    units.forEach(unit => {
      const isAmb = unit.type === 'ambulance';
      const isFire = unit.type === 'fire_engine';
      const emoji = isAmb ? '🚑' : isFire ? '🚒' : '🚤';
      const borderCol = unit.status === 'available' ? 'border-emerald-500' : unit.status === 'staging' ? 'border-amber-500' : 'border-blue-500';

      const icon = L.divIcon({
        className: 'custom-unit-icon',
        html: `
          <div class="w-8 h-8 rounded-full bg-slate-900 border-2 ${borderCol} flex items-center justify-center text-sm shadow-md transition-transform hover:scale-110">
            ${emoji}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(unit.location, { icon });
      marker.bindPopup(`
        <div class="p-3 text-xs text-slate-100 min-w-[220px]">
          <div class="font-bold text-sm text-slate-200 mb-1">${unit.callSign}</div>
          <div class="text-[11px] text-slate-400 mb-2">Status: <span class="capitalize font-mono font-semibold text-emerald-400">${unit.status}</span></div>
          <div class="text-[11px] text-slate-300 mb-1">Equipment: <span class="text-slate-400">${unit.equipment.join(', ')}</span></div>
          <div class="text-[11px] text-slate-300">Crew: <span class="font-mono">${unit.crewCount}</span> | Battery/Fuel: <span class="font-mono text-cyan-300">${unit.fuelBatteryPercent}%</span></div>
          ${unit.currentDestinationName ? `<div class="mt-1 text-[11px] text-amber-300 font-medium">Navigating: ${unit.currentDestinationName}</div>` : ''}
        </div>
      `);
      marker.addTo(lg);
    });
  }, [units, showUnits]);

  // Update Infrastructure (Hospitals & Shelters)
  useEffect(() => {
    const lg = layerGroupsRef.current.infrastructure;
    if (!lg) return;
    lg.clearLayers();

    if (!showInfra) return;

    // Hospitals
    hospitals.forEach(hosp => {
      const isOverload = hosp.status === 'critical_overload';
      const icon = L.divIcon({
        className: 'custom-hosp-icon',
        html: `
          <div class="w-8 h-8 rounded-lg bg-slate-900 border-2 ${isOverload ? 'border-rose-500' : 'border-sky-500'} flex items-center justify-center text-sm shadow-md">
            🏥
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(hosp.location, { icon });
      marker.bindPopup(`
        <div class="p-3 text-xs text-slate-100 min-w-[220px]">
          <div class="font-bold text-sm text-sky-300 mb-1">${hosp.name}</div>
          <div class="text-slate-300 space-y-1 text-[11px]">
            <div>Beds Occupied: <b class="font-mono text-white">${hosp.occupiedBeds} / ${hosp.totalBeds}</b></div>
            <div>ICU Occupancy: <b class="font-mono text-amber-300">${hosp.icuBedsOccupied} / ${hosp.icuBedsTotal}</b></div>
            <div>Predicted 4h Inflow: <b class="font-mono text-rose-300">+${hosp.predictedSurgeNext4h} patients</b></div>
          </div>
        </div>
      `);
      marker.addTo(lg);
    });

    // Shelters
    shelters.forEach(shelter => {
      const isFull = shelter.status === 'near_capacity' || shelter.status === 'overcrowded';
      const icon = L.divIcon({
        className: 'custom-shelter-icon',
        html: `
          <div class="w-8 h-8 rounded-lg bg-slate-900 border-2 ${isFull ? 'border-amber-500' : 'border-emerald-500'} flex items-center justify-center text-sm shadow-md">
            ⛺
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(shelter.location, { icon });
      marker.bindPopup(`
        <div class="p-3 text-xs text-slate-100 min-w-[220px]">
          <div class="font-bold text-sm text-emerald-300 mb-1">${shelter.name}</div>
          <div class="text-slate-300 space-y-1 text-[11px]">
            <div>Occupancy: <b class="font-mono text-white">${shelter.currentOccupancy} / ${shelter.totalCapacity}</b></div>
            <div>Water Kits in Stock: <b class="font-mono text-cyan-300">${shelter.waterKitsStock}</b></div>
            <div>Safe Access: <span class="text-slate-400">${shelter.safeAccessRoad}</span></div>
          </div>
        </div>
      `);
      marker.addTo(lg);
    });
  }, [hospitals, shelters, showInfra]);

  // Update SOS Incidents
  useEffect(() => {
    const lg = layerGroupsRef.current.incidents;
    if (!lg) return;
    lg.clearLayers();

    if (!showIncidents) return;

    incidents.forEach(inc => {
      const isCritical = inc.severity === 'CRITICAL';
      const icon = L.divIcon({
        className: 'custom-sos-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-7 h-7 rounded-full ${isCritical ? 'bg-rose-500/40 animate-ping' : 'bg-amber-500/40 animate-pulse'}"></span>
            <div class="w-7 h-7 rounded-full bg-slate-900 border-2 ${isCritical ? 'border-rose-500' : 'border-amber-500'} flex items-center justify-center text-xs shadow-lg">
              🚨
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(inc.location, { icon });
      marker.bindPopup(`
        <div class="p-3 text-xs text-slate-100 min-w-[240px]">
          <div class="flex items-center justify-between pb-1 border-b border-slate-700/60 mb-1.5">
            <span class="font-bold text-rose-400 font-mono text-[11px]">${inc.id.toUpperCase()} · ${inc.category.toUpperCase()}</span>
            <span class="text-[10px] font-mono px-1 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold">${inc.severity}</span>
          </div>
          <div class="font-medium text-slate-200 text-xs mb-1">${inc.userName} (${inc.peopleCount} pax)</div>
          <p class="text-slate-300 text-[11px] mb-2 italic">"${inc.message}"</p>
          <div class="text-[10px] text-slate-400 pt-1.5 border-t border-slate-800">
            Recommended: <span class="text-cyan-300">${inc.recommendedResponse}</span>
          </div>
        </div>
      `);
      marker.addTo(lg);
    });
  }, [incidents, showIncidents]);

  // Update Safe & Secure Citizens Layer (Specific Symbol for Safe & Secure in Command Service)
  useEffect(() => {
    const lg = layerGroupsRef.current.safeCitizens;
    if (!lg) return;
    lg.clearLayers();

    if (!showSafeCitizens) return;

    safeCheckIns.forEach(checkIn => {
      const icon = L.divIcon({
        className: 'custom-safe-secure-icon',
        html: `
          <div class="relative flex flex-col items-center justify-center cursor-pointer group" title="SAFE & SECURE CITIZEN CHECK-IN">
            <span class="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none"></span>
            <div class="w-8 h-8 rounded-full bg-slate-950 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.85)] text-sm font-bold transition-transform group-hover:scale-115">
              🛡️
            </div>
            <div class="mt-0.5 bg-emerald-950 text-emerald-200 border border-emerald-500/80 text-[8.5px] font-mono px-1.5 py-0.2 rounded-md shadow-lg whitespace-nowrap font-black tracking-wider uppercase">
              SAFE &amp; SECURE
            </div>
          </div>
        `,
        iconSize: [36, 46],
        iconAnchor: [18, 23]
      });

      const navUrl = getGoogleMapsNavigationUrl(checkIn.location[0], checkIn.location[1]);

      const marker = L.marker(checkIn.location, { icon });
      marker.bindPopup(`
        <div class="p-3 text-xs text-slate-100 min-w-[240px]">
          <div class="flex items-center justify-between pb-1.5 border-b border-emerald-800/60 mb-2">
            <span class="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
              <span class="text-sm">🛡️</span> SAFE &amp; SECURE
            </span>
            <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold uppercase tracking-wider">
              VERIFIED CITIZEN
            </span>
          </div>
          <div class="font-bold text-slate-100 text-sm mb-1">${checkIn.citizenName}</div>
          <div class="text-[11px] text-slate-300 mb-1">📍 ${checkIn.address}</div>
          ${checkIn.userPhone ? `<div class="text-[10px] text-slate-400 font-mono mb-1">📞 ${checkIn.userPhone}</div>` : ''}
          ${checkIn.notes ? `<div class="text-[11px] text-emerald-300/90 italic bg-emerald-950/40 p-1.5 rounded border border-emerald-900/50 mb-2">"${checkIn.notes}"</div>` : ''}
          <div class="text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 flex items-center justify-between">
            <span>Checked In: <b class="text-white font-mono">${checkIn.timestamp}</b></span>
            <a href="${navUrl}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 font-medium">Open in Maps ↗</a>
          </div>
        </div>
      `);
      marker.addTo(lg);
    });
  }, [safeCheckIns, showSafeCitizens]);

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-950 overflow-hidden select-none">
      {/* Map Surface */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Google Maps Location Search & Geocoding Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] w-full max-w-lg px-3 pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-1.5 flex items-center gap-2">
          <div className="flex items-center gap-1.5 pl-2.5 text-rose-500 shrink-0">
            <MapPin className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
              placeholder="Google Maps search address, sector, or landmark..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none py-1.5 pr-6 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSearchDropdown(false); }}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* GPS Locate Me Button */}
          <button
            onClick={handleDetectGPS}
            disabled={isLocatingUser}
            title="Detect precise GPS location with Google Maps"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] font-semibold transition-all border border-slate-700 shrink-0 disabled:opacity-50"
          >
            <Locate className={`w-3.5 h-3.5 ${isLocatingUser ? 'animate-spin text-rose-400' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline">{isLocatingUser ? 'Locating...' : 'GPS Detect'}</span>
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="mt-1.5 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-1 space-y-1 animate-in fade-in zoom-in-95">
            <div className="px-3 py-1 text-[10px] font-mono text-slate-400 flex items-center justify-between border-b border-slate-800">
              <span className="text-cyan-400 font-bold uppercase">Google Maps Geocoding Results</span>
              <span>{searchResults.length} found</span>
            </div>
            {searchResults.map((place, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPlace(place)}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800/90 text-xs text-slate-200 transition-colors flex items-start gap-2.5 group"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">{place.formattedAddress}</div>
                  <div className="text-[10px] font-mono text-slate-400">
                    GPS: {place.lat.toFixed(4)}°, {place.lng.toFixed(4)}°
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Quick Disaster Preset Jump Chips */}
        <div className="hidden sm:flex items-center gap-1.5 mt-2 px-1">
          <span className="text-[10px] font-mono text-slate-400">Jump to:</span>
          {[
            { label: 'Delta Basin (Zone A)', lat: 13.0465, lng: 80.2220, address: 'Delta Basin Sector 4B (Critical Risk)' },
            { label: 'Market (Zone B)', lat: 13.0550, lng: 80.2350, address: 'Central Market & Commercial Avenue (Zone B)' },
            { label: 'Relief Shelter', lat: 13.0640, lng: 80.2450, address: 'North High School Relief Complex' },
            { label: 'Trauma Hospital', lat: 13.0520, lng: 80.2400, address: 'District Memorial Emergency Trauma Hospital' }
          ].map((preset, i) => (
            <button
              key={i}
              onClick={() => handleSelectPlace({ formattedAddress: preset.address, lat: preset.lat, lng: preset.lng, placeId: `preset-${i}` })}
              className="px-2 py-0.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-[10px] font-medium text-slate-300 hover:text-white transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Tactical Layer Controls */}
      <div className="absolute top-4 left-4 z-[500] flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 shadow-2xl max-w-[230px]">
        <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-300 tracking-wider">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span>GIS LAYERS</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500">LIVE GIS</span>
        </div>

        <div className="space-y-1 text-xs">
          <button
            onClick={() => setShowZones(v => !v)}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${showZones ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
              <span>Disaster Impact Zones</span>
            </span>
            {showZones ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          <button
            onClick={() => setShowSpread(v => !v)}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${showSpread ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400 border border-dashed border-rose-300"></span>
              <span>Spread Vector (From→To)</span>
            </span>
            {showSpread ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          <button
            onClick={() => setShowUnits(v => !v)}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${showUnits ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="flex items-center gap-1.5">
              <span>🚑</span>
              <span>Emergency Units ({units.length})</span>
            </span>
            {showUnits ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          <button
            onClick={() => setShowRoads(v => !v)}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${showRoads ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-emerald-500 rounded"></span>
              <span>Roads & Corridors</span>
            </span>
            {showRoads ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          <button
            onClick={() => setShowInfra(v => !v)}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${showInfra ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="flex items-center gap-1.5">
              <span>🏥</span>
              <span>Hospitals & Shelters</span>
            </span>
            {showInfra ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          <button
            onClick={() => setShowIncidents(v => !v)}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${showIncidents ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="flex items-center gap-1.5">
              <span>🚨</span>
              <span>SOS Incidents ({incidents.length})</span>
            </span>
            {showIncidents ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          {/* Safe & Secure Citizen Roll-Call Layer with Specific Symbol */}
          <button
            onClick={() => setShowSafeCitizens(v => !v)}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
              showSafeCitizens ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-200' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>🛡️</span>
              <span className="font-semibold text-emerald-300">Safe & Secure ({safeCheckIns.length})</span>
            </span>
            {showSafeCitizens ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>
        </div>

        {/* Google Maps Imagery & Basemap Modes */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between px-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1 text-cyan-300">
              <Globe2 className="w-3 h-3" />
              <span>Google Maps Engine</span>
            </span>
            <span className="text-[9px] font-mono text-emerald-400">ACTIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <button
              onClick={() => setTileMode('google_hybrid')}
              className={`px-2 py-1 rounded font-medium text-left transition-colors ${
                tileMode === 'google_hybrid' 
                  ? 'bg-rose-600 text-white font-bold' 
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              🛰️ Hybrid Sat
            </button>

            <button
              onClick={() => setTileMode('google_terrain')}
              className={`px-2 py-1 rounded font-medium text-left transition-colors ${
                tileMode === 'google_terrain' 
                  ? 'bg-rose-600 text-white font-bold' 
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              ⛰️ Terrain
            </button>

            <button
              onClick={() => setTileMode('google_roadmap')}
              className={`px-2 py-1 rounded font-medium text-left transition-colors ${
                tileMode === 'google_roadmap' 
                  ? 'bg-rose-600 text-white font-bold' 
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              🗺️ Roadmap
            </button>

            <button
              onClick={() => setTileMode('tactical_dark')}
              className={`px-2 py-1 rounded font-medium text-left transition-colors ${
                tileMode === 'tactical_dark' 
                  ? 'bg-rose-600 text-white font-bold' 
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              🌑 Night Dark
            </button>
          </div>
        </div>
      </div>

      {/* From-To Spread Tracker Banner Overlay */}
      <div className="absolute top-4 right-4 z-[500] hidden md:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 shadow-xl">
        <Compass className="w-4 h-4 text-rose-400" />
        <div className="text-xs font-medium text-slate-300">
          <span className="text-rose-400 font-bold">FROM:</span> Zone A (Delta Basin)
          <span className="mx-1.5 text-slate-600">→</span>
          <span className="text-amber-400 font-bold">NEXT (+30m):</span> Zone B (Market)
          <span className="mx-1.5 text-slate-600">→</span>
          <span className="text-sky-400 font-bold">DOWNSTREAM:</span> Zone C
        </div>
      </div>

      {/* AI GIS Spatial Intelligence HUD (Powered by OpenRouter/Gemini API key) */}
      <div className="absolute bottom-4 left-4 z-[500] max-w-sm hidden sm:block">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="font-bold text-[11px] text-white tracking-wide uppercase font-mono">
                AI GIS Spatial Intelligence
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isAnalyzingMap && (
                <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
              )}
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 font-bold">
                {spatialAnalysis?.liveRiskRating || 'CRITICAL'} RISK
              </span>
              <button 
                onClick={() => setShowAiOverlay(v => !v)}
                className="text-slate-400 hover:text-white"
              >
                {showAiOverlay ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {showAiOverlay && spatialAnalysis && (
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <p className="leading-snug text-slate-200">
                {spatialAnalysis.strategicOverview}
              </p>

              <div className="pt-1 space-y-1">
                <div className="text-slate-400">
                  <span className="text-amber-400 font-semibold">Choke Points: </span>
                  <span className="text-slate-300">{spatialAnalysis.chokePoints.join(' · ')}</span>
                </div>

                <div className="text-slate-400">
                  <span className="text-emerald-400 font-semibold">Safe Route: </span>
                  <span className="text-slate-200">{spatialAnalysis.safeEvacuationCorridor}</span>
                </div>

                <div className="text-slate-400">
                  <span className="text-cyan-400 font-semibold">Staging Perimeter: </span>
                  <span className="text-slate-200 font-mono text-[10px]">{spatialAnalysis.recommendedStagingPerimeter}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
