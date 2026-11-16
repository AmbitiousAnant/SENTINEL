# SENTINEL - Physical Android Device ADB Port Reverse Setup
# Build for Bharat 2026

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "  SENTINEL: Physical Android Device ADB Port Reverse Setup" -ForegroundColor Cyan
Write-Host "  PS 1: GovTech UX & PS 3: AI for Citizen Impact (Build for Bharat 2026)" -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Checking connected Android devices over USB..." -ForegroundColor Yellow
$devices = adb devices
$devices
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] ADB command failed. Ensure Android platform-tools are installed and on your PATH." -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/3] Establishing reverse TCP socket tunnels..." -ForegroundColor Yellow
Write-Host "  - FastAPI Backend: 8000 (device localhost:8000 -> PC localhost:8000)"
Write-Host "  - Next.js Web/PWA: 3000 (device localhost:3000 -> PC localhost:3000)"
adb reverse tcp:8000 tcp:8000
adb reverse tcp:3000 tcp:3000

Write-Host "`n[3/3] Verifying active reverse socket rules..." -ForegroundColor Yellow
adb reverse --list

Write-Host "`n==============================================================================" -ForegroundColor Green
Write-Host "  SUCCESS! Zero-Egress USB Tunnel Active." -ForegroundColor Green
Write-Host "  Your physical Android device can now communicate directly with:" -ForegroundColor Green
Write-Host "    - http://localhost:8000 (FastAPI backend)" -ForegroundColor White
Write-Host "    - http://localhost:3000 (Next.js app / Capacitor runtime)" -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor Green
