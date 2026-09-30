import React, { useState } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { AlertTriangle, MapPin, Camera, CheckCircle2, X, Send, Locate } from 'lucide-react';
import { ManualAddressInput } from './ManualAddressInput';

export const HazardReportModal: React.FC = () => {
  const { reportHazard, setActiveModal, t } = useDisaster();

  const [category, setCategory] = useState('Flooded Street / Water Ingress');
  const [details, setDetails] = useState('');
  const [waterDepth, setWaterDepth] = useState('0.8m (Knee Deep)');
  const [submitted, setSubmitted] = useState(false);

  // Google Maps location
  const [coords, setCoords] = useState<[number, number]>([13.0470, 80.2230]);
  const [address, setAddress] = useState<string>('Delta Sector 4B, Near Riverbank');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportHazard(category, `${details} [Water Depth: ${waterDepth}] [Google Maps Tag: ${address}]`, coords);
    setSubmitted(true);
    setTimeout(() => {
      setActiveModal(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {t.reportHazard}
              </h3>
              <p className="text-[11px] text-slate-400">
                Crowdsourced Field Intelligence for Disaster Command
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

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto text-xs">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Hazard Report Logged</h4>
              <p className="text-slate-300 text-xs">
                Your report has been geotagged and added to the District Disaster Command GIS map. Thank you for protecting your community.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Hazard Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Flooded Street / Water Ingress">Flooded Street / Water Ingress</option>
                  <option value="Fallen Tree / Downed Power Line">Fallen Tree / Downed Power Line</option>
                  <option value="River Embankment Erosion">River Embankment Erosion / Breach</option>
                  <option value="Stranded Vehicle / Traffic Snarl">Stranded Vehicle / Traffic Snarl</option>
                  <option value="Building Structural Crack">Building Structural Crack / Collapse Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Estimated Water Depth</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Ankle Deep (<0.3m)', 'Knee Deep (~0.8m)', 'Waist Deep (>1.2m)'].map(d => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setWaterDepth(d)}
                      className={`p-2 rounded-xl border text-[11px] font-medium transition-colors ${
                        waterDepth === d 
                          ? 'bg-amber-950 border-amber-500 text-white font-semibold' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Description & Specific Landmarks</label>
                <textarea
                  required
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Tree collapsed across road near delta bridge ramp; 2 parked cars submerged..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Interactive Address & Geolocation with Manual Typing */}
              <ManualAddressInput
                currentAddress={address}
                currentCoords={coords}
                accentColor="amber"
                onLocationChange={(newAddr, newCoords) => {
                  setAddress(newAddr);
                  setCoords(newCoords);
                }}
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-white text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Field Hazard Report</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
