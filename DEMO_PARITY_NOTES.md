# Luxx Staging Demo Parity Notes

Use this file to track differences between the staging demo and the current live Luxx production site. These notes are separate from the animation and UI polish package so client-facing fixes stay clear.

## Production Differences To Raise

- Fleet inventory count: live production currently renders 105 cars on `/cars-listing`; this staging repo fallback data contains 91 cars. This points to a stale fallback export or missing production database connection, not a filter or animation issue.

## Items To Confirm Before Final Handoff

- Confirm whether Vercel should use the production inventory database or a fresh staging export.
- Compare live production car slugs, titles, pricing, and primary images against staging before final launch.
- Reconcile any live-only inventory entries with the staging fallback data if the site will keep fallback mode.
- Keep visual/demo work separate from source-data fixes when presenting scope.
