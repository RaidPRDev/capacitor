<#
.SYNOPSIS
  List and control the Mac's iOS simulators.

.PARAMETER Boot
  Boot this simulator (by name or UDID) and bring up Simulator.app.

.PARAMETER Shutdown
  Shut down this simulator, or 'all'.

.PARAMETER Erase
  Factory-reset this simulator, wiping the installed app and its data.

.EXAMPLE
  .\Mac-Simulators.ps1
.EXAMPLE
  .\Mac-Simulators.ps1 -Boot 'iPad Pro 11-inch (M5)'
.EXAMPLE
  .\Mac-Simulators.ps1 -Shutdown all
#>
[CmdletBinding()]
param(
    [string]$Boot,
    [string]$Shutdown,
    [string]$Erase
)

. (Join-Path $PSScriptRoot '_common.ps1')

if ($Boot)     { Invoke-MacScript -Script 'sim.sh' -Arguments @('boot', $Boot);         return }
if ($Shutdown) { Invoke-MacScript -Script 'sim.sh' -Arguments @('shutdown', $Shutdown); return }
if ($Erase)    { Invoke-MacScript -Script 'sim.sh' -Arguments @('erase', $Erase);       return }

Write-Banner 'Available simulators'
Write-Note "default: $DefaultSim  (override with `$env:ELSO_SIM)"
Invoke-MacScript -Script 'sim.sh' -Arguments @('list')
