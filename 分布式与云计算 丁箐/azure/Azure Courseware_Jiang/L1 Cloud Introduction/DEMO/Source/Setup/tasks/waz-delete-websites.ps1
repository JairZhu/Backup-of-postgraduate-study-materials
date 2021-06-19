Param([string] $azureNodeSDKDir,
	[string] $webSitesToDelete)

write-host "========= Deleting Configured Windows Azure Web Sites... ========="
if($azureNodeSDKDir) {
	$azureCmd = (Join-Path $azureNodeSDKDir "node.exe") + " " + (Join-Path $azureNodeSDKDir "bin\azure")
	}
else {
	$azureCmd = "azure"
	}

[array] $deleteList = $webSitesToDelete.Split(",") | % { $_.Trim() }
[regex]::matches((Invoke-Expression "$azureCmd site list"), "data:\s+(\S+)\s+([^-\s]+)") | Where { $deleteList -contains $_.Groups[1].value -and $_.Groups[2].value -ne "State" } | foreach-object { Invoke-Expression ("$azureCmd site delete -q " + $_.Groups[1].value) }
write-host "========= Deleting Configured Windows Azure Web Sites done! ========= "	
