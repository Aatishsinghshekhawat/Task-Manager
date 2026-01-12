import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import notificationRoutes from './routes/notificationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { initSocket } from './socket';

// Load env vars
dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Initialize Socket.io
initSocket(httpServer);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.send('Task Manager API Running');
});

// Start Server
if (require.main === module) {
    httpServer.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
        console.log('[server]: Socket.io initialized');
    });
}

export default app;
