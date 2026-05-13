---
name: Angular Migration Unit Testing
description: >
  Manages and executes unit tests to ensure the application remains stable throughout the migration process.
  This skill is responsible for updating tests to be compatible with new Angular versions and verifying that all tests pass.

scope:
  - Angular v16 -> v17 only in this workspace specialization

dependencies:
  - `implementation.skill.md`

tasks:
  - task: Update outdated test configurations.
    instructions:
      - Modify `karma.conf.js` and `tsconfig.spec.json` to align with the new Angular version.
      - Update testing libraries like Jasmine and Karma as needed for the v16 -> v17 migration.
    files:
      - `karma.conf.js`
      - `tsconfig.spec.json`

  - task: Refactor deprecated testing APIs.
    instructions:
      - Scan all `*.spec.ts` files for deprecated testing utilities and APIs.
      - Refactor tests to use the modern, recommended APIs.

  - task: Run the full unit test suite.
    instructions:
      - Execute `ng test` with the `--watch=false` flag to run all tests once.
      - Ensure that the command exits with a zero status code, indicating all tests passed.

  - task: Generate the Test Report.
    instructions:
      - Capture the output of the test run.
      - Summarize the results, including the number of tests passed, failed, and skipped.
      - Save the report to `report/test_report.md`.
    output: `report/test_report.md`
---
