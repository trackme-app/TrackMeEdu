import express, { Request, Response, NextFunction } from 'express';
import dummyRoutes from './routes/dummy.routes';
import healthRoutes from './routes/health.routes';
import courseRoutes from './routes/course.routes';
import tenancyRoutes from './routes/tenancy.routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/dummy', dummyRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/tenant', tenancyRoutes);

// Global error handler - catches any unhandled errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal server error';

    // Only return status code and error message, no stack traces
    res.status(statusCode).json({ error: errorMessage });
});

export default app;