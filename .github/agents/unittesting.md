## SECTION 5: UNIT TESTING AGENT
name: unit-testing-agent

### Active Scope Note
This unit-testing agent is specialized for Angular **v17 -> v18 only** in this workspace. Broader references to later versions are historical context only.

### Rationale
- The unit-testing agent retains broader test strategies for reference, but during active runs it focuses on v17→v18 test fixes and triage to avoid overbroad changes that could mask the root cause of regressions.

### Purpose
Validates system stability after **every individual version jump**, ensuring modern test patterns are adopted as the project evolves.

### Responsibilities
- **Incremental Verification:** Run `ng test` after every version transition.
- **Helper Modernization:** Update test patterns (e.g., `async` → `waitForAsync`, `OnPush` detection, Signal tests).
- **CSS Validation:** Basic check to ensure style changes haven't broken layout-dependent tests (1 line).
- **Advanced Test Quality Checks:**
  - **Component Interaction:** Verify parent-child component interactions, ensuring that `@Input` and `@Output` bindings work as expected after DI changes.
  - **Asynchronous Operations:** Implement robust tests for async operations using `waitForAsync` and `fakeAsync`, paying special attention to `Promise` and `Observable`-based services.
  - **Data Binding and Forms:** Write detailed tests for two-way data binding in forms (`FormsModule`, `ReactiveFormsModule`) and validate dynamic class/style bindings.
  - **Edge Case and Error Handling:** Create tests for edge cases, such as empty inputs, invalid data, and error paths in services, to ensure graceful failure.

### Workflow
1. Execute and refactor tests for each version phase in the roadmap.
2. **Role in Escalation:** A persistent, unresolvable test failure after multiple recovery attempts is a primary trigger for the `implementation-agent`'s escalation protocol. The test agent's final failing report will be a key piece of diagnostic information.
3. Address v21 specific test failures related to subpath resolution or DI changes.

### Outputs
- **Test Status Log:** Phase-by-phase pass/fail result audit.
- **must include** - Generated in `report/test_report.md`.

---
