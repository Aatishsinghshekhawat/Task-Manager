import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import { CheckCircle2, Clock, ListTodo, Plus } from 'lucide-react';

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.push('/login');
            return;
        }

        fetchTasks();
    }, [user, authLoading, router]);

    const handleCreateTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: any) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await api.delete(`/tasks/${taskId}`);
            // Optimistic update or refetch
            setTasks(prev => prev.filter((t: any) => t.id !== taskId));
        } catch (error) {
            console.error('Failed to delete task', error);
            alert('Failed to delete task');
        }
    };

    // Calculate stats
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter((t: any) => t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
    const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;

    const stats = [
        { label: 'Total Tasks', value: totalTasks, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
        { label: 'Pending', value: pendingTasks, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
        { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
    ];

    const recentTasks = tasks.slice(0, 6); // Show top 6

    if (authLoading || loading) {
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
                <title>Dashboard - Task Manager</title>
            </Head>

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome back, {user?.name}!</h1>
                        <p className="text-zinc-500 dark:text-zinc-400">Here's what's happening with your projects today.</p>
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

                {/* Recent Tasks */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Tasks</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                            View All
                        </button>
                    </div>
                    {recentTasks.length === 0 ? (
                        <div className="text-center py-10 text-zinc-500">No tasks found. Create one to get started!</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {recentTasks.map((task: any) => (
                                <TaskCard
                                    key={task.id}
                                    title={task.title}
                                    status={task.status}
                                    priority={task.priority}
                                    dueDate={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}
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
