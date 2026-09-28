import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../server/app.js";

describe("Hotspots Creation & Spatial Query API", () => {
  it("GET /api/hotspots with lat & lng - should filter hotspots within geographic radius", async () => {
    // Coordinates near Paradip Coastal (20.1234° N, 85.7654° E)
    const res = await request(app)
      .get("/api/hotspots")
      .query({ lat: 20.12, lng: 85.76, radiusKm: 100 });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].id).toBe("EVT-20260903-0042");
  });

  it("POST /api/hotspots - should register a new anomaly and return 201", async () => {
    const testHotspot = {
      id: "EVT-TEST-9999",
      name: "Tactical Test Refinement Zone",
      region: "Western Sector",
      coordinates: "19.0760° N, 72.8777° E",
      priority: "HIGH-ASSET",
      severity: "CRITICAL",
      riskScore: 88.5,
      detectedAt: "2026-09-28 12:00:00 UTC",
      meanFRP: 420.0,
      peakFRP: 510.0,
      distanceToAsset: "250m",
      assetType: "Chemical Storage",
      osmIdentifier: "way/12345678",
      roadAccess: "200m (Port Access Road)",
      nearestFireStation: "2.1 km",
      terrainCover: "Industrial Concrete",
      activeFlameProb: 95.0,
      refineryProximityProb: 91.0,
      persistenceIndex: 80.0,
      detections30d: 15,
      detections90d: 38,
      trend30d: "+5.1 MW/wk",
      sensors: ["VIIRS-FRP", "SENTINEL-L2A"],
      ndvi: -0.12,
      nbr: 0.60,
      ndmi: 0.35,
      swirNir: 2.30,
      formula: "0.45(P_fire) + 0.35(P_ind) + 0.20(P_pers) = 88.5",
      defaultSummary: "Tactical anomaly registered for integration test.",
      recommendation: "Immediate inspection."
    };

    const res = await request(app)
      .post("/api/hotspots")
      .send(testHotspot);

    expect(res.status).toBe(201);
    expect(res.body.id).toBe("EVT-TEST-9999");
    expect(res.body.name).toBe("Tactical Test Refinement Zone");

    // Verify it is now retrievable via GET
    const getRes = await request(app).get("/api/hotspots/EVT-TEST-9999");
    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe("Tactical Test Refinement Zone");
  });

  it("POST /api/hotspots - should reject invalid payloads with 400", async () => {
    const res = await request(app)
      .post("/api/hotspots")
      .send({ name: "Incomplete Hotspot" });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("required");
  });
});
