export interface Hotspot {
  id: string;
  name: string;
  region: string;
  coordinates: string;
  priority: string;
  severity: "CRITICAL" | "HIGH RISK" | "MODERATE" | "MONITORED" | string;
  riskScore: number;
  detectedAt: string;
  meanFRP: number;
  peakFRP: number;
  distanceToAsset: string;
  assetType: string;
  osmIdentifier: string;
  roadAccess: string;
  nearestFireStation: string;
  terrainCover: string;
  activeFlameProb: number;
  refineryProximityProb: number;
  persistenceIndex: number;
  detections30d: number;
  detections90d: number;
  trend30d: string;
  sensors: string[];
  ndvi: number;
  nbr: number;
  ndmi: number;
  swirNir: number;
  formula: string;
  defaultSummary: string;
  recommendation: string;
}

export type ActiveScreen = 
  | "home" 
  | "command-center" 
  | "active-investigations" 
  | "risk-comparison" 
  | "incident-reports" 
  | "audit-trail" 
  | "system-health" 
  | "live-demo" 
  | "computer-vision"
  | "about"
  | "settings";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export type ModelMode = "local" | "cloud";

export interface AuditLogEntry {
  id: string;
  block: number;
  hash: string;
  event: string;
  action: string;
  source: string;
  timestamp: string;
  status: "VERIFIED" | "PENDING" | "SYSTEM";
}

export interface IncidentReport {
  id: string;
  hotspotId: string;
  facilityName: string;
  region: string;
  severity: string;
  riskScore: number;
  detectedAt: string;
  dispatchedAt: string;
  dispatchPriority: "ALPHA" | "BRAVO" | "CHARLIE";
  targetAgency: string;
  summary: string;
  recommendation: string;
  status: "DISPATCHED" | "ACKNOWLEDGED" | "RESOLVED";
}

export interface SystemHealthData {
  status: string;
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  geminiConfigured: boolean;
  model: string;
  hotspotsCount: number;
  environment: string;
  memoryUsageMB: number;
}
