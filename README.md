# SENTINEL NDR — Architecture & Technical Specification

## Project Overview

SENTINEL is a niche, full-stack Network Detection and Response (NDR) web application
engineered specifically to detect slow-moving and low-intensity cyber attacks — known
as "boiling frog" or "slow-and-low" attacks — that evade standard adaptive security
platforms like Darktrace by exploiting their re-baselining vulnerability.

This is NOT a general-purpose IDS. It solves one specific gap: detecting attacks that
are individually below the detection threshold but collectively represent malicious
behaviour over an extended time window (days to weeks).

Built as a BSc Computer Engineering Honours project at the University of Zimbabwe.
Researcher: Testimony Chimberengwa (R236592N)
Supervisor: Mr S Zvakafa

---

## The Problem Being Solved

Standard adaptive NDR platforms use Recursive Bayesian Estimation and Gaussian Mixture
Models with a high decay factor — mathematically optimised to favour recent observations.
When an attacker introduces malicious activity incrementally, the model slowly accepts
this as the new normal (adversarial concept drift / re-baselining).

Result: a 204-day average dwell time for slow-and-low attackers. SENTINEL's HDT algorithm
is designed to cut this significantly by adding a global density layer and temporal trend
awareness that the standard adaptive model lacks.

---

## System Architecture — High Level

```text
┌─────────────────────────────────────────────────────────────────┐
│                        LAB NETWORK                              │
│                   192.168.137.0/24                              │
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│  │  VM-RECON   │   │ VM-EXFIL    │   │  Phone /    │           │
│  │ Kali Linux  │   │ Ubuntu 20   │   │  Laptop     │           │
│  │ .50         │   │ .99         │   │  .23/.31    │           │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘           │
│         │                 │                  │                   │
│         └─────────────────┴──────────────────┘                   │
│                           │                                      │
│                  ┌────────▼────────┐                             │
│                  │  Windows Host   │                             │
│                  │  192.168.137.1  │                             │
│                  │  (Hotspot GW)   │                             │
│                  │                  │                             │
│                  │  ┌───────────┐   │                            │
│                  │  │  Scapy    │   │ ← single network sensor    │
│                  │  │  Sensor   │   │   captures all devices     │
│                  │  └─────┬─────┘   │                            │
│                  │        │         │                            │
│                  │  ┌─────▼─────┐   │                            │
│                  │  │   Flask   │   │                            │
│                  │  │  Backend  │   │                            │
│                  │  │ :5000     │   │                            │
│                  │  └─────┬─────┘   │                            │
│                  │        │         │                            │
│                  │  ┌─────▼─────┐   │                            │
│                  │  │  React    │   │                            │
│                  │  │ Frontend  │   │                            │
│                  │  │ :3000     │   │                            │
│                  │  └───────────┘   │                            │
│                  └──────────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Repository Structure

```text
sentinel-ndr/
│
├── README.md
├── .env.example
├── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Devices.jsx
│   │   │   ├── DeviceDrillDown.jsx
│   │   │   ├── Alerts.jsx
│   │   │   ├── AlertDetail.jsx
│   │   │   ├── Threats.jsx
│   │   │   ├── Baseline.jsx
│   │   │   └── Settings.jsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── TopNav.jsx
│   │   │   ├── ui/
│   │   │   │   ├── HUDCard.jsx
│   │   │   │   ├── ThreatGauge.jsx
│   │   │   │   ├── SeverityBadge.jsx
│   │   │   │   ├── MiniSparkline.jsx
│   │   │   │   └── TerminalPanel.jsx
│   │   │   ├── charts/
│   │   │   │   ├── AnomalyTimeline.jsx
│   │   │   │   ├── FusionScoreBar.jsx
│   │   │   │   ├── DriftTracker.jsx
│   │   │   │   └── TrafficScatter.jsx
│   │   │   └── alerts/
│   │   │       ├── AlertCard.jsx
│   │   │       ├── AttackNarrative.jsx
│   │   │       └── RemediationCentre.jsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.js
│   │   │   ├── useDevices.js
│   │   │   └── useAlerts.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── data/
│   │   │   └── mockData.js
│   │   └── styles/
│   │       └── globals.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── api/
│   ├── sensor/
│   ├── detection/
│   ├── models/
│   ├── database/
│   └── websocket/
│
├── sensor/
│   ├── sentinel_sensor.py
│   └── requirements.txt
│
├── training/
│   ├── train_gmm.py
│   ├── train_kde.py
│   ├── evaluate.py
│   └── datasets/
│       └── README.md
│
└── docs/
    ├── api_spec.md
    └── lab_setup.md
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| React Router | v6 | client-side routing |
| Tailwind CSS | 3 | styling with custom Tron theme |
| Recharts | latest | data visualisation |
| Lucide React | latest | icons |
| Axios | latest | HTTP client |
| Socket.IO Client | latest | real-time alerts |
| Vite | latest | build tool |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11 | backend language |
| Flask | 3.x | REST API framework |
| Flask-SocketIO | latest | WebSocket server |
| Flask-CORS | latest | CORS |
| Scapy | latest | packet capture |
| scikit-learn | latest | GMM + KDE |
| statsmodels | latest | LOWESS regression |
| NumPy | latest | numerical computation |
| Pandas | latest | flow data processing |
| SQLite | built-in | storage |
| Joblib | latest | model serialization |

### Infrastructure
| Component | Detail |
|---|---|
| Network | Windows Mobile Hotspot — 192.168.137.0/24 |
| Sensor | Single Scapy process on Windows host |
| VM Hypervisor | VirtualBox or VMware bridged adapter |
| Database | SQLite file |
| Dev environment | VS Code, Python venv, Node via nvm |

---

## Machine Learning Architecture — The HDT Algorithm

SENTINEL does NOT use pre-trained general models.
All models are trained from scratch on the local network's own traffic.

### 4 Detection Layers

```text
Raw Network Traffic
        │
        ▼
Feature Engineer
        │
        ▼
LAYER 1: GMM (Adaptive Baseline)
        │
        ▼
LAYER 2: KDE (Global Density)
        │
        ▼
LAYER 3: LOWESS (Temporal Trend)
        │
        ▼
LAYER 4: FUSION (HDT Engine)
score = (0.25×GMM) + (0.35×KDE) + (0.40×LOWESS)
threshold > 0.65 => alert
```

### Training Approach
- 72 hours clean traffic per device for cold start.
- LOWESS runs continuously on rolling windows.
- Models are serialized with joblib.
- Retraining endpoint: POST /api/baseline/retrain.

---

## Database Schema (SQLite)

The detailed schema is documented in docs/api_spec.md and backend/database/schema.sql.

---

## REST API Endpoints

- GET /api/metrics
- GET /api/devices
- GET /api/devices/:id
- GET /api/devices/:id/flows
- GET /api/alerts
- GET /api/alerts/:id
- POST /api/alerts/:id/remediate
- GET /api/threats
- GET /api/baseline/status
- POST /api/baseline/retrain
- POST /api/ingest

WebSocket events:
- alert:new
- score:update
- device:status

---

## Development Phases

1. Phase 1: Frontend prototype with mock data.
2. Phase 2: Backend + sensor integration.
3. Phase 3: HDT detection engine wiring.
4. Phase 4: Controlled testbed evaluation.
5. Phase 5: Thesis write-up and performance evidence.

---

## Getting Started (Phase 1)

1. Scaffold React + Vite + Tailwind + React Router.
2. Add Tron design tokens.
3. Build reusable UI components.
4. Build layout shell.
5. Build pages with mock data.
6. Wire routes.
7. Add animation and final polish.

Do not connect to backend yet. Use mockData.js only.

---

## Important Design Decisions

- SQLite over PostgreSQL for zero-setup Windows development.
- No pre-trained ML models.
- LOWESS weighted highest (0.40) in fusion.
- Single host sensor architecture.
- Flask-SocketIO for real-time updates.
- Vite for faster DX on Windows.

---

SENTINEL NDR — Engineered to see what others miss.
University of Zimbabwe — BSc Computer Engineering Honours 2026.
