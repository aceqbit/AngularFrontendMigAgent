---
name: Angular Migration Unit Testing
description: >
  Manages and executes unit tests to ensure the application remains stable throughout the migration process.
  This skill is responsible for updating tests to be compatible with new Angular versions and verifying that all tests pass.

notes:
  - Active scope is v17 -> v18 only; keep broader version references as historical context.

dependencies:
  - `implementation.skill.md`

tasks:
  - task: Update outdated test configurations.
    instructions:
      - Modify `karma.conf.js` and `tsconfig.spec.json` to align with the new Angular version.
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

  - task: Test zone & change detection fixes (Angular 21).
    instructions:
      - For each component that received a zone/change detection fix (Phase 4b), verify that tests exist.
      - Tests must include:
        1. Mock `setInterval`, `setTimeout`, or event handlers using `jasmine.clock()` or `fakeAsync()`.
        2. Trigger the async operation (e.g., tick the clock forward).
        3. Assert that the component's template values have updated (use fixture detection and change detection cycle verification).
        4. Example for `setInterval`: Use `fakeAsync()`, call the component method that starts the interval, call `tick(1000)`, then verify `fixture.detectChanges()` and check that the template shows updated values.
      - These tests must PASS; otherwise, the component is still broken in Angular 21.
      - Run tests for the affected components before running the full suite.
      - Document which components have zone/change detection tests and their status in the test report.

  - task: Generate the Test Report.
    instructions:
      - Capture the output of the test run.
      - Summarize the results, including the number of tests passed, failed, and skipped.
      - Save the report to `report/test_report.md`.
      - Include the next recovery step whenever a run fails so the process does not stall or go blank.
      - Call out any build-warning-to-test-warning pattern so it can be cleaned up deliberately.
    output: `report/test_report.md`
---
