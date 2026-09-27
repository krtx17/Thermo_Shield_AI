import { describe, it, expect } from "vitest";
import { HotspotRepository } from "../../server/repositories/hotspot.repository.js";

describe("HotspotRepository", () => {
  it("should return all benchmark hotspots", () => {
    const repo = new HotspotRepository();
    const all = repo.findAll();
    expect(all.length).toBe(4);
    expect(all[0].id).toBe("EVT-20260903-0042");
    expect(all[0].severity).toBe("CRITICAL");
  });

  it("should filter hotspots by severity", () => {
    const repo = new HotspotRepository();
    const critical = repo.findAll({ severity: "CRITICAL" });
    expect(critical.length).toBe(1);
    expect(critical[0].id).toBe("EVT-20260903-0042");
  });

  it("should filter hotspots by minimum risk score", () => {
    const repo = new HotspotRepository();
    const highRisk = repo.findAll({ minRiskScore: 50 });
    expect(highRisk.length).toBe(2); // 78.4 and 51.2
  });

  it("should find hotspot by unique ID", () => {
    const repo = new HotspotRepository();
    const hotspot = repo.findById("EVT-20260903-0089");
    expect(hotspot).toBeDefined();
    expect(hotspot?.name).toBe("Dahej Special Economic Chemical Zone");
    expect(hotspot?.meanFRP).toBe(144.0);
  });

  it("should return undefined for non-existent ID", () => {
    const repo = new HotspotRepository();
    const hotspot = repo.findById("NON_EXISTENT_ID");
    expect(hotspot).toBeUndefined();
  });
});
