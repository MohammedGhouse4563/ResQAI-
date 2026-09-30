/**
 * Google Maps Platform API & Geolocation Service for ResQAI
 * Configured with user-provided Google Maps Key: AIzaSyAPygejsQhhZQ6HKbNfD1Nd2JZmFG9uc5Y
 */

const DEFAULT_MAPS_KEY = 'AIzaSyAPygejsQhhZQ6HKbNfD1Nd2JZmFG9uc5Y';

export function getGoogleMapsApiKey(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('resqai_google_maps_key');
    if (custom && custom.trim()) return custom.trim();
  }
  return (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || DEFAULT_MAPS_KEY;
}

export function setGoogleMapsApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('resqai_google_maps_key', key.trim());
  }
}

export type MapTileMode = 'google_hybrid' | 'google_roadmap' | 'google_terrain' | 'tactical_dark';

export interface TileLayerConfig {
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string;
}

export function getTileLayerConfig(mode: MapTileMode): TileLayerConfig {
  const key = getGoogleMapsApiKey();

  switch (mode) {
    case 'google_hybrid':
      // Google Hybrid satellite + roads layer
      return {
        url: `https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${key}`,
        subdomains: '0123',
        maxZoom: 20,
        attribution: 'Map data & imagery © Google'
      };

    case 'google_terrain':
      // Google Terrain with elevation contours
      return {
        url: `https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&key=${key}`,
        subdomains: '0123',
        maxZoom: 20,
        attribution: 'Map data © Google'
      };

    case 'google_roadmap':
      // Google Vector Roadmap
      return {
        url: `https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${key}`,
        subdomains: '0123',
        maxZoom: 20,
        attribution: 'Map data © Google'
      };

    case 'tactical_dark':
    default:
      // High-contrast tactical dark basemap
      return {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        subdomains: 'abcd',
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors, © CARTO'
      };
  }
}

export interface GeocodedPlace {
  formattedAddress: string;
  lat: number;
  lng: number;
  placeId: string;
  name?: string;
}

/**
 * Reverse Geocode coordinates to a verified real-world location address using Google Maps Geocoding API
 */
export async function reverseGeocodeGoogle(lat: number, lng: number): Promise<string> {
  const key = getGoogleMapsApiKey();
  try {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
    }
  } catch (err) {
    console.warn('Google reverse geocode fallback:', err);
  }
  return `Sector Location [${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E]`;
}

/**
 * Search multiple locations via Google Geocoding API
 */
export async function searchLocationsGoogle(query: string): Promise<GeocodedPlace[]> {
  const key = getGoogleMapsApiKey();
  if (!query || query.trim().length < 2) return [];

  try {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${key}`);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results.slice(0, 5).map((r: any) => ({
          formattedAddress: r.formatted_address,
          lat: r.geometry.location.lat,
          lng: r.geometry.location.lng,
          placeId: r.place_id
        }));
      }
    }
  } catch (err) {
    console.warn('Google location search fallback:', err);
  }

  // Fallback preset landmarks if network/CORS occurs
  const presets: Record<string, GeocodedPlace> = {
    'delta': { formattedAddress: 'Delta Basin Sector 4B, River Enclave', lat: 13.0465, lng: 80.2220, placeId: 'pre-1' },
    'market': { formattedAddress: 'Central Market & Commercial Avenue, Zone B', lat: 13.0550, lng: 80.2350, placeId: 'pre-2' },
    'shelter': { formattedAddress: 'North High School Relief Complex, Safe Zone C', lat: 13.0640, lng: 80.2450, placeId: 'pre-3' },
    'hospital': { formattedAddress: 'District Memorial Emergency Trauma Hospital', lat: 13.0520, lng: 80.2400, placeId: 'pre-4' },
    'bridge': { formattedAddress: 'Apex River Bridge & Embankment Sluice', lat: 13.0490, lng: 80.2280, placeId: 'pre-5' },
    'chennai': { formattedAddress: 'Chennai Central Station Corridor, Tamil Nadu', lat: 13.0827, lng: 80.2707, placeId: 'pre-6' }
  };

  const lower = query.toLowerCase();
  const matched = Object.entries(presets).filter(([k]) => lower.includes(k));
  if (matched.length > 0) {
    return matched.map(([, v]) => v);
  }

  return [];
}

/**
 * Single location lookup helper
 */
export async function searchLocationGoogle(query: string): Promise<GeocodedPlace | null> {
  const results = await searchLocationsGoogle(query);
  return results.length > 0 ? results[0] : null;
}

/**
 * Detect user's current GPS location and reverse geocode with Google Maps
 */
export function detectCurrentLocationGoogle(): Promise<{ lat: number; lng: number; address: string }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve({
        lat: 13.0465,
        lng: 80.2220,
        address: 'Delta Enclave Sector 4B (Simulated GPS)'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const address = await reverseGeocodeGoogle(lat, lng);
        resolve({ lat, lng, address });
      },
      () => {
        // Fallback to active hazard zone center
        resolve({
          lat: 13.0465,
          lng: 80.2220,
          address: 'Sector 4B, Delta Enclave (Emergency Beacon Tag)'
        });
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  });
}

/**
 * Google Maps Navigation URL generator for citizen turn-by-turn routing
 */
export function getGoogleMapsNavigationUrl(destLat: number, destLng: number, originLat?: number, originLng?: number): string {
  if (originLat && originLng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=walking`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=walking`;
}

/**
 * Google Street View static preview image generator
 */
export function getGoogleStreetViewUrl(lat: number, lng: number): string {
  const key = getGoogleMapsApiKey();
  return `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${lat},${lng}&fov=90&heading=0&pitch=0&key=${key}`;
}
