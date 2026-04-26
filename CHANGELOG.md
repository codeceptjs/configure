4.0.0-beta.3

* `setCommonPlugins` now registers `browser` and `aiTrace` as discoverable plugins (not enabled by default — activate via `-p <name>` on the CLI or `enabled: true` in user config). `tryTo`/`retryTo` are no longer added; in 4.x they are imported from `codeceptjs/effects`.

4.0.0

* ESM-only release targeting CodeceptJS 4.x. Convert package + all hooks + bridge to native ESM (`type: module`).
* Added `setBrowserConfig({ browser, show, windowSize, ... })` — universal helper that dispatches options through the right primitive (so Puppeteer gets `product`, Playwright gets `browser`, WebDriver gets `--headless` chrome args, etc.) and shallow-merges any extra keys onto every browser helper.
* Fix Config singleton sharing: bridge now imports `codeceptjs` via ESM, so hooks register on the host's Config instance instead of a stale CJS-resolved copy.
* Mark the `codeceptjs` peer dependency as optional so npm doesn't pull a parallel 3.x copy alongside a 4.x host.
* Drop the `tryTo` / `retryTo` plugin enable in `setCommonPlugins` — in CodeceptJS 4 those are imported from `codeceptjs/effects`, not enabled as plugins.
* Tests rewritten on Node's built-in `node:test` + `node:assert` (no jest).
* Engines: Node >=18.

0.8.0

* Added `setCommonPlugins` hook

0.7.0

* Added `setTestHost` hook
* Added support for firefox for WebDriver in `setHeadlessWhen` hook

0.6.0

* Added `setBrowser` hook
* Added try/catch block when taking cookie for `setSharedCookie`
* CodeceptJS 3 compatibility
