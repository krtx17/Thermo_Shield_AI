import React, { useState, useMemo, useEffect, useRef } from "react";
import { Hotspot, ActiveScreen } from "../types";
import { 
  Flame, 
  Search, 
  Download, 
  ArrowRight, 
  Plus, 
  Minus, 
  Compass, 
  Check, 
  GitCompare,
  SlidersHorizontal,
  Radio,
  Wind,
  Activity,
  Crosshair,
  Maximize2
} from "lucide-react";

interface CommandCenterProps {
  hotspots: Hotspot[];
  selectedHotspot: Hotspot;
  setSelectedHotspot: (hotspot: Hotspot) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  setCompareAId: (id: string) => void;
  setCompareBId: (id: string) => void;
}

export default function CommandCenter({
  hotspots,
  selectedHotspot,
  setSelectedHotspot,
  setActiveScreen,
  setCompareAId,
  setCompareBId
}: CommandCenterProps) {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  // Layer toggles
  const [activeOverlays, setActiveOverlays] = useState<string[]>([
    "Thermal", 
    "AI Reticle", 
    "Radar Scan", 
    "Telemetry"
  ]);

  // Interactive Pan & Zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Live ticking telemetry
  const [utcTime, setUtcTime] = useState("");
  const [frpFlux, setFrpFlux] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Subtle real-time thermal fluctuation
    const fluxInterval = setInterval(() => {
      setFrpFlux((Math.random() - 0.5) * 3.5);
    }, 2000);
    return () => clearInterval(fluxInterval);
  }, []);

  // Filtered hotspots
  const filteredHotspots = useMemo(() => {
    return hotspots.filter((h) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          h.name.toLowerCase().includes(q) ||
          h.region.toLowerCase().includes(q) ||
          h.id.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (selectedSeverity !== "ALL") {
        if (selectedSeverity === "CRITICAL" && h.severity !== "CRITICAL") return false;
        if (selectedSeverity === "HIGH" && h.severity !== "HIGH RISK" && h.severity !== "CRITICAL") return false;
        if (selectedSeverity === "MODERATE" && h.severity !== "MODERATE") return false;
        if (selectedSeverity === "MONITORED" && h.severity !== "MONITORED") return false;
      }

      return true;
    });
  }, [hotspots, searchQuery, selectedSeverity]);

  // Pan interaction handlers (mouse & touch)
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      panX: pan.x,
      panY: pan.y
    };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    // Bound panning range based on zoom level
    const maxPan = 220 * zoomLevel;
    const newX = Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.panX + dx));
    const newY = Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.panY + dy));
    setPan({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setPan({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  const handleFocusOnTarget = () => {
    setPan({ x: 0, y: 0 });
    setZoomLevel(1.4);
  };

  // Download GeoJSON
  const handleExportGeoJSON = () => {
    const geojson = {
      type: "FeatureCollection",
      features: filteredHotspots.map(h => {
        const coords = h.coordinates.split(",").map(c => parseFloat(c.replace(/[^0-9.-]/g, "")));
        return {
          type: "Feature",
          properties: {
            id: h.id,
            name: h.name,
            severity: h.severity,
            riskScore: h.riskScore,
            detectedAt: h.detectedAt
          },
          geometry: {
            type: "Point",
            coordinates: [coords[1] || 77.2090, coords[0] || 28.6139]
          }
        };
      })
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `firesight_live_map_${new Date().toISOString().slice(0, 10)}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenIncident = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setActiveScreen("active-investigations");
  };

  const handleCompare = (hotspot: Hotspot) => {
    setCompareAId(selectedHotspot.id);
    setCompareBId(hotspot.id);
    setActiveScreen("risk-comparison");
  };

  const toggleOverlay = (layer: string) => {
    setActiveOverlays(prev => 
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  // Target coordinates in the aerial image
  const targetIncident = hotspots.find(h => h.severity === "CRITICAL" || h.severity === "HIGH RISK") || selectedHotspot;
  const secondaryTank = hotspots.find(h => h.id.includes("0089")) || hotspots[1] || selectedHotspot;
  const tertiaryCluster = hotspots.find(h => h.id.includes("0031")) || hotspots[2] || selectedHotspot;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col lg:flex-row bg-[#080d19] text-white select-none">
      
      {/* ========================================================================= */}
      {/* MAIN WORKABLE ANIMATED LIVE MAP CANVAS */}
      {/* ========================================================================= */}
      <div 
        ref={mapContainerRef}
        className="relative flex-1 h-[60vh] lg:h-full overflow-hidden flex items-center justify-center bg-[#050914] cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handlePointerUp}
      >
        
        {/* Top Floating Controls Bar */}
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2 pointer-events-auto">
          {/* Layer toggles */}
          <div className="p-1 rounded-xl bg-[#0b101d]/90 border border-[#1e2c4a] backdrop-blur-md flex items-center gap-1 shadow-lg">
            {["Thermal", "AI Reticle", "Radar Scan", "Telemetry"].map((layer) => {
              const active = activeOverlays.includes(layer);
              return (
                <button
                  key={layer}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOverlay(layer);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active 
                      ? "bg-[#2563eb] text-white shadow-xs" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {layer}
                </button>
              );
            })}
          </div>

          {/* Filter Popover Toggle */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFilterMenuOpen(!filterMenuOpen);
              }}
              className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer shadow-lg ${
                selectedSeverity !== "ALL"
                  ? "bg-[#2563eb] border-[#2563eb] text-white"
                  : "bg-[#0b101d]/90 border-[#1e2c4a] text-slate-300 hover:text-white"
              }`}
              title="Filter by severity"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            {filterMenuOpen && (
              <div 
                className="absolute top-full left-0 mt-2 w-48 p-2 rounded-xl bg-[#0f172a] border border-[#1e2c4a] shadow-2xl z-40"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[11px] font-semibold text-slate-400 px-2 py-1 block">
                  Severity Filter
                </span>
                {(["ALL", "CRITICAL", "HIGH", "MODERATE", "MONITORED"] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => {
                      setSelectedSeverity(sev);
                      setFilterMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      selectedSeverity === sev ? "bg-[#2563eb] text-white" : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>{sev === "ALL" ? "All Severity" : sev}</span>
                    {selectedSeverity === sev && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export GeoJSON Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExportGeoJSON();
            }}
            className="p-2 rounded-xl bg-[#0b101d]/90 border border-[#1e2c4a] text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
            title="Download GeoJSON Coordinates"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        {/* Top-Right Telemetry Card (Live Stream Metadata) */}
        {activeOverlays.includes("Telemetry") && (
          <div className="absolute top-4 right-4 z-30 hidden sm:flex flex-col gap-1.5 p-3 rounded-2xl bg-[#0b101d]/90 border border-[#1e2c4a]/90 backdrop-blur-md shadow-xl text-left pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
              <span className="text-[11px] font-bold text-rose-400 tracking-wide">
                LIVE SATELLITE FEED • VIIRS / SENTINEL
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-[11px] text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px]">TIME (UTC)</span>
                <span className="font-mono font-semibold text-white">{utcTime || "14:32:00 UTC"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SURFACE WIND</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <Wind className="h-3 w-3" /> 14 km/h ↗ NE
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">THERMAL RADIANCE</span>
                <span className="font-mono font-semibold text-rose-400">
                  {((targetIncident.meanFRP || 342) + frpFlux).toFixed(1)} MW
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SENSOR RESOLUTION</span>
                <span className="font-semibold text-cyan-400">375m / I-Band</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* INTERACTIVE WORKABLE MAP SCENE: IMAGE + ANIMATED OVERLAYS */}
        {/* ======================================================================= */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-transform duration-100 ease-out will-change-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`
          }}
        >
          {/* Base Facility Image Container */}
          <div className="relative w-[1300px] h-[850px] max-w-none shrink-0 shadow-2xl overflow-hidden">
            
            {/* 1. Photorealistic Base Image */}
            <img 
              src="/live_map_facility.jpg" 
              alt="Industrial Facility Live Aerial View" 
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />

            {/* 2. Animated Radar Scan Line Sweep */}
            {activeOverlays.includes("Radar Scan") && (
              <div className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-cyan-400/15 to-cyan-400/40 border-b border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.7)] pointer-events-none animate-radar-sweep" />
            )}

            {/* 3. Animated Billowing Heat Distortion & Flame Aura */}
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

            {/* 4. Animated Thermal Heatmap Glow (When Thermal Layer is active) */}
            {activeOverlays.includes("Thermal") && (
              <>
                {/* Main Core Fire Anomaly */}
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

                {/* Secondary Thermal Anomaly (Tanks area) */}
                <div 
                  className="absolute pointer-events-none animate-pulse"
                  style={{
                    top: "60%",
                    left: "57%",
                    width: "12%",
                    height: "12%",
                    background: "radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, rgba(234, 88, 12, 0.3) 50%, transparent 100%)",
                    filter: "blur(10px)"
                  }}
                />
              </>
            )}

            {/* 5. PRIMARY INCIDENT RETICLE & BOUNDING BOX (Animated, Clickable) */}
            {activeOverlays.includes("AI Reticle") && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenIncident(targetIncident);
                }}
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

                {/* In-Canvas Floating Badge */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-30 transition-transform group-hover:scale-105">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b101d]/95 border border-rose-500 backdrop-blur-md shadow-xl text-white">
                    <Flame className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                    <span className="text-xs font-bold">Fire Detected</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-extrabold border border-rose-500/30">
                      98%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SECONDARY HOTSPOT MARKERS (Clickable) */}
            {/* Marker 1: Chemical Storage Tanks */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHotspot(secondaryTank);
              }}
              className="absolute z-20 cursor-pointer group"
              style={{ top: "66%", left: "60%" }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-6 h-6 rounded-full bg-amber-500/40 animate-ping" />
                <div className="w-6 h-6 rounded-full bg-amber-500 border border-white/80 shadow-md flex items-center justify-center text-white transition-transform group-hover:scale-125">
                  <span className="w-2 h-2 rounded-full bg-white" />
                </div>
                
                {/* Tooltip on hover/click */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0b101d]/95 border border-amber-500/80 text-[11px] font-semibold text-white whitespace-nowrap shadow-xl">
                  <span>Thermal Anomaly • Storage Tanks</span>
                </div>
              </div>
            </div>

            {/* Marker 2: Logistics Corridor */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHotspot(tertiaryCluster);
              }}
              className="absolute z-20 cursor-pointer group"
              style={{ top: "33%", left: "38%" }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-blue-500 border border-white/70 shadow-md flex items-center justify-center text-white transition-transform group-hover:scale-125">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                
                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0b101d]/95 border border-blue-500/80 text-[11px] font-semibold text-white whitespace-nowrap shadow-xl">
                  <span>Monitored Zone • Warehouse Hub</span>
                </div>
              </div>
            </div>

            {/* 7. Tactical Coordinate Crosshairs */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="w-full h-full border border-slate-500/30" />
              <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-slate-500/40" />
              <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-slate-500/40" />
            </div>

          </div>
        </div>

        {/* Bottom Legend Pill matching FireSight */}
        <div className="absolute bottom-6 left-6 z-30 pointer-events-auto">
          <div className="px-3.5 py-2 rounded-xl bg-[#0b101d]/90 border border-[#1e2c4a] backdrop-blur-md shadow-lg flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-200">Active Fire</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-200">Thermal Hotspot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-200">Monitored Asset</span>
            </div>
          </div>
        </div>

        {/* Bottom Right Compass & Navigation Controls */}
        <div className="absolute bottom-6 right-6 z-30 flex flex-col items-center gap-2 pointer-events-auto">
          {/* Compass / Orientation Reset */}
          <button
            onClick={handleResetView}
            className="w-9 h-9 rounded-xl bg-[#0b101d]/90 hover:bg-[#141d33] border border-[#1e2c4a] backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shadow-lg"
            title="Reset Pan & Zoom"
          >
            <Compass className="h-5 w-5" />
          </button>

          {/* Focus on Target */}
          <button
            onClick={handleFocusOnTarget}
            className="w-9 h-9 rounded-xl bg-[#0b101d]/90 hover:bg-[#141d33] border border-[#1e2c4a] backdrop-blur-md flex items-center justify-center text-[#38bdf8] hover:text-white transition-colors cursor-pointer shadow-lg"
            title="Focus On Active Fire Target"
          >
            <Crosshair className="h-4 w-4" />
          </button>

          {/* Zoom In & Out */}
          <div className="flex flex-col rounded-xl bg-[#0b101d]/90 border border-[#1e2c4a] backdrop-blur-md overflow-hidden shadow-lg">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.4))}
              className="p-2 text-slate-300 hover:text-white hover:bg-[#141d33] transition-colors cursor-pointer border-b border-[#1e2c4a]"
              title="Zoom In"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.8))}
              className="p-2 text-slate-300 hover:text-white hover:bg-[#141d33] transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDEBAR: NEARBY ALERTS & INVESTIGATION ACTIONS */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-[#18233a] bg-[#0c1322] flex flex-col h-[40vh] lg:h-full select-none">
        
        {/* Header */}
        <div className="p-4 border-b border-[#18233a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight">Nearby Alerts</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#18233a] text-slate-300 text-[11px] font-semibold">
              {filteredHotspots.length}
            </span>
          </div>
          
          <button
            onClick={() => setActiveScreen("active-investigations")}
            className="text-xs font-semibold text-[#38bdf8] hover:text-white transition-colors cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Search bar inside panel */}
        <div className="p-3 border-b border-[#18233a]">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#111a2e] border border-[#1e2c4a] text-xs text-white placeholder-slate-400 outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
          {filteredHotspots.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching alerts found for this filter.
            </div>
          ) : (
            filteredHotspots.map((hotspot) => {
              const isSelected = selectedHotspot.id === hotspot.id;
              const isCritical = hotspot.severity === "CRITICAL" || hotspot.severity === "HIGH RISK";

              return (
                <div
                  key={hotspot.id}
                  onClick={() => setSelectedHotspot(hotspot)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? "bg-[#162340] border-[#2563eb] shadow-md shadow-blue-900/20"
                      : "bg-[#0f172a] border-[#1a2742] hover:bg-[#131f38] hover:border-[#2b3e66]"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 relative border border-slate-700/60 shadow-md">
                    <img 
                      src="/alert_fire_detail.jpg" 
                      alt="Incident Thumbnail"
                      className={`w-full h-full object-cover ${isCritical ? "" : "hue-rotate-30 saturate-75 brightness-90"}`} 
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Flame className={`h-4 w-4 ${isCritical ? "text-rose-400 fill-rose-500 animate-pulse" : "text-amber-400"}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">
                        {isCritical ? "Fire Detected" : "Thermal Anomaly"}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isCritical 
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}>
                        {isCritical ? "High" : "Medium"}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-300 truncate mt-0.5">
                      {hotspot.region || hotspot.name}
                    </span>

                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                      <span className="truncate">{hotspot.coordinates}</span>
                      <span className="shrink-0">{hotspot.detectedAt.slice(11, 16)} UTC</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Hotspot Bottom Quick Action */}
        <div className="p-3 border-t border-[#18233a] bg-[#0b101d] flex items-center gap-2">
          <button
            onClick={() => handleOpenIncident(selectedHotspot)}
            className="flex-1 h-9 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-600/30"
          >
            <span>Investigate</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => handleCompare(selectedHotspot)}
            className="px-3 h-9 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            title="Compare with another corridor"
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>Compare</span>
          </button>
        </div>

      </div>

    </div>
  );
}
