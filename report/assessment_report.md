# Angular v20 → v21 Migration Assessment Report

**Assessment Date:** May 17, 2026  
**Current Angular Version:** 20.x.x  
**Target Angular Version:** 21.x.x  
**TypeScript Version:** 5.9.x (follow Angular 21 guidance)  
**Assessment Scope:** v20 → v21 ONLY (Focused Migration)

---

## Executive Summary

**Overall Risk Level:** 🔴 **HIGH** — Critical change-detection and bootstrap mismatches can cause runtime display issues if not addressed.

**Critical Blocker Identified:** Polling/timer-based components that mutate state outside Angular's zone require explicit change detection triggers (e.g., `ChangeDetectorRef.markForCheck()`). Without fixes, UI updates may appear frozen.

**Estimated Migration Effort:** 2-4 hours (code fixes, config updates, validation)

---

## 1. Package Version Analysis & Required Updates

### Current Package Guidance (v20 → v21)
- Update all `@angular/*` packages to v21 per Angular update guidance.
- Update `@angular/cli` and `@angular-devkit/build-angular` to v21-compatible releases.
- Update TypeScript to the version recommended by Angular 21.

### Update Commands (example)
```bash
ng update @angular/core@21 @angular/cli@21 --allow-dirty --force
npm install
```

---

## 2. Critical Breaking Changes: v20 → v21

### 🔴 **CRITICAL: Change Detection Behavior Changes**

**Impact Level:** CRITICAL — Component UI updates will fail silently.

Angular 21 enforces stricter change detection boundaries for data mutations **outside Angular's zone** (e.g., `setInterval()`, `setTimeout()` callbacks, browser event handlers).

**Components Affected:**
1. **[dashboard-widgets.component.ts](../src/app/components/dashboard-widgets/dashboard-widgets.component.ts#L46)**
   - **Pattern:** `setInterval()` mutates `this.metrics` array
   - **Current Code:**
     ```typescript
     startPolling() {
       this.intervalId = setInterval(() => {
         this.metrics.forEach(m => {
           m.value = Math.random() * 100;
           m.history.push(newValue);
         });
       }, 1000);
     }
     ```
   - **Issue:** No change detection trigger after mutation
  - **Risk:** Metrics display will be **frozen/stale** in Angular 21
   - **Fix Required:** Add `ChangeDetectorRef.markForCheck()` after mutations

2. **[resource-monitor.component.ts](../src/app/components/resource-monitor/resource-monitor.component.ts#L49)**
   - **Pattern:** `setInterval()` mutates `this.nodes` array
   - **Current Code:**
     ```typescript
     startSimulation() {
       this.intervalId = setInterval(() => {
         this.nodes.forEach(node => {
           node.load = Math.min(100, Math.max(0, node.load + ...));
           node.status = node.load > 90 ? 'error' : ...;
         });
       }, 1500);
     }
     ```
   - **Issue:** No change detection trigger after mutations
  - **Risk:** Node status indicators will **not update** in Angular 21
   - **Fix Required:** Add `ChangeDetectorRef.markForCheck()` after mutations

**Root Cause:** Angular 21's change detection strategy does not automatically detect mutations from native browser APIs (`setInterval`, `setTimeout`, direct DOM events). These callbacks run **outside Angular's zone** and require explicit change detection triggers.

**Solution Pattern:**
```typescript
import { ChangeDetectorRef } from '@angular/core';

export class YourComponent implements OnInit, OnDestroy {
  constructor(private cdr: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      // Update data
      this.data.value = newValue;
      
      // REQUIRED in Angular 21:
      this.cdr.markForCheck();
    }, 1000);
  }
  
  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
```

---

### 🔴 **Module Bootstrap Method Mismatch**

**Impact Level:** HIGH — Build will fail or runtime errors will occur.

**Current Issue:**
- **File:** [main.ts](../src/main.ts)
- **Pattern:** Uses `platformBrowserDynamic().bootstrapModule(AppModule)` (NgModule bootstrap)
- **Imported but unused:** `provideZoneChangeDetection` from `@angular/core`

**Conflict:**
- `main.ts` imports `provideZoneChangeDetection` but doesn't use it (suggests partial conversion)
- `app.module.ts` still uses traditional NgModule pattern with empty `declarations` array
-- `app.component.ts` is standalone
+- **This mixed pattern is unstable in v21**

**Fix Required:** Choose ONE approach:
1. **Option A (Recommended for v21):** Migrate to **standalone bootstrap**
  - Remove `app.module.ts`
  - Use `bootstrapApplication()` in `main.ts`
  - Enables full v21 optimizations

2. **Option B:** Keep NgModule bootstrap but fix app.module.ts
   - Move components to `declarations` array (not `imports`)
   - Remove unused `provideZoneChangeDetection` import

**Current Code Issue in app.module.ts:**
```typescript
@NgModule({
  declarations: [],  // ← EMPTY (wrong pattern)
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AppComponent,           // ← Should NOT be here (wrong pattern)
    LayoutManagerComponent, // ← Should NOT be here (wrong pattern)
    // ... more components
  ],
  bootstrap: [AppComponent]
})
```

---

### 🟡 **Deprecated APIs Removed in v21**

| Deprecated (v20) | Removed (v21) | Affected Code | Severity |
|------------------|---------------|--------------|----------|
| `platformBrowserDynamic().bootstrapModule()` | **Removed** (use `bootstrapApplication()` instead) | [main.ts](../src/main.ts) | HIGH |
| Old change detection patterns | **Removed** (requires explicit triggers) | [dashboard-widgets.component.ts](../src/app/components/dashboard-widgets/dashboard-widgets.component.ts), [resource-monitor.component.ts](../src/app/components/resource-monitor/resource-monitor.component.ts) | **CRITICAL** |
| CommonModule in standalone imports (redundant) | Deprecated warning (not removed) | Multiple standalone components | LOW |
| `@angular/router` lazy loading syntax | Updated in v20 | [app-routing.module.ts](../src/app/app-routing.module.ts) | MEDIUM |

---

## 3. TypeScript & Build Configuration

- Verify `tsconfig.json` and update `moduleResolution` or other compiler options as recommended by Angular 21.
- Ensure `angular.json` uses builders compatible with the updated `@angular-devkit/build-angular`.

---

## 4. Build Configuration Analysis

### Current angular.json
- **Builder:** `@angular-devkit/build-angular:browser` ✅ Compatible with v21
- **Polyfills:** `zone.js` only ✅ Correct for v21
- **TypeScript Config:** Uses `tsconfig.app.json` ✅ Correct
- **Output Path:** `dist/frontend` ✅ Fine
- **CSS Styles:** `src/styles.css` ✅ Compatible

**No changes required to angular.json structure**, but the builder version will auto-update with package.json updates.

---

## 5. Component-Specific Patterns Requiring Refactoring

### Summary Table

| Component | File Path | Pattern | Risk | Fix Required |
|-----------|-----------|---------|------|--------------|
| Dashboard Widgets | `src/app/components/dashboard-widgets/` | `setInterval()` without change detection | 🔴 CRITICAL | Add `ChangeDetectorRef.markForCheck()` |
| Resource Monitor | `src/app/components/resource-monitor/` | `setInterval()` without change detection | 🔴 CRITICAL | Add `ChangeDetectorRef.markForCheck()` |
| Autocomplete Complex | `src/app/components/autocomplete-complex/` | `setTimeout()` for async filtering | 🟡 MEDIUM | Monitor; add `markForCheck()` if needed |
| Data Grid | `src/app/components/data-grid/` | Large dataset (500 rows) | 🟡 MEDIUM | Verify performance and change detection |
| Calendar | `src/app/components/calendar/` | Dynamic day generation | 🟢 LOW | No action needed |
| Layout Manager | `src/app/components/layout-manager/` | Container layout | 🟢 LOW | No action needed |
| App Component | `src/app/app.component.ts` | Standalone; section toggling | 🟢 LOW | No action needed |
| App Routing Module | `src/app/app-routing.module.ts` | Traditional NgModule routing | 🟡 MEDIUM | Consider migration to standalone routing (optional)

---

## 6. Detailed Component Analysis

### 🔴 Dashboard Widgets Component — CRITICAL FIX REQUIRED

**File:** [src/app/components/dashboard-widgets/dashboard-widgets.component.ts](../src/app/components/dashboard-widgets/dashboard-widgets.component.ts)

**Current Issue:**
```typescript
export class DashboardWidgetsComponent implements OnInit, OnDestroy {
  metrics: WidgetMetric[] = [];
  intervalId: any;
  
  ngOnInit(): void {
    this.initMetrics();
    this.startPolling();
  }
  
  startPolling() {
    this.intervalId = setInterval(() => {
      this.metrics.forEach(m => {
        const newValue = Math.random() * 100;
        m.trend = newValue > m.value ? 'up' : (newValue < m.value ? 'down' : 'stable');
        m.value = newValue;
        m.history.push(newValue);
        if (m.history.length > 20) m.history.shift();
      });
      // ← NO CHANGE DETECTION TRIGGER
    }, 1000);
  }
}
```

**Why It Breaks in v19:**
- Angular 18's change detection does NOT automatically run after `setInterval()` callbacks
- The component's template shows `{{ metric.value }}`, but the view will show **stale data**

**Required Fix:**
```typescript
import { ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

export class DashboardWidgetsComponent implements OnInit, OnDestroy {
  metrics: WidgetMetric[] = [];
  intervalId: any;
  
  constructor(private cdr: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    this.initMetrics();
    this.startPolling();
  }
  
  startPolling() {
    this.intervalId = setInterval(() => {
      this.metrics.forEach(m => {
        const newValue = Math.random() * 100;
        m.trend = newValue > m.value ? 'up' : (newValue < m.value ? 'down' : 'stable');
        m.value = newValue;
        m.history.push(newValue);
        if (m.history.length > 20) m.history.shift();
      });
      // ← REQUIRED in v19
      this.cdr.markForCheck();
    }, 1000);
  }
  
  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
```

---

### 🔴 Resource Monitor Component — CRITICAL FIX REQUIRED

**File:** [src/app/components/resource-monitor/resource-monitor.component.ts](../src/app/components/resource-monitor/resource-monitor.component.ts)

**Current Issue:**
```typescript
export class ResourceMonitorComponent implements OnInit, OnDestroy {
  nodes: ResourceNode[] = [];
  intervalId: any;
  
  ngOnInit(): void {
    this.initNodes();
    this.startSimulation();
  }
  
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
      // ← NO CHANGE DETECTION TRIGGER
    }, 1500);
  }
}
```

**Why It Breaks in v19:**
- Same issue as dashboard: `setInterval()` mutations are not detected
- Node status colors and values will appear **frozen** in the UI

**Required Fix:**
```typescript
import { ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

export class ResourceMonitorComponent implements OnInit, OnDestroy {
  nodes: ResourceNode[] = [];
  intervalId: any;
  
  constructor(private cdr: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    this.initNodes();
    this.startSimulation();
  }
  
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
      // ← REQUIRED in v19
      this.cdr.markForCheck();
    }, 1500);
  }
  
  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
```

---

### 🟡 Autocomplete Complex Component — MEDIUM PRIORITY

**File:** [src/app/components/autocomplete-complex/autocomplete-complex.component.ts](../src/app/components/autocomplete-complex/autocomplete-complex.component.ts#L58)

**Current Pattern:**
```typescript
onInput() {
  if (this.query.length < 2) {
    this.results = [];
    this.groupedResults = {};
    return;
  }

  this.isLoading = true;
  setTimeout(() => {
    this.results = this.allData.filter(...).slice(0, 50);
    this.groupResults();
    this.isLoading = false;
  }, 300);
}
```

**Assessment:**
-- ✅ Likely **safe in v19** because the mutations are followed by `this.groupResults()` which updates view properties
- The binding in template to `this.results` and `this.isLoading` will likely trigger change detection
- Monitor during testing; if results don't appear, add `ChangeDetectorRef.markForCheck()` after `this.isLoading = false`

**Preventive Fix (optional, but recommended):**
```typescript
import { ChangeDetectorRef } from '@angular/core';

export class AutoCompleteComplexComponent {
  constructor(private cdr: ChangeDetectorRef) { }
  
  onInput() {
    if (this.query.length < 2) {
      this.results = [];
      this.groupedResults = {};
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.results = this.allData.filter(...).slice(0, 50);
      this.groupResults();
      this.isLoading = false;
      this.cdr.markForCheck();  // Explicit trigger
    }, 300);
  }
}
```

---

### 🟡 Data Grid Component — MEDIUM PRIORITY

**File:** [src/app/components/data-grid/data-grid.component.ts](../src/app/components/data-grid/data-grid.component.ts)

**Pattern:**
- Generates **500 rows** of data in `ngOnInit()`
- Supports filtering, selection, and grouping
- **No async intervals**, so likely safe
- **Risk:** Heavy data manipulation may cause performance issues or undetected changes

**Assessment:**
-- ✅ No immediate breaking changes required for v19
- 🟡 Monitor performance during testing; consider `OnPush` change detection if performance degrades

**Optional Optimization:**
```typescript
@Component({
  selector: 'app-data-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,  // Optional
  // ...
})
```

---

### 🟢 Other Components — LOW PRIORITY

- **Calendar:** Dynamic day generation, no async patterns → Safe
- **Layout Manager:** Container/layout logic → Safe
- **Advanced Form Stepper:** Form logic → Safe
- **Tree View Large:** Tree rendering → Safe
- **Event Scheduler:** Event management → Safe
- **File Explorer:** File hierarchy → Safe
- **Sticky Notes:** Note management → Safe
- **Notification Hub:** Notification display → Safe
- **Settings Panel:** Settings management → Safe
- **Workflow Designer:** Canvas/diagram logic → Safe

---

## 7. Shared Data Service Analysis

**File:** [src/app/shared-data.service.ts](../src/app/shared-data.service.ts)

**Current Pattern:**
```typescript
constructor() {
  interval(2000).pipe(
    map(() => ({
      timestamp: Date.now(),
      entropy: Math.random() * 1000,
      loadFactor: Math.random(),
      activeProcesses: Math.floor(Math.random() * 500)
    }))
  ).subscribe(pulse => this._pulse$.next(pulse));
}
```

**Assessment:**
- ✅ **Safe in v19** — Uses RxJS `interval()` which is zone-aware
- `BehaviorSubject.next()` properly triggers change detection in subscribed components
- No changes required

---

## 8. Test Framework Updates

### Current Testing Setup
| Tool | Current | v19 Compatible | Status |
|------|---------|----------------|--------|
| Jasmine | 5.1.0 | 5.1.0 | ✅ COMPATIBLE |
| Karma | 6.4.0 | 6.4.x | ✅ COMPATIBLE |
| @types/jasmine | 5.1.0 | 5.1.0 | ✅ COMPATIBLE |
| karma-jasmine | 5.1.0 | 5.1.0 | ✅ COMPATIBLE |
| karma-chrome-launcher | 3.2.0 | 3.2.x | ✅ COMPATIBLE |

### Required Test Updates

**File:** [src/app/components/data-grid/data-grid.component.spec.ts](../src/app/components/data-grid/data-grid.component.spec.ts)

**Current Test Setup:**
```typescript
describe('DataGridComponent Stress Test', () => {
  let component: DataGridComponent;
  let fixture: ComponentFixture<DataGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGridComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should handle rapid filtering of 500+ rows without crashing', fakeAsync(() => {
    // ...
  }));
});
```

**Status:** ✅ Already using v19+ standalone component test pattern (correct for v20)

**New Tests Required for v19:**

After fixing the change detection issues, add these tests:

```typescript
// New test file: dashboard-widgets.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { DashboardWidgetsComponent } from './dashboard-widgets.component';

describe('DashboardWidgetsComponent - Change Detection', () => {
  let component: DashboardWidgetsComponent;
  let fixture: ComponentFixture<DashboardWidgetsComponent>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardWidgetsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardWidgetsComponent);
    component = fixture.componentInstance;
    cdr = fixture.debugElement.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should update metric values via setInterval and change detection', (done) => {
    const initialValue = component.metrics[0].value;
    setTimeout(() => {
      fixture.detectChanges();
      expect(component.metrics[0].value).not.toBe(initialValue);
      done();
    }, 1100);
  });

  it('should mark for check after setInterval mutations', (done) => {
    spyOn(cdr, 'markForCheck');
    setTimeout(() => {
      expect(cdr.markForCheck).toHaveBeenCalled();
      done();
    }, 1100);
  });
});
```

---

## 9. CSS and Styling Assessment

**File:** [src/styles.css](../src/styles.css)

**Current Status:**
- ✅ Uses modern CSS (Flexbox, CSS Grid compatible)
- ✅ Global imports from Google Fonts
- ✅ CSS custom properties not required for v19
- ✅ Animation patterns compatible

**Assessment:** No CSS changes required for v20→v21 migration.

**Windows-Specific Note:** On Windows systems, `node_modules` may become corrupted during large dependency updates. Mitigation:
```bash
# Clean deletion strategy for Windows
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 10. Migration Checklist & Validation Gates

### Pre-Migration Checklist
- [ ] Back up current code state (git commit)
- [ ] Ensure all tests pass before migration
- [ ] Close all running `ng serve` processes
- [ ] Close VS Code to release file locks
- [ ] On Windows: Prepare for potential `node_modules` deletion issues

### Phase 1: Package Updates
-- [ ] Update all `@angular/*` packages to v21
- [ ] Update TypeScript per Angular 21 recommendation
- [ ] Run `npm install` and verify peer dependencies

### Phase 2: Configuration Updates
- [ ] Update `tsconfig.json` as recommended
- [ ] Verify `angular.json` builder versions

### Phase 3: Code Fixes (CRITICAL)
- [ ] Fix `dashboard-widgets.component.ts` — Add `ChangeDetectorRef.markForCheck()`
- [ ] Fix `resource-monitor.component.ts` — Add `ChangeDetectorRef.markForCheck()`
- [ ] Fix bootstrap pattern in `main.ts` / `app.module.ts` as needed

### Phase 4: Build & Test Validation Gates
- [ ] `ng build` (dev & prod) succeeds
- [ ] Run targeted tests for changed components, then full suite
- [ ] Browser runtime has no critical console errors

### Phase 5: Smoke Test
- [ ] Run `ng serve`
- [ ] Validate live behavior of polling components
- [ ] Run manual UI checks across key pages

### Post-Migration Checklist
-- [ ] Commit changes: `git commit -m "chore: complete Angular v21 migration"`
- [ ] Push to repository: `git push origin main`
- [ ] Tag release: `git tag -a v21-stable`
- [ ] Update documentation

---

## 11. Risk Assessment Summary

| Risk Area | Severity | Mitigation | Timeline |
|-----------|----------|-----------|----------|
| Change Detection in polling components | 🔴 CRITICAL | Add `ChangeDetectorRef.markForCheck()` to 2 components | 15 min |
| Bootstrap method mismatch | 🔴 CRITICAL | Fix app.module.ts or migrate to standalone | 20 min |
| TypeScript config | 🟡 HIGH | Update moduleResolution to "bundler" | 2 min |
| Package version conflicts | 🟡 HIGH | Run `ng update` with proper sequence | 5 min |
| Performance regression | 🟡 MEDIUM | Monitor during testing; verify no missed change detection | 30 min |
| Test framework compatibility | 🟢 LOW | All tools already compatible with v19 | 0 min |
| CSS compatibility | 🟢 LOW | No changes required | 0 min |

---

## 12. Project Inventory

### Modules & Components

#### NgModule Pattern
- **app.module.ts** — Bootstrap module (NEEDS FIX)
- **app-routing.module.ts** — Routing module

#### Standalone Components
1. **app.component.ts** — Root component (standalone)
2. **dashboard-widgets.component.ts** — Metrics dashboard (standalone, CRITICAL FIX)
3. **resource-monitor.component.ts** — Resource simulation (standalone, CRITICAL FIX)
4. **autocomplete-complex.component.ts** — Search filtering (standalone)
5. **data-grid.component.ts** — Heavy data table (standalone)
6. **calendar.component.ts** — Calendar with lunar phases (standalone)
7. **advanced-form-stepper.component.ts** — Multi-step form (standalone)
8. **event-scheduler.component.ts** — Event management (standalone)
9. **date-range-picker.component.ts** — Date selection (standalone)
10. **layout-manager.component.ts** — Responsive layout (standalone)
11. **tree-view-large.component.ts** — Hierarchical tree (standalone)
12. **sticky-notes.component.ts** — Note-taking (standalone)
13. **notification-hub.component.ts** — Alert display (standalone)
14. **settings-panel.component.ts** — Settings management (standalone)
15. **workflow-designer.component.ts** — Flow diagram (standalone)
16. **file-explorer.component.ts** — File browser (standalone)

#### Services
- **shared-data.service.ts** — Global state & pulses (RxJS-based, safe for v19)

#### Test Files
- **data-grid.component.spec.ts** — Component stress tests

### Dependency Analysis

**Direct Dependencies:**
- RxJS (interval, BehaviorSubject, map)
- Angular forms (FormsModule, reactive forms)
- Angular common (CommonModule, *ngIf, *ngFor, etc.)
- Angular platform browser
- Angular router

**No External UI Libraries Detected:** Project uses pure Angular + custom styles (no Material, ng-bootstrap, etc.)

---

## 13. Windows-Specific Considerations

**Issue:** `node_modules` corruption is common on Windows during large dependency updates.

**Symptom:** After `npm install`, commands fail with "Cannot find module..." errors.

**Prevention:**
```powershell
# Stop all running processes
Get-Process node | Stop-Process -Force
Get-Process ng | Stop-Process -Force

# Clean deletion (more reliable than rm -r -force)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Fresh install
npm install
```

**If issues persist:**
```powershell
# Use rimraf (more robust on Windows)
npx rimraf node_modules
npm install
```

---

## 14. Zone/Change Detection Risk Analysis

### Components Scanning for Zone Issues

**High-Risk Patterns Found:**
1. **[dashboard-widgets.component.ts](../src/app/components/dashboard-widgets/dashboard-widgets.component.ts#L46)** — `setInterval()` with data mutations; **NO `ChangeDetectorRef.markForCheck()` call**
2. **[resource-monitor.component.ts](../src/app/components/resource-monitor/resource-monitor.component.ts#L49)** — `setInterval()` with status updates; **NO explicit change detection**

**Safe Patterns Found:**
- [shared-data.service.ts](../src/app/shared-data.service.ts) — Uses RxJS `interval()` which is zone-aware
- [autocomplete-complex.component.ts](../src/app/components/autocomplete-complex/autocomplete-complex.component.ts#L58) — Uses `setTimeout()` but updates observable properties

**Zone/Change Detection Fixes Required:**

| Component | File | Pattern | Fix |
|-----------|------|---------|-----|
| Dashboard Widgets | dashboard-widgets.component.ts | `setInterval()` → data mutation | Inject `ChangeDetectorRef`, call `markForCheck()` in interval callback |
| Resource Monitor | resource-monitor.component.ts | `setInterval()` → status mutation | Inject `ChangeDetectorRef`, call `markForCheck()` in interval callback |

**Implementation:**
```typescript
// Both components need this pattern:

import { ChangeDetectorRef } from '@angular/core';

constructor(private cdr: ChangeDetectorRef) { }

// After data mutations in setInterval callback:
this.cdr.markForCheck();
```

---

## 15. Estimated Migration Timeline

| Phase | Task | Duration | Cumulative |
|-------|------|----------|-----------|
| Pre-Flight | Backup & prep | 5 min | 5 min |
| Phase 1 | Package updates | 10 min | 15 min |
| Phase 2 | Config updates | 5 min | 20 min |
| Phase 3 | Code fixes (critical) | 30 min | 50 min |
| Phase 4 | Build & test validation | 20 min | 70 min |
| Phase 5 | Smoke testing | 15 min | 85 min |
| Post-Migration | Commit & documentation | 5 min | **90 min** |

**Total Estimated Time:** ~1.5 hours

---

## 16. Success Criteria for v20 → v21 Migration

✅ **Build Criteria:**
- `ng build` completes with 0 errors
- `ng build --configuration production` completes with 0 errors
- No TypeScript compilation errors
- No angular CLI warnings related to deprecation

✅ **Runtime Criteria:**
- App loads without console errors
- All 15 components render correctly
- Dashboard metrics update every 1 second
- Resource monitor updates every 1.5 seconds
- Autocomplete filtering works smoothly
- Data grid handles 500-row filtering without lag

✅ **Testing Criteria:**
- All existing unit tests pass
- No new test failures introduced
- Change detection tests pass for polling components

✅ **Version Criteria:**
- `ng version` shows Angular 18.x.x
- TypeScript version matches 5.6.x requirement
- zone.js version matches 0.15.x requirement

---

## Appendix A: Related Files Summary

| File | Role | Status |
|------|------|--------|
| package.json | Dependency management | 🔴 REQUIRES UPDATE |
| tsconfig.json | TypeScript config | 🟡 REQUIRES MINOR UPDATE |
| tsconfig.app.json | App-specific TS config | ✅ Compatible |
| angular.json | Build configuration | ✅ Compatible (auto-updated) |
| src/main.ts | Application bootstrap | 🔴 REQUIRES FIX |
| src/app/app.module.ts | Root module | 🔴 REQUIRES FIX |
| src/app/app.component.ts | Root component | ✅ Already standalone |
| src/app/components/dashboard-widgets/ | Polling component | 🔴 CRITICAL FIX |
| src/app/components/resource-monitor/ | Polling component | 🔴 CRITICAL FIX |
| src/app/shared-data.service.ts | Global service | ✅ Safe for v20 |
| src/styles.css | Global styles | ✅ No changes needed |

---

## Conclusion

The Angular v20 → v21 migration is **achievable in ~90 minutes** with careful execution. The **primary risk** is the change detection issue in polling-based components (dashboard-widgets and resource-monitor), which will cause **frozen UI updates** if not addressed. Both issues have been clearly identified and should be addressed as part of the migration.

**Recommended Next Steps:**
1. Review this assessment with the team
2. Execute migration in the order specified in Section 10 (Migration Checklist)
3. Prioritize Phases 3 and 4 (code fixes and validation)
4. Follow Windows mitigation strategies if on Windows OS
5. Run comprehensive smoke tests before pushing to production

**No blocking external dependencies detected.** Migration should proceed as planned.

---

**Report Generated:** May 17, 2026  
**Assessment Agent:** Angular v20 → v21 Specialist  
**Next Action:** Begin Package Updates (Phase 1)
