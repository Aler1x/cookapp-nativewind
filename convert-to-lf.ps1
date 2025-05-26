# Convert CRLF to LF for all text files
$fileExtensions = @("*.ts", "*.tsx", "*.js", "*.jsx", "*.json", "*.md", "*.yml", "*.yaml", "*.txt", "*.config.js", "*.config.ts")
$excludePaths = @("node_modules", ".expo", ".git", "pnpm-lock.yaml")

Write-Host "Converting CRLF to LF line endings..."

Get-ChildItem -Recurse -Include $fileExtensions | Where-Object {
    $exclude = $false
    foreach ($excludePath in $excludePaths) {
        if ($_.FullName -match [regex]::Escape($excludePath)) {
            $exclude = $true
            break
        }
    }
    -not $exclude
} | ForEach-Object {
    try {
        $content = Get-Content $_.FullName -Raw -ErrorAction Stop
        if ($content -and $content.Contains("`r`n")) {
            $newContent = $content -replace "`r`n", "`n"
            Set-Content $_.FullName -Value $newContent -NoNewline -ErrorAction Stop
            Write-Host "Converted: $($_.FullName)"
        }
    }
    catch {
        Write-Warning "Failed to process: $($_.FullName) - $($_.Exception.Message)"
    }
}

Write-Host "Conversion complete!" 