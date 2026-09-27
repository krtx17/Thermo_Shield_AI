import { Router } from "express";
import { ReportController } from "../controllers/report.controller.js";

const router = Router();

router.get("/reports", ReportController.getReports);
router.post("/reports", ReportController.createReport);

export default router;
