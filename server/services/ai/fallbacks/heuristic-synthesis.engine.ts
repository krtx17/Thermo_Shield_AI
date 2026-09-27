import { HotspotRecord } from "../../../models/hotspot.model.js";

export interface SynthesisResult {
  success: boolean;
  text: string;
  provider: string;
  isSimulated: boolean;
}

export class HeuristicSynthesisEngine {
  public static generate(hotspot: HotspotRecord, userPrompt?: string): SynthesisResult {
    let customNote = "";
    if (userPrompt && userPrompt.trim().length > 0) {
      customNote = `\n\n[Analyst Focus Area: "${userPrompt.trim()}"]`;
    }

    const narrative = `${hotspot.defaultSummary}${customNote}\n\n[DEMO ADAPTER NOTICE: Operating in Deterministic Telemetry Fallback mode. Live dynamic synthesis with Google Gemini is activated when GEMINI_API_KEY is configured.]`;

    return {
      success: true,
      text: narrative,
      provider: "Deterministic Telemetry Fallback Engine (Demo Mode)",
      isSimulated: true,
    };
  }
}
