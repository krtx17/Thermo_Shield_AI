import { Request, Response } from "express";
import { hotspotService } from "../services/hotspot.service.js";
import { telemetryHub } from "../websocket/hub.js";

export class HotspotController {
  public static getAll(req: Request, res: Response): void {
    const { severity, minRiskScore, region, search, lat, lng, radiusKm } = req.query;

    if (lat && lng) {
      const parsedLat = parseFloat(lat as string);
      const parsedLng = parseFloat(lng as string);
      const radius = radiusKm ? parseFloat(radiusKm as string) : 150;

      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        const nearby = hotspotService.getHotspotsNear(parsedLat, parsedLng, radius);
        res.json(nearby);
        return;
      }
    }

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

  public static async create(req: Request, res: Response): Promise<void> {
    const data = req.body;
    if (!data.id || !data.name || !data.coordinates) {
      res.status(400).json({ error: "Hotspot 'id', 'name', and 'coordinates' are required fields." });
      return;
    }

    try {
      const created = await hotspotService.createHotspot(data);
      telemetryHub.broadcast("NEW_HOTSPOT", created);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to create hotspot" });
    }
  }
}
