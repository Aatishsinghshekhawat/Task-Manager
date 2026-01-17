import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CustomSelect from './CustomSelect';

interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    dueDate: string | null;
}

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    // onTaskSaved: () => void; // No longer needed
    taskToEdit?: Task | null;
}

export default function CreateTaskModal({ isOpen, onClose, taskToEdit }: CreateTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [status, setStatus] = useState('TODO');
    const [dueDate, setDueDate] = useState('');
    const [assignedToId, setAssignedToId] = useState('');
    const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/auth/users');
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };

        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description);
            setPriority(taskToEdit.priority);
            setStatus(taskToEdit.status);
            setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '');
            // @ts-ignore
            setAssignedToId(taskToEdit.assignedToId || '');
        } else {
            // Reset for create mode
            setTitle('');
            setDescription('');
            setPriority('MEDIUM');
            setStatus('TODO');
            setDueDate('');
            setAssignedToId('');
        }
    }, [taskToEdit, isOpen]);

    // Create/Update Mutation
    const mutation = useMutation({
        mutationFn: async (taskData: any) => {
            if (taskToEdit) {
                await api.put(`/tasks/${taskToEdit.id}`, taskData);
            } else {
                await api.post('/tasks', taskData);
            }
        },
        onSuccess: async () => {
            console.log('Mutation successful, invalidating tasks...');
            await queryClient.invalidateQueries({ queryKey: ['tasks'] });
            console.log('Tasks invalidated.');
            onClose();
        },
        onError: (error) => {
            console.error('Failed to save task', error);
            // Could add toast notification here
        }
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const taskData = {
            title,
            description,
            priority,
            status,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            assignedToId: assignedToId || undefined, // Send undefined if empty to avoid DB errors constraint
        };

        mutation.mutate(taskData);
    };

    const loading = mutation.isPending;

    // Prepare options for select boxes
    const assignOptions = [
        { value: '', label: 'Unassigned' },
        ...users.map((user) => ({ value: user.id, label: user.name })),
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {taskToEdit ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter task title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 resize-none"
                            placeholder="Enter task description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <CustomSelect
                            label="Priority"
                            value={priority}
                            onChange={setPriority}
                            options={[
                                { value: 'LOW', label: 'Low' },
                                { value: 'MEDIUM', label: 'Medium' },
                                { value: 'HIGH', label: 'High' },
                                { value: 'URGENT', label: 'Urgent' },
                            ]}
                        />
                        <CustomSelect
                            label="Status"
                            value={status}
                            onChange={setStatus}
                            options={[
                                { value: 'TODO', label: 'Todo' },
                                { value: 'IN_PROGRESS', label: 'In Progress' },
                                { value: 'COMPLETED', label: 'Completed' },
                            ]}
                        />
                    </div>

                    <CustomSelect
                        label="Assign To"
                        value={assignedToId}
                        onChange={setAssignedToId}
                        options={assignOptions}
                    />

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : (taskToEdit ? 'Update Task' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

