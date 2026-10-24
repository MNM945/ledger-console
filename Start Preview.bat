@echo off
cd /d "%~dp0"
if not exist "node_modules\vite\bin\vite.js" (
  echo Local dependencies are missing. Read README.md before installing anything.
  pause
  exit /b 1
)
echo Close this window or press Ctrl+C to stop the local preview.
call npm run preview -- --host 127.0.0.1 --open
