---
name: Angular Migration Implementation
description: >
  Executes the migration plan by applying code and configuration changes in a controlled, step-by-step manner.
  This skill is responsible for all file modifications, dependency updates, and build validations for Angular 18 → 19.

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
      - After the completed 18 → 19 migration, run `git status`, create the commit, and push it before closing the task.

  - task: Validate each step.
    instructions:
      - After every significant change, run `ng build` to ensure the project still compiles.
      - If a build fails, attempt to fix the issue or trigger the rollback procedure.
      - Treat build warnings tied to the migration as cleanup items that must be resolved or explicitly recorded.

  - task: Detect and fix runtime behavior issues relevant to the migration.
    instructions:
      - After applying code changes, scan for components using `setInterval()`, `setTimeout()`, direct event handlers, or other async callbacks that mutate component data.
      - If found, verify that the component has targeted test coverage or an explicit runtime note in the implementation log.
      - If a changed component is unstable, the component is **broken post-migration** and must be fixed before committing.
      - Document the fix in the implementation log with the pattern used.
      - This is a runtime defect that won't be caught by compilation or basic unit tests; it only appears during actual user interaction with the component.

  - task: Log all actions.

    - task: Execute the 18 → 19 migration plan sequentially.
      instructions:
        - Read `plan/migration_plan.md` to understand the migration scope and sequence.
        - Read `plan/migration_v18_to_v19.md` and execute all tasks in that plan fully, respecting all phases and validation gates.
        - After all tasks complete, trigger the validation gates (build, test, lint) for the migration step.
        - If all gates pass: Create a git checkpoint with commit message `chore: complete Angular 19 migration`.
        - Run `git push origin main` to push the checkpoint immediately.
        - Verify git push succeeded before closing the task.
        - If any gate fails, halt and escalate with the specific failure and recovery options.
        - Log all migration completion details, gate results, and git checkpoints to `report/implementation_log.md`.

    - task: Log all actions.
    instructions:
      - Maintain a detailed log of every command run and file modified.
      - Record the output of all build and test commands.
      - Save the log to `report/implementation_log.md`.
      - Note any stalled step together with the exact next move so recovery never goes blank.
      - After a version jump completes, log the git status, commit, and push result before the next step starts.
    output: `report/implementation_log.md`
---
