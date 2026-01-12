import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        // Initialize socket
        const newSocket = io('http://localhost:3000', {
            withCredentials: true,
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket Connected:', newSocket.id);
        });

        newSocket.on('task:created', (data) => {
            console.log('Socket: Task Created', data);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });

        newSocket.on('task:updated', (data) => {
            console.log('Socket: Task Updated', data);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });

        newSocket.on('task:deleted', (data) => {
            console.log('Socket: Task Deleted', data);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });

        return () => {
            newSocket.disconnect();
        };
    }, [queryClient]); // Runs once on mount

    return socket;
};
