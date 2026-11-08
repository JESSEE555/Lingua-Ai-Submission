@echo off
cd /d "%~dp0"
echo Starting Lingua AI at http://localhost:8000/index.html  (close this window to stop)
start "" http://localhost:8000/index.html
python -m http.server 8000 || py -m http.server 8000
pause
