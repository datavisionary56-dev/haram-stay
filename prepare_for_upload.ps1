$desktopPath = [Environment]::GetFolderPath("Desktop")
$dest = Join-Path $desktopPath "HaramStay-Ready"

Write-Host "Preparing to copy files to: $dest" -ForegroundColor Cyan

# Create destination directory
if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest | Out-Null
    Write-Host "Created directory: $dest" -ForegroundColor Green
}

# Files to copy
$filesToCopy = @("package.json", "next.config.ts", "next.config.js", "tsconfig.json", "tailwind.config.ts", "tailwind.config.js")

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $dest -Force
        Write-Host "Copied file: $file" -ForegroundColor Green
    }
}

# Folders to copy
$foldersToCopy = @("src", "public")

foreach ($folder in $foldersToCopy) {
    if (Test-Path $folder) {
        $folderDest = Join-Path $dest $folder
        if (!(Test-Path $folderDest)) {
            New-Item -ItemType Directory -Path $folderDest | Out-Null
        }
        Copy-Item "$folder\*" -Destination $folderDest -Recurse -Force
        Write-Host "Copied folder: $folder" -ForegroundColor Green
    } else {
        Write-Warning "Folder not found: $folder"
    }
}

Write-Host "`nOperation completed successfully!" -ForegroundColor Cyan
Write-Host "You can now drag the folder '$dest' to GitHub Desktop or upload it manually." -ForegroundColor Yellow
# Pause removed for automated execution
