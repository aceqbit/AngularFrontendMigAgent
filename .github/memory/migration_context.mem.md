---
scope: global-migration
name: Migration Context Memory

## Purpose
To store high-level, cross-cutting knowledge about the Angular 20 to 21 migration process. This memory is accessible to all agents and provides overarching context and strategies.

## Memory Structure

### Entry Template
```markdown
---
id: <unique_identifier>
date: <YYYY-MM-DD>
type: <"CommonPitfall" | "GlobalStrategy" | "VersionMilestone">
keywords: [<keyword1>, <keyword2>]
---

**Insight:**
<A high-level insight or learning that applies across multiple agents or phases of the final migration jump.>

**Strategic Application:**
<How this insight should influence the behavior of the agents during Angular 20 → 21.>

**Example:**
---
id: global-001
date: 2024-05-08
type: GlobalStrategy
keywords: [standalone, refactoring]
---

**Insight:**
The transition to Angular 21 readiness is a major architectural shift. Attempting to refactor the entire application in a single phase is high-risk and often leads to cascading failures.

**Strategic Application:**
- **Planning Agent:** Should schedule Angular 21 compatibility work as a focused, prioritized process. Address shared modules and core feature modules first.
- **Implementation Agent:** Should perform refactoring on a per-module basis, running tests after each conversion to ensure stability.
- **Documentation Agent:** Should create a dedicated section on the Angular 21 architecture and the benefits it brings to the project.
```
---
