# Migration Plan: Angular 19 → 20

## Scope

- Source: Angular 19.x
- Target: Angular 20.x
- Goal: Complete the single-version migration reliably with clear validation gates and rollback strategy.

## Phases

### Phase 0 — Prepare
- Create a git checkpoint: `git commit -m "chore: pre-migration checkpoint (v19)"` and tag `v19-stable`.
- Ensure working tree is clean.
- Stop dev servers and close editors that may lock files (Windows-specific precaution).

### Phase 1 — Dependency Updates
- Run:
```bash
ng update @angular/core@20 @angular/cli@20 --allow-dirty --force
npm install
```
- Update TypeScript if required (follow Angular 20 recommendations).

### Phase 2 — Configuration
- Update `tsconfig.json` settings if needed according to Angular 20 guidance.
- Ensure `angular.json` builders are compatible with updated `@angular-devkit/build-angular`.

### Phase 3 — Code Fixes
- Search for polling/timer patterns (`setInterval`, `setTimeout`) and add `ChangeDetectorRef.markForCheck()` where mutations occur outside Angular's zone.
- Fix bootstrap mismatches: choose standalone `bootstrapApplication()` or proper `NgModule` bootstrap consistently.
- Address any deprecated/removed APIs flagged by `ng update` or build warnings.

### Phase 4 — Validation Gates
- Run `ng build` (dev), `ng build --configuration production`.
- Run targeted unit tests for changed components first (dashboard, resource monitor), then run full test suite.
- Run smoke tests in browser; verify live updates for polling components.
- Validate key runtime scenarios and check browser console for critical errors.

### Phase 5 — Checkpoint & Publish
- On success: commit changes with message `chore: complete Angular v20 migration`.
- Tag `v20-stable` and push tags:
```bash
git tag -a v20-stable -m "Angular v20 stable"
git push origin main --tags
```

## Rollback
- If any gate fails, run:
```bash
git reset --hard v19-stable
npx rimraf node_modules package-lock.json
npm install
```

## Success Criteria
- Builds and tests pass.
- Live polling components update correctly in the browser.
- No critical console errors.

## Notes
- Keep changes minimal and commit often to create clear checkpoints.
- On Windows, prefer `npx rimraf` for removing `node_modules` if `Remove-Item` fails.

## Non-interactive Execution (Windows PowerShell)

A prepared PowerShell script exists to run this migration end-to-end with minimal interaction:

- Script: `scripts/migrate_v19_to_v20.ps1`
- npm script: `npm run migrate:v19-to-v20` (invokes the PowerShell script on Windows)

Execution steps (review before running):
```powershell
# preview changes (optional)
git status --short

# run migration (creates tags locally, does not push)
npm run migrate:v19-to-v20
```

Important: The script performs `ng update` with `--allow-dirty --force` and will attempt commits/tags locally. Review `report/implementation_log.md` after running; do not push until you validate build and tests.
