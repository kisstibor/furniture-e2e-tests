import assert from 'assert';
import fs from 'fs';
import { Given, Then, When } from '@cucumber/cucumber';
import { resolveFixturePath } from '../support/fixtures';
import { runtimeHarness } from '../support/runtime';
import { E2EWorld } from '../support/world';

Given('the frontend is available', async function () {
  await runtimeHarness.ensureFrontendAvailable();
});

Given('the backend API is available', async function () {
  await runtimeHarness.ensureBackendAvailable();
});

When('I open the frontend path {string}', async function (this: E2EWorld, frontendPath: string) {
  assert(this.page, 'Playwright page is not initialized');
  await this.page.goto(frontendPath, { waitUntil: 'domcontentloaded' });
});

Then('I should see the selector {string}', async function (this: E2EWorld, selector: string) {
  assert(this.page, 'Playwright page is not initialized');
  const locator = this.page.locator(selector).first();
  await locator.waitFor({ state: 'visible' });
  assert.strictEqual(await locator.isVisible(), true, `Expected selector to be visible: ${selector}`);
});

Then('I should see text {string}', async function (this: E2EWorld, text: string) {
  assert(this.page, 'Playwright page is not initialized');
  await this.page.getByText(text, { exact: false }).first().waitFor({ state: 'visible' });
});

When('I click the selector {string}', async function (this: E2EWorld, selector: string) {
  assert(this.page, 'Playwright page is not initialized');
  await this.page.locator(selector).first().click();
});

When('I click text {string}', async function (this: E2EWorld, text: string) {
  assert(this.page, 'Playwright page is not initialized');
  await this.page.getByText(text, { exact: false }).first().click();
});

When('I fill the selector {string} with {string}', async function (this: E2EWorld, selector: string, value: string) {
  assert(this.page, 'Playwright page is not initialized');
  await this.page.locator(selector).first().fill(value);
});

When(
  'I log in through the UI with email {string} and password {string}',
  async function (this: E2EWorld, email: string, password: string) {
    assert(this.page, 'Playwright page is not initialized');
    await this.page.locator('input[name="email"]').first().fill(email);
    await this.page.locator('input[name="password"]').first().fill(password);
    await this.page.locator('button[type="submit"]').first().click();
  }
);

When('I upload the fixture file {string} into the selector {string}', async function (this: E2EWorld, fixturePath: string, selector: string) {
  assert(this.page, 'Playwright page is not initialized');
  const absoluteFixturePath = resolveFixturePath(fixturePath);
  await this.page.locator(selector).first().setInputFiles(absoluteFixturePath);
});

When('I import the furniture design YAML fixture {string}', async function (this: E2EWorld, fixturePath: string) {
  assert(this.page, 'Playwright page is not initialized');
  const absoluteFixturePath = resolveFixturePath(fixturePath);
  const yamlInput = this.page.locator('input[type="file"][accept*=".yaml"]').first();
  await yamlInput.setInputFiles(absoluteFixturePath);
});

When(
  'I import the furniture design YAML template {string} replacing token {string} with remembered value {string}',
  async function (this: E2EWorld, fixturePath: string, token: string, memoryKey: string) {
    assert(this.page, 'Playwright page is not initialized');
    const absoluteFixturePath = resolveFixturePath(fixturePath);
    const remembered = this.getMemory<string>(memoryKey);
    assert(remembered, `No remembered value found for key "${memoryKey}"`);

    const template = fs.readFileSync(absoluteFixturePath, 'utf8');
    const patched = template.split(token).join(String(remembered));
    assert.notStrictEqual(
      patched,
      template,
      `Token "${token}" was not found in fixture template "${fixturePath}"`
    );

    const yamlInput = this.page.locator('input[type="file"][accept*=".yaml"]').first();
    await yamlInput.setInputFiles({
      name: `generated-${Date.now()}.design.yaml`,
      mimeType: 'application/x-yaml',
      buffer: Buffer.from(patched, 'utf8'),
    });
  }
);

Then('I should see a project item named {string}', async function (this: E2EWorld, name: string) {
  assert(this.page, 'Playwright page is not initialized');
  const item = this.page.locator('.composer-panel .panel-section').nth(0).locator('.project-list .project-item', { hasText: name }).first();
  await item.waitFor({ state: 'visible' });
  assert.strictEqual(await item.isVisible(), true, `Expected project item to be visible: ${name}`);
});

Then('I should see a module item named {string}', async function (this: E2EWorld, name: string) {
  assert(this.page, 'Playwright page is not initialized');
  const item = this.page.locator('.composer-panel .panel-section').nth(1).locator('.project-list .project-item', { hasText: name }).first();
  await item.waitFor({ state: 'visible' });
  assert.strictEqual(await item.isVisible(), true, `Expected module item to be visible: ${name}`);
});

Then('the frontend URL should contain {string}', async function (this: E2EWorld, fragment: string) {
  assert(this.page, 'Playwright page is not initialized');
  await this.page.waitForURL((url) => url.toString().includes(fragment));
  assert.ok(this.page.url().includes(fragment), `Expected URL to contain "${fragment}", got ${this.page.url()}`);
});

When('I reload the current page', async function (this: E2EWorld) {
  assert(this.page, 'Playwright page is not initialized');
  await this.page.reload({ waitUntil: 'domcontentloaded' });
});

Then('I should see at least {int} module items', async function (this: E2EWorld, expected: number) {
  assert(this.page, 'Playwright page is not initialized');
  const list = this.page.locator('.composer-panel .panel-section').nth(1).locator('.project-list .project-item');
  await list.first().waitFor({ state: 'visible' });
  const count = await list.count();
  assert.ok(count >= expected, `Expected at least ${expected} module items, found ${count}`);
});

Then(
  'I should see a BOM row for material {string} with pricing mode {string}',
  async function (this: E2EWorld, material: string, mode: string) {
    assert(this.page, 'Playwright page is not initialized');
    const modeText =
      mode === 'm2'
        ? 'from m2'
        : mode === 'sheet'
          ? 'from sheet'
          : mode === 'fallback'
            ? 'fallback'
            : mode;
    const row = this.page.locator('table.bom-table tr.mat-mdc-row', { hasText: material }).first();
    await row.waitFor({ state: 'visible' });
    await row.getByText(modeText, { exact: false }).first().waitFor({ state: 'visible' });
  }
);

When(
  'I select mat option {string} for mat-select named {string}',
  async function (this: E2EWorld, optionText: string, selectName: string) {
    assert(this.page, 'Playwright page is not initialized');
    const select = this.page.locator(`mat-select[name="${selectName}"]`).first();
    await select.waitFor({ state: 'visible' });
    await select.click();
    const option = this.page.locator('mat-option').filter({ hasText: optionText }).first();
    await option.waitFor({ state: 'visible' });
    await option.click();
  }
);

Then('I remember the computed drawer box as {string}', async function (this: E2EWorld, key: string) {
  assert(this.page, 'Playwright page is not initialized');
  const boxLine = this.page.getByText(/^Computed box:\s*\d+\s*x\s*\d+\s*x\s*\d+\s*mm$/).first();
  await boxLine.waitFor({ state: 'visible' });
  const text = (await boxLine.textContent())?.trim() ?? '';
  assert.ok(text.length > 0, 'Computed drawer box text is empty');
  this.setMemory(key, text);
});

Then(
  'remembered value {string} should differ from remembered value {string}',
  function (this: E2EWorld, leftKey: string, rightKey: string) {
    const left = this.getMemory<string>(leftKey);
    const right = this.getMemory<string>(rightKey);
    assert.notStrictEqual(left, undefined, `No remembered value for key "${leftKey}"`);
    assert.notStrictEqual(right, undefined, `No remembered value for key "${rightKey}"`);
    assert.notStrictEqual(left, right, `Expected remembered values to differ (${leftKey} vs ${rightKey})`);
  }
);
