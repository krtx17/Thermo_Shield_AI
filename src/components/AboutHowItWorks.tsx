import React from "react";
import {
  Shield,
  Layers,
  Cpu,
  Scan,
  Activity,
  Globe,
  Radio,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wind,
  Lock,
  Compass,
  Zap,
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
      title: "Spaceborne Constellation Ingestion",
      subtitle: "Low-Earth-Orbit Multi-Spectral Feeds",
      icon: Globe,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/30",
      description:
        "Continuous ingestion from VIIRS (375m I-Band thermal radiant flux) and Sentinel-2 (10m multi-spectral optical/SWIR). Automatically captures regional surface brightness temperature in Kelvin across high-priority industrial corridors.",
      specs: ["VIIRS I4 (3.74µm) & I5 (11.45µm)", "Sentinel-2 MSI B12 (SWIR 2.19µm)", "Automated 15-minute orbit refresh"]
    },
    {
      step: "02",
      title: "Computer Vision & Spectral Decomposition",
      subtitle: "YOLOv11-Thermal & NBR Carbonization",
      icon: Scan,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10 border-rose-500/30",
      description:
        "Custom-trained YOLOv11-Thermal neural network segments active flame cores, smoke aerosols, and vulnerable facility tanks with sub-20ms latency. Calculates SWIR/NIR hydrocarbon ratios and Normalized Burn Ratio (NBR) indices.",
      specs: ["Sub-20ms inference latency (67 FPS)", "SWIR/NIR ratio hydrocarbon fingerprinting", "Pixel-level thermal plume segmentation"]
    },
    {
      step: "03",
      title: "Gemini 2.5 Flash Spatial Intelligence",
      subtitle: "Multimodal Facility Proximity Reasoning",
      icon: Cpu,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10 border-purple-500/30",
      description:
        "Google Gemini 2.5 Flash correlates thermal hotspots with OpenStreetMap (OSM) critical infrastructure vectors. Evaluates local atmospheric wind vectors to predict plume dispersion and filters out routine industrial flares or slag cooling.",
      specs: ["Spatial buffer distance calculations", "Atmospheric wind vector trajectory modeling", "Heuristic false-alarm rejection engine"]
    },
    {
      step: "04",
      title: "Multi-Factor Threat Matrix & Scoring",
      subtitle: "Dynamic 0-100 Flashover Risk Engine",
      icon: Activity,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/30",
      description:
        "Synthesizes Fire Radiative Power (MW), refinery proximity probability, active flame confidence, and historical 30-day thermal acceleration into a unified Risk Score (0–100) with dynamic Time-to-Asset Impact countdowns.",
      specs: ["CRITICAL (>70), HIGH (>50), MODERATE (>35)", "Automated BLEVE risk calculation", "Calculated Time-to-Impact (ETA)"]
    },
    {
      step: "05",
      title: "Autonomous Containment & DEOC Dispatch",
      subtitle: "Emergency Response & Deluge Activation",
      icon: Radio,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/30",
      description:
        "Instantly triggers automated dispatch alerts to State Disaster Emergency Operations Centers (DEOC) and industrial safety marshals. Engages high-pressure perimeter deluge curtains to arrest fire progression before structural breach.",
      specs: ["Priority 1 DEOC automated broadcast", "Perimeter deluge barrier activation (1200 LPM)", "Cryptographic tamper-evident audit ledger"]
    }
  ];

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-8 max-w-7xl mx-auto ${isDark ? "text-white" : "text-slate-900"}`}>
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER */}
      {/* ========================================================================= */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all ${
        isDark ? "bg-[#0b101d] border-[#18233a] shadow-2xl shadow-blue-950/30" : "bg-white border-slate-200 shadow-xl"
      }`}>
        <div className="relative z-10 flex flex-col gap-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/15 border border-blue-500/30 text-[#38bdf8] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Autonomous Satellite Thermal Defense
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              v1.2.0 Production Standard
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Protecting Critical Infrastructure from Above Before Catastrophic Flashover
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Thermo Shield AI is a space-to-ground autonomous defense system combining low-Earth-orbit multispectral satellite constellations, real-time computer vision, and neural reasoning to detect industrial hydrocarbon fires and wildfires in under 3 seconds.
          </p>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {setActiveScreen && (
              <button
                onClick={() => setActiveScreen("computer-vision")}
                className="px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <Scan className="w-4 h-4" />
                <span>Open Computer Vision Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {setActiveScreen && (
              <button
                onClick={() => setActiveScreen("live-demo")}
                className="px-4 py-2.5 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Test Tactical Spread Sandbox</span>
              </button>
            )}

            {setActiveScreen && (
              <button
                onClick={() => setActiveScreen("command-center")}
                className="px-4 py-2.5 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4 text-blue-400" />
                <span>3D Live Global Map</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 2. THE PROBLEM & SOLUTION COMPARISON */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Legacy / Conventional Systems */}
        <div className={`p-6 rounded-2xl border flex flex-col gap-3 ${
          isDark ? "bg-[#0b101d] border-rose-900/30" : "bg-white border-rose-200 shadow-md"
        }`}>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Conventional Fire Safety Limitations</span>
          </div>
          
          <h3 className="text-lg font-bold text-white">Delayed Point Detection Causes BLEVE Disasters</h3>
          
          <ul className="flex flex-col gap-2.5 text-xs text-slate-300 leading-relaxed mt-1">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>Point-Source Lag:</strong> Optical smoke detectors and heat cables only trigger after flames physically breach enclosures (often 15–20 minutes late).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>No Atmospheric Context:</strong> Ground sensors cannot model downwind aerosol spread or structural flashover risks toward adjacent tanks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>Nuisance False Alarms:</strong> Routine hydrocarbon flares and hot exhaust trigger costly shutdowns due to lack of spectral validation.</span>
            </li>
          </ul>
        </div>

        {/* The Thermo Shield Solution */}
        <div className={`p-6 rounded-2xl border flex flex-col gap-3 ${
          isDark ? "bg-[#0b101d] border-emerald-900/30" : "bg-white border-emerald-200 shadow-md"
        }`}>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>The Thermo Shield Paradigm</span>
          </div>

          <h3 className="text-lg font-bold text-white">Autonomous Space-to-Ground Early Warning</h3>

          <ul className="flex flex-col gap-2.5 text-xs text-slate-300 leading-relaxed mt-1">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Orbital Radiant Power (FRP):</strong> Identifies 30+ MW thermal anomalies from space before smoke breaches visual thresholds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Multispectral Computer Vision:</strong> YOLOv11 and SWIR band decomposition isolate hydrocarbon burns with 94.8% mAP precision.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Autonomous DEOC Activation:</strong> Dispatches emergency alerts and triggers automated deluge barriers in under 3 seconds.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS: 5-STAGE END-TO-END PIPELINE */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
            End-to-End Operational Workflow
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
            How Thermo Shield AI Operates
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {pipelineStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className={`p-5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all ${
                  isDark ? "bg-[#0b101d] border-[#18233a] hover:border-[#2563eb]/50" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                {/* Step badge & icon */}
                <div className="flex items-start sm:items-center gap-4 shrink-0">
                  <span className="text-2xl font-black font-mono text-slate-600">
                    {stage.step}
                  </span>

                  <div className={`p-3 rounded-2xl border ${stage.bgColor} ${stage.color} shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-base font-bold text-white">
                      {stage.title}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      {stage.subtitle}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {stage.description}
                </p>

                {/* Specs pills */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-1.5 shrink-0 text-[11px] font-mono">
                  {stage.specs.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#070b14] border border-[#1e2c4a] text-slate-300"
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
      <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col gap-6 ${
        isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
      }`}>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Defense-Grade Infrastructure
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
            Technical Specifications & Clearance Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-[#070b14] border border-[#1e2c4a] flex flex-col gap-2">
            <span className="font-bold text-[#38bdf8] flex items-center gap-1.5">
              <Globe className="w-4 h-4" /> Spaceborne Sensors
            </span>
            <ul className="text-slate-400 flex flex-col gap-1 leading-relaxed">
              <li>• VIIRS Suomi-NPP 375m I-Band</li>
              <li>• Sentinel-2 MSI Multi-Spectral</li>
              <li>• MODIS Terra & Aqua Infrared</li>
              <li>• High-Resolution Drone FLIR (4K)</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#070b14] border border-[#1e2c4a] flex flex-col gap-2">
            <span className="font-bold text-rose-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> AI & Computer Vision
            </span>
            <ul className="text-slate-400 flex flex-col gap-1 leading-relaxed">
              <li>• Google Gemini 2.5 Flash Vision</li>
              <li>• YOLOv11-Thermal Object Detection</li>
              <li>• NBR & SWIR/NIR Ratio Spectral</li>
              <li>• Semantic Plume Segmentation</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#070b14] border border-[#1e2c4a] flex flex-col gap-2">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Server className="w-4 h-4" /> Real-Time Engine
            </span>
            <ul className="text-slate-400 flex flex-col gap-1 leading-relaxed">
              <li>• Node.js & Express REST Backend</li>
              <li>• PostgreSQL & PostGIS Spatial DB</li>
              <li>• WebSocket 2.4 GHz Telemetry Hub</li>
              <li>• Sub-20ms In-Memory Pipeline</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#070b14] border border-[#1e2c4a] flex flex-col gap-2">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> Security & Audit
            </span>
            <ul className="text-slate-400 flex flex-col gap-1 leading-relaxed">
              <li>• HMAC SHA-256 JWT Clearances</li>
              <li>• Multi-Role Operator Permissions</li>
              <li>• Tamper-Evident SHA-256 Ledger</li>
              <li>• DEOC Emergency Webhook Protocol</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
