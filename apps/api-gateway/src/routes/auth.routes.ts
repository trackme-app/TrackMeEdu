import { Router, Request, Response, NextFunction } from 'express';
import { AuthClient } from '../services/auth.service';

const router = Router();
const client = new AuthClient();

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

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: success
 */
router.post('/register', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.registerUser(tenantId, req.body, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'POST /register');
    }
});

export default router;