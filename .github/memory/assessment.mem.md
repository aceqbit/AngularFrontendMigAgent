---
scope: assessment-agent
name: Assessment Agent Memory

## Purpose
To store learnings and observations for the Assessment Agent. This memory helps the agent recognize recurring or unusual project structures and improve the accuracy of its Angular 20 → 21 assessment.

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
<A clear description of the unusual pattern or issue found during the final migration readiness audit.>

**Implication for Assessment:**
<How this observation affects the Angular 20 → 21 assessment and what the agent should look for in the future.>

**Example:**
---
id: assessment-001
date: 2024-05-08
type: ConfigPattern
keywords: [webpack, custom-builder]
---

**Observation:**
The project uses a custom Webpack builder configured in `angular.json`, which is not the Angular 21-ready builder setup.

**Implication for Assessment:**
The standard `ng update` process may not correctly update all build-related configurations. The assessment must include a specific check for builder compatibility and flag this as a high-risk item for the planning agent.
```
---
