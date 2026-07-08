# Run this script as Administrator
# Sets up everything for cherrypopdevelopment.com to be permanently live

Write-Host "`n=== CherryPOP Permanent Deployment Setup ===" -ForegroundColor Cyan

# ── 1. Register PM2 startup Task Scheduler task ───────────────────────────────
Write-Host "`n[1/3] Registering PM2 startup task..." -ForegroundColor Yellow

$taskName = "CherryPOP-PM2-Startup"
$pm2Cmd   = "C:\Users\miche\AppData\Roaming\npm\pm2.cmd"
$scriptPath = "C:\Users\miche\CherryPOP\start-cherrypop.ps1"

# Remove old task if it exists
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

$action  = New-ScheduledTaskAction -Execute "powershell.exe" `
               -Argument "-NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -AtLogOn -User "miche"
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 0) `
               -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) `
               -StartWhenAvailable $true
$principal = New-ScheduledTaskPrincipal -UserId "miche" -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger `
    -Settings $settings -Principal $principal -Description "Starts CherryPOP Node.js server via PM2 on logon" -Force

Write-Host "  PM2 startup task registered." -ForegroundColor Green

# ── 2. Register XAMPP MySQL as a Windows service ─────────────────────────────
Write-Host "`n[2/3] Registering XAMPP MySQL as Windows service..." -ForegroundColor Yellow

$mysqlBin = "c:\xampp\mysql\bin"
$mysqldPath = "$mysqlBin\mysqld.exe"

if (Test-Path $mysqldPath) {
    $existingService = Get-Service -Name "mysql" -ErrorAction SilentlyContinue
    if (-not $existingService) {
        & "$mysqldPath" --install mysql --defaults-file="c:\xampp\mysql\bin\my.ini" 2>&1
        Write-Host "  MySQL service registered." -ForegroundColor Green
    } else {
        Write-Host "  MySQL service already exists (Status: $($existingService.Status))." -ForegroundColor Green
    }
    Set-Service -Name "mysql" -StartupType Automatic
    if ((Get-Service -Name "mysql").Status -ne "Running") {
        Start-Service -Name "mysql"
    }
    Write-Host "  MySQL set to Automatic startup." -ForegroundColor Green
} else {
    Write-Host "  XAMPP MySQL not found at $mysqldPath - skipping." -ForegroundColor Red
}

# ── 3. Fix Cloudflared tunnel (copy config to LocalSystem profile) ────────────
Write-Host "`n[3/3] Fixing Cloudflared tunnel config for LocalSystem..." -ForegroundColor Yellow

$userConfig   = "C:\Users\miche\.cloudflared"
$systemConfig = "C:\Windows\System32\config\systemprofile\.cloudflared"

New-Item -ItemType Directory -Path $systemConfig -Force | Out-Null
Copy-Item "$userConfig\config.yml"                                  "$systemConfig\config.yml"                                  -Force
Copy-Item "$userConfig\0b8992d2-8cd9-4a17-9bf3-3ab66cd77ded.json" "$systemConfig\0b8992d2-8cd9-4a17-9bf3-3ab66cd77ded.json" -Force
Write-Host "  Config and credentials copied to system profile." -ForegroundColor Green

Write-Host "`n  Restarting Cloudflared service..." -ForegroundColor Yellow
Restart-Service Cloudflared -ErrorAction Stop
Start-Sleep -Seconds 5

$svc = Get-Service Cloudflared
Write-Host "  Cloudflared service status: $($svc.Status)" -ForegroundColor Green

# ── Done ──────────────────────────────────────────────────────────────────────
Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "  * PM2 will resurrect cherrypop on next logon" -ForegroundColor White
Write-Host "  * MySQL (XAMPP) is registered as an Automatic Windows service" -ForegroundColor White
Write-Host "  * Cloudflared tunnel is reconnecting to cherrypopdevelopment.com" -ForegroundColor White
Write-Host "`nWait ~10 seconds then visit https://cherrypopdevelopment.com to verify." -ForegroundColor Green
