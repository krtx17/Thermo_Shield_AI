import { IncidentReportRecord, CreateIncidentReportDTO } from "../models/report.model.js";

const INITIAL_REPORTS: IncidentReportRecord[] = [
  {
    id: "DOSSIER-20260903-001",
    hotspotId: "EVT-20260903-0042",
    facilityName: "Paradip Coastal Petrochemical Enclave",
    region: "Odisha Industrial Corridor",
    severity: "CRITICAL",
    riskScore: 78.4,
    detectedAt: "2026-09-03 14:18:22 UTC",
    dispatchedAt: "2026-09-03 14:24:00 UTC",
    dispatchPriority: "ALPHA",
    targetAgency: "District Emergency Operations Center (DEOC) & Paradip Port Fire Authority",
    summary: "Critical thermal signature (342 MW mean FRP) detected within 412m of hydrocarbon cracking tanks. Persistence index at 72% across 30 days.",
    recommendation: "Immediate aerial surveillance and deployment of Class B thermal suppression foam units to perimeter road SH-12.",
    status: "DISPATCHED"
  },
  {
    id: "DOSSIER-20260903-002",
    hotspotId: "EVT-20260903-0089",
    facilityName: "Dahej Special Economic Chemical Zone",
    region: "Gujarat Petrochem Belt",
    severity: "HIGH RISK",
    riskScore: 51.2,
    detectedAt: "2026-09-03 13:42:10 UTC",
    dispatchedAt: "2026-09-03 13:50:00 UTC",
    dispatchPriority: "BRAVO",
    targetAgency: "GIDC Industrial Safety Inspectorate",
    summary: "High-temperature flaring outside scheduled refinery maintenance hours. Proximity to polymer feedstock depot: 1,302m.",
    recommendation: "Issue high-level advisory warning to on-duty plant safety director; monitor for fugitive emissions.",
    status: "ACKNOWLEDGED"
  }
];

export class ReportRepository {
  private reports: IncidentReportRecord[] = [...INITIAL_REPORTS];

  public findAll(): IncidentReportRecord[] {
    return [...this.reports];
  }

  public findById(id: string): IncidentReportRecord | undefined {
    return this.reports.find(r => r.id === id);
  }

  public create(dto: CreateIncidentReportDTO): IncidentReportRecord {
    const now = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
    const record: IncidentReportRecord = {
      id: `DOSSIER-${Date.now().toString().slice(-8)}`,
      hotspotId: dto.hotspotId,
      facilityName: dto.facilityName || "Unknown Critical Asset",
      region: dto.region || "Unassigned Sector",
      severity: dto.severity || "MONITORED",
      riskScore: dto.riskScore ?? 0,
      detectedAt: dto.detectedAt || now,
      dispatchedAt: now,
      dispatchPriority: dto.dispatchPriority || "BRAVO",
      targetAgency: dto.targetAgency || "Regional Emergency Management & Industrial Inspectorate",
      summary: dto.summary || "Incident dossier automatically initialized via Thermo Shield AI command telemetry.",
      recommendation: dto.recommendation || "Maintain remote multi-spectral surveillance and alert facility security team.",
      status: "DISPATCHED"
    };

    this.reports.unshift(record);
    return record;
  }

  public count(): number {
    return this.reports.length;
  }
}

export const reportRepository = new ReportRepository();
