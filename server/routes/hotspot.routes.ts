import { Router } from "express";
import { HotspotController } from "../controllers/hotspot.controller.js";

const router = Router();

router.get("/hotspots", HotspotController.getAll);
router.get("/hotspots/:id", HotspotController.getById);

export default router;
