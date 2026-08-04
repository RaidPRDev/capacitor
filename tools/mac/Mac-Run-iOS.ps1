<#
.SYNOPSIS
  Build, install and launch the app in the Mac's iOS Simulator.

.DESCRIPTION
  The everyday command. Syncs the working tree, builds, boots the simulator,
  installs and launches. With -Live the app instead loads from the vite dev
  server running on this PC, so saving a file in src/ hot-reloads in the
  simulator with no rebuild.

.PARAMETER Device
  Simulator by name or UDID. Default "iPhone 17". See .\Mac-Simulators.ps1.

.PARAMETER Configuration
  Debug (default) or Release.

.PARAMETER Live
  Live reload: build the app pointing at http://<this-pc>:3005 and start the
  dev server here if it is not already running.

.PARAMETER Screenshot
  After launching, wait a moment and pull a PNG of the simulator back to Windows.

.PARAMETER Logs
  Stream the app's simulator log after launching (Ctrl+C to stop).

.PARAMETER Reinstall
  Uninstall the app first, clearing its stored data.

.PARAMETER SkipBuild
  Install and launch the last build without rebuilding.

.PARAMETER NoSync
  Use the copy already on the Mac.

.PARAMETER NoGui
  Do not open Simulator.app on the Mac's screen (headless; screenshots still work).

.EXAMPLE
  .\Mac-Run-iOS.ps1
.EXAMPLE
  .\Mac-Run-iOS.ps1 -Live
.EXAMPLE
  .\Mac-Run-iOS.ps1 -Device 'iPad Air 11-inch (M4)' -Screenshot
#>
[CmdletBinding()]
param(
    [string]$Device,
    [ValidateSet('Debug', 'Release')][string]$Configuration = 'Debug',
    [switch]$Live,
    [switch]$Screenshot,
    [switch]$Logs,
    [switch]$Reinstall,
    [switch]$SkipBuild,
    [switch]$UseWindowsBuild,
    [switch]$NoSync,
    [switch]$NoGui,
    [switch]$Clean
)

. (Join-Path $PSScriptRoot '_common.ps1')

if (-not $Device) { $Device = $DefaultSim }

Write-Banner "Run iOS on $Device$(if ($Live) { '  [live reload]' })"

# ------------------------------------------------------------- live dev server
$liveUrl = $null
if ($Live) {
    $ip = Get-LocalLanIp
    $liveUrl = "http://${ip}:$DevPort"

    $listening = Get-NetTCPConnection -State Listen -LocalPort $DevPort -ErrorAction SilentlyContinue
    if (-not $listening) {
        Write-Step "Starting the vite dev server (npm start) on port $DevPort"
        Start-Process -FilePath 'pwsh' -ArgumentList @(
            '-NoExit', '-Command',
            "Set-Location '$LocalRoot'; `$env:PLATFORM='ios'; npm start"
        ) -WorkingDirectory $LocalRoot | Out-Null

        $deadline = (Get-Date).AddSeconds(90)
        while (-not (Get-NetTCPConnection -State Listen -LocalPort $DevPort -ErrorAction SilentlyContinue)) {
            if ((Get-Date) -gt $deadline) { throw "vite did not start listening on port $DevPort" }
            Start-Sleep -Milliseconds 500
        }
        Write-Ok 'dev server is up'
    } else {
        Write-Ok "dev server already listening on port $DevPort"
    }

    Write-Step "Checking the Mac can reach $liveUrl"
    $reach = Invoke-Mac -Quiet -AllowFail -Command `
        "curl -s -o /dev/null -m 5 -w '%{http_code}' $liveUrl"
    if ($reach -match '^[23]\d\d$') {
        Write-Ok "Mac gets HTTP $reach from the dev server"
    } else {
        Write-Warn "The Mac cannot reach $liveUrl (got '$reach')."
        Write-Note 'Windows Firewall is almost certainly blocking it. In an admin shell:'
        Write-Note "  New-NetFirewallRule -DisplayName 'Vite dev server $DevPort' -Direction Inbound -Protocol TCP -LocalPort $DevPort -Action Allow -Profile Private"
        throw 'Dev server not reachable from the Mac'
    }
}

# --------------------------------------------------------------- sync + launch
if ($UseWindowsBuild -and -not $SkipBuild) {
    Write-Step 'Building web bundle locally (PLATFORM=ios)'
    Push-Location $LocalRoot
    try {
        $env:PLATFORM = 'ios'
        & npm run build
        if ($LASTEXITCODE -ne 0) { throw 'local npm run build failed' }
    } finally {
        Remove-Item Env:PLATFORM -ErrorAction SilentlyContinue
        Pop-Location
    }
}

if (-not $NoSync) {
    & (Join-Path $PSScriptRoot 'Mac-Sync.ps1') -IncludeDist:$UseWindowsBuild
} else {
    Test-MacSsh
}

$scriptArgs = @('--device', $Device, '--config', $Configuration)
if ($SkipBuild)       { $scriptArgs += '--skip-build' }
if ($Reinstall)       { $scriptArgs += '--reinstall' }
if ($NoGui)           { $scriptArgs += '--no-gui' }
if ($Clean)           { $scriptArgs += '--clean' }
if ($UseWindowsBuild) { $scriptArgs += '--skip-web' }
if ($liveUrl)         { $scriptArgs += @('--live-url', $liveUrl) }

$start = Get-Date
Invoke-MacScript -Script 'run-ios.sh' -Arguments $scriptArgs
Write-Ok ("done in {0:n0}s" -f ((Get-Date) - $start).TotalSeconds)

if ($Live) {
    Write-Host ''
    Write-Note "The app is loading from $liveUrl -- edit src/ and it reloads in the simulator."
    Write-Note 'Leave the dev server window open. Re-run without -Live to go back to bundled assets.'
}

if ($Screenshot) {
    Start-Sleep -Seconds 4
    & (Join-Path $PSScriptRoot 'Mac-Screenshot-iOS.ps1') -Device $Device
}

if ($Logs) {
    & (Join-Path $PSScriptRoot 'Mac-Logs-iOS.ps1') -Device $Device
}
