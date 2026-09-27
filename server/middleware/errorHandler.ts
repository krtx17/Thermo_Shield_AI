import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Handle malformed JSON body gracefully
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: "Malformed JSON in request body." });
    return;
  }

  console.error("[THERMO-SHIELD Server Error]:", err?.message || err);

  if (res.headersSent) {
    next(err);
    return;
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: err?.message || "An unexpected error occurred."
  });
}
