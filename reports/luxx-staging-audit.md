# Luxx Staging Audit

Generated: 2026-06-05 19:46:17 -05:00

Target site: https://luxx-staging.vercel.app

## Summary

Unlighthouse was attempted first, but it did not complete cleanly within the bounded run. It also audited the preview acknowledgement modal instead of the actual pages, because fresh browser storage did not contain `luxx-demo-preview-acknowledged=true`.

The usable scores below come from Lighthouse CLI fallback runs using a seeded Chrome profile with that localStorage acknowledgement set. This means the fallback audits tested the real staging pages, not the preview gate.

## Tested URLs

| Route | URL | Result |
| --- | --- | --- |
| Homepage | https://luxx-staging.vercel.app/ | Loaded |
| Fleet | https://luxx-staging.vercel.app/cars-listing | Loaded |
| Tour cars | https://luxx-staging.vercel.app/tours/cars | Loaded |
| Yachts | https://luxx-staging.vercel.app/yachts | Loaded |
| Villas | https://luxx-staging.vercel.app/villas | Failed with HTTP 500 during audit; follow-up redirect to `/houses` added after the run |
| Car detail with tier | https://luxx-staging.vercel.app/cars/ferrari-812-superfast-2?tier=3-day&days=3&rate=2155 | Loaded |

## Lighthouse Scores

Desktop preset, seeded browser profile, JSON outputs in `reports/lighthouse-fallback/`.

| Page | Perf | A11y | Best | SEO | FCP | LCP | TBT | CLS | Notes |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| Homepage | 94 | 93 | 100 | 69 | 0.5s | 1.4s | 20ms | 0.013 | SEO reduced by noindex, which is intentional for staging. |
| Fleet | 98 | 94 | 96 | 69 | 0.5s | 0.8s | 70ms | 0 | One console/network 404 was logged. |
| Tour cars | 90 | 97 | 100 | 69 | 0.5s | 2.0s | 40ms | 0 | Good lab score; separate data issue still exists for passenger counts if staging API uses fallback data. |
| Yachts | 99 | 91 | 100 | 69 | 0.4s | 0.8s | 20ms | 0 | Good lab score; visual QA still needs image coverage check. |
| Villas | 0 | 0 | 0 | 0 | n/a | n/a | n/a | n/a | Lighthouse could not audit because the page returned HTTP 500 before the follow-up redirect fix. |
| Car detail tier | 92 | 91 | 100 | 58 | 0.4s | 1.7s | 50ms | 0 | Meta description missing; noindex also reduces SEO. |

## Top Findings

1. `/villas` was the only demo-critical route that hard-failed during the audit. `Invoke-WebRequest` returned HTTP 500, and Lighthouse reported `ERRORED_DOCUMENT_REQUEST`; a follow-up redirect to `/houses` has been added after the audit run.
2. The public preview gate blocks naive automation. Audits need a seeded browser profile or a safe audit bypass, otherwise scanners measure the acknowledgement modal instead of the actual site.
3. SEO scores are low mostly because staging is intentionally blocked from indexing. That is expected and desirable for a private demo, but the car detail page is also missing a meta description.
4. Accessibility cleanup remains: visible-label/accessibility-name mismatches, unlabeled selects/form elements, heading-order issues, and a few color contrast misses.
5. Fleet logged one 404 network/console error. It did not hurt the performance score much, but it should be resolved before calling the page polished.

## Immediate Recommendations For Tonight

1. Redeploy and re-check `/villas` so the new redirect to `/houses` is live.
2. Keep noindex in place and explain that SEO score is intentionally capped on staging.
3. Resolve the fleet 404 and verify the affected asset/request in browser dev tools.
4. Add missing accessible names/labels to demo controls, filters, icon buttons, and selects.
5. If performance is discussed, use the seeded Lighthouse fallback scores, not the partial Unlighthouse run.

## Commands Used

Route status probe:

```powershell
$urls = @(
  'https://luxx-staging.vercel.app/',
  'https://luxx-staging.vercel.app/cars-listing',
  'https://luxx-staging.vercel.app/tours/cars',
  'https://luxx-staging.vercel.app/yachts',
  'https://luxx-staging.vercel.app/villas',
  'https://luxx-staging.vercel.app/cars/ferrari-812-superfast-2?tier=3-day&days=3&rate=2155'
)
foreach ($u in $urls) {
  Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 25 -MaximumRedirection 5
}
```

Unlighthouse attempt:

```powershell
pnpm dlx unlighthouse --site https://luxx-staging.vercel.app --urls '/,/cars-listing,/tours/cars,/yachts,/villas,/cars/ferrari-812-superfast-2?tier=3-day&days=3&rate=2155' --desktop --samples 1 --disable-robots-txt --disable-sitemap --output-path reports/unlighthouse-desktop --no-cache
```

Result: timed out after roughly 184 seconds. Partial report assets were written under `reports/unlighthouse-desktop/luxx-staging.vercel.app/7040/`, but screenshots confirmed the preview acknowledgement modal was being audited, so those scores were not used as the official audit result.

Preview acknowledgement seed:

```powershell
node -e "const puppeteer=require('puppeteer');const path=require('path');(async()=>{const profile=path.resolve('reports/lighthouse-profile');const executablePath='C:/Program Files/Google/Chrome/Application/chrome.exe';const browser=await puppeteer.launch({headless:true,executablePath,userDataDir:profile,args:['--no-sandbox','--disable-gpu','--no-first-run','--no-default-browser-check']});const page=await browser.newPage();await page.goto('https://luxx-staging.vercel.app/',{waitUntil:'domcontentloaded',timeout:30000});await page.evaluate(()=>localStorage.setItem('luxx-demo-preview-acknowledged','true'));await page.goto('https://luxx-staging.vercel.app/cars-listing',{waitUntil:'networkidle2',timeout:60000});await page.screenshot({path:'reports/lighthouse-seeded-browser-check.png',fullPage:false});await browser.close();})()"
```

Lighthouse fallback command template:

```powershell
pnpm dlx lighthouse '<URL>' --preset=desktop --output=json --output-path='reports/lighthouse-fallback/<name>.json' --chrome-flags="--headless=new --no-sandbox --disable-gpu --user-data-dir=<repo>\reports\lighthouse-profile" --disable-storage-reset --quiet
```

Fallback output files:

| Page | JSON |
| --- | --- |
| Homepage | `reports/lighthouse-fallback/home.json` |
| Fleet | `reports/lighthouse-fallback/cars-listing.json` |
| Tour cars | `reports/lighthouse-fallback/tours-cars.json` |
| Yachts | `reports/lighthouse-fallback/yachts.json` |
| Villas | `reports/lighthouse-fallback/villas.json` |
| Car detail tier | `reports/lighthouse-fallback/car-detail-tier.json` |

Note: the Lighthouse CLI printed Windows temp-folder cleanup errors on two runs, but the JSON files were still written. The `/villas` JSON contains the real page-load failure: HTTP 500.
