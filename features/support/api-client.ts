export interface ApiResponseSnapshot {
  status: number;
  headers: Record<string, string>;
  text: string;
  json: unknown | null;
}

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  async get(pathOrUrl: string): Promise<ApiResponseSnapshot> {
    return this.request('GET', pathOrUrl);
  }

  async post(pathOrUrl: string, body?: unknown): Promise<ApiResponseSnapshot> {
    return this.request('POST', pathOrUrl, body);
  }

  async request(method: string, pathOrUrl: string, body?: unknown): Promise<ApiResponseSnapshot> {
    const url = this.toAbsoluteUrl(pathOrUrl);
    const headers: Record<string, string> = {};
    let payload: string | undefined;

    if (body !== undefined) {
      headers['content-type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    const response = await fetch(url, { method, headers, body: payload });
    const text = await response.text();
    let json: unknown | null = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }

    const outHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      outHeaders[key] = value;
    });

    return { status: response.status, headers: outHeaders, text, json };
  }

  private toAbsoluteUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${this.baseUrl}${path}`;
  }
}
