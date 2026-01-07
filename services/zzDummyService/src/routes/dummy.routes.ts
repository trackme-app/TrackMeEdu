import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

router.get('/dummyUser', (req: Request, res: Response) => {
    res.status(200).json({
        id: 1,
        name: 'Dummy User',
        email: 'dummy@dummy.com',
        role: 'dummy'
    });
});

export default router;
