import { HotspotRecord, HotspotFilterOptions } from "../models/hotspot.model.js";
import { INITIAL_HOTSPOTS, mapRowToHotspot } from "../db/seeds.js";
import { getPostgresPool, isPostgresConnected } from "../db/postgres.js";

export class HotspotRepository {
  private hotspots: HotspotRecord[] = [...INITIAL_HOTSPOTS];

  /**
   * Synchronize local memory cache from PostgreSQL if connected
   */
  public async syncWithPostgres(): Promise<void> {
    const pool = getPostgresPool();
    if (!pool || !isPostgresConnected()) return;

    try {
      const res = await pool.query("SELECT * FROM hotspots ORDER BY id ASC;");
      if (res.rows && res.rows.length > 0) {
        this.hotspots = res.rows.map(mapRowToHotspot);
        console.log(`[HotspotRepository] Synced ${this.hotspots.length} hotspots from PostgreSQL.`);
      }
    } catch (err: any) {
      console.warn("[HotspotRepository Sync Error]:", err?.message);
    }
  }

  /**
   * Query all hotspots from memory cache (with optional filtering)
   */
  public findAll(options?: HotspotFilterOptions): HotspotRecord[] {
    let result = [...this.hotspots];
    if (!options) return result;

    if (options.severity) {
      result = result.filter(h => h.severity.toLowerCase() === options.severity?.toLowerCase());
    }
    if (options.minRiskScore !== undefined) {
      result = result.filter(h => h.riskScore >= (options.minRiskScore ?? 0));
    }
    if (options.region) {
      result = result.filter(h => h.region.toLowerCase().includes(options.region!.toLowerCase()));
    }
    if (options.search) {
      const q = options.search.toLowerCase();
      result = result.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.id.toLowerCase().includes(q) ||
        h.assetType.toLowerCase().includes(q)
      );
    }
    return result;
  }

  /**
   * Async query querying PostgreSQL directly if connected, falling back to in-memory
   */
  public async findAllAsync(options?: HotspotFilterOptions): Promise<HotspotRecord[]> {
    const pool = getPostgresPool();
    if (pool && isPostgresConnected()) {
      try {
        let query = "SELECT * FROM hotspots WHERE 1=1";
        const params: any[] = [];

        if (options?.severity) {
          params.push(options.severity.toUpperCase());
          query += ` AND UPPER(severity) = $${params.length}`;
        }
        if (options?.minRiskScore !== undefined) {
          params.push(options.minRiskScore);
          query += ` AND risk_score >= $${params.length}`;
        }
        if (options?.region) {
          params.push(`%${options.region}%`);
          query += ` AND region ILIKE $${params.length}`;
        }
        if (options?.search) {
          params.push(`%${options.search}%`);
          query += ` AND (name ILIKE $${params.length} OR id ILIKE $${params.length} OR asset_type ILIKE $${params.length})`;
        }

        query += " ORDER BY id ASC;";
        const res = await pool.query(query, params);
        if (res.rows) {
          return res.rows.map(mapRowToHotspot);
        }
      } catch (err: any) {
        console.warn("[HotspotRepository findAllAsync Error]:", err?.message);
      }
    }
    return this.findAll(options);
  }

  public findById(id: string): HotspotRecord | undefined {
    return this.hotspots.find(h => h.id === id);
  }

  public async findByIdAsync(id: string): Promise<HotspotRecord | undefined> {
    const pool = getPostgresPool();
    if (pool && isPostgresConnected()) {
      try {
        const res = await pool.query("SELECT * FROM hotspots WHERE id = $1 LIMIT 1;", [id]);
        if (res.rows && res.rows.length > 0) {
          return mapRowToHotspot(res.rows[0]);
        }
        return undefined;
      } catch (err: any) {
        console.warn("[HotspotRepository findByIdAsync Error]:", err?.message);
      }
    }
    return this.findById(id);
  }

  /**
   * Save or update a hotspot record in memory and PostgreSQL
   */
  public async save(hotspot: HotspotRecord): Promise<HotspotRecord> {
    const idx = this.hotspots.findIndex(h => h.id === hotspot.id);
    if (idx >= 0) {
      this.hotspots[idx] = hotspot;
    } else {
      this.hotspots.push(hotspot);
    }

    const pool = getPostgresPool();
    if (pool && isPostgresConnected()) {
      try {
        await pool.query(`
          INSERT INTO hotspots (
            id, name, region, coordinates, priority, severity, risk_score, detected_at,
            mean_frp, peak_frp, distance_to_asset, asset_type, osm_identifier, road_access,
            nearest_fire_station, terrain_cover, active_flame_prob, refinery_proximity_prob,
            persistence_index, detections_30d, detections_90d, trend_30d, sensors,
            ndvi, nbr, ndmi, swir_nir, formula, default_summary, recommendation
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            region = EXCLUDED.region,
            coordinates = EXCLUDED.coordinates,
            priority = EXCLUDED.priority,
            severity = EXCLUDED.severity,
            risk_score = EXCLUDED.risk_score,
            detected_at = EXCLUDED.detected_at,
            mean_frp = EXCLUDED.mean_frp,
            peak_frp = EXCLUDED.peak_frp,
            distance_to_asset = EXCLUDED.distance_to_asset,
            asset_type = EXCLUDED.asset_type,
            osm_identifier = EXCLUDED.osm_identifier,
            road_access = EXCLUDED.road_access,
            nearest_fire_station = EXCLUDED.nearest_fire_station,
            terrain_cover = EXCLUDED.terrain_cover,
            active_flame_prob = EXCLUDED.active_flame_prob,
            refinery_proximity_prob = EXCLUDED.refinery_proximity_prob,
            persistence_index = EXCLUDED.persistence_index,
            detections_30d = EXCLUDED.detections_30d,
            detections_90d = EXCLUDED.detections_90d,
            trend_30d = EXCLUDED.trend_30d,
            sensors = EXCLUDED.sensors,
            ndvi = EXCLUDED.ndvi,
            nbr = EXCLUDED.nbr,
            ndmi = EXCLUDED.ndmi,
            swir_nir = EXCLUDED.swir_nir,
            formula = EXCLUDED.formula,
            default_summary = EXCLUDED.default_summary,
            recommendation = EXCLUDED.recommendation;
        `, [
          hotspot.id, hotspot.name, hotspot.region, hotspot.coordinates, hotspot.priority, hotspot.severity,
          hotspot.riskScore, hotspot.detectedAt, hotspot.meanFRP, hotspot.peakFRP, hotspot.distanceToAsset,
          hotspot.assetType, hotspot.osmIdentifier, hotspot.roadAccess, hotspot.nearestFireStation,
          hotspot.terrainCover, hotspot.activeFlameProb, hotspot.refineryProximityProb,
          hotspot.persistenceIndex, hotspot.detections30d, hotspot.detections90d, hotspot.trend30d,
          JSON.stringify(hotspot.sensors), hotspot.ndvi, hotspot.nbr, hotspot.ndmi, hotspot.swirNir,
          hotspot.formula, hotspot.defaultSummary, hotspot.recommendation
        ]);
      } catch (err: any) {
        console.warn("[HotspotRepository Save DB Error]:", err?.message);
      }
    }

    return hotspot;
  }

  public count(): number {
    return this.hotspots.length;
  }

  /**
   * Spatial Proximity Search using Haversine Great-Circle Distance
   */
  public findNearCoordinates(targetLat: number, targetLng: number, radiusKm = 150): HotspotRecord[] {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    return this.hotspots.filter((h) => {
      const latMatch = h.coordinates.match(/([\d.]+)\s*°?\s*([NS])/i);
      const lngMatch = h.coordinates.match(/([\d.]+)\s*°?\s*([EW])/i);
      if (!latMatch || !lngMatch) return false;

      const lat = parseFloat(latMatch[1]) * (latMatch[2].toUpperCase() === "S" ? -1 : 1);
      const lng = parseFloat(lngMatch[1]) * (lngMatch[2].toUpperCase() === "W" ? -1 : 1);

      const dLat = toRad(lat - targetLat);
      const dLng = toRad(lng - targetLng);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(targetLat)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance <= radiusKm;
    });
  }
}

export const hotspotRepository = new HotspotRepository();
