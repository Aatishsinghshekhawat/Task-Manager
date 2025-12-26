import { z } from 'zod';
import { Priority, Status } from '@prisma/client';

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    description: z.string().min(1, 'Description is required'),
    dueDate: z.string().optional().transform((str) => (str ? new Date(str) : undefined)),
    priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    dueDate: z.string().optional().transform((str) => (str ? new Date(str) : null)), // Allow null to clear date
    priority: z.nativeEnum(Priority).optional(),
    status: z.nativeEnum(Status).optional(),
    assignedToId: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
