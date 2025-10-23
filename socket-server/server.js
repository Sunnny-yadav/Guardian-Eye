import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';

const app = express();

const corsOpiton = {
    origin:  process.env.NEXTJS_URL
};

app.use(express.json());
app.use(cors(corsOpiton));

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.NEXTJS_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`✅ User connected.`);

    socket.on('user-registered', (region) => {
        if (!region) {
            console.log('⚠️ No region provided for user registration');
            return;
        }
        socket.join(region);
        socket.emit('room-joined', { region, success: true });
    });

    socket.on('prediction-complete', (data) => {
        if (!data?.region) {
            console.log('⚠️ No region provided for prediction broadcast');
            return;
        }
        
        io.to(data.region).emit('prediction-results', data);
        console.log(`📊 Prediction results broadcasted to region: ${data.region}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected.`);
    });
});

app.post("/api/emit-disaster-alert", (req, res) => {
    try {
        const { disasterId, disasterName } = req.body;

        if (!disasterId) {
            return res.status(400).json({ error: 'disasterId is required' });
        }

        io.emit("disaster-alert", {
            disasterId,
            disasterName
        });

        console.log(`🚨 Disaster alert emitted to users`);
        return res.status(200).json({
            success: true,
            message: 'Alert sent successfully'
        });

    } catch (error) {
        console.error('Error emitting alert:', error);
        return res.status(500).json({ error: 'Failed to emit alert', success: false });
    }
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Socket.io server running on port ${PORT}`);
    console.log(`📡 Accepting connections from: ${process.env.NEXTJS_URL || "http://localhost:3000"}`);
});