---
scope: documentation-agent
name: Documentation Agent Memory

## Purpose
To store project-specific documentation preferences and standards. This ensures that all generated documentation is consistent and meets the project's Angular 20 → 21 requirements.

## Memory Structure

### Entry Template
```markdown
---
id: <unique_identifier>
date: <YYYY-MM-DD>
type: <"Formatting" | "StandardSection" | "AudienceNote">
keywords: [<keyword1>, <keyword2>]
---

**Requirement:**
<A description of the specific documentation requirement for the final migration jump.>

**Implementation Guideline:**
<How the documentation agent should apply this requirement for Angular 20 → 21.>

**Example:**
---
id: documentation-001
date: 2024-05-08
type: StandardSection
keywords: [readme, deployment]
---

**Requirement:**
The project's main `README.md` must always include a "Deployment" section that details the production build and deployment process after the Angular 20 → 21 migration.

**Implementation Guideline:**
When generating or updating documentation, the agent must verify that the `README.md` contains a `## Deployment` section. If it is missing, the agent should create it and add a placeholder prompting the user to fill in the details for the final migrated state.
```
---
