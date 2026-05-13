---
name: Angular Migration Unit Testing
description: >
  Manages and executes unit tests to ensure application stability during the v16 -> v17 migration.
  Updates tests to be compatible with Angular v17 and verifies that all tests pass.

scope:
  - Angular v16 -> v17 only

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
