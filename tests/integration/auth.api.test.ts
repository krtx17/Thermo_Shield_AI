import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../server/app.js";

describe("Auth API Endpoints (/api/auth)", () => {
  it("POST /api/auth/login - should authenticate Chief Officer with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "kritika.tripathi@thermoshield.defense",
        password: "command2026"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.name).toBe("Kritika Tripathi");
    expect(res.body.user.role).toBe("CHIEF_OFFICER");
  });

  it("POST /api/auth/login - should reject invalid operator password with 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "kritika.tripathi@thermoshield.defense",
        password: "wrong_password_xyz"
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain("Invalid operator credentials");
  });

  it("POST /api/auth/login - should return 400 when email or password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "only_email@test.com" });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("required");
  });

  it("GET /api/auth/me - should return authenticated operator profile when token is provided", async () => {
    // First login
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "kritika.tripathi@thermoshield.defense",
        password: "command2026"
      });

    const token = loginRes.body.token;

    // Then check /me
    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe("kritika.tripathi@thermoshield.defense");
    expect(meRes.body.user.name).toBe("Kritika Tripathi");
  });

  it("GET /api/auth/me - should return 401 without Bearer token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
