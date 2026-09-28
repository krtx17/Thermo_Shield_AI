import { describe, it, expect } from "vitest";
import { telemetryHub } from "../../server/websocket/hub.js";

describe("Telemetry Hub & Real-time Stream", () => {
  it("should be a singleton instance with safe broadcast capabilities", () => {
    expect(telemetryHub).toBeDefined();
    expect(typeof telemetryHub.broadcast).toBe("function");
    expect(typeof telemetryHub.getConnectedClientsCount).toBe("function");
  });

  it("broadcasting when no clients are connected should safely no-op without errors", () => {
    expect(() => {
      telemetryHub.broadcast("HOTSPOT_FLUX", {
        hotspotId: "EVT-20260903-0042",
        meanFRP: 350.5
      });
    }).not.toThrow();
  });
});
