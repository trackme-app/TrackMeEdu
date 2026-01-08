import axios from "axios";
import axiosRetry from "axios-retry";
import { Course } from "@tme/shared-types";

const BASE_URL = process.env.COURSE_SERVICE_URL || "http://worker-courseandcurriculum:3000/api/v1/course";


const axiosInstance = axios.create();
axiosRetry(axiosInstance, {
    retries: 3,                    // retry 3 times
    retryDelay: axiosRetry.exponentialDelay, // exponential backoff
    retryCondition: (error) => axiosRetry.isNetworkError(error), // only network errors
});

interface courseHealth {
    status: string;
}

export class CourseClient {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || BASE_URL;
    }

    async getCourseHealth(tenantId: string, authToken?: string): Promise<courseHealth> {
        const res = await axiosInstance.get<courseHealth>(`${this.baseUrl}/health`, {
            headers: {
                "X-Tenant-Id": tenantId,
                ...(authToken ? { Authorization: authToken } : {}),
            }
        });
        return res.data;
    }

    async getCourses(tenantId: string, authToken?: string): Promise<Course[]> {
        const res = await axiosInstance.get<Course[]>(`${this.baseUrl}/courses`, {
            headers: {
                "X-Tenant-Id": tenantId,
                ...(authToken ? { Authorization: authToken } : {}),
            }
        });
        return res.data;
    }
}