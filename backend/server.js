import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { authLimiter } from './middleware/rateLimitMiddleware.js';

dotenv.config();

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))

app.use(express.json());

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running...'
    })
})

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running in mode on port ${PORT}`);
    })
}

startServer();