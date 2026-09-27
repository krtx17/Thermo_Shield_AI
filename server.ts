import express from "express";
import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

app.use(express.json());

// Handle malformed JSON bodies gracefully without crashing the server
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Malformed JSON in request body." });
  }
  next(err);
});

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured with a valid key.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "thermo-shield-ai",
        },
      },
    });
  }
  return aiClient;
}

// Helper: Parse distance string like "1,302m" or "412m" or "1.2 km" into meters
function parseDistanceMeters(distanceStr: string): number {
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

// In-Memory Benchmark Hotspot Telemetry Dataset (Calibrated for SIH Demonstrations)
export interface HotspotRecord {
  id: string;
  name: string;
  region: string;
  coordinates: string;
  priority: string;
  severity: "CRITICAL" | "HIGH RISK" | "MODERATE" | "MONITORED" | string;
  riskScore: number;
  detectedAt: string;
  meanFRP: number;
  peakFRP: number;
  distanceToAsset: string;
  assetType: string;
  osmIdentifier: string;
  roadAccess: string;
  nearestFireStation: string;
  terrainCover: string;
  activeFlameProb: number;
  refineryProximityProb: number;
  persistenceIndex: number;
  detections30d: number;
  detections90d: number;
  trend30d: string;
  sensors: string[];
  ndvi: number;
  nbr: number;
  ndmi: number;
  swirNir: number;
  formula: string;
  defaultSummary: string;
  recommendation: string;
}

const HOTSPOTS: HotspotRecord[] = [
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

// In-Memory Dynamic Audit Ledger
export interface AuditRecord {
  id: string;
  block: number;
  hash: string;
  event: string;
  action: string;
  source: string;
  timestamp: string;
  status: "VERIFIED" | "PENDING" | "SYSTEM";
}

let blockCounter = 104292;
const AUDIT_LOGS: AuditRecord[] = [
  {
    id: "aud-001",
    block: 104291,
    hash: "0x8fa12ce973bd540191fe8c9321aa",
    event: "EVT-20260903-0042",
    action: "Multispectral Sentinel-2 L2A Ingestion",
    source: "Sentinel-2 MSI Level-2A",
    timestamp: "2026-09-03 14:18:22 UTC",
    status: "VERIFIED"
  },
  {
    id: "aud-002",
    block: 104290,
    hash: "0x3da94a619c00bcf955ab331201dd",
    event: "EVT-20260903-0042",
    action: "VIIRS Active Fire Ingestion (FRP 342MW)",
    source: "VIIRS I-Band (NOAA-20)",
    timestamp: "2026-09-03 14:10:00 UTC",
    status: "VERIFIED"
  },
  {
    id: "aud-003",
    block: 104289,
    hash: "0xe21ba40982bbfe39118c642289aa",
    event: "EVT-20260903-0089",
    action: "Hazardous Chemical Proximity Verification",
    source: "Sentinel-2 MSI Level-2A",
    timestamp: "2026-09-03 13:42:10 UTC",
    status: "VERIFIED"
  },
  {
    id: "aud-004",
    block: 104288,
    hash: "0xbcd91264ac19318844fe015389bb",
    event: "EVT-20260903-0089",
    action: "VIIRS Ingestion & Initial Risk Computation",
    source: "VIIRS I-Band (Suomi-NPP)",
    timestamp: "2026-09-03 13:35:00 UTC",
    status: "VERIFIED"
  }
];

function logAuditEvent(event: string, action: string, source: string): AuditRecord {
  blockCounter += 1;
  const hash = "0x" + crypto.createHash("sha256").update(`${blockCounter}:${event}:${action}:${Date.now()}`).digest("hex").slice(0, 24);
  const now = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const newRecord: AuditRecord = {
    id: `aud-${Date.now()}`,
    block: blockCounter,
    hash,
    event,
    action,
    source,
    timestamp: now,
    status: "VERIFIED"
  };
  AUDIT_LOGS.unshift(newRecord);
  return newRecord;
}

// In-Memory Incident Reports
export interface IncidentReportRecord {
  id: string;
  hotspotId: string;
  facilityName: string;
  region: string;
  severity: string;
  riskScore: number;
  detectedAt: string;
  dispatchedAt: string;
  dispatchPriority: "ALPHA" | "BRAVO" | "CHARLIE";
  targetAgency: string;
  summary: string;
  recommendation: string;
  status: "DISPATCHED" | "ACKNOWLEDGED" | "RESOLVED";
}

const INCIDENT_REPORTS: IncidentReportRecord[] = [
  {
    id: "DOSSIER-20260903-001",
    hotspotId: "EVT-20260903-0042",
    facilityName: "Paradip Coastal Petrochemical Enclave",
    region: "Odisha Industrial Corridor",
    severity: "CRITICAL",
    riskScore: 78.4,
    detectedAt: "2026-09-03 14:18:22 UTC",
    dispatchedAt: "2026-09-03 14:24:00 UTC",
    dispatchPriority: "ALPHA",
    targetAgency: "District Emergency Operations Center (DEOC) & Paradip Port Fire Authority",
    summary: "Critical thermal signature (342 MW mean FRP) detected within 412m of hydrocarbon cracking tanks. Persistence index at 72% across 30 days.",
    recommendation: "Immediate aerial surveillance and deployment of Class B thermal suppression foam units to perimeter road SH-12.",
    status: "DISPATCHED"
  },
  {
    id: "DOSSIER-20260903-002",
    hotspotId: "EVT-20260903-0089",
    facilityName: "Dahej Special Economic Chemical Zone",
    region: "Gujarat Petrochem Belt",
    severity: "HIGH RISK",
    riskScore: 51.2,
    detectedAt: "2026-09-03 13:42:10 UTC",
    dispatchedAt: "2026-09-03 13:50:00 UTC",
    dispatchPriority: "BRAVO",
    targetAgency: "GIDC Industrial Safety Inspectorate",
    summary: "High-temperature flaring outside scheduled refinery maintenance hours. Proximity to polymer feedstock depot: 1,302m.",
    recommendation: "Issue high-level advisory warning to on-duty plant safety director; monitor for fugitive emissions.",
    status: "ACKNOWLEDGED"
  }
];

// ==========================================
// API Endpoints
// ==========================================

// 1. Health check & Diagnostics
app.get("/api/health", (req, res) => {
  const geminiConfigured = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  res.json({
    status: "ok",
    service: "Thermo-Shield AI Command Server",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    geminiConfigured,
    model: geminiConfigured ? GEMINI_MODEL : "Deterministic Heuristic Engine (Fallback)",
    hotspotsCount: HOTSPOTS.length,
    auditLogsCount: AUDIT_LOGS.length,
    incidentReportsCount: INCIDENT_REPORTS.length,
    environment: process.env.NODE_ENV || "development",
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
  });
});

// 2. Fetch all hotspots
app.get("/api/hotspots", (req, res) => {
  res.json(HOTSPOTS);
});

// 3. Fetch single hotspot by ID
app.get("/api/hotspots/:id", (req, res) => {
  const hotspot = HOTSPOTS.find(h => h.id === req.params.id);
  if (!hotspot) {
    return res.status(404).json({ error: `Hotspot with ID '${req.params.id}' not found` });
  }
  res.json(hotspot);
});

// 4. AI Synthesized Intelligence Brief using Gemini
app.post("/api/synthesize", async (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ success: false, error: "Invalid JSON request body." });
  }

  const { hotspotId, userPrompt } = req.body;
  if (!hotspotId || typeof hotspotId !== "string") {
    return res.status(400).json({ success: false, error: "Field 'hotspotId' is required and must be a string." });
  }

  const hotspot = HOTSPOTS.find(h => h.id === hotspotId);
  if (!hotspot) {
    return res.status(404).json({ success: false, error: `Hotspot '${hotspotId}' not found.` });
  }

  const isGeminiAvailable = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

  if (isGeminiAvailable) {
    try {
      const ai = getGenAI();
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
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          temperature: 0.1,
        }
      });

      const responseText = response.text || hotspot.defaultSummary;
      logAuditEvent(hotspot.id, "AI Tactical Synthesis Generated (Gemini 2.5)", "Gemini Cloud API");

      return res.json({
        success: true,
        text: responseText,
        provider: `Google Gemini (${GEMINI_MODEL})`,
        isSimulated: false
      });
    } catch (error: any) {
      console.warn("Gemini API call failed, falling back to deterministic telemetry:", error?.message || error);
    }
  }

  // Graceful deterministic fallback
  logAuditEvent(hotspot.id, "Tactical Synthesis Generated (Deterministic Heuristic)", "Local Rule Engine");
  return res.json({
    success: true,
    text: hotspot.defaultSummary + "\n\n[DEMO ADAPTER NOTICE: Operating in Deterministic Telemetry Fallback mode. Live dynamic synthesis with Google Gemini is activated when GEMINI_API_KEY is configured.]",
    provider: "Deterministic Telemetry Fallback Engine (Demo Mode)",
    isSimulated: true
  });
});

// 5. Dual-Vector Attribution Comparison Matrix
app.post("/api/compare", async (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ success: false, error: "Invalid JSON request body." });
  }

  const { eventAId, eventBId } = req.body;
  if (!eventAId || !eventBId || typeof eventAId !== "string" || typeof eventBId !== "string") {
    return res.status(400).json({ success: false, error: "Fields 'eventAId' and 'eventBId' are required strings." });
  }

  const eventA = HOTSPOTS.find(h => h.id === eventAId);
  const eventB = HOTSPOTS.find(h => h.id === eventBId);

  if (!eventA || !eventB) {
    return res.status(404).json({ success: false, error: "One or both specified events were not found." });
  }

  const distA = parseDistanceMeters(eventA.distanceToAsset);
  const distB = parseDistanceMeters(eventB.distanceToAsset);
  const distDelta = Math.abs(distA - distB);
  const frpDelta = Math.abs(eventA.meanFRP - eventB.meanFRP).toFixed(1);
  const riskDelta = Math.abs(eventA.riskScore - eventB.riskScore).toFixed(1);
  const higherThreat = eventA.riskScore >= eventB.riskScore ? eventA : eventB;
  const lowerThreat = eventA.riskScore >= eventB.riskScore ? eventB : eventA;

  const isGeminiAvailable = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

  if (isGeminiAvailable) {
    try {
      const ai = getGenAI();
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
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          temperature: 0.15,
        }
      });

      logAuditEvent(`${eventA.id} / ${eventB.id}`, "Dual-Vector Attribution Comparison Executed", "Gemini Cloud API");

      return res.json({
        success: true,
        text: response.text,
        arbitrationVerdict: `${higherThreat.name} (${higherThreat.id}) exceeds ${lowerThreat.name} (${lowerThreat.id}) by ${riskDelta} Risk Points.`,
        provider: `Google Gemini (${GEMINI_MODEL})`,
        isSimulated: false
      });
    } catch (error: any) {
      console.warn("Gemini compare failed, falling back to deterministic computation:", error?.message || error);
    }
  }

  // Graceful deterministic fallback
  logAuditEvent(`${eventA.id} / ${eventB.id}`, "Dual-Vector Attribution Comparison Executed", "Deterministic Heuristic Engine");
  const fallbackText = `Deterministic comparison confirms an operational risk delta of ${riskDelta} risk points between ${eventA.id} and ${eventB.id}.

${higherThreat.id} (${higherThreat.name}) ranks higher in operational threat due to:
• Thermal Radiative Power: ${higherThreat.meanFRP.toFixed(1)} MW vs ${lowerThreat.meanFRP.toFixed(1)} MW (Delta: ${frpDelta} MW).
• Proximity to Critical Infrastructure: ${higherThreat.distanceToAsset} vs ${lowerThreat.distanceToAsset} (Distance buffer difference: ${distDelta.toFixed(0)}m).
• Recurrence Frequency: ${higherThreat.detections30d} detections in past 30 days (${higherThreat.trend30d}) vs ${lowerThreat.detections30d} detections (${lowerThreat.trend30d}).

Tactical Recommendation: Direct immediate aerial surveillance to ${higherThreat.name} corridor. Maintain routine automated telemetry polling for ${lowerThreat.name}.

[DEMO ADAPTER NOTICE: Computed via deterministic telemetry formulas. Gemini live reasoning activates when GEMINI_API_KEY is configured.]`;

  return res.json({
    success: true,
    text: fallbackText,
    arbitrationVerdict: `${higherThreat.name} (${higherThreat.id}) exceeds ${lowerThreat.name} (${lowerThreat.id}) by ${riskDelta} Risk Points.`,
    provider: "Deterministic Comparative Engine (Demo Mode)",
    isSimulated: true
  });
});

// 6. Audit Trail Endpoints
app.get("/api/audit-logs", (req, res) => {
  res.json(AUDIT_LOGS);
});

app.post("/api/audit-logs", (req, res) => {
  const { event, action, source } = req.body || {};
  if (!event || !action) {
    return res.status(400).json({ error: "Fields 'event' and 'action' are required." });
  }
  const record = logAuditEvent(event, action, source || "User Interaction");
  res.status(201).json(record);
});

// 7. Incident Reports Endpoints
app.get("/api/reports", (req, res) => {
  res.json(INCIDENT_REPORTS);
});

app.post("/api/reports", (req, res) => {
  const { hotspotId, targetAgency, dispatchPriority, recommendation, summary } = req.body || {};
  if (!hotspotId) {
    return res.status(400).json({ error: "Field 'hotspotId' is required." });
  }
  const hotspot = HOTSPOTS.find(h => h.id === hotspotId);
  if (!hotspot) {
    return res.status(404).json({ error: `Hotspot '${hotspotId}' not found.` });
  }

  const now = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const newReport: IncidentReportRecord = {
    id: `DOSSIER-${Date.now().toString().slice(-8)}`,
    hotspotId: hotspot.id,
    facilityName: hotspot.name,
    region: hotspot.region,
    severity: hotspot.severity,
    riskScore: hotspot.riskScore,
    detectedAt: hotspot.detectedAt,
    dispatchedAt: now,
    dispatchPriority: dispatchPriority || (hotspot.riskScore > 70 ? "ALPHA" : hotspot.riskScore > 40 ? "BRAVO" : "CHARLIE"),
    targetAgency: targetAgency || "Regional Emergency Management & Industrial Inspectorate",
    summary: summary || hotspot.defaultSummary,
    recommendation: recommendation || hotspot.recommendation,
    status: "DISPATCHED"
  };

  INCIDENT_REPORTS.unshift(newReport);
  logAuditEvent(hotspot.id, `Tactical Incident Dossier Dispatched (${newReport.id})`, "Operator Console");
  res.status(201).json(newReport);
});

// Configure Vite middleware or Static asset hosting
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global fallback error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[THERMO-SHIELD Server Error]:", err?.message || err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: "Internal Server Error", message: err?.message || "An unexpected error occurred." });
  });

  function listenOnPort(p: number) {
    const srv = app.listen(p, "0.0.0.0", () => {
      console.log(`[THERMO-SHIELD AI Server] running at http://localhost:${p}`);
    });
    srv.on("error", (err: any) => {
      if (err.code === "EADDRINUSE" && p === 3000) {
        console.warn(`[THERMO-SHIELD] Port 3000 in use, falling back to port 3001...`);
        listenOnPort(3001);
      } else {
        console.error("[THERMO-SHIELD Server Listen Error]:", err);
      }
    });
  }

  listenOnPort(PORT);
}

process.on("uncaughtException", (err) => {
  console.error("[THERMO-SHIELD Uncaught Exception]:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("[THERMO-SHIELD Unhandled Rejection]:", reason);
});

process.on("exit", (code) => {
  console.log(`[THERMO-SHIELD Process Exit] code: ${code}`);
});

startServer().catch((err) => {
  console.error("[THERMO-SHIELD Fatal Startup Error]:", err);
});

