import fs from "fs";
import https from "https";
import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { ColourScheme, Tenant, TenantSettings } from "@tme/shared-types";
import logger from "../helpers/logger";
import config from "../config/config";

const BASE_URL = process.env.TENANCY_SERVICE_URL || "https://worker-tenancy:3000/api/v1/tenant";

interface tenancyHealth {
    status: string;
}

export class TenancyClient {
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
                "service": "Gateway.TenancyClient",
                "context": context,
                "message": error.message,
                "httpStatus": error.statusCode,
                "tenantId": error.tenantId
            });
        } else {
            logger.warn({
                "dt": Date(),
                "service": "Gateway.TenancyClient",
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

    async getTenantSettings(id: string, authToken?: string): Promise<TenantSettings> {
        try {
            const res = await this.axiosInstance.get<TenantSettings | { error: string }>(`${this.baseUrl}/${id}/settings`, {
                headers: {
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw { message: data.error || "Tenant settings not found", statusCode: res.status };
            }
            return res.data as TenantSettings;
        } catch (error) {
            this.handleError(error, "getTenantSettings");
            throw error;
        }
    }

    async getTenantColourScheme(id: string, authToken?: string): Promise<ColourScheme> {
        try {
            const res = await this.axiosInstance.get<ColourScheme | { error: string }>(`${this.baseUrl}/${id}/colour-scheme`, {
                headers: {
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw { message: data.error || "Tenant colour scheme not found", statusCode: res.status };
            }
            return res.data as ColourScheme;
        } catch (error) {
            this.handleError(error, "getTenantColourScheme");
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

    async getTenantByName(tenant_name: string, authToken?: string): Promise<Tenant> {
        console.log(tenant_name);
        try {
            const res = await this.axiosInstance.get<Tenant | { error: string }>(`${this.baseUrl}/`, {
                params: { tenant_name },
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
            this.handleError(error, "getTenantByName");
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