import React, { useState } from "react";
import { ActiveScreen, ModelMode } from "../types";
import { 
  Search, 
  Menu as MenuIcon, 
  ChevronDown,
  X
} from "lucide-react";
// @ts-ignore
import profilePic from "../assets/images/kritika_profile.jpg";

interface HeaderProps {
  activeScreen?: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  modelMode?: ModelMode;
  setModelMode?: (mode: ModelMode) => void;
  totalHotspots?: number;
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
  activeScreen = "home",
  setActiveScreen,
  onMenuToggle,
  searchQuery = "",
  setSearchQuery,
  onOpenAuthModal,
  onOpenDispatchModal
}: HeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const navLinks: { id: ActiveScreen; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "command-center", label: "Live Map" },
    { id: "active-investigations", label: "Alerts" },
    { id: "incident-reports", label: "Reports" },
    { id: "system-health", label: "Analytics" },
  ];

  return (
    <header className="h-16 px-4 lg:px-8 flex items-center justify-between border-b transition-colors duration-200 z-30 sticky top-0 backdrop-blur-md bg-[#0b101d]/90 border-[#18233a] text-white">
      {/* Left side: Mobile menu toggle + Brand + Clickable Nav Links (Unboxed) */}
      <div className="flex items-center gap-4 lg:gap-6">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          type="button"
          aria-label="Open navigation menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveScreen("home")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-[#070b14] border border-[#1e2c4a] flex items-center justify-center shadow-sm shadow-blue-900/30 group-hover:scale-105 transition-transform shrink-0">
            <img 
              src="/app_icon.png" 
              alt="Thermo Shield AI" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="text-sm font-bold tracking-tight text-white hidden sm:inline">
            Thermo Shield
          </span>
        </div>

        {/* Clean, Unboxed Clickable Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeScreen === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveScreen(link.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer rounded-lg ${
                  isActive
                    ? "text-[#38bdf8] font-semibold bg-white/[0.05]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right side: Clickable Search + Clickable Dispatch + Clickable Profile (All Unboxed) */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Minimal Unboxed Search Bar */}
        <div className="relative flex items-center">
          <div className="absolute left-2.5 text-slate-400 pointer-events-none">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => setIsSearchActive(false)}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search hotspots..."
            className={`pl-8 pr-3 py-1.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 rounded-lg transition-all focus:outline-none ${
              isSearchActive || searchQuery
                ? "w-44 sm:w-64 bg-white/[0.07]"
                : "w-32 sm:w-48 bg-white/[0.03] hover:bg-white/[0.05]"
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery && setSearchQuery("")}
              className="absolute right-2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Clickable Quick Tactical Dispatch Action (Unboxed) */}
        {onOpenDispatchModal && (
          <button
            onClick={onOpenDispatchModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            <span className="hidden sm:inline">Dispatch</span>
          </button>
        )}

        {/* Clickable Operator Profile (Unboxed) */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer select-none"
            type="button"
          >
            <img
              src={profilePic}
              alt="Kritika Tripathi"
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="hidden md:inline text-xs font-medium text-slate-200">
              Kritika
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl border p-2 z-50 animate-in fade-in zoom-in-95 duration-100 bg-[#0f172a] border-[#1e2c4a] text-slate-200">
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
                    className="w-full text-left px-3 py-1.5 text-xs rounded-xl transition-colors hover:bg-slate-800 text-blue-400 font-medium cursor-pointer"
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
                    className="w-full text-left px-3 py-1.5 text-xs rounded-xl transition-colors hover:bg-slate-800 text-rose-400 font-medium cursor-pointer"
                  >
                    Manual Anomaly Dispatch
                  </button>
                )}
                <button
                  onClick={() => {
                    setActiveScreen("settings");
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-xl transition-colors hover:bg-slate-800 cursor-pointer"
                >
                  System Preferences
                </button>
                <button
                  onClick={() => {
                    setActiveScreen("system-health");
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-xl transition-colors hover:bg-slate-800 cursor-pointer"
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
