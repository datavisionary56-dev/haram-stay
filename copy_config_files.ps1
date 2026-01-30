$desktopPath = [Environment]::GetFolderPath("Desktop")

$files = @(
    @{ Source = "next.config.ts"; Dest = "next.config.ts" },
    @{ Source = "tsconfig.json"; Dest = "tsconfig.json" }
)

foreach ($file in $files) {
    $sourcePath = Join-Path (Get-Location) $file.Source
    $destPath = Join-Path $desktopPath $file.Dest
    
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "Successfully copied $($file.Source) to $destPath" -ForegroundColor Green
    } else {
        Write-Error "Source file not found: $($file.Source)"
    }
}
