---
name: Angular Migration Assessment
description: >
  Analyzes an Angular project to assess its readiness for the Angular 18 → 19 migration.
  This skill focuses on identifying legacy patterns, dependency issues, and configuration problems that could block the jump.
  It generates a detailed assessment report that serves as the foundation for the planning phase.

tasks:
  - task: Analyze `package.json` for outdated `@angular/*` packages and third-party dependencies.
    instructions:
      - Read `package.json`.
      - Compare installed versions against the required versions for the Angular 18 → 19 upgrade.
      - Flag any dependencies that are known to be incompatible with Angular 19.
    files:
      - `package.json`

  - task: Audit `angular.json` and `tsconfig.json` for legacy configurations.
    instructions:
      - Scan `angular.json` for outdated builder options and project settings.
      - Check `tsconfig.json` for `moduleResolution` and other settings that need to be updated for modern Angular.
    files:
      - `angular.json`
      - `tsconfig.json`

  - task: Scan core application files for deprecated APIs and patterns.
    instructions:
      - Analyze `main.ts`, `app.module.ts`, and key component files.
      - Identify usage of deprecated APIs that could block the 18 → 19 jump.
      - Look for patterns that need to be refactored for the target version.
    files:
      - `src/main.ts`
      - `src/app/app.module.ts`
      - `src/app/app.component.ts`

  - task: Audit component files for runtime behavior risks relevant to the 18 → 19 jump.
    instructions:
      - Recursively scan all `*.component.ts` files in `src/app/`.
      - Search for patterns that mutate component data after async work or callbacks.
      - For each found pattern, check whether the current code and tests cover the behavior correctly.
      - Document findings in a focused risk section with file paths and line numbers.
      - Example: "dashboard-widgets.component.ts (line 45) updates state inside a timer and should be covered by a targeted test."
    files:
      - `src/app/**/*.component.ts`

  - task: Generate the Assessment Report.
    instructions:
      - Consolidate all findings into a structured Markdown report.
      - The report must include a checklist of all identified issues.
      - Save the report to `report/assessment_report.md`.
    output: `report/assessment_report.md`
---
