---
name: Angular Migration Assessment
description: >
  Analyzes an Angular project to assess its readiness for the Angular 19→20 migration only.
  This skill focuses on identifying legacy patterns, dependency issues, and configuration problems that could block that migration.
  It generates a detailed assessment report that serves as the foundation for the planning phase.

tasks:
  - task: Analyze `package.json` for outdated `@angular/*` packages and third-party dependencies.
    instructions:
      - Read `package.json`.
      - Compare installed versions against the required versions for the v19→v20 step.
      - Flag any dependencies that are known to be incompatible with target Angular versions.
    files:
      - `package.json`

  - task: Audit `angular.json` and `tsconfig.json` for legacy configurations.
    instructions:
      - Scan `angular.json` for outdated builder options and project settings.
      - Check `tsconfig.json` for `moduleResolution` and other settings that need to be updated for the target Angular 20 release.
    files:
      - `angular.json`
      - `tsconfig.json`

  - task: Scan core application files for deprecated APIs and patterns.
    instructions:
      - Analyze `main.ts`, `app.module.ts`, and key component files.
      - Identify usage of deprecated APIs that will block the v19→v20 migration.
      - Look for patterns that need to be refactored (e.g., non-standalone components).
    files:
      - `src/main.ts`
      - `src/app/app.module.ts`
      - `src/app/app.component.ts`

  - task: Audit all component files for zone/change detection risks.
    instructions:
      - Recursively scan all `*.component.ts` files in `src/app/`.
      - Search for patterns: `setInterval()`, `setTimeout()`, direct event handlers, browser APIs with callbacks.
      - For each found pattern, check if the component:
        1. Calls `ChangeDetectorRef.markForCheck()` after mutations, OR
        2. Uses `NgZone.run()` to wrap mutations, OR
        3. Uses proper RxJS subscriptions with Angular's zone management
      - If NONE of these are present, flag as a **runtime risk for the target migration**.
      - Document findings in a "Zone/Change Detection Risks" section with file paths and line numbers.
      - Example: "dashboard-widgets.component.ts (line 45) uses setInterval() but does not call markForCheck() — CRITICAL FIX NEEDED"
    files:
      - `src/app/**/*.component.ts`

  - task: Generate the Assessment Report.
    instructions:
      - Consolidate all findings into a structured Markdown report.
      - The report must include a checklist of all identified issues.
      - Save the report to `report/assessment_report.md`.
    output: `report/assessment_report.md`
---
