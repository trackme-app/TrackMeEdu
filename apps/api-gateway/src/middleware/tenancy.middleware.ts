import { Request, Response, NextFunction } from "express";
import logger from "../helpers/logger";

const handleError = (error: any, res: Response, context: string) => {
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Internal server error';

    if (error.statusCode >= 500 || error.message.includes("Tenant name mismatch")) {
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

export const tenancyMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tenantId = req.headers["x-tenant-id"];
        const localDomain = process.env.LOCAL_DOMAIN || null;
        let tenantName;
        if (!(req.hostname.includes(".track-me.app") || (localDomain && req.hostname.endsWith(localDomain)))) {
            tenantName = 'test';
        } else {
            tenantName = req.hostname.split(".")[0];
        }

        if (!tenantId) {
            throw new Error("Tenant ID not found");
        }

        const tenantResponse = await fetch(`/api/v1/tenant/${tenantId}`);
        if (!tenantResponse.ok) throw new Error('Failed to fetch tenant');
        const tenantData = await tenantResponse.json();

        if (!tenantData) throw { statusCode: 404, message: 'Tenant not found', tenantId };
        if (tenantData.name !== tenantName) throw { statusCode: 400, message: 'Tenant name mismatch', tenantId };

        next();
    } catch (error) {
        handleError(error, res, "TenancyMiddleware");
    }
};