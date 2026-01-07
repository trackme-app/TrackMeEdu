import axios from "axios";
import axiosRetry from "axios-retry";

const BASE_URL = process.env.DUMMY_SERVICE_URL || "http://zzdummyservice:3000/api/v1/dummy";


const axiosInstance = axios.create();
axiosRetry(axiosInstance, {
    retries: 3,                    // retry 3 times
    retryDelay: axiosRetry.exponentialDelay, // exponential backoff
    retryCondition: (error) => axiosRetry.isNetworkError(error), // only network errors
});

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

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || BASE_URL;
    }

    async getDummyHealth(authToken?: string): Promise<DummyHealth> {
        const res = await axiosInstance.get<DummyHealth>(`${this.baseUrl}/`, {
            headers: {
                ...(authToken ? { Authorization: authToken } : {}),
            },
        });
        return res.data;
    }
    async getDummyUser(authToken?: string): Promise<DummyUser> {
        const res = await axiosInstance.get<DummyUser>(`${this.baseUrl}/dummyUser`, {
            headers: {
                ...(authToken ? { Authorization: authToken } : {}),
            },
        });
        return res.data;
    }
}