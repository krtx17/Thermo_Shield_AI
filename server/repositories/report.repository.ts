import { IncidentReportRecord, CreateIncidentReportDTO } from "../models/report.model.js";
import { INITIAL_REPORTS, mapRowToReport } from "../db/seeds.js";
import { getPostgresPool, isPostgresConnected } from "../db/postgres.js";

export class ReportRepository {
  private reports: IncidentReportRecord[] = [...INITIAL_REPORTS];

  /**
   * Synchronize incident reports from PostgreSQL if connected
   */
  public async syncWithPostgres(): Promise<void> {
    const pool = getPostgresPool();
    if (!pool || !isPostgresConnected()) return;

    try {
      const res = await pool.query("SELECT * FROM incident_reports ORDER BY detected_at DESC;");
      if (res.rows && res.rows.length > 0) {
        this.reports = res.rows.map(mapRowToReport);
        console.log(`[ReportRepository] Synced ${this.reports.length} incident reports from PostgreSQL.`);
      }
    } catch (err: any) {
      console.warn("[ReportRepository Sync Error]:", err?.message);
    }
  }

  public findAll(): IncidentReportRecord[] {
    return [...this.reports];
  }

  public async findAllAsync(): Promise<IncidentReportRecord[]> {
    const pool = getPostgresPool();
    if (pool && isPostgresConnected()) {
      try {
        const res = await pool.query("SELECT * FROM incident_reports ORDER BY detected_at DESC;");
        if (res.rows) {
          return res.rows.map(mapRowToReport);
        }
      } catch (err: any) {
        console.warn("[ReportRepository findAllAsync Error]:", err?.message);
      }
    }
    return this.findAll();
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

    const pool = getPostgresPool();
    if (pool && isPostgresConnected()) {
      pool.query(`
        INSERT INTO incident_reports (
          id, hotspot_id, facility_name, region, severity, risk_score, detected_at,
          dispatched_at, dispatch_priority, target_agency, summary, recommendation, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
      `, [
        record.id, record.hotspotId, record.facilityName, record.region, record.severity,
        record.riskScore, record.detectedAt, record.dispatchedAt, record.dispatchPriority,
        record.targetAgency, record.summary, record.recommendation, record.status
      ]).catch((err: any) => console.warn("[ReportRepository Insert Error]:", err?.message));
    }

    return record;
  }

  public async createAsync(dto: CreateIncidentReportDTO): Promise<IncidentReportRecord> {
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

    const pool = getPostgresPool();
    if (pool && isPostgresConnected()) {
      try {
        await pool.query(`
          INSERT INTO incident_reports (
            id, hotspot_id, facility_name, region, severity, risk_score, detected_at,
            dispatched_at, dispatch_priority, target_agency, summary, recommendation, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
        `, [
          record.id, record.hotspotId, record.facilityName, record.region, record.severity,
          record.riskScore, record.detectedAt, record.dispatchedAt, record.dispatchPriority,
          record.targetAgency, record.summary, record.recommendation, record.status
        ]);
      } catch (err: any) {
        console.warn("[ReportRepository Insert Error]:", err?.message);
      }
    }

    return record;
  }

  public count(): number {
    return this.reports.length;
  }
}

export const reportRepository = new ReportRepository();
