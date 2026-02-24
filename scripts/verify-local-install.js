'use strict';

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const required = [
  path.join(projectRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'cucumber-js.cmd' : 'cucumber-js'),
  path.join(projectRoot, 'node_modules', 'ts-node'),
  path.join(projectRoot, 'node_modules', 'playwright'),
];

const missing = required.filter((p) => !fs.existsSync(p));

if (missing.length > 0) {
  console.error('Local test dependencies are missing in furniture-e2e-tests.');
  console.error('Run these commands in this directory:');
  console.error('  npm install');
  console.error('  npm run install:browsers');
  console.error('');
  console.error('This avoids accidentally using parent repo tools (which can cause ts-node/Cucumber crashes).');
  process.exit(1);
}
