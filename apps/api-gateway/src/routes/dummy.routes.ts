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

    res.status(statusCode).json({ error: errorMessage });
};

/**
 * @swagger
 * /api/v1/dummy/health:
 *   get:
 *     tags:
 *       - Dummy
 *     summary: Dummy service health check
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', async (req: Request, res: Response) => {
    try {
        const response = await client.getDummyHealth(req.headers.authorization);
        res.json(response);
    } catch (err) {
        handleRouteError(err, res, 'GET /health');
    }
});

/**
 * @swagger
 * /api/v1/dummy/dummyUser:
 *   get:
 *     tags:
 *       - Dummy
 *     summary: Get a dummy user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: success
 */
router.get('/dummyUser', async (req: Request, res: Response) => {
    try {
        const user = await client.getDummyUser(req.headers.authorization);
        res.json(user);
    } catch (err) {
        handleRouteError(err, res, 'GET /dummyUser');
    }
});

export default router;
