import { Router } from "express";
import healthRouter from "./health.routes.js";
import hotspotRouter from "./hotspot.routes.js";
import aiRouter from "./ai.routes.js";
import auditRouter from "./audit.routes.js";
import reportRouter from "./report.routes.js";

const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(hotspotRouter);
apiRouter.use(aiRouter);
apiRouter.use(auditRouter);
apiRouter.use(reportRouter);

export default apiRouter;
