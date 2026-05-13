---
scope: assessment-agent
name: Assessment Agent Memory

## Purpose
To store learnings and observations for the Assessment Agent. This memory helps the agent recognize recurring or unusual project structures and improve the accuracy of its assessment over time.

## Workspace Specialization Note
Use this memory to record only Angular **v16 -> v17** assessment findings in this workspace specialization.

## Memory Structure

### Entry Template
```markdown
---
id: <unique_identifier>
date: <YYYY-MM-DD>
type: <"ConfigPattern" | "DependencyAnomaly" | "ProjectStructure">
keywords: [<keyword1>, <keyword2>]
---

**Observation:**
<A clear description of the unusual pattern or issue found.>

**Implication for Assessment:**
<How this observation affects the migration assessment and what the agent should look for in the future.>

**Example:**
---
id: assessment-001
date: 2024-05-08
type: ConfigPattern
keywords: [webpack, custom-builder]
---

**Observation:**
The project uses a custom Webpack builder configured in `angular.json`, which is not the standard Angular CLI builder.

**Implication for Assessment:**
The standard `ng update` process may not correctly update all build-related configurations. The assessment must include a specific check for custom builders and flag this as a high-risk item for the planning agent.
```
---
