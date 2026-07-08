# Run this script as Administrator
# It copies the cloudflared config and credentials to the LocalSystem profile
# so the cloudflared Windows service can find them.

$userConfig = "$env:USERPROFILE\.cloudflared"
$systemConfig = "C:\Windows\System32\config\systemprofile\.cloudflared"

Write-Host "Creating system profile cloudflared directory..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $systemConfig -Force | Out-Null

Write-Host "Copying config.yml..." -ForegroundColor Cyan
Copy-Item "$userConfig\config.yml" "$systemConfig\config.yml" -Force

Write-Host "Copying tunnel credentials..." -ForegroundColor Cyan
Copy-Item "$userConfig\0b8992d2-8cd9-4a17-9bf3-3ab66cd77ded.json" "$systemConfig\0b8992d2-8cd9-4a17-9bf3-3ab66cd77ded.json" -Force

Write-Host "Restarting Cloudflared service..." -ForegroundColor Cyan
Restart-Service Cloudflared
Start-Sleep -Seconds 3

$status = Get-Service Cloudflared | Select-Object -ExpandProperty Status
Write-Host "Cloudflared service status: $status" -ForegroundColor Green
Write-Host "Done! The tunnel should now be active." -ForegroundColor Green
