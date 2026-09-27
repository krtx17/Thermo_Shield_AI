import { HotspotRecord, HotspotFilterOptions } from "../models/hotspot.model.js";
import { hotspotRepository, HotspotRepository } from "../repositories/hotspot.repository.js";

export class HotspotService {
  constructor(private repo: HotspotRepository = hotspotRepository) {}

  public getAllHotspots(options?: HotspotFilterOptions): HotspotRecord[] {
    return this.repo.findAll(options);
  }

  public getHotspotById(id: string): HotspotRecord | undefined {
    return this.repo.findById(id);
  }

  public getHotspotCount(): number {
    return this.repo.count();
  }
}

export const hotspotService = new HotspotService();
