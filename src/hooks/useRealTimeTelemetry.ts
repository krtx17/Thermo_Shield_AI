import { useEffect, useState, useRef, useCallback } from "react";

export interface TelemetryFluxPayload {
  hotspotId: string;
  hotspotName: string;
  meanFRP: number;
  delta: number;
  timestamp: string;
}

export function useRealTimeTelemetry() {
  const [isConnected, setIsConnected] = useState(false);
  const [latestFlux, setLatestFlux] = useState<TelemetryFluxPayload | null>(null);
  const [connectionMessage, setConnectionMessage] = useState<string>("Connecting to telemetry stream...");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws/telemetry`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionMessage("Telemetry stream established");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "HOTSPOT_FLUX") {
            setLatestFlux(data.payload);
          } else if (data.type === "HEARTBEAT") {
            setConnectionMessage(data.payload?.message || "Stream healthy");
          }
        } catch (e) {
          console.warn("Failed to parse telemetry event:", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setConnectionMessage("Stream disconnected. Reconnecting...");
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    } catch {
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return { isConnected, latestFlux, connectionMessage };
}
