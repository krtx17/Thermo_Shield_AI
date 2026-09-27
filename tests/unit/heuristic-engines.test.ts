import { describe, it, expect } from "vitest";
import { HeuristicCompareEngine } from "../../server/services/ai/fallbacks/heuristic-compare.engine.js";
import { HeuristicSynthesisEngine } from "../../server/services/ai/fallbacks/heuristic-synthesis.engine.js";
import { hotspotRepository } from "../../server/repositories/hotspot.repository.js";

describe("HeuristicCompareEngine - Distance Parsing", () => {
  it("should parse meter strings with commas and suffixes", () => {
    expect(HeuristicCompareEngine.parseDistanceMeters("412m")).toBe(412);
    expect(HeuristicCompareEngine.parseDistanceMeters("1,302m")).toBe(1302);
    expect(HeuristicCompareEngine.parseDistanceMeters("500 m")).toBe(500);
  });

  it("should parse kilometer strings correctly into meters", () => {
    expect(HeuristicCompareEngine.parseDistanceMeters("1.2 km")).toBe(1200);
    expect(HeuristicCompareEngine.parseDistanceMeters("4.5km")).toBe(4500);
  });

  it("should handle empty or malformed strings gracefully", () => {
    expect(HeuristicCompareEngine.parseDistanceMeters("")).toBe(0);
    expect(HeuristicCompareEngine.parseDistanceMeters("unspecified")).toBe(0);
  });
});

describe("HeuristicCompareEngine - Threat Arbitration", () => {
  it("should arbitrate higher risk hotspot correctly", () => {
    const eventA = hotspotRepository.findById("EVT-20260903-0042")!; // Risk: 78.4
    const eventB = hotspotRepository.findById("EVT-20260903-0089")!; // Risk: 51.2

    const result = HeuristicCompareEngine.compare(eventA, eventB);
    expect(result.success).toBe(true);
    expect(result.isSimulated).toBe(true);
    expect(result.arbitrationVerdict).toContain("Paradip Coastal Petrochemical Enclave");
    expect(result.arbitrationVerdict).toContain("exceeds Dahej Special Economic Chemical Zone");
    expect(result.arbitrationVerdict).toContain("27.2 Risk Points");
    expect(result.text).toContain("Paradip Coastal Petrochemical Enclave");
    expect(result.text).toContain("342.0 MW vs 144.0 MW");
  });
});

describe("HeuristicSynthesisEngine", () => {
  it("should generate structured synthesis with fallback notice", () => {
    const event = hotspotRepository.findById("EVT-20260903-0042")!;
    const result = HeuristicSynthesisEngine.generate(event, "Focus on refinery proximity");

    expect(result.success).toBe(true);
    expect(result.text).toContain("Odisha Industrial Corridor");
    expect(result.text).toContain("Analyst Focus Area: \"Focus on refinery proximity\"");
    expect(result.text).toContain("Deterministic Telemetry Fallback mode");
  });
});
