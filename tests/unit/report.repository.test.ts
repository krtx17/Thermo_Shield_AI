import { describe, it, expect } from "vitest";
import { ReportRepository } from "../../server/repositories/report.repository.js";

describe("ReportRepository", () => {
  it("should initialize with calibrated incident dossiers", () => {
    const repo = new ReportRepository();
    const reports = repo.findAll();
    expect(reports.length).toBe(2);
    expect(reports[0].id).toBe("DOSSIER-20260903-001");
    expect(reports[0].dispatchPriority).toBe("ALPHA");
  });

  it("should create new incident report with default fallbacks", () => {
    const repo = new ReportRepository();
    const initialCount = repo.count();

    const created = repo.create({
      hotspotId: "EVT-TEST-HOTSPOT",
      facilityName: "Test LNG Terminal",
      region: "Western Offshore",
      severity: "CRITICAL",
      riskScore: 88.0,
      dispatchPriority: "ALPHA"
    });

    expect(created.id).toMatch(/^DOSSIER-\d+$/);
    expect(created.hotspotId).toBe("EVT-TEST-HOTSPOT");
    expect(created.facilityName).toBe("Test LNG Terminal");
    expect(created.dispatchPriority).toBe("ALPHA");
    expect(created.status).toBe("DISPATCHED");
    expect(repo.count()).toBe(initialCount + 1);

    // Verify it is placed at the top of the list
    expect(repo.findAll()[0].id).toBe(created.id);
  });

  it("should find report by ID", () => {
    const repo = new ReportRepository();
    const dossier = repo.findById("DOSSIER-20260903-002");
    expect(dossier).toBeDefined();
    expect(dossier?.facilityName).toBe("Dahej Special Economic Chemical Zone");
    expect(dossier?.dispatchPriority).toBe("BRAVO");
  });
});
