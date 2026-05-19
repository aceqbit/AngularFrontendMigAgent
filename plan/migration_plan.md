# Migration Plan: Angular 20 → 21

This repository has been scoped to a focused, atomic migration from Angular 20 to Angular 21.

Purpose: provide a single-version migration plan that is independent, verifiable, and checkpointed.

## Overview

- **Source version:** Angular 20.x
- **Target version:** Angular 21.x
- **Primary goals:** upgrade `@angular/*` packages, update TypeScript/builder settings as required, fix change-detection issues, run validation gates, and create a git checkpoint on success.

## Plan Structure

1. Generate a single atomic plan file: `plan/migration_v20_to_v21.md` (this file).
2. Execute the plan fully: dependency updates, config adjustments, code fixes, validation gates.
3. On success: commit and tag `v21-stable`, push to `origin main`.
4. If validation fails: stop, record failure, and revert to pre-migration checkpoint.

## Validation Gates

- `ng build` (dev and production) succeed.
- `ng test` passes targeted specs and full suite.
- Key runtime behaviors (dashboard metrics, resource monitor) update in real-time.
- No critical console errors in browser runtime.

## Where to find the detailed steps

The detailed, atomic migration steps are in [plan/migration_v20_to_v21.md](migration_v20_to_v21.md).

## Post-Migration

- Commit message: `chore: complete Angular v21 migration`
- Tag: `v21-stable`
- Push: `git push origin main --follow-tags`

This master plan is intentionally minimal — the actionable checklist and file-by-file tasks live in the per-version plan above.
