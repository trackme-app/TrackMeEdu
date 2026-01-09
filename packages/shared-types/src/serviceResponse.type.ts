export interface ServiceResponse<T> {
    success: boolean;
    statusCode: number;
    data?: T;
    error?: string;
}
