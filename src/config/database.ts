import { logger } from "../utils/logger";
import { PrismaClient, Prisma } from "@prisma/client";
import { env } from "../config/env";
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    "query" | "info" | "warn" | "error"
  >;
  private constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: env.DATABASE_URL,
        },
      },
      log: [
        { level: "query", emit: "event" },
        { level: "info", emit: "event" },
        { level: "warn", emit: "event" },
        { level: "error", emit: "event" },
      ],
    });
    this.setupEventListeners();
  }
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
  public getClient(): PrismaClient {
    return this.prisma;
  }
  private setupEventListeners(): void {
    this.prisma.$on("query", (e: Prisma.QueryEvent) => {
      logger.debug("Database Query", {
        query: e.query,
        params: e.params,
        duration: e.duration,
      });
    });
  }
  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info("Database connected successfully");
    } catch (error) {
      logger.error("Database connection failed", { error });
      throw error;
    }
  }
  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info("Database disconnected successfully");
    } catch (error) {
      logger.error("Database disconnection failed", { error });
      throw error;
    }
  }
  public async healthCheck(): Promise<{ status: string; latency: number }> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;
      return { status: "connected", latency };
    } catch (error) {
      logger.error("Database health check failed", { error });
      return { status: "disconnected", latency: 0 };
    }
  }
}

export const database = DatabaseConnection.getInstance();
export const prisma = database.getClient();
