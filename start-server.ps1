#!/usr/bin/env pwsh

Write-Host "🚀 Starting EasyMedPro Development Server..." -ForegroundColor Green
Write-Host "📁 Working Directory: $(Get-Location)" -ForegroundColor Cyan

# Ensure we're in the right directory
Set-Location "C:\EasyMed-TeleHealth"

# Check if Node.js is available
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is available
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

# Kill any existing processes on port 3000
Write-Host "🔍 Checking for existing processes on port 3000..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($processes) {
    Write-Host "🚫 Found existing process on port 3000. Stopping it..." -ForegroundColor Yellow
    foreach ($process in $processes) {
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

Write-Host "🌐 Starting Vite development server..." -ForegroundColor Green
Write-Host "📱 The server will be accessible on your network for iPad/mobile testing" -ForegroundColor Cyan

# Start the development server
try {
    & npm run dev
}
catch {
    Write-Host "❌ Failed to start development server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🛑 Development server stopped." -ForegroundColor Yellow
