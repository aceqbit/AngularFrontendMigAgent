# Implementation Action Log

## Angular 16 to 17
- Updated `@angular/core` and `@angular/cli` to version 17.
- Ran `ng build` successfully.
- `ng test` failed due to no tests being present.

## Angular 17 to 18
- Updated `@angular/core` and `@angular/cli` to version 18.
- Ran `ng build` successfully.

## Angular 18 to 19
- Updated `@angular/core` and `@angular/cli` to version 19.
- Ran `ng build` successfully.

## Angular 19 to 20
- Updated `@angular/core` and `@angular/cli` to version 20.
- Ran `ng build` successfully.

## Angular 20 to 21
- Updated `@angular/core` and `@angular/cli` to version 21.
- Updated TypeScript to 5.9.3.
- Ran `ng build` successfully.

## Final v21 Compliance and Troubleshooting Report
- The project was successfully migrated to Angular 21.
- The build is successful.
- No major issues were encountered during the migration.

## Angular 17 to 16 Rollback (2026-05-13)
- Downgraded Angular packages from 17.x to 16.2.x in package metadata.
- Aligned tooling for Angular 16:
	- Switched test builder from `@angular/build:karma` to `@angular-devkit/build-angular:karma`.
	- Changed TypeScript module resolution from `bundler` to `node`.
	- Downgraded `zone.js` to 0.13.x and `typescript` to 5.1.x.
- Performed clean reinstall using `rimraf node_modules package-lock.json` followed by `npm install`.
- Initial test run failed in `data-grid.component.spec.ts` because standalone component was incorrectly placed in `declarations`.
- Applied targeted spec fix by moving `DataGridComponent` to `imports` in TestBed setup.
- Final validation results:
	- `npm run build` succeeded (warning only: existing CSS budget overage in event-scheduler styles).
	- `npx ng test --watch=false --browsers=ChromeHeadless` passed with 23/23 successful tests.

## Checkpoint (2026-05-13)
- Committed final Angular 16 rollback and fixes. Commit: `8e92207`.
- Created and pushed tag `v16-stable` as a stable checkpoint.# Implementation Action Log

## Angular 16 to 17
- Updated `@angular/core` and `@angular/cli` to version 17.
- Ran `ng build` successfully.
- `ng test` failed due to no tests being present.

## Angular 17 to 18
- Updated `@angular/core` and `@angular/cli` to version 18.
- Ran `ng build` successfully.

## Angular 18 to 19
- Updated `@angular/core` and `@angular/cli` to version 19.
- Ran `ng build` successfully.

## Angular 19 to 20
- Updated `@angular/core` and `@angular/cli` to version 20.
- Ran `ng build` successfully.

## Angular 20 to 21
- Updated `@angular/core` and `@angular/cli` to version 21.
- Updated TypeScript to 5.9.3.
- Ran `ng build` successfully.

## Final v21 Compliance and Troubleshooting Report
- The project was successfully migrated to Angular 21.
- The build is successful.
- No major issues were encountered during the migration.

## Angular 17 to 16 Rollback (2026-05-13)
- Downgraded Angular packages from 17.x to 16.2.x in package metadata.
- Aligned tooling for Angular 16:
	- Switched test builder from `@angular/build:karma` to `@angular-devkit/build-angular:karma`.
	- Changed TypeScript module resolution from `bundler` to `node`.
	- Downgraded `zone.js` to 0.13.x and `typescript` to 5.1.x.
- Performed clean reinstall using `rimraf node_modules package-lock.json` followed by `npm install`.
- Initial test run failed in `data-grid.component.spec.ts` because standalone component was incorrectly placed in `declarations`.
- Applied targeted spec fix by moving `DataGridComponent` to `imports` in TestBed setup.
- Final validation results:
	- `npm run build` succeeded (warning only: existing CSS budget overage in event-scheduler styles).
	- `npx ng test --watch=false --browsers=ChromeHeadless` passed with 23/23 successful tests.

	## Checkpoint (2026-05-13)
	- Committed final Angular 16 rollback and fixes. Commit: `8e92207`.';'
	- Created and pushed tag `v16-stable` as a stable checkpoint.
