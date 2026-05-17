# Angular Migration Notes

## Active Scope
- Angular 19→20 migration only.

This document records the issues and solutions encountered during the Angular migration process.

## Key Issues

### 1. Inconsistent Bootstrapping

- **Problem:** During the Angular 19→20 migration, the application failed to bootstrap due to changes in the bootstrapping API. Specifically, the `applicationProviders` property was not recognized in `platformBrowserDynamic().bootstrapModule()`.
- **Solution:** The `bootstrapModule` call in `src/main.ts` was simplified to `platformBrowserDynamic().bootstrapModule(AppModule)`, removing the unsupported options. This resolved the bootstrapping error.

### 2. Corrupted `node_modules` Directory

- **Problem:** During the Angular 19→20 migration, the `node_modules` directory became corrupted, leading to "Cannot find module" errors when running `ng serve`. Attempts to remove the directory using `rm -r -force` failed due to file access errors on Windows.
- **Solution:** The `rimraf` package was used to reliably delete the `node_modules` directory and `package-lock.json`. The command `npx rimraf node_modules package-lock.json` was successful. After that, `npm cache clean --force` and `npm install` were run to ensure a clean installation of dependencies.
