import React, { useState } from "react";
import {
  Shield,
  Globe,
  Scan,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Flame,
  Radio,
  Eye
} from "lucide-react";
import { ActiveScreen, UserProfile } from "../types";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  setActiveScreen?: (screen: ActiveScreen) => void;
  user?: UserProfile | null;
}

export default function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
  setActiveScreen,
  user
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: `Welcome to Thermo Shield AI, ${user?.name ? user.name.split(" ")[0] : "Operator"}!`,
      subtitle: "Autonomous Space-to-Ground Multispectral Early Warning",
      badge: "Security Clearance Activated",
      icon: Shield,
      color: "text-[#38bdf8]",
      bgColor: "bg-blue-500/15 border-blue-500/30",
      description:
        "You have been granted operational access to Thermo Shield AI—an autonomous spaceborne defense network protecting hydrocarbon refineries, chemical enclaves, and rural interfaces from catastrophic fire flashovers before ground detectors can react.",
      highlights: [
        "Continuous 24/7 low-Earth-orbit satellite monitoring (VIIRS & Sentinel-2)",
        "Early warning detection at 30+ MW before visual flame breaches enclosure",
        "Automated state DEOC dispatch and high-pressure deluge barrier deployment"
      ]
    },
    {
      title: "Interactive 3D Global & Live Tactical Map",
      subtitle: "Real-Time Orbital Hotspot Tracking",
      badge: "Spaceborne Telemetry",
      icon: Globe,
      color: "text-blue-400",
      bgColor: "bg-blue-500/15 border-blue-500/30",
      description:
        "The Command Center pairs a high-performance 3D WebGL Earth globe with a 2D tactical incident map. Monitor live orbital passes, query regional industrial clusters, and filter anomalies by severity from CRITICAL to MONITORED.",
      highlights: [
        "Rotate the 3D globe with touch or mouse to inspect global thermal flux",
        "Click any regional hotspot pin to inspect real-time sensor telemetry",
        "Direct road access, nearest fire stations, and OSM asset proximity buffers"
      ]
    },
    {
      title: "Computer Vision & Multispectral Studio",
      subtitle: "YOLOv11-Thermal & Band Decomposition",
      badge: "Deep Learning Studio",
      icon: Scan,
      color: "text-rose-400",
      bgColor: "bg-rose-500/15 border-rose-500/30",
      description:
        "Inspect high-resolution satellite tiles and aerial drone FLIR feeds. Our custom YOLOv11-Thermal model segments active flame cores, aerosol smoke plumes, and vulnerable tanks in under 20ms with multi-band SWIR/NIR spectral validation.",
      highlights: [
        "Toggle False-Color SWIR Infrared, FLIR Ironbow, and NBR burn ratios",
        "Interactive bounding boxes with pixel coordinates, IoU, and thermal apex temp",
        "Confidence threshold filtering and multispectral feature extraction"
      ]
    },
    {
      title: "Gemini 2.5 Flash & Automated Containment",
      subtitle: "Spatial Reasoning & Deluge Suppression",
      badge: "Autonomous Action",
      icon: Cpu,
      color: "text-purple-400",
      bgColor: "bg-purple-500/15 border-purple-500/30",
      description:
        "Google Gemini 2.5 Flash correlates thermal spikes against critical petrochemical assets, eliminates false alarms like routine industrial flaring, and autonomously engages perimeter deluge water curtains to stop fire spread.",
      highlights: [
        "Dynamic 0-100 Threat Score and Time-to-Asset Impact countdown",
        "Automated chemical foam deluge curtain activation (1200 LPM)",
        "Instant emergency dispatch broadcast to State DEOC operations"
      ]
    },
    {
      title: "Operational Clearance Ready",
      subtitle: "Choose Where You Want to Begin",
      badge: "Deployment Stations",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/15 border-emerald-500/30",
      description:
        "Your workstation is fully synchronized with live telemetry feeds. Select your initial deployment module below to start defending critical industrial infrastructure:",
      highlights: [
        "Computer Vision Studio: Inspect multispectral flame bounding boxes",
        "Simulation Sandbox: Test dynamic wind vectors and deluge barriers",
        "Command Center: Monitor real-time geospatial hotspots across India"
      ]
    }
  ];

  const stepData = steps[currentStep];
  const StepIcon = stepData.icon;
  const isLast = currentStep === steps.length - 1;

  const handleFinish = (targetScreen?: ActiveScreen) => {
    localStorage.setItem("thermo_shield_onboarding_completed", "true");
    onComplete();
    onClose();
    if (targetScreen && setActiveScreen) {
      setActiveScreen(targetScreen);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#0b101d] border border-[#1e2c4a] shadow-2xl text-white flex flex-col gap-6">
        
        {/* Top Progress & Close Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/15 text-[#38bdf8] border border-blue-500/30">
              {stepData.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <button
            onClick={() => handleFinish()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Skip Onboarding"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2563eb] transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl border ${stepData.bgColor} ${stepData.color} shrink-0`}>
              <StepIcon className="h-6 w-6" />
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                {stepData.title}
              </h2>
              <span className="text-xs text-slate-400 font-medium mt-0.5">
                {stepData.subtitle}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {stepData.description}
          </p>

          {/* Highlights checklist */}
          <div className="p-4 rounded-2xl bg-[#070b14] border border-[#18233a] flex flex-col gap-2">
            {stepData.highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-[#38bdf8] shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>

          {/* Quick Destination Buttons on Last Step */}
          {isLast && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                onClick={() => handleFinish("computer-vision")}
                className="p-2.5 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>Computer Vision</span>
              </button>

              <button
                onClick={() => handleFinish("live-demo")}
                className="p-2.5 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulation</span>
              </button>

              <button
                onClick={() => handleFinish("command-center")}
                className="p-2.5 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-xs font-bold text-blue-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Live Map</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1e2c4a]">
          <button
            onClick={() => handleFinish()}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Skip Walkthrough
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-3.5 py-2 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-xs font-semibold text-slate-300 flex items-center gap-1 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {!isLast ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-600/30"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => handleFinish("home")}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Enter Command Dashboard</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
