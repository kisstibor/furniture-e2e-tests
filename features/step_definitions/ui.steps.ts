import assert from 'assert';
import { Given, Then, When } from '@cucumber/cucumber';
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

Then('the frontend URL should contain {string}', async function (this: E2EWorld, fragment: string) {
  assert(this.page, 'Playwright page is not initialized');
  await this.page.waitForURL((url) => url.toString().includes(fragment));
  assert.ok(this.page.url().includes(fragment), `Expected URL to contain "${fragment}", got ${this.page.url()}`);
});
