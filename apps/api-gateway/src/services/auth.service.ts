import fs from "fs";
import https from "https";
import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { User } from "@tme/shared-types";
import logger from "../helpers/logger";
import config from "../config/config";

const BASE_URL = process.env.IAM_SERVICE_URL || "https://worker-iam:3000/api/v1/auth";

interface authHealth {
    status: string;
}

export class AuthClient {
    private baseUrl: string;
    private axiosInstance: AxiosInstance;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || BASE_URL;

        const httpsAgent = config.ssl ? new https.Agent({
            key: fs.readFileSync(config.ssl.key),
            cert: fs.readFileSync(config.ssl.cert),
            ca: fs.readFileSync(config.ssl.ca),
            rejectUnauthorized: true
        }) : undefined;

        this.axiosInstance = axios.create({
            validateStatus: () => true, // Handle all status codes manually
            httpsAgent: httpsAgent
        });

        axiosRetry(this.axiosInstance, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: (error) => axiosRetry.isNetworkError(error),
        });
    }

    private handleError(error: any, context: string) {
        if (error.statusCode >= 500) {
            logger.error({
                "dt": Date(),
                "service": "Gateway.UserClient",
                "context": context,
                "message": error.message,
                "httpStatus": error.statusCode,
                "tenantId": error.tenantId
            });
        } else {
            logger.warn({
                "dt": Date(),
                "service": "Gateway.UserClient",
                "context": context,
                "message": error.message,
                "httpStatus": error.statusCode,
                "tenantId": error.tenantId
            });
        }

        // If it's already a clean error we threw manually
        if (error && error.statusCode && error.message) {
            throw error;
        }

        // Handle Axios error (though validateStatus: () => true should prevent most throws)
        if (axios.isAxiosError(error) && error.response) {
            throw {
                message: error.response.data?.error || error.response.data?.message || error.message,
                statusCode: error.response.status
            };
        }

        throw {
            message: error.message || "Internal Service Communication Error",
            statusCode: 500
        };
    }

    async getAuthHealth(tenantId: string, authToken?: string): Promise<authHealth> {
        try {
            const res = await this.axiosInstance.get<authHealth>(`${this.baseUrl}/health`, {
                headers: {
                    "X-Tenant-Id": tenantId,
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status !== 200) {
                throw {
                    message: "Health check failed",
                    tenantId: tenantId,
                    statusCode: res.status
                };
            }
            return res.data;
        } catch (error) {
            this.handleError(error, "getAuthHealth");
            throw error; // Re-shadow for TS
        }
    }

    async registerUser(tenantId: string, user: User, authToken?: string): Promise<User> {
        try {
            const res = await this.axiosInstance.post<User | { error: string }>(`${this.baseUrl}/register`, user, {
                headers: {
                    "X-Tenant-Id": tenantId,
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw {
                    message: data.error || "Failed to create user",
                    tenantId: tenantId,
                    statusCode: res.status
                };
            }

            logger.info({
                "dt": Date(),
                "service": "Gateway.UserClient",
                "context": "insertUser",
                "message": "User created successfully",
                "httpStatus": res.status,
                "tenantId": tenantId
            });

            return res.data as User;
        } catch (error) {
            this.handleError(error, "insertUser");
            throw error;
        }
    }
}