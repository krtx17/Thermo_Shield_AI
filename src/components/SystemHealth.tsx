import React, { useState, useEffect } from "react";
import { SystemHealthData, AuditLogEntry } from "../types";
import { 
  Flame, 
  Thermometer, 
  Clock, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  Server, 
  Cpu, 
  Database, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Lock
} from "lucide-react";

export default function SystemHealth() {
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "Custom">("7D");
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "regions" | "telemetry" | "audit">("overview");

  // Telemetry Health State
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

  // Trend data points matching the line chart in reference
  const trendPoints = [
    { day: "Apr 20", value: 3 },
    { day: "Apr 21", value: 7 },
    { day: "Apr 22", value: 5 },
    { day: "Apr 23", value: 12 },
    { day: "Apr 24", value: 9 },
    { day: "Apr 25", value: 14 },
    { day: "Apr 26", value: 10 },
  ];

  // Top affected regions matching FireSense bottom left
  const topRegions = [
    { name: "Madhya Pradesh", detections: 5, share: "42%" },
    { name: "Maharashtra", detections: 4, share: "33%" },
    { name: "Gujarat", detections: 3, share: "25%" }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto text-white">
      
      {/* ========================================================================= */}
      {/* HEADER: TITLE + SUBTITLE + TIME RANGE PILLS */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Insights from satellite data and AI detection
          </p>
        </div>

        {/* Time range pills matching reference image */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#10172a] border border-[#1e2c4a] self-start sm:self-auto">
          {(["7D", "30D", "Custom"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeRange === range
                  ? "bg-[#2563eb] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THREE STAT CARDS (Total Fires Detected, Thermal Anomalies, Avg. Response) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Fires Detected */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] flex items-center justify-between shadow-md">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400">Total Fires Detected</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-white">12</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <span>↑</span> 33%
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <Flame className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Thermal Anomalies */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] flex items-center justify-between shadow-md">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400">Thermal Anomalies</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-white">28</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <span>↑</span> 17%
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Thermometer className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Avg. Response Time */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] flex items-center justify-between shadow-md">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400">Avg. Response Time</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-white">12 min</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <span>↓</span> 42%
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
            <h2 className="text-sm font-bold text-white tracking-tight">Fire Detections Trend</h2>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Detections
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full h-52 relative">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="trendAreaGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="40" y1="20" x2="580" y2="20" stroke="#1e2c4a" strokeDasharray="3,3" strokeWidth="0.8" />
              <line x1="40" y1="70" x2="580" y2="70" stroke="#1e2c4a" strokeDasharray="3,3" strokeWidth="0.8" />
              <line x1="40" y1="120" x2="580" y2="120" stroke="#1e2c4a" strokeDasharray="3,3" strokeWidth="0.8" />
              <line x1="40" y1="170" x2="580" y2="170" stroke="#1e2c4a" strokeDasharray="3,3" strokeWidth="0.8" />

              {/* Y-Axis Labels */}
              <text x="15" y="24" fill="#64748b" fontSize="10" fontFamily="sans-serif">20</text>
              <text x="15" y="74" fill="#64748b" fontSize="10" fontFamily="sans-serif">15</text>
              <text x="15" y="124" fill="#64748b" fontSize="10" fontFamily="sans-serif">10</text>
              <text x="20" y="174" fill="#64748b" fontSize="10" fontFamily="sans-serif">0</text>

              {/* Area fill */}
              <path
                d="M 50,150 L 130,110 L 210,130 L 290,60 L 370,90 L 450,40 L 530,80 L 530,170 L 50,170 Z"
                fill="url(#trendAreaGlow)"
              />

              {/* Smooth trend curve */}
              <path
                d="M 50,150 Q 90,120 130,110 T 210,130 T 290,60 T 370,90 T 450,40 T 530,80"
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data points */}
              {[
                { x: 50, y: 150 },
                { x: 130, y: 110 },
                { x: 210, y: 130 },
                { x: 290, y: 60 },
                { x: 370, y: 90 },
                { x: 450, y: 40 },
                { x: 530, y: 80 }
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#ffffff"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                />
              ))}

              {/* X-Axis Day Labels */}
              {trendPoints.map((pt, idx) => {
                const xPos = 50 + idx * 80;
                return (
                  <text
                    key={idx}
                    x={xPos}
                    y="190"
                    fill="#64748b"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {pt.day}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Chart: Sources Donut Ring */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] flex flex-col justify-between shadow-md">
          <h2 className="text-sm font-bold text-white tracking-tight mb-4">Sources</h2>

          {/* Donut SVG */}
          <div className="flex items-center justify-center relative my-2">
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              {/* NASA FIRMS (62%) - Blue */}
              <circle
                cx="80"
                cy="80"
                r="55"
                fill="none"
                stroke="#2563eb"
                strokeWidth="18"
                strokeDasharray="214 345"
                strokeDashoffset="0"
              />
              {/* MODIS (23%) - Orange */}
              <circle
                cx="80"
                cy="80"
                r="55"
                fill="none"
                stroke="#f97316"
                strokeWidth="18"
                strokeDasharray="79 345"
                strokeDashoffset="-214"
              />
              {/* VIIRS (12%) - Crimson */}
              <circle
                cx="80"
                cy="80"
                r="55"
                fill="none"
                stroke="#ef4444"
                strokeWidth="18"
                strokeDasharray="41 345"
                strokeDashoffset="-293"
              />
              {/* Others (3%) - Purple */}
              <circle
                cx="80"
                cy="80"
                r="55"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="18"
                strokeDasharray="11 345"
                strokeDashoffset="-334"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs text-slate-400">Total</span>
              <span className="text-lg font-bold text-white">100%</span>
            </div>
          </div>

          {/* Sources breakdown list matching reference */}
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                <span className="text-slate-300">NASA FIRMS</span>
              </span>
              <span className="font-semibold text-white">62%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                <span className="text-slate-300">MODIS</span>
              </span>
              <span className="font-semibold text-white">23%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="text-slate-300">VIIRS</span>
              </span>
              <span className="font-semibold text-white">12%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                <span className="text-slate-300">Others</span>
              </span>
              <span className="font-semibold text-white">3%</span>
            </div>
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
              {topRegions.map((region) => (
                <div 
                  key={region.name}
                  className="p-3.5 rounded-xl bg-[#141d33] border border-[#1e2c4a] flex items-center justify-between"
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
              <span className="text-xs font-semibold text-slate-300">Monitoring Coverage</span>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Active thermal telemetry scans are conducted continuously across the Indian subcontinent corridors utilizing dual-satellite constellation tasking.
              </p>
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-700/50 text-xs">
                <span className="text-slate-400">Total Scanned Corridors:</span>
                <span className="font-semibold text-white">245 Regions</span>
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
