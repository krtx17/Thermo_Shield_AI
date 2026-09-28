import React from "react";
import {
  Shield,
  Layers,
  Cpu,
  Scan,
  Activity,
  Globe,
  Radio,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Server
} from "lucide-react";
import { ActiveScreen } from "../types";

export default function AboutHowItWorks({
  theme,
  setActiveScreen
}: {
  theme: "light" | "dark";
  setActiveScreen?: (screen: ActiveScreen) => void;
}) {
  const isDark = theme === "dark";

  const pipelineStages = [
    {
      step: "01",
      title: "Spaceborne Satellite Ingestion",
      subtitle: "Low-Earth-Orbit Feeds",
      icon: Globe,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/30",
      description:
        "Continuous ingestion from VIIRS (375m I-Band thermal flux) and Sentinel-2 (10m optical/SWIR) with automated 15-minute orbital refresh.",
      specs: ["VIIRS I4/I5 thermal radiant flux", "Sentinel-2 MSI B12 SWIR", "15-minute orbital refresh"]
    },
    {
      step: "02",
      title: "Backend Multispectral Computer Vision",
      subtitle: "YOLOv11 & Spectral Decomposition",
      icon: Scan,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10 border-rose-500/30",
      description:
        "Sub-20ms neural processing runs in the backend to segment active flame cores, smoke aerosols, and vulnerable facility tanks.",
      specs: ["Sub-20ms inference latency", "SWIR/NIR ratio hydrocarbon analysis", "NBR burn severity indexing"]
    },
    {
      step: "03",
      title: "Spatial AI & Flare Filtering",
      subtitle: "Gemini 2.5 Spatial Intelligence",
      icon: Cpu,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10 border-purple-500/30",
      description:
        "Correlates thermal coordinates with OSM facility vectors, models wind plume dispersion, and rejects routine flare false alarms.",
      specs: ["Facility buffer calculations", "Wind vector dispersion modeling", "Routine flare rejection engine"]
    },
    {
      step: "04",
      title: "Threat Matrix & Risk Scoring",
      subtitle: "Dynamic 0–100 Flashover Engine",
      icon: Activity,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/30",
      description:
        "Synthesizes Fire Radiative Power (MW), tank proximity, and wind vectors into a unified 0–100 Threat Score and impact ETA.",
      specs: ["CRITICAL (>70), HIGH (>50)", "Automated BLEVE risk calculation", "Calculated Time-to-Impact"]
    },
    {
      step: "05",
      title: "Autonomous Containment & DEOC Dispatch",
      subtitle: "Emergency Response & Deluge Activation",
      icon: Radio,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/30",
      description:
        "Instantly triggers automated dispatch alerts to State DEOC and deploys high-pressure deluge curtains (1200 LPM) to halt fire spread.",
      specs: ["Priority 1 DEOC automated alert", "Perimeter deluge activation (1200 LPM)", "Cryptographic tamper-evident audit ledger"]
    }
  ];

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto ${isDark ? "text-white" : "text-slate-900"}`}>
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER */}
      {/* ========================================================================= */}
      <div className={`p-6 sm:p-7 rounded-3xl border relative overflow-hidden transition-all ${
        isDark ? "bg-[#0b101d] border-[#18233a] shadow-xl" : "bg-white border-slate-200 shadow-md"
      }`}>
        <div className="relative z-10 flex flex-col gap-3.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/15 border border-blue-500/30 text-[#38bdf8] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Autonomous Satellite Thermal Defense
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              v1.2.0 Production
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            Autonomous Space-to-Ground Early Warning Network
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Thermo Shield AI combines low-Earth-orbit satellite constellations, backend computer vision, and neural spatial reasoning to detect industrial thermal flashovers in under 3 seconds.
          </p>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {setActiveScreen && (
              <button
                onClick={() => setActiveScreen("command-center")}
                className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-600/30"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Open 3D Live Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {setActiveScreen && (
              <button
                onClick={() => setActiveScreen("live-demo")}
                className="px-4 py-2 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulation Sandbox</span>
              </button>
            )}

            {setActiveScreen && (
              <button
                onClick={() => setActiveScreen("active-investigations")}
                className="px-4 py-2 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                <span>Active Alerts</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 2. THE PROBLEM & SOLUTION COMPARISON */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Legacy Systems */}
        <div className={`p-5 rounded-2xl border flex flex-col gap-2.5 ${
          isDark ? "bg-[#0b101d] border-rose-900/30" : "bg-white border-rose-200 shadow-sm"
        }`}>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Conventional Fire Safety Limitations</span>
          </div>
          
          <h3 className="text-base font-bold text-white">Delayed Point Detection Risks Flashover</h3>
          
          <ul className="flex flex-col gap-2 text-xs text-slate-300 leading-relaxed mt-0.5">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>Point-Source Lag:</strong> Detectors trigger 15–20 minutes late after flame breaches enclosure.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>No Atmospheric Modeling:</strong> Ground sensors cannot predict downwind aerosol dispersion.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>Nuisance False Alarms:</strong> Routine industrial flaring triggers costly false shutdowns.</span>
            </li>
          </ul>
        </div>

        {/* Thermo Shield Solution */}
        <div className={`p-5 rounded-2xl border flex flex-col gap-2.5 ${
          isDark ? "bg-[#0b101d] border-emerald-900/30" : "bg-white border-emerald-200 shadow-sm"
        }`}>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>The Thermo Shield Paradigm</span>
          </div>

          <h3 className="text-base font-bold text-white">Autonomous Space-to-Ground Early Warning</h3>

          <ul className="flex flex-col gap-2 text-xs text-slate-300 leading-relaxed mt-0.5">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Orbital Radiant Flux:</strong> Identifies 30+ MW thermal anomalies before visible smoke breach.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Backend Multispectral CV:</strong> YOLOv11 and SWIR band decomposition isolate hydrocarbon burns.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Autonomous Containment:</strong> Dispatches DEOC alerts and engages deluge barriers in &lt;3s.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS: 5-STAGE PIPELINE */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
            Operational Workflow
          </span>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
            End-to-End Autonomous Pipeline
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {pipelineStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                  isDark ? "bg-[#0b101d] border-[#18233a] hover:border-[#2563eb]/50" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                {/* Step badge & icon */}
                <div className="flex items-start sm:items-center gap-3.5 shrink-0">
                  <span className="text-xl font-black font-mono text-slate-600">
                    {stage.step}
                  </span>

                  <div className={`p-2.5 rounded-xl border ${stage.bgColor} ${stage.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-white">
                      {stage.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {stage.subtitle}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  {stage.description}
                </p>

                {/* Specs pills */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-1 shrink-0 text-[10px] font-mono">
                  {stage.specs.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#070b14] border border-[#1e2c4a] text-slate-300"
                    >
                      • {spec}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SYSTEM ARCHITECTURE & TECH SPECS */}
      {/* ========================================================================= */}
      <div className={`p-5 sm:p-6 rounded-3xl border flex flex-col gap-4 ${
        isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
      }`}>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Defense Specifications
          </span>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
            Architecture & Clearance Specifications
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1e2c4a] flex flex-col gap-1.5">
            <span className="font-bold text-[#38bdf8] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Sensors
            </span>
            <ul className="text-slate-400 flex flex-col gap-1 leading-relaxed text-[11px]">
              <li>• VIIRS Suomi-NPP 375m I-Band</li>
              <li>• Sentinel-2 MSI Multi-Spectral</li>
              <li>• Drone FLIR Thermal Feeds</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1e2c4a] flex flex-col gap-1.5">
            <span className="font-bold text-rose-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Backend AI
            </span>
            <ul className="text-slate-400 flex flex-col gap-1 leading-relaxed text-[11px]">
              <li>• Google Gemini 2.5 Flash Vision</li>
              <li>• YOLOv11-Thermal Object Detection</li>
              <li>• SWIR/NIR & NBR Spectral Index</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1e2c4a] flex flex-col gap-1.5">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" /> Engine
            </span>
            <ul className="text-slate-400 flex flex-col gap-1 leading-relaxed text-[11px]">
              <li>• Node.js & Express REST Backend</li>
              <li>• PostGIS Spatial Telemetry Engine</li>
              <li>• Sub-20ms In-Memory Pipeline</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1e2c4a] flex flex-col gap-1.5">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Security
            </span>
            <ul className="text-slate-400 flex flex-col gap-1 leading-relaxed text-[11px]">
              <li>• HMAC SHA-256 JWT Clearances</li>
              <li>• Tamper-Evident Audit Ledger</li>
              <li>• DEOC Emergency Webhook Protocol</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
