import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../server/app.js";

describe("GET /api/health", () => {
  it("should return system diagnostics and 200 OK", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("Thermo-Shield AI Command Server");
    expect(typeof res.body.uptimeSeconds).toBe("number");
    expect(typeof res.body.geminiConfigured).toBe("boolean");
    expect(res.body.hotspotsCount).toBeGreaterThanOrEqual(4);
    expect(res.body.auditLogsCount).toBeGreaterThanOrEqual(4);
    expect(res.body.incidentReportsCount).toBeGreaterThanOrEqual(2);
    expect(typeof res.body.memoryUsageMB).toBe("number");
  });
});
