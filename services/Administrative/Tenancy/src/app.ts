import express from 'express';

import tenancyRoutes from './routes/tenancy.routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/tenant', tenancyRoutes);

export default app;