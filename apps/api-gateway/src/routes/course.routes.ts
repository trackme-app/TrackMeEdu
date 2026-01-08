import { Router, Request, Response, NextFunction } from 'express';
import { CourseClient } from '../services/course.service';

const router = Router();
const client = new CourseClient();

router.use((req: Request, res: Response, next: NextFunction) => {
    res.header({ 'X-Tenant-Id': req.headers['x-tenant-id'], 'X-End-Service': 'Course & Curriculum' });
    next();
});

router.get('/health', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.getCourseHealth(tenantId, req.headers.authorization as string);
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/courses', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.getCourses(tenantId, req.headers.authorization as string);
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

export default router;
