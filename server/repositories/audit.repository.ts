import crypto from "crypto";
import { AuditRecord, CreateAuditDTO } from "../models/audit.model.js";
import { INITIAL_AUDIT_LOGS, mapRowToAudit } from "../db/seeds.js";
import { getPostgresPool, isPostgresConnected } from "../db/postgres.js";

export class AuditRepository {
  private logs: AuditRecord[] = [...INITIAL_AUDIT_LOGS];
  private currentBlock: number = 104291;

  /**
   * Synchronize audit log ledger from PostgreSQL if connected
   */
  public async syncWithPostgres(): Promise<void> {
    const pool = getPostgresPool();
    if (!pool || !isPostgresConnected()) return;

    try {
      const res = await pool.query("SELECT * FROM audit_logs ORDER BY block_num DESC;");
      if (res.rows && res.rows.length > 0) {
        this.logs = res.rows.map(mapRowToAudit);
        this.currentBlock = Math.max(...this.logs.map(l => l.block), 104291);
        console.log(`[AuditRepository] Synced ${this.logs.length} audit blocks from PostgreSQL.`);
      }
    } catch (err: any) {
      console.warn("[AuditRepository Sync Error]:", err?.message);
    }
  }

  public findAll(): AuditRecord[] {
    return [...this.logs];
  }

  public async findAllAsync(): Promise<AuditRecord[]> {
    const pool = getPostgresPool();
    if (pool && isPostgresConnected()) {
      try {
        const res = await pool.query("SELECT * FROM audit_logs ORDER BY block_num DESC;");
        if (res.rows) {
          return res.rows.map(mapRowToAudit);
        }
      } catch (err: any) {
        console.warn("[AuditRepository findAllAsync Error]:", err?.message);
      }
    }
    return this.findAll();
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

    const pool = getPostgresPool();
    if (pool && isPostgresConnected()) {
      pool.query(`
        INSERT INTO audit_logs (id, block_num, hash, event, action, source, timestamp, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `, [record.id, record.block, record.hash, record.event, record.action, record.source, record.timestamp, record.status])
      .catch((err: any) => console.warn("[AuditRepository Insert Error]:", err?.message));
    }

    return record;
  }

  public async createAsync(dto: CreateAuditDTO): Promise<AuditRecord> {
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

    const pool = getPostgresPool();
    if (pool && isPostgresConnected()) {
      try {
        await pool.query(`
          INSERT INTO audit_logs (id, block_num, hash, event, action, source, timestamp, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `, [record.id, record.block, record.hash, record.event, record.action, record.source, record.timestamp, record.status]);
      } catch (err: any) {
        console.warn("[AuditRepository Insert Error]:", err?.message);
      }
    }

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
