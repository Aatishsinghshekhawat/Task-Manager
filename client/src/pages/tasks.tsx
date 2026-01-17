import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import CustomSelect from '../components/CustomSelect';
import { CheckCircle2, Clock, ListTodo, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../hooks/useSocket';

export default function MyTasks() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
    const [sortBy, setSortBy] = useState<string>('NONE');
    const queryClient = useQueryClient();

    // Enable Real-time updates
    useSocket();

    // Fetch Tasks using React Query
    const { data: tasks = [], isLoading: tasksLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const { data } = await api.get('/tasks');
            return data;
        },
        enabled: !!user,
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleCreateTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: any) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (taskId: string) => {
            await api.delete(`/tasks/${taskId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            console.error('Failed to delete task', error);
            alert('Failed to delete task');
        }
    });

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        deleteMutation.mutate(taskId);
    };

    // Filter tasks assigned to current user
    const myTasks = tasks.filter((task: any) => task.assignedToId === user?.id);

    // Filter and Sort Logic
    const getFilteredAndSortedTasks = () => {
        let filtered = [...myTasks];

        // Apply status filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter((t: any) => t.status === statusFilter);
        }

        // Apply priority filter
        if (priorityFilter !== 'ALL') {
            filtered = filtered.filter((t: any) => t.priority === priorityFilter);
        }

        // Apply sorting
        if (sortBy === 'DUE_DATE_ASC') {
            filtered.sort((a: any, b: any) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            });
        } else if (sortBy === 'DUE_DATE_DESC') {
            filtered.sort((a: any, b: any) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
            });
        }

        return filtered;
    };

    const filteredTasks = getFilteredAndSortedTasks();

    // Calculate stats (use myTasks, not all tasks)
    const totalTasks = myTasks.length;
    const pendingTasks = myTasks.filter((t: any) => t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
    const completedTasks = myTasks.filter((t: any) => t.status === 'COMPLETED').length;

    const stats = [
        { label: 'My Tasks', value: totalTasks, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
        { label: 'Pending', value: pendingTasks, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
        { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
    ];

    const hasActiveFilters = statusFilter !== 'ALL' || priorityFilter !== 'ALL' || sortBy !== 'NONE';

    const clearFilters = () => {
        setStatusFilter('ALL');
        setPriorityFilter('ALL');
        setSortBy('NONE');
    };

    if (authLoading || tasksLoading) {
        return (
            <Layout>
                <div className="flex h-96 items-center justify-center">
                    <div className="text-xl text-zinc-500">Loading...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head>
                <title>My Tasks - Task Manager</title>
            </Head>

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">My Tasks</h1>
                        <p className="text-zinc-500 dark:text-zinc-400">Tasks assigned to you</p>
                    </div>
                    <button
                        onClick={handleCreateTask}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={18} />
                        Create New Task
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter & Sort Controls */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Status Filter */}
                            <CustomSelect
                                label="Status"
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={[
                                    { value: 'ALL', label: 'All Status' },
                                    { value: 'TODO', label: 'To Do' },
                                    { value: 'IN_PROGRESS', label: 'In Progress' },
                                    { value: 'COMPLETED', label: 'Completed' },
                                ]}
                            />

                            {/* Priority Filter */}
                            <CustomSelect
                                label="Priority"
                                value={priorityFilter}
                                onChange={setPriorityFilter}
                                options={[
                                    { value: 'ALL', label: 'All Priorities' },
                                    { value: 'LOW', label: 'Low' },
                                    { value: 'MEDIUM', label: 'Medium' },
                                    { value: 'HIGH', label: 'High' },
                                    { value: 'URGENT', label: 'Urgent' },
                                ]}
                            />

                            {/* Sort By */}
                            <CustomSelect
                                label="Sort By"
                                value={sortBy}
                                onChange={setSortBy}
                                options={[
                                    { value: 'NONE', label: 'Default' },
                                    { value: 'DUE_DATE_ASC', label: 'Due Date (Earliest)' },
                                    { value: 'DUE_DATE_DESC', label: 'Due Date (Latest)' },
                                ]}
                            />
                        </div>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Results Count */}
                    <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Showing <span className="font-semibold text-zinc-900 dark:text-white">{filteredTasks.length}</span> of <span className="font-semibold text-zinc-900 dark:text-white">{totalTasks}</span> tasks
                        </p>
                    </div>
                </div>

                {/* Tasks List */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">All My Tasks</h2>
                    </div>
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-10 text-zinc-500">
                            {myTasks.length === 0
                                ? "No tasks assigned to you yet."
                                : "No tasks match your filters."}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredTasks.map((task: any) => (
                                <TaskCard
                                    key={task.id}
                                    title={task.title}
                                    status={task.status}
                                    priority={task.priority}
                                    createdAt={task.createdAt}
                                    dueDate={task.dueDate}
                                    assigneeName={task.assignee?.name}
                                    onEdit={() => handleEditTask(task)}
                                    onDelete={() => handleDeleteTask(task.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Task Creation Modal */}
            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                taskToEdit={editingTask}
            />
        </Layout>
    );
}
