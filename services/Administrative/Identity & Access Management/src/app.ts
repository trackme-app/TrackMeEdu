import express from 'express';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

export default app;