import { Router, Request, Response } from 'express';
import { registerUser } from '../services/auth.service';
import argon2 from 'argon2';
const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
});

router.post('/changepassword', async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to change password' });
    }
});

router.post('/resetpassword', async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { password, ...user } = req.body;
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1
        });
        const result = await registerUser(req.headers['x-tenant-id'] as string, { ...user, password: hashedPassword });
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
