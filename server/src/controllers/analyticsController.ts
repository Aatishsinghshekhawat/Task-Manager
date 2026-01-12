import { Request, Response } from 'express';
import prisma from '../config/db';

export const getStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;

        const baseWhere = {
            OR: [
                { creatorId: userId },
                { assignedToId: userId },
            ],
        };

        const [total, pending, completed, overdue] = await Promise.all([
            // Total tasks involved in
            prisma.task.count({ where: baseWhere }),

            // Pending tasks
            prisma.task.count({
                where: {
                    ...baseWhere,
                    status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW'] }
                }
            }),

            // Completed tasks
            prisma.task.count({
                where: {
                    ...baseWhere,
                    status: { in: ['COMPLETED'] }
                }
            }),

            // Overdue tasks (Past due date and not completed)
            prisma.task.count({
                where: {
                    ...baseWhere,
                    dueDate: { lt: new Date() },
                    status: { notIn: ['COMPLETED'] }
                }
            })
        ]);

        res.json({
            total,
            pending,
            completed,
            overdue
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

export const getChartData = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const baseWhere = {
            OR: [
                { creatorId: userId },
                { assignedToId: userId },
            ],
        };

        // Priority Distribution
        const tasksByPriority = await prisma.task.groupBy({
            by: ['priority'],
            where: baseWhere,
            _count: {
                priority: true
            }
        });

        const priorityData = tasksByPriority.map(item => ({
            name: item.priority,
            value: item._count.priority
        }));

        const statusData = [
            {
                name: 'Completed',
                value: await prisma.task.count({
                    where: { ...baseWhere, status: { in: ['COMPLETED'] } }
                })
            },
            {
                name: 'Pending',
                value: await prisma.task.count({
                    where: { ...baseWhere, status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW'] } }
                })
            },
            {
                name: 'Overdue',
                value: await prisma.task.count({
                    where: {
                        ...baseWhere,
                        dueDate: { lt: new Date() },
                        status: { notIn: ['COMPLETED'] }
                    }
                })
            }
        ];

        res.json({
            priorityData,
            statusData
        });
    } catch (error) {
        console.error('Error fetching chart data:', error);
        res.status(500).json({ message: 'Server error fetching chart data' });
    }
};

export const getActivities = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;

        // Fetch activities related to tasks the user is involved in
        const activities = await prisma.activityLog.findMany({
            where: {
                task: {
                    OR: [
                        { creatorId: userId },
                        { assignedToId: userId }
                    ]
                }
            },
            include: {
                user: { select: { id: true, name: true } },
                task: { select: { id: true, title: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        res.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ message: 'Server error fetching activities' });
    }
};
