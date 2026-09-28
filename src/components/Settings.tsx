import React, { useState, useEffect } from "react";
import { ModelMode, UserProfile, ActiveScreen } from "../types";
import { 
  Cpu, 
  Globe2, 
  Bell, 
  ShieldCheck, 
  Volume2, 
  VolumeX,
  Radio, 
  Check, 
  RefreshCw, 
  HelpCircle, 
  Sliders, 
  User, 
  RotateCcw,
  Wifi,
  Sparkles,
  Zap
} from "lucide-react";

interface SettingsProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  modelMode: ModelMode;
  setModelMode: (mode: ModelMode) => void;
  currentUser?: UserProfile | null;
  onOpenOnboarding?: () => void;
  setActiveScreen?: (screen: ActiveScreen) => void;
}

export default function Settings({
  theme,
  modelMode,
  setModelMode,
  currentUser,
  onOpenOnboarding,
  setActiveScreen
}: SettingsProps) {
  const isDark = theme === "dark";

  // Operator configurable preferences with localStorage persistence
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("thermo_shield_conf_threshold");
      return saved ? Number(saved) : 80;
    } catch {
      return 80;
    }
  });

  const [audioAlerts, setAudioAlerts] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("thermo_shield_audio_alerts");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  const [autoDeluge, setAutoDeluge] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("thermo_shield_auto_deluge");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  const [autoDeocDispatch, setAutoDeocDispatch] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("thermo_shield_auto_deoc");
      return saved !== null ? saved === "true" : false;
    } catch {
      return false;
    }
  });

  const [syncRate, setSyncRate] = useState<string>(() => {
    try {
      return localStorage.getItem("thermo_shield_sync_rate") || "15s";
    } catch {
      return "15s";
    }
  });

  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleConfidenceChange = (val: number) => {
    setConfidenceThreshold(val);
    localStorage.setItem("thermo_shield_conf_threshold", String(val));
    showToast("Detection threshold updated");
  };

  const handleAudioToggle = () => {
    const next = !audioAlerts;
    setAudioAlerts(next);
    localStorage.setItem("thermo_shield_audio_alerts", String(next));
    showToast(next ? "Audible sirens enabled" : "Audible sirens muted");
  };

  const handleDelugeToggle = () => {
    const next = !autoDeluge;
    setAutoDeluge(next);
    localStorage.setItem("thermo_shield_auto_deluge", String(next));
    showToast(next ? "Auto-deluge barrier armed" : "Manual deluge mode engaged");
  };

  const handleDeocToggle = () => {
    const next = !autoDeocDispatch;
    setAutoDeocDispatch(next);
    localStorage.setItem("thermo_shield_auto_deoc", String(next));
    showToast(next ? "Autonomous DEOC dispatch active" : "Manual DEOC approval required");
  };

  const handleSyncRateChange = (rate: string) => {
    setSyncRate(rate);
    localStorage.setItem("thermo_shield_sync_rate", rate);
    showToast(`Telemetry sync frequency set to ${rate}`);
  };

  const testApiConnection = async () => {
    setIsTestingApi(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/health");
      const elapsed = Math.round(performance.now() - start);
      if (res.ok) {
        setApiStatus(`Operational (HTTP 200 • ${elapsed}ms)`);
      } else {
        setApiStatus(`HTTP ${res.status} Error`);
      }
    } catch {
      setApiStatus("Gateway Offline");
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleResetDefaults = () => {
    setConfidenceThreshold(80);
    setAudioAlerts(true);
    setAutoDeluge(true);
    setAutoDeocDispatch(false);
    setSyncRate("15s");
    setModelMode("cloud");
    localStorage.removeItem("thermo_shield_conf_threshold");
    localStorage.removeItem("thermo_shield_audio_alerts");
    localStorage.removeItem("thermo_shield_auto_deluge");
    localStorage.removeItem("thermo_shield_auto_deoc");
    localStorage.removeItem("thermo_shield_sync_rate");
    showToast("Preferences reset to tactical defaults");
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-5xl mx-auto ${isDark ? "text-white" : "text-slate-900"}`}>
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER */}
      {/* ========================================================================= */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isDark ? "bg-[#0b101d] border-[#18233a] shadow-lg shadow-black/40" : "bg-white border-slate-200 shadow-md"
      }`}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#38bdf8]">
              <Sliders className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Operational Settings & Preferences
            </h1>
          </div>
          <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Configure AI inference engines, emergency dispatch thresholds, and orbital telemetry frequency.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {saveToast && (
            <span className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-in fade-in">
              ✓ {saveToast}
            </span>
          )}

          <button
            onClick={handleResetDefaults}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark ? "bg-[#141d33] hover:bg-[#1e2c4d] border-[#1e2c4a] text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
            title="Reset to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ORGANIZED SETTINGS MODULES */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* MODULE 1: AI INFERENCE ENGINE & COMPUTER VISION */}
        <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${
          isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/30">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#2563eb]" />
              <span>AI Intelligence & Model Architecture</span>
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-bold border border-blue-500/30">
              Active: {modelMode.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-300">
              Primary Threat Synthesis Provider:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cloud Gemini Option */}
              <button
                onClick={() => { setModelMode("cloud"); showToast("Engine: Google Gemini Cloud"); }}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  modelMode === "cloud"
                    ? "bg-[#18233a] border-[#2563eb] ring-1 ring-[#2563eb] shadow-md shadow-blue-900/20"
                    : "bg-[#070b14] border-[#18233a] hover:bg-[#111a2e]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Globe2 className="h-4 w-4 text-[#38bdf8] shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white">Google Gemini 2.5</span>
                    <span className="text-[10px] text-slate-400">Neural spatial reasoning</span>
                  </div>
                </div>
                {modelMode === "cloud" && <Check className="h-4 w-4 text-[#38bdf8]" />}
              </button>

              {/* Local Edge Heuristics */}
              <button
                onClick={() => { setModelMode("local"); showToast("Engine: Local Edge Heuristics"); }}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  modelMode === "local"
                    ? "bg-[#18233a] border-[#2563eb] ring-1 ring-[#2563eb] shadow-md shadow-blue-900/20"
                    : "bg-[#070b14] border-[#18233a] hover:bg-[#111a2e]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white">Edge Heuristics</span>
                    <span className="text-[10px] text-slate-400">Deterministic fallback</span>
                  </div>
                </div>
                {modelMode === "local" && <Check className="h-4 w-4 text-emerald-400]" />}
              </button>
            </div>
          </div>

          {/* Detection Sensitivity Slider */}
          <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#18233a] flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Minimum Flame Confidence Filter:</span>
              <span className="font-mono font-bold text-rose-400">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={confidenceThreshold}
              onChange={(e) => handleConfidenceChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
            />
            <span className="text-[10px] text-slate-400">
              Only anomalies exceeding {confidenceThreshold}% confidence are flagged for tactical intervention.
            </span>
          </div>
        </div>

        {/* MODULE 2: TACTICAL ALERTS & CONTAINMENT DISPATCH */}
        <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${
          isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/30">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Bell className="h-4 w-4 text-rose-400" />
              <span>Emergency Dispatch & Suppression</span>
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 font-bold border border-rose-500/30">
              Protocols Armed
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Audible Siren Toggle */}
            <div className="p-3 rounded-xl bg-[#070b14] border border-[#18233a] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                {audioAlerts ? (
                  <Volume2 className="h-4 w-4 text-[#38bdf8]" />
                ) : (
                  <VolumeX className="h-4 w-4 text-slate-500" />
                )}
                <div className="flex flex-col">
                  <span className="font-bold text-white">Critical Alert Siren</span>
                  <span className="text-[10px] text-slate-400">Audio beacon on Level 1 CRITICAL events</span>
                </div>
              </div>

              <button
                onClick={handleAudioToggle}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  audioAlerts ? "bg-[#2563eb]" : "bg-slate-700"
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  audioAlerts ? "left-4.5" : "left-0.5"
                }`} />
              </button>
            </div>

            {/* Auto Deluge Firebreak Activation */}
            <div className="p-3 rounded-xl bg-[#070b14] border border-[#18233a] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <div className="flex flex-col">
                  <span className="font-bold text-white">Auto-Deploy Deluge Foam Barrier</span>
                  <span className="text-[10px] text-slate-400">Trigger 1200 LPM curtain if asset distance &lt; 200m</span>
                </div>
              </div>

              <button
                onClick={handleDelugeToggle}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  autoDeluge ? "bg-cyan-500" : "bg-slate-700"
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  autoDeluge ? "left-4.5" : "left-0.5"
                }`} />
              </button>
            </div>

            {/* Autonomous DEOC Dispatch Broadcast */}
            <div className="p-3 rounded-xl bg-[#070b14] border border-[#18233a] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Radio className="h-4 w-4 text-amber-400" />
                <div className="flex flex-col">
                  <span className="font-bold text-white">Autonomous DEOC Alert Broadcast</span>
                  <span className="text-[10px] text-slate-400">Instantly notify State Emergency Operations</span>
                </div>
              </div>

              <button
                onClick={handleDeocToggle}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  autoDeocDispatch ? "bg-amber-500" : "bg-slate-700"
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  autoDeocDispatch ? "left-4.5" : "left-0.5"
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* MODULE 3: ORBITAL TELEMETRY & SYNC FREQUENCY */}
        <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${
          isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/30">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Radio className="h-4 w-4 text-[#38bdf8]" />
              <span>Orbital Telemetry Stream</span>
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>WebSocket 2.4 GHz</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-slate-300">
              Satellite Sensor Ingestion Cycle:
            </span>

            <div className="grid grid-cols-4 gap-2">
              {["10s", "15s", "30s", "60s"].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSyncRateChange(rate)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    syncRate === rate
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-[#070b14] border border-[#18233a] text-slate-300 hover:bg-[#141d33]"
                  }`}
                >
                  {rate}
                </button>
              ))}
            </div>
          </div>

          {/* System API Health Diagnostic Row */}
          <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#18233a] flex items-center justify-between mt-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">System API Connectivity</span>
              <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                {apiStatus || "Endpoints: /api/hotspots, /api/synthesize, /api/health"}
              </span>
            </div>

            <button
              onClick={testApiConnection}
              disabled={isTestingApi}
              className="px-3 py-1.5 rounded-lg bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingApi ? "animate-spin" : ""}`} />
              <span>Test Ping</span>
            </button>
          </div>
        </div>

        {/* MODULE 4: OPERATOR CLEARANCE & GUIDED TOOLS */}
        <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${
          isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/30">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-purple-400" />
              <span>Operator Profile & Clearance</span>
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
              Verified
            </span>
          </div>

          {currentUser ? (
            <div className="p-3 rounded-xl bg-[#070b14] border border-[#18233a] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">{currentUser.name}</span>
                <span className="text-[11px] text-[#38bdf8] font-medium">{currentUser.role.replace("_", " ")}</span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">{currentUser.email}</span>
              </div>

              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-[#38bdf8] flex items-center justify-center font-bold text-sm">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-[#070b14] border border-[#18233a] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Default Terminal Operator</span>
                <span className="text-[11px] text-slate-400">Authenticated via Local Defense Node</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold">ACTIVE</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="p-2.5 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-xs font-semibold text-cyan-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Replay Onboarding Tour</span>
              </button>
            )}

            {setActiveScreen && (
              <button
                onClick={() => setActiveScreen("about")}
                className="p-2.5 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>About & Pipeline</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
