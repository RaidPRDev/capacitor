<#
.SYNOPSIS
  Check that Windows and the Mac are both ready for remote iOS builds.

.DESCRIPTION
  Verifies the local ssh client, reachability, key auth, and then runs
  remote/doctor.sh on the Mac to report on Xcode, node, CocoaPods, the synced
  project and the available simulators.

.EXAMPLE
  .\Mac-Doctor.ps1
#>
[CmdletBinding()]
param()

. (Join-Path $PSScriptRoot '_common.ps1')

Write-Banner 'Doctor'

Write-Step 'Windows side'
foreach ($exe in 'ssh', 'scp', 'tar') {
    $cmd = Get-Command $exe -ErrorAction SilentlyContinue
    if ($cmd) { Write-Ok "$exe -> $($cmd.Source)" }
    else { Write-Warn "$exe not found -- install the Windows OpenSSH client feature" }
}
Write-Note "project    $LocalRoot"
Write-Note "lan ip     $(try { Get-LocalLanIp } catch { 'unknown' })  (live reload host)"

Write-Step "Reaching $MacHost`:22"
if (Test-NetConnection -ComputerName $MacHost -Port 22 -InformationLevel Quiet -WarningAction SilentlyContinue) {
    Write-Ok 'port 22 open'
} else {
    Write-Warn "No route to $MacHost`:22 -- is the Mac awake and is Remote Login enabled?"
    Write-Note 'On the Mac: System Settings > General > Sharing > Remote Login'
    throw "Cannot reach $MacHost on port 22"
}

Test-MacSsh

Write-Step 'Mac side'
$remoteExists = Invoke-Mac -Command "test -f $RemoteTools/doctor.sh && echo yes" -AllowFail -Quiet
if ($remoteExists -notcontains 'yes') {
    Write-Warn "The project is not on the Mac yet at $MacProject"
    Write-Note 'Run .\Mac-Sync.ps1 first, then re-run the doctor.'
    return
}
Invoke-MacScript -Script 'doctor.sh'
