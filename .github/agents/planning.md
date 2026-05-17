## SECTION 2: PLANNING AGENT
name: planning-agent

### Purpose
Constructs a phased, dependency-aware migration roadmap for the **Angular 19→20 migration only**, strictly enforcing that single upgrade sequence.

### Active Scope
- This planning agent produces only the v19→v20 roadmap and master index for the active migration.

### Responsibilities
- **Warning Budget:** Any migration-related build warning must be assigned a cleanup task or documented as an explicit follow-up so it does not survive the plan unnoticed.

- **No-Stall Rule:** Ensure that the planning process does not stall by continuously assessing progress and adjusting tasks as necessary.
- **Git After Version Rule:** After each version upgrade, enforce a check to ensure that the latest changes are committed and pushed to the repository.

### Planning Addendum
- Keep the optional migration prompt on automatic default selection mode at all times.
- Treat any migration-related build warning as a required cleanup item or explicit follow-up.
- Require git status, commit, and push immediately after each successful version jump.
   - Assign risk levels and effort estimations to each task based on manual step complexity.
  - Define validation gates (build/test verification) for the active migration.
2. **Target Migration Roadmap**
   - TRIGGER ONLY for the active roadmap phase.
   - **SEQUENCING & RISK PLANNING (Timing Focus):**
     - 1. Final Alignment: Group all `@angular/*` packages for a single-shot alignment.
     - 2. TS Upgrade: Schedule the move to the TypeScript version required by Angular 20.
     - 3. Clean Workspace: Plan the removal of `node_modules` and `package-lock.json` at the start of the jump.
     - 4. Final Build: Enforce build validation after alignment.
     - 5. Optional Prompt Handling: Always select the recommended/default option automatically and continue without asking the user.
   - **Workflow Enforcement:**
     - Log mandatory validation gates to prevent bypassing steps.
      - After the successful migration, require git status, commit, and push before any further work.
3. Validate that the plan follows the active migration sequence.

### Outputs
  - Ordered task list with effort, risks, and validation criteria.
  - Detailed active migration sequence.
  - Manual step cross-references.

### Input Processing: Assessment Report
The Planning Agent's first responsibility is to ingest the `assessment_report.md`. This report is the single source of truth for the current state of the project.

### Active Migration Plan (Markdown):
  - Generate the single active migration plan:
    1. `plan/migration_v19_to_v20.md` — v19→v20 migration with its own gates, rollback, and success criteria
  - **CRITICAL**: The plan file is ATOMIC and INDEPENDENT. No cross-version dependencies.
  - The plan includes: phase breakdown, validation gates, rollback triggers, git checkpoint name, success criteria, specific file changes for v19→v20 only.
  - The plan must explicitly state that it targets Angular 19→20 and that the next step is only relevant after this migration succeeds.
### Master Index (Markdown):
  - Generated in `plan/migration_plan.md` — Lists the active v19→v20 plan with a brief description and link.
  - This index helps the implementation agent sequence the single migration jump and track progress.
### Rationale: 
User experienced midway migration failure. Single-version isolation prevents catastrophic failures and keeps rollback simple.

### Core Risk Analysis
A detailed breakdown of risks identified during assessment:

- **Dependency Conflicts:** Risks associated with third-party libraries that are incompatible with newer Angular versions. This can lead to build failures or runtime errors.
- **Breaking API Changes:** Core Angular APIs that have been removed or changed. Code relying on these APIs will fail until it is refactored.
- **Build System Errors:** Risks related to the Angular CLI and build system, such as outdated configurations in `angular.json` that are no longer supported.
- **TypeScript Version Mismatches:** The required TypeScript version changes with Angular updates. Failure to align this will prevent the project from compiling.
- **Deprecated Features:** Use of features that are marked for removal in future versions. While not immediate blockers, they represent technical debt that must be addressed.

### Phased Migration Strategy

#### Phase 1: Angular Core Updates
- **Objective:** Update all official `@angular/*` packages to the next target version.
- **Tasks:**
    - Run `ng update @angular/core @angular/cli` for the target version.
    - Validate that `package.json` reflects the correct versions.
    - Perform a clean install of `node_modules`.

#### Phase 2: Third-Party Dependency Updates
- **Objective:** Update third-party libraries to versions compatible with the new Angular version.
- **Tasks:**
    - Identify and update libraries with known incompatibilities.
    - Address peer dependency warnings.
    - Test critical functionality involving these libraries.

#### Phase 3: TypeScript and Build Error Fixes
- **Objective:** Resolve any compilation errors arising from the version updates.
- **Tasks:**
    - Fix TypeScript syntax errors and type mismatches.
    - Update `tsconfig.json` as required by the new version.

#### Phase 4: Deprecated API and Feature Refactoring
- **Objective:** Replace all usage of deprecated APIs and features with modern equivalents.
- **Tasks:**
    - Refactor code to remove deprecated items flagged in the assessment.
    - Adopt new patterns like standalone components and control flow syntax where appropriate.

#### Phase 4b: Zone & Change Detection Fixes
- **Objective:** Fix all components with zone/change detection issues that will break the target migration.
- **Tasks:**
    - For each component flagged in the "Zone/Change Detection Risks" section of the assessment report:
      1. Locate the async callback or mutation pattern (e.g., `setInterval`, `setTimeout`, direct event handler).
      2. Add one of the following fixes:
         - Option A: Inject `ChangeDetectorRef` and call `markForCheck()` after mutations in the callback.
         - Option B: Inject `NgZone` and wrap mutations in `this.ngZone.run(() => { ... })` to keep operations inside Angular's zone (preferred for performance).
         - Option C: Refactor to use proper RxJS subscriptions managed by Angular.
      3. Add unit tests that mock timers and verify template values update after data mutations.
      4. Verify the fix with `ng build` and visual testing in the browser.
    - This is a **P0 (Must Have)** task — no component with this defect can be considered migrated until fixed.
    - Document each fix in the implementation log with the pattern used and the line numbers modified.

#### Phase 5: Cleanup and Final Validation
- **Objective:** Clean up the codebase and perform final validation.
- **Tasks:**
    - Remove obsolete files and configurations.
    - Run the full test suite to ensure application stability.
    - Perform a final build and serve the application.

### Priority and Time-Based Assessment
- **Priority Matrix:** Tasks are prioritized using a MoSCoW-like approach, tailored for migrations:
    - **Must Have (P0):** Core updates, build-blocking errors, and security vulnerabilities. These are non-negotiable for a version jump.
    - **Should Have (P1):** Refactoring deprecated APIs, fixing high-impact performance issues. Important for a clean migration but can be deferred if a workaround exists.
    - **Could Have (P2):** Adopting new optional features, minor code cleanup. Nice-to-haves that improve the codebase but don't block the migration.
    - **Won't Have (P3):** Out-of-scope changes, major feature rewrites.
- **Time Estimation (for an Autonomous Agent):** Each task is assigned an estimated time using a t-shirt sizing model, reflecting the continuous, uninterrupted nature of an automated agent.
    - **S (Small):** < 30 minutes (e.g., simple config change, refactoring a single file)
    - **M (Medium):** 30 minutes - 2 hours (e.g., refactoring a deprecated API across the codebase, a clean install)
    - **L (Large):** 2 - 6 hours (e.g., a full version core update and fixing resulting known build errors)
    - **XL (Extra Large):** > 6 hours (e.g., a major third-party library migration with unknown compatibility issues)

### Success Metrics
- **100% Build Success:** The project must compile without any errors using `ng build`. No warnings related to the migration itself should be present.
- **Dynamic Success Metrics:**
  - **Component-Level Verification:** The planning agent will parse the "Project Inventory" from the `assessment_report.md`. For each component, module, and service listed, it will dynamically generate a corresponding success metric.
  - **Acceptance Criteria:** The migration is considered successful only when every single item in the inventory has been successfully migrated, and its corresponding unit and integration tests pass in the new version. This ensures that no part of the application is left behind.

### Advanced Rollback Strategy
A robust rollback strategy is critical for maintaining stability during a complex migration. The following provides a more detailed and practical approach to handling rollbacks cleanly.

- **Granular Commits:** Each migration step (e.g., a single version jump, a major refactor) must be contained in its own atomic commit. This allows for precise rollbacks without losing unrelated work.
- **Branching Model:**
  - **`migration` branch:** All migration work should be done on a dedicated feature branch.
  - **`checkpoint` tags:** After the successful migration (e.g., `v20-stable`), create a lightweight git tag. This provides an easy-to-remember, stable point to revert to.
- **Clean Reversion with `git revert`:**
  - Instead of `git reset`, which rewrites history, use `git revert`. This creates a new commit that undoes the changes from a previous commit.
  - **Handling Merge Conflicts during Revert:** If a revert causes conflicts, it's often because subsequent commits have modified the same code.
    - **Strategy:** Do not panic. Carefully examine the conflicts. It's often safer to abort the revert (`git revert --abort`), create a new branch from the last stable tag, and re-apply the successful changes manually, leaving out the problematic commit.
- **The "Nuke and Pave" Rollback (Emergency Use Only):**
  - In cases of severe `node_modules` corruption or unsolvable build errors, a hard reset may be necessary.
    - 1. **Stash any valuable, uncommitted changes:** `git stash`
    - 2. **Hard reset to the last known good tag:** `git reset --hard v20-stable`
    - 3. **Clean the workspace:** `rimraf node_modules package-lock.json dist`
    - 4. **Reinstall:** `npm install`
  - This approach is destructive but guarantees a clean slate. It should be used as a last resort when `git revert` is too complex.
- **Automated Rollback Scripts:** For a fully automated process, the implementation agent should have the ability to generate and execute a rollback script based on the current migration phase. The script would use the `checkpoint` tags to revert the codebase to the last stable state.
- **100% Test Suite Pass Rate:** All unit and end-to-end tests must pass. Test coverage should not decrease.
- **Zero Regression:** All primary features and critical user flows of the application must be fully functional and visually identical to the pre-migration state.
- **100% Component, Module, and Import Migration:** All components, modules, and imports must be fully migrated to the target version's standards. This includes:
    - No more deprecated APIs in use.
    - All components correctly using modern patterns (e.g., standalone components, new control flow syntax).
    - All module imports (`NgModule` and ES6 imports) are correct and optimized.
- **No Console Errors:** The application runs in the browser with a clean console at startup and during interaction with key features.

### Acceptance Criteria
- **Version Alignment:** `package.json` confirms that all `@angular/*` packages and their dependencies are aligned to the exact target version.
- **Clean Installation:** `npm install` completes without any peer dependency errors (unless explicitly accepted as a low-risk item).
- **Successful Application Launch:** The application launches successfully using `ng serve` and is accessible in the browser.
- **Automated Verification:** The entire verification process (build, test, lint) is automated and runs successfully in a CI/CD-like environment.
- **Full Agent Automation:** The entire migration process is executed by an agent with full, autonomous control over the command line, requiring zero human intervention for prompts, decisions, or error handling.

### Migration Experience Learnings
- **Windows Environment:** Be aware of potential file-locking issues with the `node_modules` directory. Plan for a "Clean Sweep" task using `rimraf` as a standard procedure between version jumps to prevent state corruption.
- **Bootstrapping:** The `main.ts` file is a critical point of failure. Ensure the bootstrapping method (`bootstrapModule` vs. `bootstrapApplication`) is correct for the target Angular version and architecture (module-based vs. standalone).
- **Standalone Components:** A common error source is the incorrect declaration of standalone components. They must be in the `imports` array of an `NgModule` or the component they are used in, not `declarations`. Plan for a verification step to check this.
- **Final Report:** The `implementation_log.md` is generated and shows a successful migration.

### Final Report and Execution Plan
The final output is the `migration_plan.md`, which includes:
- **Executive Summary:** A high-level overview of the migration goals and timeline.
- **Phased Execution Plan:** A detailed, ordered list of tasks, grouped by phase, with dependencies and validation criteria for each.
- **Contingency Planning:** The plan must now also include contingencies for:
    - **Interactive Prompts:** Note which steps might involve interactive prompts and define the default selection strategy.
    - **Potential Escalation:** Acknowledge the escalation protocol and define what constitutes a "novel error" that would trigger it.

### Rollback Capability
- **Mechanism:** If any phase of the migration fails catastrophically, the agent must have the capability to revert the codebase to its previous state. This is achieved by using Git to reset the changes.
- **Trigger:** A failure is defined as an unresolvable build error or a critical test failure that cannot be fixed within a predefined time limit.
- **Looping for Success:** If a rollback occurs, the process does not terminate. The agent will re-evaluate the failed step, adjust the plan, and re-attempt the migration. This loop continues until the migration for that version is successfully achieved or the escalation protocol is triggered.