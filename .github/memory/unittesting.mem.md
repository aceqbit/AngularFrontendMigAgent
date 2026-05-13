---
scope: unittesting-agent
name: Unit Testing Agent Memory

## Purpose
To remember solutions for fixing specific test failures that occur after an Angular migration. This helps the agent automate test-fixing and ensures the stability of the test suite.

## Workspace Specialization Note
Use this memory to record only Angular **v16 -> v17** test-failure learnings in this workspace specialization.

## Memory Structure

### Entry Template
```markdown
---
id: <unique_identifier>
date: <YYYY-MM-DD>
type: <"TestFailure" | "ConfigError" | "MockingIssue">
keywords: [<keyword1>, <keyword2>]
---

**Error Pattern:**
<The characteristic error message from the test runner.>

**Context:**
<The type of component or service under test and the migration version.>

**Refactoring Solution:**
<The specific code change required to make the test pass.>

**Example:**
---
id: unittesting-001
date: 2024-05-08
type: TestFailure
keywords: [async, fakeAsync, tick]
---

**Error Pattern:**
`Error: 1 timer(s) still in the queue.`

**Context:**
Testing a component that uses an async operation inside `ngOnInit` after migrating to Angular 17. The test was using `fakeAsync` and `tick()`.

**Refactoring Solution:**
The issue was resolved by ensuring that all asynchronous operations within the `fakeAsync` zone were properly flushed. The solution was to wrap the trigger for the async operation in `TestBed.runInInjectionContext` and ensure `tick()` was called after the async operation was initiated.
```
---
