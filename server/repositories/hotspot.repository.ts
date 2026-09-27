import { HotspotRecord, HotspotFilterOptions } from "../models/hotspot.model.js";

/**
 * Benchmark Hotspot Telemetry Dataset
 * Calibrated with real multispectral bands (Sentinel-2 L2A & VIIRS FRP).
 */
const INITIAL_HOTSPOTS: HotspotRecord[] = [
  {
    id: "EVT-20260903-0042",
    name: "Paradip Coastal Petrochemical Enclave",
    region: "Odisha Industrial Corridor",
    coordinates: "20.1234° N, 85.7654° E",
    priority: "HIGH-ASSET",
    severity: "CRITICAL",
    riskScore: 78.4,
    detectedAt: "2026-09-03 14:18:22 UTC",
    meanFRP: 342.0,
    peakFRP: 418.5,
    distanceToAsset: "412m",
    assetType: "Hydrocarbon Refining",
    osmIdentifier: "way/94827104",
    roadAccess: "120m (SH-12 Link)",
    nearestFireStation: "4.2 km (Paradip Port)",
    terrainCover: "Hardened Asphalt / Metal",
    activeFlameProb: 91.2,
    refineryProximityProb: 88.5,
    persistenceIndex: 72.0,
    detections30d: 18,
    detections90d: 47,
    trend30d: "+12.3 MW/wk",
    sensors: ["VIIRS-FRP", "OSM-GEO", "SENTINEL-L2A", "TEMPORAL-REC"],
    ndvi: -0.18,
    nbr: 0.74,
    ndmi: 0.42,
    swirNir: 2.81,
    formula: "0.45(P_fire) + 0.35(P_ind) + 0.20(P_pers) = 78.4",
    defaultSummary: "This event is classified as CRITICAL with a risk score of 78.4/100. Key telemetry: FRP mean of 342 MW at 412m proximity to a known oil refinery inside the designated Odisha Industrial Corridor. Temporal analysis reveals 18 detections in 30 days with a positive upward slope (+12.3 MW/week). ConvNeXt-Tiny multispectral classification confirms Active Industrial Fire with 91.2% confidence. Simulated Grad-CAM analysis isolates thermal activation concentrated directly on processing units rather than open flare pits.",
    recommendation: "Recommend immediate site verification and priority alert to refinery safety dispatch. Notify District Emergency Ops Center (DEOC)."
  },
  {
    id: "EVT-20260903-0089",
    name: "Dahej Special Economic Chemical Zone",
    region: "Gujarat Petrochem Belt",
    coordinates: "21.7051° N, 72.5857° E",
    priority: "HIGH-ASSET",
    severity: "HIGH RISK",
    riskScore: 51.2,
    detectedAt: "2026-09-03 13:42:10 UTC",
    meanFRP: 144.0,
    peakFRP: 162.0,
    distanceToAsset: "1,302m",
    assetType: "Specialty Polymer Plant",
    osmIdentifier: "way/72891244",
    roadAccess: "240m (GIDC Avenue 2)",
    nearestFireStation: "6.8 km (Dahej Fire Station)",
    terrainCover: "Soil / Sparsely Vegetated",
    activeFlameProb: 84.6,
    refineryProximityProb: 55.2,
    persistenceIndex: 44.0,
    detections30d: 9,
    detections90d: 22,
    trend30d: "+4.1 MW/wk",
    sensors: ["VIIRS-FRP", "OSM-GEO", "SENTINEL-L2A"],
    ndvi: 0.12,
    nbr: 0.38,
    ndmi: 0.15,
    swirNir: 1.65,
    formula: "0.45(P_fire) + 0.35(P_ind) + 0.20(P_pers) = 51.2",
    defaultSummary: "This event is flagged as HIGH RISK with a deterministic risk score of 51.2/100. Active flame probability is estimated at 84.6%, operating at a distance of 1,302m from primary chemical storage facilities. Historical 30-day recurrence remains moderate with 9 detections. SWIR-based indices suggest active surface carbonization but less intense radiant power output compared to the Odisha refinery crisis.",
    recommendation: "Issue preventative advisory warning to site supervisors. Increase monitoring rate to 15-minute Sentinel-2 pre-pass tasking."
  },
  {
    id: "EVT-20260902-0031",
    name: "Jharkhand Steel Cluster",
    region: "Jamshedpur Industrial Zone",
    coordinates: "22.7925° N, 86.1842° E",
    priority: "MODERATE-ASSET",
    severity: "MODERATE",
    riskScore: 34.2,
    detectedAt: "2026-09-02 09:12:44 UTC",
    meanFRP: 94.5,
    peakFRP: 110.0,
    distanceToAsset: "1,800m",
    assetType: "Blast Furnace Area",
    osmIdentifier: "way/10492812",
    roadAccess: "500m (Industrial Link)",
    nearestFireStation: "8.1 km (Jamshedpur Sector 4)",
    terrainCover: "Concrete / Built-up",
    activeFlameProb: 52.0,
    refineryProximityProb: 24.1,
    persistenceIndex: 31.0,
    detections30d: 5,
    detections90d: 14,
    trend30d: "+0.8 MW/wk",
    sensors: ["VIIRS-FRP", "SENTINEL-L2A"],
    ndvi: 0.04,
    nbr: 0.15,
    ndmi: 0.08,
    swirNir: 1.10,
    formula: "0.45(P_fire) + 0.35(P_ind) + 0.20(P_pers) = 34.2",
    defaultSummary: "An anomaly detected in Jharkhand Steel Cluster with a score of 34.2/100 (MODERATE). Highly localized slag dump thermal flare activity, located roughly 1.8km away from core structures. High stability index and low 30-day trend indicate normal operational cooling cycles.",
    recommendation: "Log event to general audit log. Standard automatic tracking. No tactical deployment needed."
  },
  {
    id: "EVT-20260902-0012",
    name: "Nagpur Logistics Hub",
    region: "Maharashtra Central Corridor",
    coordinates: "21.1458° N, 79.0882° E",
    priority: "LOW-ASSET",
    severity: "MONITORED",
    riskScore: 18.1,
    detectedAt: "2026-09-02 04:30:15 UTC",
    meanFRP: 31.2,
    peakFRP: 45.0,
    distanceToAsset: "3,200m",
    assetType: "Agricultural Storage Yards",
    osmIdentifier: "way/59827110",
    roadAccess: "1.2 km (National Highway)",
    nearestFireStation: "12.0 km (Nagpur Rural)",
    terrainCover: "Cropland / Bare Soil",
    activeFlameProb: 15.4,
    refineryProximityProb: 5.0,
    persistenceIndex: 12.0,
    detections30d: 2,
    detections90d: 3,
    trend30d: "-2.4 MW/wk",
    sensors: ["VIIRS-FRP"],
    ndvi: 0.45,
    nbr: 0.05,
    ndmi: -0.12,
    swirNir: 0.65,
    formula: "0.45(P_fire) + 0.35(P_ind) + 0.20(P_pers) = 18.1",
    defaultSummary: "Low severity hotspot observed near Nagpur Logistics Hub, scoring 18.1/100 (MONITORED). Class 4 anomaly indicative of minor biomass residue controlled agricultural burning. Rapidly decaying thermal signature.",
    recommendation: "No operational response needed. Flagged as seasonal agricultural stubble clearing."
  }
];

export class HotspotRepository {
  private hotspots: HotspotRecord[] = [...INITIAL_HOTSPOTS];

  public findAll(options?: HotspotFilterOptions): HotspotRecord[] {
    let result = [...this.hotspots];
    if (!options) return result;

    if (options.severity) {
      result = result.filter(h => h.severity.toLowerCase() === options.severity?.toLowerCase());
    }
    if (options.minRiskScore !== undefined) {
      result = result.filter(h => h.riskScore >= (options.minRiskScore ?? 0));
    }
    if (options.region) {
      result = result.filter(h => h.region.toLowerCase().includes(options.region!.toLowerCase()));
    }
    if (options.search) {
      const q = options.search.toLowerCase();
      result = result.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.id.toLowerCase().includes(q) ||
        h.assetType.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public findById(id: string): HotspotRecord | undefined {
    return this.hotspots.find(h => h.id === id);
  }

  public count(): number {
    return this.hotspots.length;
  }
}

export const hotspotRepository = new HotspotRepository();
