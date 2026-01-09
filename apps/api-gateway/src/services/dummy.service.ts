import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";

const BASE_URL = process.env.DUMMY_SERVICE_URL || "http://zzdummyservice:3000/api/v1/dummy";

interface DummyUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface DummyHealth {
    status: string;
}

export class DummyClient {
    private baseUrl: string;
    private axiosInstance: AxiosInstance;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || BASE_URL;
        this.axiosInstance = axios.create({
            validateStatus: () => true
        });

        axiosRetry(this.axiosInstance, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: (error) => axiosRetry.isNetworkError(error),
        });
    }

    private handleError(error: any, context: string) {
        console.error(`[DummyClient][${context}] Error:`, error);

        if (error && error.statusCode && error.message) {
            throw error;
        }

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

    async getDummyHealth(authToken?: string): Promise<DummyHealth> {
        try {
            const res = await this.axiosInstance.get<DummyHealth>(`${this.baseUrl}/health`, {
                headers: {
                    ...(authToken ? { Authorization: authToken } : {}),
                },
            });

            if (res.status !== 200) {
                throw { message: "Health check failed", statusCode: res.status };
            }
            return res.data;
        } catch (error) {
            this.handleError(error, "getDummyHealth");
            throw error;
        }
    }

    async getDummyUser(authToken?: string): Promise<DummyUser> {
        try {
            const res = await this.axiosInstance.get<DummyUser | { error: string }>(`${this.baseUrl}/dummyUser`, {
                headers: {
                    ...(authToken ? { Authorization: authToken } : {}),
                },
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw { message: data.error || "Dummy user not found", statusCode: res.status };
            }
            return res.data as DummyUser;
        } catch (error) {
            this.handleError(error, "getDummyUser");
            throw error;
        }
    }
}