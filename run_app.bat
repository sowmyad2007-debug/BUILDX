@echo off
echo Starting AI Campus Event Planning & Coordination Platform...
cd /d "%~dp0"
"%LOCALAPPDATA%\Programs\Python\Python312\python.exe" app.py
if %ERRORLEVEL% NEQ 0 (
    python app.py
)
pause
