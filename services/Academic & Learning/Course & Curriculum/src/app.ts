import express from 'express';

import courseRoutes from './routes/course.routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/course', courseRoutes);

export default app;