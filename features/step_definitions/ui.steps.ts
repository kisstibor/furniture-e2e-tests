import assert from 'assert';
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
