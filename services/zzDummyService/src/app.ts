import express from 'express';

import dummyRoutes from './routes/dummy.routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/dummy', dummyRoutes);

export default app;