import React, { useState } from "react";
import { ActiveScreen, ModelMode } from "../types";
import { 
  Search, 
  Menu as MenuIcon, 
  ChevronDown,
  CloudSun,
  Cpu,
  Globe2,
  Check
} from "lucide-react";
// @ts-ignore
import profilePic from "../assets/images/kritika_profile.jpg";

interface HeaderProps {
  activeScreen?: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  modelMode: ModelMode;
  setModelMode: (mode: ModelMode) => void;
  totalHotspots: number;
  theme?: "light" | "dark";
  setTheme?: (theme: "light" | "dark") => void;
  onMenuToggle: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  isLiveConnected?: boolean;
  onOpenAuthModal?: () => void;
  onOpenDispatchModal?: () => void;
}

export default function Header({
  setActiveScreen,
  modelMode,
  setModelMode,
  onMenuToggle,
  searchQuery = "",
  setSearchQuery,
  isLiveConnected = true,
  onOpenAuthModal,
  onOpenDispatchModal
}: HeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="h-16 px-4 lg:px-6 flex items-center justify-between border-b transition-colors duration-200 z-30 sticky top-0 backdrop-blur-md bg-[#0b101d]/90 border-[#18233a] text-white">
      {/* Left side: Mobile menu toggle + Global Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          type="button"
          aria-label="Open navigation menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search hotspots, sensors, facilities (e.g., Paradip, Dahej, Sentinel-2)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-[#10172a] border border-[#1e2c4a] text-slate-200 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Right side: Live stream badge, Dispatch button, Weather, AI mode pill, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live WebSocket Telemetry Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-[#10172a] border-[#1e2c4a] text-slate-300">
          <span className={`w-2 h-2 rounded-full ${isLiveConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
          <span>{isLiveConnected ? "Satellite Stream Active" : "Stream Connecting"}</span>
        </div>

        {/* Quick Manual Dispatch Button */}
        {onOpenDispatchModal && (
          <button
            onClick={onOpenDispatchModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 transition-all cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            <span>Dispatch Anomaly</span>
          </button>
        )}

        {/* Subtle Weather / Atmosphere Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-[#10172a] border-[#1e2c4a] text-slate-300">
          <CloudSun className="h-3.5 w-3.5 text-amber-400" />
          <span>Odisha: 31°C • Clear SWIR</span>
        </div>

        {/* AI Processing Mode Pill (Cloud Gemini vs Local Edge) */}
        <div className="flex items-center p-0.5 rounded-xl border bg-[#10172a] border-[#1e2c4a]">
          <button
            onClick={() => setModelMode("cloud")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              modelMode === "cloud"
                ? "bg-[#2563eb] text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
            title="Google Gemini Cloud Reasoning"
          >
            <Globe2 className="h-3 w-3" />
            <span>Cloud</span>
          </button>
          <button
            onClick={() => setModelMode("local")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              modelMode === "local"
                ? "bg-[#2563eb] text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
            title="Local Edge ConvNeXt Inference"
          >
            <Cpu className="h-3 w-3" />
            <span>Local</span>
          </button>
        </div>

        {/* Operator Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border transition-all cursor-pointer bg-[#10172a] border-[#1e2c4a] hover:border-slate-600"
            type="button"
          >
            <img
              src={profilePic}
              alt="Kritika Tripathi"
              className="w-7 h-7 rounded-full object-cover border border-slate-700"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold leading-tight text-slate-200">
                Kritika Tripathi
              </span>
              <span className="text-[10px] text-emerald-400 font-medium leading-none">
                Chief Officer
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border p-2 z-50 animate-in fade-in zoom-in-95 duration-100 bg-[#0f172a] border-[#1e2c4a] text-slate-200">
              <div className="px-3 py-2 border-b border-[#1e2c4a]">
                <p className="text-xs font-semibold text-white">Kritika Tripathi</p>
                <p className="text-[11px] text-slate-400">Chief Geospatial Officer</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: OP-TS-8492</p>
              </div>

              <div className="py-1">
                {onOpenAuthModal && (
                  <button
                    onClick={() => {
                      onOpenAuthModal();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs rounded-xl transition-colors hover:bg-slate-800 text-blue-400 font-medium"
                  >
                    Switch Security Clearance
                  </button>
                )}
                {onOpenDispatchModal && (
                  <button
                    onClick={() => {
                      onOpenDispatchModal();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs rounded-xl transition-colors hover:bg-slate-800 text-rose-400 font-medium"
                  >
                    Manual Anomaly Dispatch
                  </button>
                )}
                <button
                  onClick={() => {
                    setActiveScreen("settings");
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-xl transition-colors hover:bg-slate-800"
                >
                  System Preferences
                </button>
                <button
                  onClick={() => {
                    setActiveScreen("system-health");
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-xl transition-colors hover:bg-slate-800"
                >
                  Diagnostic Logs
                </button>
              </div>

              <div className="pt-1 border-t border-[#1e2c4a]">
                <div className="px-3 py-1 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Thermo Shield AI</span>
                  <span className="text-emerald-400 font-medium">v1.2.0 • Online</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
