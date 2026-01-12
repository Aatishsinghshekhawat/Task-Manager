import { Calendar, AlertCircle, Pencil, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'COMPLETED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    createdAt: string;
    dueDate?: string;
    assigneeName?: string;
    onEdit: () => void;
    onDelete: () => void;
}

export default function TaskCard({ title, status, priority, createdAt, dueDate, assigneeName, onEdit, onDelete }: TaskCardProps) {
    const statusColors = {
        TODO: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
        IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        DONE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };

    const priorityColors = {
        LOW: 'text-zinc-500',
        MEDIUM: 'text-orange-500',
        HIGH: 'text-red-500',
        URGENT: 'text-purple-500',
    };

    const isOverdue = dueDate &&
        new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) &&
        status !== 'DONE' &&
        status !== 'COMPLETED';

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), 'dd/MM/yyyy');
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className={`group p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-md hover:border-blue-500/50 transition-all ${isOverdue ? 'opacity-40' : ''}`}>
            <div className="flex items-start justify-between gap-4">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {title}
                </h3>
                <span className={`shrink-0 px-2 py-1 rounded-md text-xs font-medium ${statusColors[status] || statusColors.TODO}`}>
                    {status.replace('_', ' ')}
                </span>
            </div>

            {assigneeName && (
                <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Assigned to: <span className="font-medium text-zinc-700 dark:text-zinc-300">{assigneeName}</span>
                </div>
            )}

            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Created: {formatDate(createdAt)}</span>
                    </div>
                    {dueDate && (
                        <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                            <Calendar size={12} />
                            <span>Due: {formatDate(dueDate)}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <div className={`flex items-center gap-1 font-medium ${priorityColors[priority] || priorityColors.MEDIUM}`}>
                        <AlertCircle size={14} />
                        <span>{priority}</span>
                    </div>
                </div>
            </div>

            {/* Actions - visible on group hover */}
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                    <Pencil size={14} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-1.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}
