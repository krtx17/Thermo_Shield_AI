import express from "express";
import apiRouter from "./routes/index.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp(): express.Application {
  const app = express();

  // Parse JSON bodies
  app.use(express.json());

  // Log incoming API calls
  app.use(requestLogger);

  // Mount API endpoints under /api
  app.use("/api", apiRouter);

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}

export const app = createApp();
