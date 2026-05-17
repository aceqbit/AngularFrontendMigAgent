---
name: Angular Migration Planning
description: >
  Constructs a detailed, phased migration plan based on the findings from the assessment report.
  This skill breaks down the migration into sequential, manageable tasks and defines the strategy for the Angular 18 → 19 jump.

dependencies:
  - `assessment.skill.md`

inputs:
  - `report/assessment_report.md`

tasks:
  - task: Decompose assessment findings into a phased roadmap.
    instructions:
      - Parse `report/assessment_report.md` to extract all identified issues.
      - Group issues into logical phases (e.g., Core Updates, Dependency Fixes, Refactoring).
      - Create a strict, sequential plan for the Angular 18 → 19 jump.

  - task: Define tasks, risks, and validation criteria for each phase.
    instructions:
      - For each task, specify the files to be modified and the actions to be taken.
      - Assign a risk level (Low, Medium, High) to each task.
      - Define clear validation criteria (e.g., "Build succeeds," "All tests pass").

  - task: Incorporate rollback procedures.
    instructions:
      - For each high-risk phase, define a clear rollback plan to revert changes if the migration step fails.
      - Specify the trigger conditions for a rollback.

  - task: Plan runtime behavior checks for the 18 → 19 jump.
    instructions:
      - Extract any runtime behavior findings from the assessment report.
      - For each flagged component, create a task that identifies the relevant async or callback-driven pattern.
      - Include unit test creation to verify template updates after data mutations.
      - List the exact file paths and line numbers to be modified.
      - Mark the highest-risk checks as **P0 (Must Have)** priority.

  - task: Generate the Migration Plan.
    instructions:
      - Compile all phases, tasks, and metadata into a comprehensive `migration_plan.md`.
      - The plan must be ordered and easy to follow.
    output: `plan/migration_plan.md`

    - task: Generate the 18 → 19 migration plan.
      instructions:
        - Generate one atomic migration plan file:
          1. `plan/migration_v18_to_v19.md` — All tasks, phases, validation gates, rollback triggers for the 18→19 jump only
        - The plan file must be INDEPENDENT and include:
          - Target version range (e.g., "Angular 18 → 19")
          - Phase breakdown specific to that version
          - Validation gates (build, test, lint) for that version
          - Rollback trigger conditions and procedures for that version
          - Git checkpoint name (e.g., "v19-stable")
          - Success criteria for that version
          - Specific file changes required ONLY for that version
          - Completion statement: "Upon success, the migration is complete."
        - Create `plan/migration_plan.md` as a master INDEX listing the single version-specific plan with a brief description and link.
        - **CRITICAL**: Do NOT cross-reference or create dependencies with other version plans in the files themselves. The plan must be complete and standalone.
        - Rationale: User experienced catastrophic midway failures with monolithic plans. A single atomic plan prevents cross-version corruption and simplifies recovery.
      outputs:
        - `plan/migration_v18_to_v19.md`
        - `plan/migration_plan.md` (master index)
---
