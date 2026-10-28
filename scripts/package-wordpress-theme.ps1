$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$projectRoot = Split-Path -Parent $PSScriptRoot
$themePath = Join-Path $projectRoot 'wordpress-theme'
$zipPath = Join-Path $projectRoot 'Forgelinea-WordPress-Theme.zip'
$requiredFiles = @(
    'style.css',
    'functions.php',
    'index.php',
    'build/manifest.json'
)

foreach ($relativePath in $requiredFiles) {
    $filePath = Join-Path $themePath ($relativePath.Replace('/', '\'))
    if (-not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
        throw "WordPress theme file is missing: $filePath. Build the theme first."
    }
}

if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

$archive = [System.IO.Compression.ZipFile]::Open(
    $zipPath,
    [System.IO.Compression.ZipArchiveMode]::Create
)

try {
    Get-ChildItem -LiteralPath $themePath -File -Recurse | ForEach-Object {
        $relativePath = $_.FullName.Substring($themePath.Length).TrimStart('\').Replace('\', '/')
        $entry = $archive.CreateEntry(
            $relativePath,
            [System.IO.Compression.CompressionLevel]::Optimal
        )
        $sourceStream = [System.IO.File]::OpenRead($_.FullName)
        $output = $entry.Open()

        try {
            $sourceStream.CopyTo($output)
        }
        finally {
            $output.Dispose()
            $sourceStream.Dispose()
        }
    }
}
finally {
    $archive.Dispose()
}

$check = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
    $entries = @($check.Entries | ForEach-Object { $_.FullName })
    foreach ($relativePath in $requiredFiles) {
        if ($entries -notcontains $relativePath) {
            throw "Upload ZIP is missing root entry: $relativePath"
        }
    }

    if (@($entries | Where-Object { $_ -match '\\' }).Count -gt 0) {
        throw 'Upload ZIP contains invalid Windows-style path separators.'
    }
}
finally {
    $check.Dispose()
}

Write-Output "WordPress theme package created: $zipPath"
