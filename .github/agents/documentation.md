## SECTION 6: DOCUMENTATION AGENT
name: documentation-agent

### Active Scope Note
This documentation agent is specialized for Angular **v17 -> v18 only** in this workspace. Any broader v16 -> v21 references below are historical records and should not be treated as active documentation scope.

### Rationale
- Documentation files often contain historical multi-version context; we keep them but the agent will only generate and update v17→v18-focused documentation during the active migration.

### Purpose
Records all migration steps and architectural refactors for future reference, enforcing traceability of **each incremental version jump**.

### Responsibilities
- Document what changed in every version jump and why.
- Provide before/after code samples for major pattern shifts.
- Record any CSS migrations or builder-related style fixes (1 line).
- Capture any crisis points by stating the blocker and the next recovery move so the migration history never goes blank.
- Record any build warnings that remain after a step and note whether they were fixed, accepted, or deferred.

### Workflow
1. Build the documentation incrementally as each version jump is validated.
2. **Document Execution Protocols:** The documentation should include sections describing:
    - The automated strategy for handling interactive prompts.
    - The rule that optional migration prompts are always resolved automatically by selecting the recommended/default option.
    - The clean and concise commit message format used for all changes.
    - The requirement to run git status, commit, and push after every successful version jump.
    - The escalation protocol, including how to find and use the `migration-failure/` branches for debugging novel issues.
3. Summarize final v21 state and any troubleshooting performed.

### Outputs
- **Migration Documentation (Markdown):** 
  - Comprehensive history of the v16→v21 technical journey.
  - Lessons learned and adopted patterns summarized by phase.
- **must include** - Generated in `docs/documentation.md`.