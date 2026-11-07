@echo off
title ADAPTIFY AI - Push to GitHub
color 0B
echo ==========================================================
echo   ADAPTIFY AI - Push to GitHub Repository
echo   Target: https://github.com/Mrittikasenthil/adaptify-ai.git
echo ==========================================================
echo.
cd /d "%~dp0"
echo [1/2] Checking repository status...
git status
echo.
echo [2/2] Pushing branch main to origin...
echo (A browser window may open asking you to Sign In to GitHub)
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ==========================================================
    echo SUCCESS: Project pushed to GitHub successfully!
    echo Visit: https://github.com/Mrittikasenthil/adaptify-ai
    echo ==========================================================
) else (
    echo ==========================================================
    echo Push encountered an error. Please verify your GitHub login.
    echo ==========================================================
)
echo.
pause
