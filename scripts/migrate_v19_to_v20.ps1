param(
    [switch]$AllowDirty,
    [switch]$CreateCheckpoint,
    [switch]$SkipInstall,
    [switch]$LegacyPeerDeps
)

$ErrorActionPreference = 'Stop'

function Log {
    param([string]$Message)
    $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    Write-Host "[$ts] $Message"
}

function Invoke-Step {
    param(
        [string]$Name,
        [string]$Command
    )

    Log "STEP: $Name"
    Write-Host "  -> $Command"
    Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
        throw "Step failed: $Name"
    }
}

Set-Location (Join-Path $PSScriptRoot '..')

Log 'Starting Angular migration v19 -> v20'

$dirty = git status --porcelain
if (-not $AllowDirty -and $dirty) {
    throw 'Working tree is dirty. Commit or stash changes, or re-run with -AllowDirty.'
}

if ($CreateCheckpoint) {
    Log 'Creating pre-migration checkpoint (v19-stable)'
    git add -A
    git commit -m "chore: pre-migration checkpoint (v19)" -q
    if ($LASTEXITCODE -ne 0) {
        Log 'No staged changes for pre-migration checkpoint commit.'
    }

    git tag -f v19-stable
    if ($LASTEXITCODE -ne 0) {
        throw 'Failed to create/update tag v19-stable.'
    }
}

if (-not $SkipInstall) {
    $installCommand = 'npm install --no-audit --no-fund'
    if ($LegacyPeerDeps) {
        $installCommand = "$installCommand --legacy-peer-deps"
    }

    try {
        Invoke-Step -Name 'Install dependencies' -Command $installCommand
    }
    catch {
        Log 'Blocker: dependency install failed (often caused by file locks on Windows).'
        Log 'Next recovery move: stop running dev/test servers, close lock-holding processes (esbuild/node), then re-run with -SkipInstall if dependencies are already installed.'
        throw
    }
}
else {
    Log 'Skipping dependency install (requested with -SkipInstall).'
}

Invoke-Step -Name 'Update Angular packages to v20' -Command 'npx @angular/cli@20 update @angular/core@20 @angular/cli@20 --allow-dirty --force'
Invoke-Step -Name 'Build validation (dev)' -Command 'npx ng build --progress=false'
Invoke-Step -Name 'Build validation (production)' -Command 'npx ng build --configuration production --progress=false'
Invoke-Step -Name 'Headless unit tests' -Command 'npx ng test --watch=false --browsers=ChromeHeadless --progress=false'

if ($CreateCheckpoint) {
    Log 'Creating post-migration checkpoint (v20-stable)'
    git add -A
    git commit -m "chore: complete Angular v20 migration" -q
    if ($LASTEXITCODE -ne 0) {
        Log 'No staged changes for post-migration checkpoint commit.'
    }

    git tag -f v20-stable
    if ($LASTEXITCODE -ne 0) {
        throw 'Failed to create/update tag v20-stable.'
    }

    Log 'Pushing main + tags'
    git push origin main --follow-tags
    if ($LASTEXITCODE -ne 0) {
        throw 'Failed to push to origin.'
    }
}

Log 'Migration workflow completed successfully.'
