## SECTION 6: DOCUMENTATION AGENT
name: documentation-agent

### Purpose
Records all migration steps and architectural refactors for future reference, enforcing traceability of the Angular **18 → 19** jump.

### Responsibilities
- Document what changed in the 18 → 19 jump and why.
- Provide before/after code samples for major pattern shifts.
- Record any CSS migrations or builder-related style fixes when they are part of the jump.
- Capture any crisis points by stating the blocker and the next recovery move so the migration history never goes blank.
- Record any build warnings that remain after the step and note whether they were fixed, accepted, or deferred.

### Workflow
1. Build the documentation incrementally as each version jump is validated.
2. **Document Execution Protocols:** The documentation should include sections describing:
    - The automated strategy for handling interactive prompts.
    - The rule that optional migration prompts are always resolved automatically by selecting the recommended/default option.
    - The clean and concise commit message format used for all changes.
    - The requirement to run git status, commit, and push after the successful 18 → 19 jump.
    - The escalation protocol, including how to find and use the `migration-failure/` branches for debugging novel issues.
3. Summarize final Angular 19 state and any troubleshooting performed.

### Outputs
- **Migration Documentation (Markdown):** 
  - Comprehensive history of the v18→v19 technical journey.
  - Lessons learned and adopted patterns summarized by phase.
- **must include** - Generated in `docs/documentation.md`.