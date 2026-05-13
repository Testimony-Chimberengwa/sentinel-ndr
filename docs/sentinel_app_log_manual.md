# Sentinel NDR App Log and Manual

This file is the working log, feature history, and usage guide for the Sentinel NDR application.

Use this file as the source of truth when changing the app:
- Before adding or removing a feature, update this file first or in the same change.
- Record what changed, where it changed, and why it changed.
- Keep the log concise, factual, and current.
- If a feature is reverted, remove or mark the previous note so the history stays accurate.

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
