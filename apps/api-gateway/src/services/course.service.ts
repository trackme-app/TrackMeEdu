import fs from "fs";
import https from "https";
import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { Course } from "@tme/shared-types";
import logger from "../helpers/logger";
import config from "../config/config";

const BASE_URL = process.env.COURSE_SERVICE_URL || "https://worker-courseandcurriculum:3000/api/v1/course";

interface courseHealth {
    status: string;
}

export class CourseClient {
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
                "service": "Gateway.CourseClient",
                "context": context,
                "message": error.message,
                "httpStatus": error.statusCode,
                "tenantId": error.tenantId
            });
        } else {
            logger.warn({
                "dt": Date(),
                "service": "Gateway.CourseClient",
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

    async getCourseHealth(tenantId: string, authToken?: string): Promise<courseHealth> {
        try {
            const res = await this.axiosInstance.get<courseHealth>(`${this.baseUrl}/health`, {
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
            this.handleError(error, "getCourseHealth");
            throw error; // Re-shadow for TS
        }
    }

    async getCourses(tenantId: string, authToken?: string): Promise<Course[]> {
        try {
            const res = await this.axiosInstance.get<Course[] | { error: string }>(`${this.baseUrl}/`, {
                headers: {
                    "X-Tenant-Id": tenantId,
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw {
                    message: data.error || "Failed to fetch courses",
                    tenantId: tenantId,
                    statusCode: res.status
                };
            }
            return res.data as Course[];
        } catch (error) {
            this.handleError(error, "getCourses");
            throw error;
        }
    }

    async getCourseById(tenantId: string, id: string, authToken?: string): Promise<Course> {
        try {
            const res = await this.axiosInstance.get<Course | { error: string }>(`${this.baseUrl}/${id}`, {
                headers: {
                    "X-Tenant-Id": tenantId,
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw {
                    message: data.error || "Course not found",
                    tenantId: tenantId,
                    statusCode: res.status
                };
            }
            return res.data as Course;
        } catch (error) {
            this.handleError(error, "getCourseById");
            throw error;
        }
    }

    async insertCourse(tenantId: string, course: Course, authToken?: string): Promise<Course> {
        try {
            const res = await this.axiosInstance.post<Course | { error: string }>(`${this.baseUrl}/`, course, {
                headers: {
                    "X-Tenant-Id": tenantId,
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw {
                    message: data.error || "Failed to create course",
                    tenantId: tenantId,
                    statusCode: res.status
                };
            }

            logger.info({
                "dt": Date(),
                "service": "Gateway.CourseClient",
                "context": "insertCourse",
                "message": "Course created successfully",
                "httpStatus": res.status,
                "tenantId": tenantId
            });

            return res.data as Course;
        } catch (error) {
            this.handleError(error, "insertCourse");
            throw error;
        }
    }

    async updateCourse(tenantId: string, id: string, course: Course, authToken?: string): Promise<Course> {
        try {
            const res = await this.axiosInstance.put<Course | { error: string }>(`${this.baseUrl}/${id}`, course, {
                headers: {
                    "X-Tenant-Id": tenantId,
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw {
                    message: data.error || "Failed to update course",
                    tenantId: tenantId,
                    statusCode: res.status
                };
            }

            return res.data as Course;
        } catch (error) {
            this.handleError(error, "updateCourse");
            throw error;
        }
    }

    async deleteCourse(tenantId: string, id: string, authToken?: string): Promise<Course> {
        try {
            const res = await this.axiosInstance.delete<Course | { error: string }>(`${this.baseUrl}/${id}`, {
                headers: {
                    "X-Tenant-Id": tenantId,
                    ...(authToken ? { Authorization: authToken } : {}),
                }
            });

            if (res.status >= 300) {
                const data = res.data as { error: string };
                throw {
                    message: data.error || "Failed to delete course",
                    tenantId: tenantId,
                    statusCode: res.status
                };
            }

            return res.data as Course;
        } catch (error) {
            this.handleError(error, "deleteCourse");
            throw error;
        }
    }
}


