import fs from 'fs';
import path from 'path';
import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  ITestCaseHookParameter,
  Status,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { disposeSqlDbClient } from './db';
import { runtimeHarness } from './runtime';
import { E2EWorld } from './world';

const cfg = runtimeHarness.getConfig();
setDefaultTimeout(Math.max(30_000, cfg.timeoutMs * 2));

BeforeAll(async () => {
  await runtimeHarness.startSharedRuntime();
});

Before(async function (this: E2EWorld) {
  this.context = await runtimeHarness.newBrowserContext();
  this.page = await this.context.newPage();
  this.lastApiResponse = null;
  this.lastSqlResult = null;
  this.memory.clear();
});

After(async function (this: E2EWorld, scenario: ITestCaseHookParameter) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const fileName = safeScenarioFileName(scenario.pickle.name);
    const filePath = path.join(cfg.artifactsDir, `${Date.now()}-${fileName}.png`);
    fs.mkdirSync(cfg.artifactsDir, { recursive: true });
    await this.page.screenshot({ path: filePath, fullPage: true });
    const image = fs.readFileSync(filePath);
    await this.attach(image, 'image/png');
  }
  if (this.context) {
    await this.context.close();
    this.context = null;
    this.page = null;
  }
});

AfterAll(async () => {
  await disposeSqlDbClient();
  await runtimeHarness.stopSharedRuntime();
});

function safeScenarioFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 80);
}
