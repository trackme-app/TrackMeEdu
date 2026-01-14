import { Router, Request, Response } from 'express';
import { getUserById, getUsers, hardDeleteUser, insertUser, softDeleteUser, updateUser } from '../services/users.service';
const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await getUsers(req.headers['x-tenant-id'] as string);
        const response = {
            success: result.success,
            statusCode: result.statusCode,
            data: result.data,
            error: result.error,
            tenantId: req.headers['x-tenant-id'] as string,
            path: req.originalUrl
        };

        if (!response.success) {
            res.status(response.statusCode).json({ error: response.error });
            return;
        }

        res.status(response.statusCode).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await getUserById(req.headers['x-tenant-id'] as string, req.params.id);
        const response = {
            success: result.success,
            statusCode: result.statusCode,
            data: result.data,
            error: result.error,
            tenantId: req.headers['x-tenant-id'] as string,
            path: req.originalUrl
        };

        if (!response.success) {
            res.status(response.statusCode).json({ error: response.error });
            return;
        }

        res.status(response.statusCode).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const result = await insertUser(req.headers['x-tenant-id'] as string, req.body);
        const response = {
            success: result.success,
            statusCode: result.statusCode,
            data: result.data,
            error: result.error,
            tenantId: req.headers['x-tenant-id'] as string,
            path: req.originalUrl
        };

        if (!response.success) {
            res.status(response.statusCode).json({ error: response.error });
            return;
        }

        res.status(response.statusCode).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const result = await updateUser(req.headers['x-tenant-id'] as string, req.params.id, req.body);
        const response = {
            success: result.success,
            statusCode: result.statusCode,
            data: result.data,
            error: result.error,
            tenantId: req.headers['x-tenant-id'] as string,
            path: req.originalUrl
        };

        if (!response.success) {
            res.status(response.statusCode).json({ error: response.error });
            return;
        }

        res.status(response.statusCode).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const result = await hardDeleteUser(req.headers['x-tenant-id'] as string, req.params.id);
        const response = {
            success: result.success,
            statusCode: result.statusCode,
            data: result.data,
            error: result.error,
            tenantId: req.headers['x-tenant-id'] as string,
            path: req.originalUrl
        };

        if (!response.success) {
            res.status(response.statusCode).json({ error: response.error });
            return;
        }

        res.status(response.statusCode).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

router.delete('/soft/:id', async (req: Request, res: Response) => {
    try {
        const result = await softDeleteUser(req.headers['x-tenant-id'] as string, req.params.id);
        const response = {
            success: result.success,
            statusCode: result.statusCode,
            data: result.data,
            error: result.error,
            tenantId: req.headers['x-tenant-id'] as string,
            path: req.originalUrl
        };

        if (!response.success) {
            res.status(response.statusCode).json({ error: response.error });
            return;
        }

        res.status(response.statusCode).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to soft delete user' });
    }
});

export default router;