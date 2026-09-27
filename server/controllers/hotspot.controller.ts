import { Request, Response } from "express";
import { hotspotService } from "../services/hotspot.service.js";

export class HotspotController {
  public static getAll(req: Request, res: Response): void {
    const { severity, minRiskScore, region, search } = req.query;
    const filterOptions = {
      severity: typeof severity === "string" ? severity : undefined,
      minRiskScore: typeof minRiskScore === "string" ? parseFloat(minRiskScore) : undefined,
      region: typeof region === "string" ? region : undefined,
      search: typeof search === "string" ? search : undefined,
    };

    const hotspots = hotspotService.getAllHotspots(
      Object.values(filterOptions).some(v => v !== undefined) ? filterOptions : undefined
    );
    res.json(hotspots);
  }

  public static getById(req: Request, res: Response): void {
    const { id } = req.params;
    const hotspot = hotspotService.getHotspotById(id);
    if (!hotspot) {
      res.status(404).json({ error: `Hotspot with ID '${id}' not found` });
      return;
    }
    res.json(hotspot);
  }
}
