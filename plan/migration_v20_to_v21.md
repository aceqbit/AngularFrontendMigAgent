# Migration Plan: Angular 20 → 21

## Scope

- Source: Angular 20.x
- Target: Angular 21.x
- Goal: Complete the single-version migration reliably with clear validation gates and rollback strategy.

## Phases

### Phase 0 — Prepare
- Create a git checkpoint: `git commit -m "chore: pre-migration checkpoint (v20)"` and tag `v20-stable`.
- Ensure working tree is clean.
- Stop dev servers and close editors that may lock files on Windows.

### Phase 1 — Dependency Updates
- Run:
```bash
ng update @angular/core@21 @angular/cli@21 --allow-dirty --force
npm install
```
- Update TypeScript to the version required by Angular 21.

### Phase 2 — Configuration
- Update `tsconfig.json` settings for Angular 21 guidance.
- Ensure `angular.json` builders are compatible with updated `@angular-devkit/build-angular`.

### Phase 3 — Code Fixes
- Search for polling/timer patterns (`setInterval`, `setTimeout`) and add `ChangeDetectorRef.markForCheck()` where mutations occur outside Angular's zone.
- Fix bootstrap mismatches: choose standalone `bootstrapApplication()` or proper `NgModule` bootstrap consistently.
- Address any deprecated/removed APIs flagged by `ng update` or build warnings.

### Phase 4 — Validation Gates
- Run `ng build` (dev), `ng build --configuration production`.
- Run targeted unit tests for changed components first, then run full test suite.
- Run smoke tests in browser; verify live updates for polling components.
- Validate key runtime scenarios and check browser console for critical errors.

### Phase 5 — Checkpoint & Publish
- On success: commit changes with message `chore: complete Angular v21 migration`.
- Tag `v21-stable` and push tags:
```bash
git tag -a v21-stable -m "Angular v21 stable"
git push origin main --tags
```

## Rollback
- If any gate fails, run:
```bash
git reset --hard v20-stable
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
