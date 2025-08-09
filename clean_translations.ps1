# PowerShell script to clean duplicate translations
$filePath = "C:\EasyMed-TeleHealth\src\translations.ts"
$content = Get-Content $filePath -Raw

# Define sections to clean - look for duplicated English text blocks
$duplicatePatterns = @(
    'familyHealthTitle: "Family Health",',
    'wife: "Wife",',
    'son: "Son",',
    'allVitalsNormal: "All vitals normal",',
    'vaccinationDue: "Vaccination due",',
    'recentActivity: "Recent Activity",',
    'bloodPressureRecorded: "Blood pressure recorded",',
    'hoursAgo: "2 hours ago",',
    'appointmentBooked: "Appointment booked",',
    'yesterday: "Yesterday",',
    'healthReportShared: "Health report shared",',
    'daysAgo: "3 days ago",'
)

# Remove duplicate English entries that appear after non-English translations
foreach ($pattern in $duplicatePatterns) {
    # Find all occurrences
    $matches = [regex]::Matches($content, [regex]::Escape($pattern))
    
    if ($matches.Count -gt 1) {
        Write-Host "Found $($matches.Count) occurrences of: $pattern"
        
        # Keep only the first occurrence (which should be in the English section)
        # Remove subsequent duplicates
        $newContent = $content
        for ($i = $matches.Count - 1; $i -gt 0; $i--) {
            $match = $matches[$i]
            $start = $match.Index
            $length = $match.Length
            
            # Find the line containing this match and remove the entire line
            $beforeMatch = $content.Substring(0, $start)
            $afterMatch = $content.Substring($start + $length)
            
            # Find the start of the line
            $lineStart = $beforeMatch.LastIndexOf("`n") + 1
            if ($lineStart -eq 0) { $lineStart = 0 }
            
            # Find the end of the line (including newline)
            $lineEnd = $afterMatch.IndexOf("`n")
            if ($lineEnd -eq -1) { $lineEnd = $afterMatch.Length }
            else { $lineEnd += 1 } # Include the newline
            
            # Remove the entire line
            $totalStart = $lineStart
            $totalLength = ($start + $length + $lineEnd) - $lineStart
            
            $newContent = $newContent.Remove($totalStart, $totalLength)
            $content = $newContent
        }
    }
}

# Also remove duplicate voiceCommands blocks that are in English
$voiceCommandsPattern = 'voiceCommands: \{\s*goToAppointments: "Opening appointments for you",.*?\},'
$voiceMatches = [regex]::Matches($content, $voiceCommandsPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)

if ($voiceMatches.Count -gt 1) {
    Write-Host "Found $($voiceMatches.Count) voiceCommands blocks"
    
    # Keep only the first one, remove the rest
    for ($i = $voiceMatches.Count - 1; $i -gt 0; $i--) {
        $match = $voiceMatches[$i]
        $start = $match.Index
        $length = $match.Length
        
        # Find the line containing this match and remove it
        $beforeMatch = $content.Substring(0, $start)
        $afterMatch = $content.Substring($start + $length)
        
        # Find the start of the line
        $lineStart = $beforeMatch.LastIndexOf("`n") + 1
        if ($lineStart -eq 0) { $lineStart = 0 }
        
        # Find the end of the block (including newline after closing brace)
        $lineEnd = $afterMatch.IndexOf("`n")
        if ($lineEnd -eq -1) { $lineEnd = $afterMatch.Length }
        else { $lineEnd += 1 }
        
        # Remove the entire block
        $totalStart = $lineStart
        $totalLength = ($start + $length + $lineEnd) - $lineStart
        
        $content = $content.Remove($totalStart, $totalLength)
    }
}

# Write the cleaned content back to file
$content | Set-Content $filePath -NoNewline

Write-Host "Translation file cleaned successfully!"
Write-Host "Duplicate English entries have been removed."
