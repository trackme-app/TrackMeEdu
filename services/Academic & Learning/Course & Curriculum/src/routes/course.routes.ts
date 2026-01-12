import { Router, Request, Response } from 'express';
import { getCourses, getCourseById, insertCourse, updateCourse, deleteCourse } from '../services/courses.service';
import { Course } from '@tme/shared-types';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await getCourses(req.headers['x-tenant-id'] as string);
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
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await getCourseById(req.headers['x-tenant-id'] as string, req.params.id);
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
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const result = await insertCourse(req.headers['x-tenant-id'] as string, req.body as Course);
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
        console.error('Unexpected error in POST /:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const result = await updateCourse(req.headers['x-tenant-id'] as string, req.params.id, req.body as Course);
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
        console.error('Unexpected error in PUT /:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const result = await deleteCourse(req.headers['x-tenant-id'] as string, req.params.id);
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
        console.error('Unexpected error in DELETE /:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
