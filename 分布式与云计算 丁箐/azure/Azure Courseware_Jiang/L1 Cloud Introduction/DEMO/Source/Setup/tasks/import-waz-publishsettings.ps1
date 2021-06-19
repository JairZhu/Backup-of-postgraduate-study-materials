Param([string] $azureNodeSDKDir,
	[string] $wazPublishSettings)

write-host "========= Importing the Windows Azure Subscription Settings File... ========="
if($azureNodeSDKDir) {
	$azureCmd = (Join-Path $azureNodeSDKDir "node.exe") + " " + (Join-Path $azureNodeSDKDir "bin\azure")
	}
else {
	$azureCmd = "azure"
	}

$accountImport = "$azureCmd " + 'account import "' + $wazPublishSettings + '"'
Invoke-Expression $accountImport
write-host "Importing the Windows Azure Subscription Settings File done!"