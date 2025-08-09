const { spawn } = require('child_process');

console.log('Starting EasyMedPro development server...');

const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

// Keep process alive
process.on('SIGINT', () => {
  console.log('Stopping server...');
  server.kill();
  process.exit();
});
