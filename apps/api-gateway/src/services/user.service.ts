import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import logger from "../helpers/logger";

const BASE_URL = process.env.USER_SERVICE_URL || "http://worker-iam:3000/api/v1/user";

interface userHealth {
    status: string;
}

export class UserClient {
    private baseUrl: string;
    private axiosInstance: AxiosInstance;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || BASE_URL;
        this.axiosInstance = axios.create({
            validateStatus: () => true // Handle all status codes manually
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

    async getUserHealth(tenantId: string, authToken?: string): Promise<userHealth> {
        try {
            const res = await this.axiosInstance.get<userHealth>(`${this.baseUrl}/health`, {
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
            this.handleError(error, "getUserHealth");
            throw error; // Re-shadow for TS
        }
    }
}