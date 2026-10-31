@echo off
title ADAPTIFY AI - Adaptive Exam-Prep Tutor
color 0D
echo ==========================================================
echo   ADAPTIFY AI - Adaptive Exam-Prep Tutor & Learning Studio
echo   Learn Faster. Understand Better. Achieve More.
echo ==========================================================
echo.
set "PATH=%~dp0tools\node-v20.18.0-win-x64;%PATH%"
cd /d "%~dp0backend"
echo [ADAPTIFY AI] Launching server on http://localhost:8000 ...
echo Open your browser to http://localhost:8000
echo.
"C:\Users\User\AppData\Local\Programs\Python\Python311\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000
pause
