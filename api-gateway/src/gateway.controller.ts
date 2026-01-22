import {
  All,
  Controller,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import express from 'express';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy.service';
import { AuthIntrospectionService } from './auth-introspection.service';
import { randomUUID } from 'crypto';

// --- Route Map Configuration ---
interface RouteConfig {
  envVar: string;
  protected: boolean;
  timeout?: number; // ms, default 8000
  retries?: number; // default 2
  rateLimit?: { points: number; windowMs: number };
}

const ROUTE_MAP: Record<string, RouteConfig> = {
  auth: {
    envVar: 'AUTH_SERVICE_URL',
    protected: false,
    timeout: 5000,
    retries: 1,
    rateLimit: { points: 30, windowMs: 60_000 },
  },
  orders: {
    envVar: 'ORDER_SERVICE_URL',
    protected: true,
    timeout: 10000,
    retries: 2,
    rateLimit: { points: 60, windowMs: 60_000 },
  },
  products: {
    envVar: 'ORDER_SERVICE_URL',
    protected: true,
    rateLimit: { points: 60, windowMs: 60_000 },
  },
  categories: {
    envVar: 'ORDER_SERVICE_URL',
    protected: true,
    rateLimit: { points: 60, windowMs: 60_000 },
  },
};

const DEFAULT_TIMEOUT = 8000;
const DEFAULT_RETRIES = 2;

// Simple in-memory token-bucket rate limiter (per-IP + per-service)
class TokenBucket {
  tokens: number;
  last: number;
  constructor(public capacity: number, public refillRatePerMs: number) {
    this.tokens = capacity;
    this.last = Date.now();
  }

  consume(amount = 1): boolean {
    const now = Date.now();
    const elapsed = now - this.last;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRatePerMs);
    this.last = now;
    if (this.tokens >= amount) {
      this.tokens -= amount;
      return true;
    }
    return false;
  }
}

class RateLimiter {
  private buckets = new Map<string, TokenBucket>();

  consume(key: string, points: number, windowMs: number): boolean {
    const capacity = points;
    const refillRatePerMs = points / windowMs;
    let bucket = this.buckets.get(key);
    if (!bucket) {
      bucket = new TokenBucket(capacity, refillRatePerMs);
      this.buckets.set(key, bucket);
    }
    return bucket.consume(1);
  }
}

const rateLimiter = new RateLimiter();

@Controller('api')
export class GatewayController {
  constructor(
    private config: ConfigService,
    private proxy: ProxyService,
    private auth: AuthIntrospectionService,
  ) {}

  @All('*path')
  async routeAll(@Req() req: express.Request, @Res() res: express.Response) {
    // --- Gateway Feature 0: Request ID propagation ---
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();
    res.setHeader('x-request-id', requestId);

    // Example paths:
    // /api/auth/login
    // /api/orders
    // /api/orders/123

    const pathOnly = req.path; // without query
    const afterApi = pathOnly.replace(/^\/api\//, ''); // e.g. "orders/123"

    const [serviceKey, ...rest] = afterApi.split('/');
    const forwardPath = '/' + [serviceKey, ...rest].filter(Boolean).join('/'); // e.g. "/auth/login" or "/orders"
    const routeConfig = ROUTE_MAP[serviceKey];
    if (!routeConfig) {
      console.warn(`[Gateway] Unknown route requested: ${serviceKey} requestId=${requestId}`);
      return res.status(404).json({
        message: `Unknown route: ${serviceKey}`,
        requestId,
      });
    }

    const baseUrl = this.config.get<string>(routeConfig.envVar)!;


    // --- Rate limiting (per-IP per-service)
    if (routeConfig.rateLimit) {
      const ip =
        (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim() ||
        (req.ip as string) ||
        (req.socket && (req.socket as any).remoteAddress) ||
        'unknown';
      const key = `${serviceKey}:${ip}`;
      const allowed = rateLimiter.consume(key, routeConfig.rateLimit.points, routeConfig.rateLimit.windowMs);
      if (!allowed) {
        console.warn(`[Gateway] Rate limit exceeded: ${serviceKey} ip=${ip} requestId=${requestId}`);
        return res.status(429).json({ message: 'Too many requests', requestId });
      }
    }

    // --- Basic logging: incoming request -> service mapping
    console.info(
      `[Gateway] IN ${req.method} ${forwardPath} -> ${serviceKey} (${routeConfig.envVar}) requestId=${requestId}`,
    );

    // --- Gateway Feature 1: Authentication enforcement (for protected routes)
    let user: any = null;
    const authHeader = req.headers['authorization'];

    if (routeConfig.protected) {
      const token = this.auth.extractBearerToken(authHeader);
      if (!token) throw new UnauthorizedException('Missing Bearer token');

      const payload = await this.auth.validate(token);
      user = payload.user ?? payload;
    }

    // --- Gateway Feature 2: Forward request to target service (with timeout + retries)
    const upstream = await this.proxy.forward({
      baseUrl,
      method: req.method,
      path: forwardPath === '/' ? '' : forwardPath,
      headers: {
        ...req.headers,
        // --- Gateway Feature 3: Request ID propagation for tracing
        'x-request-id': requestId,
        // --- Gateway Feature 4: propagate identity for internal services (demo-friendly)
        ...(user
          ? {
              'x-user-id': user.id,
              'x-user-email': user.email,
              'x-user-roles': JSON.stringify(user.roles ?? []),
            }
          : {}),
      },
      query: req.query,
      body: req.body,
      timeoutMs: routeConfig.timeout ?? DEFAULT_TIMEOUT,
      retries: routeConfig.retries ?? DEFAULT_RETRIES,
    });

    // --- Gateway Feature 5: basic response pass-through
    res.status(upstream.status);

    // --- Basic logging: upstream response status
    console.info(
      `[Gateway] OUT ${req.method} ${forwardPath} <- ${upstream.status} service=${serviceKey} requestId=${requestId}`,
    );

    return res.send(upstream.data);
  }
}
