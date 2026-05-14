---
scope: global-migration
name: Migration Context Memory

## Purpose
To store high-level, cross-cutting knowledge to support the active Angular v17 -> v18 migration. Broader v16→v21 knowledge remains available in this memory as historical context and reference.

## Active Scope Note
The active workspace migration target is Angular **v17 -> v18 only**. Broader v16 -> v21 knowledge remains available as historical context for reference.

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
The transition to standalone components, introduced in v17, is a major architectural shift. Attempting to refactor the entire application to standalone in a single phase is high-risk and often leads to cascading failures.

**Strategic Application:**
- **Planning Agent:** Should schedule standalone migration as a gradual, multi-phase process. Prioritize converting shared modules and core feature modules first.
- **Implementation Agent:** Should perform the refactoring on a per-module basis, running tests after each conversion to ensure stability.
- **Documentation Agent:** Should create a dedicated section on the new standalone architecture and the benefits it brings to the project.
```
---
