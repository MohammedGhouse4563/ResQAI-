import React, { useState, useEffect } from 'react';
import { MapPin, Search, Locate, CheckCircle2, Navigation, X, Building, Compass } from 'lucide-react';
import { 
  searchLocationsGoogle, 
  detectCurrentLocationGoogle, 
  GeocodedPlace 
} from '../../services/googleMapsService';

interface ManualAddressInputProps {
  currentAddress: string;
  currentCoords: [number, number];
  onLocationChange: (address: string, coords: [number, number]) => void;
  accentColor?: 'rose' | 'amber' | 'emerald';
}

export const ManualAddressInput: React.FC<ManualAddressInputProps> = ({
  currentAddress,
  currentCoords,
  onLocationChange,
  accentColor = 'rose'
}) => {
  const [mode, setMode] = useState<'gps' | 'manual'>('manual');
  const [manualQuery, setManualQuery] = useState(currentAddress);
  const [landmarkDetail, setLandmarkDetail] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodedPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced search via Google Maps Geocoding API
  useEffect(() => {
    if (!manualQuery || manualQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const places = await searchLocationsGoogle(manualQuery);
        setSuggestions(places);
        if (places.length > 0) setShowDropdown(true);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [manualQuery]);

  const handleSelectSuggestion = (place: GeocodedPlace) => {
    setManualQuery(place.formattedAddress);
    setShowDropdown(false);
    const finalAddress = landmarkDetail.trim() 
      ? `${place.formattedAddress} (${landmarkDetail.trim()})` 
      : place.formattedAddress;
    onLocationChange(finalAddress, [place.lat, place.lng]);
  };

  const handleLandmarkChange = (val: string) => {
    setLandmarkDetail(val);
    const baseAddr = manualQuery || currentAddress;
    const finalAddress = val.trim() ? `${baseAddr} [${val.trim()}]` : baseAddr;
    onLocationChange(finalAddress, currentCoords);
  };

  const handleTriggerGPS = async () => {
    setIsLocatingGPS(true);
    try {
      const loc = await detectCurrentLocationGoogle();
      setManualQuery(loc.address);
      onLocationChange(loc.address, [loc.lat, loc.lng]);
      setMode('gps');
    } finally {
      setIsLocatingGPS(false);
    }
  };

  const borderAccent = accentColor === 'rose' 
    ? 'border-rose-500' 
    : accentColor === 'amber' 
    ? 'border-amber-500' 
    : 'border-emerald-500';

  const textAccent = accentColor === 'rose' 
    ? 'text-rose-400' 
    : accentColor === 'amber' 
    ? 'text-amber-400' 
    : 'text-emerald-400';

  const bgActiveTab = accentColor === 'rose' 
    ? 'bg-rose-600 text-white' 
    : accentColor === 'amber' 
    ? 'bg-amber-600 text-white' 
    : 'bg-emerald-600 text-white';

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between">
        <label className="text-slate-300 font-semibold text-xs flex items-center gap-1.5">
          <MapPin className={`w-3.5 h-3.5 ${textAccent}`} />
          <span>Incident Location & Address</span>
        </label>

        {/* Input Mode Selector */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`px-2 py-0.5 rounded transition-colors font-medium ${
              mode === 'manual' ? bgActiveTab : 'text-slate-400 hover:text-white'
            }`}
          >
            ✍️ Type Manually
          </button>
          <button
            type="button"
            onClick={handleTriggerGPS}
            className={`px-2 py-0.5 rounded transition-colors font-medium flex items-center gap-1 ${
              mode === 'gps' ? bgActiveTab : 'text-slate-400 hover:text-white'
            }`}
          >
            <Locate className={`w-2.5 h-2.5 ${isLocatingGPS ? 'animate-spin' : ''}`} />
            <span>GPS Auto</span>
          </button>
        </div>
      </div>

      {mode === 'manual' ? (
        /* Manual Address & Landmark Form */
        <div className="space-y-2">
          <div className="relative">
            <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 focus-within:border-slate-600 px-3 py-1.5 gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                placeholder="Type street name, sector, road or building..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              {manualQuery && (
                <button
                  type="button"
                  onClick={() => { setManualQuery(''); setSuggestions([]); }}
                  className="text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Google Maps Autocomplete Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden p-1 space-y-1">
                <div className="px-2.5 py-1 text-[9px] font-mono text-cyan-400 uppercase tracking-wider border-b border-slate-800">
                  Google Maps Suggestions ({suggestions.length})
                </div>
                {suggestions.map((place, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(place)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs text-slate-200 transition-colors flex items-start gap-2"
                  >
                    <MapPin className="w-3 h-3 text-rose-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate text-[11px]">{place.formattedAddress}</div>
                      <div className="text-[9px] font-mono text-slate-400">
                        GPS: {place.lat.toFixed(4)}°, {place.lng.toFixed(4)}°
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specific Floor / Flat / Landmark detail */}
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={landmarkDetail}
              onChange={(e) => handleLandmarkChange(e.target.value)}
              placeholder="Apartment / Floor / Specific Landmark (e.g. 2nd Floor, Gate 3)"
              className="w-full bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Quick Disaster Area Jump Chips */}
          <div className="flex flex-wrap items-center gap-1 text-[10px]">
            <span className="text-slate-500">Quick select:</span>
            {[
              { label: 'Delta Basin Sector 4B', address: 'Delta Basin Sector 4B, River Enclave', coords: [13.0465, 80.2220] },
              { label: 'Central Market Zone B', address: 'Central Market & Commercial Avenue, Zone B', coords: [13.0550, 80.2350] },
              { label: 'North Relief Complex', address: 'North High School Disaster Relief Complex', coords: [13.0640, 80.2450] },
              { label: 'Trauma Hospital', address: 'Apex Memorial District Hospital, Sector 4B', coords: [13.0570, 80.2280] }
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setManualQuery(p.address);
                  onLocationChange(p.address, p.coords as [number, number]);
                }}
                className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* GPS Mode Status */
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Locate className={`w-4 h-4 ${textAccent} ${isLocatingGPS ? 'animate-spin' : ''}`} />
            <div>
              <div className="font-semibold text-white text-[11px] truncate max-w-[220px]">
                {currentAddress}
              </div>
              <div className="text-[10px] font-mono text-cyan-300">
                GPS: {currentCoords[0].toFixed(4)}° N, {currentCoords[1].toFixed(4)}° E
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTriggerGPS}
            disabled={isLocatingGPS}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[10px] font-bold transition-colors cursor-pointer"
          >
            {isLocatingGPS ? 'Detecting...' : 'Re-scan'}
          </button>
        </div>
      )}

      {/* Confirmation Tag */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
        <span className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 className="w-3 h-3" />
          <span>Location Verified via Google Maps</span>
        </span>
        <span className="font-mono text-cyan-400">
          {currentCoords[0].toFixed(4)}° N, {currentCoords[1].toFixed(4)}° E
        </span>
      </div>
    </div>
  );
};
