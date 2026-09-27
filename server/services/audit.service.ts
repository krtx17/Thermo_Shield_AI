import { AuditRecord, CreateAuditDTO } from "../models/audit.model.js";
import { auditRepository, AuditRepository } from "../repositories/audit.repository.js";

export class AuditService {
  constructor(private repo: AuditRepository = auditRepository) {}

  public getAllLogs(): AuditRecord[] {
    return this.repo.findAll();
  }

  public recordEvent(event: string, action: string, source?: string): AuditRecord {
    const dto: CreateAuditDTO = {
      event,
      action,
      source: source || "System Telemetry",
    };
    return this.repo.create(dto);
  }

  public getLogCount(): number {
    return this.repo.count();
  }
}

export const auditService = new AuditService();
