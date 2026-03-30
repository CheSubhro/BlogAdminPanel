import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js'; 
import authRoutes from './src/routes/authRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import mediaRoutes from './src/routes/mediaRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js'
import analyticsRoutes from './src/routes/analyticsRoutes.js';
import settingsRoutes from './src/routes/settingsRoutes.js';
import serverRoutes from './src/routes/serverStatus.js'

dotenv.config();

const app = express();

// Database Connection
connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Admin Dashboard API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/server', serverRoutes);