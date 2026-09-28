import { telemetryHub } from "../websocket/hub.js";
import { hotspotRepository } from "../repositories/hotspot.repository.js";
import { auditRepository } from "../repositories/audit.repository.js";

export class TelemetryWorker {
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    // Run every 4 seconds: broadcast thermal flux and telemetry heartbeat
    this.timer = setInterval(() => {
      this.tick();
    }, 4000);

    console.log("[Worker] Autonomous Satellite Telemetry Ingest Worker started.");
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    console.log("[Worker] Telemetry Ingest Worker stopped.");
  }

  private tick(): void {
    const hotspots = hotspotRepository.findAll();
    if (hotspots.length === 0) return;

    // Pick a random hotspot to apply subtle thermal variance
    const targetIdx = Math.floor(Math.random() * hotspots.length);
    const target = hotspots[targetIdx];

    const delta = (Math.random() - 0.48) * 4.2; // +/- 2 MW flux
    const updatedMeanFRP = Math.max(10, Math.round((target.meanFRP + delta) * 10) / 10);

    // Broadcast live flux to UI
    telemetryHub.broadcast("HOTSPOT_FLUX", {
      hotspotId: target.id,
      hotspotName: target.name,
      meanFRP: updatedMeanFRP,
      delta: Math.round(delta * 10) / 10,
      timestamp: new Date().toISOString()
    });
  }
}

export const telemetryWorker = new TelemetryWorker();
