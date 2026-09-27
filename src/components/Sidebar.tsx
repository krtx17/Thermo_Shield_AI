import React from "react";
import { ActiveScreen } from "../types";
import { 
  Home as HomeIcon, 
  Map as MapIcon, 
  Bell, 
  BarChart2, 
  FileText, 
  GitCompare, 
  Sparkles, 
  Settings, 
  Shield,
  X
} from "lucide-react";

interface SidebarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  isOpen: boolean;
  onClose: () => void;
  theme?: "light" | "dark";
  activeAlertsCount?: number;
}

export default function Sidebar({
  activeScreen,
  setActiveScreen,
  isOpen,
  onClose,
  activeAlertsCount = 3
}: SidebarProps) {
  const navItems: { id: ActiveScreen; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "command-center", label: "Live Map", icon: MapIcon },
    { id: "active-investigations", label: "Alerts", icon: Bell, badge: activeAlertsCount },
    { id: "system-health", label: "Analytics", icon: BarChart2 },
    { id: "incident-reports", label: "Reports", icon: FileText },
    { id: "risk-comparison", label: "Compare", icon: GitCompare },
    { id: "live-demo", label: "Simulation", icon: Sparkles },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div 
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } bg-black/60 backdrop-blur-xs`}
        onClick={onClose}
      />

      {/* Sidebar navigation */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 bottom-0 h-screen w-60 z-50 flex flex-col justify-between py-5 px-3 border-r transition-all duration-300 ease-in-out shrink-0 select-none bg-[#0b101d] border-[#18233a] text-white ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div 
              onClick={() => { setActiveScreen("home"); onClose(); }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/10 p-0.5 border border-white/20 flex items-center justify-center shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform shrink-0">
                <img 
                  src="/app_icon.png" 
                  alt="Thermo Shield AI Icon" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-tight leading-none text-white">
                  Thermo Shield AI
                </span>
                <span className="text-[10px] font-semibold text-[#38bdf8] leading-none mt-1">
                  Thermal Defense
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg lg:hidden transition-colors text-slate-400 hover:text-white hover:bg-slate-800"
              type="button"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveScreen(item.id);
                    onClose();
                  }}
                  className={`w-full h-10 px-3.5 rounded-xl text-sm font-medium text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isActive
                      ? "bg-[#2563eb] text-white shadow-sm shadow-blue-600/30 font-semibold"
                      : "text-[#8e9db7] hover:text-white hover:bg-[#141d33]"
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-white" : ""}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold leading-none ${
                      isActive 
                        ? "bg-white text-[#2563eb]" 
                        : "bg-rose-500 text-white shadow-sm"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status Widget */}
        <div className="px-2 pt-4">
          <div className="p-3 rounded-xl border flex items-center gap-2.5 bg-[#10172a] border-[#1b2742] text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-[#2563eb]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold leading-tight text-white">
                  Orbital Defense
                </span>
              </div>
              <span className="text-[10px] leading-tight text-slate-400 mt-0.5">
                VIIRS & Sentinel-2 Active
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
