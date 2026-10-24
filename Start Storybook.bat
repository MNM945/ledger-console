@echo off
cd /d "%~dp0"
if not exist "node_modules\storybook\package.json" (
  echo Local dependencies are missing. Read README.md before installing anything.
  pause
  exit /b 1
)
echo Close this window or press Ctrl+C to stop Storybook.
call npm run storybook
