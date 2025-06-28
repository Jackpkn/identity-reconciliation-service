import { createClient, RedisClientType } from "redis";
import NodeCache from "node-cache";
import { logger } from "./logger";
import { env } from "../config/env";

interface CacheInterface {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
  health(): Promise<{ status: string; latency: number }>;
}

class RedisCache implements CacheInterface {
  private client: RedisClientType;
  constructor() {
    this.client = createClient({
      url: env.REDIS_URL,
    });
    this.client.on("error", (error) => {
      logger.error("Redis Client Error", { error });
    });

    this.client.on("connect", () => {
      logger.info("Redis connected successfully");
    });
  }
  async connect(): Promise<void> {
    await this.client.connect();
  }
  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error("Redis get error", { error });
      return null;
    }
  }
  async set<T>(key: string, value: T, ttl = env.REDIS_TTL): Promise<void> {
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      logger.error("Redis set error", { error });
    }
  }
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error("Redis del error", { error });
    }
  }
  async clear(): Promise<void> {
    try {
      await this.client.flushAll();
    } catch (error) {
      logger.error("Redis clear all", { error });
    }
  }
  async health(): Promise<{ status: string; latency: number }> {
    const start = Date.now();
    try {
      await this.client.ping();
      const latency = Date.now() - start;
      return { status: "connected", latency: latency };
    } catch (error) {
      logger.error("Redis health check failed", { error });
      return { status: "disconnect", latency: 0 };
    }
  }
}
