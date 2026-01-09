import { Router, Request, Response, NextFunction } from 'express';
import { CourseClient } from '../services/course.service';
import { Course } from '@tme/shared-types';

const router = Router();
const client = new CourseClient();

router.use((req: Request, res: Response, next: NextFunction) => {
    res.header({ 'X-Tenant-Id': req.headers['x-tenant-id'], 'X-End-Service': 'Course & Curriculum' });
    next();
});

const handleRouteError = (err: any, res: Response, context: string) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal server error';

    // Log for debugging inside the container
    console.error(`[API Gateway Route][${context}] Error:`, { statusCode, errorMessage });

    // Send clean response to user - NO stack trace
    res.status(statusCode).json({ error: errorMessage });
};

router.get('/health', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.getCourseHealth(tenantId, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /health');
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.getCourses(tenantId, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /');
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.getCourseById(tenantId, req.params.id, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /:id');
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.insertCourse(tenantId, req.body as Course, req.headers.authorization as string);
        res.status(201).json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'POST /');
    }
});

export default router;
