import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { BrowserContext, Page } from 'playwright';
import { ApiResponseSnapshot } from './api-client';
import { SqlQueryResult } from './db';

export class E2EWorld extends World {
  context: BrowserContext | null = null;
  page: Page | null = null;
  lastApiResponse: ApiResponseSnapshot | null = null;
  lastSqlResult: SqlQueryResult | null = null;
  memory = new Map<string, unknown>();

  constructor(options: IWorldOptions) {
    super(options);
  }

  setMemory(key: string, value: unknown): void {
    this.memory.set(key, value);
  }

  getMemory<T>(key: string): T | undefined {
    return this.memory.get(key) as T | undefined;
  }
}

setWorldConstructor(E2EWorld);
