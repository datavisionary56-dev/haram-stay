$desktopPath = [Environment]::GetFolderPath("Desktop")
$source = "package.json"
$dest = Join-Path $desktopPath "package.json"

if (Test-Path $source) {
    Copy-Item -Path $source -Destination $dest -Force
    Write-Host "Successfully copied $source to $dest" -ForegroundColor Green
} else {
    Write-Error "Source file not found: $source"
}
