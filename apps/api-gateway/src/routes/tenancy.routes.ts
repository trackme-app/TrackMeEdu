import { Router, Request, Response, NextFunction } from 'express';
import { TenancyClient } from '../services/tenancy.service'
import { Tenant } from '@tme/shared-types';

const router = Router();
const tenancyClient = new TenancyClient();

router.use((req: Request, res: Response, next: NextFunction) => {
    res.header({ 'X-Tenant-Id': req.headers['x-tenant-id'], 'X-End-Service': 'Tenancy' });
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
 * /api/v1/tenant/health:
 *   get:
 *     tags:
 *       - Tenancy
 *     summary: Tenancy service health check
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', async (req: Request, res: Response) => {
    try {
        const response = await tenancyClient.getTenantHealth(req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /health');
    }
});

/**
 * @swagger
 * /api/v1/tenant:
 *   get:
 *     tags:
 *       - Tenancy
 *     summary: Get all tenants (or one by name)
 *     parameters:
 *       - in: query
 *         name: tenant_name
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: success
 */
router.get('/', async (req: Request, res: Response) => {
    if (req.query.tenant_name) {
        try {
            const tenant = await tenancyClient.getTenantByName(req.query.tenant_name as string, req.headers.authorization as string);
            res.status(200).json(tenant);
        } catch (err: any) {
            handleRouteError(err, res, 'GET /');
        }
    } else {
        try {
            const tenants = await tenancyClient.getTenants(req.headers.authorization as string);
            res.status(200).json(tenants);
        } catch (err: any) {
            handleRouteError(err, res, 'GET /');
        }
    }
});

/**
 * @swagger
 * /api/v1/tenant/{tenantId}:
 *   get:
 *     tags:
 *       - Tenancy
 *     summary: Get tenant by ID
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 */
router.get('/:tenantId', async (req: Request, res: Response) => {
    try {
        const tenant = await tenancyClient.getTenantById(req.params.tenantId as string, req.headers.authorization as string);
        res.status(200).json(tenant);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /:tenantId');
    }
});

/**
 * @swagger
 * /api/v1/tenant/{tenantId}/settings:
 *   get:
 *     tags:
 *       - Tenancy
 *     summary: Get tenant settings
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantSettings'
 */
router.get('/:tenantId/settings', async (req: Request, res: Response) => {
    try {
        const tenantSettings = await tenancyClient.getTenantSettings(req.params.tenantId as string, req.headers.authorization as string);
        res.status(200).json(tenantSettings);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /:tenantId/settings');
    }
});

/**
 * @swagger
 * /api/v1/tenant/{tenantId}/colour-scheme:
 *   get:
 *     tags:
 *       - Tenancy
 *     summary: Get tenant colour scheme
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ColourScheme'
 */
router.get('/:tenantId/colour-scheme', async (req: Request, res: Response) => {
    try {
        const colourScheme = await tenancyClient.getTenantColourScheme(req.params.tenantId as string, req.headers.authorization as string);
        res.status(200).json(colourScheme);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /:tenantId/colour-scheme');
    }
});

/**
 * @swagger
 * /api/v1/tenant:
 *   post:
 *     tags:
 *       - Tenancy
 *     summary: Create a new tenant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tenant'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const tenant = await tenancyClient.insertTenant(req.body as Tenant, req.headers.authorization as string);
        res.status(201).json(tenant);
    } catch (err: any) {
        handleRouteError(err, res, 'POST /');
    }
});

/**
 * @swagger
 * /api/v1/tenant/{tenantId}:
 *   put:
 *     tags:
 *       - Tenancy
 *     summary: Update tenant by ID
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tenant'
 *     responses:
 *       200:
 *         description: success
 */
router.put('/:tenantId', async (req: Request, res: Response) => {
    try {
        const tenant = await tenancyClient.updateTenant(req.params.tenantId as string, req.body as Tenant, req.headers.authorization as string);
        res.status(200).json(tenant);
    } catch (err: any) {
        handleRouteError(err, res, 'PUT /:tenantId');
    }
});

/**
 * @swagger
 * /api/v1/tenant/{tenantId}:
 *   delete:
 *     tags:
 *       - Tenancy
 *     summary: Delete tenant by ID
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: success
 */
router.delete('/:tenantId', async (req: Request, res: Response) => {
    try {
        const tenant = await tenancyClient.deleteTenant(req.params.tenantId as string, req.headers.authorization as string);
        res.status(200).json(tenant);
    } catch (err: any) {
        handleRouteError(err, res, 'DELETE /:tenantId');
    }
});

export default router;
