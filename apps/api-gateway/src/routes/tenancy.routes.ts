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

router.get('/health', async (req: Request, res: Response) => {
    try {
        const response = await tenancyClient.getTenantHealth(req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /health');
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const tenants = await tenancyClient.getTenants(req.headers.authorization as string);
        res.status(200).json(tenants);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /');
    }
});

router.get('/:tenantId', async (req: Request, res: Response) => {
    try {
        const tenant = await tenancyClient.getTenantById(req.params.tenantId as string, req.headers.authorization as string);
        res.status(200).json(tenant);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /:tenantId');
    }
});

router.get('/:tenantId/settings', async (req: Request, res: Response) => {
    try {
        const tenantSettings = await tenancyClient.getTenantSettings(req.params.tenantId as string, req.headers.authorization as string);
        res.status(200).json(tenantSettings);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /:tenantId/settings');
    }
});

router.get('/:tenantId/colour-scheme', async (req: Request, res: Response) => {
    try {
        const colourScheme = await tenancyClient.getTenantColourScheme(req.params.tenantId as string, req.headers.authorization as string);
        res.status(200).json(colourScheme);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /:tenantId/colour-scheme');
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const tenant = await tenancyClient.insertTenant(req.body as Tenant, req.headers.authorization as string);
        res.status(201).json(tenant);
    } catch (err: any) {
        handleRouteError(err, res, 'POST /');
    }
});

router.put('/:tenantId', async (req: Request, res: Response) => {
    try {
        const tenant = await tenancyClient.updateTenant(req.params.tenantId as string, req.body as Tenant, req.headers.authorization as string);
        res.status(200).json(tenant);
    } catch (err: any) {
        handleRouteError(err, res, 'PUT /:tenantId');
    }
});

router.delete('/:tenantId', async (req: Request, res: Response) => {
    try {
        const tenant = await tenancyClient.deleteTenant(req.params.tenantId as string, req.headers.authorization as string);
        res.status(200).json(tenant);
    } catch (err: any) {
        handleRouteError(err, res, 'DELETE /:tenantId');
    }
});

export default router;
