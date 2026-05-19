---
name: Angular Migration Planning
description: >
  Constructs a detailed, phased migration plan based on the findings from the assessment report.
  This skill breaks down the migration into sequential, manageable tasks and defines the strategy for each version jump.

dependencies:
  - `assessment.skill.md`

inputs:
  - `report/assessment_report.md`

tasks:
  - task: Decompose assessment findings into a phased roadmap.
    instructions:
      - Parse `report/assessment_report.md` to extract all identified issues.
      - Group issues
       into logical phases (e.g., Core Updates, Dependency Fixes, Refactoring).
      - Create a strict, sequential plan for the Angular 20 → 21 jump only.

  - task: Define tasks, risks, and validation criteria for each phase.
    instructions:
      - For each task, specify the files to be modified and the actions to be taken.
      - Assign a risk level (Low, Medium, High) to each task.
      - Define clear validation criteria (e.g., "Build succeeds," "All tests pass").

  - task: Incorporate rollback procedures.
    instructions:
      - For each high-risk phase, define a clear rollback plan to revert changes if the migration step fails.
      - Specify the trigger conditions for a rollback.

  - task: Plan zone & change detection fixes (Angular 21).
    instructions:
      - Extract all findings from the "Zone/Change Detection Risks" section of the assessment report.
      - For each flagged component, create a task that:
        1. Identifies the problematic async pattern (setInterval, setTimeout, event handler, etc.).
        2. Specifies which fix strategy to use (markForCheck, NgZone.run, or RxJS refactor).
        3. Includes unit test creation to verify template updates after data mutations.
        4. Lists the exact file paths and line numbers to be modified.
      - Mark all zone/change detection fixes as **P0 (Must Have)** priority and assign them to Phase 4b.
      - These tasks must be completed before Phase 5 cleanup and validation, as they are breaking changes for Angular 21.

  - task: Generate the Migration Plan.
    instructions:
      - Compile all phases, tasks, and metadata into a comprehensive `migration_plan.md`.
      - The plan must be ordered and easy to follow.
    output: `plan/migration_plan.md`

    - task: Generate per-version migration plans.
      instructions:
        - Generate FIVE separate, atomic migration plan files, one for each version jump:
          1. `plan/migration_v20_to_v21.md` — All tasks, phases, validation gates, rollback triggers for v20→v21 only
        - Each plan file must be INDEPENDENT and include:
          - Target version range (e.g., "Angular 20 → 21")
          - Phase breakdown specific to that version
          - Validation gates (build, test, lint) for that version
          - Rollback trigger conditions and procedures for that version
          - Git checkpoint name (e.g., "v21-stable")
          - Success criteria for that version
          - Specific file changes required ONLY for that version
          - Next version statement: "Migration complete"
        - Create `plan/migration_plan.md` as the master INDEX listing the final plan with brief descriptions and links.
        - **CRITICAL**: Do NOT cross-reference or create dependencies beyond the final jump.
        - Rationale: User experienced catastrophic midway failures with monolithic plans. Focusing on the final jump keeps the workflow narrow and predictable.
      outputs:
        - `plan/migration_v20_to_v21.md`
        - `plan/migration_plan.md` (master index)
---
