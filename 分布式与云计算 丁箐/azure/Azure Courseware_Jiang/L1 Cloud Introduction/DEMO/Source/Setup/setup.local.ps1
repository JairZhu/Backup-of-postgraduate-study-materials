Param([string] $configFile)

$scriptDir = (split-path $myinvocation.mycommand.path -parent)
Set-Location $scriptDir

# "========= Main Script =========" #
write-host "========= Install Node Package ... ========="
& npm install azure -g
write-host "========= Installing Node Package done! ... ========="