# Sentinel NDR App Log and Manual

This file is the working log, feature history, and usage guide for the Sentinel NDR application.

Use this file as the source of truth when changing the app:
- Before adding or removing a feature, update this file first or in the same change.
- Before changing even a single line of code, update this file in the same work.
- Record what changed, where it changed, and why it changed.
- Keep the log concise, factual, and current.
- If a feature is reverted, remove or mark the previous note so the history stays accurate.
- Any Copilot or AI-assisted edit should treat this file as mandatory context and must update it whenever it writes code, no matter how small the edit is.

## Current Product Direction

- Sentinel NDR keeps its Tron / cyberpunk identity.
- UI changes should stay consistent with the existing dashboard, routing, and data flow.
- Preserve Orbitron for headings and JetBrains Mono or IBM Plex Mono for data when available in the app.
- Preserve scan-line overlays, animated grid background, and the existing page/component structure.

## Current Implementation Notes

- Frontend lives in `frontend/`.
- Main UI styling uses Tailwind plus shared globals in `frontend/src/styles/globals.css`.
- Reusable dashboard card shell is `frontend/src/components/ui/HUDCard.jsx`.
- Sidebar navigation is in `frontend/src/components/layout/Sidebar.jsx`.
- Gauge/score display component is `frontend/src/components/ui/ThreatGauge.jsx`.

## Feature Log

### 2026-05-14

- Added a new `frontend/src/pages/Models.jsx` route at `/models` for HDT detection engine health, layer scores, attack profile performance, baseline health, and model breach tracking.
- Added shared model-health UI patterns for layer toggles, device retrain actions, breach acknowledgements, and model-defeat tracking.

- Upgraded the `/threats` page into a split-panel investigation workspace in `frontend/src/pages/Threats.jsx` with an alert feed, selected alert workspace, timeline feed, response drawer, and pattern-of-life heatmap.
- Added shared alert investigation state in `frontend/src/context/AlertsContext.jsx` and wired it through `frontend/src/main.jsx` so alerts now support OPEN, INVESTIGATING, CONCLUDED, and CLOSED workflow states.
- Updated `frontend/src/pages/Alerts.jsx`, `frontend/src/components/alerts/AlertCard.jsx`, and `frontend/src/pages/AlertDetail.jsx` to surface investigation status, notes, acknowledge/investigate controls, and conclusion actions.
- Extended `frontend/src/context/ResponseActionsContext.jsx` so false-positive conclusions can reverse all actions triggered by a given alert.
- Added `frontend/src/components/alerts/AlertInvestigationPanel.jsx` and `frontend/src/components/charts/PatternOfLifeHeatmap.jsx` for reusable investigation detail and heatmap display.
- Updated `frontend/src/data/mockData.js` with richer event metadata and a 02:00-04:00 daily pattern for VM-TEST-EXFIL.
- Built and validated the frontend after the changes.

### 2026-05-13

- Added GX-inspired visual exploration to the frontend, then reverted it back toward the original Tron style after review.
- Updated `frontend/tailwind.config.js` with temporary GX color tokens during the exploration.
- Updated `frontend/src/styles/globals.css` with temporary octagon, circuit trace, and toggle helpers during the exploration.
- Updated `frontend/src/components/ui/HUDCard.jsx` with temporary circuit trace overlays during the exploration.
- Updated `frontend/src/components/layout/Sidebar.jsx` with temporary collapsed GX sidebar behavior during the exploration.
- Updated `frontend/src/components/ui/ThreatGauge.jsx` with a temporary SVG gauge experiment during the exploration.
- Committed the current UI state to Git after the review-driven revert.
- Replaced the default browser favicon with a custom Sentinel shield icon in `frontend/public/favicon.svg`.
- Kept the favicon simple and high-contrast so it reads clearly in browser tabs and shortcuts.
- Added a full response action lifecycle feature with new page `frontend/src/pages/ResponseActions.jsx` at route `/response-actions`.
- Added shared lifecycle state provider in `frontend/src/context/ResponseActionsContext.jsx` and hook `frontend/src/hooks/useResponseActions.js`.
- Added top-level route integration in `frontend/src/App.jsx` and provider wiring in `frontend/src/main.jsx`.
- Added sidebar navigation link for Response Centre in `frontend/src/components/layout/Sidebar.jsx`.
- Integrated `frontend/src/components/alerts/RemediationCentre.jsx` so `QUARANTINE NOW` and `BLOCK IP` create `PENDING` actions and redirect to `/response-actions`.
- Integrated `frontend/src/pages/AlertDetail.jsx` to pass alert/device context into remediation actions.
- Integrated `frontend/src/pages/Devices.jsx` to show `ACTIONS ACTIVE: N` badges per device with links to filtered response actions.
- Integrated `frontend/src/pages/Dashboard.jsx` with a fifth metric card: `Active Enforced Actions`.
- Added action history CSV export, reversal confirmation modal with required reason, extend-by-24h handling, and automatic expiry state handling.
- Added explicit per-card device state display (`QUARANTINED` / `UNQUARANTINED`) that updates after reversal.

## Change Log Template

Use this format for every future change:

- Date:
- Feature added / removed / revised:
- Files changed:
- Reason:
- Notes:

## Maintenance Rules

- Do not let this file drift from the codebase.
- If a component, page, style token, or behavior changes, update this file in the same work.
- Keep entries short enough that the file can be reviewed quickly before making changes.
- Treat this file as a human-readable manual for future maintenance and feature work.
