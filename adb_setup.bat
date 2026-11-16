@echo off
title SENTINEL - Physical Android Device ADB Port Reverse Setup
color 0A
echo ==============================================================================
echo   SENTINEL: Physical Android Device ADB Port Reverse Setup
echo   PS 1: GovTech UX ^& PS 3: AI for Citizen Impact (Build for Bharat 2026)
echo ==============================================================================
echo.
echo [1/3] Checking connected Android devices over USB...
adb devices
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] ADB is not recognized or Android SDK platform-tools not in PATH.
    echo Please install Android platform-tools or run through Android Studio terminal.
    pause
    exit /b 1
)

echo.
echo [2/3] Establishing reverse TCP socket tunnels...
echo Reverse port forwarding:
echo   - FastAPI Backend: 8000 (device localhost:8000 -^> PC localhost:8000)
echo   - Next.js Web/PWA: 3000 (device localhost:3000 -^> PC localhost:3000)
adb reverse tcp:8000 tcp:8000
adb reverse tcp:3000 tcp:3000

echo.
echo [3/3] Verifying active reverse socket rules...
adb reverse --list

echo.
echo ==============================================================================
echo   SUCCESS! Zero-Egress USB Tunnel Active.
echo   Your physical Android device can now seamlessly communicate with:
echo     - http://localhost:8000 (FastAPI zero-egress backend)
echo     - http://localhost:3000 (Next.js app / Capacitor runtime)
echo   Even if venue Wi-Fi is severed or blocked by firewall!
echo ==============================================================================
echo.
pause
