import path from "path";
import express from "express";
import { createServer as createViteServer } from "vite";
import { app } from "./server/app.js";
import { config } from "./server/config/index.js";

// Re-export domain interfaces for backward-compatibility
export type { HotspotRecord } from "./server/models/hotspot.model.js";
export type { AuditRecord } from "./server/models/audit.model.js";
export type { IncidentReportRecord } from "./server/models/report.model.js";

/**
 * Bootstrap Server:
 * Binds Vite middleware (in development) or static files (in production),
 * then begins listening on configured port.
 */
async function startServer() {
  const isProduction = config.nodeEnv === "production";

  if (!isProduction) {
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

  listenOnPort(config.port);
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

export default app;
