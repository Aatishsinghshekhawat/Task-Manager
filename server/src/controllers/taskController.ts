import { Request, Response } from 'express';
import prisma from '../config/db';
import { createTaskSchema, updateTaskSchema } from '../dtos/task.dto';
import { getIO } from '../socket';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    { creatorId: req.user!.id },
                    { assignedToId: req.user!.id },
                ],
            },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                assignee: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching tasks' });
    }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = createTaskSchema.parse(req.body);

        const task = await prisma.task.create({
            data: {
                ...body,
                creatorId: req.user!.id,
            },
            include: {
                creator: { select: { id: true, name: true } },
                assignee: { select: { id: true, name: true } }
            }
        });

        // Create notification if task is assigned to someone
        if (task.assignedToId && task.assignedToId !== req.user!.id) {
            const notification = await prisma.notification.create({
                data: {
                    userId: task.assignedToId,
                    taskId: task.id,
                    message: `${req.user!.name} assigned you a task: "${task.title}"`
                },
                include: {
                    task: {
                        select: {
                            id: true,
                            title: true,
                            priority: true,
                            dueDate: true,
                            creator: { select: { id: true, name: true } }
                        }
                    }
                }
            });

            try {
                // Emit notification to the assigned user
                getIO().to(task.assignedToId).emit('notification:new', notification);
            } catch (e) {
                console.error('Socket emit failed for notification', e);
            }
        }

        try {
            getIO().emit('task:created', task);
        } catch (e) {
            console.error('Socket emit failed', e);
        }

        res.status(201).json(task);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ errors: error.errors });
            return;
        }
        res.status(500).json({ message: 'Server error creating task' });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const body = updateTaskSchema.parse(req.body);

        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        // Check ownership/permission
        if (task.creatorId !== req.user!.id && task.assignedToId !== req.user!.id) {
            res.status(403).json({ message: 'Not authorized to update this task' });
            return;
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: body,
            include: {
                creator: { select: { id: true, name: true } },
                assignee: { select: { id: true, name: true } }
            }
        });

        // Create notification if assignee changed and is different from updater
        if (body.assignedToId && body.assignedToId !== task.assignedToId && body.assignedToId !== req.user!.id) {
            const notification = await prisma.notification.create({
                data: {
                    userId: body.assignedToId,
                    taskId: updatedTask.id,
                    message: `${req.user!.name} assigned you a task: "${updatedTask.title}"`
                },
                include: {
                    task: {
                        select: {
                            id: true,
                            title: true,
                            priority: true,
                            dueDate: true,
                            creator: { select: { id: true, name: true } }
                        }
                    }
                }
            });

            try {
                getIO().to(body.assignedToId).emit('notification:new', notification);
            } catch (e) {
                console.error('Socket emit failed for notification', e);
            }
        }

        try {
            getIO().emit('task:updated', updatedTask);
        } catch (e) {
            console.error('Socket emit failed', e);
        }

        res.json(updatedTask);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ errors: error.errors });
            return;
        }
        res.status(500).json({ message: 'Server error updating task' });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        if (task.creatorId !== req.user!.id) {
            res.status(403).json({ message: 'Only the creator can delete this task' });
            return;
        }

        await prisma.task.delete({ where: { id } });

        try {
            getIO().emit('task:deleted', { id });
        } catch (e) {
            console.error('Socket emit failed', e);
        }

        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting task' });
    }
};
