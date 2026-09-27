import { Router } from "express";
import { AuditController } from "../controllers/audit.controller.js";

const router = Router();

router.get("/audit-logs", AuditController.getLogs);
router.post("/audit-logs", AuditController.createLog);

export default router;
