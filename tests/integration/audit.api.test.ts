import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../server/app.js";

describe("Audit Ledger API Endpoints (/api/audit-logs)", () => {
  it("GET /api/audit-logs - should return audit blocks array", async () => {
    const res = await request(app).get("/api/audit-logs");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const first = res.body[0];
    expect(first).toHaveProperty("block");
    expect(first).toHaveProperty("hash");
    expect(first).toHaveProperty("event");
    expect(first).toHaveProperty("action");
    expect(first).toHaveProperty("status");
  });

  it("POST /api/audit-logs - should create and append verified audit block", async () => {
    const res = await request(app)
      .post("/api/audit-logs")
      .send({
        event: "EVT-INTEGRATION-001",
        action: "Operator Tactical Dispatch",
        source: "Integration Test Agent",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("block");
    expect(res.body.hash).toMatch(/^0x[a-f0-9]{24}$/);
    expect(res.body.event).toBe("EVT-INTEGRATION-001");
    expect(res.body.action).toBe("Operator Tactical Dispatch");
    expect(res.body.source).toBe("Integration Test Agent");
    expect(res.body.status).toBe("VERIFIED");
  });

  it("POST /api/audit-logs - should return 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/audit-logs")
      .send({ event: "EVT-INCOMPLETE" });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("required");
  });
});
