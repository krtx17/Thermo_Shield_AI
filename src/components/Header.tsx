import React, { useState } from "react";
import { ActiveScreen, ModelMode } from "../types";
import { 
  Search, 
  Sun, 
  Moon, 
  Menu as MenuIcon, 
  ChevronDown,
  CloudSun,
  Cpu,
  Globe2,
  Check
} from "lucide-react";
// @ts-ignore
import profilePic from "../assets/images/archit_profile_1788707836364.jpg";

interface HeaderProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  modelMode: ModelMode;
  setModelMode: (mode: ModelMode) => void;
  totalHotspots: number;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  onMenuToggle: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function Header({
  setActiveScreen,
  modelMode,
  setModelMode,
  theme,
  setTheme,
  onMenuToggle,
  searchQuery = "",
  setSearchQuery
}: HeaderProps) {
  const isDark = theme === "dark";
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className={`h-16 px-4 lg:px-6 flex items-center justify-between border-b transition-colors duration-200 z-30 sticky top-0 backdrop-blur-md ${
      isDark 
        ? "bg-[#0b101d]/90 border-[#18233a] text-white" 
        : "bg-white/90 border-slate-200 text-slate-800"
    }`}>
      {/* Left side: Mobile menu toggle + Global Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onMenuToggle}
          className={`lg:hidden p-2 rounded-xl border transition-colors ${
            isDark 
              ? "border-[#1e2c4a] bg-[#10172a] text-slate-300 hover:text-white" 
              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}
          type="button"
          aria-label="Open menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        {/* Search input matching reference images */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-slate-400"}`} />
          </div>
          <input
            type="text"
            placeholder="Search location, coordinates or facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className={`w-full h-10 pl-10 pr-4 rounded-xl text-xs sm:text-sm font-normal transition-all outline-none border ${
              isDark 
                ? "bg-[#11182c] border-[#1e2c4a] text-white placeholder-slate-400 focus:border-[#2563eb] focus:bg-[#141d35]" 
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#2563eb] focus:bg-white"
            }`}
          />
        </div>
      </div>

      {/* Right side: Weather widget, AI mode pill, Theme toggle, Profile */}
      <div className="flex items-center gap-3 sm:gap-4 pl-3">
        {/* Weather indicator matching FireSight top-right */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
          isDark 
            ? "bg-[#10172a] border-[#1e2c4a] text-slate-300" 
            : "bg-slate-50 border-slate-200 text-slate-700"
        }`}>
          <CloudSun className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-medium">23°C Clear</span>
        </div>

        {/* AI Model Mode selector (Cloud vs Local) */}
        <div className={`hidden sm:flex items-center p-1 rounded-xl border ${
          isDark ? "bg-[#10172a] border-[#1e2c4a]" : "bg-slate-100 border-slate-200"
        }`}>
          <button
            onClick={() => setModelMode("cloud")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              modelMode === "cloud"
                ? "bg-[#2563eb] text-white shadow-xs"
                : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
            title="Google Gemini Cloud Inference"
          >
            <Globe2 className="h-3 w-3" />
            <span>Cloud</span>
          </button>

          <button
            onClick={() => setModelMode("local")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              modelMode === "local"
                ? "bg-[#2563eb] text-white shadow-xs"
                : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
            title="Local Edge ConvNeXt Inference"
          >
            <Cpu className="h-3 w-3" />
            <span>Local</span>
          </button>
        </div>

        {/* Theme Toggle (FireSight Dark vs FireSense Light) */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
            isDark 
              ? "bg-[#10172a] border-[#1e2c4a] text-amber-400 hover:bg-[#141d33]" 
              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
          title={isDark ? "Switch to FireSense Light" : "Switch to FireSight Dark"}
          type="button"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Operator Profile Pill matching reference images */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border transition-all cursor-pointer ${
              isDark 
                ? "bg-[#10172a] border-[#1e2c4a] hover:border-[#2b3d63]" 
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
            type="button"
          >
            <div className="relative">
              <img
                alt="Nancy Chan"
                src={profilePic}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0b101d]" />
            </div>
            <span className={`text-xs font-medium hidden sm:inline ${
              isDark ? "text-slate-200" : "text-slate-800"
            }`}>
              Team Nancy Chan
            </span>
            <ChevronDown className={`h-3.5 w-3.5 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-52 rounded-xl border shadow-xl p-2 z-50 transition-all ${
              isDark 
                ? "bg-[#0f172a] border-[#1e2c4a] text-white" 
                : "bg-white border-slate-200 text-slate-800"
            }`}>
              <div className="px-3 py-2 border-b border-slate-700/20">
                <p className="text-xs font-semibold">Team Nancy Chan</p>
                <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Emergency Operations Center
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveScreen("settings");
                    setProfileDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
                  }`}
                >
                  System Preferences
                </button>
                <button
                  onClick={() => {
                    setActiveScreen("audit-trail");
                    setProfileDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
                  }`}
                >
                  Audit Verification Logs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
