/**
 * Domain Model: Hotspot Telemetry Record
 * Calibrated for Industrial, Defense, and Petrochemical monitoring.
 */

export type HotspotSeverity = "CRITICAL" | "HIGH RISK" | "MODERATE" | "MONITORED" | string;
export type HotspotPriority = "HIGH-ASSET" | "MODERATE-ASSET" | "LOW-ASSET" | string;

export interface HotspotRecord {
  id: string;
  name: string;
  region: string;
  coordinates: string;
  priority: HotspotPriority;
  severity: HotspotSeverity;
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

export interface HotspotFilterOptions {
  severity?: string;
  minRiskScore?: number;
  region?: string;
  search?: string;
}
