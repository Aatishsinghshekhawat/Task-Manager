import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        // Initialize socket
        socketRef.current = io('http://localhost:3000', {
            withCredentials: true,
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Socket Connected:', socket.id);
        });

        socket.on('task:created', (data) => {
            console.log('Socket: Task Created', data);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });

        socket.on('task:updated', (data) => {
            console.log('Socket: Task Updated', data);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });

        socket.on('task:deleted', (data) => {
            console.log('Socket: Task Deleted', data);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });

        return () => {
            socket.disconnect();
        };
    }, [queryClient]); // Runs once on mount
};
