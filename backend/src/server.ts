import express, { Application } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("📚 Book Exchange API with TypeScript is running!");
});

// Socket.io test
io.on("connection", (socket) => {
    console.log("🟢 New client connected", socket.id);
    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected", socket.id);
    });
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bookexchange";
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
