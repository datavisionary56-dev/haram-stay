$ErrorActionPreference = "Stop"

try {
    Write-Host "Checking Git version..." -ForegroundColor Cyan
    git --version

    Write-Host "Configuring Git user..." -ForegroundColor Cyan
    git config user.email "datavisionary56@gmail.com"
    git config user.name "HaramStay-User"

    Write-Host "Initializing repository..." -ForegroundColor Cyan
    git init

    Write-Host "Adding files (this may take a moment)..." -ForegroundColor Cyan
    git add .

    Write-Host "Committing files..." -ForegroundColor Cyan
    git commit -m "Initial upload: Fixed structure and config"

    Write-Host "Renaming branch to main..." -ForegroundColor Cyan
    git branch -M main

    Write-Host "Configuring remote origin..." -ForegroundColor Cyan
    # Remove origin if it exists to avoid errors
    git remote remove origin 2>$null
    git remote add origin https://github.com/datavisionary56/haram-stay.git

    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    Write-Host "NOTE: If a login window appears, please sign in." -ForegroundColor Yellow
    git push -u origin main --force

    Write-Host "`nSUCCESS: Code uploaded successfully!" -ForegroundColor Green
}
catch {
    Write-Error "An error occurred: $_"
    Write-Host "Please ensure Git is installed and available in your PATH." -ForegroundColor Red
}
