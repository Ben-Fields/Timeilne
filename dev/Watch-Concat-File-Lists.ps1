# Concat-File-Lists looks inside the given source folder for all files with the ".files"
# extension. These are "list files". Concat-File-Lists reads each line of such a file as a 
# file name. Concat-File-Lists monitors for changes to any file in the list, and, when a 
# file is changed, it generates a file in the output directory with contents equal to the 
# concatenation of all files in the list file. The output file name is the same as the 
# list file name, except with an extension taken from the first file in the list, rather 
# than the list file itself.

# Author: Benjamin Fields

. "$PSScriptRoot/Watch-FS"
. "$PSScriptRoot/Concat-Files"

# File index as a hashtable of hashtables
# Ex. listFile1.files: { file1.js, file2.js, ... }, listFile2.files: { ... }
$listFileIndex = @{}
# Output file names accessed with the list file name
$outputFilePaths = @{}

function Watch-Concat-File-Lists {
	param(
		[string]$InFolder,   # Full path to folder to watch
		[string]$OutFolder   # Full path to destination folder
	)

	# Get in/out folder paths
	$inFolderPath = Resolve-Path -LiteralPath $InFolder
	$outFolderPath = Resolve-Path -LiteralPath $OutFolder

	if ($inFolderPath -eq $null) {
		Write-Host "Input folder is invalid."
		return
	}
	if ($inFolderPath -eq $null) {
		Write-Host "Output folder is invalid."
		return
	}

	$inFolderPath = $inFolderPath.ToString()
	$outFolderPath = $outFolderPath.ToString()

	if ($inFolderPath -eq $outFolderPath) {
		Write-Host "Input and output folders cannot be the same."
		return
	}

	# Get the list files within the input folder
	$listFiles = Get-ChildItem -Path $InFolder -Filter "*.files"

	Write-Host "Monitoring list files for concatenation:"
	foreach ($listFile in $listFiles) {
		# Get list file info
		$listFilePath = $listFile.FullName
		$listFileRelativePath = (Resolve-Path -LiteralPath (Join-Path $InFolder $listFile) -Relative).ToString()

		Write-Host "`t${listFileRelativePath}"

		# Add list file to list file index
		Index-List-File -Path $listFilePath
	}
	Write-Host ""

	# Cheat and assume files need to be rebuilt on startup
	foreach ($listFileKey in $listFileIndex.Keys) {
		$fileIndex = $listFileIndex[$listFileKey]
		Concat-Files -Files $fileIndex -OutputFile $outputFilePaths[$listFileKey]
	}
    Write-Host ""

	# Watch all files for changes. Restart watcher if list file changed.
	while ($true) {
		try {
			Watch-FS -Folder $inFolderPath -Files (All-Files) -Action {On-Change-Action}
		} catch {
			if ($_.ToString() -eq "ListFileIndexUpdated") {
				continue
			} else {
				throw
			}
		}
	}

}

# Build the file index for the given list file
function Index-List-File {
	param(
		[string]$Path
	)

	# Build file index
	$fileIndex = [ordered]@{}
	$fileList = Get-Content $listFilePath

	foreach ($file in $fileList) {
		# Skip whitespace
		$cleanFile = $file.Trim()
		if ($cleanFile -eq "") {
			continue
		}
		# Add listed file to index
		$filePath = (Resolve-Path -LiteralPath (Join-Path $inFolderPath $cleanFile)).ToString()
		$fileIndex.Add($filePath, $true)
	}

	# Add to list file index
	$listFileIndex[$Path] = $fileIndex

	# Update output file name
	$name1 = (Get-Item $Path).BaseName
	$firstFilePath = Resolve-Path -LiteralPath (Join-Path $inFolderPath $fileList[0])
	$name2 = (Get-Item $firstFilePath).Extension
	$outputFilePaths[$Path] = Join-Path $outFolderPath "${name1}${name2}"
}

# Flatten the list file index into a single hash table for the file watcher
function All-Files {
	# Input is a hash table of hash tables.
	$Output = @{}
	foreach ($listFileKey in $listFileIndex.Keys) {
		$Output.Add($listFileKey, $true)
		foreach ($fileKey in $listFileIndex[$listFileKey].Keys) {
			$Output.Add($fileKey, $true)
		}
	}
	$Output
}

# Concatenate the relevant files when a file is changed
function On-Change-Action {
	# External variables provided by the file watcher:
	#   $fullPath           : Full path of the changed file
	#   $name               : Name of the changed file
	#   $cwdRelativePath    : Path of the changed file relative to the current directory

	if ($listFileIndex.Contains($fullPath)) {
		# List file changed, need to update index
		Write-Host "List file updated: $(Resolve-Path -LiteralPath $fullPath -Relative)"
		Write-Host ""
		Index-List-File -Path $fullPath
		# Scope that created the watcher needs to re-instantiate it
		throw "ListFileIndexUpdated"
	} else {
		# A file to be concatenated has changed
		foreach ($listFileKey in $listFileIndex.Keys) {
			$fileIndex = $listFileIndex[$listFileKey]
			if ($fileIndex.Contains($fullPath)) {
				Concat-Files -Files $fileIndex -OutputFile $outputFilePaths[$listFileKey]
			}
		}
	}
}
