# Angular v17 → v18 Migration Plan (ATOMIC)

**Plan Scope:** Angular 17.3.12 → 18.0.0  
**Generated:** May 17, 2026  
**Duration Estimate:** 2-3 hours (autonomous agent execution)  
**Risk Level:** 🔴 HIGH (2 CRITICAL change detection fixes required)  
**Checkpoint Tag:** `v18-stable`  
**Next Plan:** Upon success, proceed to `plan/migration_v18_to_v19.md`

---

## Executive Summary

This plan covers **ONLY** the v17 → v18 migration. It is **ATOMIC** — no cross-version dependencies. All tasks, validation gates, and rollback procedures are contained within this version transition.

**Critical Blocker:** Two components use `setInterval()` with data mutations **without explicit change detection triggers**. This is a breaking behavioral change in Angular 18. Without fixes, the UI will appear frozen despite updates running in memory.

---

## Pre-Migration State Validation

**Assumption:** Repository is at a stable, committed state with all v17 tests passing.

**Verification:**
```bash
# Confirm current state
git status                    # Should show "nothing to commit"
ng version                    # Should show @angular/core: 17.3.12
npm list @angular/core        # Verify v17 installed
```

---

## PHASE 1: Dependency Updates

**Objective:** Update all Angular packages and related dependencies from v17 to v18.

### Task 1.1: Update Angular Core & CLI to v18

**Command:**
```bash
ng update @angular/core@18 @angular/cli@18 --allow-dirty --force
```

**Expected Duration:** 5-10 minutes

**What This Does:**
- Updates all `@angular/*` packages (core, common, forms, router, etc.) to 18.0.0
- Updates `@angular-devkit/build-angular` to 18.0.0
- Automatically updates `package.json`
- May prompt for optional migrations (auto-select recommended/default)

**Expected Changes to package.json:**
```json
{
  "@angular/animations": "~18.0.0",
  "@angular/common": "~18.0.0",
  "@angular/compiler": "~18.0.0",
  "@angular/core": "~18.0.0",
  "@angular/forms": "~18.0.0",
  "@angular/platform-browser": "~18.0.0",
  "@angular/platform-browser-dynamic": "~18.0.0",
  "@angular/router": "~18.0.0",
  "@angular-devkit/build-angular": "~18.0.0",
  "@angular/cli": "~18.0.0",
  "@angular/compiler-cli": "~18.0.0"
}
```

**Validation:**
- [ ] Command completes without errors
- [ ] `package.json` versions updated to ~18.0.0
- [ ] No "peer dependency" errors (acceptable: zone.js version mismatch, will fix in Task 1.2)

---

### Task 1.2: Update TypeScript to 5.6.x

**Reason:** Angular 18 requires TypeScript 5.6.x (current: 5.4.5)

**Command:**
```bash
npm install typescript@5.6.2 --save-dev
```

**Expected Duration:** 2 minutes

**What This Does:**
- Updates TypeScript compiler to 5.6.2
- Enables new compiler features required by Angular 18

**Validation:**
- [ ] Command completes
- [ ] `npm list typescript` shows 5.6.2

---

### Task 1.3: Update zone.js to 0.15.x

**Reason:** Angular 18 requires zone.js 0.15.x (current: 0.14.10)

**Command:**
```bash
npm install zone.js@0.15.0
```

**Expected Duration:** 2 minutes

**What This Does:**
- Updates zone.js to 0.15.0 for Angular 18 compatibility
- Ensures proper zone handling for change detection

**Validation:**
- [ ] Command completes
- [ ] `npm list zone.js` shows 0.15.0

---

### Task 1.4: Clean Install of node_modules

**Reason:** Ensures all transitive dependencies are correct for v18

**Commands (Windows PowerShell):**
```powershell
# Stop any running processes (safety measure)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process ng -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean deletion
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Fresh install
npm install
```

**Expected Duration:** 3-5 minutes

**What This Does:**
- Removes corrupted or stale `node_modules`
- Removes `package-lock.json` to force fresh resolution
- Installs all dependencies cleanly

**Validation:**
- [ ] `npm install` completes without errors
- [ ] No peer dependency warnings (acceptable: only if they don't block build)
- [ ] `node_modules` exists and contains all packages

---

### Task 1.5: Verify Dependency State

**Commands:**
```bash
ng version
npm list @angular/core
npm list typescript
npm list zone.js
```

**Expected Output:**
```
@angular/core@18.0.0
typescript@5.6.2
zone.js@0.15.0
```

**Validation:**
- [ ] Angular version shows 18.0.0
- [ ] TypeScript shows 5.6.2
- [ ] zone.js shows 0.15.0

---

## PHASE 2: TypeScript Configuration Updates

**Objective:** Update `tsconfig.json` for v18 compatibility.

### Task 2.1: Update moduleResolution to "bundler"

**File:** `tsconfig.json`  
**Line:** Search for `"moduleResolution"`

**Current Code (lines ~10-20):**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "strict": true,
    ...
```

**Required Change:**
Change `"moduleResolution": "node"` to `"moduleResolution": "bundler"`

**Updated Code:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    ...
```

**Reason:** Angular 18 optimizes for modern bundlers (Webpack, esbuild). The `bundler` setting aligns with v18's expectations.

**Validation:**
- [ ] File saved
- [ ] `tsc --noEmit` runs without errors

---

### Task 2.2: Verify Other TypeScript Settings

**File:** `tsconfig.json`

**Verify the following are present (no changes needed):**
```json
{
  "compilerOptions": {
    "target": "ES2022",           ✅ Compatible
    "module": "ES2022",           ✅ Compatible
    "strict": true,               ✅ Compatible
    "noImplicitOverride": true,   ✅ Compatible
    "experimentalDecorators": true, ✅ Compatible
    "useDefineForClassFields": false ✅ Compatible
  }
}
```

**Validation:**
- [ ] All settings confirmed to exist or are acceptable defaults

---

## PHASE 3: Change Detection Fixes (CRITICAL)

**Objective:** Fix 2 components with broken change detection patterns that will cause frozen UIs in v18.

**Critical Issue:** Both components use `setInterval()` with data mutations but lack explicit change detection triggers. Angular 18 does NOT automatically detect mutations from native APIs like `setInterval()`.

---

### Task 3.1: Fix dashboard-widgets.component.ts

**File:** `src/app/components/dashboard-widgets/dashboard-widgets.component.ts`

**Step 1: Add ChangeDetectorRef import (line 1)**

Current (lines 1-5):
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
```

Change to (add `ChangeDetectorRef` to imports):
```typescript
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
```

**Step 2: Inject ChangeDetectorRef into constructor**

Find the constructor (approximately line 20-30):

Current:
```typescript
export class DashboardWidgetsComponent implements OnInit, OnDestroy {
  metrics: WidgetMetric[] = [];
  intervalId: any;

  constructor() { }
```

Change to:
```typescript
export class DashboardWidgetsComponent implements OnInit, OnDestroy {
  metrics: WidgetMetric[] = [];
  intervalId: any;

  constructor(private cdr: ChangeDetectorRef) { }
```

**Step 3: Add markForCheck() in startPolling() method**

Find `startPolling()` method (approximately line 40-55):

Current:
```typescript
startPolling() {
  this.intervalId = setInterval(() => {
    this.metrics.forEach(m => {
      const newValue = Math.random() * 100;
      m.trend = newValue > m.value ? 'up' : (newValue < m.value ? 'down' : 'stable');
      m.value = newValue;
      m.history.push(newValue);
      if (m.history.length > 20) m.history.shift();
    });
  }, 1000);
}
```

Change to (add `this.cdr.markForCheck();` INSIDE the setInterval callback, after mutations):
```typescript
startPolling() {
  this.intervalId = setInterval(() => {
    this.metrics.forEach(m => {
      const newValue = Math.random() * 100;
      m.trend = newValue > m.value ? 'up' : (newValue < m.value ? 'down' : 'stable');
      m.value = newValue;
      m.history.push(newValue);
      if (m.history.length > 20) m.history.shift();
    });
    // ← ADD THIS LINE:
    this.cdr.markForCheck();
  }, 1000);
}
```

**Validation:**
- [ ] ChangeDetectorRef imported correctly
- [ ] Constructor injection added
- [ ] `markForCheck()` call present in setInterval callback after mutations
- [ ] File saved

---

### Task 3.2: Fix resource-monitor.component.ts

**File:** `src/app/components/resource-monitor/resource-monitor.component.ts`

**Step 1: Add ChangeDetectorRef import (line 1)**

Current (lines 1-5):
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
```

Change to:
```typescript
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
```

**Step 2: Inject ChangeDetectorRef into constructor**

Find the constructor (approximately line 20-30):

Current:
```typescript
export class ResourceMonitorComponent implements OnInit, OnDestroy {
  nodes: ResourceNode[] = [];
  intervalId: any;

  constructor() { }
```

Change to:
```typescript
export class ResourceMonitorComponent implements OnInit, OnDestroy {
  nodes: ResourceNode[] = [];
  intervalId: any;

  constructor(private cdr: ChangeDetectorRef) { }
```

**Step 3: Add markForCheck() in startSimulation() method**

Find `startSimulation()` method (approximately line 40-60):

Current:
```typescript
startSimulation() {
  this.intervalId = setInterval(() => {
    this.nodes.forEach(node => {
      node.load = Math.min(100, Math.max(0, node.load + (Math.random() * 20 - 10)));
      node.memory = Math.min(64, Math.max(2, node.memory + (Math.random() * 4 - 2)));
      node.uptime += 1;
      
      if (node.load > 90) node.status = 'error';
      else if (node.load > 75) node.status = 'warning';
      else if (node.load < 5) node.status = 'idle';
      else node.status = 'active';
    });
  }, 1500);
}
```

Change to (add `this.cdr.markForCheck();` after mutations):
```typescript
startSimulation() {
  this.intervalId = setInterval(() => {
    this.nodes.forEach(node => {
      node.load = Math.min(100, Math.max(0, node.load + (Math.random() * 20 - 10)));
      node.memory = Math.min(64, Math.max(2, node.memory + (Math.random() * 4 - 2)));
      node.uptime += 1;
      
      if (node.load > 90) node.status = 'error';
      else if (node.load > 75) node.status = 'warning';
      else if (node.load < 5) node.status = 'idle';
      else node.status = 'active';
    });
    // ← ADD THIS LINE:
    this.cdr.markForCheck();
  }, 1500);
}
```

**Validation:**
- [ ] ChangeDetectorRef imported correctly
- [ ] Constructor injection added
- [ ] `markForCheck()` call present in setInterval callback after mutations
- [ ] File saved

---

## PHASE 4: Module & Bootstrap Pattern Cleanup

**Objective:** Fix mixed module pattern in app.module.ts and ensure bootstrap method is correct.

---

### Task 4.1: Fix app.module.ts Declarations vs Imports

**File:** `src/app/app.module.ts`

**Current Issue:** Components are in the `imports` array instead of `declarations` array (incorrect standalone pattern).

**Find the @NgModule decorator (approximately lines 5-25):**

Current (INCORRECT):
```typescript
@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AppComponent,                    // ← WRONG: Standalone component here
    LayoutManagerComponent,           // ← WRONG: Standalone component here
    DashboardWidgetsComponent,        // ← WRONG: Should not be here
    ResourceMonitorComponent,         // ← WRONG: Should not be here
    // ... more components
  ],
  bootstrap: [AppComponent]
})
```

Change to (CORRECT - move standalone components OUT of app.module.ts):
```typescript
@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AppComponent,
    LayoutManagerComponent,
  ],
  bootstrap: [AppComponent]
})
```

**Reason:** In v18, standalone components should NOT be imported into NgModules unless they are being used directly within a template. Since `AppComponent` is the bootstrap component and `LayoutManagerComponent` is imported by the routing module, keep them. Remove all other component imports.

**Validation:**
- [ ] File saved
- [ ] `ng build` runs without import errors
- [ ] No console errors about unknown selectors

---

### Task 4.2: Verify main.ts Bootstrap Method

**File:** `src/main.ts`

**Current Code (lines 1-20):**
```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideZoneChangeDetection } from '@angular/core';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

**Issue:** Imports `provideZoneChangeDetection` but doesn't use it (suggests partial conversion attempt).

**Action:** Keep the current approach (NgModule bootstrap with `platformBrowserDynamic`) since app.module.ts still exists. No change needed.

**Alternative (Optional Future):** To fully modernize to v18 standalone bootstrap:
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
}).catch(err => console.error(err));
```

**For this migration:** Keep current `platformBrowserDynamic` approach.

**Validation:**
- [ ] `main.ts` uses `platformBrowserDynamic().bootstrapModule(AppModule)`
- [ ] No errors during `ng serve`

---

## PHASE 5: Build & Code Validation

**Objective:** Verify all code changes compile correctly and have no TypeScript errors.

---

### Task 5.1: Check for TypeScript Compilation Errors

**Command:**
```bash
ng build
```

**Expected Duration:** 2-3 minutes

**What This Does:**
- Compiles all TypeScript files
- Bundles the application
- Reports any type errors

**Expected Outcome:**
```
✔ Compiled successfully.
```

**If errors occur:**
- Review error messages carefully
- Check that all `ChangeDetectorRef` imports are present
- Verify `tsconfig.json` `moduleResolution` is set to `bundler`
- Re-run the command

**Validation:**
- [ ] Build completes with "Compiled successfully"
- [ ] No TypeScript errors
- [ ] `dist/` directory created with compiled output

---

### Task 5.2: Production Build Validation

**Command:**
```bash
ng build --configuration production
```

**Expected Duration:** 3-4 minutes

**What This Does:**
- Creates optimized production bundle
- Applies minification and tree-shaking
- Validates all optimizations work correctly

**Expected Outcome:**
```
✔ Compiled successfully.
(Build output with bundle sizes)
```

**Validation:**
- [ ] Production build succeeds
- [ ] No warnings related to Angular v18 migration
- [ ] Bundle size is reasonable (should not increase significantly from v17)

---

### Task 5.3: Lint Check (if applicable)

**If ESLint is configured:**
```bash
npm run lint
# OR
ng lint
```

**Expected Outcome:** No migration-related linting errors

**Validation:**
- [ ] Lint passes or only shows pre-existing issues
- [ ] No new migration-related warnings

---

## PHASE 6: Unit & Integration Tests

**Objective:** Verify all tests pass and change detection fixes work correctly.

---

### Task 6.1: Run Full Test Suite

**Command:**
```bash
ng test --watch=false --browsers=ChromeHeadless
```

**Expected Duration:** 5-10 minutes

**What This Does:**
- Runs all Karma/Jasmine tests
- Validates that components still function correctly after changes

**Expected Outcome:**
```
TOTAL: X SUCCESS / 0 FAILED
Chrome X.X.X (Windows/Linux/Mac X.X.X): Executed X of X ✓
```

**If tests fail:**
- Review test failure messages
- Check if failures are related to change detection (dashboard/resource-monitor tests)
- If new failures in change detection tests, verify `markForCheck()` calls are present
- Re-run individual failing tests with `ng test --browsers=Chrome` (interactive mode)

**Validation:**
- [ ] All tests pass
- [ ] No failures related to dashboard-widgets or resource-monitor
- [ ] Test output shows 0 failures

---

### Task 6.2: Manual Smoke Test in Browser

**Command:**
```bash
ng serve
```

**Verification Steps (execute in browser):**

1. **Navigate to Application:**
   - Open http://localhost:4200
   - Application loads without errors
   - Console (DevTools F12) shows no errors

2. **Test Dashboard Widgets Component:**
   - Look for metrics values (should show 0-100 range)
   - **CRITICAL:** Values should **update every second** (metrics.value and metrics.trend change)
   - If values stay frozen → change detection fix failed
   - If values update smoothly → ✅ Fix successful

3. **Test Resource Monitor Component:**
   - Navigate to resource monitor view
   - **CRITICAL:** Node load/memory values should **update every 1.5 seconds**
   - Node status colors should change (green → yellow → red as load increases)
   - If status doesn't change → change detection fix failed
   - If status updates and colors change → ✅ Fix successful

4. **Test Other Components:**
   - Autocomplete filtering (type in search field, should filter results)
   - Data grid (verify large dataset loads and filters)
   - Calendar (dates display correctly)
   - All other components load without errors

5. **Final Check:**
   - Close DevTools console — should show 0 errors at startup
   - Close `ng serve` terminal without errors

**Validation Checklist:**
- [ ] Dashboard metrics update every second (values change)
- [ ] Resource monitor status colors change as load updates
- [ ] No console errors
- [ ] All components load and render correctly
- [ ] Application functions as expected (no frozen UIs)

---

## Validation Gates (Build/Test/Manual)

**These gates MUST ALL PASS before marking Phase 6 complete:**

| Gate | Status | Requirement |
|------|--------|-------------|
| `ng build` | ✅ | Compiles without errors |
| `ng build --configuration production` | ✅ | Production build succeeds |
| `ng test --watch=false` | ✅ | All tests pass (0 failures) |
| Dashboard metrics update in browser | ✅ | Values change every second |
| Resource monitor updates in browser | ✅ | Status colors and values change every 1.5s |
| Console errors (F12 DevTools) | ✅ | Zero errors at startup and during interaction |
| Autocomplete filtering | ✅ | Typing in search filters results |
| Data grid rendering | ✅ | 500 rows load and filter without performance issues |

**If ANY gate fails:**
→ HALT migration for this version  
→ Rollback (see Rollback Procedures section)  
→ Fix the issue  
→ Re-test

---

## Rollback Triggers & Procedures

**Rollback Trigger Conditions:**

1. **Build Fails:** `ng build` shows compilation errors that cannot be fixed within 15 minutes
2. **Tests Fail:** `ng test` shows new failures (not pre-existing) that cannot be fixed within 20 minutes
3. **UI Broken:** Dashboard/resource-monitor don't update in browser (change detection fix didn't work)
4. **node_modules Corrupted:** Package manager unable to install dependencies

**Rollback Procedure:**

If any of the above occurs, execute:

```powershell
# Step 1: Check git status
git status

# Step 2: Revert all changes
git revert HEAD                    # Reverts Phase 1-6 commits
# OR (if not committed yet)
git reset --hard origin/main       # Hard reset to last pushed state

# Step 3: Clean node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Step 4: Reinstall v17 dependencies
npm install

# Step 5: Verify rollback
ng version                         # Should show @angular/core: 17.3.12
ng build                           # Should compile

# Step 6: Report failure
# Log the error and attempt a fix in the migration plan before re-attempting
```

**Escalation Trigger:** If rollback is needed more than once for the same issue, escalate to human review with:
- Complete error logs
- Stack traces
- All attempted fixes
- Root cause analysis

---

## Git Checkpoint & Commit

**Upon successful completion of all validation gates:**

### Commit All Changes

```bash
git add -A
git commit -m "chore: complete Angular v17 → v18 migration

- Updated @angular/* packages to 18.0.0
- Updated TypeScript to 5.6.2
- Updated zone.js to 0.15.0
- Fixed moduleResolution in tsconfig.json to 'bundler'
- Fixed change detection in dashboard-widgets.component.ts
- Fixed change detection in resource-monitor.component.ts
- Cleaned up app.module.ts declarations
- All tests passing
- Build succeeds without errors"
```

### Push to Repository

```bash
git push origin main
```

**Verify Push:** Check that GitHub/GitLab shows the commit.

### Create Checkpoint Tag (Recommended)

```bash
git tag -a v18-stable -m "Angular v18 migration stable checkpoint"
git push origin v18-stable
```

**This tag allows rollback to this point if v18→v19 migration fails:**
```bash
git reset --hard v18-stable
```

---

## Success Criteria

✅ **Migration to v17 → v18 is SUCCESSFUL when ALL of the following are true:**

1. ✅ **Dependency Alignment:**
   - `package.json` shows `@angular/core@~18.0.0`
   - `package.json` shows `typescript@~5.6.x`
   - `package.json` shows `zone.js@~0.15.x`
   - `npm list` confirms all versions installed

2. ✅ **TypeScript Configuration:**
   - `tsconfig.json` has `"moduleResolution": "bundler"`
   - `tsc --noEmit` runs without errors

3. ✅ **Code Changes:**
   - `dashboard-widgets.component.ts` has `ChangeDetectorRef` imported and `markForCheck()` in setInterval
   - `resource-monitor.component.ts` has `ChangeDetectorRef` imported and `markForCheck()` in setInterval
   - `app.module.ts` declarations/imports cleaned up
   - `main.ts` bootstrap method correct

4. ✅ **Build Validation:**
   - `ng build` succeeds with no errors
   - `ng build --configuration production` succeeds
   - Bundle size within expected range

5. ✅ **Test Validation:**
   - `ng test --watch=false` passes with 0 failures
   - All unit tests for components pass
   - All integration tests pass

6. ✅ **Manual Verification:**
   - `ng serve` launches successfully
   - Dashboard metrics values update every second
   - Resource monitor status colors and values update every 1.5 seconds
   - All other components render and function correctly
   - Browser DevTools console shows 0 errors

7. ✅ **Git Checkpoint:**
   - Latest commit message mentions v18 migration
   - `git push origin main` succeeds
   - `v18-stable` tag created and pushed

8. ✅ **No Regressions:**
   - No new console errors or warnings
   - No performance degradation
   - All user-facing features work as before

---

## Next Version Migration

**Upon successful completion of this v17 → v18 migration:**

1. Commit and push all changes (see Git Checkpoint section above)
2. Verify repository is clean: `git status` should show "nothing to commit"
3. Read the next migration plan: `plan/migration_v18_to_v19.md`
4. Execute the v18 → v19 migration following that atomic plan
5. **Do NOT combine multiple version migrations** — each must complete, commit, and push before starting the next

---

## Troubleshooting Reference

### Issue: `ng update` hangs or takes too long

**Solution:**
```bash
# Cancel (Ctrl+C) and try with --force flag
ng update @angular/core@18 @angular/cli@18 --allow-dirty --force
```

### Issue: npm install fails with peer dependency warnings

**Solution:**
```bash
npm install --force
# If still fails, check npm logs:
npm install --verbose
```

### Issue: Dashboard/resource-monitor values don't update in browser

**Diagnosis:**
1. Check browser console (F12) for errors
2. Check that `ChangeDetectorRef.markForCheck()` is in the setInterval callback
3. Verify the file was saved correctly

**Fix:**
- Re-apply the change detection fix (Task 3.1 or 3.2)
- Run `ng build` to verify compilation
- Run `ng serve` and test again

### Issue: TypeScript errors after `moduleResolution` change

**Solution:**
```bash
# Clean TypeScript cache
rm -r dist/ .angular/
ng build
```

### Issue: node_modules appears corrupted (Windows)

**Solution:**
```powershell
# Use rimraf (more robust than Remove-Item)
npx rimraf node_modules
npx rimraf package-lock.json
npm install
```

---

## Implementation Log Entry Template

Upon completion, add this entry to `report/implementation_log.md`:

```markdown
## Angular v17 → v18 Migration — COMPLETED ✅

**Date:** May 17, 2026  
**Duration:** [X hours Y minutes]  
**Checkpoint:** `v18-stable` (tag created and pushed)

### Phases Completed
- [x] Phase 1: Dependency Updates (Tasks 1.1-1.5)
- [x] Phase 2: TypeScript Config (Tasks 2.1-2.2)
- [x] Phase 3: Change Detection Fixes (Tasks 3.1-3.2)
- [x] Phase 4: Module/Bootstrap Cleanup (Tasks 4.1-4.2)
- [x] Phase 5: Build Validation (Tasks 5.1-5.3)
- [x] Phase 6: Testing & Smoke Test (Tasks 6.1-6.2)

### Critical Fixes Applied
1. **dashboard-widgets.component.ts** — Added `ChangeDetectorRef.markForCheck()` in setInterval (line ~50)
2. **resource-monitor.component.ts** — Added `ChangeDetectorRef.markForCheck()` in setInterval (line ~55)

### Validation Gates Passed
- ✅ `ng build` — 0 errors
- ✅ `ng test` — All tests passed
- ✅ Dashboard metrics update every second
- ✅ Resource monitor updates every 1.5 seconds
- ✅ Browser console — 0 errors

### Changes Summary
- Updated 12 `@angular/*` packages from ~17.3.12 to ~18.0.0
- Updated TypeScript from 5.4.5 to 5.6.2
- Updated zone.js from 0.14.10 to 0.15.0
- Modified `tsconfig.json`: `moduleResolution: "node"` → `"bundler"`
- Modified 2 components: injected `ChangeDetectorRef`, added `markForCheck()` calls
- Cleaned up `app.module.ts` declarations
- Total files modified: 5

### Git Status
```
Commit: [commit hash] — "chore: complete Angular v17 → v18 migration"
Tag: v18-stable (pushed to origin)
Branch: main
Status: All changes committed and pushed
```

### Next Step
Proceed to Angular v18 → v19 migration using `plan/migration_v18_to_v19.md`
```

---

**Plan Generated:** May 17, 2026  
**Status:** Ready for Execution  
**Next Plan:** `plan/migration_v18_to_v19.md` (after successful completion)
