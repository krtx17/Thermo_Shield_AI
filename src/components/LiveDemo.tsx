import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Flame,
  Wind,
  Droplets,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Radio,
  Activity,
  Cpu,
  Server,
  AlertTriangle,
  CheckCircle2,
  Crosshair,
  Navigation,
  Thermometer,
  Zap,
  Sliders,
  Layers,
  ChevronRight,
  Info,
  Clock,
  Compass,
  FileText
} from "lucide-react";

interface FacilityAsset {
  id: string;
  name: string;
  type: "sphere" | "tower" | "building" | "pipeline" | "water_tank";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  flashpoint: string;
  substance: string;
  nominalTemp: string;
  description: string;
}

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
  type: "info" | "success" | "warn" | "ai" | "telemetry";
}

interface TacticalScenario {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  asset: string;
  location: string;
  coordinates: string;
  activeFlameProb: number;
  refineryProximityProb: number;
  initialScore: number;
  baselineFRP: number;
  peakFRP: number;
  sensors: string[];
  defaultWindHeading: number;
  defaultWindSpeed: number;
  defaultDryness: number;
  fireOrigin: { x: number; y: number };
  barrierLine: { x1: number; y1: number; x2: number; y2: number };
  assets: FacilityAsset[];
  steps: DemoStep[];
  aiReasoning: string[];
  resultMetrics: {
    confidence: string;
    signals: number;
    responseTime: string;
    riskDelta: string;
    mitigationAction: string;
    containmentEta: string;
  };
  flirReadout: {
    maxTemp: string;
    centroidLat: string;
    targetId: string;
    spectralBand: string;
  };
}

const TACTICAL_SCENARIOS: TacticalScenario[] = [
  {
    id: "scen-refinery",
    code: "SCEN-A",
    title: "Scenario A: Coastal Refinery Distillation Fire",
    subtitle: "High-priority industrial hydrocarbon refining zone",
    asset: "Paradip Coastal Petrochemical Enclave",
    location: "Odisha Industrial Corridor",
    coordinates: "20.1234° N, 85.7654° E",
    activeFlameProb: 91.2,
    refineryProximityProb: 88.5,
    initialScore: 78.4,
    baselineFRP: 85,
    peakFRP: 342,
    sensors: ["VIIRS-FRP", "OSM-GEO", "SENTINEL-L2A", "TEMPORAL-REC"],
    defaultWindHeading: 68,
    defaultWindSpeed: 28,
    defaultDryness: 65,
    fireOrigin: { x: 260, y: 220 },
    barrierLine: { x1: 370, y1: 110, x2: 370, y2: 330 },
    assets: [
      {
        id: "DC-401",
        name: "Distillation Column Alpha",
        type: "tower",
        x: 260,
        y: 220,
        width: 32,
        height: 52,
        flashpoint: "38°C (Naphtha)",
        substance: "Hydrocarbon Fractions",
        nominalTemp: "142°C",
        description: "Primary crude fractionator tower. Direct origin of thermal release."
      },
      {
        id: "T-101",
        name: "Pressurized Butane Sphere Alpha",
        type: "sphere",
        x: 430,
        y: 160,
        radius: 26,
        flashpoint: "-60°C (Liquefied Butane)",
        substance: "Liquefied Petroleum Gas",
        nominalTemp: "24°C",
        description: "High-pressure cryogenic storage vessel. Critical BLEVE risk if exposed."
      },
      {
        id: "T-102",
        name: "Naphtha Storage Sphere Beta",
        type: "sphere",
        x: 490,
        y: 270,
        radius: 28,
        flashpoint: "-20°C (Petroleum Naphtha)",
        substance: "Light Condensate",
        nominalTemp: "28°C",
        description: "Refinery feedstock reservoir. Located downwind of primary plume."
      },
      {
        id: "PS-01",
        name: "Emergency Water Deluge Pump Station",
        type: "water_tank",
        x: 180,
        y: 320,
        width: 36,
        height: 30,
        flashpoint: "N/A (Aqueous)",
        substance: "AFFF Foam & Seawater",
        nominalTemp: "21°C",
        description: "Supplies high-pressure deluge barrier cannons to facility perimeter."
      },
      {
        id: "CR-09",
        name: "Control Center & Muster Terminal",
        type: "building",
        x: 150,
        y: 140,
        width: 50,
        height: 38,
        flashpoint: "Structural Concrete",
        substance: "Operations Command",
        nominalTemp: "22°C",
        description: "On-site central telemetry hub and emergency operator shelter."
      }
    ],
    steps: [
      { id: "ingest", name: "Satellite Ingestion & VIIRS Telemetry", status: "pending", duration: 1300, description: "Ingesting VIIRS 375m I-Band thermal radiant flux and Sentinel-2 multispectral tiles." },
      { id: "validate", name: "Multi-Temporal Radiance Verification", status: "pending", duration: 1500, description: "Confirming 342 MW FRP surge against 7-day facility thermal baseline (85 MW)." },
      { id: "analyze", name: "Spectral Indices & NBR Carbonization", status: "pending", duration: 1800, description: "Computing SWIR/NIR ratio (2.81) and NBR burn severity (-0.44)." },
      { id: "reason", name: "Gemini 2.5 Flash Spatial Buffer Analysis", status: "pending", duration: 2200, description: "Evaluating atmospheric wind vector, plume spread velocity, and proximity to storage tanks." },
      { id: "decision", name: "Asset Flashover & Threat Score Engine", status: "pending", duration: 1600, description: "Risk Score: 78.4/100 (CRITICAL). Projected time to Tank Alpha exposure: 11m 40s." },
      { id: "execute", name: "Automated Dispatch & Deluge Barrier Activation", status: "pending", duration: 1400, description: "Broadcasting emergency priority alert to State DEOC and triggering perimeter deluge." }
    ],
    aiReasoning: [
      "Thermal radiance of 342 MW confirmed at 170m from Pressurized Butane Sphere T-101.",
      "SWIR/NIR ratio of 2.81 validates high-intensity hydrocarbon combustion rather than industrial flare.",
      "Atmospheric wind vector heading 68° ENE accelerates flame front toward storage zone at 14.2 m/min.",
      "AI Classification: Active industrial petrochemical fire confirmed with 91.2% confidence."
    ],
    resultMetrics: {
      confidence: "91.2%",
      signals: 47,
      responseTime: "2.4s",
      riskDelta: "+78.4 Pts",
      mitigationAction: "Deluge foam curtain deployed. Priority 1 DEOC suppression dispatched.",
      containmentEta: "11m 40s"
    },
    flirReadout: {
      maxTemp: "842°C",
      centroidLat: "20.1234° N, 85.7654° E",
      targetId: "FLIR-PARADIP-DC401",
      spectralBand: "SWIR / MIR 3.74µm"
    }
  },
  {
    id: "scen-chemical",
    code: "SCEN-B",
    title: "Scenario B: Polymer Plant Thermal Exotherm",
    subtitle: "Moderate hazard specialty chemical corridor",
    asset: "Dahej Special Economic Chemical Zone",
    location: "Gujarat Petrochem Belt",
    coordinates: "21.7051° N, 72.5857° E",
    activeFlameProb: 84.6,
    refineryProximityProb: 55.2,
    initialScore: 51.2,
    baselineFRP: 42,
    peakFRP: 144,
    sensors: ["VIIRS-FRP", "OSM-GEO", "SENTINEL-L2A"],
    defaultWindHeading: 142,
    defaultWindSpeed: 18,
    defaultDryness: 52,
    fireOrigin: { x: 270, y: 190 },
    barrierLine: { x1: 360, y1: 120, x2: 360, y2: 340 },
    assets: [
      {
        id: "PR-02",
        name: "Polymerization Reactor B",
        type: "tower",
        x: 270,
        y: 190,
        width: 34,
        height: 46,
        flashpoint: "85°C (Monomer Vapor)",
        substance: "Polyethylene Monomers",
        nominalTemp: "110°C",
        description: "High-pressure catalytic exothermic vessel experiencing heat runaway."
      },
      {
        id: "SS-01",
        name: "Volatile Solvent Silo 1",
        type: "sphere",
        x: 420,
        y: 170,
        radius: 25,
        flashpoint: "12°C (Acetone / Toluene)",
        substance: "Organic Solvents",
        nominalTemp: "26°C",
        description: "Intermediate chemical solvent storage requiring continuous vapor cooling."
      },
      {
        id: "CW-03",
        name: "Chemical Warehouse Gamma",
        type: "building",
        x: 400,
        y: 290,
        width: 58,
        height: 36,
        flashpoint: "Class II Combustible",
        substance: "Finished Polymer Resins",
        nominalTemp: "25°C",
        description: "Dry warehouse storage for palletized polymer compounds."
      },
      {
        id: "ET-01",
        name: "Effluent Treatment Sump",
        type: "water_tank",
        x: 170,
        y: 300,
        width: 44,
        height: 32,
        flashpoint: "Non-flammable",
        substance: "Neutralized Slurry",
        nominalTemp: "24°C",
        description: "Industrial water treatment basin and secondary fire retention buffer."
      }
    ],
    steps: [
      { id: "ingest", name: "Satellite Ingestion & VIIRS Telemetry", status: "pending", duration: 1100, description: "Ingesting Dahej thermal sensor field readings and Sentinel optical passes." },
      { id: "validate", name: "Multi-Temporal Radiance Verification", status: "pending", duration: 1400, description: "Detecting localized 144 MW radiant output spike exceeding baseline by +102 MW." },
      { id: "analyze", name: "Spectral Indices & NBR Carbonization", status: "pending", duration: 1600, description: "Calculating Normalized Burn Ratio (NBR: -0.28) and atmospheric aerosol drift." },
      { id: "reason", name: "Gemini 2.5 Flash Spatial Buffer Analysis", status: "pending", duration: 2000, description: "AI projecting plume trajectory relative to nearby solvent silo containment dikes." },
      { id: "decision", name: "Asset Flashover & Threat Score Engine", status: "pending", duration: 1500, description: "Threat Score: 51.2/100 (HIGH RISK). Flame perimeter restricted to reactor bay." },
      { id: "execute", name: "Automated Dispatch & Deluge Barrier Activation", status: "pending", duration: 1300, description: "Transmitting automated safety advisory to plant marshals and municipal hazmat." }
    ],
    aiReasoning: [
      "Thermal radiant power estimated at 144 MW within 310m of solvent silo SS-01.",
      "Spectral signature displays sharp volatile solvent burn profile with rapid plume dispersion.",
      "Wind vector 142° SE drives heat plume toward perimeter drainage buffer away from main rail link.",
      "AI Classification: Polymer byproduct runaway flare with elevated containment risk."
    ],
    resultMetrics: {
      confidence: "88.6%",
      signals: 28,
      responseTime: "3.2s",
      riskDelta: "+51.2 Pts",
      mitigationAction: "Safety marshals dispatched. Dry chemical isolation systems engaged.",
      containmentEta: "19m 20s"
    },
    flirReadout: {
      maxTemp: "624°C",
      centroidLat: "21.7051° N, 72.5857° E",
      targetId: "FLIR-DAHEJ-PR02",
      spectralBand: "SWIR 2.19µm"
    }
  },
  {
    id: "scen-steel",
    code: "SCEN-C",
    title: "Scenario C: Steel Mill Coke Oven Thermal Anomaly",
    subtitle: "Heavy metallurgical smelting and blast furnace boundary",
    asset: "Jharkhand Metallurgical Complex",
    location: "Jamshedpur Heavy Industrial Belt",
    coordinates: "22.8046° N, 86.2029° E",
    activeFlameProb: 62.4,
    refineryProximityProb: 24.1,
    initialScore: 42.8,
    baselineFRP: 120,
    peakFRP: 210,
    sensors: ["VIIRS-FRP", "SENTINEL-L2A", "MODIS-THERMAL"],
    defaultWindHeading: 280,
    defaultWindSpeed: 14,
    defaultDryness: 40,
    fireOrigin: { x: 280, y: 210 },
    barrierLine: { x1: 210, y1: 110, x2: 210, y2: 330 },
    assets: [
      {
        id: "CO-04",
        name: "Coke Oven Battery 4",
        type: "tower",
        x: 280,
        y: 210,
        width: 48,
        height: 38,
        flashpoint: "450°C (Coke Gas)",
        substance: "Bituminous Coke & Gas",
        nominalTemp: "980°C",
        description: "Industrial coke battery undergoing regular high-temp carbonization."
      },
      {
        id: "BF-02",
        name: "Blast Furnace 2 Slag Trough",
        type: "tower",
        x: 440,
        y: 190,
        width: 40,
        height: 52,
        flashpoint: "Refractory Lined",
        substance: "Molten Iron Slag",
        nominalTemp: "1450°C",
        description: "Enclosed molten metal casting floor with localized radiant heat."
      },
      {
        id: "CY-01",
        name: "Coal Conveyor Trunk Line",
        type: "building",
        x: 210,
        y: 150,
        width: 55,
        height: 24,
        flashpoint: "180°C (Coal Dust)",
        substance: "Coking Coal Feedstock",
        nominalTemp: "32°C",
        description: "Enclosed transfer conveyor connecting rail yard to blast furnaces."
      }
    ],
    steps: [
      { id: "ingest", name: "Satellite Ingestion & VIIRS Telemetry", status: "pending", duration: 1000, description: "Ingesting Jamshedpur industrial thermal anomalies." },
      { id: "validate", name: "Multi-Temporal Radiance Verification", status: "pending", duration: 1300, description: "Comparing 210 MW heat against baseline blast furnace metallurgical cycle." },
      { id: "analyze", name: "Spectral Indices & NBR Carbonization", status: "pending", duration: 1500, description: "Validating industrial slag cooling profile vs. uncontrolled open flame." },
      { id: "reason", name: "Gemini 2.5 Flash Spatial Buffer Analysis", status: "pending", duration: 1800, description: "Correlating operational shift schedules with elevated thermal readings." },
      { id: "decision", name: "Asset Flashover & Threat Score Engine", status: "pending", duration: 1400, description: "Score: 42.8/100 (ELEVATED BASELINE). High containment probability." },
      { id: "execute", name: "Automated Dispatch & Deluge Barrier Activation", status: "pending", duration: 1200, description: "Logged to plant operations registry with secondary watch alert." }
    ],
    aiReasoning: [
      "210 MW thermal signature aligns with routine coke battery discharge cycle.",
      "NIR background reflectance confirms containment within refractory masonry walls.",
      "AI Classification: Operational metallurgical thermal event with low external flashover hazard."
    ],
    resultMetrics: {
      confidence: "82.4%",
      signals: 19,
      responseTime: "2.8s",
      riskDelta: "+14.8 Pts",
      mitigationAction: "Automatic advisory logged to metallurgical plant monitoring log.",
      containmentEta: "Continuous"
    },
    flirReadout: {
      maxTemp: "980°C",
      centroidLat: "22.8046° N, 86.2029° E",
      targetId: "FLIR-JAMSHEDPUR-CO04",
      spectralBand: "MIR / FIR 11.4µm"
    }
  },
  {
    id: "scen-forest",
    code: "SCEN-D",
    title: "Scenario D: Controlled Agricultural Biomass",
    subtitle: "Low-hazard rural farmland clearing and stubble burn",
    asset: "Nagpur Rural Farmland Perimeter",
    location: "Maharashtra Central Corridor",
    coordinates: "21.1458° N, 79.0882° E",
    activeFlameProb: 15.4,
    refineryProximityProb: 5.0,
    initialScore: 18.1,
    baselineFRP: 10,
    peakFRP: 31,
    sensors: ["VIIRS-FRP"],
    defaultWindHeading: 210,
    defaultWindSpeed: 8,
    defaultDryness: 25,
    fireOrigin: { x: 300, y: 220 },
    barrierLine: { x1: 430, y1: 120, x2: 430, y2: 320 },
    assets: [
      {
        id: "PF-01",
        name: "Harvested Wheat Stubble Plot",
        type: "building",
        x: 300,
        y: 220,
        width: 60,
        height: 48,
        flashpoint: "Dry Straw",
        substance: "Biomass Crop Residue",
        nominalTemp: "28°C",
        description: "Open agricultural field following seasonal wheat harvest."
      },
      {
        id: "GR-02",
        name: "Regional Grain Silo Compound",
        type: "sphere",
        x: 480,
        y: 190,
        radius: 22,
        flashpoint: "Combustible Dust",
        substance: "Stored Wheat Grain",
        nominalTemp: "24°C",
        description: "Reinforced agricultural grain store located 1.2km east across canal."
      },
      {
        id: "IC-01",
        name: "Irrigation Canal & Wet Buffer",
        type: "water_tank",
        x: 430,
        y: 220,
        width: 18,
        height: 180,
        flashpoint: "Water Channel",
        substance: "Irrigation Water",
        nominalTemp: "21°C",
        description: "Natural water obstacle acting as an organic firebreak."
      }
    ],
    steps: [
      { id: "ingest", name: "Satellite Ingestion & VIIRS Telemetry", status: "pending", duration: 900, description: "Detecting localized low-intensity agricultural thermal emission." },
      { id: "validate", name: "Multi-Temporal Radiance Verification", status: "pending", duration: 1100, description: "Analyzing 31.2 MW localized heat signature with short residence time." },
      { id: "analyze", name: "Spectral Indices & NBR Carbonization", status: "pending", duration: 1300, description: "High NDVI (0.48) confirms rural agricultural field setting." },
      { id: "reason", name: "Gemini 2.5 Flash Spatial Buffer Analysis", status: "pending", duration: 1500, description: "Zero industrial infrastructure within 3.2km buffer radius." },
      { id: "decision", name: "Asset Flashover & Threat Score Engine", status: "pending", duration: 1200, description: "Score: 18.1/100 (MONITORED). Negligible public safety threat." },
      { id: "execute", name: "Automated Dispatch & Deluge Barrier Activation", status: "pending", duration: 1000, description: "Archived to automated state seasonal agriculture ledger." }
    ],
    aiReasoning: [
      "Localized thermal signature of 31.2 MW decaying rapidly.",
      "Cropland terrain with zero critical hydrocarbon or civil infrastructure nearby.",
      "AI Classification: Controlled seasonal biomass clearing. No emergency action needed."
    ],
    resultMetrics: {
      confidence: "98.1%",
      signals: 8,
      responseTime: "1.9s",
      riskDelta: "0.0 Pts",
      mitigationAction: "Logged in routine agricultural seasonal registry.",
      containmentEta: "Self-extinguishing"
    },
    flirReadout: {
      maxTemp: "285°C",
      centroidLat: "21.1458° N, 79.0882° E",
      targetId: "FLIR-NAGPUR-PF01",
      spectralBand: "SWIR / Optical"
    }
  }
];

export default function LiveDemo({ theme }: { theme: "light" | "dark" }) {
  const isDark = theme === "dark";

  // Scenario & simulation state
  const [selectedScen, setSelectedScen] = useState<TacticalScenario>(TACTICAL_SCENARIOS[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 4>(1);
  const [steps, setSteps] = useState<DemoStep[]>(TACTICAL_SCENARIOS[0].steps);
  const [logs, setLogs] = useState<DemoLog[]>([]);
  const [logFilter, setLogFilter] = useState<"all" | "ai" | "telemetry" | "success">("all");
  const [selectedAsset, setSelectedAsset] = useState<FacilityAsset>(TACTICAL_SCENARIOS[0].assets[0]);

  // Interactive Physics Variables
  const [windHeading, setWindHeading] = useState<number>(TACTICAL_SCENARIOS[0].defaultWindHeading);
  const [windSpeed, setWindSpeed] = useState<number>(TACTICAL_SCENARIOS[0].defaultWindSpeed);
  const [dryness, setDryness] = useState<number>(TACTICAL_SCENARIOS[0].defaultDryness);
  const [barrierDeployed, setBarrierDeployed] = useState<boolean>(false);

  // Drone recon position animation tick
  const [droneAngle, setDroneAngle] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Reset demo when scenario changes
  const resetDemo = (scen: TacticalScenario) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setActiveStepIndex(-1);
    setSteps(scen.steps.map(s => ({ ...s, status: "pending" })));
    setWindHeading(scen.defaultWindHeading);
    setWindSpeed(scen.defaultWindSpeed);
    setDryness(scen.defaultDryness);
    setBarrierDeployed(false);
    setSelectedAsset(scen.assets[0]);
    setLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        message: `Tactical simulation sandbox initialized for ${scen.title}.`,
        type: "info"
      },
      {
        timestamp: new Date().toLocaleTimeString(),
        message: `Multispectral baseline established: ${scen.baselineFRP} MW ambient radiance at ${scen.coordinates}.`,
        type: "telemetry"
      }
    ]);
  };

  useEffect(() => {
    resetDemo(selectedScen);
  }, [selectedScen]);

  // Animate drone patrol
  useEffect(() => {
    let currentAngle = 0;
    const interval = setInterval(() => {
      currentAngle = (currentAngle + 1.2) % 360;
      setDroneAngle(currentAngle);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const addLog = (message: string, type: DemoLog["type"]) => {
    setLogs(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type
      },
      ...prev
    ]);
  };

  // Run next step
  const runNextStep = (index: number) => {
    if (index >= steps.length) {
      setIsRunning(false);
      addLog("Tactical verification complete: Emergency dispatch protocols engaged.", "success");
      return;
    }

    setSteps(prev => prev.map((s, i) => {
      if (i < index) return { ...s, status: "completed" };
      if (i === index) return { ...s, status: "processing" };
      return { ...s, status: "pending" };
    }));
    setActiveStepIndex(index);

    const currentStep = steps[index];
    addLog(`Initiating: ${currentStep.name}`, "info");

    if (currentStep.id === "validate") {
      addLog(`Thermal flux validated: +${selectedScen.peakFRP - selectedScen.baselineFRP} MW delta over baseline.`, "telemetry");
    }

    if (currentStep.id === "reason") {
      selectedScen.aiReasoning.forEach((reason, i) => {
        setTimeout(() => {
          addLog(`AI Reasoning: ${reason}`, "ai");
        }, (i * 300) / simSpeed);
      });
    }

    if (currentStep.id === "decision" && barrierDeployed) {
      setTimeout(() => {
        addLog("Defensive deluge barrier engaged: Fire front arrested at perimeter zone.", "success");
      }, 400 / simSpeed);
    }

    const duration = Math.max(currentStep.duration / simSpeed, 350);
    timerRef.current = setTimeout(() => {
      addLog(`Verified: ${currentStep.name}`, "success");
      runNextStep(index + 1);
    }, duration);
  };

  const handleStartPause = () => {
    if (isRunning) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsRunning(false);
      addLog("Simulation paused by operator.", "info");
    } else {
      setIsRunning(true);
      const nextIndex = activeStepIndex >= 0 && activeStepIndex < steps.length - 1 ? activeStepIndex + 1 : 0;
      runNextStep(nextIndex);
    }
  };

  const handleStepForward = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    const nextIndex = activeStepIndex + 1;
    if (nextIndex < steps.length) {
      runNextStep(nextIndex);
    }
  };

  // Mathematical spread physics calculation
  const physicsState = useMemo(() => {
    const stageMultiplier = activeStepIndex >= 0 ? (activeStepIndex + 1) / steps.length : 0.25;
    
    // Wind vector in radians
    const rad = ((windHeading - 90) * Math.PI) / 180;
    const windVectorX = Math.cos(rad);
    const windVectorY = Math.sin(rad);

    // Dynamic flame dimensions
    const baseLength = (28 + stageMultiplier * 36) * (1 + windSpeed / 45) * (dryness / 60);
    const baseWidth = (18 + stageMultiplier * 20) * (1 + windSpeed / 120) * (dryness / 70);

    // If barrier is deployed, clamp flame spread in the direction of the barrier
    let effectiveLength = baseLength;
    let barrierIntervention = false;

    // Check barrier restriction: if barrier is between origin and downwind asset
    if (barrierDeployed && windVectorX > 0) {
      // Barrier lies at x = selectedScen.barrierLine.x1
      const distToBarrier = selectedScen.barrierLine.x1 - selectedScen.fireOrigin.x;
      if (distToBarrier > 0 && effectiveLength > distToBarrier * 0.85) {
        effectiveLength = distToBarrier * 0.85;
        barrierIntervention = true;
      }
    }

    // Dynamic current FRP (MW)
    const currentFRP = Math.round(
      selectedScen.baselineFRP + 
      (selectedScen.peakFRP - selectedScen.baselineFRP) * stageMultiplier * (1 + (dryness - 50) / 100)
    );

    // Dynamic Containment ETA
    let containmentStatus = selectedScen.resultMetrics.containmentEta;
    if (barrierDeployed) {
      containmentStatus = "ARRESTED (SAFE)";
    } else if (activeStepIndex >= 4) {
      containmentStatus = "IMMINENT (02m 15s)";
    }

    // Dynamic Containment Probability
    let containmentProb = 48;
    if (barrierDeployed) {
      containmentProb = 96;
    } else if (windSpeed > 35) {
      containmentProb = 28;
    } else if (activeStepIndex >= 3) {
      containmentProb = 62;
    }

    return {
      windVectorX,
      windVectorY,
      length: effectiveLength,
      width: baseWidth,
      currentFRP,
      containmentStatus,
      containmentProb,
      barrierIntervention
    };
  }, [selectedScen, activeStepIndex, steps.length, windHeading, windSpeed, dryness, barrierDeployed]);

  // Cardinal direction helper
  const getCardinalDirection = (deg: number): string => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const idx = Math.round(deg / 22.5) % 16;
    return directions[idx];
  };

  // Drone position on orbit
  const droneRad = (droneAngle * Math.PI) / 180;
  const droneX = selectedScen.fireOrigin.x + Math.cos(droneRad) * 110;
  const droneY = selectedScen.fireOrigin.y + Math.sin(droneRad) * 75;

  // Filtered logs
  const filteredLogs = logs.filter(l => {
    if (logFilter === "all") return true;
    return l.type === logFilter;
  });

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto ${isDark ? "text-white" : "text-slate-900"}`}>
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & TACTICAL CONTROL BAR */}
      {/* ========================================================================= */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDark ? "bg-[#0b101d] border-[#18233a] shadow-lg shadow-black/40" : "bg-white border-slate-200 shadow-md"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Title & Status */}
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                  Incident Dynamics & Spread Sandbox
                </h1>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                isRunning
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                  : activeStepIndex >= steps.length - 1
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : "bg-blue-500/20 text-blue-400 border-blue-500/40"
              }`}>
                {isRunning
                  ? `Simulating Stage ${activeStepIndex + 1}/${steps.length}`
                  : activeStepIndex >= steps.length - 1
                    ? "Simulation Completed"
                    : "Tactical Sandbox Idle"}
              </span>

              {barrierDeployed && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Deluge Barrier Active
                </span>
              )}
            </div>

            <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Simulate dynamic fire plume physics, atmospheric wind vectors, multi-band satellite passes, and automated barrier suppression.
            </p>
          </div>

          {/* Controls Suite */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            
            {/* Play / Pause */}
            <button
              onClick={handleStartPause}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isRunning
                  ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30"
                  : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-blue-600/30"
              }`}
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
              <span>{isRunning ? "Pause Engine" : "Run Simulation"}</span>
            </button>

            {/* Step Forward */}
            <button
              onClick={handleStepForward}
              disabled={activeStepIndex >= steps.length - 1}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                isDark
                  ? "bg-[#141d33] hover:bg-[#1e2c4d] border-[#1e2c4a] text-slate-200 disabled:opacity-40"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 disabled:opacity-40"
              }`}
              title="Advance one stage manually"
            >
              <SkipForward className="h-3.5 w-3.5" />
              <span>Step Next</span>
            </button>

            {/* Reset */}
            <button
              onClick={() => resetDemo(selectedScen)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? "bg-[#141d33] hover:bg-[#1e2c4d] border-[#1e2c4a] text-slate-300 hover:text-white"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900"
              }`}
              title="Reset Simulation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Sim Speed Multiplier */}
            <div className={`flex items-center rounded-xl p-1 border ${
              isDark ? "bg-[#070b14] border-[#1e2c4a]" : "bg-slate-100 border-slate-300"
            }`}>
              {([1, 2, 4] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    simSpeed === spd
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SCENARIO SELECTOR CAROUSEL PILLS */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-2">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Select Operational Threat Scenario:
        </span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TACTICAL_SCENARIOS.map((scen) => {
            const isSelected = selectedScen.id === scen.id;
            return (
              <button
                key={scen.id}
                onClick={() => setSelectedScen(scen)}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? isDark
                      ? "bg-[#18233a] border-[#2563eb] shadow-lg shadow-blue-900/20 ring-1 ring-[#2563eb]"
                      : "bg-blue-50/80 border-[#2563eb] shadow-md ring-1 ring-[#2563eb]"
                    : isDark
                      ? "bg-[#0b101d] border-[#18233a] hover:bg-[#111a2e] text-slate-300"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    isSelected
                      ? "bg-[#2563eb] text-white"
                      : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600"
                  }`}>
                    {scen.code}
                  </span>

                  <span className={`text-[10px] font-bold ${
                    scen.initialScore >= 70 ? "text-rose-500" : scen.initialScore >= 40 ? "text-amber-500" : "text-emerald-500"
                  }`}>
                    Score: {scen.initialScore}
                  </span>
                </div>

                <span className={`text-xs font-bold truncate mt-1 ${
                  isSelected ? (isDark ? "text-white" : "text-blue-950") : (isDark ? "text-slate-200" : "text-slate-800")
                }`}>
                  {scen.asset}
                </span>

                <span className={`text-[11px] truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {scen.location}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN SIMULATION ENGINE GRID (Map Canvas + Telemetry + AI Pipeline) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT / CENTER COLUMN (xl:col-span-7) — Tactical Map Sandbox & Physics */}
        <div className="xl:col-span-7 flex flex-col gap-6">

          {/* 3A. Tactical Interactive Facility & Plume Sandbox */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${
            isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
          }`}>
            
            {/* Header with Coordinates & Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-700/30">
              <div>
                <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-[#2563eb]" />
                  <span>Tactical Facility Grid & Thermal Spread</span>
                </h2>
                <p className={`text-[11px] font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  COORD: {selectedScen.coordinates} | RADAR SWEEP: 2.4 GHz | GROUND RESOLUTION: 375m
                </p>
              </div>

              {/* Dynamic FRP Badge */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">Radiant Flux:</span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  {physicsState.currentFRP} MW
                </span>
              </div>
            </div>

            {/* Tactical Canvas Representation */}
            <div className={`relative w-full rounded-xl overflow-hidden border aspect-[16/10.5] ${
              isDark ? "bg-[#060a12] border-[#1c2844]" : "bg-slate-900 border-slate-700"
            }`}>
              
              <svg
                viewBox="0 0 640 420"
                className="w-full h-full select-none"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Grid Pattern */}
                  <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.07)" strokeWidth="1" />
                    <circle cx="0" cy="0" r="1.5" fill="rgba(56, 189, 248, 0.25)" />
                  </pattern>

                  {/* Flame Core Glow Filter */}
                  <radialGradient id="flame-core-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="35%" stopColor="#ffedd5" stopOpacity="0.95" />
                    <stop offset="65%" stopColor="#f97316" stopOpacity="0.8" />
                    <stop offset="90%" stopColor="#ef4444" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </radialGradient>

                  {/* 500°C Isotherm Gradient */}
                  <radialGradient id="isotherm-500" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                    <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                  </radialGradient>

                  {/* 250°C Radiative Boundary */}
                  <radialGradient id="isotherm-250" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>

                  {/* Barrier Deluge Pattern */}
                  <pattern id="barrier-hash" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="12" stroke="#06b6d4" strokeWidth="2.5" />
                  </pattern>

                  {/* Drone Sensor Conical Beam */}
                  <linearGradient id="drone-beam" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
                    <stop offset="100%" stopColor="rgba(56, 189, 248, 0.0)" />
                  </linearGradient>
                </defs>

                {/* 1. Tactical Grid Background */}
                <rect width="640" height="420" fill="url(#tactical-grid)" />

                {/* Range Rings from Fire Origin */}
                <circle
                  cx={selectedScen.fireOrigin.x}
                  cy={selectedScen.fireOrigin.y}
                  r="75"
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={selectedScen.fireOrigin.x}
                  cy={selectedScen.fireOrigin.y}
                  r="150"
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <circle
                  cx={selectedScen.fireOrigin.x}
                  cy={selectedScen.fireOrigin.y}
                  r="225"
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.08)"
                  strokeWidth="1"
                  strokeDasharray="5 5"
                />

                <text x={selectedScen.fireOrigin.x + 80} y={selectedScen.fireOrigin.y - 6} fill="rgba(56, 189, 248, 0.5)" fontSize="9" fontFamily="monospace">
                  250m
                </text>
                <text x={selectedScen.fireOrigin.x + 155} y={selectedScen.fireOrigin.y - 6} fill="rgba(56, 189, 248, 0.5)" fontSize="9" fontFamily="monospace">
                  500m
                </text>
                <text x={selectedScen.fireOrigin.x + 230} y={selectedScen.fireOrigin.y - 6} fill="rgba(56, 189, 248, 0.5)" fontSize="9" fontFamily="monospace">
                  750m
                </text>

                {/* Facility Interconnecting Pipelines */}
                <path
                  d="M 175 140 L 260 220 L 430 160 L 490 270"
                  fill="none"
                  stroke="rgba(100, 116, 139, 0.35)"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
                <path
                  d="M 180 320 L 260 220"
                  fill="none"
                  stroke="rgba(14, 165, 233, 0.4)"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                />

                {/* 2. DYNAMIC FIRE SPREAD PLUME (WIND VECTOR & DRYNESS WARPING) */}
                <g transform={`translate(${selectedScen.fireOrigin.x}, ${selectedScen.fireOrigin.y}) rotate(${windHeading - 90})`}>
                  
                  {/* Outer 250°C Pre-Heat Boundary */}
                  <ellipse
                    cx={physicsState.length * 0.45}
                    cy="0"
                    rx={physicsState.length * 1.35}
                    ry={physicsState.width * 1.45}
                    fill="url(#isotherm-250)"
                    stroke="rgba(245, 158, 11, 0.35)"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />

                  {/* 500°C Active Flame Flashover Front */}
                  <ellipse
                    cx={physicsState.length * 0.35}
                    cy="0"
                    rx={physicsState.length}
                    ry={physicsState.width}
                    fill="url(#isotherm-500)"
                    stroke="rgba(244, 63, 94, 0.75)"
                    strokeWidth="1.8"
                  />

                  {/* 800°C High Intensity Thermal Core */}
                  <ellipse
                    cx={physicsState.length * 0.15}
                    cy="0"
                    rx={physicsState.length * 0.55}
                    ry={physicsState.width * 0.6}
                    fill="url(#flame-core-grad)"
                  />

                  {/* Downwind Smoke Drift Particles */}
                  {[1, 2, 3, 4, 5].map((p) => (
                    <circle
                      key={p}
                      cx={physicsState.length * (0.8 + p * 0.18)}
                      cy={Math.sin(p * 1.5) * (physicsState.width * 0.4)}
                      r={4 + p * 2}
                      fill="rgba(226, 232, 240, 0.08)"
                    />
                  ))}
                </g>

                {/* Center Fire Ignition Point */}
                <circle
                  cx={selectedScen.fireOrigin.x}
                  cy={selectedScen.fireOrigin.y}
                  r="7"
                  fill="#ffffff"
                  stroke="#ef4444"
                  strokeWidth="3"
                  className="animate-pulse"
                />

                {/* 3. DELUGE FIREBREAK DEFENSIVE BARRIER */}
                {barrierDeployed && (
                  <g>
                    {/* Glowing shield halo */}
                    <line
                      x1={selectedScen.barrierLine.x1}
                      y1={selectedScen.barrierLine.y1}
                      x2={selectedScen.barrierLine.x2}
                      y2={selectedScen.barrierLine.y2}
                      stroke="rgba(6, 182, 212, 0.25)"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />
                    <line
                      x1={selectedScen.barrierLine.x1}
                      y1={selectedScen.barrierLine.y1}
                      x2={selectedScen.barrierLine.x2}
                      y2={selectedScen.barrierLine.y2}
                      stroke="#06b6d4"
                      strokeWidth="3.5"
                      strokeDasharray="6 3"
                    />

                    {/* Shield nodes */}
                    <circle cx={selectedScen.barrierLine.x1} cy={selectedScen.barrierLine.y1 + 20} r="5" fill="#06b6d4" />
                    <circle cx={selectedScen.barrierLine.x1} cy={(selectedScen.barrierLine.y1 + selectedScen.barrierLine.y2) / 2} r="5" fill="#06b6d4" />
                    <circle cx={selectedScen.barrierLine.x1} cy={selectedScen.barrierLine.y2 - 20} r="5" fill="#06b6d4" />

                    <text
                      x={selectedScen.barrierLine.x1 + 8}
                      y={(selectedScen.barrierLine.y1 + selectedScen.barrierLine.y2) / 2 - 4}
                      fill="#38bdf8"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      DELUGE BARRIER ACTIVE (1200 LPM)
                    </text>
                  </g>
                )}

                {/* 4. FACILITY ASSETS */}
                {selectedScen.assets.map((asset) => {
                  const isSelected = selectedAsset.id === asset.id;
                  
                  // Check if asset is inside flame range
                  const dist = Math.hypot(asset.x - selectedScen.fireOrigin.x, asset.y - selectedScen.fireOrigin.y);
                  const isExposed = dist < physicsState.length * 1.1 && !barrierDeployed;
                  const isProtected = barrierDeployed && asset.x > selectedScen.barrierLine.x1;

                  return (
                    <g
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className="cursor-pointer transition-all"
                    >
                      {/* Asset Shape */}
                      {asset.type === "sphere" ? (
                        <circle
                          cx={asset.x}
                          cy={asset.y}
                          r={asset.radius || 24}
                          fill={isDark ? "#101827" : "#334155"}
                          stroke={
                            isSelected
                              ? "#38bdf8"
                              : isExposed
                                ? "#ef4444"
                                : isProtected
                                  ? "#10b981"
                                  : "#64748b"
                          }
                          strokeWidth={isSelected ? "3" : isExposed ? "2.5" : "1.8"}
                        />
                      ) : (
                        <rect
                          x={asset.x - (asset.width || 36) / 2}
                          y={asset.y - (asset.height || 36) / 2}
                          width={asset.width || 36}
                          height={asset.height || 36}
                          rx="4"
                          fill={isDark ? "#101827" : "#334155"}
                          stroke={
                            isSelected
                              ? "#38bdf8"
                              : isExposed
                                ? "#ef4444"
                                : isProtected
                                  ? "#10b981"
                                  : "#64748b"
                          }
                          strokeWidth={isSelected ? "3" : isExposed ? "2.5" : "1.8"}
                        />
                      )}

                      {/* Hazard Badge Dot */}
                      <circle
                        cx={asset.x + (asset.radius || (asset.width || 36) / 2) - 4}
                        cy={asset.y - (asset.radius || (asset.height || 36) / 2) + 4}
                        r="4"
                        fill={isExposed ? "#ef4444" : isProtected ? "#10b981" : "#38bdf8"}
                      />

                      {/* Asset Tag */}
                      <text
                        x={asset.x}
                        y={asset.y + (asset.radius || (asset.height || 36) / 2) + 12}
                        textAnchor="middle"
                        fill={isSelected ? "#38bdf8" : "#cbd5e1"}
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {asset.id}
                      </text>
                    </g>
                  );
                })}

                {/* 5. AERIAL DRONE RECON SWEEP */}
                <g transform={`translate(${droneX}, ${droneY})`}>
                  {/* Conical Sensor Beam to hotspot */}
                  <polygon
                    points={`0,0 ${selectedScen.fireOrigin.x - droneX - 25},${selectedScen.fireOrigin.y - droneY} ${selectedScen.fireOrigin.x - droneX + 25},${selectedScen.fireOrigin.y - droneY}`}
                    fill="url(#drone-beam)"
                  />

                  {/* Drone Airframe */}
                  <circle cx="0" cy="0" r="5" fill="#38bdf8" />
                  <line x1="-10" y1="0" x2="10" y2="0" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="0" y1="-10" x2="0" y2="10" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="-10" cy="0" r="2.5" fill="#ffffff" />
                  <circle cx="10" cy="0" r="2.5" fill="#ffffff" />
                  <circle cx="0" cy="-10" r="2.5" fill="#ffffff" />
                  <circle cx="0" cy="10" r="2.5" fill="#ffffff" />

                  <text x="14" y="4" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    UAV-01 | FLIR LOCKED
                  </text>
                </g>

                {/* 6. COMPASS & WIND VECTOR HUD (TOP RIGHT) */}
                <g transform="translate(565, 55)">
                  <circle cx="0" cy="0" r="26" fill="rgba(11, 16, 29, 0.85)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.5" />
                  
                  {/* Cardinal points */}
                  <text x="0" y="-16" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">N</text>
                  <text x="18" y="3" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">E</text>
                  <text x="0" y="21" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">S</text>
                  <text x="-18" y="3" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">W</text>

                  {/* Rotating Wind Arrow */}
                  <g transform={`rotate(${windHeading})`}>
                    <line x1="0" y1="14" x2="0" y2="-15" stroke="#f43f5e" strokeWidth="2" />
                    <polygon points="0,-20 -4,-12 4,-12" fill="#f43f5e" />
                  </g>

                  <text x="0" y="38" textAnchor="middle" fill="#f43f5e" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    {windSpeed} km/h {getCardinalDirection(windHeading)}
                  </text>
                </g>

              </svg>
            </div>

            {/* Tactical Canvas Legend (Never overlapping, clean flex row) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] border-t border-slate-700/30">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-white border border-rose-500" />
                  800°C Core
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  500°C Flame Front
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  250°C Isotherm
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Deluge Barrier
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  Drone Orbit
                </span>
              </div>

              <span className="text-[10px] text-slate-400 font-mono">
                Click any asset to inspect telemetry
              </span>
            </div>

          </div>

          {/* 3B. Environmental Physics & Spread Controls Toolbar */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${
            isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
          }`}>
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
              <h3 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#2563eb]" />
                <span>Atmospheric Physics & Spread Variables</span>
              </h3>

              <button
                onClick={() => setBarrierDeployed(prev => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  barrierDeployed
                    ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold"
                    : "bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-cyan-300"
                }`}
              >
                {barrierDeployed ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                <span>{barrierDeployed ? "Barrier Deployed" : "Deploy Deluge Barrier"}</span>
              </button>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Wind Heading Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Compass className="h-3.5 w-3.5 text-blue-400" />
                    Wind Heading:
                  </span>
                  <span className="font-mono font-bold text-blue-400">
                    {windHeading}° ({getCardinalDirection(windHeading)})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={windHeading}
                  onChange={(e) => setWindHeading(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Wind Speed Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Wind className="h-3.5 w-3.5 text-cyan-400" />
                    Wind Velocity:
                  </span>
                  <span className="font-mono font-bold text-cyan-400">
                    {windSpeed} km/h
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="2"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Fuel Dryness / Humidity */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Droplets className="h-3.5 w-3.5 text-amber-400" />
                    Fuel Aridity:
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    {dryness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  step="5"
                  value={dryness}
                  onChange={(e) => setDryness(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

            </div>

            {/* Quick Atmospheric Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Presets:</span>
              
              <button
                onClick={() => { setWindHeading(68); setWindSpeed(42); setDryness(75); }}
                className="px-2.5 py-1 rounded-lg bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-[11px] font-semibold text-slate-300 cursor-pointer"
              >
                Coastal Gale (42 km/h)
              </button>

              <button
                onClick={() => { setWindHeading(180); setWindSpeed(6); setDryness(35); }}
                className="px-2.5 py-1 rounded-lg bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-[11px] font-semibold text-slate-300 cursor-pointer"
              >
                Dead Calm (6 km/h)
              </button>

              <button
                onClick={() => { setWindHeading(270); setWindSpeed(30); setDryness(88); }}
                className="px-2.5 py-1 rounded-lg bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-[11px] font-semibold text-slate-300 cursor-pointer"
              >
                High Aridity Heatwave
              </button>
            </div>

          </div>

          {/* 3C. Multispectral Sensor Triad & FLIR Optic HUD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Real-time FRP Flux Chart */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
              isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5 text-slate-300">
                  <Activity className="h-3.5 w-3.5 text-rose-400" />
                  Thermal Radiance Flux Curve
                </span>
                <span className="text-[10px] font-mono text-slate-400">MW / Temporal</span>
              </div>

              {/* SVG Sparkline Curve */}
              <div className="h-24 w-full relative">
                <svg viewBox="0 0 280 80" className="w-full h-full overflow-visible">
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="280" y2="20" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="280" y2="50" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Baseline curve */}
                  <path
                    d={`M 10,65 Q 70,58 130,${65 - (physicsState.currentFRP / 380) * 45} T 270,${
                      65 - (physicsState.currentFRP / 380) * 55
                    }`}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                  />
                  
                  {/* Current Reading Dot */}
                  <circle
                    cx="270"
                    cy={65 - (physicsState.currentFRP / 380) * 55}
                    r="4"
                    fill="#ffffff"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    className="animate-ping"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2 font-mono">
                <span>Baseline: {selectedScen.baselineFRP} MW</span>
                <span className="text-rose-400 font-bold">Peak: {physicsState.currentFRP} MW</span>
              </div>
            </div>

            {/* FLIR Thermal Optical Reticle */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
              isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5 text-cyan-400">
                  <Eye className="h-3.5 w-3.5" />
                  FLIR Multispectral Viewfinder
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                  OPTIC 01-IR
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#060a12] border border-[#16243f] flex flex-col gap-1.5 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>MAX APEX TEMP:</span>
                  <span className="text-rose-400 font-bold">{selectedScen.flirReadout.maxTemp}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>TARGET LOCK:</span>
                  <span className="text-white font-semibold">{selectedScen.flirReadout.targetId}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>SPECTRAL BAND:</span>
                  <span className="text-cyan-300 font-semibold">{selectedScen.flirReadout.spectralBand}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>STATUS: TARGET ACQUIRED</span>
                <span className="text-emerald-400 font-bold">● 60 FPS LOCK</span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (xl:col-span-5) — Pipeline Stages, Threat Matrix & AI Stream */}
        <div className="xl:col-span-5 flex flex-col gap-6">

          {/* 3D. Active Threat & Containment Matrix */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3.5 ${
            isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
          }`}>
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Threat Impact & Containment Matrix</span>
              </h2>

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                selectedScen.initialScore >= 70
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                  : selectedScen.initialScore >= 40
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
              }`}>
                Score: {selectedScen.initialScore}/100
              </span>
            </div>

            {/* Impact Metric Cards (4 Grid) */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              
              <div className="p-3 rounded-xl bg-[#10172a] border border-[#1e2c4a] flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Containment ETA:
                </span>
                <span className={`text-sm font-black font-mono ${
                  barrierDeployed ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {physicsState.containmentStatus}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#10172a] border border-[#1e2c4a] flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Containment Prob:
                </span>
                <span className="text-sm font-black font-mono text-cyan-400">
                  {physicsState.containmentProb}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#10172a] border border-[#1e2c4a] flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Flame Probability:
                </span>
                <span className="text-sm font-black font-mono text-white">
                  {selectedScen.activeFlameProb}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#10172a] border border-[#1e2c4a] flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Refinery Proximity:
                </span>
                <span className="text-sm font-black font-mono text-amber-400">
                  {selectedScen.refineryProximityProb}%
                </span>
              </div>

            </div>

            {/* Selected Asset Inspection Dossier */}
            <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1c2742] flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Inspected Asset: {selectedAsset.name}
                </span>
                <span className="font-mono text-[10px] text-blue-400 font-bold">
                  {selectedAsset.id}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {selectedAsset.description}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-800 text-[10px] font-mono text-slate-300">
                <div>Substance: <span className="text-white">{selectedAsset.substance}</span></div>
                <div>Flashpoint: <span className="text-rose-400">{selectedAsset.flashpoint}</span></div>
              </div>
            </div>

          </div>

          {/* 3E. Pipeline Verification Stepper */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${
            isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#2563eb]" />
                <span>Verification Stages (6 Stages)</span>
              </h2>

              <span className="text-[10px] font-mono font-bold text-slate-400">
                {activeStepIndex >= 0 ? `${activeStepIndex + 1} / ${steps.length}` : "Ready"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {steps.map((step, idx) => {
                const isDone = step.status === "completed";
                const isCurrent = step.status === "processing";

                return (
                  <div
                    key={step.id}
                    onClick={() => {
                      if (!isRunning) {
                        runNextStep(idx);
                      }
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-[#18233a] border-[#2563eb] shadow-md shadow-blue-900/30 ring-1 ring-[#2563eb]"
                        : isDone
                          ? "bg-[#0f172a] border-emerald-500/30 text-slate-200"
                          : "bg-[#070b14] border-[#162137] text-slate-400 hover:bg-[#0c1424]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                            ? "bg-[#2563eb] text-white animate-pulse"
                            : "bg-slate-800 text-slate-400"
                      }`}>
                        {isDone ? "✓" : idx + 1}
                      </div>

                      <div className="flex flex-col">
                        <span className={`text-xs font-bold leading-tight ${isCurrent ? "text-white" : isDone ? "text-slate-200" : "text-slate-400"}`}>
                          {step.name}
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {step.description}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-semibold text-slate-400 shrink-0 ml-2">
                      {step.duration / 1000}s
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3F. AI Reasoning & Cybernetic Event Stream */}
          <div className={`p-5 rounded-2xl border flex flex-col flex-1 ${
            isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
          }`}>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-700/30">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-400" />
                <span>Live AI Reasoning Stream</span>
              </h2>

              {/* Log Filter Pills */}
              <div className="flex items-center gap-1">
                {(["all", "ai", "telemetry", "success"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setLogFilter(filter)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      logFilter === filter
                        ? "bg-[#2563eb] text-white"
                        : "bg-[#141d33] text-slate-400 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable logs */}
            <div className="flex-1 max-h-[260px] overflow-y-auto py-3 flex flex-col gap-2">
              {filteredLogs.map((log, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                    log.type === "ai"
                      ? "bg-purple-950/20 border-purple-800/40 text-purple-200"
                      : log.type === "telemetry"
                        ? "bg-blue-950/20 border-blue-800/40 text-blue-200"
                        : log.type === "success"
                          ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-200"
                          : "bg-[#10172a] border-[#1e2c4a] text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-400 font-mono">
                    <span>{log.timestamp}</span>
                    <span>•</span>
                    <span className="uppercase font-bold">{log.type}</span>
                  </div>
                  <div>{log.message}</div>
                </div>
              ))}
            </div>

            {/* Mitigation Action Bottom Bar */}
            {activeStepIndex >= steps.length - 1 && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 mt-2 flex items-center justify-between">
                <span className="font-semibold">{selectedScen.resultMetrics.mitigationAction}</span>
                <span className="font-bold text-white shrink-0 ml-2">{selectedScen.resultMetrics.confidence}</span>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
