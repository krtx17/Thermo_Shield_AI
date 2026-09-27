import crypto from "crypto";
import { AuditRecord, CreateAuditDTO } from "../models/audit.model.js";

const INITIAL_AUDIT_LOGS: AuditRecord[] = [
  {
    id: "aud-001",
    block: 104291,
    hash: "0x8fa12ce973bd540191fe8c9321aa",
    event: "EVT-20260903-0042",
    action: "Multispectral Sentinel-2 L2A Ingestion",
    source: "Sentinel-2 MSI Level-2A",
    timestamp: "2026-09-03 14:18:22 UTC",
    status: "VERIFIED"
  },
  {
    id: "aud-002",
    block: 104290,
    hash: "0x3da94a619c00bcf955ab331201dd",
    event: "EVT-20260903-0042",
    action: "VIIRS Active Fire Ingestion (FRP 342MW)",
    source: "VIIRS I-Band (NOAA-20)",
    timestamp: "2026-09-03 14:10:00 UTC",
    status: "VERIFIED"
  },
  {
    id: "aud-003",
    block: 104289,
    hash: "0xe21ba40982bbfe39118c642289aa",
    event: "EVT-20260903-0089",
    action: "Hazardous Chemical Proximity Verification",
    source: "Sentinel-2 MSI Level-2A",
    timestamp: "2026-09-03 13:42:10 UTC",
    status: "VERIFIED"
  },
  {
    id: "aud-004",
    block: 104288,
    hash: "0xbcd91264ac19318844fe015389bb",
    event: "EVT-20260903-0089",
    action: "VIIRS Ingestion & Initial Risk Computation",
    source: "VIIRS I-Band (Suomi-NPP)",
    timestamp: "2026-09-03 13:35:00 UTC",
    status: "VERIFIED"
  }
];

export class AuditRepository {
  private logs: AuditRecord[] = [...INITIAL_AUDIT_LOGS];
  private currentBlock: number = 104291;

  public findAll(): AuditRecord[] {
    return [...this.logs];
  }

  public findById(id: string): AuditRecord | undefined {
    return this.logs.find(l => l.id === id);
  }

  public create(dto: CreateAuditDTO): AuditRecord {
    this.currentBlock += 1;
    const now = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
    const rawHashInput = `${this.currentBlock}:${dto.event}:${dto.action}:${Date.now()}`;
    const hash = "0x" + crypto.createHash("sha256").update(rawHashInput).digest("hex").slice(0, 24);

    const record: AuditRecord = {
      id: `aud-${Date.now()}`,
      block: this.currentBlock,
      hash,
      event: dto.event,
      action: dto.action,
      source: dto.source || "System Telemetry",
      timestamp: now,
      status: "VERIFIED"
    };

    this.logs.unshift(record);
    return record;
  }

  public count(): number {
    return this.logs.length;
  }

  public getCurrentBlock(): number {
    return this.currentBlock;
  }
}

export const auditRepository = new AuditRepository();
