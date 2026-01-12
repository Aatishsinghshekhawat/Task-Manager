import { Request, Response } from 'express';
import prisma from '../config/db';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user!.id },
            include: {
                task: {
                    select: {
                        id: true,
                        title: true,
                        priority: true,
                        dueDate: true,
                        creator: {
                            select: { id: true, name: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to last 50 notifications
        });
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
};

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
    try {
        const count = await prisma.notification.count({
            where: {
                userId: req.user!.id,
                isRead: false
            }
        });
        res.json({ count });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ message: 'Server error fetching unread count' });
    }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const notification = await prisma.notification.findUnique({
            where: { id }
        });

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        if (notification.userId !== req.user!.id) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });

        res.json(updated);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error marking notification as read' });
    }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        await prisma.notification.updateMany({
            where: {
                userId: req.user!.id,
                isRead: false
            },
            data: { isRead: true }
        });

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ message: 'Server error marking all notifications as read' });
    }
};
