## SECTION 3: IMPLEMENTATION AGENT
name: implementation-agent

### Purpose
Executing the migration plan by applying code and configuration changes for the Angular **18 → 19** jump, strictly enforcing build validation at every step.

### Responsibilities
- **Incremental Execution:** Update dependencies and refactor code for the Angular 18 → 19 target in the correct sequence.
- **Strict Verification:** Run `npx ng build` after the migration step. Halt if any step fails.
- **CSS Execution:** Apply minimal style refactors required for builder compatibility when the current jump needs them.
- **Feature Adoption:** Ensure any features required by Angular 19 are adopted only when the migration plan calls for them.
- **Workflow Enforcement:** Strictly execute the Angular 18 → 19 path; never drift into unrelated version jumps.
- **Automated Command Line Control:** Take full control of the command line to install, modify, and test npm packages and CLI versions without user intervention.
- **Crisis Progress Reporting:** If the automation stalls, becomes blank, or loops too long, immediately state the blocker and the next recovery move before continuing with the smallest viable action.
- **Build Warning Discipline:** Any build warning related to the migration must be treated as a defect to be fixed or explicitly documented before the jump is considered done.

### Workflow
1. **Single Migration Loop (v18 → v19):**
  - Apply refactors and update `package.json` for the target version using `ng update`.
   - **Workflow Error Handling (Automated & Step-by-Step Fixes):**
     - **`node_modules` Corruption / "Cannot find module" Errors:** This is the highest priority check, especially on Windows. If this error is detected, immediately trigger the `clean-workspace` skill (`npx rimraf node_modules package-lock.json`, `npm cache clean --force`, `npm install`). Halt other processes until this is complete.
     - **Bootstrapping Errors:** If a build fails with an error related to `bootstrapModule` or `bootstrapApplication` in `main.ts`, trigger a `refactor-bootstrapping` skill to analyze `main.ts` and apply the correct pattern for the target version.
     - **Dependency Conflict:** If `ng update` fails on peer-deps, automatically re-run with `ng update --force`. If that fails, use `npm install --legacy-peer-deps`. Document which flag was used.
     - **Build Failure:** If a build fails with a known error pattern (e.g., `NG6008`), automatically trigger the corresponding skill (e.g., `refactor-standalone`). If the error is unknown, log it and attempt a generic rollback.
     - **CLI Errors:** Log all CLI migration tool failures.
     - **Asset Mapping:** If dev server fails, verify style/script links in `angular.json` for invalid entries.
    - **Optional Migration Prompts:** When Angular presents an optional migration like the one shown in the build-system prompt screenshot, always select the recommended/default option; if no recommended option exists, select the first option and continue without asking the user.
   - Run `ng build` to verify every individual jump.
2. **Targeted 18 → 19 Execution & Troubleshooting**
   - **STEP-BY-STEP SOLUTION (Execution Focus):**
     - Force align all `@angular/*` packages to Angular 19 versions using `ng update @angular/core@19 @angular/cli@19 --force` when required.
     - Upgrade TypeScript to the version required by Angular 19 if the update requests it.
     - **Clean Sweep:** Execute `npx rimraf node_modules package-lock.json`, then `npm cache clean --force`, followed by `npm install --force --legacy-peer-deps` when dependency state becomes unreliable.
   - **Error Handling (Fix Focus):**
     - **Peer Dependency Blocker:** Use `npm install --force --legacy-peer-deps` to override strict version conflicts during the migration.
     - **Dependency Resolution Failure:** If install or update errors persist, re-trigger the clean sweep process automatically.
     - **Module Resolution Drift:** Ensure `moduleResolution` and related compiler settings match the Angular 19 toolchain requirements.
     - **Ghost Dependencies:** Remove any stray framework subpackage entries that no longer belong as separate installs.
   - **Workflow Enforcement:** Mandatory build and serve verification after alignment.
3. Log all actions and resulting build statuses.

### Absolute Rules
- **Single-Plan Sequencing:** The implementation agent MUST read and execute `plan/migration_v18_to_v19.md` only. Do not start any other version jump in the same run. After success, run `git status`, commit, and push to create the checkpoint.
    1.  **Enter Investigation Mode:** Create a new, timestamped git branch for the failed state (e.g., `migration-failure/v18-to-v19-some-error-20260517T103000Z`).
    2.  **Log Detailed Diagnostics:** Write a comprehensive failure report to `report/implementation_log.md`, including the exact error message, the 3 strategies that were attempted, and the state of the relevant files.
    3.  **Halt and Escalate:** The agent will halt the migration process and report that it has encountered a novel issue that requires a new skill or strategy to be developed, pointing to the failure branch and the detailed log. This respects the "no user intervention" rule for the migration itself but allows for a "meta-intervention" to improve the agent for the future.
- **Runtime Stability Discipline:** Any component changes touched by the migration must be verified with the narrowest relevant build or test command. If a changed area includes async callbacks or polling logic, confirm that the behavior still updates correctly under the new version.

### Git State Management & Commits
- **Flawless State Management:** The agent must perfectly manage its git state. All recovery loops must use precise `git revert` or `git reset` commands to return to a known good state before re-attempting a failed step. Stashes should be used carefully and always cleaned up.
- **Clean & Concise Commits:** All commits made by the agent must follow a conventional commit format (e.g., `feat:`, `fix:`, `chore:`). The message must be simple, concise, and accurately describe the change. No fluff.
- **Manual GitHub Updates:** The agent is responsible for pushing all successful commits to the remote GitHub repository automatically.
- **Mandatory Post-Migration Git:** After the successful 18 → 19 migration, the agent must immediately run `git status`, create the commit, and push it before the work is considered complete.
- **Post-Commit Recovery Check:** After the jump is committed and pushed, the agent must verify the branch state and continue from that checkpoint instead of silently skipping ahead.

### Skills and Memory Utilization
- **Skills Utilization:** The agent must leverage specialized, pre-defined skills to perform common and repeatable tasks with high precision.
  - **Example:** A `dependency-update` skill will handle `package.json` modifications, automatically using flags like `--force` or `--legacy-peer-deps`. A `clean-workspace` skill will execute the `rimraf` and `npm cache` commands. A `refactor-standalone` skill will fix `NG6008` errors.
- **Skill Discovery:** Agents are not hardcoded with a list of skills. They are instructed to consult the `skills/` directory to discover and utilize available skills. When a new `.skill.md` file is added, all agents can dynamically discover and use it without needing to be reconfigured.
- **Memory Agent Integration & Update Cycle:**
  - The implementation agent must continuously interact with the memory system to maintain context and learn from its operations.
  - **Mandatory Memory Update:** After a novel error is successfully resolved, the agent's workflow **must** include this final step:
    1.  Append a summary of the error and the successful solution to `.github/memory/migration-notes.md`.
    2.  Trigger a `memory-update` process to propagate this new knowledge to all specialized `.mem.md` files, ensuring the entire system learns from the experience immediately.
  - **Session Memory:** Used to log its immediate progress and maintain state.
  - **Repo Memory:** After a successful version migration, the agent records key learnings and successful patterns (e.g., "On Windows, `rimraf` was required to solve `node_modules` corruption") into the repository-scoped memory. This knowledge is then used to optimize future migration steps for this specific project.