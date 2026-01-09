import { Router, Request, Response } from 'express';
import { getDummyUser, getHealth } from '../services/dummy.service';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
    const result = await getHealth();
    res.status(result.statusCode).json(result.data || { error: result.error });
});

router.get('/dummyUser', async (req: Request, res: Response) => {
    const result = await getDummyUser();
    if (!result.success) {
        res.status(result.statusCode).json({ error: result.error });
        return;
    }
    res.status(result.statusCode).json(result.data);
});

export default router;
