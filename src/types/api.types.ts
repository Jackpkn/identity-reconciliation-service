export interface IdentifyRequest {
  email?: string;
  phoneNumber?: string;
}

export interface IdentifyResponse {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
}

export interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
  database: {
    status: "connected" | "disconnected";
    latency?: number;
  };
  cache: {
    status: "connected" | "disconnected";
    latency?: number;
  };
}
