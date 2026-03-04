const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const logPath = path.resolve(__dirname, '..', 'artifacts', 'design-audit', 'open_furniture_keep_open.log');
fs.mkdirSync(path.dirname(logPath), { recursive: true });

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(logPath, msg, 'utf8');
}

(async () => {
  log('Starting headed browser...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const response = await page.goto('http://localhost:8088/furniture', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  log(`Opened URL=${page.url()} status=${response ? response.status() : 'no-response'}`);
  await new Promise(() => {});
})().catch((err) => {
  log(`ERROR: ${err && err.stack ? err.stack : String(err)}`);
  process.exit(1);
});
