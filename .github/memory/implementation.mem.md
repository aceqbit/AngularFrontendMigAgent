---
scope: implementation-agent
name: Implementation Agent Memory

## Purpose
To record successful solutions and workarounds for specific, unexpected errors encountered during the implementation phase. This memory serves as a knowledge base for resolving future technical challenges.

## Workspace Specialization Note
Use this memory to capture only Angular **v16 -> v17** implementation findings in this workspace specialization.

## Memory Structure

### Entry Template
```markdown
---
id: <unique_identifier>
date: <YYYY-MM-DD>
type: <"BuildError" | "DependencyConflict" | "RuntimeError">
keywords: [<keyword1>, <keyword2>]
---

**Error Signature:**
<A unique, searchable string from the error message.>

**Context:**
<The migration step being performed when the error occurred.>

**Successful Solution:**
<The exact sequence of commands or code modifications that resolved the error.>

**Example:**
---
id: implementation-001
date: 2024-05-08
type: DependencyConflict
keywords: [peer-dependency, rxjs]
---

**Error Signature:**
`Could not resolve dependency: peer rxjs@"^6.0.0" from @angular/core@"17.0.0"`

**Context:**
Running `ng update @angular/core@17` in a project with an older, incompatible third-party library.

**Successful Solution:**
The conflict was resolved by first updating the problematic third-party library to its latest version, which supported RxJS 7.
1. `npm install some-legacy-library@latest`
2. `ng update @angular/core@17`
This resolved the conflict without needing to use `--force` or `--legacy-peer-deps`.
```
---
