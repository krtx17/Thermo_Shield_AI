import { HotspotRecord } from "../models/hotspot.model.js";
import { TacticalSynthesizerAgent } from "./ai/agents/tactical-synthesizer.agent.js";
import { ThreatArbitratorAgent } from "./ai/agents/threat-arbitrator.agent.js";
import { SynthesisResult } from "./ai/fallbacks/heuristic-synthesis.engine.js";
import { CompareResult } from "./ai/fallbacks/heuristic-compare.engine.js";
import { auditService } from "./audit.service.js";

export class AIService {
  public static async synthesizeHotspot(
    hotspot: HotspotRecord,
    userPrompt?: string
  ): Promise<SynthesisResult> {
    const result = await TacticalSynthesizerAgent.synthesize(hotspot, userPrompt);

    if (result.isSimulated) {
      auditService.recordEvent(
        hotspot.id,
        "Tactical Synthesis Generated (Deterministic Heuristic)",
        "Local Rule Engine"
      );
    } else {
      auditService.recordEvent(
        hotspot.id,
        "AI Tactical Synthesis Generated (Gemini 2.5)",
        "Gemini Cloud API"
      );
    }

    return result;
  }

  public static async compareHotspots(
    eventA: HotspotRecord,
    eventB: HotspotRecord
  ): Promise<CompareResult> {
    const result = await ThreatArbitratorAgent.compare(eventA, eventB);

    auditService.recordEvent(
      `${eventA.id} / ${eventB.id}`,
      "Dual-Vector Attribution Comparison Executed",
      result.isSimulated ? "Deterministic Heuristic Engine" : "Gemini Cloud API"
    );

    return result;
  }
}
