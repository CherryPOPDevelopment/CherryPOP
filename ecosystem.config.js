const path = require('path');

module.exports = {
  apps: [
    {
      name: 'cherrypop',
      script: 'server.js',
      cwd: path.join(__dirname, 'Backend'),
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      restart_delay: 3000,
      max_restarts: 10
    },
  ]
};
