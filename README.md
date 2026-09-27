# Thermo-Shield AI 🛰️🔥
### Autonomous Geospatial Hotspot & Industrial Infrastructure Risk Intelligence System
**Smart India Hackathon (SIH26162)**

Thermo-Shield AI is an edge-and-cloud geospatial intelligence platform engineered to monitor thermal anomalies, predict industrial containment breaches, and arbitrate multi-sensor risk factors across critical energy corridors, petrochemical complexes, and hazardous production zones.

---

## 🏗️ Architecture Overview

The system combines a reactive TypeScript/Tailwind operator console with an Express/Node.js telemetry broker and Google Gemini neural reasoning:

```
[Satellite Feeds (VIIRS / Sentinel-2 / Heuristic Telemetry)]
                           │
                           ▼
          ┌───────────────────────────────────┐
          │     Express / Node.js Engine      │
          │  • Deterministic Risk Matrix      │
          │  • /api/health Telemetry          │
          │  • Audit Trail & Incident Store   │
          └─────────────────┬─────────────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
   ┌───────────────────────┐  ┌───────────────────────┐
   │ Google Gemini (Cloud) │  │  Local Heuristics     │
   │ @google/genai SDK     │  │  (Zero-Egress Fallback│
   │ (gemini-2.5-flash)    │  │   Deterministic C2)   │
   └───────────┬───────────┘  └───────────┬───────────┘
               └────────────┬─────────────┘
                            │
                            ▼
          ┌───────────────────────────────────┐
          │    React 19 + Vite Operator UI    │
          │  • Multi-factor Filtering         │
          │  • RFC 7946 GeoJSON Exporter      │
          │  • Tactical TXT Dossier Generator │
          │  • Live C2 Telemetry & Audit Logs │
          └───────────────────────────────────┘
```

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript (unified Vite dev server middleware in dev mode; bundled into single `dist/server.cjs` via `esbuild` for production).
- **AI / Reasoning**: Google Gemini API (`gemini-2.5-flash` via official `@google/genai` SDK) with automatic, graceful failover to deterministic local attribution when offline or when `GEMINI_API_KEY` is omitted.
- **Deterministic Metrics**: Mean/Peak Fire Radiative Power (MW), Normalized Difference Moisture Index (NDMI), Normalized Burn Ratio (NBR), Normalized Difference Vegetation Index (NDVI), Shortwave/Near Infrared (SWIR/NIR) flux ratios, and facility proximity thresholds.

---

## 📡 Verified API Endpoints

All backend endpoints are strictly typed, payload-validated, and provide JSON feedback:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Live server telemetry: real process heap memory, Node uptime, dataset counts, and Gemini configuration state. |
| `GET` | `/api/hotspots` | Full registry of monitored geospatial hotspots, coordinates, and spectral signatures. |
| `POST` | `/api/synthesize` | Multi-agent incident synthesis using Gemini (or local deterministic heuristics). |
| `POST` | `/api/compare` | Dual-vector attribution engine computing comparative radiant flux deltas, distance deltas, and arbitration verdicts. |
| `GET` | `/api/audit-logs` | Retrieve the chronological immutable verification audit trail. |
| `POST` | `/api/audit-logs` | Record a newly signed analyst verification action into the audit trail. |
| `GET` | `/api/reports` | Retrieve dispatched incident dossiers and tactical briefs. |
| `POST` | `/api/reports` | Dispatch an active incident alert with priority, target facility, and response protocols. |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v24.x)
- **npm**: v9.0.0 or higher

### 1. Installation
Clone the repository and install dependencies:
```bash
# On Windows PowerShell / Command Prompt:
npm.cmd install

# On macOS / Linux:
npm install
```

### 2. Environment Configuration
Create a `.env.local` or `.env` file in the root directory:
```env
# Optional: Set your Google Gemini API Key for live cloud neural reasoning
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Override the Gemini model (default: gemini-2.5-flash)
GEMINI_MODEL=gemini-2.5-flash

# Optional: Server port (default: 3000)
PORT=3000
```
> **Note**: If `GEMINI_API_KEY` is not provided, Thermo-Shield AI automatically operates in **Local Heuristic Mode**, generating high-fidelity deterministic threat analyses without any runtime crashes.

### 3. Running in Development
Start the unified full-stack development server:
```bash
npm.cmd run dev   # On Windows
npm run dev       # On Unix
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Production Build & Execution
```bash
# Typecheck
npm.cmd run lint

# Compile Vite frontend + bundle Node backend
npm.cmd run build

# Start production server
npm.cmd start
```

### 5. Cleaning Build Artifacts
Cross-platform clean script:
```bash
npm.cmd run clean
```

---

## 🎯 Key Operational Modules

1. **Command Center**:
   - Live multi-sensor map and situational table.
   - **Real Multi-Factor Filters**: Filter by search query, date ranges, sensor constellations (VIIRS, Sentinel-2), industrial-only facility classification, and minimum recurrence persistence.
   - Quick jump to threat investigations with persistent selection.

2. **Active Threat Investigation**:
   - Multi-agent LangGraph workflow simulation visualizing ingestion, validation, and multi-spectral indices.
   - **Export GeoJSON**: Generates standard RFC 7946 GeoJSON FeatureCollections for GIS software (QGIS, ArcGIS).
   - **Generate Tactical Dossier**: Produces formatted `.txt` incident briefs with SHA-256 integrity signatures and logs the download to the audit trail.
   - **Inspect OSM Footprint**: Directly queries OpenStreetMap coordinates for the exact facility boundary.
   - **Compare Corridor**: Routes the event directly into the Dual-Vector Comparison matrix.

3. **Dual-Vector Risk Comparison**:
   - Arbitrates between two industrial corridor nodes.
   - Computes deterministic radiant power (MW) deltas, recurrence deltas, and distance deltas.
   - "Swap Nodes" button for immediate comparative perspective change.
   - Gemini neural comparative brief generation with local heuristic fallback.
   - Downloadable comparative intelligence briefing.

4. **Incident Reporting & Tactical Dispatch**:
   - Review dispatched incident alerts and pre-compiled asset briefs.
   - Interactive **Dispatch Incident Alert** modal to publish field taskings to the backend `/api/reports` store.
   - One-click incident dossier download.

5. **Audit Trail & Provenance Ledger**:
   - Cryptographic verification ledger tracking all threat verifications and operator actions.
   - Manual **Record Verification Entry** modal to cryptographically record analyst observations.
   - Instant search filtering by hash, operator, or incident ID.

6. **System Health & Runtime Diagnostics**:
   - Live server telemetry fetched from `GET /api/health`: Node.js process heap memory, process uptime, registered dataset counts, and Gemini cloud connectivity status.
   - Hardware telemetry benchmarks for field C2 edge deployments.

---

## 🛡️ SIH Evaluation Notes

- **Real vs. Simulated Feeds**: Satellite observation coordinates and spectral signatures represent calibrated industrial benchmark datasets (Dahej SEZ, Jamnagar Refinery, Visakhapatnam HPCL, Haldia Petrochemicals, etc.).
- **Live Computations**: All risk scores, distance parsing, multi-factor filtering, GeoJSON generation, dossier formatting, and server REST endpoints execute real logic.
- **AI Reliability**: Gemini cloud neural calls utilize the official `@google/genai` library with full error boundary isolation. If cloud quotas expire or network connectivity drops, the system continues running seamlessly in Local Heuristic mode.
