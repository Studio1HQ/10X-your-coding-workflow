-- Migration: 001_initial_analytics
-- Description: Create analytics_events table and indexes

BEGIN TRANSACTION;

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    event_name TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    properties TEXT, -- JSON payload
    created_at INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);

COMMIT;
