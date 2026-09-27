import { Request, Response } from "express";
import { config } from "../config/index.js";
import { hotspotService } from "../services/hotspot.service.js";
import { auditService } from "../services/audit.service.js";
import { reportService } from "../services/report.service.js";

export class HealthController {
  public static getHealth(req: Request, res: Response): void {
    const isConfigured = config.isGeminiConfigured;
    res.json({
      status: "ok",
      service: "Thermo-Shield AI Command Server",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      geminiConfigured: isConfigured,
      model: isConfigured ? config.geminiModel : "Deterministic Heuristic Engine (Fallback)",
      hotspotsCount: hotspotService.getHotspotCount(),
      auditLogsCount: auditService.getLogCount(),
      incidentReportsCount: reportService.getReportCount(),
      environment: config.nodeEnv,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    });
  }
}
