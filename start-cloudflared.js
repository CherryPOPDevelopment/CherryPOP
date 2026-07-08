const { spawn } = require('child_process');

const cloudflaredPath = 'C:\\Program Files (x86)\\cloudflared\\cloudflared.exe';
const cloudflaredArgs = ['tunnel', '--config', 'C:\\Users\\miche\\.cloudflared\\config.yml', 'run'];

const child = spawn(cloudflaredPath, cloudflaredArgs, {
  stdio: 'inherit',
  windowsHide: true,
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));