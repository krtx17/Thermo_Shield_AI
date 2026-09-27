import { HotspotRecord } from "../../../models/hotspot.model.js";
import { config } from "../../../config/index.js";
import { GeminiClientFactory } from "../gemini.client.js";
import {
  HeuristicSynthesisEngine,
  SynthesisResult,
} from "../fallbacks/heuristic-synthesis.engine.js";

export class TacticalSynthesizerAgent {
  public static async synthesize(
    hotspot: HotspotRecord,
    userPrompt?: string
  ): Promise<SynthesisResult> {
    if (GeminiClientFactory.isConfigured()) {
      try {
        const ai = GeminiClientFactory.getClient();
        const prompt = `
You are a senior Defense & Geospatial Intelligence Analyst operating inside Thermo-Shield AI.
Generate a structured, professional, high-fidelity tactical briefing based strictly on the provided telemetry.

Hotspot Telemetry:
- Event ID: ${hotspot.id}
- Facility Name: ${hotspot.name} (${hotspot.region})
- Coordinates: ${hotspot.coordinates}
- Risk Score: ${hotspot.riskScore}/100 [Category: ${hotspot.severity}]
- Mean Radiant Power (FRP): ${hotspot.meanFRP} MW (Peak: ${hotspot.peakFRP} MW)
- Proximity to Asset: ${hotspot.distanceToAsset} (${hotspot.assetType})
- 30d Historical Detections: ${hotspot.detections30d} detections (Trend: ${hotspot.trend30d})
- Multispectral Indices: NDVI: ${hotspot.ndvi}, NBR: ${hotspot.nbr}, NDMI: ${hotspot.ndmi}, SWIR/NIR: ${hotspot.swirNir}
- Active Flame Class Prob: ${hotspot.activeFlameProb}%
- Nearest Fire Service: ${hotspot.nearestFireStation}

Analyst Inquiry: "${userPrompt || 'Generate standardized tactical briefing'}"

Requirements:
1. Write in a disciplined, objective intelligence briefing tone.
2. Begin directly with the tactical assessment without conversational greetings or filler.
3. Focus on concrete physical observables (FRP heat output, SWIR bands, distance to hazardous hydrocarbons, vegetation index) and deterministic reasoning.
4. Avoid ungrounded speculation; incorporate all provided metrics.
5. End with clear, actionable "Operational Dispatch Recommendations".
`;

        const response = await ai.models.generateContent({
          model: config.geminiModel,
          contents: prompt,
          config: {
            temperature: 0.1,
          },
        });

        const responseText = response.text || hotspot.defaultSummary;
        return {
          success: true,
          text: responseText,
          provider: `Google Gemini (${config.geminiModel})`,
          isSimulated: false,
        };
      } catch (error: any) {
        console.warn(
          "[TacticalSynthesizerAgent] Gemini call failed, engaging deterministic fallback:",
          error?.message || error
        );
      }
    }

    return HeuristicSynthesisEngine.generate(hotspot, userPrompt);
  }
}
