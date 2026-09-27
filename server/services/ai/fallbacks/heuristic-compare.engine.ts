import { HotspotRecord } from "../../../models/hotspot.model.js";

export interface CompareResult {
  success: boolean;
  text: string;
  arbitrationVerdict: string;
  provider: string;
  isSimulated: boolean;
}

export class HeuristicCompareEngine {
  public static parseDistanceMeters(distanceStr: string): number {
    if (!distanceStr) return 0;
    const lower = distanceStr.toLowerCase();
    const numMatch = lower.replace(/,/g, "").match(/[\d.]+/);
    if (!numMatch) return 0;
    const num = parseFloat(numMatch[0]);
    if (lower.includes("km")) {
      return num * 1000;
    }
    return num;
  }

  public static compare(eventA: HotspotRecord, eventB: HotspotRecord): CompareResult {
    const distA = HeuristicCompareEngine.parseDistanceMeters(eventA.distanceToAsset);
    const distB = HeuristicCompareEngine.parseDistanceMeters(eventB.distanceToAsset);
    const distDelta = Math.abs(distA - distB);
    const frpDelta = Math.abs(eventA.meanFRP - eventB.meanFRP).toFixed(1);
    const riskDelta = Math.abs(eventA.riskScore - eventB.riskScore).toFixed(1);
    const higherThreat = eventA.riskScore >= eventB.riskScore ? eventA : eventB;
    const lowerThreat = eventA.riskScore >= eventB.riskScore ? eventB : eventA;

    const arbitrationVerdict = `${higherThreat.name} (${higherThreat.id}) exceeds ${lowerThreat.name} (${lowerThreat.id}) by ${riskDelta} Risk Points.`;

    const fallbackText = `Deterministic comparison confirms an operational risk delta of ${riskDelta} risk points between ${eventA.id} and ${eventB.id}.

${higherThreat.id} (${higherThreat.name}) ranks higher in operational threat due to:
• Thermal Radiative Power: ${higherThreat.meanFRP.toFixed(1)} MW vs ${lowerThreat.meanFRP.toFixed(1)} MW (Delta: ${frpDelta} MW).
• Proximity to Critical Infrastructure: ${higherThreat.distanceToAsset} vs ${lowerThreat.distanceToAsset} (Distance buffer difference: ${distDelta.toFixed(0)}m).
• Recurrence Frequency: ${higherThreat.detections30d} detections in past 30 days (${higherThreat.trend30d}) vs ${lowerThreat.detections30d} detections (${lowerThreat.trend30d}).

Tactical Recommendation: Direct immediate aerial surveillance to ${higherThreat.name} corridor. Maintain routine automated telemetry polling for ${lowerThreat.name}.

[DEMO ADAPTER NOTICE: Computed via deterministic telemetry formulas. Gemini live reasoning activates when GEMINI_API_KEY is configured.]`;

    return {
      success: true,
      text: fallbackText,
      arbitrationVerdict,
      provider: "Deterministic Comparative Engine (Demo Mode)",
      isSimulated: true,
    };
  }
}
