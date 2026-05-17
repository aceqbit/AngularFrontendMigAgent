---
name: Angular Migration Documentation
description: >
  Documents the Angular 18 → 19 migration process, creating a comprehensive record of all changes, decisions, and outcomes.
  This skill ensures that the project's documentation is updated to reflect the new, migrated state.

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
      - Create a new section in the project's main `README.md` or a dedicated `migration-summary.md` to document these changes for future developers.

  - task: Generate the final documentation.
    instructions:
      - Create a clean, well-formatted Markdown file that serves as the definitive record of the migration.
      - Include links to all generated reports.
      - Save the final document to `docs/documentation.md`.
    output: `docs/documentation.md`
---
