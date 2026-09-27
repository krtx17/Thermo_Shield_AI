# Thermo Shield AI - Master Architecture & Session Walkthrough
> **Portable Session Document** - Pass this document between development sessions to maintain full architectural context, API contract specifications, operational guidelines, and system progress.

---

## 1. Executive Summary & Mission
**Thermo Shield AI** is an enterprise-grade AI-powered Early Warning & Geospatial Anomaly Monitoring Command System designed for critical infrastructure, defense corridors, petrochemical zones, and high-consequence energy complexes.

The system fuses:
- **Multispectral Satellite Telemetry**: Sentinel-2 L2A MSI, VIIRS FRP I-Band (NOAA-20, Suomi-NPP).
- **Geospatial & Vector Proximities**: OpenStreetMap infrastructure vectors, distance-to-asset metrics, road access networks, and nearest municipal/industrial fire stations.
- **Agentic AI Intelligence**: Multi-agent reasoning pipeline (Tactical Synthesizer, Threat Arbitrator) backed by Google Gemini with resilient deterministic heuristic fallback engines.
- **Cryptographic Tamper-Evident Ledger**: SHA-256 blockchain-style sequential block audit trail for every detection, query, synthesis, and incident dispatch.
- **3D Geospatial Visualization**: Interactive Three.js Earth globe, live animated canvas monitoring radar, and multi-spectral infrared forensic inspection.

---

## 2. System Architecture

```
                  +----------------------------------------------+
                  |         Frontend (React 19 + Vite 6)         |
                  |  - Three.js 3D Globe with light-blue oceans  |
                  |  - Interactive Panning Radar Facility Map    |
                  |  - Active Investigations & Spectral Views    |
                  |  - Dual-Vector Threat Comparison Matrix      |
                  |  - Blockchain Audit Trail Explorer           |
                  +----------------------+-----------------------+
                                         | HTTP / REST (Vite Proxy or Direct)
                                         v
+---------------------------------------------------------------------------------+
|                        Thermo Shield AI Backend (Node / Express)                |
+---------------------------------------------------------------------------------+
| [Entry / Bootstrap]                                                            |
|   server.ts              -> Starts Vite dev middleware or serves /dist SPA      |
|   server/app.ts          -> Express application assembly, CORS, JSON, logging  |
+---------------------------------------------------------------------------------+
| [Middleware]                                                                    |
|   requestLogger.ts       -> High-precision latency & status logging            |
|   validator.ts           -> Request validation & sanitization                   |
|   errorHandler.ts        -> Centralized RFC-compliant error formatting          |
+---------------------------------------------------------------------------------+
| [Routes & Controllers (/api/*)]                                                 |
|   health.controller.ts   -> GET  /api/health                                    |
|   hotspot.controller.ts  -> GET  /api/hotspots, GET /api/hotspots/:id           |
|   ai.controller.ts       -> POST /api/synthesize, POST /api/compare             |
|   audit.controller.ts    -> GET  /api/audit-logs, POST /api/audit-logs          |
|   report.controller.ts   -> GET  /api/reports, POST /api/reports                |
+---------------------------------------------------------------------------------+
| [Services Layer]                                                                |
|   hotspot.service.ts     -> Telemetry querying & spatial filtering              |
|   audit.service.ts       -> Block ledger creation & SHA-256 tamper verification |
|   report.service.ts      -> Incident dossier dispatch & lifecycle management   |
|   ai/                                                                           |
|     tactical-synthesizer.agent.ts -> Gemini tactical intelligence synthesis     |
|     threat-arbitrator.agent.ts    -> Dual-vector comparative threat arbitration |
|     fallbacks/                                                                  |
|       heuristic-synthesis.engine.ts -> Deterministic mathematical synthesis     |
|       heuristic-compare.engine.ts   -> Deterministic delta threat arbitration   |
+---------------------------------------------------------------------------------+
| [Repositories & Data Layer]                                                     |
|   hotspot.repository.ts  -> Calibrated industrial anomaly dataset               |
|   audit.repository.ts    -> Sequential cryptographic block ledger               |
|   report.repository.ts   -> Emergency response dossier store                    |
+---------------------------------------------------------------------------------+
```

---

## 3. Strict API Contracts (Zero Frontend Disruption)

| Endpoint | Method | Request Payload | Response Schema | Frontend Consumers |
| :--- | :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | _None_ | `{ status, service, timestamp, uptimeSeconds, geminiConfigured, model, hotspotsCount, auditLogsCount, incidentReportsCount, environment, memoryUsageMB }` | `Settings.tsx`, `SystemHealth.tsx` |
| `/api/hotspots` | `GET` | _None_ | `HotspotRecord[]` | `App.tsx` |
| `/api/hotspots/:id` | `GET` | URL param `id` | `HotspotRecord` (404 if not found) | API testing / drill-down |
| `/api/synthesize` | `POST` | `{ hotspotId: string, userPrompt?: string }` | `{ success: boolean, text: string, provider: string, isSimulated: boolean }` | `ActiveInvestigations.tsx` |
| `/api/compare` | `POST` | `{ eventAId: string, eventBId: string }` | `{ success: boolean, text: string, arbitrationVerdict: string, provider: string, isSimulated: boolean }` | `RiskComparison.tsx` |
| `/api/audit-logs` | `GET` | _None_ | `AuditRecord[]` (ordered latest first) | `AuditTrail.tsx`, `SystemHealth.tsx` |
| `/api/audit-logs` | `POST` | `{ event: string, action: string, source?: string }` | `AuditRecord` (201 Created) | `ActiveInvestigations.tsx`, `AuditTrail.tsx` |
| `/api/reports` | `GET` | _None_ | `IncidentReportRecord[]` | `IncidentReports.tsx` |
| `/api/reports` | `POST` | `{ hotspotId: string, facilityName?: string, dispatchPriority?: string, recommendation?: string, summary?: string, targetAgency?: string }` | `IncidentReportRecord` (201 Created) | `ActiveInvestigations.tsx`, `IncidentReports.tsx` |

---

## 4. Key Data Models

### 4.1 HotspotRecord
```typescript
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
```

### 4.2 AuditRecord (Tamper-Evident SHA-256 Ledger)
```typescript
export interface AuditRecord {
  id: string;
  block: number;
  hash: string; // 0x + 24 hex characters of SHA-256(block:event:action:timestamp)
  event: string;
  action: string;
  source: string;
  timestamp: string; // YYYY-MM-DD HH:mm:ss UTC
  status: "VERIFIED" | "PENDING" | "SYSTEM";
}
```

### 4.3 IncidentReportRecord
```typescript
export interface IncidentReportRecord {
  id: string; // DOSSIER-XXXXXXXX
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
```

---

## 5. Development Phases Summary
1. **Phase 1: Foundation, Git Remote & Test Infrastructure**: Git repo connection, baseline commit, test environment (Vitest + Supertest), session documentation.
2. **Phase 2: Domain Layer & Repositories**: Modular models and data access repositories with unit tests.
3. **Phase 3: Agentic AI & Deterministic Heuristics**: Multi-agent reasoning pipeline, prompt templates, fallback engines with unit tests.
4. **Phase 4: Services, Controllers & Routing**: Business services, typed controllers, request validation, error handling middleware with unit tests.
5. **Phase 5: Application Assembly & Integration Testing**: Express app assembly, complete suite of end-to-end integration tests.
6. **Phase 6: Remote Sync & Verification**: Final compilation check, full test run, and push to GitHub repository (`https://github.com/krtx17/Thermo_Shield_AI`).

---

## 6. How to Run & Verify
```bash
# Install dependencies
npm.cmd install

# Run all unit and integration tests
npm.cmd test

# Run type checks
npm.cmd run typecheck

# Start development server (Full-stack with Vite & API)
npm.cmd run dev

# Build for production
npm.cmd run build

# Start production server
npm.cmd start
```

---

## 7. Context Preservation Notes for Future Sessions
- The frontend UI must **never be broken or changed** unless explicitly directed by the user.
- All new backend capabilities must preserve backwards compatibility with existing frontend endpoints.
- If `GEMINI_API_KEY` is not configured or set to placeholder `"MY_GEMINI_API_KEY"`, the backend automatically and seamlessly switches to the Deterministic Heuristic Engine with calibrated domain formulas.
