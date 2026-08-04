@echo off
title ELSO - build and run on the Mac's iOS Simulator
REM Double-clickable wrapper around Mac-Run-iOS.ps1.
REM Pass any of that script's switches through, e.g.:
REM   Run-iOS-Simulator.bat -Live
REM   Run-iOS-Simulator.bat -Device "iPad Air 11-inch (M4)" -Screenshot
pushd "%~dp0"
pwsh -NoProfile -ExecutionPolicy Bypass -File ".\Mac-Run-iOS.ps1" %*
if errorlevel 1 (
  echo.
  echo  Build failed - see the output above. Try:  pwsh -File .\Mac-Doctor.ps1
)
popd
echo.
pause
