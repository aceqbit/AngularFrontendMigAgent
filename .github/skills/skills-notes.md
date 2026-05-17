# Skills Notes

This file is the master log for all skills. When a new skill is developed or an existing one is updated, the change **must** be logged here first. This log serves as the source of truth for propagating changes to the individual skill definition files for the Angular 20 → 21 migration.

## Skill Updates & Changelog

### New Skill: `clean-workspace`
- **Description:** A skill to reliably clean the workspace by removing `node_modules` and `package-lock.json` using `rimraf`, and then clearing the npm cache.
- **Reason:** Developed to combat persistent `node_modules` corruption issues on Windows during the Angular 20 → 21 migration.
- **Status:** Implemented.

### Updated Skill: `dependency-update`
- **Description:** Enhanced the existing dependency update skill to automatically handle peer dependency conflicts.
- **Change:** The skill will now automatically try `ng update --force` and `npm install --legacy-peer-deps` if a standard update fails.
- **Reason:** To make the Angular 20 → 21 migration process more autonomous and reduce failures requiring manual intervention.
- **Status:** Implemented.

### New Skill: `refactor-standalone`
- **Description:** A skill to automatically fix `NG6008` errors by moving standalone components from `declarations` to `imports` in NgModules.
- **Reason:** This was a frequent and repetitive error during the final migration preparation.
- **Status:** Implemented.

### Updated Skill Behavior: Optional Migration Prompts
- **Description:** Migration skills must automatically choose the recommended/default option, or the first option if no default is shown, when Angular presents an optional migration prompt.
- **Reason:** The Angular 20 → 21 migration must never pause for user button presses.
- **Status:** Implemented.

### Updated Skill Behavior: Targeted Test Triage
- **Description:** Unit-testing skills must start with the changed feature area or the first failing spec when the full suite becomes too broad or fails many modules at once.
- **Reason:** The full suite was too heavy for the final migration step and caused unhelpful all-module failures.
- **Status:** Implemented.

### Updated Skill Behavior: Build Warning Cleanup
- **Description:** Build warnings tied to the migration must be treated as cleanup tasks or explicitly logged follow-ups instead of being ignored.
- **Reason:** The Angular 20 → 21 migration should not leave unresolved warning debt behind.
- **Status:** Implemented.
