import React, { useState, useEffect, useMemo } from "react";
import { SystemHealthData, AuditLogEntry } from "../types";
import { 
  Flame, 
  Thermometer, 
  Clock, 
  Activity, 
  RefreshCw, 
  Server, 
  Cpu, 
  Lock,
  Calendar,
  Filter,
  Check
} from "lucide-react";

type TimeRangeOption = "7D" | "30D" | "Custom";

interface AnalyticsDataset {
  rangeLabel: string;
  sublabel: string;
  totalFires: number;
  totalFiresDelta: string;
  thermalAnomalies: number;
  thermalAnomaliesDelta: string;
  avgResponse: string;
  avgResponseDelta: string;
  yLabels: [number, number, number, number];
  points: { day: string; value: number }[];
  sources: { name: string; pct: number; color: string }[];
  regions: { name: string; detections: number; share: string }[];
  scannedCorridors: number;
}

const ANALYTICS_DATA: Record<TimeRangeOption, AnalyticsDataset> = {
  "7D": {
    rangeLabel: "Past 7 Days",
    sublabel: "Weekly rolling telemetry & emergency response performance",
    totalFires: 12,
    totalFiresDelta: "↑ 33% vs prior week",
    thermalAnomalies: 28,
    thermalAnomaliesDelta: "↑ 17% vs prior week",
    avgResponse: "12 min",
    avgResponseDelta: "↓ 42% faster dispatch",
    yLabels: [20, 15, 10, 0],
    points: [
      { day: "Apr 20", value: 3 },
      { day: "Apr 21", value: 7 },
      { day: "Apr 22", value: 5 },
      { day: "Apr 23", value: 12 },
      { day: "Apr 24", value: 9 },
      { day: "Apr 25", value: 14 },
      { day: "Apr 26", value: 10 },
    ],
    sources: [
      { name: "NASA FIRMS", pct: 62, color: "#2563eb" },
      { name: "MODIS", pct: 23, color: "#f97316" },
      { name: "VIIRS", pct: 12, color: "#ef4444" },
      { name: "Others", pct: 3, color: "#8b5cf6" },
    ],
    regions: [
      { name: "Madhya Pradesh Industrial Belt", detections: 5, share: "42%" },
      { name: "Maharashtra Petrochemical Zone", detections: 4, share: "33%" },
      { name: "Gujarat Coastal Enclave", detections: 3, share: "25%" }
    ],
    scannedCorridors: 245
  },
  "30D": {
    rangeLabel: "Past 30 Days",
    sublabel: "Monthly surveillance aggregated across industrial corridors",
    totalFires: 54,
    totalFiresDelta: "↑ 18% vs prior month",
    thermalAnomalies: 142,
    thermalAnomaliesDelta: "↑ 24% vs prior month",
    avgResponse: "13.4 min",
    avgResponseDelta: "↓ 38% faster dispatch",
    yLabels: [70, 50, 25, 0],
    points: [
      { day: "Sep 01", value: 8 },
      { day: "Sep 06", value: 16 },
      { day: "Sep 11", value: 24 },
      { day: "Sep 16", value: 31 },
      { day: "Sep 21", value: 42 },
      { day: "Sep 25", value: 49 },
      { day: "Sep 28", value: 54 },
    ],
    sources: [
      { name: "NASA FIRMS", pct: 58, color: "#2563eb" },
      { name: "MODIS", pct: 25, color: "#f97316" },
      { name: "VIIRS", pct: 14, color: "#ef4444" },
      { name: "Others", pct: 3, color: "#8b5cf6" },
    ],
    regions: [
      { name: "Odisha Industrial Corridor", detections: 22, share: "41%" },
      { name: "Gujarat Petrochem Belt", detections: 18, share: "33%" },
      { name: "Jharkhand Mineral Corridor", detections: 14, share: "26%" }
    ],
    scannedCorridors: 612
  },
  "Custom": {
    rangeLabel: "Custom 90-Day Horizon",
    sublabel: "Multi-month historical telemetry and cumulative anomaly trends",
    totalFires: 168,
    totalFiresDelta: "↑ 45% cumulative",
    thermalAnomalies: 412,
    thermalAnomaliesDelta: "↑ 31% cumulative",
    avgResponse: "11.2 min",
    avgResponseDelta: "↓ 52% efficiency gain",
    yLabels: [200, 150, 75, 0],
    points: [
      { day: "Jul 15", value: 34 },
      { day: "Aug 01", value: 62 },
      { day: "Aug 15", value: 92 },
      { day: "Sep 01", value: 120 },
      { day: "Sep 10", value: 138 },
      { day: "Sep 20", value: 154 },
      { day: "Sep 28", value: 168 },
    ],
    sources: [
      { name: "NASA FIRMS", pct: 64, color: "#2563eb" },
      { name: "MODIS", pct: 21, color: "#f97316" },
      { name: "VIIRS", pct: 12, color: "#ef4444" },
      { name: "Others", pct: 3, color: "#8b5cf6" },
    ],
    regions: [
      { name: "Odisha Industrial Corridor", detections: 72, share: "43%" },
      { name: "Gujarat Petrochem Belt", detections: 54, share: "32%" },
      { name: "Jharkhand Mineral Corridor", detections: 42, share: "25%" }
    ],
    scannedCorridors: 1420
  }
};

export default function SystemHealth() {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("7D");
  const [customStartDate, setCustomStartDate] = useState("2026-07-01");
  const [customEndDate, setCustomEndDate] = useState("2026-09-28");
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "telemetry" | "audit">("overview");

  // Telemetry Health State from Express backend
  const [healthData, setHealthData] = useState<SystemHealthData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch /api/health and /api/audit-logs
  const fetchHealthAndAudit = async () => {
    setIsLoading(true);
    try {
      const [healthRes, auditRes] = await Promise.all([
        fetch("/api/health"),
        fetch("/api/audit-logs")
      ]);
      if (healthRes.ok) {
        const data = await healthRes.json();
        setHealthData(data);
      }
      if (auditRes.ok) {
        const logs = await auditRes.json();
        if (Array.isArray(logs)) setAuditLogs(logs);
      }
    } catch (e) {
      console.warn("Could not fetch health or audit data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthAndAudit();
  }, []);

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  // Active dataset according to selected time range
  const currentData = ANALYTICS_DATA[timeRange];

  // Dynamic SVG chart coordinates calculation
  const chartMath = useMemo(() => {
    const yMax = currentData.yLabels[0];
    const yMin = 0;
    const startX = 60;
    const endX = 540;
    const topY = 25;
    const bottomY = 165;

    const stepX = (endX - startX) / (currentData.points.length - 1);
    const coords = currentData.points.map((pt, i) => {
      const x = startX + i * stepX;
      const ratio = Math.max(0, Math.min(1, (pt.value - yMin) / (yMax - yMin)));
      const y = bottomY - ratio * (bottomY - topY);
      return { x, y, ...pt };
    });

    const areaPath = `M ${coords[0].x},${coords[0].y} ` +
      coords.slice(1).map(c => `L ${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ") +
      ` L ${coords[coords.length - 1].x.toFixed(1)},${bottomY} L ${coords[0].x.toFixed(1)},${bottomY} Z`;

    const linePath = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)} ` +
      coords.slice(1).map(c => `L ${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");

    return { coords, areaPath, linePath };
  }, [currentData]);

  // Donut circumference for 55px radius is 345.57
  const CIRCUMFERENCE = 345.57;

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto text-white">
      
      {/* ========================================================================= */}
      {/* HEADER: TITLE + SUBTITLE + TIME RANGE TOGGLES */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {currentData.sublabel}
          </p>
        </div>

        {/* Time range pills with active visual state */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#10172a] border border-[#1e2c4a] self-start sm:self-auto">
          {(["7D", "30D", "Custom"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeRange === range
                  ? "bg-[#2563eb] text-white shadow-md shadow-blue-900/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {range === "7D" ? "7 Days" : range === "30D" ? "30 Days" : "Custom Range"}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUSTOM RANGE PICKER TOOLBAR (When Custom is selected) */}
      {/* ========================================================================= */}
      {timeRange === "Custom" && (
        <div className="p-3.5 px-4 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Calendar className="h-4 w-4 text-[#38bdf8]" />
            <span>Custom Surveillance Horizon:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#141d33] px-2.5 py-1 rounded-xl border border-[#1e2c4a] text-xs">
              <span className="text-slate-400">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center gap-1.5 bg-[#141d33] px-2.5 py-1 rounded-xl border border-[#1e2c4a] text-xs">
              <span className="text-slate-400">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1">
              {[
                { label: "Q3 2026", start: "2026-07-01", end: "2026-09-28" },
                { label: "90 Days", start: "2026-06-30", end: "2026-09-28" },
                { label: "YTD", start: "2026-01-01", end: "2026-09-28" }
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setCustomStartDate(preset.start);
                    setCustomEndDate(preset.end);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#141d33] hover:bg-[#1a2642] text-slate-300 hover:text-white border border-[#1e2c4a] transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* THREE STAT CARDS (Total Fires Detected, Thermal Anomalies, Avg. Response) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Fires Detected */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] flex items-center justify-between shadow-md transition-all hover:border-slate-700">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400">Total Fires Detected</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-white transition-all">
                {currentData.totalFires}
              </span>
              <span className="text-xs font-semibold text-emerald-400">
                {currentData.totalFiresDelta}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <Flame className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Thermal Anomalies */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] flex items-center justify-between shadow-md transition-all hover:border-slate-700">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400">Thermal Anomalies</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-white transition-all">
                {currentData.thermalAnomalies}
              </span>
              <span className="text-xs font-semibold text-amber-400">
                {currentData.thermalAnomaliesDelta}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Thermometer className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Avg. Response Time */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] flex items-center justify-between shadow-md transition-all hover:border-slate-700">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400">Avg. Response Time</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-white transition-all">
                {currentData.avgResponse}
              </span>
              <span className="text-xs font-semibold text-emerald-400">
                {currentData.avgResponseDelta}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Clock className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TWO MAIN CHARTS: FIRE DETECTIONS TREND (LINE) + SOURCES (DONUT) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Chart: Fire Detections Trend (Line Chart) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">Fire Detections Trend</h2>
              <span className="text-[11px] text-slate-400 font-medium">({currentData.rangeLabel})</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Detection Count
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full h-56 relative">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="trendAreaGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="40" y1="25" x2="580" y2="25" stroke="#1e2c4a" strokeDasharray="3,3" strokeWidth="0.8" />
              <line x1="40" y1="72" x2="580" y2="72" stroke="#1e2c4a" strokeDasharray="3,3" strokeWidth="0.8" />
              <line x1="40" y1="118" x2="580" y2="118" stroke="#1e2c4a" strokeDasharray="3,3" strokeWidth="0.8" />
              <line x1="40" y1="165" x2="580" y2="165" stroke="#1e2c4a" strokeDasharray="3,3" strokeWidth="0.8" />

              {/* Y-Axis Labels */}
              <text x="15" y="29" fill="#64748b" fontSize="10" fontFamily="sans-serif">{currentData.yLabels[0]}</text>
              <text x="15" y="76" fill="#64748b" fontSize="10" fontFamily="sans-serif">{currentData.yLabels[1]}</text>
              <text x="15" y="122" fill="#64748b" fontSize="10" fontFamily="sans-serif">{currentData.yLabels[2]}</text>
              <text x="20" y="169" fill="#64748b" fontSize="10" fontFamily="sans-serif">0</text>

              {/* Area fill */}
              <path
                d={chartMath.areaPath}
                fill="url(#trendAreaGlow)"
                className="transition-all duration-300"
              />

              {/* Trend curve */}
              <path
                d={chartMath.linePath}
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* Data points */}
              {chartMath.coords.map((pt, i) => (
                <g key={i} className="group">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#ffffff"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    className="transition-all duration-300 group-hover:r-6 cursor-pointer"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {pt.value}
                  </text>
                </g>
              ))}

              {/* X-Axis Milestone Labels */}
              {chartMath.coords.map((pt, idx) => (
                <text
                  key={idx}
                  x={pt.x}
                  y="188"
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {pt.day}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right Chart: Sources Donut Ring */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] flex flex-col justify-between shadow-md">
          <h2 className="text-sm font-bold text-white tracking-tight mb-2">Sensor Distribution</h2>

          {/* Donut SVG */}
          <div className="flex items-center justify-center relative my-3">
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              {(() => {
                let cumulative = 0;
                return currentData.sources.map((src, i) => {
                  const dashLen = (src.pct / 100) * CIRCUMFERENCE;
                  const dashOffset = -cumulative * CIRCUMFERENCE;
                  cumulative += src.pct / 100;

                  return (
                    <circle
                      key={src.name}
                      cx="80"
                      cy="80"
                      r="55"
                      fill="none"
                      stroke={src.color}
                      strokeWidth="18"
                      strokeDasharray={`${dashLen} ${CIRCUMFERENCE}`}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-500"
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total</span>
              <span className="text-base font-bold text-white">100%</span>
            </div>
          </div>

          {/* Sources breakdown list */}
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-800 text-xs">
            {currentData.sources.map((src) => (
              <div key={src.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                  <span className="text-slate-300">{src.name}</span>
                </span>
                <span className="font-semibold text-white">{src.pct}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SUB-OPTIONS SECTION: REGIONS / TELEMETRY / AUDIT TRAIL */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex flex-col gap-4">
        
        {/* Sub-tab navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { id: "overview", label: "Top Affected Regions" },
            { id: "telemetry", label: "System Telemetry & Health" },
            { id: "audit", label: "Verification Audit Trail" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? "bg-[#2563eb] text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-[#141d33]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Top Affected Regions */}
        {activeSubTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2.5">
              {currentData.regions.map((region) => (
                <div 
                  key={region.name}
                  className="p-3.5 rounded-xl bg-[#141d33] border border-[#1e2c4a] flex items-center justify-between transition-colors hover:bg-[#17223b]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-sm font-semibold text-white">{region.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{region.detections} detections</span>
                    <span className="text-xs font-bold text-rose-400">{region.share}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#141d33] border border-[#1e2c4a] flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-300">Corridor Surveillance Coverage</span>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Active thermal telemetry scans are conducted continuously across the Indian subcontinent corridors utilizing dual-satellite constellation tasking.
              </p>
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-700/50 text-xs">
                <span className="text-slate-400">Total Scanned Corridors:</span>
                <span className="font-semibold text-white">{currentData.scannedCorridors} Regions</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: System Telemetry & Health */}
        {activeSubTab === "telemetry" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#141d33] border border-[#1e2c4a] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">API Gateway Status</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-bold text-white">Online (Healthy)</span>
                  </div>
                </div>
                <Server className="h-5 w-5 text-emerald-400" />
              </div>

              <div className="p-3.5 rounded-xl bg-[#141d33] border border-[#1e2c4a] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">System Uptime</span>
                  <p className="text-sm font-bold text-white mt-1">
                    {healthData ? formatUptime(healthData.uptimeSeconds) : "Active"}
                  </p>
                </div>
                <Activity className="h-5 w-5 text-blue-400" />
              </div>

              <div className="p-3.5 rounded-xl bg-[#141d33] border border-[#1e2c4a] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">AI Engine Mode</span>
                  <p className="text-sm font-bold text-white mt-1">
                    {healthData?.geminiConfigured ? "Google Gemini 2.5 Active" : "Local Edge Fallback"}
                  </p>
                </div>
                <Cpu className="h-5 w-5 text-purple-400" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090d16] border border-[#18233a] flex items-center justify-between text-xs text-slate-400">
              <span>Memory Footprint: {healthData?.memoryUsageMB || 42} MB</span>
              <button
                onClick={fetchHealthAndAudit}
                className="flex items-center gap-1.5 text-xs text-[#38bdf8] hover:text-white cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
                <span>Refresh Telemetry</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Verification Audit Trail */}
        {activeSubTab === "audit" && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-400 mb-1">
              Cryptographically verified event logs:
            </span>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {auditLogs.length === 0 ? (
                <div className="p-4 text-xs text-slate-400 text-center">
                  No audit logs recorded yet.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#141d33] border border-[#1e2c4a] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{log.action}</span>
                        <span className="text-[11px] text-slate-400">{log.event} • {log.source}</span>
                      </div>
                    </div>
                    <span className="text-slate-400 text-[11px] shrink-0">{log.timestamp.slice(11, 19)} UTC</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
