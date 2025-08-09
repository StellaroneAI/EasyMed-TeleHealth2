#!/usr/bin/env pwsh

Write-Host "🚀 EasyMedPro - Starting Development Server" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Kill any existing Node processes
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Kill processes on common ports
$ports = @(3000, 3001, 4173)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        Write-Host "🚫 Stopping processes on port $port..." -ForegroundColor Yellow
        foreach ($conn in $connections) {
            if ($conn.OwningProcess -gt 0) {
                Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Start-Sleep -Seconds 2

# Check Node.js and npm
Write-Host "🔍 Checking dependencies..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js or npm not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Clear npm cache just in case
Write-Host "🧹 Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>$null

Write-Host ""
Write-Host "🌐 Starting Vite Development Server..." -ForegroundColor Green
Write-Host "📱 Server will be accessible on:" -ForegroundColor Cyan
Write-Host "   - Local: http://localhost:3000/" -ForegroundColor White
Write-Host "   - Network: http://$($(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*"} | Select-Object -First 1).IPAddress):3000/" -ForegroundColor White
Write-Host ""
Write-Host "🔥 For iPad/mobile testing, use the Network URL above" -ForegroundColor Yellow
Write-Host "⚡ Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the development server
try {
    npm run dev
} catch {
    Write-Host "❌ Failed to start development server" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    Write-Host ""
    Write-Host "🔧 Troubleshooting suggestions:" -ForegroundColor Yellow
    Write-Host "1. Try running: npm install" -ForegroundColor White
    Write-Host "2. Check if port 3000 is available" -ForegroundColor White
    Write-Host "3. Try deleting node_modules and running npm install again" -ForegroundColor White
    
    exit 1
}

Write-Host "🛑 Development server stopped." -ForegroundColor Yellow
