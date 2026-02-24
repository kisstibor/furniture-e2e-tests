import assert from 'assert';

export function assertJsonContains(actual: unknown, expectedSubset: unknown, path = '$'): void {
  if (expectedSubset === null || typeof expectedSubset !== 'object') {
    assert.deepStrictEqual(actual, expectedSubset, `Mismatch at ${path}`);
    return;
  }

  if (Array.isArray(expectedSubset)) {
    assert.ok(Array.isArray(actual), `Expected array at ${path}`);
    for (let i = 0; i < expectedSubset.length; i++) {
      assertJsonContains((actual as unknown[])[i], expectedSubset[i], `${path}[${i}]`);
    }
    return;
  }

  assert.ok(actual && typeof actual === 'object', `Expected object at ${path}`);
  const actualObj = actual as Record<string, unknown>;
  for (const [key, expectedValue] of Object.entries(expectedSubset as Record<string, unknown>)) {
    assert.ok(Object.prototype.hasOwnProperty.call(actualObj, key), `Missing key ${path}.${key}`);
    assertJsonContains(actualObj[key], expectedValue, `${path}.${key}`);
  }
}

export function arrayContainsObject(actual: unknown, expectedSubset: Record<string, unknown>): void {
  assert.ok(Array.isArray(actual), 'Expected an array response');
  const list = actual as unknown[];
  const found = list.some((item) => {
    try {
      assertJsonContains(item, expectedSubset);
      return true;
    } catch {
      return false;
    }
  });
  assert.ok(found, `Expected array to contain object subset ${JSON.stringify(expectedSubset)}`);
}
