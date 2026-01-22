import { Injectable, BadGatewayException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private http: HttpService) {}

  async forward(options: {
    baseUrl: string;
    method: string;
    path: string;
    headers: Record<string, any>;
    query: any;
    body: any;
    timeoutMs?: number;
    retries?: number;
    retryDelayMs?: number;
  }): Promise<{ status: number; data: any; headers: Record<string, any> }> {
    const url = `${options.baseUrl}${options.path}`;

    const headers = { ...options.headers };
    delete headers['host'];
    delete headers['content-length'];

    const timeoutMs = options.timeoutMs ?? 8000;
    const retries = Math.max(0, (options.retries ?? 1));
    const retryDelayMs = options.retryDelayMs ?? 200;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await firstValueFrom(
          this.http.request({
            url,
            method: options.method as any,
            params: options.query,
            data: options.body,
            headers,
            timeout: timeoutMs,
            validateStatus: () => true, // forward status codes instead of throwing
          }),
        );

        // retry on 5xx (transient) responses
        if (res.status >= 500 && attempt < retries) {
          this.logger.warn(`Upstream ${url} returned ${res.status}, retry ${attempt + 1}/${retries}`);
          await this.sleep(retryDelayMs);
          continue;
        }

        return {
          status: res.status,
          data: res.data,
          headers: res.headers as Record<string, any>,
        };
      } catch (err) {
        if (attempt < retries) {
          this.logger.warn(`Request to ${url} failed (attempt ${attempt + 1}), retrying...`);
          await this.sleep(retryDelayMs);
          continue;
        }
        this.logger.error(`Request to ${url} failed after ${attempt + 1} attempts`);
        throw new BadGatewayException('Upstream service is unavailable');
      }
    }

    throw new BadGatewayException('Upstream service is unavailable');
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}