$csvPath = "Talksmiths_Week1_With_URLs.csv"

if (-Not (Test-Path $csvPath)) {
    Write-Host "Error: Could not find $csvPath. Ensure the python script finished." -ForegroundColor Red
    exit 1
}

$data = Import-Csv $csvPath

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  TALKSMITHS AI SALES AUTOMATION — WEEK 1" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will loop through the top 100 prospects."
Write-Host "It launches 'claude -c ""/sales prospect <url>""' sequentially for each."
Write-Host "Note: This process may take a considerable amount of time."
Write-Host ""

$count = 0
foreach ($row in $data) {outreach preparation phase — ranking, scoring, and building outreach sequences.
    if (-Not [string]::IsNullOrWhiteSpace($row.Website_URL) -and $row.Website_URL -ne 'URL_NOT_FOUND') {
        $name = $row.Name
        $url = $row.Website_URL
        $count++
        
        Write-Host ""
        Write-Host "--------------------------------------------------------"
        Write-Host "🎯 [$count/100] Processing Prospect: $name" -ForegroundColor Yellow
        Write-Host "🔗 URL: $url" -ForegroundColor Gray
        Write-Host "--------------------------------------------------------"
        
        # Trigger the AI Sales Team pipeline for this specific URL
        $commandToRun = "/sales prospect `"$url`""
        Write-Host "Executing > claude -c '$commandToRun'" -ForegroundColor DarkGray
        
        try {
            claude -c "/sales prospect `"$url`""
        } catch {
            Write-Host "⚠️ Error processing $name. Moving to next prospect." -ForegroundColor Red
        }
        
        Write-Host "✅ Finished $name." -ForegroundColor Green
        Start-Sleep -Seconds 5
    } else {
        Write-Host "⏭️ Skipping $($row.Name) (No valid URL found)" -ForegroundColor DarkGray
    }
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "🎉 WEEK 1 SALES OUTREACH BATCH COMPLETE!" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
