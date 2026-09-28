import React, { useState } from "react";
import {
  Shield,
  Globe,
  Radio,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Bell
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
      title: `Welcome, ${user?.name ? user.name.split(" ")[0] : "Commander"}!`,
      subtitle: "Autonomous Spaceborne Thermal Defense",
      badge: "Clearance Active",
      icon: Shield,
      color: "text-[#38bdf8]",
      bgColor: "bg-blue-500/15 border-blue-500/30",
      description:
        "Autonomous satellite monitoring protecting refineries and storage tanks from fire flashovers before ground alarms trigger.",
      highlights: [
        "Continuous 24/7 low-Earth orbit satellite monitoring (VIIRS & Sentinel-2)",
        "Early warning detection at 30+ MW before flame breaches enclosures"
      ]
    },
    {
      title: "Interactive 3D Global & Tactical Map",
      subtitle: "Live Orbital Telemetry",
      badge: "Geospatial Tracking",
      icon: Globe,
      color: "text-blue-400",
      bgColor: "bg-blue-500/15 border-blue-500/30",
      description:
        "High-performance 3D WebGL globe and 2D tactical map for tracking real-time hotspot clusters.",
      highlights: [
        "Global thermal radiant flux (FRP) and live satellite passes",
        "Asset proximity buffers, nearest fire stations, and route access"
      ]
    },
    {
      title: "Backend Multispectral Neural Vision",
      subtitle: "YOLOv11 & SWIR Band Decomposition",
      badge: "Vision AI Engine",
      icon: Radio,
      color: "text-rose-400",
      bgColor: "bg-rose-500/15 border-rose-500/30",
      description:
        "Sub-20ms backend neural network segments active flame cores, smoke aerosols, and vulnerable facility tanks.",
      highlights: [
        "SWIR/NIR ratio hydrocarbon analysis and NBR burn indexing",
        "Automated false-positive filtering against industrial flares"
      ]
    },
    {
      title: "Spatial AI & Automated Containment",
      subtitle: "Gemini 2.5 Intelligence",
      badge: "Automated Defense",
      icon: Cpu,
      color: "text-purple-400",
      bgColor: "bg-purple-500/15 border-purple-500/30",
      description:
        "Correlates thermal spikes against critical assets, calculates flashover risk, and deploys deluge barriers.",
      highlights: [
        "Dynamic 0–100 Threat Score and Time-to-Asset Impact countdown",
        "Automated 1200 LPM deluge activation and instant DEOC dispatch"
      ]
    },
    {
      title: "Clearance Activated",
      subtitle: "Ready for Operation",
      badge: "Operational",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/15 border-emerald-500/30",
      description:
        "Your workstation is synchronized with live orbital telemetry. Choose where to begin:",
      highlights: [
        "Command Center: Monitor real-time geospatial hotspots",
        "Simulation Sandbox: Model dynamic wind vectors and deluge barriers"
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
      <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-[#0b101d] border border-[#1e2c4a] shadow-2xl text-white flex flex-col gap-5">
        
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
        <div className="flex flex-col gap-3.5">
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-2xl border ${stepData.bgColor} ${stepData.color} shrink-0`}>
              <StepIcon className="h-5 w-5" />
            </div>

            <div className="flex flex-col">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
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

          {/* Highlights checklist (concise 2 items) */}
          <div className="p-3.5 rounded-2xl bg-[#070b14] border border-[#18233a] flex flex-col gap-2">
            {stepData.highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#38bdf8] shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>

          {/* Quick Destination Buttons on Last Step */}
          {isLast && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleFinish("command-center")}
                className="p-2.5 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-xs font-bold text-blue-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Live Map</span>
              </button>

              <button
                onClick={() => handleFinish("active-investigations")}
                className="p-2.5 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-xs font-bold text-rose-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Alerts</span>
              </button>

              <button
                onClick={() => handleFinish("live-demo")}
                className="p-2.5 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulation</span>
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
                className="px-3 py-1.5 rounded-xl bg-[#141d33] hover:bg-[#1e2c4d] border border-[#1e2c4a] text-xs font-semibold text-slate-300 flex items-center gap-1 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {!isLast ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-4 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-600/30"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => handleFinish("home")}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Enter Dashboard</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
