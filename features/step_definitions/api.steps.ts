import assert from 'assert';
import { Then, When } from '@cucumber/cucumber';
import { arrayContainsObject, assertJsonContains } from '../support/assertions';
import { parseStructuredDoc } from '../support/parsing';
import { runtimeHarness } from '../support/runtime';
import { E2EWorld } from '../support/world';

When('I send a GET request to the backend path {string}', async function (this: E2EWorld, path: string) {
  this.lastApiResponse = await runtimeHarness.getApiClient().get(path);
});

When('I send a POST request to the backend path {string} with JSON:', async function (this: E2EWorld, path: string, docString: string) {
  const body = parseStructuredDoc(docString);
  this.lastApiResponse = await runtimeHarness.getApiClient().post(path, body);
});

When('the auth user exists in the backend with JSON:', async function (this: E2EWorld, docString: string) {
  const body = parseStructuredDoc(docString);
  const response = await runtimeHarness.getApiClient().post('/auth/register', body);
  const duplicateAccountMessage = response.json && typeof response.json === 'object'
    ? (response.json as Record<string, unknown>).message
    : null;

  const isExpectedDuplicate =
    response.status === 400 && duplicateAccountMessage === 'An account already exists for this email.';

  assert.ok(
    response.status === 200 || isExpectedDuplicate,
    `Expected auth bootstrap to succeed or report duplicate account, got ${response.status}: ${response.text}`
  );
  this.lastApiResponse = response;
});

Then('the API response status should be {int}', function (this: E2EWorld, status: number) {
  assert(this.lastApiResponse, 'No API response captured');
  assert.strictEqual(this.lastApiResponse.status, status, this.lastApiResponse.text);
});

Then('the API response JSON should contain:', function (this: E2EWorld, docString: string) {
  assert(this.lastApiResponse, 'No API response captured');
  assert.notStrictEqual(this.lastApiResponse.json, null, 'Response is not valid JSON');
  const expected = parseStructuredDoc(docString);
  assertJsonContains(this.lastApiResponse.json, expected);
});

Then('the API response JSON array should contain an object with:', function (this: E2EWorld, docString: string) {
  assert(this.lastApiResponse, 'No API response captured');
  const expected = parseStructuredDoc(docString) as Record<string, unknown>;
  arrayContainsObject(this.lastApiResponse.json, expected);
});

Then('I remember the API response JSON field {string} as {string}', function (this: E2EWorld, dottedPath: string, key: string) {
  assert(this.lastApiResponse, 'No API response captured');
  const value = readDottedPath(this.lastApiResponse.json, dottedPath);
  assert.notStrictEqual(value, undefined, `Path not found in API response: ${dottedPath}`);
  this.setMemory(key, value);
});

function readDottedPath(value: unknown, dottedPath: string): unknown {
  if (!dottedPath || dottedPath === '$') return value;
  const path = dottedPath.replace(/^\$\./, '').replace(/^\$/, '');
  const segments = path.split('.').filter(Boolean);
  let current: any = value;
  for (const segment of segments) {
    if (current == null) return undefined;
    if (Array.isArray(current) && /^\d+$/.test(segment)) {
      current = current[Number(segment)];
      continue;
    }
    if (typeof current === 'object') {
      current = current[segment];
      continue;
    }
    return undefined;
  }
  return current;
}
