import { Router, Request, Response } from 'express';
import { getTenants, getTenantById, insertTenant, updateTenant, deleteTenant, getTenantSettings, getTenantColourScheme } from '../services/tenancy.service';
import { Tenant } from '@tme/shared-types';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await getTenants();
        if (!result.success) {
            res.status(result.statusCode).json({ error: result.error });
            return;
        }
        res.status(result.statusCode).json(result.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tenants' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await getTenantById(req.params.id);
        if (!result.success) {
            res.status(result.statusCode).json({ error: result.error });
            return;
        }
        res.status(result.statusCode).json(result.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tenant' });
    }
});

router.get('/:id/settings', async (req: Request, res: Response) => {
    try {
        const result = await getTenantSettings(req.params.id);
        if (!result.success) {
            res.status(result.statusCode).json({ error: result.error });
            return;
        }
        res.status(result.statusCode).json(result.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tenant settings' });
    }
});

router.get('/:id/colour-scheme', async (req: Request, res: Response) => {
    try {
        const result = await getTenantColourScheme(req.params.id);
        if (!result.success) {
            res.status(result.statusCode).json({ error: result.error });
            return;
        }
        res.status(result.statusCode).json(result.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tenant colour scheme' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const result = await insertTenant(req.body as Tenant);
        if (!result.success) {
            res.status(result.statusCode).json({ error: result.error });
            return;
        }
        res.status(result.statusCode).json(result.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create tenant' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const result = await updateTenant(req.params.id, req.body as Tenant);
        if (!result.success) {
            res.status(result.statusCode).json({ error: result.error });
            return;
        }
        res.status(result.statusCode).json(result.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update tenant' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const result = await deleteTenant(req.params.id);
        if (!result.success) {
            res.status(result.statusCode).json({ error: result.error });
            return;
        }
        res.status(result.statusCode).json(result.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete tenant' });
    }
});

export default router;