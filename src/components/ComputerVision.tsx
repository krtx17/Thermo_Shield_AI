import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Scan,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  Maximize2,
  Crosshair,
  Flame,
  Shield,
  Activity,
  Cpu,
  Download,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Filter,
  Zap,
  Info,
  Camera,
  CameraOff,
  Video
} from "lucide-react";
import { ActiveScreen } from "../types";

interface BoundingBoxDetection {
  id: string;
  className: "Active Flame Core" | "Smoke / Aerosol Plume" | "Vulnerable Industrial Asset" | "Containment Barrier / Water";
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  thermalTemp: string;
  pixelArea: string;
  groundArea: string;
  substance: string;
  riskNote: string;
}

interface SatelliteTile {
  id: string;
  title: string;
  sensor: string;
  resolution: string;
  coordinates: string;
  captureTime: string;
  backgroundStyle: string;
  spectralBands: string[];
  maxTemp: string;
  detections: BoundingBoxDetection[];
}

const SAMPLE_TILES: SatelliteTile[] = [
  {
    id: "tile-paradip",
    title: "Paradip Coastal Petrochemical Enclave",
    sensor: "Sentinel-2 MSI (10m) + VIIRS 375m",
    resolution: "10m GSD Multi-Spectral",
    coordinates: "20.1234° N, 85.7654° E",
    captureTime: "2026-09-28 12:45 UTC",
    backgroundStyle: "from-[#081326] via-[#0d1e3a] to-[#040813]",
    spectralBands: ["SWIR B12 (2.19µm)", "NIR B8 (0.84µm)", "Red B4 (0.66µm)"],
    maxTemp: "842°C",
    detections: [
      {
        id: "DET-01",
        className: "Active Flame Core",
        confidence: 0.968,
        x: 230,
        y: 160,
        width: 110,
        height: 80,
        color: "#f43f5e",
        thermalTemp: "842°C Peak",
        pixelArea: "8,800 px²",
        groundArea: "880 m²",
        substance: "Naphtha / Crude Fractions",
        riskNote: "Critical hydrocarbon combustion flashover vector approaching storage tanks."
      },
      {
        id: "DET-02",
        className: "Smoke / Aerosol Plume",
        confidence: 0.924,
        x: 270,
        y: 100,
        width: 220,
        height: 110,
        color: "#f59e0b",
        thermalTemp: "185°C Plume Edge",
        pixelArea: "24,200 px²",
        groundArea: "2,420 m²",
        substance: "Carbon Monoxide & Soot Plume",
        riskNote: "Atmospheric aerosol plume drifting 68° ENE at 28 km/h."
      },
      {
        id: "DET-03",
        className: "Vulnerable Industrial Asset",
        confidence: 0.982,
        x: 410,
        y: 130,
        width: 85,
        height: 85,
        color: "#06b6d4",
        thermalTemp: "28°C Ambient",
        pixelArea: "7,225 px²",
        groundArea: "722 m²",
        substance: "Pressurized Butane Sphere Alpha",
        riskNote: "Cryogenic LPG vessel within 170m radius. High thermal BLEVE exposure hazard."
      },
      {
        id: "DET-04",
        className: "Containment Barrier / Water",
        confidence: 0.910,
        x: 360,
        y: 90,
        width: 25,
        height: 240,
        color: "#10b981",
        thermalTemp: "22°C (Aqueous)",
        pixelArea: "6,000 px²",
        groundArea: "600 m²",
        substance: "Emergency Deluge Canal & Foam Line",
        riskNote: "Deluge canal provides defensive barrier against eastern spread."
      }
    ]
  },
  {
    id: "tile-dahej",
    title: "Dahej Special Economic Chemical Zone",
    sensor: "UAV Reconnaissance FLIR Optic (4K)",
    resolution: "0.15m GSD Sub-Meter Aerial",
    coordinates: "21.7051° N, 72.5857° E",
    captureTime: "2026-09-28 11:20 UTC",
    backgroundStyle: "from-[#111927] via-[#1a2638] to-[#0a101d]",
    spectralBands: ["LWIR (8-14µm)", "Optical High-Res (0.4-0.7µm)"],
    maxTemp: "624°C",
    detections: [
      {
        id: "DET-05",
        className: "Active Flame Core",
        confidence: 0.941,
        x: 240,
        y: 170,
        width: 90,
        height: 70,
        color: "#f43f5e",
        thermalTemp: "624°C Exotherm",
        pixelArea: "6,300 px²",
        groundArea: "142 m²",
        substance: "Polymerization Reactor Byproduct",
        riskNote: "Catalytic thermal runaway contained within reactor secondary dike."
      },
      {
        id: "DET-06",
        className: "Vulnerable Industrial Asset",
        confidence: 0.895,
        x: 390,
        y: 150,
        width: 80,
        height: 80,
        color: "#06b6d4",
        thermalTemp: "26°C Ambient",
        pixelArea: "6,400 px²",
        groundArea: "144 m²",
        substance: "Volatile Solvent Silo SS-01",
        riskNote: "Acetone/Toluene storage protected by active cooling sprinkler."
      },
      {
        id: "DET-07",
        className: "Containment Barrier / Water",
        confidence: 0.958,
        x: 160,
        y: 260,
        width: 120,
        height: 60,
        color: "#10b981",
        thermalTemp: "24°C",
        pixelArea: "7,200 px²",
        groundArea: "162 m²",
        substance: "Effluent Neutralization Basin",
        riskNote: "Acts as wet retention obstacle preventing southern ground seepage."
      }
    ]
  },
  {
    id: "tile-jamshedpur",
    title: "Jharkhand Metallurgical Smelter Complex",
    sensor: "Landsat-9 / Sentinel-2 Thermal SWIR",
    resolution: "20m GSD Industrial Infrared",
    coordinates: "22.8046° N, 86.2029° E",
    captureTime: "2026-09-28 09:15 UTC",
    backgroundStyle: "from-[#1a120b] via-[#2d1c10] to-[#0c0805]",
    spectralBands: ["SWIR Band 7 (2.2µm)", "TIRS Thermal (10.9µm)"],
    maxTemp: "980°C",
    detections: [
      {
        id: "DET-08",
        className: "Active Flame Core",
        confidence: 0.912,
        x: 260,
        y: 190,
        width: 100,
        height: 75,
        color: "#f43f5e",
        thermalTemp: "980°C Slag Vent",
        pixelArea: "7,500 px²",
        groundArea: "3,000 m²",
        substance: "Coke Battery Thermal Vent",
        riskNote: "Operational metallurgy thermal signature enclosed by refractory walls."
      },
      {
        id: "DET-09",
        className: "Vulnerable Industrial Asset",
        confidence: 0.960,
        x: 180,
        y: 120,
        width: 95,
        height: 50,
        color: "#06b6d4",
        thermalTemp: "32°C",
        pixelArea: "4,750 px²",
        groundArea: "1,900 m²",
        substance: "Coal Conveyor Trunk Line",
        riskNote: "Dust ignition hazard if radiant heat approaches 180°C threshold."
      }
    ]
  },
  {
    id: "tile-nagpur",
    title: "Nagpur Central Agriculture Farmland",
    sensor: "Sentinel-2 MSI Surface Reflectance",
    resolution: "10m GSD Optical + NDVI",
    coordinates: "21.1458° N, 79.0882° E",
    captureTime: "2026-09-28 08:30 UTC",
    backgroundStyle: "from-[#0d1a0e] via-[#162a18] to-[#060d07]",
    spectralBands: ["Red B4 (0.66µm)", "NIR B8 (0.84µm)", "NDVI Composite"],
    maxTemp: "285°C",
    detections: [
      {
        id: "DET-10",
        className: "Active Flame Core",
        confidence: 0.825,
        x: 280,
        y: 200,
        width: 80,
        height: 60,
        color: "#f43f5e",
        thermalTemp: "285°C Stubble Fire",
        pixelArea: "4,800 px²",
        groundArea: "480 m²",
        substance: "Harvested Wheat Crop Residue",
        riskNote: "Controlled rural biomass clearing with zero industrial infrastructure nearby."
      },
      {
        id: "DET-11",
        className: "Vulnerable Industrial Asset",
        confidence: 0.971,
        x: 430,
        y: 160,
        width: 70,
        height: 70,
        color: "#06b6d4",
        thermalTemp: "24°C",
        pixelArea: "4,900 px²",
        groundArea: "490 m²",
        substance: "Regional Grain Silo Compound",
        riskNote: "Located 1.2km east across irrigation canal. Safe from thermal exposure."
      }
    ]
  },
  {
    id: "tile-camera",
    title: "Live Optical & Thermal Web Camera",
    sensor: "Device Optical Sensor (Live Webcam)",
    resolution: "1080p High-Speed Frame Capture",
    coordinates: "Local Command Terminal (Live)",
    captureTime: "Real-time Stream",
    backgroundStyle: "from-[#080d18] via-[#0f172a] to-[#050811]",
    spectralBands: ["Optical RGB", "Simulated FLIR IR Overlay", "Motion Saliency"],
    maxTemp: "Live Optical Scan",
    detections: [
      {
        id: "DET-CAM-01",
        className: "Active Flame Core",
        confidence: 0.942,
        x: 220,
        y: 150,
        width: 140,
        height: 100,
        color: "#f43f5e",
        thermalTemp: "Optical Core Locked",
        pixelArea: "14,000 px²",
        groundArea: "Live Camera Target",
        substance: "Optical Brightness Peak",
        riskNote: "Real-time high-intensity luminance/chrominance threshold match."
      },
      {
        id: "DET-CAM-02",
        className: "Smoke / Aerosol Plume",
        confidence: 0.884,
        x: 200,
        y: 80,
        width: 220,
        height: 90,
        color: "#f59e0b",
        thermalTemp: "Ambient Plume",
        pixelArea: "19,800 px²",
        groundArea: "Live Dispersion Zone",
        substance: "Aerosol Haze Dispersion",
        riskNote: "Diffuse plume boundary detected via spatial gradient variance."
      }
    ]
  }
];

export default function ComputerVision({
  theme,
  setActiveScreen
}: {
  theme: "light" | "dark";
  setActiveScreen?: (screen: ActiveScreen) => void;
}) {
  const isDark = theme === "dark";

  // Active satellite tile & inspection
  const [selectedTile, setSelectedTile] = useState<SatelliteTile>(SAMPLE_TILES[0]);
  const [selectedDetection, setSelectedDetection] = useState<BoundingBoxDetection>(SAMPLE_TILES[0].detections[0]);

  // Spectral display modes
  const [spectralMode, setSpectralMode] = useState<"rgb" | "swir" | "ironbow" | "nbr" | "ndvi">("swir");

  // CV Model selector
  const [selectedModel, setSelectedModel] = useState<"yolo11" | "deeplab" | "gemini">("yolo11");

  // Overlays toggle
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showCrosshairs, setShowCrosshairs] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Threshold controls
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.75);

  // Live Optical Webcam Stream
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (err) {
        console.warn("Camera access not available or denied:", err);
        alert("Camera access was not granted or is unavailable on this device. Displaying tactical optical simulation feed.");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Filter detections based on confidence threshold
  const visibleDetections = useMemo(() => {
    return selectedTile.detections.filter((d) => d.confidence >= confidenceThreshold);
  }, [selectedTile, confidenceThreshold]);

  // Handler when selecting a new tile
  const handleSelectTile = (tile: SatelliteTile) => {
    setSelectedTile(tile);
    setSelectedDetection(tile.detections[0]);
    if (tile.id === "tile-camera" && !isCameraActive) {
      toggleCamera();
    }
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto ${isDark ? "text-white" : "text-slate-900"}`}>
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & CV INFERENCE BENCHMARK BAR */}
      {/* ========================================================================= */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDark ? "bg-[#0b101d] border-[#18233a] shadow-lg shadow-black/40" : "bg-white border-slate-200 shadow-md"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#38bdf8]">
                <Scan className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Computer Vision & Satellite Vision Studio
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40">
                Live Multispectral CV
              </span>
            </div>

            <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Multi-scale object detection (YOLOv11-Thermal), multispectral SWIR/NIR band decomposition, and semantic thermal plume segmentation.
            </p>
          </div>

          {/* Model Selector & Real-Time Benchmark HUD */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Model Selector Pills */}
            <div className={`flex items-center rounded-xl p-1 border ${
              isDark ? "bg-[#070b14] border-[#1e2c4a]" : "bg-slate-100 border-slate-300"
            }`}>
              {[
                { id: "yolo11", label: "YOLOv11-Thermal" },
                { id: "deeplab", label: "DeepLabV3+ Multi" },
                { id: "gemini", label: "Gemini 2.5 Vision" }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedModel === m.id
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Inference Benchmark Pill */}
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-3 text-xs font-mono ${
              isDark ? "bg-[#10172a] border-[#1e2c4a] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold">14.8 ms</span>
              </div>
              <span className="text-slate-500">|</span>
              <span>67.5 FPS</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400 font-bold">mAP 94.8%</span>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SATELLITE TILE SELECTOR CAROUSEL */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-2">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Select Satellite Tile / Aerial Feed:
        </span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_TILES.map((tile) => {
            const isSelected = selectedTile.id === tile.id;
            return (
              <button
                key={tile.id}
                onClick={() => handleSelectTile(tile)}
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
                    {tile.sensor.split(" ")[0]}
                  </span>

                  <span className="text-[10px] font-mono font-bold text-rose-400">
                    Max: {tile.maxTemp}
                  </span>
                </div>

                <span className={`text-xs font-bold truncate mt-1 ${
                  isSelected ? (isDark ? "text-white" : "text-blue-950") : (isDark ? "text-slate-200" : "text-slate-800")
                }`}>
                  {tile.title}
                </span>

                <span className={`text-[11px] font-mono truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {tile.coordinates}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN COMPUTER VISION STUDIO VIEWPORT & CONTROLS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT / CENTER COLUMN (xl:col-span-8): CV Viewport, Bands & Overlays */}
        <div className="xl:col-span-8 flex flex-col gap-6">

          {/* 3A. Interactive Viewport Card */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${
            isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
          }`}>
            
            {/* Viewport Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/30">
              
              {/* Spectral Channel Mode Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Band Mode:</span>
                {[
                  { id: "swir", label: "SWIR / NIR Infrared" },
                  { id: "ironbow", label: "FLIR Ironbow Heatmap" },
                  { id: "rgb", label: "RGB Optical True Color" },
                  { id: "nbr", label: "NBR Burn Ratio" },
                  { id: "ndvi", label: "NDVI Foliage Stress" }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSpectralMode(mode.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      spectralMode === mode.id
                        ? "bg-[#2563eb] text-white shadow-sm"
                        : isDark ? "bg-[#141d33] hover:bg-[#1e2c4d] text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Resolution & Sensor Spec & Camera Controls */}
              <div className="flex items-center gap-2">
                {selectedTile.id === "tile-camera" && (
                  <button
                    onClick={toggleCamera}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCameraActive
                        ? "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30"
                    }`}
                  >
                    {isCameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                    <span>{isCameraActive ? "Stop Camera" : "Turn On Camera"}</span>
                  </button>
                )}

                <div className="text-[11px] font-mono text-slate-400 shrink-0">
                  {selectedTile.resolution}
                </div>
              </div>

            </div>

            {/* Tactical CV Canvas Viewport */}
            <div className={`relative w-full rounded-xl overflow-hidden border aspect-[16/10] bg-gradient-to-br ${selectedTile.backgroundStyle} border-[#1e2c4a]`}>
              
              {/* Live Video Feed Background */}
              {isCameraActive && selectedTile.id === "tile-camera" && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
              )}

              <svg
                viewBox="0 0 640 400"
                className="relative z-10 w-full h-full select-none"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Grid Lines Pattern */}
                  <pattern id="cv-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" />
                  </pattern>

                  {/* Ironbow False Color Thermal Core */}
                  <radialGradient id="ironbow-thermal" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="25%" stopColor="#fef08a" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#f97316" stopOpacity="0.75" />
                    <stop offset="75%" stopColor="#dc2626" stopOpacity="0.6" />
                    <stop offset="90%" stopColor="#7e22ce" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
                  </radialGradient>

                  {/* SWIR High-Absorbance Flame Plume Gradient */}
                  <radialGradient id="swir-plume" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="35%" stopColor="#f43f5e" stopOpacity="0.75" />
                    <stop offset="70%" stopColor="#0284c7" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
                  </radialGradient>

                  {/* NBR Burn Severity Gradient */}
                  <radialGradient id="nbr-burn" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.85" />
                    <stop offset="60%" stopColor="#b45309" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* 1. Tactical Grid Overlay */}
                <rect width="640" height="400" fill="url(#cv-grid)" />

                {/* Satellite Imagery Abstract Texture / Ground Features */}
                <path
                  d="M 50,350 Q 200,320 380,360 T 600,340"
                  fill="none"
                  stroke="rgba(100, 116, 139, 0.25)"
                  strokeWidth="6"
                  strokeDasharray="8 6"
                />
                <circle cx="160" cy="120" r="30" fill="none" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="2" />
                <rect x="380" y="240" width="80" height="60" rx="6" fill="rgba(148, 163, 184, 0.08)" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1.5" />

                {/* 2. SPECTRAL BAND HEATMAP SEGMENTATION OVERLAY */}
                {showHeatmap && (
                  <g>
                    {spectralMode === "ironbow" && (
                      <ellipse cx="280" cy="200" rx="140" ry="90" fill="url(#ironbow-thermal)" />
                    )}
                    {spectralMode === "swir" && (
                      <ellipse cx="280" cy="200" rx="130" ry="85" fill="url(#swir-plume)" />
                    )}
                    {spectralMode === "nbr" && (
                      <ellipse cx="280" cy="200" rx="150" ry="100" fill="url(#nbr-burn)" />
                    )}
                    {spectralMode === "ndvi" && (
                      <ellipse cx="280" cy="200" rx="120" ry="80" fill="rgba(34, 197, 94, 0.25)" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" />
                    )}
                  </g>
                )}

                {/* 3. BOUNDING BOX DETECTIONS */}
                {showBoxes &&
                  visibleDetections.map((det) => {
                    const isSelected = selectedDetection?.id === det.id;
                    return (
                      <g
                        key={det.id}
                        onClick={() => setSelectedDetection(det)}
                        className="cursor-pointer transition-all"
                      >
                        {/* Bounding Box Outline */}
                        <rect
                          x={det.x}
                          y={det.y}
                          width={det.width}
                          height={det.height}
                          fill={isSelected ? `${det.color}20` : "transparent"}
                          stroke={det.color}
                          strokeWidth={isSelected ? "2.5" : "1.8"}
                          strokeDasharray={det.className.includes("Plume") ? "5 3" : undefined}
                          rx="4"
                        />

                        {/* Corner Reticle Accents */}
                        <line x1={det.x} y1={det.y} x2={det.x + 8} y2={det.y} stroke={det.color} strokeWidth="3" />
                        <line x1={det.x} y1={det.y} x2={det.x} y2={det.y + 8} stroke={det.color} strokeWidth="3" />
                        <line x1={det.x + det.width} y1={det.y} x2={det.x + det.width - 8} y2={det.y} stroke={det.color} strokeWidth="3" />
                        <line x1={det.x + det.width} y1={det.y} x2={det.x + det.width} y2={det.y + 8} stroke={det.color} strokeWidth="3" />
                        <line x1={det.x} y1={det.y + det.height} x2={det.x + 8} y2={det.y + det.height} stroke={det.color} strokeWidth="3" />
                        <line x1={det.x} y1={det.y + det.height} x2={det.x} y2={det.y + det.height - 8} stroke={det.color} strokeWidth="3" />
                        <line x1={det.x + det.width} y1={det.y + det.height} x2={det.x + det.width - 8} y2={det.y + det.height} stroke={det.color} strokeWidth="3" />
                        <line x1={det.x + det.width} y1={det.y + det.height} x2={det.x + det.width} y2={det.y + det.height - 8} stroke={det.color} strokeWidth="3" />

                        {/* Label Badge */}
                        {showLabels && (
                          <g transform={`translate(${det.x}, ${det.y - 18})`}>
                            <rect
                              x="0"
                              y="0"
                              width={det.className.length * 6.2 + 46}
                              height="16"
                              rx="3"
                              fill={det.color}
                            />
                            <text
                              x="6"
                              y="11.5"
                              fill="#ffffff"
                              fontSize="9.5"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              {det.className} {Math.round(det.confidence * 100)}%
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                {/* 4. THERMAL APEX CENTROID CROSSHAIRS */}
                {showCrosshairs && (
                  <g transform="translate(285, 200)">
                    <circle cx="0" cy="0" r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="-20" y1="0" x2="-6" y2="0" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="6" y1="0" x2="20" y2="0" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="0" y1="-20" x2="0" y2="-6" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="0" y1="6" x2="0" y2="20" stroke="#ef4444" strokeWidth="1.5" />
                    
                    <text x="18" y="-12" fill="#ef4444" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      APEX {selectedTile.maxTemp}
                    </text>
                  </g>
                )}

                {/* Viewport Frame HUD Elements */}
                <text x="16" y="24" fill="rgba(56, 189, 248, 0.7)" fontSize="10" fontFamily="monospace">
                  FOV: 1.4km² | ELEV: 786km LEO ORBIT | SPECTRAL RESOLUTION: 13 BANDS
                </text>
                <text x="16" y="388" fill="rgba(148, 163, 184, 0.7)" fontSize="10" fontFamily="monospace">
                  TIMESTAMP: {selectedTile.captureTime} | PROJECTION: EPSG:4326 (WGS 84)
                </text>
                <text x="560" y="388" textAnchor="end" fill="rgba(56, 189, 248, 0.7)" fontSize="10" fontFamily="monospace">
                  OBJECTS: {visibleDetections.length} DETECTED
                </text>

              </svg>

            </div>

            {/* Viewport Overlay Toggles Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-700/30 text-xs">
              
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={showBoxes}
                    onChange={(e) => setShowBoxes(e.target.checked)}
                    className="accent-blue-500 rounded"
                  />
                  <span>Bounding Boxes</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={(e) => setShowHeatmap(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <span>Thermal Heatmap</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={showCrosshairs}
                    onChange={(e) => setShowCrosshairs(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Apex Reticle</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Confidence Tags</span>
                </label>
              </div>

              {/* Confidence Threshold Slider */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">Min Conf:</span>
                <input
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.05"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-24 accent-blue-500 cursor-pointer"
                />
                <span className="font-mono font-bold text-blue-400 text-xs">
                  {Math.round(confidenceThreshold * 100)}%
                </span>
              </div>

            </div>

          </div>

          {/* 3B. Spectral Band Decomposition & Formula Guide */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3.5 ${
            isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
          }`}>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#2563eb]" />
              <span>Multi-Spectral Band Indices & Computer Vision Features</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              <div className="p-3 rounded-xl bg-[#10172a] border border-[#1e2c4a] flex flex-col gap-1">
                <span className="font-bold text-rose-400">SWIR / NIR Ratio (2.81)</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Calculated from Sentinel-2 Band 12 (2.19µm) / Band 8 (0.84µm). High ratio indicates intense hydrocarbon combustion.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#10172a] border border-[#1e2c4a] flex flex-col gap-1">
                <span className="font-bold text-amber-400">NBR Burn Index (-0.44)</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Formula: (NIR - SWIR) / (NIR + SWIR). Negative values demonstrate extreme carbonization and structural charring.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#10172a] border border-[#1e2c4a] flex flex-col gap-1">
                <span className="font-bold text-emerald-400">NDVI Moisture (0.18)</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Formula: (NIR - Red) / (NIR + Red). Detects depleted chlorophyll in buffer foliage, validating high flashover risk.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (xl:col-span-4): Selected Detection Dossier & Actions */}
        <div className="xl:col-span-4 flex flex-col gap-6">

          {/* 3C. Selected Detection Deep Inspection Card */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3.5 ${
            isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
          }`}>
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Crosshair className="h-4 w-4 text-[#2563eb]" />
                <span>Selected Object Inspection</span>
              </h2>

              <span
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                style={{ backgroundColor: `${selectedDetection?.color}25`, color: selectedDetection?.color }}
              >
                {selectedDetection?.id}
              </span>
            </div>

            {selectedDetection ? (
              <div className="flex flex-col gap-3 text-xs">
                
                {/* Class Name & Confidence */}
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-white">
                    {selectedDetection.className}
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {Math.round(selectedDetection.confidence * 100)}% Conf
                  </span>
                </div>

                {/* Risk Note */}
                <p className="p-2.5 rounded-xl bg-[#070b14] border border-[#1c2742] text-[11px] text-slate-300 leading-relaxed">
                  {selectedDetection.riskNote}
                </p>

                {/* Detailed Metrics Table */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-[#10172a] border border-[#1e2c4a]">
                    <span className="text-slate-400 block text-[10px]">Thermal Signature:</span>
                    <span className="font-bold text-rose-400">{selectedDetection.thermalTemp}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#10172a] border border-[#1e2c4a]">
                    <span className="text-slate-400 block text-[10px]">Substance / Material:</span>
                    <span className="font-bold text-white truncate block">{selectedDetection.substance}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#10172a] border border-[#1e2c4a]">
                    <span className="text-slate-400 block text-[10px]">Pixel Area:</span>
                    <span className="font-bold text-cyan-400">{selectedDetection.pixelArea}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#10172a] border border-[#1e2c4a]">
                    <span className="text-slate-400 block text-[10px]">Ground Footprint:</span>
                    <span className="font-bold text-white">{selectedDetection.groundArea}</span>
                  </div>
                </div>

                {/* Bounding Box Coordinates */}
                <div className="p-2.5 rounded-xl bg-[#070b14] border border-[#1c2742] text-[10px] font-mono text-slate-400 flex justify-between">
                  <span>BBOX: [x:{selectedDetection.x}, y:{selectedDetection.y}, w:{selectedDetection.width}, h:{selectedDetection.height}]</span>
                  <span className="text-emerald-400 font-bold">IoU: 0.86</span>
                </div>

              </div>
            ) : (
              <p className="text-xs text-slate-400">Click any bounding box on the viewport to inspect its parameters.</p>
            )}

          </div>

          {/* 3D. Active Detections List */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${
            isDark ? "bg-[#0b101d] border-[#18233a]" : "bg-white border-slate-200 shadow-md"
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Tile Detections ({visibleDetections.length})
            </h3>

            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto">
              {visibleDetections.map((det) => {
                const isSelected = selectedDetection?.id === det.id;
                return (
                  <button
                    key={det.id}
                    onClick={() => setSelectedDetection(det)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#18233a] border-[#2563eb] ring-1 ring-[#2563eb]"
                        : "bg-[#10172a] border-[#1e2c4a] hover:bg-[#141d33]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: det.color }} />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{det.className}</span>
                        <span className="text-[10px] font-mono text-slate-400">{det.substance}</span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {Math.round(det.confidence * 100)}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3E. Action Buttons */}
          <div className="flex flex-col gap-2.5">
            {setActiveScreen && (
              <button
                onClick={() => setActiveScreen("active-investigations")}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-600/30"
              >
                <span>Synthesize In Active Investigations</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {setActiveScreen && (
              <button
                onClick={() => setActiveScreen("live-demo")}
                className="w-full py-2.5 px-4 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Simulate Spread Dynamics</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
