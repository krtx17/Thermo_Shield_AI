import pg from "pg";
import dotenv from "dotenv";
import { INITIAL_HOTSPOTS, INITIAL_AUDIT_LOGS, INITIAL_REPORTS } from "./seeds.js";

dotenv.config();

const { Pool } = pg;

export interface DatabaseStatus {
  isConnected: boolean;
  clientType: "PostgreSQL" | "MemoryFallback";
  host?: string;
  database?: string;
  error?: string;
}

let pool: pg.Pool | null = null;
let isConnected = false;
let connectionError: string | null = null;

/**
 * Initialize PostgreSQL Connection Pool
 */
export function getPostgresPool(): pg.Pool | null {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  const host = process.env.PGHOST || "localhost";
  const port = process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432;
  const user = process.env.PGUSER || "postgres";
  const password = process.env.PGPASSWORD;
  const database = process.env.PGDATABASE || "thermo_shield";

  try {
    if (connectionString) {
      pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 3000,
      });
    } else {
      pool = new Pool({
        host,
        port,
        user,
        password: password || undefined,
        database,
        connectionTimeoutMillis: 3000,
      });
    }

    pool.on("error", (err) => {
      console.warn("[PostgreSQL Pool Error]:", err.message);
      isConnected = false;
    });

    return pool;
  } catch (err: any) {
    connectionError = err?.message || String(err);
    console.warn("[PostgreSQL Init Error]:", connectionError);
    return null;
  }
}

/**
 * Test PostgreSQL connectivity and initialize relational tables with seed data
 */
export async function initPostgresDatabase(): Promise<boolean> {
  const p = getPostgresPool();
  if (!p) {
    isConnected = false;
    return false;
  }

  try {
    const client = await p.connect();
    try {
      await client.query("SELECT 1;");
      isConnected = true;
      connectionError = null;

      // Run DDL migrations
      await client.query(`
        CREATE TABLE IF NOT EXISTS hotspots (
          id VARCHAR(64) PRIMARY KEY,
          name TEXT NOT NULL,
          region TEXT NOT NULL,
          coordinates TEXT NOT NULL,
          priority VARCHAR(32) NOT NULL,
          severity VARCHAR(32) NOT NULL,
          risk_score DOUBLE PRECISION NOT NULL,
          detected_at TEXT NOT NULL,
          mean_frp DOUBLE PRECISION NOT NULL,
          peak_frp DOUBLE PRECISION NOT NULL,
          distance_to_asset TEXT NOT NULL,
          asset_type TEXT NOT NULL,
          osm_identifier TEXT NOT NULL,
          road_access TEXT NOT NULL,
          nearest_fire_station TEXT NOT NULL,
          terrain_cover TEXT NOT NULL,
          active_flame_prob DOUBLE PRECISION NOT NULL,
          refinery_proximity_prob DOUBLE PRECISION NOT NULL,
          persistence_index DOUBLE PRECISION NOT NULL,
          detections_30d INTEGER NOT NULL,
          detections_90d INTEGER NOT NULL,
          trend_30d TEXT NOT NULL,
          sensors JSONB NOT NULL,
          ndvi DOUBLE PRECISION NOT NULL,
          nbr DOUBLE PRECISION NOT NULL,
          ndmi DOUBLE PRECISION NOT NULL,
          swir_nir DOUBLE PRECISION NOT NULL,
          formula TEXT NOT NULL,
          default_summary TEXT NOT NULL,
          recommendation TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
          id VARCHAR(64) PRIMARY KEY,
          block_num INTEGER NOT NULL,
          hash VARCHAR(64) NOT NULL,
          event TEXT NOT NULL,
          action TEXT NOT NULL,
          source TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          status VARCHAR(32) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS incident_reports (
          id VARCHAR(64) PRIMARY KEY,
          hotspot_id VARCHAR(64) NOT NULL,
          facility_name TEXT NOT NULL,
          region TEXT NOT NULL,
          severity VARCHAR(32) NOT NULL,
          risk_score DOUBLE PRECISION NOT NULL,
          detected_at TEXT NOT NULL,
          dispatched_at TEXT NOT NULL,
          dispatch_priority VARCHAR(32) NOT NULL,
          target_agency TEXT NOT NULL,
          summary TEXT NOT NULL,
          recommendation TEXT NOT NULL,
          status VARCHAR(32) NOT NULL
        );
      `);

      // Seed benchmark hotspots if table is empty
      const { rows: hotspotRows } = await client.query("SELECT COUNT(*) FROM hotspots;");
      if (parseInt(hotspotRows[0].count, 10) === 0) {
        for (const h of INITIAL_HOTSPOTS) {
          await client.query(`
            INSERT INTO hotspots (
              id, name, region, coordinates, priority, severity, risk_score, detected_at,
              mean_frp, peak_frp, distance_to_asset, asset_type, osm_identifier, road_access,
              nearest_fire_station, terrain_cover, active_flame_prob, refinery_proximity_prob,
              persistence_index, detections_30d, detections_90d, trend_30d, sensors,
              ndvi, nbr, ndmi, swir_nir, formula, default_summary, recommendation
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30);
          `, [
            h.id, h.name, h.region, h.coordinates, h.priority, h.severity, h.riskScore, h.detectedAt,
            h.meanFRP, h.peakFRP, h.distanceToAsset, h.assetType, h.osmIdentifier, h.roadAccess,
            h.nearestFireStation, h.terrainCover, h.activeFlameProb, h.refineryProximityProb,
            h.persistenceIndex, h.detections30d, h.detections90d, h.trend30d, JSON.stringify(h.sensors),
            h.ndvi, h.nbr, h.ndmi, h.swirNir, h.formula, h.defaultSummary, h.recommendation
          ]);
        }
        console.log("[PostgreSQL] Seeded benchmark hotspots into database.");
      }

      // Seed audit logs if table is empty
      const { rows: auditRows } = await client.query("SELECT COUNT(*) FROM audit_logs;");
      if (parseInt(auditRows[0].count, 10) === 0) {
        for (const a of INITIAL_AUDIT_LOGS) {
          await client.query(`
            INSERT INTO audit_logs (id, block_num, hash, event, action, source, timestamp, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
          `, [a.id, a.block, a.hash, a.event, a.action, a.source, a.timestamp, a.status]);
        }
        console.log("[PostgreSQL] Seeded initial audit blocks into database.");
      }

      // Seed incident reports if table is empty
      const { rows: repRows } = await client.query("SELECT COUNT(*) FROM incident_reports;");
      if (parseInt(repRows[0].count, 10) === 0) {
        for (const r of INITIAL_REPORTS) {
          await client.query(`
            INSERT INTO incident_reports (
              id, hotspot_id, facility_name, region, severity, risk_score, detected_at,
              dispatched_at, dispatch_priority, target_agency, summary, recommendation, status
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13);
          `, [
            r.id, r.hotspotId, r.facilityName, r.region, r.severity, r.riskScore, r.detectedAt,
            r.dispatchedAt, r.dispatchPriority, r.targetAgency, r.summary, r.recommendation, r.status
          ]);
        }
        console.log("[PostgreSQL] Seeded initial incident reports into database.");
      }

      console.log("[PostgreSQL] Connected, migrated, and verified successfully.");
      return true;
    } finally {
      client.release();
    }
  } catch (err: any) {
    isConnected = false;
    connectionError = err?.message || String(err);
    console.warn(
      `[PostgreSQL] Connection not established (${connectionError}). Engaging resilient in-memory fallback store.`
    );
    return false;
  }
}

export function isPostgresConnected(): boolean {
  return isConnected;
}

export function getDatabaseStatus(): DatabaseStatus {
  return {
    isConnected,
    clientType: isConnected ? "PostgreSQL" : "MemoryFallback",
    host: process.env.PGHOST || "localhost",
    database: process.env.PGDATABASE || "thermo_shield",
    error: connectionError || undefined,
  };
}

export async function disconnectPostgres(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    isConnected = false;
  }
}
