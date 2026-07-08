# CherryPOP Startup Script
# Starts MySQL (XAMPP) and resurrects PM2 processes

# Give system services a moment to fully start
Start-Sleep -Seconds 5

# Start XAMPP MySQL if not running
$mysqlService = Get-Service -Name "mysql" -ErrorAction SilentlyContinue
if ($mysqlService -and $mysqlService.Status -ne "Running") {
    Start-Service -Name "mysql"
}

# Resurrect PM2 saved processes (cherrypop server)
$pm2 = "C:\Users\miche\AppData\Roaming\npm\pm2.cmd"
& cmd /c "`"$pm2`" resurrect"
