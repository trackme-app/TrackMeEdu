import { Router, Request, Response } from 'express';
import { getUserById, getUsers, hardDeleteUser, insertUser, softDeleteUser, updateUser } from '../services/users.service';
const router = Router();

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
        res.status(500).json({ error: 'Failed to register user' });
    }
});

export default router;
