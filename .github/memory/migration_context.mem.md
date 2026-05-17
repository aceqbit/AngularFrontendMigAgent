---
scope: global-migration
name: Migration Context Memory

## Purpose
To store high-level, cross-cutting knowledge about the Angular 18 → 19 migration process. This memory is accessible to all agents and provides overarching context and strategies.

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
<A high-level insight or learning that applies across multiple agents or phases.>

**Strategic Application:**
<How this insight should influence the behavior of the agents.>

**Example:**
---
id: global-001
date: 2024-05-08
type: GlobalStrategy
keywords: [standalone, refactoring]
---

**Insight:**
The migration should stay tightly scoped to the Angular 18 → 19 jump. Attempting to pull unrelated version work into the same run is high-risk and often leads to cascading failures.

**Strategic Application:**
- **Planning Agent:** Should keep the plan atomic and limited to the single 18 → 19 step.
- **Implementation Agent:** Should perform the refactoring on the migration slice only, running tests after each meaningful change to ensure stability.
- **Documentation Agent:** Should create a dedicated section on the 18 → 19 migration scope and the benefits it brings to the project.
```
---
