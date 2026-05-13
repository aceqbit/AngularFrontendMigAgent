---
name: Angular Migration Implementation
description: >
  Executes the migration plan by applying code and configuration changes in a controlled, step-by-step manner.
  This skill is responsible for all file modifications, dependency updates, and build validations.

scope:
  - Angular v16 -> v17 only in this workspace specialization

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

  - task: Update dependencies.
    instructions:
      - Run `ng update` or `npm install` to update Angular and third-party packages as defined in the v16 -> v17 plan.
      - Use `--force` or `--legacy-peer-deps` only when explicitly instructed by the plan.

  - task: Validate each step.
    instructions:
      - After every significant change, run `ng build` to ensure the project still compiles.
      - If a build fails, attempt to fix the issue or trigger the rollback procedure.

  - task: Log all actions.
    instructions:
      - Maintain a detailed log of every command run and file modified.
      - Record the output of all build and test commands.
      - Save the log to `report/implementation_log.md`.
    output: `report/implementation_log.md`
---
