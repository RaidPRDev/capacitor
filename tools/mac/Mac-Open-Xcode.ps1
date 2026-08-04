<#
.SYNOPSIS
  Open the synced iOS workspace in Xcode on the Mac.

.DESCRIPTION
  Xcode's window appears on the Mac's own display, so pair this with Screen
  Sharing / VNC when you need the real IDE (Interface Builder, signing dialogs,
  Instruments). Everything else in this folder works headlessly.

  Windows can connect with any VNC client, or use Microsoft Remote Desktop's
  bundled RealVNC-compatible viewer:  vnc://<mac-ip>:5900
  Enable it on the Mac: System Settings > General > Sharing > Screen Sharing.

.PARAMETER Simulator
  Also boot and show Simulator.app.

.EXAMPLE
  .\Mac-Open-Xcode.ps1
#>
[CmdletBinding()]
param([switch]$Simulator)

. (Join-Path $PSScriptRoot '_common.ps1')

Write-Banner 'Open Xcode on the Mac'
Test-MacSsh

Invoke-Mac -Command "open $MacProject/ios/App/App.xcworkspace"
Write-Ok 'Xcode is opening on the Mac''s display'

if ($Simulator) {
    Invoke-MacScript -Script 'sim.sh' -Arguments @('boot', $DefaultSim)
}

Write-Note "Screen Sharing: vnc://$MacHost`:5900"
