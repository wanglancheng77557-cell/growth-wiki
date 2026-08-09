@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动本地预览... 浏览器会自动打开，关掉这个窗口即可停止。
start "" "http://127.0.0.1:8788/"
python -m http.server 8788 --bind 127.0.0.1