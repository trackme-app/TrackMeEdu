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

    // Send clean response to user - NO stack trace
    res.status(statusCode).json({ error: errorMessage });
};

/**
 * @swagger
 * /api/v1/course/health:
 *   get:
 *     tags:
 *       - Course
 *     summary: Course service health check
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.getCourseHealth(tenantId, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /health');
    }
});

/**
 * @swagger
 * /api/v1/course:
 *   get:
 *     tags:
 *       - Course
 *     summary: Get all courses
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     responses:
 *       200:
 *         description: success
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.getCourses(tenantId, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /');
    }
});

/**
 * @swagger
 * /api/v1/course/{id}:
 *   get:
 *     tags:
 *       - Course
 *     summary: Get course by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     responses:
 *       200:
 *         description: success
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.getCourseById(tenantId, req.params.id, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'GET /:id');
    }
});

/**
 * @swagger
 * /api/v1/course:
 *   post:
 *     tags:
 *       - Course
 *     summary: Create a new course
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.insertCourse(tenantId, req.body as Course, req.headers.authorization as string);
        res.status(201).json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'POST /');
    }
});

/**
 * @swagger
 * /api/v1/course/{id}:
 *   put:
 *     tags:
 *       - Course
 *     summary: Update course by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: success
 */
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.updateCourse(tenantId, req.params.id, req.body as Course, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'PUT /:id');
    }
});

/**
 * @swagger
 * /api/v1/course/{id}:
 *   delete:
 *     tags:
 *       - Course
 *     summary: Delete course by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     responses:
 *       200:
 *         description: success
 */
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;
        const response = await client.deleteCourse(tenantId, req.params.id, req.headers.authorization as string);
        res.json(response);
    } catch (err: any) {
        handleRouteError(err, res, 'DELETE /:id');
    }
});

export default router;
