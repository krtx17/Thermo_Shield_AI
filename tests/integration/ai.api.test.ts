import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../server/app.js";

describe("AI API Endpoints (/api/synthesize & /api/compare)", () => {
  it("POST /api/synthesize - should generate intelligence brief for valid hotspot", async () => {
    const res = await request(app)
      .post("/api/synthesize")
      .send({
        hotspotId: "EVT-20260903-0042",
        userPrompt: "Assess danger to nearby refinery units",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.text).toBe("string");
    expect(res.body.text.length).toBeGreaterThan(50);
    expect(res.body).toHaveProperty("provider");
    expect(res.body).toHaveProperty("isSimulated");
  });

  it("POST /api/synthesize - should return 400 when hotspotId is missing", async () => {
    const res = await request(app)
      .post("/api/synthesize")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain("hotspotId");
  });

  it("POST /api/synthesize - should return 404 when hotspot is not found", async () => {
    const res = await request(app)
      .post("/api/synthesize")
      .send({ hotspotId: "UNKNOWN-999" });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain("not found");
  });

  it("POST /api/compare - should perform dual-vector threat comparison", async () => {
    const res = await request(app)
      .post("/api/compare")
      .send({
        eventAId: "EVT-20260903-0042",
        eventBId: "EVT-20260903-0089",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("arbitrationVerdict");
    expect(res.body).toHaveProperty("text");
    expect(res.body).toHaveProperty("provider");
    expect(res.body).toHaveProperty("isSimulated");
    expect(res.body.arbitrationVerdict).toContain("exceeds");
  });

  it("POST /api/compare - should return 400 when event IDs are missing", async () => {
    const res = await request(app)
      .post("/api/compare")
      .send({ eventAId: "EVT-20260903-0042" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/compare - should return 404 when one or both events are missing", async () => {
    const res = await request(app)
      .post("/api/compare")
      .send({
        eventAId: "EVT-20260903-0042",
        eventBId: "NON_EXISTENT",
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
