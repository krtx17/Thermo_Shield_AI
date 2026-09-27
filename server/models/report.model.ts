/**
 * Domain Model: Emergency Incident Dossier / Report
 * Tracks dispatch priority, target agency, and tactical recommendations.
 */

export type DispatchPriority = "ALPHA" | "BRAVO" | "CHARLIE";
export type IncidentStatus = "DISPATCHED" | "ACKNOWLEDGED" | "RESOLVED";

export interface IncidentReportRecord {
  id: string;
  hotspotId: string;
  facilityName: string;
  region: string;
  severity: string;
  riskScore: number;
  detectedAt: string;
  dispatchedAt: string;
  dispatchPriority: DispatchPriority;
  targetAgency: string;
  summary: string;
  recommendation: string;
  status: IncidentStatus;
}

export interface CreateIncidentReportDTO {
  hotspotId: string;
  facilityName?: string;
  region?: string;
  severity?: string;
  riskScore?: number;
  detectedAt?: string;
  dispatchPriority?: DispatchPriority;
  targetAgency?: string;
  summary?: string;
  recommendation?: string;
}
