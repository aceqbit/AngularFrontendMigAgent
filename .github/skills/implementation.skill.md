---
name: Angular Migration Implementation
description: >
  Executes the migration plan by applying code and configuration changes in a controlled, step-by-step manner.
  This skill is responsible for all file modifications, dependency updates, and build validations.

notes:
  - Active scope is v17 -> v18 only; broader version-jump wording is historical.

dependencies:
  - `planning.skill.md`

inputs:
  - `plan/migration_plan.md`

tasks:
  - task: Execute tasks for the current migration phase.
    instructions:
      - Read the next task from `plan/migration_plan.md`.
      - Apply the specified code or configuration changes to the relevant files.
      - Use tools to perform automated refactoring where possible.
      - If the CLI presents an optional migration prompt, always choose the recommended/default option or the first option, then continue without user input.
      - If progress stalls, immediately record the blocker and the next recovery move in the log before taking the smallest viable recovery action.

  - task: Update dependencies.
    instructions:
      - Run `ng update` or `npm install` to update Angular and third-party packages as defined in the plan.
      - Use `--force` or `--legacy-peer-deps` only when explicitly instructed by the plan.
      - After each completed version migration, run `git status`, create the commit, and push it before moving to the next version.

  - task: Validate each step.
    instructions:
      - After every significant change, run `ng build` to ensure the project still compiles.
      - If a build fails, attempt to fix the issue or trigger the rollback procedure.
      - Treat build warnings tied to the migration as cleanup items that must be resolved or explicitly recorded.

  - task: Detect and fix zone/change detection issues.
    instructions:
      - After applying code changes, scan for components using `setInterval()`, `setTimeout()`, direct event handlers, or other async callbacks that mutate component data.
      - If found, verify that the component has one of the following:
        1. `ChangeDetectorRef.markForCheck()` called after data mutations in the callback, OR
        2. Data mutations wrapped inside `this.ngZone.run(() => { ... })`, OR
        3. Mutations happening inside proper RxJS subscriptions (which are automatically managed by Angular)
      - If none of these patterns are present, the component is **broken post-migration** and must be fixed before committing.
      - Document the fix in the implementation log: "Fixed zone/change detection in [Component]" with the pattern used.
      - This is a **runtime defect** that won't be caught by compilation or basic unit tests; it only appears during actual user interaction with the component.

  - task: Log all actions.

    - task: Execute per-version migration plans sequentially.
      instructions:
        - Read `plan/migration_plan.md` to understand the master index and sequence of all 5 version-specific plans.
        - Execute one version plan at a time; active sequence: v17→v18. Other versions are retained as historical templates and should not be executed during this run.
        - For each version plan:
          1. Read the plan file (e.g., `plan/migration_v17_to_v18.md`; historical `plan/migration_v16_to_v17.md` retained for reference)
          2. Execute ALL tasks in that plan fully, respecting all phases and validation gates
          3. After all tasks complete, trigger the validation gates (build, test, lint) for that version
          4. If ALL gates pass: Create git checkpoint with commit message "chore: complete Angular [VERSION] migration"
          5. Run `git push origin main` to push the checkpoint immediately
          6. Verify git push succeeded before proceeding
          7. Only then read the next version plan and repeat from step 1
        - If any gate FAILS for a version, do NOT proceed to the next version. Halt and escalate with the specific failure and recovery options.
        - This atomic sequencing prevents catastrophic midway failures and enables rollback to any version checkpoint.
        - Log all version completions, gate results, and git checkpoints to `report/implementation_log.md`.

    - task: Log all actions.
    instructions:
      - Maintain a detailed log of every command run and file modified.
      - Record the output of all build and test commands.
      - Save the log to `report/implementation_log.md`.
      - Note any stalled step together with the exact next move so recovery never goes blank.
      - After a version jump completes, log the git status, commit, and push result before the next step starts.
    output: `report/implementation_log.md`
---
