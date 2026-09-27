import { IncidentReportRecord, DispatchPriority } from "../models/report.model.js";
import { reportRepository, ReportRepository } from "../repositories/report.repository.js";
import { HotspotRecord } from "../models/hotspot.model.js";
import { auditService } from "./audit.service.js";

export interface CreateReportInput {
  hotspot: HotspotRecord;
  targetAgency?: string;
  dispatchPriority?: DispatchPriority;
  recommendation?: string;
  summary?: string;
}

export class ReportService {
  constructor(private repo: ReportRepository = reportRepository) {}

  public getAllReports(): IncidentReportRecord[] {
    return this.repo.findAll();
  }

  public createReport(input: CreateReportInput): IncidentReportRecord {
    const { hotspot, targetAgency, dispatchPriority, recommendation, summary } = input;

    let computedPriority: DispatchPriority = "CHARLIE";
    if (hotspot.riskScore > 70) {
      computedPriority = "ALPHA";
    } else if (hotspot.riskScore > 40) {
      computedPriority = "BRAVO";
    }

    const report = this.repo.create({
      hotspotId: hotspot.id,
      facilityName: hotspot.name,
      region: hotspot.region,
      severity: hotspot.severity,
      riskScore: hotspot.riskScore,
      detectedAt: hotspot.detectedAt,
      dispatchPriority: dispatchPriority || computedPriority,
      targetAgency: targetAgency || "Regional Emergency Management & Industrial Inspectorate",
      summary: summary || hotspot.defaultSummary,
      recommendation: recommendation || hotspot.recommendation,
    });

    auditService.recordEvent(
      hotspot.id,
      `Tactical Incident Dossier Dispatched (${report.id})`,
      "Operator Console"
    );

    return report;
  }

  public getReportCount(): number {
    return this.repo.count();
  }
}

export const reportService = new ReportService();
