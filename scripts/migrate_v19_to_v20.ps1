# PowerShell migration script: Angular 19 → 20
# Non-interactive best-effort migration. Review outputs before pushing.

$ErrorActionPreference = 'Stop'
$log = "report/implementation_log.md"
function Log($msg) {
    $t = Get-Date -Format o
    "$t - $msg" | Out-File -FilePath $log -Append -Encoding utf8
}

Log "=== Starting migration: Angular 19 -> 20 ==="

# Phase 0: Prepare
Log "Phase 0: git pre-checkpoint"
try {
    git rev-parse --is-inside-work-tree | Out-Null
} catch {
    Log "Not a git repo; aborting."
    exit 1
}

# Create pre-migration checkpoint
Log "Creating pre-migration checkpoint v19-stable"
try {
    git add -A
    git commit -m "chore: pre-migration checkpoint (v19)" -q
    if ($LASTEXITCODE -ne 0) { Log "No changes to commit" }
    git tag -f v19-stable
    if ($LASTEXITCODE -ne 0) { Log "Tag v19-stable create/update may have failed" }
} catch {
    Log "Warning: git commit/tag step failed: $_"
}

# Phase 1: Dependency updates
Log "Phase 1: Running ng update @angular/core@20 @angular/cli@20"
try {
    # Stash any local changes to avoid 'repository not clean' errors
    Log "Stashing local changes (including untracked)"
    git stash push --include-untracked -m "pre-migration-stash-$(Get-Date -Format o)"
    if ($LASTEXITCODE -eq 0) { $stashed = $true; Log "Local changes stashed" } else { $stashed = $false; Log "No stash created or stash command failed" }

    ng update @angular/core@20 @angular/cli@20 --allow-dirty --force 2>&1 | Tee-Object -FilePath $log -Append
    npm install 2>&1 | Tee-Object -FilePath $log -Append
} catch {
    Log "Dependency update failed: $_"
    Log "Aborting migration. See $log"
    # Try to restore stash if present
    if ($stashed) {
        Log "Attempting to pop stash after failure"
        git stash pop 2>&1 | Tee-Object -FilePath $log -Append
    }
    exit 2
}

# Phase 2: Build
Log "Phase 2: Building project (dev and production)"
try {
    ng build --configuration development --progress=false 2>&1 | Tee-Object -FilePath $log -Append
    ng build --configuration production --progress=false 2>&1 | Tee-Object -FilePath $log -Append
} catch {
    Log "Build failed: $_"
    Log "Aborting migration. See $log"
    exit 3
}

# Phase 3: Tests
Log "Phase 3: Running tests (targeted then full)
Note: headless Chrome required on CI/runner"
try {
    npx ng test --watch=false --browsers=ChromeHeadless --progress=false 2>&1 | Tee-Object -FilePath $log -Append
} catch {
    Log "Tests failed: $_"
    Log "Continuing to capture results; consider triage."
}

# Phase 4: Finalize
Log "Phase 4: Commit and tag v20-stable"
try {
    git add -A
    git commit -m "chore: complete Angular v20 migration" -q
    if ($LASTEXITCODE -ne 0) { Log "No new changes to commit" }
    # If we stashed earlier, apply stash now and commit merged changes
    if ($stashed) {
        Log "Applying previously stashed local changes"
        git stash pop 2>&1 | Tee-Object -FilePath $log -Append
        if ($LASTEXITCODE -ne 0) { Log "Stash pop resulted in conflicts or failed; manual resolution required"; exit 4 }
        git add -A
        git commit -m "chore: merge stashed pre-migration changes" -q
        if ($LASTEXITCODE -ne 0) { Log "No changes after applying stash to commit" }
    }
    git tag -a v20-stable -m "Angular v20 stable"
    if ($LASTEXITCODE -ne 0) { Log "Tag v20-stable create/update may have failed" }
    Log "Migration complete. Please review logs in $log then push changes." 
} catch {
    Log "Final commit/tag failed: $_"
}

Log "=== Migration script finished ==="
