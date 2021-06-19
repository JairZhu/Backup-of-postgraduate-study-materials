###################
#    Functions    #
###################

function MoveFileContents ([string] $sourceFilePath, [string] $destinationFilePath )
{
       [byte[]] $bytes = [System.IO.File]::ReadAllBytes( $(resolve-path $sourceFilePath) )
       [System.IO.File]::WriteAllBytes($destinationFilePath, $bytes)
}

function UnblockFile([string] $filePath)
{
    $filePath = Resolve-Path $filePath
    $bakFilePath = $filePath + ".bak"
    Rename-Item $filePath $bakFilePath 
    MoveFileContents $bakFilePath $filePath   
    Remove-Item $bakFilePath
}

function DownloadFile([string] $filePath)
{    
    $url = "http://go.microsoft.com/fwlink/?LinkId=245702"
    $webclient = New-Object System.Net.WebClient 
    
    try 
    {       
        write-host "Downloading Dependency Checker. This may take a while if you have a slow Internet connection."
		$webclient.DownloadFile($url, $filePath)                 
    }        
    catch [System.Net.WebException]
    {
        if(Test-Path $filePath)
        {
            rem $filePath
        }
        
        write-error "An error has occurred downloading the Dependency Checker file."
        exit
    }
}

#####################
#    Main script    #
#####################

$scriptDir = (Split-Path $myinvocation.mycommand.path -parent)
Set-Location $scriptDir

$filePath = Join-Path $scriptDir "..\DC.exe"

# Check if the DC.EXE File already exists
if(-NOT (Test-Path $filePath))
{
    # Download DC.EXE File
    DownloadFile $filePath    
    
    # UnBlock DC.EXE File (Zone.Identifier)
    UnblockFile $filePath
}

$filePath = Resolve-Path $filePath

# Run DC.EXE File
write-host "Running Dependency Checker..."
cd ..
& ".\DC.exe"

