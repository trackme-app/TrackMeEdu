import { Router, Request, Response, NextFunction } from 'express';
import { DummyClient } from '../services/dummy.service';

const router = Router();
const client = new DummyClient();

router.use((req: Request, res: Response, next: NextFunction) => {
    res.header({ 'X-Tenant-Id': req.headers['x-tenant-id'], 'X-End-Service': 'Dummy' });
    next();
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const response = await client.getDummyHealth(req.headers.authorization);
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/dummyUser', async (req: Request, res: Response) => {
    try {
        const user = await client.getDummyUser(req.headers.authorization);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

export default router;
