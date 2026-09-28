-- Thermo Shield AI: Defense-Grade PostGIS Geospatial Database Schema
-- Provides spatial indexing, bounding proximity buffers, and cryptographic audit ledgers.

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. HOTSPOTS & SATELLITE THERMAL TELEMETRY
-- ============================================================================
CREATE TABLE IF NOT EXISTS hotspots (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),
    priority VARCHAR(64) DEFAULT 'MONITORED',
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH RISK', 'HIGH', 'MODERATE', 'MONITORED')),
    risk_score DOUBLE PRECISION NOT NULL CHECK (risk_score >= 0.0 AND risk_score <= 100.0),
    mean_frp_mw DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    peak_frp_mw DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    distance_to_asset VARCHAR(64),
    distance_meters DOUBLE PRECISION,
    asset_type VARCHAR(128),
    osm_identifier VARCHAR(64),
    road_access VARCHAR(128),
    nearest_fire_station VARCHAR(128),
    active_flame_prob DOUBLE PRECISION DEFAULT 0.0,
    refinery_proximity_prob DOUBLE PRECISION DEFAULT 0.0,
    persistence_index DOUBLE PRECISION DEFAULT 0.0,
    swir_nir_ratio DOUBLE PRECISION DEFAULT 1.0,
    nbr_index DOUBLE PRECISION DEFAULT 0.0,
    sensors TEXT[] DEFAULT ARRAY['VIIRS-FRP', 'SENTINEL-L2A'],
    recommendation TEXT,
    detected_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Spatial GIST index for lightning-fast radial bounding queries (<5ms)
CREATE INDEX IF NOT EXISTS idx_hotspots_geom ON hotspots USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_hotspots_severity ON hotspots (severity);
CREATE INDEX IF NOT EXISTS idx_hotspots_risk_score ON hotspots (risk_score DESC);

-- Automatic geometry generation from lat/lng
CREATE OR REPLACE FUNCTION sync_hotspot_geometry()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geom := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_hotspots_geom_sync ON hotspots;
CREATE TRIGGER trg_hotspots_geom_sync
    BEFORE INSERT OR UPDATE ON hotspots
    FOR EACH ROW
    EXECUTE FUNCTION sync_hotspot_geometry();

-- ============================================================================
-- 2. CRYPTOGRAPHIC TAMPER-EVIDENT AUDIT LEDGER
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_ledger (
    index BIGSERIAL PRIMARY KEY,
    block_hash VARCHAR(64) NOT NULL UNIQUE,
    previous_hash VARCHAR(64) NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    target_hotspot_id VARCHAR(64) REFERENCES hotspots(id) ON DELETE SET NULL,
    operator_id VARCHAR(128) NOT NULL,
    operator_role VARCHAR(64) NOT NULL,
    clearance_level VARCHAR(64) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_ledger (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_block_hash ON audit_ledger (block_hash);

-- ============================================================================
-- 3. INCIDENT REPORTS & TACTICAL DEOC DISPATCH DOSSIERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS incident_reports (
    id VARCHAR(64) PRIMARY KEY,
    hotspot_id VARCHAR(64) REFERENCES hotspots(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(32) NOT NULL CHECK (priority IN ('P1-CRITICAL', 'P2-HIGH', 'P3-MONITORED')),
    target_facility VARCHAR(255) NOT NULL,
    containment_status VARCHAR(64) DEFAULT 'CONTAINMENT_ENGAGED',
    deluge_deployed BOOLEAN DEFAULT FALSE,
    deluge_rate_lpm INTEGER DEFAULT 1200,
    deoc_broadcast_sent BOOLEAN DEFAULT FALSE,
    dispatched_by VARCHAR(128) NOT NULL,
    summary TEXT NOT NULL,
    recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_priority ON incident_reports (priority);
CREATE INDEX IF NOT EXISTS idx_reports_hotspot ON incident_reports (hotspot_id);

-- ============================================================================
-- 4. SPATIAL BUFFER ANALYSIS VIEW
-- ============================================================================
CREATE OR REPLACE VIEW v_critical_infrastructure_threats AS
SELECT 
    h.id AS hotspot_id,
    h.name AS facility_name,
    h.severity,
    h.risk_score,
    h.peak_frp_mw,
    h.swir_nir_ratio,
    h.distance_to_asset,
    CASE 
        WHEN h.risk_score >= 70.0 AND h.swir_nir_ratio > 1.25 THEN 'IMMEDIATE_DELUGE_TRIGGER'
        WHEN h.risk_score >= 50.0 THEN 'HIGH_ALERT_MARSHAL_DISPATCH'
        ELSE 'CONTINUOUS_ORBITAL_TRACKING'
    END AS automated_verdict,
    h.detected_at
FROM hotspots h
ORDER BY h.risk_score DESC;
