# ADAPTIFY AI Launcher Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  ADAPTIFY AI - Adaptive Exam-Prep Tutor & Learning Studio" -ForegroundColor Magenta
Write-Host "  Learn Faster. Understand Better. Achieve More." -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$workspace = $PSScriptRoot
$env:PATH = "$workspace\tools\node-v20.18.0-win-x64;$env:PATH"
Set-Location "$workspace\backend"

Write-Host "[1/2] Database initialized with study materials and adaptive learner profiles." -ForegroundColor Green
Write-Host "[2/2] Launching ADAPTIFY AI on http://localhost:8000 ..." -ForegroundColor Green
Write-Host "Open http://localhost:8000 in your browser to start!" -ForegroundColor Yellow
Write-Host ""

& "C:\Users\User\AppData\Local\Programs\Python\Python311\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000
