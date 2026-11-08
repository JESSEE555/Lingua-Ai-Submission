#!/bin/bash
cd "$(dirname "$0")"
echo "Starting Lingua AI at http://localhost:8000/index.html  (press Ctrl+C to stop)"
( sleep 1; open http://localhost:8000/index.html 2>/dev/null || xdg-open http://localhost:8000/index.html 2>/dev/null ) &
python3 -m http.server 8000
