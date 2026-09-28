import rateLimit from "express-rate-limit";

/**
 * Standard API Rate Limiter
 * Restricts excessive queries to protect against DoS while allowing command center operations.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per 15-minute window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many telemetry requests from this origin. Please retry in a few moments.",
    retryAfterMinutes: 15
  }
});

/**
 * Stricter Rate Limiter for Authentication & Dispatch Endpoints
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Limit each IP to 50 login attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Exceeded authentication attempt threshold. Security hold initiated.",
    retryAfterMinutes: 15
  }
});
