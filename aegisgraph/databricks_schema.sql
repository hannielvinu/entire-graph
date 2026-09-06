-- Databricks Delta Table DDL for AegisGraph Telemetry
CREATE SCHEMA IF NOT EXISTS aegisgraph;

CREATE TABLE IF NOT EXISTS aegisgraph.analysis_events (
    event_id STRING,
    timestamp TIMESTAMP,
    repository STRING,
    commit STRING,
    checkpoint STRING,
    changed_symbols ARRAY<STRING>,
    impacted_symbols ARRAY<STRING>,
    confirmed_relationships INT,
    incomplete_relationships INT,
    verification_status STRING,
    decision STRING,
    decision_reason STRING,
    recovery_required BOOLEAN,
    curveball_mode BOOLEAN,
    analysis_version STRING
) USING DELTA
LOCATION '/mnt/lakehouse/aegisgraph/analysis_events';

-- 1. High Risk & Blocked Decisions
SELECT 
    date_trunc('day', timestamp) AS event_date,
    repository,
    count(1) AS total_events,
    sum(CASE WHEN decision = 'BLOCK' THEN 1 ELSE 0 END) AS blocked_events,
    sum(CASE WHEN decision = 'REVIEW' THEN 1 ELSE 0 END) AS review_events,
    sum(CASE WHEN decision = 'SAFE' THEN 1 ELSE 0 END) AS safe_events
FROM aegisgraph.analysis_events
GROUP BY 1, 2
ORDER BY event_date DESC;

-- 2. Incomplete Graph-Analysis Rate (Curveball Metric)
SELECT
    repository,
    count(1) AS total_analyses,
    sum(CASE WHEN incomplete_relationships > 0 THEN 1 ELSE 0 END) AS analyses_with_dynamic_patterns,
    round(sum(CASE WHEN incomplete_relationships > 0 THEN 1 ELSE 0 END) * 100.0 / count(1), 2) AS incomplete_graph_pct
FROM aegisgraph.analysis_events
GROUP BY repository;

-- 3. Downstream Verification Failures & Recovery Frequency
SELECT
    repository,
    checkpoint,
    decision_reason,
    count(1) AS recovery_count
FROM aegisgraph.analysis_events
WHERE recovery_required = true
GROUP BY repository, checkpoint, decision_reason
ORDER BY recovery_count DESC;
