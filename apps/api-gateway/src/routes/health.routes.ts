import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    res.header({ 'X-Tenant-Id': req.headers['x-tenant-id'], 'X-End-Service': 'API Gateway' });
    next();
});

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

export default router;
