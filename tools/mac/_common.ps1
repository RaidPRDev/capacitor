# Shared configuration and helpers for driving the network Mac from Windows.
# Dot-sourced by every Mac-*.ps1 script in this folder; not meant to be run directly.

$ErrorActionPreference = 'Stop'

# --- settings -----------------------------------------------------------------
# Override any of these per-shell with an environment variable, e.g.
#   $env:ELSO_MAC_HOST = '10.0.0.42'
$MacHost    = if ($env:ELSO_MAC_HOST)    { $env:ELSO_MAC_HOST }    else { '10.0.0.189' }
$MacUser    = if ($env:ELSO_MAC_USER)    { $env:ELSO_MAC_USER }    else { 'rafael' }
$MacProject = if ($env:ELSO_MAC_PROJECT) { $env:ELSO_MAC_PROJECT } else { '~/dev/elso-capacitor' }
$DefaultSim = if ($env:ELSO_SIM)         { $env:ELSO_SIM }         else { 'iPhone 17' }
$DevPort    = if ($env:ELSO_DEV_PORT)    { $env:ELSO_DEV_PORT }    else { '3005' }

$MacTarget  = "$MacUser@$MacHost"
$LocalRoot  = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$RemoteTools = "$MacProject/tools/mac/remote"

$SshOptions = @(
  '-o', 'ConnectTimeout=10'
  '-o', 'StrictHostKeyChecking=accept-new'
  '-o', 'ServerAliveInterval=15'
  '-o', 'ServerAliveCountMax=4'
)

# --- output -------------------------------------------------------------------
function Write-Step { param([string]$Message) Write-Host "`n>> $Message" -ForegroundColor Cyan }
function Write-Ok   { param([string]$Message) Write-Host "   ok $Message" -ForegroundColor Green }
function Write-Note { param([string]$Message) Write-Host "   $Message" -ForegroundColor DarkGray }
function Write-Warn { param([string]$Message) Write-Host "   !! $Message" -ForegroundColor Yellow }

function Write-Banner {
    param([string]$Title)
    Write-Host ''
    Write-Host "  $Title" -ForegroundColor White -BackgroundColor DarkBlue
    Write-Host "  $MacTarget : $MacProject" -ForegroundColor DarkGray
}

# --- ssh ----------------------------------------------------------------------
# Quote a value for a POSIX shell so simulator names with spaces survive the trip.
function ConvertTo-ShQuote {
    param([string]$Value)
    "'" + ($Value -replace "'", "'\''") + "'"
}

# Run a shell command on the Mac, streaming its output. Throws unless -AllowFail.
function Invoke-Mac {
    param(
        [Parameter(Mandatory)][string]$Command,
        [switch]$AllowFail,
        [switch]$Interactive,   # allocate a TTY (needed for sudo / log stream / Ctrl+C)
        [switch]$Quiet          # capture output instead of streaming it
    )
    $sshArgs = @($SshOptions)
    if ($Interactive) { $sshArgs += '-t' } else { $sshArgs += @('-o', 'BatchMode=yes') }
    $sshArgs += @($MacTarget, $Command)

    if ($Quiet) {
        $output = & ssh @sshArgs 2>&1
    } else {
        & ssh @sshArgs
        $output = $null
    }
    $code = $LASTEXITCODE
    if ($code -ne 0 -and -not $AllowFail) {
        if ($Quiet) { $output | ForEach-Object { Write-Host $_ } }
        throw "Mac command failed (exit $code): $Command"
    }
    if ($Quiet) { return $output }
}

# Run one of the remote/*.sh scripts with arguments quoted for the remote shell.
function Invoke-MacScript {
    param(
        [Parameter(Mandatory)][string]$Script,
        [string[]]$Arguments = @(),
        [switch]$AllowFail,
        [switch]$Interactive,
        [switch]$Quiet
    )
    $quoted = $Arguments | ForEach-Object { ConvertTo-ShQuote $_ }
    $command = "bash $RemoteTools/$Script $($quoted -join ' ')"
    Invoke-Mac -Command $command -AllowFail:$AllowFail -Interactive:$Interactive -Quiet:$Quiet
}

function Copy-FromMac {
    param([Parameter(Mandatory)][string]$RemotePath, [Parameter(Mandatory)][string]$LocalPath)
    $dir = Split-Path -Parent $LocalPath
    if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    & scp @($SshOptions) '-q' "${MacTarget}:$RemotePath" $LocalPath
    if ($LASTEXITCODE -ne 0) { throw "scp from Mac failed: $RemotePath" }
}

function Test-MacSsh {
    Write-Step "Checking ssh to $MacTarget"
    $probe = Invoke-Mac -Command 'echo ELSO_SSH_OK' -AllowFail -Quiet
    if ($probe -notcontains 'ELSO_SSH_OK') {
        Write-Warn "Cannot reach $MacTarget over ssh with key auth."
        Write-Note 'Fix it with:'
        Write-Note "  ssh $MacTarget                          # confirm Remote Login is on (System Settings > General > Sharing)"
        Write-Note "  type `$env:USERPROFILE\.ssh\id_ed25519.pub | ssh $MacTarget `"cat >> ~/.ssh/authorized_keys`""
        throw "No usable ssh connection to $MacTarget"
    }
    Write-Ok 'ssh + key auth working'
}

# The LAN address this PC is reachable at from the Mac (for live reload).
function Get-LocalLanIp {
    $macPrefix = ($MacHost -split '\.')[0..2] -join '.'
    $addresses = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
        Where-Object { $_.IPAddress -ne '127.0.0.1' -and $_.PrefixOrigin -ne 'WellKnown' }
    $sameSubnet = $addresses | Where-Object { $_.IPAddress.StartsWith("$macPrefix.") } | Select-Object -First 1
    if ($sameSubnet) { return $sameSubnet.IPAddress }
    $fallback = $addresses | Sort-Object InterfaceMetric | Select-Object -First 1
    if ($fallback) { return $fallback.IPAddress }
    throw 'Could not determine this PC''s LAN IP address'
}
