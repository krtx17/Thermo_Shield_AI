import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  Server, 
  Cpu, 
  Database, 
  Map, 
  Sparkles, 
  Flame, 
  Clock, 
  ChevronRight,
  Radio,
  FileText,
  Sliders
} from "lucide-react";

interface DemoStep {
  id: string;
  name: string;
  status: "pending" | "processing" | "completed" | "warning";
  duration: number;
  description: string;
}

interface DemoLog {
  timestamp: string;
  message: string;
  type: "info" | "success" | "warn" | "ai";
}

interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  asset: string;
  location: string;
  activeFlameProb: number;
  refineryProximityProb: number;
  initialScore: number;
  sensors: string[];
  steps: DemoStep[];
  aiReasoning: string[];
  resultMetrics: {
    confidence: string;
    signals: number;
    responseTime: string;
    riskDelta: string;
    mitigationAction: string;
  };
}

const DEMO_SCENARIOS: Scenario[] = [
  {
    id: "scen-refinery",
    title: "Scenario A: Coastal Refinery Distillation Fire",
    subtitle: "High-priority industrial hydrocarbon refining zone",
    asset: "Paradip Coastal Petrochemical Enclave",
    location: "Odisha Industrial Corridor (20.1234° N, 85.7654° E)",
    activeFlameProb: 91.2,
    refineryProximityProb: 88.5,
    initialScore: 78.4,
    sensors: ["VIIRS-FRP", "OSM-GEO", "SENTINEL-L2A", "TEMPORAL-REC"],
    steps: [
      { id: "ingest", name: "Satellite Data Ingestion", status: "pending", duration: 1200, description: "Ingesting VIIRS 375m and Sentinel-2 multispectral bands" },
      { id: "validate", name: "Thermal Verification", status: "pending", duration: 1500, description: "Cross-validating 342 MW thermal radiant power against baseline" },
      { id: "analyze", name: "Spectral Indices Analysis", status: "pending", duration: 1800, description: "Calculating NBR burn index (0.74) and SWIR/NIR ratio (2.81)" },
      { id: "reason", name: "AI Threat Classification", status: "pending", duration: 2200, description: "Gemini 2.5 Flash evaluating plume spread and facility proximity" },
      { id: "decision", name: "Priority Determination", status: "pending", duration: 1400, description: "Calculated risk score 78.4/100 (CRITICAL threshold exceeded)" },
      { id: "execute", name: "Automated Dispatch Alert", status: "pending", duration: 1200, description: "Broadcasting emergency alert to DEOC and refinery dispatch" }
    ],
    aiReasoning: [
      "Thermal radiance of 342 MW confirmed at 412m from distillation units.",
      "SWIR/NIR ratio of 2.81 validates high-intensity hydrocarbon combustion.",
      "Multi-day temporal trend reveals +12.3 MW/week acceleration.",
      "AI Classification: Active industrial petrochemical fire confirmed with 91.2% confidence."
    ],
    resultMetrics: {
      confidence: "91.2%",
      signals: 47,
      responseTime: "2.4s",
      riskDelta: "+78.4 Pts",
      mitigationAction: "Immediate fire suppression dispatch notified (DEOC Priority 1)."
    }
  },
  {
    id: "scen-chemical",
    title: "Scenario B: Polymer Plant Thermal Anomaly",
    subtitle: "Moderate hazard specialty chemical corridor",
    asset: "Dahej Special Economic Chemical Zone",
    location: "Gujarat Petrochem Belt (21.7051° N, 72.5857° E)",
    activeFlameProb: 84.6,
    refineryProximityProb: 55.2,
    initialScore: 51.2,
    sensors: ["VIIRS-FRP", "OSM-GEO", "SENTINEL-L2A"],
    steps: [
      { id: "ingest", name: "Satellite Data Ingestion", status: "pending", duration: 1100, description: "Ingesting Dahej thermal sensor fields" },
      { id: "validate", name: "Thermal Verification", status: "pending", duration: 1400, description: "Verifying surface temperature deviations" },
      { id: "analyze", name: "Spectral Indices Analysis", status: "pending", duration: 1600, description: "Calculating carbonization index using NBR" },
      { id: "reason", name: "AI Threat Classification", status: "pending", duration: 2000, description: "AI analyzing plume trajectory relative to storage tanks" },
      { id: "decision", name: "Priority Determination", status: "pending", duration: 1500, description: "Evaluating score: 51.2/100 (HIGH RISK advisory)" },
      { id: "execute", name: "Automated Dispatch Alert", status: "pending", duration: 1300, description: "Issuing advisory notification to site supervisors" }
    ],
    aiReasoning: [
      "Thermal power estimated at 144 MW within 1,302m of polymer storage.",
      "Moderate thermal boundary containment observed.",
      "AI Classification: Chemical byproduct flare with elevated containment risk."
    ],
    resultMetrics: {
      confidence: "88.6%",
      signals: 22,
      responseTime: "3.2s",
      riskDelta: "+51.2 Pts",
      mitigationAction: "Preventative advisory dispatched to site safety marshals."
    }
  },
  {
    id: "scen-forest",
    title: "Scenario C: Controlled Agricultural Residue",
    subtitle: "Low-hazard rural farmland clearing",
    asset: "Nagpur Rural Farmland Perimeter",
    location: "Maharashtra Central Corridor (21.1458° N, 79.0882° E)",
    activeFlameProb: 15.4,
    refineryProximityProb: 5.0,
    initialScore: 18.1,
    sensors: ["VIIRS-FRP"],
    steps: [
      { id: "ingest", name: "Satellite Data Ingestion", status: "pending", duration: 900, description: "Capturing regional thermal indicators" },
      { id: "validate", name: "Thermal Verification", status: "pending", duration: 1100, description: "Analyzing 31.2 MW localized heat signature" },
      { id: "analyze", name: "Spectral Indices Analysis", status: "pending", duration: 1300, description: "High NDVI (0.45) confirms rural cropland environment" },
      { id: "reason", name: "AI Threat Classification", status: "pending", duration: 1500, description: "No industrial infrastructure within 3.2km radius" },
      { id: "decision", name: "Priority Determination", status: "pending", duration: 1200, description: "Score: 18.1/100 (MONITORED - No threat)" },
      { id: "execute", name: "Automated Dispatch Alert", status: "pending", duration: 1000, description: "Logged to automated seasonal records" }
    ],
    aiReasoning: [
      "Localized thermal signature of 31.2 MW decaying rapidly.",
      "Cropland terrain with zero critical industrial infrastructure nearby.",
      "AI Classification: Controlled seasonal biomass clearing. No emergency action needed."
    ],
    resultMetrics: {
      confidence: "98.1%",
      signals: 8,
      responseTime: "1.9s",
      riskDelta: "0.0 Pts",
      mitigationAction: "Logged in routine agricultural monitoring registry."
    }
  }
];

export default function LiveDemo({ theme }: { theme: "light" | "dark" }) {
  const [selectedScen, setSelectedScen] = useState<Scenario>(DEMO_SCENARIOS[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [steps, setSteps] = useState<DemoStep[]>(DEMO_SCENARIOS[0].steps);
  const [logs, setLogs] = useState<DemoLog[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetDemo = (scen: Scenario) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setActiveStepIndex(-1);
    setShowResults(false);
    setSteps(scen.steps.map(s => ({ ...s, status: "pending" })));
    setLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        message: `Simulation initialized for ${scen.title}.`,
        type: "info"
      }
    ]);
  };

  useEffect(() => {
    resetDemo(selectedScen);
  }, [selectedScen]);

  const addLog = (message: string, type: DemoLog["type"]) => {
    setLogs(prev => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type
      }
    ]);
  };

  const runNextStep = (index: number) => {
    if (index >= steps.length) {
      setIsRunning(false);
      setShowResults(true);
      addLog("Simulation completed: All pipeline stages verified.", "success");
      return;
    }

    setSteps(prev => prev.map((s, i) => {
      if (i < index) return { ...s, status: "completed" };
      if (i === index) return { ...s, status: "processing" };
      return { ...s, status: "pending" };
    }));
    setActiveStepIndex(index);

    const currentStep = steps[index];
    addLog(`Running: ${currentStep.name}...`, "info");

    if (currentStep.id === "reason") {
      selectedScen.aiReasoning.forEach((reason, i) => {
        setTimeout(() => {
          addLog(`AI Reasoning: ${reason}`, "ai");
        }, i * 350);
      });
    }

    timerRef.current = setTimeout(() => {
      addLog(`Completed: ${currentStep.name}`, "success");
      runNextStep(index + 1);
    }, currentStep.duration);
  };

  const handleStartPause = () => {
    if (isRunning) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      runNextStep(activeStepIndex >= 0 ? activeStepIndex + 1 : 0);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Simulation Engine</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Test satellite ingestion, AI classification, and emergency response workflows
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartPause}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isRunning
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-blue-600/20"
            }`}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
            <span>{isRunning ? "Pause Simulation" : "Run Simulation"}</span>
          </button>

          <button
            onClick={() => resetDemo(selectedScen)}
            className="p-2 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {DEMO_SCENARIOS.map((scen) => (
          <button
            key={scen.id}
            onClick={() => setSelectedScen(scen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedScen.id === scen.id
                ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/20"
                : "bg-[#0f172a] border border-[#1e2c4a] text-slate-300 hover:text-white hover:bg-[#141d33]"
            }`}
          >
            {scen.title.split(":")[0]} — {scen.asset.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Active Scenario Overview Card */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">{selectedScen.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{selectedScen.subtitle}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">
            Score: {selectedScen.initialScore}/100
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block">Facility:</span>
            <span className="font-semibold text-white truncate block">{selectedScen.asset}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Location:</span>
            <span className="font-semibold text-white truncate block">{selectedScen.location}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Flame Probability:</span>
            <span className="font-semibold text-rose-400">{selectedScen.activeFlameProb}%</span>
          </div>
          <div>
            <span className="text-slate-400 block">Refinery Proximity:</span>
            <span className="font-semibold text-white">{selectedScen.refineryProximityProb}%</span>
          </div>
        </div>
      </div>

      {/* Pipeline Steps & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Step Progress List */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex flex-col gap-3">
          <h2 className="text-sm font-bold text-white tracking-tight pb-2 border-b border-slate-800">
            Pipeline Verification Stages
          </h2>

          <div className="flex flex-col gap-2.5">
            {steps.map((step, idx) => {
              const isDone = step.status === "completed";
              const isCurrent = step.status === "processing";

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isCurrent
                      ? "bg-[#18233a] border-[#2563eb] shadow-md shadow-blue-900/20"
                      : isDone
                        ? "bg-[#111a2e] border-emerald-500/30 text-slate-300"
                        : "bg-[#0b101d] border-[#18233a] text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                          ? "bg-[#2563eb] text-white animate-pulse"
                          : "bg-slate-800 text-slate-400"
                    }`}>
                      {isDone ? "✓" : idx + 1}
                    </div>

                    <div className="flex flex-col">
                      <span className={`text-xs font-semibold ${isCurrent ? "text-white" : isDone ? "text-slate-200" : "text-slate-400"}`}>
                        {step.name}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[280px]">
                        {step.description}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400">
                    {step.duration / 1000}s
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Execution Logs */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e2c4a] shadow-md flex flex-col">
          <h2 className="text-sm font-bold text-white tracking-tight pb-2 border-b border-slate-800">
            Live Execution Stream
          </h2>

          <div className="flex-1 max-h-[360px] overflow-y-auto py-3 flex flex-col gap-2">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                  log.type === "ai"
                    ? "bg-purple-950/20 border-purple-800/40 text-purple-300"
                    : log.type === "success"
                      ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                      : "bg-[#111a2e] border-[#1e2c4a] text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-400">
                  <span>{log.timestamp}</span>
                  <span>•</span>
                  <span className="uppercase font-semibold">{log.type}</span>
                </div>
                <div>{log.message}</div>
              </div>
            ))}
          </div>

          {showResults && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 mt-3 flex items-center justify-between">
              <span className="font-semibold">All verification steps passed successfully.</span>
              <span className="font-bold text-white">{selectedScen.resultMetrics.confidence}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
