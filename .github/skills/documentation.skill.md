---
name: Angular Migration Documentation
description: >
  Documents the v16 -> v17 migration process, recording all changes, decisions, and outcomes.
  Ensures project documentation reflects the post-migration state and future developer guidance.

scope:
  - Angular v16 -> v17 only

dependencies:
  - `implementation.skill.md`
  - `unittesting.skill.md`

inputs:
  - `report/assessment_report.md`
  - `plan/migration_plan.md`
  - `report/implementation_log.md`
  - `report/test_report.md`

tasks:
  - task: Consolidate all reports into a final summary.
    instructions:
      - Read all input reports.
      - Synthesize the information into a high-level executive summary of the migration.

  - task: Document new architectural patterns and best practices.
    instructions:
      - Identify significant changes made during the migration (e.g., adoption of standalone components, new control flow syntax).
      - Create a new section in the project's main `README.md` or a dedicated `migration-summary.md` to document the v16 -> v17 changes for future developers.

  - task: Generate the final documentation.
    instructions:
      - Create a clean, well-formatted Markdown file that serves as the definitive record of the migration.
      - Include links to all generated reports.
      - Save the final document to `docs/documentation.md`.
    output: `docs/documentation.md`
---
