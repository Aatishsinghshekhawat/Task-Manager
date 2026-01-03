import Head from 'next/head';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import { CheckCircle2, Clock, ListTodo, Plus } from 'lucide-react';

export default function Dashboard() {
    // Mock Data
    const stats = [
        { label: 'Total Tasks', value: 12, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
        { label: 'Pending', value: 4, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
        { label: 'Completed', value: 8, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
    ];

    const recentTasks = [
        { id: 1, title: 'Design System Implementation', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: 'Tomorrow' },
        { id: 2, title: 'Authentication Flow Fixes', status: 'TODO', priority: 'MEDIUM', dueDate: 'Next Week' },
        { id: 3, title: 'Update User Profile API', status: 'DONE', priority: 'LOW', dueDate: 'Yesterday' },
        { id: 4, title: 'Dashboard Analytics View', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: 'Today' },
    ];

    return (
        <Layout>
            <Head>
                <title>Dashboard - Task Manager</title>
            </Head>

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome back, User! 👋</h1>
                        <p className="text-zinc-500 dark:text-zinc-400">Here's what's happening with your projects today.</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {recentTasks.map((task: any) => (
                            <TaskCard
                                key={task.id}
                                title={task.title}
                                status={task.status as any}
                                priority={task.priority as any}
                                dueDate={task.dueDate}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
