import { Request, Response, NextFunction } from "express";
import logger from "../helpers/logger";
import { TenancyClient } from "../services/tenancy.service";

const tenancyClient = new TenancyClient();

const handleError = (error: any, res: Response, context: string) => {
    if (error.statusCode >= 500 || error.message.includes("Tenant name mismatch") && !error.message.includes("Tenant not found")) {
        logger.error({
            "dt": Date(),
            "service": "Gateway.TenancyMiddleware",
            "context": context,
            "message": error.message,
            "httpStatus": error.statusCode,
            "tenantId": error.tenantId
        });
    } else if (!error?.message.includes("Tenant not found")) {
        logger.warn({
            "dt": Date(),
            "service": "Gateway.TenancyMiddleware",
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
            throw { statusCode: 400, message: 'Tenant ID not found', tenantId };
        }

        const tenantResponse = await tenancyClient.getTenantById(tenantId as string, req.headers.authorization as string);

        if (!tenantResponse) {
            throw { statusCode: 404, message: 'Tenant not found', tenantId };
        }

        if (tenantResponse.tenant_name !== tenantName) {
            throw { statusCode: 400, message: 'Tenant name mismatch', tenantId };
        }

        next();
    } catch (error) {
        handleError(error, res, "TenancyMiddleware");
        throw error;
    }
};