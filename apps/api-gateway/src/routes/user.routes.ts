import { Router, Request, Response, NextFunction } from 'express';
import { UserClient } from '../services/user.service';

const router = Router();
const client = new UserClient();

router.use((req: Request, res: Response, next: NextFunction) => {
    res.header({ 'X-Tenant-Id': req.headers['x-tenant-id'], 'X-End-Service': 'IAM' });
    next();
});

const handleRouteError = (err: any, res: Response, context: string) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal server error';

    // Send clean response to user - NO stack trace
    res.status(statusCode).json({ error: errorMessage });
};

router.get('/health', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.getUserHealth(tenantId, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /health');
    }
});