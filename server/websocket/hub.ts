import { WebSocketServer, WebSocket } from "ws";
import { Server as HttpServer } from "http";

export interface TelemetryBroadcastEvent {
  type: "HOTSPOT_FLUX" | "NEW_HOTSPOT" | "AUDIT_BLOCK" | "REPORT_DISPATCHED" | "HEARTBEAT";
  payload: any;
  timestamp: string;
}

export class TelemetryHub {
  private static instance: TelemetryHub;
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();

  private constructor() {}

  public static getInstance(): TelemetryHub {
    if (!TelemetryHub.instance) {
      TelemetryHub.instance = new TelemetryHub();
    }
    return TelemetryHub.instance;
  }

  public init(server: HttpServer): WebSocketServer {
    this.wss = new WebSocketServer({ server, path: "/ws/telemetry" });

    this.wss.on("connection", (ws: WebSocket) => {
      this.clients.add(ws);

      // Send initial welcome/handshake event
      ws.send(JSON.stringify({
        type: "HEARTBEAT",
        payload: { message: "Thermo Shield AI Telemetry Stream Connected" },
        timestamp: new Date().toISOString()
      }));

      ws.on("close", () => {
        this.clients.delete(ws);
      });

      ws.on("error", (err) => {
        console.warn("[WebSocket Client Error]:", err.message);
        this.clients.delete(ws);
      });
    });

    console.log("[WebSocket] Real-time telemetry hub active on /ws/telemetry");
    return this.wss;
  }

  public broadcast(type: TelemetryBroadcastEvent["type"], payload: any): void {
    if (!this.wss || this.clients.size === 0) return;

    const event: TelemetryBroadcastEvent = {
      type,
      payload,
      timestamp: new Date().toISOString()
    };

    const message = JSON.stringify(event);

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
}

export const telemetryHub = TelemetryHub.getInstance();
