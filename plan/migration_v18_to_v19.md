# Migration Plan: Angular 18 → 19

## Scope

- Source: Angular 18.x
- Target: Angular 19.x
- Goal: Complete the single-version migration reliably with clear validation gates and rollback strategy.

## Phases

### Phase 0 — Prepare
- Create a git checkpoint: `git commit -m "chore: pre-migration checkpoint (v18)"` and tag `v18-stable`.
- Ensure working tree is clean.
- Stop dev servers and close editors that may lock files (Windows-specific precaution).

### Phase 1 — Dependency Updates
- Run:
```bash
ng update @angular/core@19 @angular/cli@19 --allow-dirty --force
npm install
```
- Update TypeScript if required (follow Angular 19 recommendations).

### Phase 2 — Configuration
- Update `tsconfig.json` settings if needed (e.g., `moduleResolution: "bundler"` or per Angular 19 guidance).
- Ensure `angular.json` builders are compatible with updated `@angular-devkit/build-angular`.

### Phase 3 — Code Fixes
- Search for polling/timer patterns (`setInterval`, `setTimeout`) and add `ChangeDetectorRef.markForCheck()` where mutations occur outside Angular's zone.
- Fix bootstrap mismatches: choose standalone `bootstrapApplication()` or proper `NgModule` bootstrap consistently.

### Phase 4 — Validation Gates
- Run `ng build` (dev), `ng build --configuration production`.
- Run targeted unit tests for changed components first (dashboard, resource monitor), then run full test suite.
- Run smoke tests in browser; verify live updates for polling components.

### Phase 5 — Checkpoint & Publish
- On success: commit changes with message `chore: complete Angular v19 migration`.
- Tag `v19-stable` and push tags:
```bash
git tag -a v19-stable -m "Angular v19 stable"
git push origin main --tags
```

## Rollback
- If any gate fails, run:
```bash
git reset --hard v18-stable
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
