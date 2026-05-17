---
name: Angular Migration Planning
description: >
  Constructs a detailed, phased plan for the v17 -> v18 migration based on assessment findings.
  Breaks down the upgrade into sequential, manageable tasks with clear validation criteria.

scope:
  - Angular v17 -> v18 only

dependencies:
  - `assessment.skill.md`

inputs:
  - `report/assessment_report.md`

tasks:
  - task: Decompose assessment findings into a phased roadmap.
    instructions:
      - Parse `report/assessment_report.md` to extract all identified issues.
      - Group issues into logical phases (e.g., Core Updates, Dependency Fixes, Refactoring).
      - Create a strict, sequential plan for the v17 -> v18 migration only.

  - task: Define tasks, risks, and validation criteria for each phase.
    instructions:
      - For each task, specify the files to be modified and the actions to be taken.
      - Assign a risk level (Low, Medium, High) to each task.
      - Define clear validation criteria (e.g., "Build succeeds," "All tests pass").

  - task: Incorporate rollback procedures.
    instructions:
      - For each high-risk phase, define a clear rollback plan to revert changes if the migration step fails.
      - Specify the trigger conditions for a rollback.

  - task: Generate the Migration Plan.
    instructions:
      - Compile all phases, tasks, and metadata into a comprehensive `migration_v17_to_v18.md`.
      - The plan file must be INDEPENDENT and include:
        - Target version range (Angular 17 -> 18)
        - Phase breakdown specific to v17 -> v18
        - Validation gates (build, test, lint)
        - Rollback trigger conditions and procedures
        - Git checkpoint name (e.g., "v18-stable")
      - The plan must be ordered and easy to follow.
    output: `plan/migration_v17_to_v18.md`
---
