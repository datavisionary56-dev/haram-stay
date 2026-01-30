$ErrorActionPreference = "Continue" # Changed to Continue to handle git errors manually

Write-Host "Configuring Git..." -ForegroundColor Cyan
git config user.email "datavisionary56@gmail.com"
git config user.name "HaramStay-User"

# Check if we need to commit
$status = git status --porcelain
if ($status) {
    Write-Host "Changes detected, committing..." -ForegroundColor Cyan
    git add .
    git commit -m "Initial upload: Fixed structure and config"
} else {
    Write-Host "No new changes to commit." -ForegroundColor Yellow
}

Write-Host "Renaming branch to main..." -ForegroundColor Cyan
git branch -M main

Write-Host "Configuring remote..." -ForegroundColor Cyan
# Try to remove origin, ignore error if it doesn't exist
git remote remove origin 2>&1 | Out-Null

# Add origin
git remote add origin https://github.com/datavisionary56/haram-stay.git

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "NOTE: If a login window appears, please sign in." -ForegroundColor Yellow
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSUCCESS: Code uploaded successfully!" -ForegroundColor Green
} else {
    Write-Host "`nPush failed. Please check your credentials or internet connection." -ForegroundColor Red
}
