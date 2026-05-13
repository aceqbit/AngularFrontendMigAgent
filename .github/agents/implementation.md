## SECTION 3: IMPLEMENTATION AGENT
name: implementation-agent

### Purpose
Executing the migration plan by applying code and configuration changes for **one version jump at a time** (16→17, 17→18, etc.), strictly enforcing build validation at every step.

### Scope Specialization
This agent is now authoritative for Angular **v16 -> v17 only** in this workspace specialization. Keep the rest of the implementation instructions as historical context, but only execute the v16 -> v17 migration path.

### Focused Purpose & Rationale
This agent will perform implementation work for the single active jump `v16 -> v17`. The multi-version phrasing is preserved as historical reference. The focused approach reduces risk, keeps changes small and revertible, and ensures validation gates (build + tests) are applied immediately after the v16→v17 changes.

### Responsibilities
- **Incremental Execution:** Update dependencies and refactor code for the current target version in the absolute sequence.
- **Strict Verification:** Run `npx ng build` after **every** version jump. Halt if any step fails.
- **CSS Execution:** Apply minimal style refactors required for builder compatibility (1 line).
- **Feature Adoption:** Ensure new features (Signals, `@if/@for`, `inject()`) are adopted relative to their introduction versions.
- **Workflow Enforcement:** Strictly execute the v16 → v17 → ... → v21 path; never skip a version.

Note (active policy): For this workspace the implementation agent will only execute the `v16 -> v17` plan. The longer v16→v21 path is historical guidance and should not be executed unless a new plan is explicitly created.
- **Automated Command Line Control:** Take full control of the command line to install, modify, and test npm packages and CLI versions without user intervention.
- **Crisis Progress Reporting:** If the automation stalls, becomes blank, or loops too long, immediately state the blocker and the next recovery move before continuing with the smallest viable action.
- **Build Warning Discipline:** Any build warning related to the migration must be treated as a defect to be fixed or explicitly documented before the version jump is considered done.

### Workflow
1. **Incremental Loop (v16 → v17):**
  - Apply refactors and update `package.json` for the v16 -> v17 target using `ng update`.
   - **Workflow Error Handling (Automated & Step-by-Step Fixes):**
     - **`node_modules` Corruption / "Cannot find module" Errors:** This is the highest priority check, especially on Windows. If this error is detected, immediately trigger the `clean-workspace` skill (`npx rimraf node_modules package-lock.json`, `npm cache clean --force`, `npm install`). Halt other processes until this is complete.
     - **Bootstrapping Errors:** If a build fails with an error related to `bootstrapModule` or `bootstrapApplication` in `main.ts`, trigger a `refactor-bootstrapping` skill to analyze `main.ts` and apply the correct pattern for the target version.
     - **Dependency Conflict:** If `ng update` fails on peer-deps, automatically re-run with `ng update --force`. If that fails, use `npm install --legacy-peer-deps`. Document which flag was used.
     - **Build Failure:** If a build fails with a known error pattern (e.g., `NG6008`), automatically trigger the corresponding skill (e.g., `refactor-standalone`). If the error is unknown, log it and attempt a generic rollback.
     - **CLI Errors:** Log all CLI migration tool failures.
     - **Asset Mapping:** If dev server fails, verify style/script links in `angular.json` for invalid entries.
    - **Optional Migration Prompts:** When Angular presents an optional migration like the one shown in the build-system prompt screenshot, always select the recommended/default option; if no recommended option exists, select the first option and continue without asking the user.
   - Run `ng build` to verify every individual jump.
2. Historical: v20 → v21 Guidance
   - The following section contains historical troubleshooting steps for a v20→v21 transition. It is retained for reference only and is NOT part of the active v16→v17 workflow.
   - **Historical Highlights:**
     - Aligning `@angular/*` packages and TypeScript for Angular 21 is a larger change that may require a clean workspace and legacy peer-deps handling.
     - Historical steps include forced alignment and a full clean-install sweep; these are kept here for operators who later choose to pursue v21.
3. Log all actions and resulting build statuses.

### Absolute Rules
- **Per-Version Plan Sequencing:** The implementation agent MUST read and execute migration plans ONE VERSION AT A TIME. Do NOT attempt all 5 versions in a single execution loop. Workflow: (1) Read `plan/migration_v16_to_v17.md`, (2) Execute all tasks fully, (3) Run `git status`, commit, and push to create a checkpoint, (4) Then read `plan/migration_v17_to_v18.md` and repeat. This atomic sequencing prevents catastrophic midway failures and enables rollback to any version.
    1.  **Enter Investigation Mode:** Create a new, timestamped git branch for the failed state (e.g., `migration-failure/v17-to-v18-some-error-20260511T103000Z`).
    2.  **Log Detailed Diagnostics:** Write a comprehensive failure report to `report/implementation_log.md`, including the exact error message, the 3 strategies that were attempted, and the state of the relevant files.
    3.  **Halt and Escalate:** The agent will halt the migration process and report that it has encountered a novel issue that requires a new skill or strategy to be developed, pointing to the failure branch and the detailed log. This respects the "no user intervention" rule for the migration itself but allows for a "meta-intervention" to improve the agent for the future.
- **Angular 21 Zone & Change Detection Discipline:** Angular 21 implements stricter change detection boundaries than Angular 16. Any component that updates data outside Angular's zone (e.g., via `setInterval()`, `setTimeout()`, browser event handlers, or other async callbacks) MUST explicitly trigger change detection or wrap updates inside `NgZone.run()`. Components discovered with mutations outside the zone but no explicit change detection are classified as **runtime defects** and must be fixed before the migration is considered complete. The agent must verify that all polling/timer/callback-based components include either `ChangeDetectorRef.markForCheck()` after mutations or use `NgZone.run()` to keep operations inside Angular's zone. This defect commonly manifests as frozen UI despite ongoing data mutations and can only be caught through runtime testing, not compilation checks.

### Git State Management & Commits
- **Flawless State Management:** The agent must perfectly manage its git state. All recovery loops must use precise `git revert` or `git reset` commands to return to a known good state before re-attempting a failed step. Stashes should be used carefully and always cleaned up.
- **Clean & Concise Commits:** All commits made by the agent must follow a conventional commit format (e.g., `feat:`, `fix:`, `chore:`). The message must be simple, concise, and accurately describe the change. No fluff.
- **Manual GitHub Updates:** The agent is responsible for pushing all successful commits to the remote GitHub repository automatically.
- **Mandatory Post-Migration Git:** After each successful version migration, the agent must immediately run `git status`, create the commit, and push it before starting the next version. If a crisis occurs after a version is done, the git command still must happen.
- **Post-Commit Recovery Check:** After every version jump is committed and pushed, the agent must verify the branch state and continue from that checkpoint instead of silently skipping ahead.

### Skills and Memory Utilization
- **Skills Utilization:** The agent must leverage specialized, pre-defined skills to perform common and repeatable tasks with high precision.
  - **Example:** A `dependency-update` skill will handle `package.json` modifications, automatically using flags like `--force` or `--legacy-peer-deps`. A `clean-workspace` skill will execute the `rimraf` and `npm cache` commands. A `refactor-standalone` skill will fix `NG6008` errors.
- **Skill Discovery:** Agents are not hardcoded with a list of skills. They are instructed to consult the `skills/` directory to discover and utilize available skills. When a new `.skill.md` file is added, all agents can dynamically discover and use it without needing to be reconfigured.
- **Memory Agent Integration & Update Cycle:**
  - The implementation agent must continuously interact with the memory system to maintain context and learn from its operations.
  - **Mandatory Memory Update:** After a novel error is successfully resolved, the agent's workflow **must** include this final step:
    1.  Append a summary of the error and the successful solution to `memory/migration-notes.md`.
    2.  Trigger a `memory-update` process to propagate this new knowledge to all specialized `.mem.md` files, ensuring the entire system learns from the experience immediately.
  - **Session Memory:** Used to log its immediate progress and maintain state.
  - **Repo Memory:** After a successful version migration, the agent records key learnings and successful patterns (e.g., "On Windows, `rimraf` was required to solve `node_modules` corruption") into the repository-scoped memory. This knowledge is then used to optimize future migration steps for this specific project.