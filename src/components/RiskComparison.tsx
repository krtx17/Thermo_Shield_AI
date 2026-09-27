import React, { useState, useEffect } from "react";
import { Hotspot } from "../types";
import { 
  GitCompare, 
  ArrowLeftRight, 
  Download, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  TrendingUp, 
  MapPin, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle
} from "lucide-react";

interface RiskComparisonProps {
  hotspots: Hotspot[];
  initialAId: string;
  initialBId: string;
}

export default function RiskComparison({
  hotspots,
  initialAId,
  initialBId
}: RiskComparisonProps) {
  const [eventAId, setEventAId] = useState(initialAId);
  const [eventBId, setEventBId] = useState(initialBId);

  useEffect(() => {
    setEventAId(initialAId);
    setEventBId(initialBId);
  }, [initialAId, initialBId]);

  const eventA = hotspots.find(h => h.id === eventAId) || hotspots[0];
  const eventB = hotspots.find(h => h.id === eventBId) || hotspots[1] || hotspots[0];

  const [compReport, setCompReport] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  useEffect(() => {
    setCompReport(`Comparison between ${eventA.name} and ${eventB.name}:
- Risk Score: ${eventA.riskScore} vs ${eventB.riskScore} (${Math.abs(eventA.riskScore - eventB.riskScore).toFixed(1)} point difference)
- Thermal Radiative Power: ${eventA.meanFRP} MW vs ${eventB.meanFRP} MW
- Proximity to Asset: ${eventA.distanceToAsset} vs ${eventB.distanceToAsset}
- 30-Day Detections: ${eventA.detections30d} vs ${eventB.detections30d}

Recommendation: Prioritize immediate containment support at ${eventA.riskScore >= eventB.riskScore ? eventA.name : eventB.name}.`);
  }, [eventA, eventB]);

  const handleSwap = () => {
    const temp = eventAId;
    setEventAId(eventBId);
    setEventBId(temp);
  };

  const handleRunAiComparison = async () => {
    setIsComparing(true);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventA,
          eventB,
          mode: "cloud"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCompReport(data.report || compReport);
      }
    } catch {
      // Fallback already set
    } finally {
      setIsComparing(false);
    }
  };

  const handleDownload = () => {
    const text = `=====================================================
FACILITY COMPARISON REPORT — THERMOSHIELD AI
=====================================================
FACILITY A: ${eventA.name} (${eventA.id})
- Severity:     ${eventA.severity} (Score: ${eventA.riskScore})
- Thermal Power: ${eventA.meanFRP} MW
- Distance:     ${eventA.distanceToAsset}
- 30d Activity: ${eventA.detections30d} detections

FACILITY B: ${eventB.name} (${eventB.id})
- Severity:     ${eventB.severity} (Score: ${eventB.riskScore})
- Thermal Power: ${eventB.meanFRP} MW
- Distance:     ${eventB.distanceToAsset}
- 30d Activity: ${eventB.detections30d} detections

ANALYSIS & RECOMMENDATION:
${compReport}
=====================================================`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Comparison_${eventA.id}_vs_${eventB.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Compare Facilities</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Side-by-side risk analysis and thermal power comparison
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSwap}
            className="px-3 py-2 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Swap facilities"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Swap</span>
          </button>

          <button
            onClick={handleRunAiComparison}
            disabled={isComparing}
            className="px-3.5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isComparing ? "Analyzing..." : "AI Comparison"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Download comparison report"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Side by Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Facility A */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider">Facility A</span>
            <select
              value={eventAId}
              onChange={(e) => setEventAId(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#141d33] border border-[#1e2c4a] text-xs font-semibold text-white outline-none focus:border-[#2563eb]"
            >
              {hotspots.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.severity})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141d33] border border-[#1e2c4a]">
            <span className="text-xs text-slate-400">Risk Severity</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
              {eventA.severity} ({eventA.riskScore}/100)
            </span>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-white">{eventA.coordinates}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Mean Thermal Power:</span>
              <span className="font-semibold text-white">{eventA.meanFRP} MW</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Peak Thermal Power:</span>
              <span className="font-semibold text-white">{eventA.peakFRP} MW</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Proximity to Asset:</span>
              <span className="font-semibold text-white">{eventA.distanceToAsset}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">30-Day Activity:</span>
              <span className="font-semibold text-white">{eventA.detections30d} detections</span>
            </div>
          </div>
        </div>

        {/* Facility B */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Facility B</span>
            <select
              value={eventBId}
              onChange={(e) => setEventBId(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#141d33] border border-[#1e2c4a] text-xs font-semibold text-white outline-none focus:border-[#2563eb]"
            >
              {hotspots.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.severity})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141d33] border border-[#1e2c4a]">
            <span className="text-xs text-slate-400">Risk Severity</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              {eventB.severity} ({eventB.riskScore}/100)
            </span>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-white">{eventB.coordinates}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Mean Thermal Power:</span>
              <span className="font-semibold text-white">{eventB.meanFRP} MW</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Peak Thermal Power:</span>
              <span className="font-semibold text-white">{eventB.peakFRP} MW</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Proximity to Asset:</span>
              <span className="font-semibold text-white">{eventB.distanceToAsset}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">30-Day Activity:</span>
              <span className="font-semibold text-white">{eventB.detections30d} detections</span>
            </div>
          </div>
        </div>

      </div>

      {/* Comparison Analysis Narrative */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex flex-col gap-3">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-[#2563eb]" />
          <span>Comparison Summary</span>
        </h2>

        <div className="p-4 rounded-xl bg-[#141d33] border border-[#1e2c4a] text-xs text-slate-300 leading-relaxed whitespace-pre-line">
          {compReport}
        </div>

        {/* Technical Sub-option Accordion */}
        <div className="border border-[#1e2c4a] rounded-xl overflow-hidden mt-1">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full px-4 py-2.5 text-xs font-semibold flex items-center justify-between text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>Spectral Indices Comparison (NDVI, NBR, SWIR)</span>
            {showTechnicalDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showTechnicalDetails && (
            <div className="p-4 border-t border-[#1e2c4a] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1.5 text-slate-300">
                <span className="font-semibold text-white">{eventA.name}:</span>
                <span>NDVI: {eventA.ndvi}</span>
                <span>NBR: {eventA.nbr}</span>
                <span>SWIR/NIR: {eventA.swirNir}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-slate-300">
                <span className="font-semibold text-white">{eventB.name}:</span>
                <span>NDVI: {eventB.ndvi}</span>
                <span>NBR: {eventB.nbr}</span>
                <span>SWIR/NIR: {eventB.swirNir}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
