import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { Tenant, TenantSettings } from "@tme/shared-types";
import logger from "../logger/logger";

const BASE_URL = process.env.TENANCY_SERVICE_URL || "http://worker-tenancy:3000/api/v1/tenant";

interface tenancyHealth {
    status: string;
}

export class TenancyClient {
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
        logger.error({
            "dt": Date(),
            "service": "Gateway.TenancyClient",
            "context": context,
            "message": error.message,
            "httpStatus": error.statusCode
        });

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

    async getTenantHealth(authToken?: string): Promise<tenancyHealth> {
        try {
            const res = await this.axiosInstance.get<tenancyHealth>(`${this.baseUrl}/health`, {
                headers: {
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status !== 200) {
                throw { message: "Health check failed", statusCode: res.status };
            }
            return res.data;
        } catch (error) {
            this.handleError(error, "getTenantHealth");
            throw error; // Re-shadow for TS
        }
    }

    async getTenants(authToken?: string): Promise<Tenant[]> {
        try {
            const res = await this.axiosInstance.get<Tenant[] | { error: string }>(`${this.baseUrl}/`, {
                headers: {
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw { message: data.error || "Failed to fetch tenants", statusCode: res.status };
            }
            return res.data as Tenant[];
        } catch (error) {
            this.handleError(error, "getTenants");
            throw error;
        }
    }

    async getTenantById(id: string, authToken?: string): Promise<Tenant> {
        try {
            const res = await this.axiosInstance.get<Tenant | { error: string }>(`${this.baseUrl}/${id}`, {
                headers: {
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw { message: data.error || "Tenant not found", statusCode: res.status };
            }
            return res.data as Tenant;
        } catch (error) {
            this.handleError(error, "getTenantById");
            throw error;
        }
    }

    async insertTenant(tenant: Tenant, authToken?: string): Promise<Tenant> {
        try {
            const res = await this.axiosInstance.post<Tenant | { error: string }>(`${this.baseUrl}/`, tenant, {
                headers: {
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw {
                    message: data.error || "Failed to create tenant",
                    statusCode: res.status
                };
            }

            return res.data as Tenant;
        } catch (error) {
            this.handleError(error, "insertTenant");
            throw error;
        }
    }

    async updateTenant(id: string, tenant: Tenant, authToken?: string): Promise<Tenant> {
        try {
            const res = await this.axiosInstance.put<Tenant | { error: string }>(`${this.baseUrl}/${id}`, tenant, {
                headers: {
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw {
                    message: data.error || "Failed to update tenant",
                    statusCode: res.status
                };
            }

            return res.data as Tenant;
        } catch (error) {
            this.handleError(error, "updateTenant");
            throw error;
        }
    }

    async deleteTenant(id: string, authToken?: string): Promise<Tenant> {
        try {
            const res = await this.axiosInstance.delete<Tenant | { error: string }>(`${this.baseUrl}/${id}`, {
                headers: {
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw {
                    message: data.error || "Failed to delete tenant",
                    statusCode: res.status
                };
            }

            return res.data as Tenant;
        } catch (error) {
            this.handleError(error, "deleteTenant");
            throw error;
        }
    }
}