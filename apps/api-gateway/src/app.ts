import express, { Request, Response, NextFunction } from 'express';
import dummyRoutes from './routes/dummy.routes';
import healthRoutes from './routes/health.routes';
import courseRoutes from './routes/course.routes';
import tenancyRoutes from './routes/tenancy.routes';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import { idempotencyMiddleware, tenancyMiddleware } from './middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();

app.use(express.json());

// Documentation
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
    if (req.method === "POST") {
        return idempotencyMiddleware(req, res, next);
    }
    next();
});

// Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/dummy', dummyRoutes);
app.use('/api/v1/course', [tenancyMiddleware], courseRoutes);
app.use('/api/v1/tenant', tenancyRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

// Global error handler - catches any unhandled errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal server error';

    // Only return status code and error message, no stack traces
    res.status(statusCode).json({ error: errorMessage });
});

export default app;