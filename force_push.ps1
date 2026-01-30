$desktopPath = [Environment]::GetFolderPath("Desktop")
$targetDir = Join-Path $desktopPath "HaramStay-Ready"
$projectRoot = "c:\Users\GAMA\Documents\trae_projects\HaramStay"

# 1. Copy latest config files to target
$filesToUpdate = @("next.config.ts", "vercel.json", ".gitignore")

foreach ($file in $filesToUpdate) {
    $sourcePath = Join-Path $projectRoot $file
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath -Destination $targetDir -Force
        Write-Host "Updated $file in $targetDir" -ForegroundColor Green
    } else {
        Write-Warning "File not found: $sourcePath"
    }
}

# 2. Setup Git and Force Push
if (Test-Path $targetDir) {
    Set-Location $targetDir

    Write-Host "Initializing Git repository in $targetDir..." -ForegroundColor Cyan
    git init

    # Configure user if not set
    git config user.email "auto@haramstay.com"
    git config user.name "HaramStay Builder"

    git branch -M main

    # Remove existing remote if any
    git remote remove origin 2>$null

    # Add remote
    Write-Host "Adding remote origin..." -ForegroundColor Cyan
    git remote add origin https://github.com/datavisionary56-dev/haram-stay.git

    # Add files
    Write-Host "Adding files..." -ForegroundColor Cyan
    git add .

    # Commit
    Write-Host "Committing files..." -ForegroundColor Cyan
    git commit -m "Fix Vercel 404: Updated config and structure"

    # Push
    Write-Host "Pushing to GitHub (Force)..." -ForegroundColor Cyan
    Write-Host "NOTE: A login window may appear. Please sign in." -ForegroundColor Yellow
    git push -u origin main --force

    Write-Host "`nDone! Check your GitHub repository now." -ForegroundColor Green
    Pause
} else {
    Write-Error "Target directory $targetDir does not exist. Please run the preparation script first."
    Pause
}
