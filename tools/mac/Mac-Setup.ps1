<#
.SYNOPSIS
  Prepare the synced project on the Mac: node, npm install, pod install.

.DESCRIPTION
  Safe to re-run; it skips work that is already done. Run it after the first
  sync, and again whenever package-lock.json or ios/App/Podfile changes.

.PARAMETER Force
  Reinstall node_modules and Pods even if they look current.

.PARAMETER NoSync
  Use the copy already on the Mac instead of syncing first.

.EXAMPLE
  .\Mac-Setup.ps1
#>
[CmdletBinding()]
param(
    [switch]$Force,
    [switch]$NoSync
)

. (Join-Path $PSScriptRoot '_common.ps1')

Write-Banner 'Setup Mac build environment'

if (-not $NoSync) { & (Join-Path $PSScriptRoot 'Mac-Sync.ps1') }
else { Test-MacSsh }

$scriptArgs = @()
if ($Force) { $scriptArgs += '--force' }

Write-Step 'Running setup on the Mac (first run installs pods -- a few minutes)'
Invoke-MacScript -Script 'setup.sh' -Arguments $scriptArgs
