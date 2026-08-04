<#
.SYNOPSIS
  Open an interactive shell on the Mac, in the synced project directory.

.PARAMETER Command
  Run this command instead of starting an interactive session. The build
  environment (Homebrew, nvm node, CocoaPods) is loaded first.

.EXAMPLE
  .\Mac-Shell.ps1
.EXAMPLE
  .\Mac-Shell.ps1 -Command 'npx cap doctor ios'
#>
[CmdletBinding()]
param([string]$Command)

. (Join-Path $PSScriptRoot '_common.ps1')

if ($Command) {
    # elso-env.sh is bash (BASH_SOURCE, arrays), and the login shell here is zsh.
    $inner  = ConvertTo-ShQuote ". $RemoteTools/elso-env.sh; cd `$PROJECT_DIR; $Command"
    Invoke-Mac -Interactive -Command "bash -c $inner"
} else {
    Write-Note "Opening a shell on $MacTarget in $MacProject"
    Invoke-Mac -Interactive -AllowFail -Command `
        "cd $MacProject 2>/dev/null; exec `$SHELL -l"
}
