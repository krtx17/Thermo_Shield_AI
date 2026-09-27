import { Router } from "express";
import { AIController } from "../controllers/ai.controller.js";

const router = Router();

router.post("/synthesize", AIController.synthesize);
router.post("/compare", AIController.compare);

export default router;
