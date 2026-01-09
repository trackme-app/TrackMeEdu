import { Router, Request, Response, NextFunction } from 'express';
import { DummyClient } from '../services/dummy.service';

const router = Router();
const client = new DummyClient();

router.use((req: Request, res: Response, next: NextFunction) => {
    res.header({ 'X-Tenant-Id': req.headers['x-tenant-id'], 'X-End-Service': 'Dummy' });
    next();
});

const handleRouteError = (err: any, res: Response, context: string) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal server error';

    console.error(`[API Gateway Route][${context}] Error:`, { statusCode, errorMessage });

    res.status(statusCode).json({ error: errorMessage });
};

router.get('/health', async (req: Request, res: Response) => {
    try {
        const response = await client.getDummyHealth(req.headers.authorization);
        res.json(response);
    } catch (err) {
        handleRouteError(err, res, 'GET /health');
    }
});

router.get('/dummyUser', async (req: Request, res: Response) => {
    try {
        const user = await client.getDummyUser(req.headers.authorization);
        res.json(user);
    } catch (err) {
        handleRouteError(err, res, 'GET /dummyUser');
    }
});

export default router;
