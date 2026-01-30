$desktopPath = [Environment]::GetFolderPath("Desktop")
$dest = Join-Path $desktopPath "HaramStay-Ready"

# Check root structure
if ((Test-Path "src") -and (Test-Path "public")) {
    Write-Host "Confirmed: src and public folders exist in root." -ForegroundColor Green
} else {
    Write-Warning "Warning: src or public folder missing in root!"
}

# Copy new/updated files
$filesToCopy = @("vercel.json", "next.config.ts")

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $dest -Force
        Write-Host "Copied $file to $dest" -ForegroundColor Green
    }
}
