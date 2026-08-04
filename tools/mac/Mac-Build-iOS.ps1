<#
.SYNOPSIS
  Sync and build the iOS app for the simulator on the Mac.

.DESCRIPTION
  vite build (PLATFORM=ios) -> npx cap sync ios -> pod install -> xcodebuild.
  Code signing is disabled: simulator builds do not need a certificate.

.PARAMETER Device
  Simulator to build for, by name or UDID. Default "iPhone 17".

.PARAMETER Configuration
  Debug (default) or Release.

.PARAMETER UseWindowsBuild
  Build the web bundle here with `npm run build`, send dist/ and let the Mac skip
  vite entirely. Faster when this PC is the stronger machine.

.PARAMETER NoSync
  Build whatever is already on the Mac.

.PARAMETER Clean
  Delete the Mac's derived data before building.

.PARAMETER Verbose2
  Show the full xcodebuild log instead of the quiet one.

.EXAMPLE
  .\Mac-Build-iOS.ps1
.EXAMPLE
  .\Mac-Build-iOS.ps1 -Device 'iPad Pro 11-inch (M5)' -Configuration Release -Clean
#>
[CmdletBinding()]
param(
    [string]$Device,
    [ValidateSet('Debug', 'Release')][string]$Configuration = 'Debug',
    [switch]$UseWindowsBuild,
    [switch]$NoSync,
    [switch]$Clean,
    [switch]$Verbose2
)

. (Join-Path $PSScriptRoot '_common.ps1')

if (-not $Device) { $Device = $DefaultSim }

Write-Banner "Build iOS ($Configuration) for $Device"

if ($UseWindowsBuild) {
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
if ($UseWindowsBuild) { $scriptArgs += '--skip-web' }
if ($Clean)           { $scriptArgs += '--clean' }
if ($Verbose2)        { $scriptArgs += '--verbose' }

$start = Get-Date
Invoke-MacScript -Script 'build-ios.sh' -Arguments $scriptArgs
Write-Ok ("build finished in {0:n0}s" -f ((Get-Date) - $start).TotalSeconds)
