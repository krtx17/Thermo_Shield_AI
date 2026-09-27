/**
 * Domain Model: Cryptographic Audit Record
 * Represents an immutable, sequential ledger block hashed with SHA-256.
 */

export type AuditStatus = "VERIFIED" | "PENDING" | "SYSTEM";

export interface AuditRecord {
  id: string;
  block: number;
  hash: string;
  event: string;
  action: string;
  source: string;
  timestamp: string;
  status: AuditStatus;
}

export interface CreateAuditDTO {
  event: string;
  action: string;
  source?: string;
}
