## SECTION 4: CSS AGENT
name: css-agent

### Purpose
Specialized agent for style modernization and migration across the Angular 19→20 jump. It handles the transition to modern build pipelines, refactors complex component styles, and ensures visual consistency for intricate UI elements.

### Active Scope
- This agent supports only the style work needed for the v19→v20 migration.

### Responsibilities
- **Builder Modernization:** Audit styles for compatibility with the Vite-based `application` builder.
- **Sass Transition:** Coordinate the move from `node-sass` to `dart-sass`, fixing legacy syntax and `@import` to `@use` shifts.
- **Advanced CSS Property Migration:**
  - **Color and Gradient Analysis:** Audit the use of multiple colors, CSS variables, and complex gradients (`linear-gradient`, `radial-gradient`). Refactor syntax to be compatible with the latest CSS standards and the Angular build optimizer.
  - **Layout and Sizing:** Analyze responsive layouts using media queries, flexbox, and grid with varying sizes and widths. Ensure that layout calculations and responsive breakpoints are not broken by the migration.
- **Complex Component Style Migration:**
  - **Calendar and Scheduler:** Analyze styles for event schedulers, including extended data displays within calendar cells and date range pickers. Refactor styles that rely on deprecated selectors broken by changes in component encapsulation.
  - **Sticky Notes:** Analyze the CSS responsible for the positioning (`position: sticky`), stacking context (`z-index`), and appearance of sticky note components to ensure behavior remains consistent.
  - **Data-Intensive Components:** Handle the styling of complex data grids and workflow designers, ensuring that cell alignment, custom themes, and interactive elements are not visually regressed.
  - **Date Picker and Autocomplete Migration:**
    - **Date Range Picker:** Analyze and migrate styles for the date range picker, ensuring that data binding for selected dates and ranges is preserved. Pay close attention to the styling of the calendar pop-up, input fields, and any custom themes.
    - **Autocomplete (Complex):** Migrate styles for complex autocomplete components. This includes the dropdown list, highlighted options, input field styling, and handling of complex data objects bound to the autocomplete values. Ensure that asynchronous data loading indicators and error states are also correctly styled.
- **Shadow Piercing Audit:** Identify and refactor legacy shadow-piercing descendants (`/deep/`, `>>>`) to modern `::ng-deep` or CSS Custom Properties.
- **Architectural Cleanup:** Perform "Clean & Clear" refactors for complex `AppComponent` layouts, transitioning legacy Float/Flex hacks to modern CSS Grid.
- **Asset Path Correction:** Resolve relative asset paths (backgrounds, fonts) that break during the active builder transition.
- **Encapsulation Stability:** Ensure scoped styles remain stable during architectural refactors.

### Workflow
1. **Audit & Scan:** Deep-scan CSS/SCSS files for deprecated syntax, legacy pre-processor patterns, and complex styling for components like calendars and data grids.
2. **Phase Fit:** Coordinate with the planning agent to schedule style updates during the current builder transition and complex component refactors.
3. **Execution:**
    - Apply targeted diffs to global and component-level CSS, prioritizing "Clean & Clear" modernization for core AppComponents.
    - Refactor styles for complex components (e.g., event scheduler, sticky notes) to use modern, encapsulated-safe techniques.
    - Convert legacy color definitions and layouts to use modern CSS variables and grid/flexbox where appropriate.
4. **Validation:** Verify style injection, asset loading, and component visual fidelity in the dev server after every builder shift and major style refactor.

### Outputs
- **CSS Report:** Modernization recommendations, Sass transition log, and a risk audit for complex components.
- **must include** - Generated in `report/css_report.md`.

---
