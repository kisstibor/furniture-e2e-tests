import assert from 'assert';
import { Given, Then, When } from '@cucumber/cucumber';
import { arrayContainsObject, assertJsonContains } from '../support/assertions';
import { getSqlDbClient } from '../support/db';
import { parseStructuredDoc } from '../support/parsing';
import { runtimeHarness } from '../support/runtime';
import { E2EWorld } from '../support/world';

Given('the SQL database connection is configured', function () {
  const dialect = runtimeHarness.getConfig().db.dialect;
  assert.notStrictEqual(dialect, 'none', 'Set E2E_DB_DIALECT and SQL connection env vars to enable DB assertions.');
});

When('I run SQL query:', async function (this: E2EWorld, sql: string) {
  const db = await getSqlDbClient();
  this.lastSqlResult = await db.query(interpolateMemory(sql, this));
});

Then('the SQL result should return {int} rows', function (this: E2EWorld, count: number) {
  assert(this.lastSqlResult, 'No SQL result captured');
  assert.strictEqual(this.lastSqlResult.rowCount, count);
});

Then('the SQL first row should contain JSON:', function (this: E2EWorld, docString: string) {
  assert(this.lastSqlResult, 'No SQL result captured');
  assert.ok(this.lastSqlResult.rows.length > 0, 'SQL result has no rows');
  const expected = parseStructuredDoc(docString);
  assertJsonContains(this.lastSqlResult.rows[0], expected);
});

Then('the SQL result rows should contain an object with JSON:', function (this: E2EWorld, docString: string) {
  assert(this.lastSqlResult, 'No SQL result captured');
  const expected = parseStructuredDoc(docString) as Record<string, unknown>;
  arrayContainsObject(this.lastSqlResult.rows, expected);
});

function interpolateMemory(sql: string, world: E2EWorld): string {
  return sql.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_match, key) => {
    const value = world.getMemory<unknown>(key);
    if (value == null) {
      throw new Error(`No stored value found for template key "${key}"`);
    }
    return `${value}`;
  });
}
