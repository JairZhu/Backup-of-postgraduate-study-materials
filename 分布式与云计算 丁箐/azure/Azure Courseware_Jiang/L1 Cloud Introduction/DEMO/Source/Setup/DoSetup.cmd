@ECHO OFF
SETLOCAL EnableDelayedExpansion
%~d0

CD "%~dp0"

SET powerShellDir=%WINDIR%\system32\windowspowershell\v1.0
echo.
echo ========= Setting PowerShell Execution Policy =========
%powerShellDir%\powershell.exe -NonInteractive -Command "Set-ExecutionPolicy unrestricted"
echo Setting Execution Policy Done!

%powerShellDir%\powershell.exe -NonInteractive -command "& '%~dp0\setup.local.ps1'" "..\Config.Local.xml"

@pause

