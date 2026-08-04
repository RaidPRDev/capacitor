<#
.SYNOPSIS
  Stream the app's iOS Simulator log from the Mac to this terminal.

.DESCRIPTION
  The console.log output from the web layer shows up here too. Ctrl+C to stop.

.PARAMETER Device
  Simulator by name or UDID. Default "iPhone 17".

.PARAMETER All
  Include Apple's own subsystems (UIKit, WebKit, ...). Very noisy, but the place
  to look when the app dies before its own logging starts.

.EXAMPLE
  .\Mac-Logs-iOS.ps1
#>
[CmdletBinding()]
param(
    [string]$Device,
    [switch]$All
)

. (Join-Path $PSScriptRoot '_common.ps1')

if (-not $Device) { $Device = $DefaultSim }

$scriptArgs = @('logs', $Device)
if ($All) { $scriptArgs += '--all' }

Write-Banner "Logs from $Device"
Write-Note 'Ctrl+C to stop streaming.'
Invoke-MacScript -Script 'sim.sh' -Arguments $scriptArgs -Interactive -AllowFail
