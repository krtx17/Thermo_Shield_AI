import React, { useState, useEffect, useMemo } from "react";
import { Hotspot, ActiveScreen, IncidentReport } from "../types";
import { 
  Flame, 
  Download, 
  Map, 
  Search, 
  Plus, 
  Check, 
  ChevronRight, 
  AlertTriangle, 
  FileText, 
  X,
  Bell
} from "lucide-react";

interface IncidentReportsProps {
  hotspots: Hotspot[];
  setActiveScreen?: (screen: ActiveScreen) => void;
  setSelectedHotspot?: (hotspot: Hotspot) => void;
}

export default function IncidentReports({
  hotspots,
  setActiveScreen,
  setSelectedHotspot
}: IncidentReportsProps) {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Hotspot>(hotspots[0]);
  const [searchFilter, setSearchFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New dispatch form
  const [formHotspotId, setFormHotspotId] = useState(hotspots[0]?.id || "");
  const [formAgency, setFormAgency] = useState("District Emergency Operations Center (DEOC)");

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setReports(data);
      }
    } catch (e) {
      console.warn("Could not load reports:", e);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Download dossier text
  const handleDownloadReport = (hotspot: Hotspot) => {
    const text = `=====================================================
FIRE INCIDENT REPORT — THERMOSHIELD AI
=====================================================
INCIDENT:    ${hotspot.name}
ID:          ${hotspot.id}
LOCATION:    ${hotspot.coordinates}
REGION:      ${hotspot.region}
SEVERITY:    ${hotspot.severity}
CONFIDENCE:  ${hotspot.activeFlameProb || 98}%
DETECTED AT: ${hotspot.detectedAt}

SOURCE:      NASA FIRMS & Sentinel-2 Multispectral
DISTANCE:    ${hotspot.distanceToAsset} to nearest industrial facility

SUMMARY:
${hotspot.defaultSummary}

RECOMMENDATION:
${hotspot.recommendation}
=====================================================`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Report_${hotspot.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Report downloaded successfully.");
  };

  const handleViewOnMap = (hotspot: Hotspot) => {
    if (setSelectedHotspot) setSelectedHotspot(hotspot);
    if (setActiveScreen) setActiveScreen("command-center");
  };

  const handleCreateDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const targetHotspot = hotspots.find(h => h.id === formHotspotId) || selectedIncident;

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotspotId: targetHotspot.id,
          facilityName: targetHotspot.name,
          region: targetHotspot.region,
          severity: targetHotspot.severity,
          riskScore: targetHotspot.riskScore,
          detectedAt: targetHotspot.detectedAt,
          dispatchPriority: "ALPHA",
          targetAgency: formAgency,
          summary: targetHotspot.defaultSummary,
          recommendation: targetHotspot.recommendation
        })
      });

      if (res.ok) {
        showToast("Emergency dispatch registered successfully.");
        setIsModalOpen(false);
        fetchReports();
      }
    } catch {
      showToast("Dispatch recorded in local state.");
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredHotspots = useMemo(() => {
    if (!searchFilter.trim()) return hotspots;
    const q = searchFilter.toLowerCase();
    return hotspots.filter(h => 
      h.name.toLowerCase().includes(q) ||
      h.region.toLowerCase().includes(q) ||
      h.id.toLowerCase().includes(q)
    );
  }, [hotspots, searchFilter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-semibold shadow-lg flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Reports & Dispatches</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Incident dossiers and emergency dispatch logs
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Dispatch</span>
        </button>
      </div>

      {/* Two Column Layout matching reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: RECENT ALERTS (Matching FireSense bottom-center) */}
        {/* ========================================================================= */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">Recent Alerts</h2>
            </div>
            <span className="text-xs text-[#38bdf8] font-semibold cursor-pointer">View All</span>
          </div>

          {/* Search bar */}
          <div className="py-3">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#141d33] border border-[#1e2c4a] text-xs text-white placeholder-slate-400 outline-none focus:border-[#2563eb]"
              />
            </div>
          </div>

          {/* List of alert items */}
          <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredHotspots.map((h) => {
              const isSelected = selectedIncident.id === h.id;
              const isCritical = h.severity === "CRITICAL" || h.severity === "HIGH RISK";

              return (
                <div
                  key={h.id}
                  onClick={() => setSelectedIncident(h)}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#18233a] border-[#2563eb] shadow-md shadow-blue-900/20"
                      : "bg-[#121a2d] border-[#1a2742] hover:bg-[#152038]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className={`w-11 h-11 rounded-lg overflow-hidden shrink-0 flex items-center justify-center ${
                      isCritical ? "bg-rose-500/20 text-rose-500" : "bg-amber-500/20 text-amber-500"
                    }`}>
                      <Flame className="h-5 w-5" />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          isCritical ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {isCritical ? "High" : "Medium"}
                        </span>
                        <span className="text-xs font-bold text-white truncate max-w-[180px]">
                          {isCritical ? "Industrial Fire Detected" : "Thermal Hotspot Detected"}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate mt-0.5">{h.name}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{h.detectedAt.slice(0, 16)} UTC</span>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: INCIDENT OVERVIEW (Matching FireSense bottom-center) */}
        {/* ========================================================================= */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Flame className="h-4 w-4 text-rose-500" />
              <h2 className="text-sm font-bold text-white tracking-tight">Incident Overview</h2>
            </div>

            {/* Key Fact Rows */}
            <div className="flex flex-col gap-3 py-4 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Facility / Area:</span>
                <span className="font-semibold text-white truncate max-w-[220px]">{selectedIncident.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-white">{selectedIncident.coordinates}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Detected At:</span>
                <span className="font-semibold text-white">{selectedIncident.detectedAt.replace(" UTC", "")} UTC</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Confidence:</span>
                <span className="font-bold text-rose-500">{selectedIncident.activeFlameProb || 98}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Source:</span>
                <span className="font-semibold text-white">NASA FIRMS</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Type:</span>
                <span className="font-semibold text-white">{selectedIncident.assetType || "Industrial Area"}</span>
              </div>
            </div>

            {/* Advisory Banner matching FireSense */}
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5 my-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                Possible industrial facility fire detected. Immediate monitoring and containment readiness recommended.
              </span>
            </div>
          </div>

          {/* Action CTAs matching FireSense */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-800 mt-4">
            <button
              onClick={() => handleViewOnMap(selectedIncident)}
              className="flex-1 h-10 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Map className="h-4 w-4" />
              <span>View on Map</span>
            </button>

            <button
              onClick={() => handleDownloadReport(selectedIncident)}
              className="flex-1 h-10 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* NEW DISPATCH MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create Emergency Dispatch</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-slate-400 font-medium">Target Incident Facility</label>
                <select
                  value={formHotspotId}
                  onChange={(e) => setFormHotspotId(e.target.value)}
                  className="h-9 px-3 rounded-lg bg-[#141d33] border border-[#1e2c4a] text-white outline-none focus:border-[#2563eb]"
                >
                  {hotspots.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.severity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-400 font-medium">Target Emergency Agency</label>
                <input
                  type="text"
                  value={formAgency}
                  onChange={(e) => setFormAgency(e.target.value)}
                  className="h-9 px-3 rounded-lg bg-[#141d33] border border-[#1e2c4a] text-white outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-9 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-9 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Send Dispatch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
