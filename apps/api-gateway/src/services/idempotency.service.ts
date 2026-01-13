import client from "../config/redis";
import { Request, Response } from "express";
import logger from "../helpers/logger";

const handleError = (error: any, context: string) => {
    if (error.statusCode >= 500) {
        logger.error({
            "dt": Date(),
            "service": "Gateway.IdempotencyService",
            "context": context,
            "message": error.message,
            "httpStatus": error.statusCode,
            "tenantId": error.tenantId
        });
    } else {
        logger.warn({
            "dt": Date(),
            "service": "Gateway.IdempotencyService",
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

    throw {
        message: error.message || "Internal Service Communication Error",
        statusCode: 500
    };
}

export const getCacheValue = async (idempotencyKey: Request["idempotencyKey"]): Promise<any> => {
    try {
        const cachedResponse = await client.get(String(idempotencyKey));
        return cachedResponse;
    } catch (error) {
        handleError({ message: "Failed to get cache value", statusCode: 500 }, "GET [X-Idempotency-Key]");
        throw error;
    }
};

export const setCacheValue = async (idempotencyKey: Request["idempotencyKey"], res: Response) => {

    if (!idempotencyKey) {
        handleError({ message: "No idempotency key specified", statusCode: 400 }, "POST [X-Idempotency-Key]");
        throw { message: "No idempotency key specified", statusCode: 400 };
    }

    await client.setEx(
        String(idempotencyKey),
        3600,
        JSON.stringify(res.locals.response)
    );
}