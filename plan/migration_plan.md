# Migration Plan: Angular 18 → 19

This repository has been scoped to a focused, atomic migration from Angular 18 to Angular 19.

Purpose: provide a single-version migration plan that is independent, verifiable, and checkpointed.

## Overview

- **Source version:** Angular 18.x
- **Target version:** Angular 19.x
- **Primary goals:** upgrade `@angular/*` packages, update TypeScript/builder settings as required, fix change-detection issues, run validation gates, and create a git checkpoint on success.

## Plan Structure

1. Generate a single atomic plan file: `plan/migration_v18_to_v19.md` (this file).
2. Execute the plan fully: dependency updates, config adjustments, code fixes, validation gates.
3. On success: commit and tag `v19-stable`, push to `origin main`.
4. If validation fails: stop, record failure, and revert to pre-migration checkpoint.

## Validation Gates

- `ng build` (dev and production) succeed.
- `ng test` passes targeted specs and full suite.
- Key runtime behaviors (dashboard metrics, resource monitor) update in real-time.
- No critical console errors in browser runtime.

## Where to find the detailed steps

The detailed, atomic migration steps are in [plan/migration_v18_to_v19.md](migration_v18_to_v19.md).

## Post-Migration

- Commit message: `chore: complete Angular v19 migration`
- Tag: `v19-stable`
- Push: `git push origin main --follow-tags`

This master plan is intentionally minimal — the actionable checklist and file-by-file tasks live in the per-version plan above.
