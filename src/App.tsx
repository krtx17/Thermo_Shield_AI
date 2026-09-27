import React, { useState, useEffect } from "react";
import { ActiveScreen, Hotspot, ModelMode } from "./types";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import CommandCenter from "./components/CommandCenter";
import ActiveInvestigations from "./components/ActiveInvestigations";
import RiskComparison from "./components/RiskComparison";
import IncidentReports from "./components/IncidentReports";
import AuditTrail from "./components/AuditTrail";
import SystemHealth from "./components/SystemHealth";
import LiveDemo from "./components/LiveDemo";
import Settings from "./components/Settings";
import { 
  Home as HomeIcon, 
  Map as MapIcon, 
  Bell, 
  BarChart2, 
  Menu
} from "lucide-react";

// Fallback seed data in case of network latency
const INITIAL_MOCK_HOTSPOTS: Hotspot[] = [
  {
    id: "EVT-20260903-0042",
    name: "Paradip Coastal Petrochemical Enclave",
    region: "Odisha Industrial Corridor",
    coordinates: "28.6139° N, 77.2090° E",
    priority: "HIGH-ASSET",
    severity: "CRITICAL",
    riskScore: 78.4,
    detectedAt: "Apr 26, 2025 • 14:32 UTC",
    meanFRP: 342.0,
    peakFRP: 418.5,
    distanceToAsset: "412m",
    assetType: "Hydrocarbon Refining",
    osmIdentifier: "way/94827104",
    roadAccess: "120m (SH-12 Link)",
    nearestFireStation: "4.2 km (Paradip Port)",
    terrainCover: "Hardened Asphalt / Metal",
    activeFlameProb: 98.0,
    refineryProximityProb: 88.5,
    persistenceIndex: 72.0,
    detections30d: 18,
    detections90d: 47,
    trend30d: "+12.3 MW/wk",
    sensors: ["VIIRS-FRP", "OSM-GEO", "SENTINEL-L2A", "TEMPORAL-REC"],
    ndvi: -0.18,
    nbr: 0.74,
    ndmi: 0.42,
    swirNir: 2.81,
    formula: "0.45(P_fire) + 0.35(P_ind) + 0.20(P_pers) = 78.4",
    defaultSummary: "High-intensity industrial fire detected in coastal petrochemical facility. Thermal radiative power reached 342 MW with 98% flame confidence concentrated on primary fractionating units.",
    recommendation: "Immediate emergency suppression dispatch and notification to District Emergency Operations Center (DEOC)."
  },
  {
    id: "EVT-20260903-0089",
    name: "Dahej Special Economic Chemical Zone",
    region: "Warehouse Zone",
    coordinates: "28.6012° N, 77.2310° E",
    priority: "HIGH-ASSET",
    severity: "HIGH RISK",
    riskScore: 51.2,
    detectedAt: "Apr 26, 2025 • 12:18 UTC",
    meanFRP: 144.0,
    peakFRP: 162.0,
    distanceToAsset: "1,302m",
    assetType: "Specialty Polymer Plant",
    osmIdentifier: "way/72891244",
    roadAccess: "240m (GIDC Avenue 2)",
    nearestFireStation: "6.8 km (Dahej Fire Station)",
    terrainCover: "Soil / Sparsely Vegetated",
    activeFlameProb: 84.6,
    refineryProximityProb: 55.2,
    persistenceIndex: 44.0,
    detections30d: 9,
    detections90d: 22,
    trend30d: "+4.1 MW/wk",
    sensors: ["VIIRS-FRP", "OSM-GEO", "SENTINEL-L2A"],
    ndvi: 0.12,
    nbr: 0.38,
    ndmi: 0.15,
    swirNir: 1.65,
    formula: "0.45(P_fire) + 0.35(P_ind) + 0.20(P_pers) = 51.2",
    defaultSummary: "Thermal anomaly identified near polymer storage zone. Radiation signatures indicate localized ignition requiring preventative monitoring.",
    recommendation: "Issue preventative advisory warning to site supervisors and schedule Sentinel-2 pre-pass tasking."
  },
  {
    id: "EVT-20260902-0031",
    name: "Jharkhand Steel Processing Cluster",
    region: "Refinery Area",
    coordinates: "28.5927° N, 77.1683° E",
    priority: "MODERATE-ASSET",
    severity: "MODERATE",
    riskScore: 34.2,
    detectedAt: "Apr 26, 2025 • 09:45 UTC",
    meanFRP: 94.5,
    peakFRP: 110.0,
    distanceToAsset: "1,800m",
    assetType: "Blast Furnace Area",
    osmIdentifier: "way/10492812",
    roadAccess: "500m (Industrial Link)",
    nearestFireStation: "8.1 km (Jamshedpur Sector 4)",
    terrainCover: "Concrete / Built-up",
    activeFlameProb: 52.0,
    refineryProximityProb: 24.1,
    persistenceIndex: 31.0,
    detections30d: 5,
    detections90d: 14,
    trend30d: "+0.8 MW/wk",
    sensors: ["VIIRS-FRP", "SENTINEL-L2A"],
    ndvi: 0.04,
    nbr: 0.15,
    ndmi: 0.08,
    swirNir: 1.10,
    formula: "0.45(P_fire) + 0.35(P_ind) + 0.20(P_pers) = 34.2",
    defaultSummary: "Localized slag flare and thermal anomaly in blast furnace perimeter. Stable boundary parameters observed.",
    recommendation: "Standard automatic tracking. No emergency deployment required."
  }
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("home");
  const [modelMode, setModelMode] = useState<ModelMode>("cloud");
  const [hotspots, setHotspots] = useState<Hotspot[]>(INITIAL_MOCK_HOTSPOTS);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(INITIAL_MOCK_HOTSPOTS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // App Theme is locked to unified dark command center theme
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const handleSetTheme = () => {
    setTheme("dark");
    document.documentElement.classList.add("dark");
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Comparison IDs
  const [compareAId, setCompareAId] = useState<string>("EVT-20260903-0042");
  const [compareBId, setCompareBId] = useState<string>("EVT-20260903-0089");

  // Fetch hotspots from Express API
  useEffect(() => {
    async function fetchHotspots() {
      try {
        const response = await fetch("/api/hotspots");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setHotspots(data);
            setSelectedHotspot(data[0]);
          }
        }
      } catch (err) {
        console.warn("Operating on local benchmark data:", err);
      }
    }
    fetchHotspots();
  }, []);

  const isDark = theme === "dark";
  const criticalCount = hotspots.filter(h => h.severity === "CRITICAL" || h.severity === "HIGH RISK").length;

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-row ${
      isDark ? "bg-[#080d1a] text-white" : "bg-[#f0f4f9] text-slate-900"
    } selection:bg-[#2563eb] selection:text-white antialiased`}>
      
      {/* ========================================================================= */}
      {/* DESKTOP & MOBILE SIDEBAR (Matching FireSight & FireSense) */}
      {/* ========================================================================= */}
      <Sidebar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        theme={theme}
        activeAlertsCount={criticalCount || 3}
      />

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA: HEADER + ACTIVE SCREEN VIEW */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        
        {/* Top Header Bar */}
        <Header
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          modelMode={modelMode}
          setModelMode={setModelMode}
          totalHotspots={hotspots.length}
          theme={theme}
          setTheme={handleSetTheme}
          onMenuToggle={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Viewport for Active Screen */}
        <main className="flex-1 pb-16 lg:pb-0 overflow-y-auto">
          {activeScreen === "home" && (
            <Home
              hotspots={hotspots}
              setActiveScreen={setActiveScreen}
              setSelectedHotspot={setSelectedHotspot}
              modelMode={modelMode}
              theme={theme}
            />
          )}

          {activeScreen === "command-center" && (
            <CommandCenter
              hotspots={hotspots}
              selectedHotspot={selectedHotspot}
              setSelectedHotspot={setSelectedHotspot}
              setActiveScreen={setActiveScreen}
              setCompareAId={setCompareAId}
              setCompareBId={setCompareBId}
            />
          )}

          {activeScreen === "active-investigations" && (
            <ActiveInvestigations
              selectedHotspot={selectedHotspot}
              modelMode={modelMode}
              setActiveScreen={setActiveScreen}
              setCompareAId={setCompareAId}
              setCompareBId={setCompareBId}
            />
          )}

          {activeScreen === "system-health" && (
            <SystemHealth />
          )}

          {activeScreen === "incident-reports" && (
            <IncidentReports 
              hotspots={hotspots} 
              setActiveScreen={setActiveScreen}
              setSelectedHotspot={setSelectedHotspot}
            />
          )}

          {activeScreen === "risk-comparison" && (
            <RiskComparison
              hotspots={hotspots}
              initialAId={compareAId}
              initialBId={compareBId}
            />
          )}

          {activeScreen === "live-demo" && (
            <LiveDemo theme={theme} />
          )}

          {activeScreen === "audit-trail" && (
            <AuditTrail />
          )}

          {activeScreen === "settings" && (
            <Settings
              theme={theme}
              setTheme={handleSetTheme}
              modelMode={modelMode}
              setModelMode={setModelMode}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar matching FireSense */}
        <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 h-14 border-t flex items-center justify-around px-2 backdrop-blur-md ${
          isDark ? "bg-[#0b101d]/95 border-[#18233a] text-slate-400" : "bg-white/95 border-slate-200 text-slate-600 shadow-lg"
        }`}>
          {[
            { id: "home", icon: HomeIcon, label: "Home" },
            { id: "command-center", icon: MapIcon, label: "Map" },
            { id: "active-investigations", icon: Bell, label: "Alerts", badge: criticalCount },
            { id: "system-health", icon: BarChart2, label: "Analytics" },
            { id: "menu", icon: Menu, label: "More" }
          ].map((item) => {
            const isActive = activeScreen === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "menu") {
                    setIsSidebarOpen(true);
                  } else {
                    setActiveScreen(item.id as ActiveScreen);
                  }
                }}
                className={`flex flex-col items-center justify-center gap-1 w-14 h-full relative cursor-pointer ${
                  isActive ? "text-[#2563eb]" : isDark ? "hover:text-white" : "hover:text-slate-900"
                }`}
                type="button"
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
}
