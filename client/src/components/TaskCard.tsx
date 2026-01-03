import { Calendar, AlertCircle } from 'lucide-react';

interface TaskCardProps {
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
}

export default function TaskCard({ title, status, priority, dueDate }: TaskCardProps) {
    const statusColors = {
        TODO: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
        IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        DONE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };

    const priorityColors = {
        LOW: 'text-zinc-500',
        MEDIUM: 'text-orange-500',
        HIGH: 'text-red-500',
    };

    return (
        <div className="group p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-md hover:border-blue-500/50 transition-all cursor-pointer">
            <div className="flex items-start justify-between gap-4">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>
                <span className={`shrink-0 px-2 py-1 rounded-md text-xs font-medium ${statusColors[status]}`}>
                    {status.replace('_', ' ')}
                </span>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                    {dueDate && (
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{dueDate}</span>
                        </div>
                    )}
                </div>
                <div className={`flex items-center gap-1 font-medium ${priorityColors[priority]}`}>
                    <AlertCircle size={14} />
                    <span>{priority}</span>
                </div>
            </div>
        </div>
    );
}
