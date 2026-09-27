# Thermo Shield AI - Tasks & Phases Master Plan
> **Tracking Document**: Records all project milestones, task statuses, verification checks, and unit/integration test results.

---

## Phase Overview

| Phase | Description | Status | Unit/Integration Tests |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Foundation, Git Sync & Test Harness Setup | In Progress | Test runner bootstrap |
| **Phase 2** | Domain Models & Cryptographic Repositories | Planned | Repository unit tests |
| **Phase 3** | Agentic AI Multi-Agent Pipeline & Fallback Heuristics | Planned | AI & heuristic unit tests |
| **Phase 4** | Services, Controllers & Modular Express Routing | Planned | Service & controller unit tests |
| **Phase 5** | Application Assembly & E2E Integration Testing | Planned | Full API integration tests |
| **Phase 6** | Final Production Build & Git Push to Remote | Planned | Build & end-to-end verification |

---

## Detailed Tasks & Checklist

### Phase 1: Foundation, Git Remote & Test Infrastructure
- [ ] Connect remote Git repository: `https://github.com/krtx17/Thermo_Shield_AI`
- [ ] Set default branch to `main`
- [ ] Create initial commit with baseline frontend and configuration
- [ ] Push baseline commit to GitHub
- [ ] Install test dependencies (`vitest`, `supertest`, `@types/supertest`)
- [ ] Configure `vitest.config.ts`
- [ ] Add `test` script in `package.json`
- [ ] Verify test runner execution (`npm.cmd test`)

### Phase 2: Domain Layer & Repositories
- [ ] Create `server/models/hotspot.model.ts` (HotspotRecord, priority/severity types)
- [ ] Create `server/models/audit.model.ts` (AuditRecord, SHA-256 block hashing)
- [ ] Create `server/models/report.model.ts` (IncidentReportRecord, dispatch status)
- [ ] Create `server/repositories/hotspot.repository.ts` (In-memory calibrated benchmark dataset, query methods)
- [ ] Create `server/repositories/audit.repository.ts` (Sequential block ledger, SHA-256 generation, verification)
- [ ] Create `server/repositories/report.repository.ts` (Incident report store, priority indexing)
- [ ] **Unit Tests**:
  - [ ] `tests/unit/hotspot.repository.test.ts`: Test querying all hotspots, findById, non-existent ID
  - [ ] `tests/unit/audit.repository.test.ts`: Test initial block state, block height increment, hash generation format
  - [ ] `tests/unit/report.repository.test.ts`: Test report persistence, default fallback values, descending query

### Phase 3: Agentic AI Multi-Agent Pipeline & Deterministic Fallbacks
- [ ] Create `server/services/ai/gemini.client.ts` (Lazy GoogleGenAI client singleton with health check)
- [ ] Create `server/services/ai/agents/tactical-synthesizer.agent.ts` (Tactical Intelligence Agent with prompt template)
- [ ] Create `server/services/ai/agents/threat-arbitrator.agent.ts` (Dual-Vector Attribution Comparison Agent)
- [ ] Create `server/services/ai/fallbacks/heuristic-synthesis.engine.ts` (Deterministic telemetry summary generator)
- [ ] Create `server/services/ai/fallbacks/heuristic-compare.engine.ts` (Distance/FRP/Risk delta arbitrator)
- [ ] **Unit Tests**:
  - [ ] `tests/unit/heuristic-engines.test.ts`: Test distance parser ("412m", "1.2 km", "1,302m"), mathematical deltas, verdict logic
  - [ ] `tests/unit/gemini-client.test.ts`: Test API key validation and fallback triggers

### Phase 4: Business Services, Controllers & Modular Routing
- [ ] Create `server/services/hotspot.service.ts`
- [ ] Create `server/services/audit.service.ts`
- [ ] Create `server/services/report.service.ts`
- [ ] Create `server/middleware/requestLogger.ts` (Timing, status codes, method)
- [ ] Create `server/middleware/errorHandler.ts` (Centralized error handling, bad JSON handling)
- [ ] Create `server/controllers/health.controller.ts` (Diagnostics, uptime, memory, counts)
- [ ] Create `server/controllers/hotspot.controller.ts` (Hotspot listing and detail)
- [ ] Create `server/controllers/ai.controller.ts` (Synthesize & compare handlers)
- [ ] Create `server/controllers/audit.controller.ts` (Audit log GET & POST)
- [ ] Create `server/controllers/report.controller.ts` (Incident report GET & POST)
- [ ] Create modular routers (`server/routes/*.ts`) and master index router (`server/routes/index.ts`)
- [ ] **Unit Tests**:
  - [ ] `tests/unit/services.test.ts`: Verify service layer operations
  - [ ] `tests/unit/controllers.test.ts`: Verify controller responses and status codes

### Phase 5: Application Assembly & Integration Testing
- [ ] Assemble `server/app.ts` (Clean Express app with middleware and routes)
- [ ] Refactor `server.ts` to cleanly import `app` and attach Vite / Static serving
- [ ] **Integration Tests**:
  - [ ] `tests/integration/health.api.test.ts`: `GET /api/health` structure, model status
  - [ ] `tests/integration/hotspots.api.test.ts`: `GET /api/hotspots`, `GET /api/hotspots/:id`, 404 behavior
  - [ ] `tests/integration/ai.api.test.ts`: `POST /api/synthesize`, `POST /api/compare`, validation errors
  - [ ] `tests/integration/audit.api.test.ts`: `GET /api/audit-logs`, `POST /api/audit-logs`
  - [ ] `tests/integration/reports.api.test.ts`: `GET /api/reports`, `POST /api/reports`
  - [ ] Verify all 7 endpoints meet frontend expectations 100%

### Phase 6: Final Verification & Git Remote Sync
- [ ] Run full test suite (`npm.cmd test`) and achieve 100% pass rate
- [ ] Run TypeScript type check (`npm.cmd run typecheck`)
- [ ] Run Vite production build (`npm.cmd run build`)
- [ ] Commit all changes to Git with clean semantic messages
- [ ] Push all commits to `https://github.com/krtx17/Thermo_Shield_AI` on `main` branch
- [ ] Update documentation with final status and verification proof

---

## Verification Checks Summary
- [ ] Frontend code untouched (0 modifications to UI components)
- [ ] All frontend API calls operational
- [ ] Unit tests pass for each module
- [ ] Integration test suite passes 100%
- [ ] Clean git push to `https://github.com/krtx17/Thermo_Shield_AI`
