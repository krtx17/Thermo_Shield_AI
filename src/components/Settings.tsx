import React, { useState } from "react";
import { ModelMode } from "../types";
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Cpu, 
  Globe2, 
  Bell, 
  ShieldCheck, 
  Volume2, 
  Database,
  Check,
  RefreshCw
} from "lucide-react";

interface SettingsProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  modelMode: ModelMode;
  setModelMode: (mode: ModelMode) => void;
}

export default function Settings({
  theme,
  setTheme,
  modelMode,
  setModelMode
}: SettingsProps) {
  const isDark = theme === "dark";
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState("15s");
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  const testApiConnection = async () => {
    setIsTestingApi(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        setApiStatus("Connected (HTTP 200 OK)");
      } else {
        setApiStatus("Error: HTTP " + res.status);
      }
    } catch {
      setApiStatus("Connection failed");
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-4xl mx-auto text-white">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Settings & Preferences</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure interface appearance, inference mode, and alert thresholds
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Appearance Settings */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex flex-col gap-4">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-400" />
            <span>Theme & Visual Style</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setTheme("dark")}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                isDark 
                  ? "bg-[#18233a] border-[#2563eb] shadow-md shadow-blue-900/20" 
                  : "bg-[#111a2e] border-[#1e2c4a] hover:bg-[#141d33]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-indigo-400" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">FireSight (Dark)</span>
                  <span className="text-[11px] text-slate-400">Tactical night aerial view</span>
                </div>
              </div>
              {isDark && <Check className="h-4 w-4 text-[#2563eb]" />}
            </button>

            <button
              onClick={() => setTheme("light")}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                !isDark 
                  ? "bg-[#18233a] border-[#2563eb] shadow-md shadow-blue-900/20" 
                  : "bg-[#111a2e] border-[#1e2c4a] hover:bg-[#141d33]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-amber-400" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">FireSense (Light)</span>
                  <span className="text-[11px] text-slate-400">Clean global thermal view</span>
                </div>
              </div>
              {!isDark && <Check className="h-4 w-4 text-[#2563eb]" />}
            </button>
          </div>
        </div>

        {/* Inference Mode */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex flex-col gap-4">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="h-4 w-4 text-purple-400" />
            <span>AI Inference Engine</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setModelMode("cloud")}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                modelMode === "cloud"
                  ? "bg-[#18233a] border-[#2563eb] shadow-md shadow-blue-900/20"
                  : "bg-[#111a2e] border-[#1e2c4a] hover:bg-[#141d33]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe2 className="h-5 w-5 text-[#38bdf8]" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">Google Gemini Cloud</span>
                  <span className="text-[11px] text-slate-400">Gemini 2.5 Flash neural synthesis</span>
                </div>
              </div>
              {modelMode === "cloud" && <Check className="h-4 w-4 text-[#2563eb]" />}
            </button>

            <button
              onClick={() => setModelMode("local")}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                modelMode === "local"
                  ? "bg-[#18233a] border-[#2563eb] shadow-md shadow-blue-900/20"
                  : "bg-[#111a2e] border-[#1e2c4a] hover:bg-[#141d33]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className="h-5 w-5 text-emerald-400" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">Local Edge ConvNeXt</span>
                  <span className="text-[11px] text-slate-400">Deterministic air-gapped fallback</span>
                </div>
              </div>
              {modelMode === "local" && <Check className="h-4 w-4 text-[#2563eb]" />}
            </button>
          </div>
        </div>

        {/* Alert Thresholds & Audio */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex flex-col gap-4">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="h-4 w-4 text-rose-500" />
            <span>Alert Thresholds</span>
          </h2>

          <div className="flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Minimum Fire Confidence Threshold</span>
              <span className="font-bold text-rose-400">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">Audible Siren On High Priority Alerts</span>
            <button
              onClick={() => setAudioAlerts(!audioAlerts)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                audioAlerts ? "bg-[#2563eb]" : "bg-slate-700"
              }`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                audioAlerts ? "left-4.5" : "left-0.5"
              }`} />
            </button>
          </div>
        </div>

        {/* System Diagnostics */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">System API Connectivity</span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {apiStatus || "Endpoints: /api/hotspots, /api/synthesize, /api/health"}
            </span>
          </div>

          <button
            onClick={testApiConnection}
            disabled={isTestingApi}
            className="px-3.5 py-2 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isTestingApi ? "animate-spin" : ""}`} />
            <span>Test Connection</span>
          </button>
        </div>
      </div>
    </div>
  );
}
