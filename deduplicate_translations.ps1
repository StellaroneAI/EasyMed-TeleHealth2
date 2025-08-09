# Comprehensive PowerShell script to deduplicate translations
$filePath = "C:\EasyMed-TeleHealth\src\translations.ts"
$content = Get-Content $filePath -Raw

# Regex to match object literal blocks per language
$pattern = [regex] '{\s*((?:[^{}]|{(?<c>)|}(?<-c>))+(?(c)(?!)))\}'

# Find all matches (language-specific sections)
$matches = [regex]::Matches($content, $pattern)

# Function to remove duplicate keys from a block
function Remove-DuplicateKeys {
    param (
        [string]$block
    )

    $lines = $block -split "`r?`n"
    $keySet = @{}
    $cleanedLines = @()

    foreach ($line in $lines) {
        $trimmedLine = $line.Trim()
        if ($trimmedLine -match '^([^:]+):') {
            $key = $matches[1].Trim()
            if (-not $keySet.ContainsKey($key)) {
                $keySet[$key] = $true
                $cleanedLines += $line
            }
        } else {
            $cleanedLines += $line
        }
    }

    return $cleanedLines -join "`n"
}

# Iterate and clean each language block
foreach ($match in $matches) {
    $cleanedBlock = Remove-DuplicateKeys ($match.Groups[1].Value)
    $content = $content.Replace($match.Groups[0].Value, '{' + $cleanedBlock + '}')
}

# Write the cleaned content back to file
$content | Set-Content $filePath -NoNewline

Write-Host "Completed deduplication of translation keys."
