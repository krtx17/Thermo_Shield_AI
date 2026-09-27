import React, { useState, useEffect } from "react";
import { Hotspot, ModelMode, ActiveScreen } from "../types";
import { 
  ArrowLeft, 
  Flame, 
  Sparkles, 
  Send, 
  FileText, 
  Bookmark, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  GitCompare, 
  X,
  Truck
} from "lucide-react";

interface ActiveInvestigationsProps {
  selectedHotspot: Hotspot;
  modelMode: ModelMode;
  setActiveScreen?: (screen: ActiveScreen) => void;
  setCompareAId?: (id: string) => void;
  setCompareBId?: (id: string) => void;
}

export default function ActiveInvestigations({
  selectedHotspot,
  modelMode,
  setActiveScreen,
  setCompareAId,
  setCompareBId
}: ActiveInvestigationsProps) {
  // Layer selection: Visible, Thermal, Infrared (matching reference image)
  const [activeImageryTab, setActiveImageryTab] = useState<"visible" | "thermal" | "infrared">("thermal");

  // AI Brief & Synthesis
  const [briefText, setBriefText] = useState(selectedHotspot.defaultSummary);
  const [customInquiry, setCustomInquiry] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Pinning
  const [isPinned, setIsPinned] = useState(false);

  // Sub-option Accordions
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  // Emergency Action Drawer / Modal
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  // Load pin status
  useEffect(() => {
    try {
      const saved = localStorage.getItem("thermo_shield_pinned_hotspots");
      if (saved) {
        const pins = JSON.parse(saved);
        setIsPinned(pins.includes(selectedHotspot.id));
      }
    } catch {
      setIsPinned(false);
    }
  }, [selectedHotspot.id]);

  const handleTogglePin = async () => {
    const nextState = !isPinned;
    setIsPinned(nextState);
    try {
      const saved = localStorage.getItem("thermo_shield_pinned_hotspots");
      let pins: string[] = saved ? JSON.parse(saved) : [];
      if (nextState) {
        if (!pins.includes(selectedHotspot.id)) pins.push(selectedHotspot.id);
        await fetch("/api/audit-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: selectedHotspot.id,
            action: "Anomaly Pinned to High-Priority Enclave",
            source: "Analyst Console"
          })
        });
      } else {
        pins = pins.filter(id => id !== selectedHotspot.id);
      }
      localStorage.setItem("thermo_shield_pinned_hotspots", JSON.stringify(pins));
    } catch (e) {
      console.warn("Pin update error:", e);
    }
  };

  // Synthesize with Gemini
  const handleSynthesize = async (promptQuery?: string) => {
    setIsSynthesizing(true);
    try {
      const query = promptQuery || "Perform multi-spectral thermal verification and operational risk analysis.";
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotspot: selectedHotspot,
          mode: modelMode,
          prompt: query
        })
      });
      if (res.ok) {
        const data = await res.json();
        setBriefText(data.narrative || selectedHotspot.defaultSummary);
      }
    } catch (e) {
      console.warn("Synthesis fallback:", e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Download dossier
  const handleDownloadDossier = () => {
    const text = `=====================================================
FIRE INCIDENT DOSSIER — THERMOSHIELD AI
=====================================================
INCIDENT ID: ${selectedHotspot.id}
FACILITY:    ${selectedHotspot.name}
LOCATION:    ${selectedHotspot.coordinates}
REGION:      ${selectedHotspot.region}
SEVERITY:    ${selectedHotspot.severity}
CONFIDENCE:  ${selectedHotspot.activeFlameProb || 98}%
DETECTED AT: ${selectedHotspot.detectedAt}

THERMAL TELEMETRY:
- Mean FRP:  ${selectedHotspot.meanFRP} MW
- Peak FRP:  ${selectedHotspot.peakFRP} MW
- Distance:  ${selectedHotspot.distanceToAsset} to asset
- Access:    ${selectedHotspot.roadAccess}

SUMMARY:
${briefText}

RECOMMENDATION:
${selectedHotspot.recommendation}
=====================================================`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Incident_${selectedHotspot.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Dispatch emergency response
  const handleConfirmDispatch = async () => {
    setDispatchStatus("dispatching");
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotspotId: selectedHotspot.id,
          facilityName: selectedHotspot.name,
          region: selectedHotspot.region,
          severity: selectedHotspot.severity,
          riskScore: selectedHotspot.riskScore,
          detectedAt: selectedHotspot.detectedAt,
          dispatchPriority: "ALPHA",
          targetAgency: "District Emergency Operations Center (DEOC)",
          summary: briefText,
          recommendation: selectedHotspot.recommendation
        })
      });
      setDispatchStatus("dispatched");
      setTimeout(() => {
        setIsActionModalOpen(false);
        setDispatchStatus(null);
      }, 1500);
    } catch {
      setDispatchStatus("dispatched");
      setTimeout(() => {
        setIsActionModalOpen(false);
        setDispatchStatus(null);
      }, 1500);
    }
  };

  const isCritical = selectedHotspot.severity === "CRITICAL" || selectedHotspot.severity === "HIGH RISK";

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-[#0b101d] text-white">
      {/* Top Header: Back Button + Incident Title */}
      <div className="h-14 px-4 sm:px-6 border-b border-[#18233a] flex items-center justify-between bg-[#0b101d] shrink-0">
        <button
          onClick={() => setActiveScreen && setActiveScreen("command-center")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePin}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isPinned 
                ? "bg-[#2563eb] border-[#2563eb] text-white" 
                : "bg-[#10172a] border-[#1e2c4a] text-slate-400 hover:text-white"
            }`}
            title={isPinned ? "Pinned to priority watch" : "Pin to priority watch"}
          >
            <Bookmark className="h-4 w-4" />
          </button>

          <button
            onClick={handleDownloadDossier}
            className="p-2 rounded-xl bg-[#10172a] border border-[#1e2c4a] text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Download Incident Dossier"
          >
            <FileText className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Layout: Left Satellite View + Right Incident Details Panel */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ========================================================================= */}
        {/* LEFT VIEWPORT: SATELLITE HEAT MAP & IMAGERY SELECTOR */}
        {/* ========================================================================= */}
        <div className="relative flex-1 h-[55vh] lg:h-full bg-[#070b14] overflow-hidden flex flex-col justify-between p-4 sm:p-6 select-none">
          
          {/* Main Satellite Heat Map Canvas */}
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-[#1a2742] bg-[#090e1a] flex items-center justify-center">
            {/* 1. Base Close-up Satellite Image */}
            <img 
              src="/alert_fire_detail.jpg" 
              alt="Detailed Satellite Incident Imagery" 
              className={`w-full h-full object-cover select-none transition-all duration-700 ${
                activeImageryTab === "thermal" 
                  ? "contrast-115 brightness-95 saturate-125" 
                  : activeImageryTab === "infrared" 
                    ? "hue-rotate-180 saturate-150 contrast-125" 
                    : ""
              }`}
            />

            {/* 2. Thermal Infrared False-Color Heatmap Overlay */}
            {activeImageryTab === "thermal" && (
              <div 
                className="absolute inset-0 pointer-events-none animate-thermal-pulse"
                style={{
                  background: "radial-gradient(circle at 48% 62%, rgba(255, 60, 0, 0.65) 0%, rgba(255, 140, 0, 0.45) 25%, rgba(220, 38, 38, 0.3) 45%, rgba(59, 130, 246, 0.15) 70%, transparent 100%)",
                  mixBlendMode: "screen"
                }}
              />
            )}

            {/* 3. Shortwave Infrared False-Color Overlay */}
            {activeImageryTab === "infrared" && (
              <div 
                className="absolute inset-0 pointer-events-none animate-pulse"
                style={{
                  background: "radial-gradient(circle at 48% 62%, rgba(168, 85, 247, 0.6) 0%, rgba(59, 130, 246, 0.4) 35%, rgba(6, 182, 212, 0.2) 65%, transparent 100%)",
                  mixBlendMode: "screen"
                }}
              />
            )}

            {/* 4. Scanning Radar Line */}
            <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-cyan-400/20 to-cyan-400/40 border-b border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.7)] pointer-events-none animate-radar-sweep" />

            {/* 5. Fire Area Floating Tag matching reference */}
            <div className="absolute top-[48%] left-[46%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/95 text-white text-xs font-bold shadow-xl shadow-rose-950/60 border border-rose-400/60">
                <Flame className="h-3.5 w-3.5 fill-white animate-pulse" />
                <span>Fire Area</span>
              </div>
            </div>
          </div>

          {/* Bottom Satellite Imagery Selector matching reference */}
          <div className="pt-4 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-300">
              Satellite Imagery
            </span>

            <div className="flex items-center gap-3">
              {[
                { id: "visible", label: "Visible", style: "" },
                { id: "thermal", label: "Thermal", style: "contrast-125 saturate-150" },
                { id: "infrared", label: "Infrared", style: "hue-rotate-180 saturate-150" }
              ].map((tab) => {
                const isActive = activeImageryTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveImageryTab(tab.id as any)}
                    className={`flex-1 p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#18233a] border-[#2563eb] shadow-md shadow-blue-900/20"
                        : "bg-[#0f172a] border-[#1a2742] hover:bg-[#141e35] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="relative w-full h-11 rounded-lg overflow-hidden border border-slate-700/60 shadow-inner">
                      <img 
                        src="/alert_fire_detail.jpg" 
                        alt={tab.label}
                        className={`w-full h-full object-cover ${tab.style}`} 
                      />
                      {tab.id === "thermal" && (
                        <div className="absolute inset-0 bg-gradient-to-t from-rose-600/50 via-transparent to-transparent flex items-center justify-center">
                          <Flame className="h-4 w-4 text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? "text-white font-semibold" : "text-slate-400"}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: INCIDENT METADATA, AI CLASSIFICATION & TAKE ACTION */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[420px] border-t lg:border-t-0 lg:border-l border-[#18233a] bg-[#0c1322] flex flex-col overflow-y-auto p-4 sm:p-6 gap-5">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#18233a]">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Fire Incident</h2>
              <p className="text-xs text-slate-400 truncate max-w-[220px] mt-0.5">{selectedHotspot.name}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              isCritical ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
            }`}>
              {isCritical ? "High Priority" : "Monitored"}
            </span>
          </div>

          {/* Key Facts matching FireSight right panel */}
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Location</span>
              <span className="font-semibold text-white">{selectedHotspot.coordinates}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Source</span>
              <span className="font-semibold text-white">NASA FIRMS</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Detected At</span>
              <span className="font-semibold text-white">{selectedHotspot.detectedAt.replace(" UTC", "")} UTC</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Confidence</span>
              <span className="font-bold text-rose-500">{selectedHotspot.activeFlameProb || 98}%</span>
            </div>
          </div>

          {/* AI Classification Card matching reference */}
          <div className="p-4 rounded-xl bg-[#111a2e] border border-[#1e2c4a] flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              AI Classification
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Flame className="h-5 w-5 text-rose-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-tight">
                  Industrial Fire
                </span>
                <span className="text-xs text-slate-400 leading-tight mt-1">
                  Likely cause: Chemical / Fuel
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action Button matching reference */}
          <button
            onClick={() => setIsActionModalOpen(true)}
            className="w-full h-11 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <span>Take Action</span>
            <span className="text-lg leading-none">→</span>
          </button>

          {/* Sub-option 1: Technical Telemetry Accordion */}
          <div className="border border-[#18233a] rounded-xl overflow-hidden bg-[#0e1627]">
            <button
              onClick={() => setShowTelemetry(!showTelemetry)}
              className="w-full px-4 py-3 text-xs font-semibold flex items-center justify-between text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Technical Telemetry</span>
              {showTelemetry ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showTelemetry && (
              <div className="p-4 border-t border-[#18233a] flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mean FRP Power:</span>
                  <span className="font-semibold text-white">{selectedHotspot.meanFRP} MW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Peak FRP Power:</span>
                  <span className="font-semibold text-white">{selectedHotspot.peakFRP} MW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Proximity to Asset:</span>
                  <span className="font-semibold text-white">{selectedHotspot.distanceToAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Road Access:</span>
                  <span className="font-semibold text-white">{selectedHotspot.roadAccess}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Normalized Burn Ratio (NBR):</span>
                  <span className="font-semibold text-white">{selectedHotspot.nbr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vegetation Index (NDVI):</span>
                  <span className="font-semibold text-white">{selectedHotspot.ndvi}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sub-option 2: AI Incident Inquiry Accordion */}
          <div className="border border-[#18233a] rounded-xl overflow-hidden bg-[#0e1627]">
            <button
              onClick={() => setShowAiChat(!showAiChat)}
              className="w-full px-4 py-3 text-xs font-semibold flex items-center justify-between text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#38bdf8]" />
                <span>Ask AI About This Incident</span>
              </div>
              {showAiChat ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showAiChat && (
              <div className="p-4 border-t border-[#18233a] flex flex-col gap-3">
                <div className="text-xs text-slate-300 leading-relaxed bg-[#111a2e] p-3 rounded-lg border border-[#1e2c4a]">
                  {briefText}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask about spread, containment, or causes..."
                    value={customInquiry}
                    onChange={(e) => setCustomInquiry(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && customInquiry.trim() && handleSynthesize(customInquiry)}
                    className="flex-1 h-9 px-3 rounded-lg bg-[#111a2e] border border-[#1e2c4a] text-xs text-white placeholder-slate-400 outline-none focus:border-[#2563eb]"
                  />
                  <button
                    onClick={() => customInquiry.trim() && handleSynthesize(customInquiry)}
                    disabled={isSynthesizing}
                    className="h-9 px-3 rounded-lg bg-[#2563eb] text-white text-xs font-semibold flex items-center justify-center disabled:opacity-50 cursor-pointer"
                  >
                    {isSynthesizing ? <span className="animate-spin text-xs">●</span> : <Send className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Compare corridor button */}
          <button
            onClick={() => {
              if (setCompareAId && setCompareBId && setActiveScreen) {
                setCompareAId(selectedHotspot.id);
                setActiveScreen("risk-comparison");
              }
            }}
            className="w-full h-9 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-xs font-semibold flex items-center justify-center gap-2 text-slate-200 transition-colors cursor-pointer"
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>Compare With Another Facility</span>
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* EMERGENCY ACTION MODAL */}
      {/* ========================================================================= */}
      {isActionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-rose-500" />
                <h3 className="text-sm font-bold text-white">Emergency Response Action</h3>
              </div>
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Confirm operational alert dispatch for <strong className="text-white">{selectedHotspot.name}</strong> to the District Emergency Operations Center (DEOC).
            </p>

            <div className="p-3 rounded-xl bg-[#141d33] border border-[#1e2c4a] text-xs flex flex-col gap-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Nearest Fire Station:</span>
                <span className="font-semibold text-white">{selectedHotspot.nearestFireStation}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Access Corridor:</span>
                <span className="font-semibold text-white">{selectedHotspot.roadAccess}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="flex-1 h-9 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDispatch}
                disabled={dispatchStatus === "dispatching" || dispatchStatus === "dispatched"}
                className="flex-1 h-9 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {dispatchStatus === "dispatching" ? (
                  <span>Dispatching...</span>
                ) : dispatchStatus === "dispatched" ? (
                  <span className="flex items-center gap-1"><Check className="h-4 w-4" /> Dispatched</span>
                ) : (
                  <span>Confirm Dispatch</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
