import React, { useState, useMemo } from "react";
import { Hotspot, ActiveScreen } from "../types";
import Globe from "./originkit/ui/globe";
import { 
  Flame, 
  Play, 
  Pause, 
  Plus, 
  Minus, 
  Compass, 
  ArrowRight, 
  Radio, 
  MapPin, 
  Layers, 
  Sparkles, 
  ChevronRight
} from "lucide-react";

interface HomeProps {
  hotspots: Hotspot[];
  setActiveScreen: (screen: ActiveScreen) => void;
  setSelectedHotspot: (hotspot: Hotspot) => void;
  modelMode?: "local" | "cloud";
  theme?: "light" | "dark";
}

function parseCoordinates(coordStr: string): { lat: number; lng: number } {
  if (!coordStr) return { lat: 20.5937, lng: 78.9629 };
  const latMatch = coordStr.match(/([\d.]+)\s*°?\s*([NS])/i);
  const lngMatch = coordStr.match(/([\d.]+)\s*°?\s*([EW])/i);
  let lat = 20.5937;
  let lng = 78.9629;
  if (latMatch) {
    lat = parseFloat(latMatch[1]) * (latMatch[2].toUpperCase() === "S" ? -1 : 1);
  }
  if (lngMatch) {
    lng = parseFloat(lngMatch[1]) * (lngMatch[2].toUpperCase() === "W" ? -1 : 1);
  }
  return { lat, lng };
}

export default function Home({
  hotspots,
  setActiveScreen,
  setSelectedHotspot
}: HomeProps) {
  // Visual mode: 'globe' (Originkit 3D Earth) or 'aerial' (Tactical Facility Map)
  const [viewMode, setViewMode] = useState<"globe" | "aerial">("globe");

  // Scrubber controls for aerial view
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeRange, setTimeRange] = useState<"1H" | "6H" | "24H" | "7D">("6H");
  const [scrubberValue, setScrubberValue] = useState(72);
  const [zoomLevel, setZoomLevel] = useState(1);

  const defaultFallback: Hotspot = {
    id: "EVT-20260903-0042",
    name: "Paradip Coastal Petrochemical Enclave",
    region: "Odisha Industrial Corridor",
    coordinates: "20.1234° N, 85.7654° E",
    priority: "HIGH-ASSET",
    severity: "CRITICAL",
    riskScore: 78.4,
    detectedAt: "2026-09-03 14:18:22 UTC",
    meanFRP: 342.0,
    peakFRP: 418.5,
    distanceToAsset: "412m",
    assetType: "Hydrocarbon Refining",
    osmIdentifier: "way/94827104",
    roadAccess: "120m (SH-12 Link)",
    nearestFireStation: "4.2 km (Paradip Port)",
    terrainCover: "Hardened Asphalt / Metal",
    activeFlameProb: 98,
    refineryProximityProb: 88.5,
    persistenceIndex: 72.0,
    detections30d: 18,
    detections90d: 47,
    trend30d: "+12.3 MW/wk",
    sensors: ["VIIRS-FRP", "OSM-GEO", "SENTINEL-L2A"],
    ndvi: -0.18,
    nbr: 0.74,
    ndmi: 0.42,
    swirNir: 2.81,
    formula: "0.45(P_fire) + 0.35(P_ind) + 0.20(P_pers) = 78.4",
    defaultSummary: "High-intensity industrial fire detected in coastal petrochemical facility.",
    recommendation: "Immediate emergency suppression dispatch."
  };

  const activeHeroHotspot: Hotspot =
    hotspots.find((h) => h.severity === "CRITICAL" || h.severity === "HIGH RISK") ||
    hotspots[0] ||
    defaultFallback;

  const handleViewDetails = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setActiveScreen("active-investigations");
  };

  // Convert hotspots to 3D globe coordinates (memoized to avoid re-renders)
  const hotspotMarkers = useMemo(
    () => hotspots.map((h) => parseCoordinates(h.coordinates)),
    [hotspots]
  );

  const memoizedDots = useMemo(() => ({
    color: "#38bdf8",
    size: 4,
    density: 8,
    allDots: false
  }), []);

  const memoizedMarkerConfig = useMemo(() => ({
    markers: hotspotMarkers,
    color: "#f43f5e",
    size: 45
  }), [hotspotMarkers]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col select-none bg-transparent text-white">

      {/* ========================================================================= */}
      {/* VIEW 1: ORIGINKIT 3D INTERACTIVE GLOBE WITH UNIFIED DARK THEME */}
      {/* ========================================================================= */}
      {viewMode === "globe" && (
        <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
          
          {/* Subtle Ambient Nebula Background */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(14, 165, 233, 0.12) 0%, rgba(6, 11, 22, 0.3) 60%, transparent 100%)"
            }}
          />

          {/* Central 3D Originkit Globe Container - Cleanly Sized with Zero Overlaps */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="w-full h-full max-w-[850px] max-h-[640px] flex items-center justify-center">
              <Globe
                speed={1.6}
                smoothing={8}
                dots={memoizedDots}
                scale={7.5}
                oceanColor="#060b18"
                outlineColor="#0ea5e9"
                showOutline={true}
                outlineWidth={1}
                graticuleColor="rgba(56, 189, 248, 0.12)"
                showGrid={true}
                dragSpeed={5}
                stopOnHover={true}
                initialLatitude={22}
                initialLongitude={79}
                markerConfig={memoizedMarkerConfig}
              />
            </div>
          </div>

          {/* ===================================================================== */}
          {/* UI CONTENT OVERLAY — ENGINEERED FOR ZERO OVERLAPS WITH GLOBE */}
          {/* ===================================================================== */}
          
          {/* Bottom Row: Left 3 Metric Cards + Center Hotspot Quick Select + Right Legend */}
          <div className="relative z-30 px-6 sm:px-10 pb-6 flex flex-col sm:flex-row items-end justify-between gap-4 pointer-events-none">
            
            {/* Left 3 Floating Metric Cards */}
            <div className="flex flex-col gap-2.5 w-full sm:w-64 pointer-events-auto">
              
              {/* Card 1: Satellites Monitored */}
              <div className="p-3 rounded-2xl bg-[#0f172a]/90 hover:bg-[#141d33] border border-[#1e2c4a] backdrop-blur-md shadow-lg flex items-center gap-3 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#38bdf8] shrink-0">
                  <Radio className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400">
                    Satellites Monitored
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-bold text-white">12</span>
                    <span className="text-[10px] font-semibold text-emerald-400">↑ 2 active</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Regions Scanned */}
              <div className="p-3 rounded-2xl bg-[#0f172a]/90 hover:bg-[#141d33] border border-[#1e2c4a] backdrop-blur-md shadow-lg flex items-center gap-3 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400">
                    Regions Scanned
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-bold text-white">245</span>
                    <span className="text-[10px] font-semibold text-emerald-400">↑ 12%</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Potential Fire Detections */}
              <div className="p-3 rounded-2xl bg-[#0f172a]/90 hover:bg-[#141d33] border border-[#1e2c4a] backdrop-blur-md shadow-lg flex items-center gap-3 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <Flame className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-400">
                    Potential Fire Detections
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-bold text-white">3</span>
                    <span className="text-[10px] font-semibold text-rose-400">↑ 2 critical</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Quick Hotspot Jump Buttons */}
            <div className="hidden lg:flex items-center gap-2 p-1.5 rounded-2xl bg-[#0b101d]/90 border border-[#1e2c4a] backdrop-blur-md shadow-lg pointer-events-auto">
              <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
                Focus Target:
              </span>
              {hotspots.slice(0, 3).map((h) => (
                <button
                  key={h.id}
                  onClick={() => handleViewDetails(h)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    h.severity === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                      : "bg-[#141d33] text-slate-300 border border-[#1e2c4a] hover:bg-[#1a2642]"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${h.severity === "CRITICAL" ? "bg-rose-500 animate-ping" : "bg-amber-400"}`} />
                  <span>{h.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            {/* Bottom-Right Section: Active Alerts (Positioned Down) + Legend Card */}
            <div className="flex flex-col gap-2.5 items-end pointer-events-auto">
              {/* Active Alerts Pill Card - Positioned More Down */}
              <div 
                onClick={() => setActiveScreen("active-investigations")}
                className="w-full sm:w-auto p-3 px-4 rounded-2xl bg-[#0f172a]/95 hover:bg-[#141f38] border border-rose-500/40 backdrop-blur-md shadow-xl flex items-center gap-3.5 transition-all hover:scale-102 cursor-pointer pointer-events-auto shrink-0"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                  <Flame className="h-4.5 w-4.5 fill-rose-500" />
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-semibold text-slate-400 leading-none">
                    Active Alerts
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-white leading-none">
                      3
                    </span>
                    <span className="text-[10px] font-medium text-rose-400 flex items-center gap-0.5">
                      +2 since last hour <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom-Right Legend Card */}
              <div className="hidden sm:flex flex-col gap-2 p-3 rounded-2xl bg-[#0f172a]/90 border border-[#1e2c4a] backdrop-blur-md shadow-lg text-xs pointer-events-auto">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Spectral Classification
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                  <span className="text-slate-200 font-medium text-[11px]">Active Fire (VIIRS FRP &gt; 150MW)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  <span className="text-slate-200 font-medium text-[11px]">Thermal Anomaly (SWIR Alert)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  <span className="text-slate-200 font-medium text-[11px]">Monitored Enclave (Sentinel-2)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: INDUSTRIAL AERIAL VIEW (Tactical High-Res Incident Facility View) */}
      {/* ========================================================================= */}
      {viewMode === "aerial" && (
        <div className="relative w-full h-full bg-[#080d19] flex items-center justify-center overflow-hidden">
          
          <div 
            className="absolute inset-0 transition-transform duration-500 ease-out flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Photorealistic Aerial Facility Scene */}
            <div className="relative w-[1400px] h-[900px] max-w-none shrink-0 shadow-2xl overflow-hidden">
              <img 
                src="/live_map_facility.jpg" 
                alt="Industrial Facility Aerial View" 
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />

              {/* Animated Radar Sweep Beam */}
              <div className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-cyan-400/15 to-cyan-400/40 border-b border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.7)] pointer-events-none animate-radar-sweep" />

              {/* Animated Billowing Heat Distortion & Flame Aura */}
              <div 
                className="absolute pointer-events-none animate-heat-distort"
                style={{
                  top: "33%",
                  left: "44%",
                  width: "22%",
                  height: "22%",
                  background: "radial-gradient(circle at 40% 60%, rgba(255, 68, 0, 0.4) 0%, rgba(249, 115, 22, 0.25) 35%, rgba(0,0,0,0) 70%)",
                  filter: "blur(14px)"
                }}
              />

              {/* Pulsing Thermal Radiance Core */}
              <div 
                className="absolute pointer-events-none animate-thermal-pulse"
                style={{
                  top: "38%",
                  left: "44%",
                  width: "16%",
                  height: "17%",
                  background: "radial-gradient(circle, rgba(239, 68, 68, 0.8) 0%, rgba(245, 158, 11, 0.5) 45%, rgba(59, 130, 246, 0.2) 75%, transparent 100%)",
                  filter: "blur(12px)"
                }}
              />

              {/* Target Bounding Box Reticle */}
              <div 
                onClick={() => handleViewDetails(activeHeroHotspot)}
                className="absolute z-20 cursor-pointer group"
                style={{
                  top: "41%",
                  left: "42.5%",
                  width: "15%",
                  height: "15.5%"
                }}
              >
                {/* Tactical Bounding Box Border with Laser Glow */}
                <div className="absolute inset-0 border-2 border-rose-500/90 rounded-sm shadow-[0_0_25px_rgba(244,63,94,0.7)] animate-laser-bracket" />

                {/* 4 Corner L-Brackets */}
                <span className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-white" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-white" />
                <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-white" />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-white" />

                {/* Pulsing Beacon in Center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-8 h-8 rounded-full bg-rose-500/40 animate-ping" />
                    <span className="absolute w-12 h-12 rounded-full bg-orange-500/25 animate-pulse" />
                    <div className="w-8 h-8 rounded-full bg-rose-600 border border-white/80 shadow-md flex items-center justify-center text-white">
                      <Flame className="h-4.5 w-4.5 fill-white animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* In-Canvas Target Label Pill */}
          <div 
            onClick={() => handleViewDetails(activeHeroHotspot)}
            className="absolute top-[32%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0b101d]/90 border border-rose-500/80 backdrop-blur-md shadow-lg shadow-rose-950/40 group-hover:scale-105 transition-transform">
              <div className="w-5 h-5 rounded-md bg-rose-500 flex items-center justify-center animate-pulse">
                <Flame className="h-3.5 w-3.5 text-white fill-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-none">
                  Fire Detected
                </span>
                <span className="text-[10px] text-slate-300 leading-none mt-1">
                  Confidence: {activeHeroHotspot.activeFlameProb || 98}%
                </span>
              </div>
            </div>
          </div>

          {/* Floating Detected Fire Card in Aerial Mode - Positioned Down */}
          <div className="absolute top-20 right-6 z-20 w-72 sm:w-80">
            <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-[#1c2944] backdrop-blur-md shadow-xl text-white">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-rose-700 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                  <Flame className="h-6 w-6 text-white fill-white/80 animate-pulse" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-tight">Detected Fire</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                      High Priority
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 truncate">
                    {activeHeroHotspot.name}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col gap-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold text-white">{activeHeroHotspot.coordinates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Source:</span>
                  <span className="font-semibold text-white">NASA FIRMS (Satellite)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="font-bold text-rose-400">{activeHeroHotspot.activeFlameProb || 98}%</span>
                </div>
              </div>

              <button
                onClick={() => handleViewDetails(activeHeroHotspot)}
                className="mt-3 w-full h-8 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Bottom Timeline Scrubber */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-2xl">
            <div className="px-4 py-2.5 rounded-2xl bg-[#0b101d]/90 border border-[#1b2742] backdrop-blur-md shadow-xl flex items-center gap-3 text-white">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-[#141d33] hover:bg-[#1e2c4d] text-white transition-colors cursor-pointer"
                title={isPlaying ? "Pause Timeline" : "Play Timeline"}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-white" />}
              </button>

              <div className="flex items-center gap-1.5 shrink-0 pl-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-slate-200">Live</span>
              </div>

              <div className="flex-1 relative flex items-center px-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scrubberValue}
                  onChange={(e) => setScrubberValue(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#10172a] p-0.5 rounded-xl border border-[#1b2742]">
                {(["1H", "6H", "24H", "7D"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      timeRange === t ? "bg-[#2563eb] text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom-Right Compass & Zoom */}
          <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0b101d]/90 border border-[#1b2742] backdrop-blur-md flex items-center justify-center text-slate-300 shadow-md">
              <Compass className="h-5 w-5 text-slate-300" />
            </div>

            <div className="flex flex-col rounded-xl bg-[#0b101d]/90 border border-[#1b2742] backdrop-blur-md overflow-hidden shadow-md">
              <button
                onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8))}
                className="p-2 text-slate-300 hover:text-white hover:bg-[#141d33] transition-colors cursor-pointer border-b border-[#1b2742]"
                title="Zoom In"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))}
                className="p-2 text-slate-300 hover:text-white hover:bg-[#141d33] transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
