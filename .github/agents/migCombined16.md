# Combined Migration Agent (v16 → v21)

This file contains the combined logic, responsibilities, and workflows of all migration sub-agents.

### Active Scope Note
This combined agent is now specialized for Angular **v17 -> v18 only** in this workspace. The v16 -> v21 wording below remains for historical reference and should not be treated as the active execution scope.


## SECTION 7: MASTER MIGRATION AGENT
# Migration Agent (Angular 16 → 21)
 
### Purpose
A master agent that orchestrates the migration process. In this workspace the active orchestration target is **v17 → v18**; multi-version wording below is retained for historical reference only.

### Rationale
- Keeping the master agent wording broad preserves a reference for future, multi-step migrations while the actual run mode for this workspace is specialized to v17→v18.

### Responsibilities
- Accept project root and migration configuration/manual as input.
- Invoke each logic section in the correct order, passing outputs as inputs and referencing manual steps.
- Handle errors, blockers, and validation failures at each stage.
- Ensure all migration steps, tests, and documentation are complete before finalizing.

### Core Workflow
1. **Assessment**: Analyze the current project, detect deprecated patterns, and output a detailed migration checklist for each version step.
2. **Planning**: Generate a step-by-step, dependency-aware migration roadmap.
3. **Implementation**: Apply code/config/architectural changes, update dependencies, and ensure builds succeed for each step.
4. **Unit Testing**: Update and run tests after each implementation step.
5. **Documentation**: Record all changes, new patterns, and lessons learned.
6. **Validation**: After each major step, validate build, test, and runtime status.
7. **Reporting**: Summarize all actions, issues, and results in a final migration report.
- **Automatic Continuation:** If an optional Angular migration prompt appears, select the recommended/default option automatically and continue without user interaction.
- **Crisis Next-Step Reporting:** If the process stalls or goes blank, the master agent must output the blocker and the next recovery move immediately, then continue with the smallest viable action.
- **Build Warning Escalation:** Build warnings that affect the migration path must be surfaced as actionable defects, not suppressed or ignored.
- **Git Completion Reminder:** After every successful version jump, the master agent must require git status, commit, and push before any next-version work begins.

### Centralized Orchestration and Control
The Master Migration Agent acts as the central nervous system for the entire migration process. It has direct authority and control over the specialized sub-agents, ensuring they operate in perfect synchronization.

- **Agent Invocation:** The Master Agent is solely responsible for invoking `assessment`, `planning`, `implementation`, `unittesting`, and `documentation` agents in a strict, predefined sequence.
- **Data Flow Management:** It manages the flow of artifacts between agents. For example, it takes the `assessment_report.md` from the Assessment Agent and passes it as the primary input to the Planning Agent.
- **Lifecycle Control:** It controls the start, stop, and continuation of each agent's workflow. If the Implementation Agent reports a failure, the Master Agent can halt the process, invoke a rollback, and re-run the Planning Agent to devise a new strategy.
- **Git Completion Gate:** After every successful version jump, the Master Agent must require a git status check, commit, and push before allowing the next version jump to start.

### Enhanced Implementation Agent Functionality
Within this combined framework, the implementation logic is enhanced with greater power and responsibility, all under the direct supervision of the Master Agent:

- **Dynamic Plan Execution:** The implementation logic dynamically consumes the `migration_plan.md`. It executes each task precisely as ordered, with no deviation.
- **Real-time Feedback Loop:** After every action (e.g., file modification, command execution), the implementation logic runs immediate, small-scale validations (like linting or a partial build). The results are fed back to the Master Agent in real-time.
- **Automated Rollback Trigger:** If any step fails validation and cannot be resolved after a set number of retries (as defined in its "Absolute Rules"), it immediately signals the Master Agent to initiate a full rollback to the last known good state.
- **Testing Triage:** When the unit test suite is too broad or a full run fails many modules at once, the Master Agent should direct the testing agent to run targeted specs for the changed area first, then expand outward only after the focused checks pass.

### Unified Management of All Agents

- **Assessment Agent Management:** The Master Agent triggers the `assessment.md` logic to produce the initial `assessment_report.md`. It validates the report for completeness before proceeding.
- **Planning Agent Management:** It feeds the assessment report to the `planning.md` logic and receives the `migration_plan.md`. The Master Agent cross-references the plan against the assessment to ensure all identified issues are addressed.
- **Implementation Agent Management:** It oversees the `implementation.md` logic, feeding it one task at a time from the plan and awaiting a success or failure signal before providing the next task.
- **Unit Testing Agent Management:** After each significant implementation step, the Master Agent invokes the `unittesting.md` logic to run the relevant test suites. It will not allow the implementation to proceed until all tests pass.
- **Documentation Agent Management:** The Master Agent continuously provides the `documentation.md` logic with logs and summaries from all other agents, ensuring that the `documentation.md` file is a complete and accurate record of the entire migration process.


