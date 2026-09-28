import React from "react";
import { ActiveScreen, UserProfile } from "../types";
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
  Scan,
  Info,
  LogIn,
  X
} from "lucide-react";

interface SidebarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  isOpen: boolean;
  onClose: () => void;
  theme?: "light" | "dark";
  activeAlertsCount?: number;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

export default function Sidebar({
  activeScreen,
  setActiveScreen,
  isOpen,
  onClose,
  activeAlertsCount = 3,
  currentUser,
  onOpenAuthModal
}: SidebarProps) {
  const navItems: { id: ActiveScreen; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "command-center", label: "Live Map", icon: MapIcon },
    { id: "computer-vision", label: "Computer Vision", icon: Scan },
    { id: "active-investigations", label: "Alerts", icon: Bell, badge: activeAlertsCount },
    { id: "live-demo", label: "Simulation", icon: Sparkles },
    { id: "about", label: "How It Works", icon: Info },
    { id: "system-health", label: "Analytics", icon: BarChart2 },
    { id: "incident-reports", label: "Reports", icon: FileText },
    { id: "risk-comparison", label: "Compare", icon: GitCompare },
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
        <div className="flex flex-col gap-5 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-1 shrink-0">
            <div 
              onClick={() => { setActiveScreen("home"); onClose(); }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#070b14] border border-[#1e2c4a] flex items-center justify-center shadow-md shadow-blue-900/30 group-hover:scale-105 transition-transform shrink-0">
                <img 
                  src="/app_icon.png" 
                  alt="Thermo Shield AI Icon" 
                  className="w-full h-full object-cover" 
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
                  className={`w-full h-9.5 px-3 rounded-xl text-xs font-medium text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                    isActive
                      ? "bg-[#2563eb] text-white shadow-sm shadow-blue-600/30 font-semibold"
                      : "text-[#8e9db7] hover:text-white hover:bg-[#141d33]"
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : ""}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold leading-none ${
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

        {/* Bottom Operator Status Widget */}
        <div className="px-2 pt-3 border-t border-[#18233a] shrink-0">
          {currentUser ? (
            <div className="p-2.5 rounded-xl border flex items-center justify-between bg-[#10172a] border-[#1b2742] text-slate-300">
              <div className="flex items-center gap-2 truncate">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-[#38bdf8] flex items-center justify-center shrink-0 text-xs font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[11px] font-bold text-white truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-[#38bdf8] font-mono leading-tight mt-0.5">
                    {currentUser.role.replace("_", " ")}
                  </span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Clearance Verified" />
            </div>
          ) : (
            <button
              onClick={() => {
                if (onOpenAuthModal) onOpenAuthModal();
                onClose();
              }}
              className="w-full p-2.5 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-[#38bdf8] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
