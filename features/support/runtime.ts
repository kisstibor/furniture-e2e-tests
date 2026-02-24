import fs from 'fs';
import { spawn, ChildProcess } from 'child_process';
import waitOn from 'wait-on';
import treeKill from 'tree-kill';
import { Browser, BrowserContext, chromium } from 'playwright';
import { ApiClient } from './api-client';
import { E2EConfig, resolveConfig } from './config';

type ManagedName = 'frontend' | 'backend';

interface ManagedHandle {
  name: ManagedName;
  proc: ChildProcess;
}

export class RuntimeHarness {
  private readonly config: E2EConfig;
  private browser: Browser | null = null;
  private readonly processes = new Map<ManagedName, ManagedHandle>();
  private started = false;

  constructor() {
    this.config = resolveConfig();
  }

  getConfig(): E2EConfig {
    return this.config;
  }

  getApiClient(): ApiClient {
    return new ApiClient(this.config.backendApiBaseUrl);
  }

  async startSharedRuntime(): Promise<void> {
    if (this.started) return;
    this.started = true;
    fs.mkdirSync(this.config.artifactsDir, { recursive: true });
    await this.startManagedServices();
    this.browser = await chromium.launch({ headless: this.config.headless });
  }

  async newBrowserContext(): Promise<BrowserContext> {
    if (!this.browser) throw new Error('Browser is not initialized. Runtime not started.');
    return this.browser.newContext({
      baseURL: this.config.baseUrl,
      viewport: { width: 1440, height: 900 },
    });
  }

  async ensureFrontendAvailable(): Promise<void> {
    await waitOn({
      resources: [this.config.frontend.waitOnUrl],
      timeout: Math.max(5000, this.config.timeoutMs),
      validateStatus: (status: number) => status >= 200 && status < 500,
    });
  }

  async ensureBackendAvailable(): Promise<void> {
    await waitOn({
      resources: [this.config.backend.waitOnUrl],
      timeout: Math.max(5000, this.config.timeoutMs),
      validateStatus: (status: number) => status >= 200 && status < 500,
    });
  }

  async stopSharedRuntime(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    for (const handle of Array.from(this.processes.values())) {
      await this.stopProcess(handle);
    }
    this.processes.clear();
    this.started = false;
  }

  private async startManagedServices(): Promise<void> {
    if (this.config.frontend.enabled) {
      await this.startProcess('frontend', this.config.frontend.cmd, this.config.frontend.cwd, this.config.frontend.waitOnUrl);
    }
    if (this.config.backend.enabled) {
      await this.startProcess('backend', this.config.backend.cmd, this.config.backend.cwd, this.config.backend.waitOnUrl);
    }
  }

  private async startProcess(name: ManagedName, cmd: string, cwd: string, waitOnUrl: string): Promise<void> {
    if (this.processes.has(name)) return;

    try {
      await waitOn({
        resources: [waitOnUrl],
        timeout: 2000,
        validateStatus: (status: number) => status >= 200 && status < 500,
      });
      return;
    } catch {
      // not running
    }

    const proc = spawn(cmd, {
      cwd,
      shell: true,
      stdio: 'inherit',
      env: process.env,
    });
    this.processes.set(name, { name, proc });

    await waitOn({
      resources: [waitOnUrl],
      timeout: 180000,
      validateStatus: (status: number) => status >= 200 && status < 500,
    });
  }

  private async stopProcess(handle: ManagedHandle): Promise<void> {
    const pid = handle.proc.pid;
    if (!pid) return;
    await new Promise<void>((resolve) => {
      try {
        treeKill(pid, 'SIGTERM', () => resolve());
      } catch {
        resolve();
      }
    });
  }
}

export const runtimeHarness = new RuntimeHarness();
