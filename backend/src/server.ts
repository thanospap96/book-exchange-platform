import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import {Server} from 'socket.io';
import {createServer} from 'http';

import {connectDB} from './config/database';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import exchangeRoutes from './routes/exchangeRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const server =createServer(app);

//Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/exchanges', exchangeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        message: '✅ Book Exchange API is running!',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

const io = new Server(server, { // Socket.IO setup
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Join room for specific exchange
    socket.on('join_exchange', (exchangeId) => {
        socket.join(exchangeId);
        console.log(`User ${socket.id} joined exchange room: ${exchangeId}`);
    });

    // Handle chat messages
    socket.on('send_message', (data) => {
        const { exchangeId, message, sender, timestamp } = data;

        // Broadcast message to all users in the exchange room
        io.to(data.exchangeId).emit('receive_message', {
            message,
            sender,
            timestamp,
            exchangeId
        });

        console.log(`💬 Message sent in exchange ${exchangeId} by ${sender}`);
    });


    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});


app.use((req, res) => {
    res.status(404).json({
        message: '🔍 Route not found',
        path: req.originalUrl
    });
});


app.use(errorHandler);


const PORT = process.env.PORT || 5000;

// Σύνδεση βάσης και εκκίνηση server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
        console.log(
            `📊 Database status: ${
                mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
            }`
        );
        console.log(`🔌 Socket.IO ready for connections`);
    });
});

process.on('SIGINT', async () => {
    console.log('\n� shutting down gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    process.exit(0);
});