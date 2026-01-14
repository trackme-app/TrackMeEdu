export interface ServiceResponse<T> {
    success: boolean;
    statusCode: number;
    tenantId?: string;
    path?: string;
    data?: T;
    error?: string;
}
