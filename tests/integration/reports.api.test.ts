import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../server/app.js";

describe("Incident Reports API Endpoints (/api/reports)", () => {
  it("GET /api/reports - should return list of incident report dossiers", async () => {
    const res = await request(app).get("/api/reports");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const first = res.body[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("hotspotId");
    expect(first).toHaveProperty("facilityName");
    expect(first).toHaveProperty("severity");
    expect(first).toHaveProperty("dispatchPriority");
    expect(first).toHaveProperty("status");
  });

  it("POST /api/reports - should create and dispatch new incident dossier", async () => {
    const res = await request(app)
      .post("/api/reports")
      .send({
        hotspotId: "EVT-20260903-0042",
        targetAgency: "District Fire Dispatch & Port Authority",
        dispatchPriority: "ALPHA",
        summary: "Thermal flare escalating near crude storage tanks.",
        recommendation: "Immediate water curtain deployment.",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toMatch(/^DOSSIER-/);
    expect(res.body.hotspotId).toBe("EVT-20260903-0042");
    expect(res.body.facilityName).toBe("Paradip Coastal Petrochemical Enclave");
    expect(res.body.dispatchPriority).toBe("ALPHA");
    expect(res.body.targetAgency).toBe("District Fire Dispatch & Port Authority");
    expect(res.body.status).toBe("DISPATCHED");
  });

  it("POST /api/reports - should return 400 when hotspotId is omitted", async () => {
    const res = await request(app)
      .post("/api/reports")
      .send({ summary: "No hotspot specified" });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("hotspotId");
  });

  it("POST /api/reports - should return 404 when hotspotId does not exist", async () => {
    const res = await request(app)
      .post("/api/reports")
      .send({ hotspotId: "UNKNOWN-ID" });

    expect(res.status).toBe(404);
    expect(res.body.error).toContain("not found");
  });
});
