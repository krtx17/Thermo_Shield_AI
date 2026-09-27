import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on("finish", () => {
    // Only log API requests to avoid spamming asset/Vite requests
    if (req.originalUrl.startsWith("/api")) {
      const duration = Date.now() - start;
      const status = res.statusCode;
      const indicator = status >= 500 ? "ERR" : status >= 400 ? "WARN" : "OK";
      console.log(
        `[API] [${indicator}] ${req.method} ${req.originalUrl} - ${status} (${duration}ms)`
      );
    }
  });
  next();
}
