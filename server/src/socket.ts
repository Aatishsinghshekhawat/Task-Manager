import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173", // Client URL
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });

    console.log('Socket.io Wrapper Initialized');

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join', (userId: string) => {
            socket.join(userId);
            console.log(`User ${userId} joined their private room`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
