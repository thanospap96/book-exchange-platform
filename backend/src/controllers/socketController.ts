import { Socket } from 'socket.io';
import { getIO } from '../services/socketService';

export const handleConnection = (socket: Socket) => {
    console.log('🔌 User connected:', socket.id);

    socket.on('join_exchange', (exchangeId: string) => {
        socket.join(exchangeId);
        console.log(`User ${socket.id} joined exchange: ${exchangeId}`);
    });

    socket.on('send_message', (data: any) => {
        const io = getIO();
        io.to(data.exchangeId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
};