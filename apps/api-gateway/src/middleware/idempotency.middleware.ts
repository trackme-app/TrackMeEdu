// src/middleware/idempotency.ts
import { Request, Response, NextFunction } from "express";
import { getCacheValue, setCacheValue } from "../services/idempotency.service";
import logger from "../helpers/logger";

const handleError = (error: any, res: Response, context: string) => {
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Internal server error';

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

    // Send clean response to user - NO stack trace
    res.status(statusCode).json({ error: errorMessage });
};

export const idempotencyMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const idempotencyKey = req.headers['x-idempotency-key'] as string;

    if (!idempotencyKey) {
        return handleError(
            { message: "Missing x-idempotency-key header", statusCode: 400 },
            res,
            `${req.method} [X-Idempotency-Key]`
        );
    }

    const cachedResponse = await getCacheValue(idempotencyKey);

    if (null != cachedResponse) {
        return res.status(200).json(JSON.parse(cachedResponse));
    }

    res.on("finish", async () => {
        if (res.statusCode === 201) {
            await setCacheValue(
                idempotencyKey,
                res
            );
        }
    });

    next();
};