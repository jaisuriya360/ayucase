@echo off
title AyuCase Localhost Launcher
cd /d "%~dp0"
echo ========================================================
echo        A Y U C A S E   P L A T F O R M
echo ========================================================
echo Starting local web server...
echo The website will automatically open in your default browser.
echo Keep this window open while using the website.
echo Minimize this window if you want it out of the way.
echo.
timeout /t 2 /nobreak >nul
start "" http://localhost:5173/
call npm.cmd run dev
pause
