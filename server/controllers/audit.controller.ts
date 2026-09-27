import { Request, Response } from "express";
import { auditService } from "../services/audit.service.js";

export class AuditController {
  public static getLogs(req: Request, res: Response): void {
    res.json(auditService.getAllLogs());
  }

  public static createLog(req: Request, res: Response): void {
    const { event, action, source } = req.body || {};
    if (!event || !action) {
      res.status(400).json({ error: "Fields 'event' and 'action' are required." });
      return;
    }

    const record = auditService.recordEvent(event, action, source || "User Interaction");
    res.status(201).json(record);
  }
}
