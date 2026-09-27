import { describe, it, expect } from "vitest";
import { GeminiClientFactory } from "../../server/services/ai/gemini.client.js";
import { TacticalSynthesizerAgent } from "../../server/services/ai/agents/tactical-synthesizer.agent.js";
import { ThreatArbitratorAgent } from "../../server/services/ai/agents/threat-arbitrator.agent.js";
import { hotspotRepository } from "../../server/repositories/hotspot.repository.js";

describe("GeminiClientFactory", () => {
  it("should detect whether GEMINI_API_KEY is configured or placeholder", () => {
    const isConfigured = GeminiClientFactory.isConfigured();
    expect(typeof isConfigured).toBe("boolean");
  });

  it("should transparently fall back to deterministic synthesis when key is unavailable or simulated", async () => {
    const hotspot = hotspotRepository.findById("EVT-20260903-0042")!;
    const result = await TacticalSynthesizerAgent.synthesize(hotspot, "Check perimeter fire hazard");

    expect(result.success).toBe(true);
    expect(result.text).toBeDefined();
    expect(result.text.length).toBeGreaterThan(50);
  });

  it("should transparently fall back to deterministic arbitration when key is unavailable", async () => {
    const eventA = hotspotRepository.findById("EVT-20260903-0042")!;
    const eventB = hotspotRepository.findById("EVT-20260903-0089")!;
    const result = await ThreatArbitratorAgent.compare(eventA, eventB);

    expect(result.success).toBe(true);
    expect(result.arbitrationVerdict).toBeDefined();
    expect(result.text).toBeDefined();
  });
});
