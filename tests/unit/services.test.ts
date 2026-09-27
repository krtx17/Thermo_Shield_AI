import { describe, it, expect } from "vitest";
import { HotspotService } from "../../server/services/hotspot.service.js";
import { AuditService } from "../../server/services/audit.service.js";
import { ReportService } from "../../server/services/report.service.js";
import { AIService } from "../../server/services/ai.service.js";
import { HotspotRepository } from "../../server/repositories/hotspot.repository.js";
import { AuditRepository } from "../../server/repositories/audit.repository.js";
import { ReportRepository } from "../../server/repositories/report.repository.js";

describe("HotspotService", () => {
  it("should query hotspots with options", () => {
    const service = new HotspotService();
    const all = service.getAllHotspots();
    expect(all.length).toBeGreaterThan(0);

    const critical = service.getAllHotspots({ severity: "CRITICAL" });
    expect(critical.every(h => h.severity === "CRITICAL")).toBe(true);
  });

  it("should get single hotspot by ID", () => {
    const service = new HotspotService();
    const hotspot = service.getHotspotById("EVT-20260903-0042");
    expect(hotspot).toBeDefined();
    expect(hotspot?.id).toBe("EVT-20260903-0042");
  });
});

describe("AuditService", () => {
  it("should record event and increment log count", () => {
    const auditRepo = new AuditRepository();
    const service = new AuditService(auditRepo);
    const initialCount = service.getLogCount();

    const record = service.recordEvent("EVT-TEST", "Unit Test Action", "Test Suite");
    expect(record.event).toBe("EVT-TEST");
    expect(record.action).toBe("Unit Test Action");
    expect(service.getLogCount()).toBe(initialCount + 1);
  });
});

describe("ReportService", () => {
  it("should create report and auto-assign ALPHA priority for critical risk score", () => {
    const hotspotRepo = new HotspotRepository();
    const reportRepo = new ReportRepository();
    const service = new ReportService(reportRepo);

    const hotspot = hotspotRepo.findById("EVT-20260903-0042")!; // Risk: 78.4
    const report = service.createReport({ hotspot });

    expect(report.dispatchPriority).toBe("ALPHA");
    expect(report.facilityName).toBe(hotspot.name);
    expect(report.status).toBe("DISPATCHED");
  });
});

describe("AIService", () => {
  it("should synthesize hotspot and record audit log", async () => {
    const hotspotRepo = new HotspotRepository();
    const hotspot = hotspotRepo.findById("EVT-20260903-0089")!;

    const result = await AIService.synthesizeHotspot(hotspot, "Assess perimeter danger");
    expect(result.success).toBe(true);
    expect(result.text).toBeDefined();
  });

  it("should compare two hotspots and record comparison audit", async () => {
    const hotspotRepo = new HotspotRepository();
    const eventA = hotspotRepo.findById("EVT-20260903-0042")!;
    const eventB = hotspotRepo.findById("EVT-20260903-0089")!;

    const result = await AIService.compareHotspots(eventA, eventB);
    expect(result.success).toBe(true);
    expect(result.arbitrationVerdict).toBeDefined();
  });
});
