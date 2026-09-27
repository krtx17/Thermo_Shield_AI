import { Request, Response } from "express";
import { reportService } from "../services/report.service.js";
import { hotspotService } from "../services/hotspot.service.js";

export class ReportController {
  public static getReports(req: Request, res: Response): void {
    res.json(reportService.getAllReports());
  }

  public static createReport(req: Request, res: Response): void {
    const { hotspotId, targetAgency, dispatchPriority, recommendation, summary } = req.body || {};
    if (!hotspotId) {
      res.status(400).json({ error: "Field 'hotspotId' is required." });
      return;
    }

    const hotspot = hotspotService.getHotspotById(hotspotId);
    if (!hotspot) {
      res.status(404).json({ error: `Hotspot '${hotspotId}' not found.` });
      return;
    }

    const report = reportService.createReport({
      hotspot,
      targetAgency,
      dispatchPriority,
      recommendation,
      summary,
    });

    res.status(201).json(report);
  }
}
