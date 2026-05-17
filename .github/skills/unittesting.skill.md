---
name: Angular Migration Unit Testing
description: >
  Manages and executes unit tests to ensure the application remains stable throughout the Angular 18 → 19 migration.
  This skill is responsible for updating tests to be compatible with the target version and verifying that all tests pass.

dependencies:
  - `implementation.skill.md`

tasks:
  - task: Update outdated test configurations.
    instructions:
      - Modify `karma.conf.js` and `tsconfig.spec.json` to align with Angular 19.
      - Update testing libraries like Jasmine and Karma as needed.
    files:
      - `karma.conf.js`
      - `tsconfig.spec.json`
    notes:
      - Prefer minimal test-config changes that keep the suite moving instead of broad rewrites.

  - task: Refactor deprecated testing APIs.
    instructions:
      - Scan all `*.spec.ts` files for deprecated testing utilities and APIs.
      - Refactor tests to use the modern, recommended APIs.
      - When many modules fail together, isolate the first failing spec or the changed feature area before expanding the fix.

  - task: Run the full unit test suite.
    instructions:
      - Execute `ng test` with the `--watch=false` flag to run all tests once after the focused specs pass.
      - If the suite is too heavy or fails across many modules, switch to targeted specs for the changed area first, then retry the full suite.
      - Ensure that the command exits with a zero status code, indicating all tests passed.
      - If a failure affects many modules, start with the smallest changed area and report the next recovery move before re-running the broad suite.

  - task: Test runtime behavior coverage for the 18 → 19 jump.
    instructions:
      - For each component that was touched by the migration, verify that targeted tests exist.
      - Tests should cover the changed behavior with focused assertions and any required async helpers.
      - Run the tests for the affected components before running the full suite.
      - Document which components have targeted coverage and their status in the test report.

  - task: Generate the Test Report.
    instructions:
      - Capture the output of the test run.
      - Summarize the results, including the number of tests passed, failed, and skipped.
      - Save the report to `report/test_report.md`.
      - Include the next recovery step whenever a run fails so the process does not stall or go blank.
      - Call out any build-warning-to-test-warning pattern so it can be cleaned up deliberately.
    output: `report/test_report.md`
---
