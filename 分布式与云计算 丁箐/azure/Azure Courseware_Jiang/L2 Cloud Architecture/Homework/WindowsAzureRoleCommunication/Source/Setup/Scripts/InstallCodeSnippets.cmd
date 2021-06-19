setlocal 
cd %~dp0

@echo off

SET curPath=%CD%
cd..

SET labPath=%CD%

echo.
echo ====================================================
echo Install Visual Studio 2008 Code Snippets for the lab
echo ====================================================
echo.

"%~dp0\snippets\WindowsAzureRoleCommunication.vsi"

GOTO FINISH

:error
echo.
echo ======================================
echo An error occured. 
echo Please review messages above.
echo ======================================


:FINISH
@PAUSE