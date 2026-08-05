<#
.SYNOPSIS
  Push the current working tree to the Mac so it can be built there.

.DESCRIPTION
  Windows has no rsync, so this tars the project (minus everything the Mac
  regenerates or caches) and extracts it over the remote copy. Untracked and
  uncommitted files come along, which is the point -- no commit/push round trip.

  Files deleted locally are NOT removed on the Mac unless you pass -Fresh.

.PARAMETER IncludeDist
  Also send dist/. Pair with -UseWindowsBuild on Mac-Build-iOS.ps1 / Mac-Run-iOS.ps1
  to skip the vite build on the Mac.

.PARAMETER WebOnly
  Send just dist/, the capacitor config and tools/ -- the fast loop after a
  local `npm run build`. Implies -IncludeDist.

.PARAMETER IncludeAndroid
  Also send the android/ project. Skipped by default -- it is 39 MB of generated
  icons and copied web assets that an iOS build never reads.

.PARAMETER Fresh
  Wipe the remote copy first, keeping only the caches (node_modules, Pods, build).

.EXAMPLE
  .\Mac-Sync.ps1
.EXAMPLE
  npm run build ; .\Mac-Sync.ps1 -WebOnly
#>
[CmdletBinding()]
param(
    [switch]$IncludeDist,
    [switch]$IncludeAndroid,
    [switch]$WebOnly,
    [switch]$Fresh
)

. (Join-Path $PSScriptRoot '_common.ps1')

Write-Banner 'Sync project to Mac'
Test-MacSsh

if ($WebOnly) { $IncludeDist = $true }

# bsdtar's --exclude is NOT anchored: "--exclude=./dist" would also drop
# my-clarity-capacitator-plugin/dist, which the build needs. So top-level
# directories are skipped by simply not naming them, and --exclude is reserved
# for patterns that are unambiguous wherever they appear.
$skipTopLevel = @('.git', 'node_modules', 'build', 'certs', '.vscode', 'project-backup.zip')
if (-not $IncludeDist)    { $skipTopLevel += 'dist' }
if (-not $IncludeAndroid) { $skipTopLevel += 'android' }   # 39 MB of generated icons + web assets

$excludes = @(
    'node_modules'              # nested copies, e.g. inside the local plugin
    'ios/App/Pods'              # re-created by pod install on the Mac
    'ios/App/App/public'        # ~54 MB, re-created by cap sync
    '*.log'
)
if ($IncludeAndroid) {
    $excludes += @('android/build', 'android/app/build', 'android/.gradle',
                   'android/app/src/main/assets/public')
}

if ($WebOnly) {
    $paths = @('./dist', './capacitor.config.json', './app.config.js', './tools')
} else {
    $paths = Get-ChildItem -LiteralPath $LocalRoot -Force |
        Where-Object { $_.Name -notin $skipTopLevel } |
        ForEach-Object { "./$($_.Name)" }
}

$tarArgs = @('-c', '-z', '-f', $null, '-C', $LocalRoot)
foreach ($e in $excludes) { $tarArgs += @("--exclude=$e", "--exclude=$e/*") }

$stamp    = Get-Date -Format 'yyyyMMdd-HHmmss'
$tarball  = Join-Path $env:TEMP "elso-sync-$stamp.tar.gz"
$tarArgs[3] = $tarball

Write-Step 'Packing working tree'
& $TarExe @tarArgs @paths
if ($LASTEXITCODE -ne 0) { throw 'tar failed while packing the project' }
$sizeMb = [math]::Round((Get-Item $tarball).Length / 1MB, 1)
Write-Ok "$sizeMb MB archive"

try {
    # Remote commands are kept to a single line: ssh passes them straight to sh,
    # and the project path has no spaces, so no quoting games are needed.
    $d = $MacProject

    Write-Step "Preparing $MacProject"
    if ($Fresh) {
        Write-Warn 'Fresh sync: clearing the remote copy (node_modules/build/dist kept)'
        Invoke-Mac -Command ("set -e; d=$d; mkdir -p `$d; " +
            'find $d -mindepth 1 -maxdepth 1 ' +
            '! -name node_modules ! -name build ! -name dist -exec rm -rf {} +')
    } else {
        Invoke-Mac -Command "mkdir -p $d"
    }

    Write-Step 'Uploading'
    & scp @($SshOptions) '-q' $tarball "${MacTarget}:/tmp/elso-sync.tar.gz"
    if ($LASTEXITCODE -ne 0) { throw 'scp upload failed' }
    Write-Ok 'uploaded'

    Write-Step 'Unpacking on the Mac'
    # The CRLF strip + chmod keep the remote scripts runnable no matter how git
    # checked them out on Windows.
    Invoke-Mac -Command ("set -e; d=$d; tar -xzf /tmp/elso-sync.tar.gz -C `$d; " +
        'rm -f /tmp/elso-sync.tar.gz; ' +
        'perl -pi -e "s/\r\n/\n/" $d/tools/mac/remote/*.sh; ' +
        'chmod +x $d/tools/mac/remote/*.sh; ' +
        'printf "   %s files on the Mac\n" ' +
        '"$(find $d -type f -not -path ''*/node_modules/*'' -not -path ''*/build/*'' | wc -l | tr -d '' '')"')
    Write-Ok "project is at $MacProject on $MacHost"
}
finally {
    Remove-Item $tarball -Force -ErrorAction SilentlyContinue
}
