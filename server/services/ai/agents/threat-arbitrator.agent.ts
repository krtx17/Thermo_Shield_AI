import { HotspotRecord } from "../../../models/hotspot.model.js";
import { config } from "../../../config/index.js";
import { GeminiClientFactory } from "../gemini.client.js";
import {
  HeuristicCompareEngine,
  CompareResult,
} from "../fallbacks/heuristic-compare.engine.js";

export class ThreatArbitratorAgent {
  public static async compare(
    eventA: HotspotRecord,
    eventB: HotspotRecord
  ): Promise<CompareResult> {
    const distA = HeuristicCompareEngine.parseDistanceMeters(eventA.distanceToAsset);
    const distB = HeuristicCompareEngine.parseDistanceMeters(eventB.distanceToAsset);
    const distDelta = Math.abs(distA - distB);
    const frpDelta = Math.abs(eventA.meanFRP - eventB.meanFRP).toFixed(1);
    const riskDelta = Math.abs(eventA.riskScore - eventB.riskScore).toFixed(1);
    const higherThreat = eventA.riskScore >= eventB.riskScore ? eventA : eventB;
    const lowerThreat = eventA.riskScore >= eventB.riskScore ? eventB : eventA;
    const verdict = `${higherThreat.name} (${higherThreat.id}) exceeds ${lowerThreat.name} (${lowerThreat.id}) by ${riskDelta} Risk Points.`;

    if (GeminiClientFactory.isConfigured()) {
      try {
        const ai = GeminiClientFactory.getClient();
        const prompt = `
You are an expert Geospatial Threat Attribution Analyst for Thermo-Shield AI. Perform an automated Dual-Vector Attribution Comparison between two industrial anomaly events.

Event A:
- ID: ${eventA.id} (${eventA.name}, ${eventA.region})
- Risk Score: ${eventA.riskScore}/100 (${eventA.severity})
- Mean FRP: ${eventA.meanFRP} MW
- Asset Proximity: ${eventA.distanceToAsset} (${eventA.assetType})
- Recurrence (30d): ${eventA.detections30d} detections (Trend: ${eventA.trend30d})

Event B:
- ID: ${eventB.id} (${eventB.name}, ${eventB.region})
- Risk Score: ${eventB.riskScore}/100 (${eventB.severity})
- Mean FRP: ${eventB.meanFRP} MW
- Asset Proximity: ${eventB.distanceToAsset} (${eventB.assetType})
- Recurrence (30d): ${eventB.detections30d} detections (Trend: ${eventB.trend30d})

Calculated Deltas:
- Risk Delta: ${riskDelta} points
- Thermal Delta: ${frpDelta} MW
- Physical Asset Distance Delta: ${distDelta} meters

Requirements:
1. Provide a concise "Arbitration Verdict" stating which anomaly represents a higher operational hazard.
2. Outline the primary telemetry drivers of the difference (thermal radiative power ratio, facility proximity, recurrence trajectory).
3. State a prioritized dispatch instruction for regional emergency response teams.
Format concisely without introductory chatter.
`;

        const response = await ai.models.generateContent({
          model: config.geminiModel,
          contents: prompt,
          config: {
            temperature: 0.15,
          },
        });

        return {
          success: true,
          text: response.text || "",
          arbitrationVerdict: verdict,
          provider: `Google Gemini (${config.geminiModel})`,
          isSimulated: false,
        };
      } catch (error: any) {
        console.warn(
          "[ThreatArbitratorAgent] Gemini comparison failed, engaging deterministic fallback:",
          error?.message || error
        );
      }
    }

    return HeuristicCompareEngine.compare(eventA, eventB);
  }
}
