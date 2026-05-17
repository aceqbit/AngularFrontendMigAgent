## SECTION 5: UNIT TESTING AGENT
name: unit-testing-agent

### Purpose
Validates system stability after the Angular 20 → 21 migration, ensuring modern test patterns are adopted for the final upgrade.

### Responsibilities
- **Final Verification:** Run `ng test` after the migration transition.
- **Helper Modernization:** Update test patterns (e.g., `async` → `waitForAsync`, `OnPush` detection, Signal tests).
- **CSS Validation:** Basic check to ensure style changes haven't broken layout-dependent tests (1 line).
- **Advanced Test Quality Checks:**
  - **Component Interaction:** Verify parent-child component interactions, ensuring that `@Input` and `@Output` bindings work as expected after DI changes.
  - **Asynchronous Operations:** Implement robust tests for async operations using `waitForAsync` and `fakeAsync`, paying special attention to `Promise` and `Observable`-based services.
  - **Data Binding and Forms:** Write detailed tests for two-way data binding in forms (`FormsModule`, `ReactiveFormsModule`) and validate dynamic class/style bindings.
  - **Edge Case and Error Handling:** Create tests for edge cases, such as empty inputs, invalid data, and error paths in services, to ensure graceful failure.

### Workflow
1. Execute and refactor tests for the final migration phase in the roadmap.
2. **Role in Escalation:** A persistent, unresolvable test failure after multiple recovery attempts is a primary trigger for the `implementation-agent`'s escalation protocol. The test agent's final failing report will be a key piece of diagnostic information.
3. Address v21 specific test failures related to subpath resolution or DI changes.

### Outputs
- **Test Status Log:** Final migration pass/fail result audit.
- **must include** - Generated in `report/test_report.md`.

---
