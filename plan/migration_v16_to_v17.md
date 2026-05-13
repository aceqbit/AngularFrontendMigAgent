# Angular v16 → v17 Migration Plan

**Status:** Active  
**Target Version:** Angular v17.0.0+  
**Scope:** Single atomic upgrade from v16 to v17 only  

## Executive Summary

This plan covers the complete migration from Angular v16.2.12 to Angular v17. The migration is low-risk due to the project's modern architecture (module-based bootstrapping, strict TypeScript config, modern build tooling).

## Phase 1: Dependency Updates

### Task 1.1: Update Core Angular Packages
- Update all `@angular/*` packages from `~16.2.12` to `~17.0.0`
- Update `@angular-devkit/build-angular` from `~16.2.16` to `~17.0.0`
- Update `@angular/cli` from `~16.2.16` to `~17.0.0`
- Update `typescript` from `~5.1.6` to `~5.2.2`
- Update `zone.js` from `~0.13.3` to `~0.14.2`

**Command:** `ng update @angular/core@17 @angular/cli@17 --allow-dirty --force`

**Validation Gate:**
- `npm install` completes without errors
- No peer dependency conflicts remain
- `ng build` succeeds

**Risk:** Low — Angular provides automated migrations via `ng update`

### Task 1.2: Manual Dependency Review
- Verify `rxjs` remains at `~7.8.x` (compatible with v17)
- Verify `tslib` remains at `^2.3.0` (compatible with v17)
- Check for any third-party library incompatibilities

**Validation:** `npm ls` shows no unresolved peer dependencies

## Phase 2: TypeScript Configuration Updates

### Task 2.1: Update tsconfig.json if Required
- v17 may require `moduleResolution: "bundler"` or keep `"node"` (both work)
- Current config is already modern; minimal changes expected

**Validation:** `ng build` and TypeScript compilation succeed

## Phase 3: Application Code Refactoring

### Task 3.1: Scan for Deprecated APIs
- Scan `src/app` for any deprecated Angular APIs
- Look for:
  - Deprecated `@angular/common` utilities
  - Legacy lifecycle hooks or patterns
  - Non-standalone component patterns (if any)

**Current Status:** Project uses modern patterns; low refactoring risk

**Validation:** No deprecation warnings in build output

## Phase 4: Build Validation

### Task 4.1: Clean Build
- Run `ng build --configuration production`
- Capture all warnings and errors
- Fix any build-blocking issues
- Document CSS budget warnings or other non-blocking issues

**Validation Gate:** Build exits with status 0 and no errors

### Task 4.2: Dev Server Test
- Start dev server: `ng serve`
- Verify app loads and runs without console errors
- Check key features (routing, data binding, event handling)

**Validation Gate:** App serves at `http://localhost:4200` and functions normally

## Phase 5: Unit Testing

### Task 5.1: Run Full Test Suite
- Execute: `npx ng test --watch=false --browsers=ChromeHeadless`
- Capture test results
- Fix any failing tests (if any)

**Validation Gate:** All tests pass (TOTAL: 23 SUCCESS expected)

## Phase 6: Final Validation

### Task 6.1: Lint Check (Optional)
- Run `ng lint` if configured
- Address any lint warnings

### Task 6.2: Visual Verification
- Start dev server again
- Manually verify key UI components render correctly
- Verify no visual regressions

**Validation Gate:** No visual or functional defects observed

## Phase 7: Git Checkpoint

### Task 7.1: Commit Migration
- Stage all changes: `git add -A`
- Commit: `git commit -m "feat: migrate Angular 16 → 17"`
- Tag: `git tag -a v17-stable -m "Angular v17 migration complete"`
- Push: `git push origin main && git push origin v17-stable`

**Validation Gate:** Git push succeeds; tag is visible on remote

## Success Criteria

✓ All `@angular/*` packages at v17.0.0+  
✓ TypeScript at ~5.2.2  
✓ zone.js at ~0.14.2  
✓ `ng build` succeeds with no errors  
✓ All 23 unit tests pass  
✓ Dev server runs without console errors  
✓ Git checkpoint created and pushed  

## Rollback Plan

If migration fails at any phase:
1. Revert to previous git commit: `git reset --hard v16-stable`
2. Clean workspace: `npx rimraf node_modules package-lock.json`
3. Reinstall: `npm install`
4. Investigate root cause and re-attempt

## Notes

- No interactive prompts expected during `ng update` (--force flag ensures automation)
- CSS budget warnings may persist from v16; will be handled separately if needed
- All changes are backward-compatible with existing module architecture

---

**Plan Generated:** 2026-05-13  
**Next Step:** Execute Phase 1 (Dependency Updates)
