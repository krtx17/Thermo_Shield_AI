import { describe, it, expect } from "vitest";
import { hotspotRepository } from "../../server/repositories/hotspot.repository.js";

describe("Spatial Proximity Repository Engine (Unit Tests)", () => {
  it("should find hotspots within radius of coordinates", () => {
    // Paradip Coastal in seeds is "20.1234° N, 85.7654° E" (Odisha)
    const nearby = hotspotRepository.findNearCoordinates(20.12, 85.76, 50);
    expect(Array.isArray(nearby)).toBe(true);
    expect(nearby.length).toBeGreaterThanOrEqual(1);
    expect(nearby.some(h => h.id === "EVT-20260903-0042")).toBe(true);
  });

  it("should return empty list when searching coordinates with no hotspots in radius", () => {
    // Coordinates in the middle of the Atlantic Ocean: 0° N, 25° W
    const empty = hotspotRepository.findNearCoordinates(0.0, -25.0, 50);
    expect(empty).toEqual([]);
  });
});
