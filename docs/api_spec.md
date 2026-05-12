# SENTINEL NDR API Specification

## REST Endpoints

### Metrics
- GET /api/metrics
  - Returns dashboard summary statistics.

### Devices
- GET /api/devices
  - Returns all registered devices and current status.
- GET /api/devices/:id
  - Returns single device details and score history.
- GET /api/devices/:id/flows
  - Returns flow records for the target device.

### Alerts
- GET /api/alerts
  - Returns all alerts, filterable by severity and status.
- GET /api/alerts/:id
  - Returns single alert detail, narrative, and remediation history.
- POST /api/alerts/:id/remediate
  - Triggers a remediation action.

### Threats
- GET /api/threats
  - Returns flagged flow-level events.

### Baseline
- GET /api/baseline/status
  - Returns model health and drift status.
- POST /api/baseline/retrain
  - Triggers model retraining.

### Sensor Ingest
- POST /api/ingest
  - Accepts raw packet/flow features from sensor.

## WebSocket Events

- alert:new
  - Emitted when fusion engine raises a new alert.
- score:update
  - Emitted periodically with latest per-device scores.
- device:status
  - Emitted when sensor/device status changes.

## SQLite Schema (Reference)

```sql
CREATE TABLE devices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    mac_address TEXT,
    device_type TEXT,
    os TEXT,
    sensor_active INTEGER DEFAULT 0,
    registered_at TIMESTAMP,
    last_seen TIMESTAMP
);

CREATE TABLE flows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT,
    timestamp TIMESTAMP,
    src_ip TEXT,
    dst_ip TEXT,
    dst_port INTEGER,
    protocol TEXT,
    bytes_sent INTEGER,
    duration_ms INTEGER,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT,
    window_start TIMESTAMP,
    gmm_score REAL,
    kde_score REAL,
    lowess_score REAL,
    fusion_score REAL,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE alerts (
    id TEXT PRIMARY KEY,
    device_id TEXT,
    severity TEXT,
    attack_type TEXT,
    threat_percentage REAL,
    gmm_triggered INTEGER,
    kde_triggered INTEGER,
    lowess_triggered INTEGER,
    fusion_triggered INTEGER,
    duration_hours REAL,
    status TEXT DEFAULT 'OPEN',
    summary TEXT,
    raised_at TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE remediation_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id TEXT,
    action TEXT,
    performed_at TIMESTAMP,
    performed_by TEXT DEFAULT 'SENTINEL-AUTO',
    FOREIGN KEY (alert_id) REFERENCES alerts(id)
);
```
