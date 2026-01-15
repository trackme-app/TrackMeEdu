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

/**
 * @swagger
 * /api/v1/user/health:
 *   get:
 *     tags:
 *       - User
 *     summary: User service health check
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.getUserHealth(tenantId, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /health');
    }
});

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     responses:
 *       200:
 *         description: success
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.getUsers(tenantId, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /');
    }
});

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.getUserById(tenantId, req.params.id, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /:id');
    }
});

/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new user
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
router.post('/', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.insertUser(tenantId, req.body, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'POST /');
    }
});

/**
 * @swagger
 * /api/v1/user/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.updateUser(tenantId, req.params.id, req.body, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'PUT /:id');
    }
});

/**
 * @swagger
 * /api/v1/user/soft/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Soft delete user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     responses:
 *       200:
 *         description: success
 */
router.delete('/soft/:id', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.softDeleteUser(tenantId, req.params.id, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'DELETE /soft/:id');
    }
});

/**
 * @swagger
 * /api/v1/user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Hard delete user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     responses:
 *       200:
 *         description: success
 */
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.hardDeleteUser(tenantId, req.params.id, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'DELETE /:id');
    }
});

export default router;