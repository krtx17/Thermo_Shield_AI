import { describe, it, expect } from "vitest";
import { AuditRepository } from "../../server/repositories/audit.repository.js";

describe("AuditRepository", () => {
  it("should initialize with calibrated genesis blocks", () => {
    const repo = new AuditRepository();
    const logs = repo.findAll();
    expect(logs.length).toBe(4);
    expect(logs[0].block).toBe(104291);
    expect(logs[0].status).toBe("VERIFIED");
  });

  it("should create new block with sequential block counter and SHA-256 hash", () => {
    const repo = new AuditRepository();
    const initialBlock = repo.getCurrentBlock();
    const initialCount = repo.count();

    const created = repo.create({
      event: "EVT-TEST-001",
      action: "Test Sensor Ingestion",
      source: "Automated Unit Test"
    });

    expect(created.block).toBe(initialBlock + 1);
    expect(created.hash).toMatch(/^0x[a-f0-9]{24}$/);
    expect(created.event).toBe("EVT-TEST-001");
    expect(created.action).toBe("Test Sensor Ingestion");
    expect(created.source).toBe("Automated Unit Test");
    expect(created.status).toBe("VERIFIED");
    expect(repo.count()).toBe(initialCount + 1);

    // Verify unshifted to top of list
    const all = repo.findAll();
    expect(all[0].id).toBe(created.id);
  });
});
