import { Request, Response } from "express";
import { hotspotService } from "../services/hotspot.service.js";
import { AIService } from "../services/ai.service.js";

export class AIController {
  public static async synthesize(req: Request, res: Response): Promise<void> {
    if (!req.body || typeof req.body !== "object") {
      res.status(400).json({ success: false, error: "Invalid JSON request body." });
      return;
    }

    const { hotspotId, userPrompt } = req.body;
    if (!hotspotId || typeof hotspotId !== "string") {
      res.status(400).json({
        success: false,
        error: "Field 'hotspotId' is required and must be a string.",
      });
      return;
    }

    const hotspot = hotspotService.getHotspotById(hotspotId);
    if (!hotspot) {
      res.status(404).json({ success: false, error: `Hotspot '${hotspotId}' not found.` });
      return;
    }

    const result = await AIService.synthesizeHotspot(hotspot, userPrompt);
    res.json(result);
  }

  public static async compare(req: Request, res: Response): Promise<void> {
    if (!req.body || typeof req.body !== "object") {
      res.status(400).json({ success: false, error: "Invalid JSON request body." });
      return;
    }

    const { eventAId, eventBId } = req.body;
    if (
      !eventAId ||
      !eventBId ||
      typeof eventAId !== "string" ||
      typeof eventBId !== "string"
    ) {
      res.status(400).json({
        success: false,
        error: "Fields 'eventAId' and 'eventBId' are required strings.",
      });
      return;
    }

    const eventA = hotspotService.getHotspotById(eventAId);
    const eventB = hotspotService.getHotspotById(eventBId);

    if (!eventA || !eventB) {
      res.status(404).json({
        success: false,
        error: "One or both specified events were not found.",
      });
      return;
    }

    const result = await AIService.compareHotspots(eventA, eventB);
    res.json(result);
  }
}
