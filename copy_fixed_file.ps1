$desktopPath = [Environment]::GetFolderPath("Desktop")
$source = "src\components\HotelsGrid.tsx"
$dest = Join-Path $desktopPath "HotelsGrid-Fixed.tsx"

if (Test-Path $source) {
    Copy-Item -Path $source -Destination $dest -Force
    Write-Host "Successfully copied $source to $dest" -ForegroundColor Green
} else {
    Write-Error "Source file not found: $source"
}
