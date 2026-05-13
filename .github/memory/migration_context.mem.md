---
scope: global-migration
name: Migration Context Memory

## Purpose
To store high-level, cross-cutting knowledge about the Angular v16 to v21 migration process. This memory is accessible to all agents and provides overarching context and strategies.

## Workspace Specialization Note
This workspace is now specialized for Angular **v16 -> v17 only**. Keep the broader migration history below, but apply it only when it helps the v16 -> v17 path.

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
