import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../server/app.js";

describe("Hotspots API Endpoints", () => {
  it("GET /api/hotspots - should return list of all benchmark hotspots", async () => {
    const res = await request(app).get("/api/hotspots");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(4);

    const first = res.body[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("coordinates");
    expect(first).toHaveProperty("riskScore");
    expect(first).toHaveProperty("meanFRP");
    expect(first).toHaveProperty("severity");
  });

  it("GET /api/hotspots/:id - should return single hotspot by valid ID", async () => {
    const res = await request(app).get("/api/hotspots/EVT-20260903-0042");

    expect(res.status).toBe(200);
    expect(res.body.id).toBe("EVT-20260903-0042");
    expect(res.body.name).toBe("Paradip Coastal Petrochemical Enclave");
    expect(res.body.severity).toBe("CRITICAL");
  });

  it("GET /api/hotspots/:id - should return 404 for unknown ID", async () => {
    const res = await request(app).get("/api/hotspots/NON_EXISTENT_HOTSPOT");

    expect(res.status).toBe(404);
    expect(res.body.error).toContain("not found");
  });
});
