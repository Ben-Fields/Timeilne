# Concat-Files concatenates the contents of the given array of files and saves 
# the output to the given output file name.

# Author: Benjamin Fields

function Concat-Files {
	param(
		[System.Collections.Specialized.OrderedDictionary]$Files, # Set of files to concatenate
		[string]$OutputFile # File in which the generated output will be saved
	)
	
	# Create output file; save previous as backup
	if (Test-Path -Path $OutputFile -PathType Leaf) {
		$backupFile = "${OutputFile}.backup"
		if (Test-Path -Path $backupFile -PathType Leaf) {
			Remove-Item -Path $backupFile
		}
		Rename-Item -Path $OutputFile -NewName $backupFile
	}
	New-Item -Path $OutputFile -ItemType "file" -Value "" | Out-Null

	# Concatenate the files
	foreach ($file in $Files.Keys) {
		Add-Content -Path $OutputFile -Value (Get-Content -Path $file -Raw)
	}

	Write-Host "Concatenated files to $(Resolve-Path -LiteralPath $OutputFile -Relative)."
}

