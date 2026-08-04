<#
.SYNOPSIS
  Capture the Mac's iOS Simulator screen and save the PNG on this PC.

.PARAMETER Device
  Simulator by name or UDID. Default "iPhone 17".

.PARAMETER OutFile
  Where to write the PNG. Defaults to tools\mac\screenshots\<device>-<timestamp>.png.

.PARAMETER Open
  Open the PNG in the default image viewer afterwards.

.EXAMPLE
  .\Mac-Screenshot-iOS.ps1 -Open
#>
[CmdletBinding()]
param(
    [string]$Device,
    [string]$OutFile,
    [switch]$Open
)

. (Join-Path $PSScriptRoot '_common.ps1')

if (-not $Device) { $Device = $DefaultSim }
if (-not $OutFile) {
    $slug  = ($Device -replace '[^\w\-]+', '-').Trim('-')
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $OutFile = Join-Path $PSScriptRoot "screenshots\$slug-$stamp.png"
}

Write-Step "Capturing $Device"
$remotePng = "/tmp/elso-sim-shot.png"
Invoke-MacScript -Script 'sim.sh' -Arguments @('screenshot', $Device, $remotePng)
Copy-FromMac -RemotePath $remotePng -LocalPath $OutFile
Invoke-Mac -Command "rm -f $remotePng" -AllowFail | Out-Null

$kb = [math]::Round((Get-Item $OutFile).Length / 1KB)
Write-Ok "$OutFile ($kb KB)"
if ($Open) { Start-Process $OutFile }
