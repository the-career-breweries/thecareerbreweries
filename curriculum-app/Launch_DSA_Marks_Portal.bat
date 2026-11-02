@echo off
title AUERP DSA Marks Entry Portal
cd /d "%~dp0"

echo =======================================================================
echo          Alliance University - Aviation Department
echo             AUERP DSA Marks Entry Portal (Local)
echo =======================================================================
echo.
echo Starting server at http://localhost:8500 ...
echo Opening browser...
echo.

set VENV_PY="G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\.venv\Scripts\python.exe"

start "" http://localhost:8500
%VENV_PY% scratch\dsa_portal_server.py

pause
