---
scope: planning-agent
name: Planning Agent Memory

## Purpose
To capture learnings from the execution of migration plans. This memory helps the Planning Agent refine its strategies, improve task sequencing, and make more accurate risk assessments for the Angular 20 → 21 migration.

## Memory Structure

### Entry Template
```markdown
---
id: <unique_identifier>
date: <YYYY-MM-DD>
type: <"PlanDeviation" | "RiskReassessment" | "TaskSequencing">
keywords: [<keyword1>, <keyword2>]
---

**Situation:**
<A description of the situation where the original plan for the final jump was not optimal.>

**Learned Improvement:**
<A new strategy or adjustment to the planning process that should be applied in the future for Angular 20 → 21.>

**Example:**
---
id: planning-001
date: 2024-05-08
type: TaskSequencing
keywords: [third-party, chart-library]
---

**Situation:**
The original plan scheduled the update of a critical third-party charting library *after* the main Angular 21 alignment. This led to significant build failures that were difficult to debug.

**Learned Improvement:**
For projects with critical third-party UI libraries, the planning agent should prioritize their updates *before* or *concurrently with* the Angular 20 → 21 alignment. This isolates potential compatibility issues early. The plan should now include a dedicated pre-flight phase for such dependencies.
```
---
