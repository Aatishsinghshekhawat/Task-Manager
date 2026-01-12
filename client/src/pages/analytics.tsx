import Head from 'next/head';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import ActivityFeed from '../components/ActivityFeed';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ListTodo, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function Analytics() {
    // Fetch Summary Stats
    const { data: stats } = useQuery({
        queryKey: ['analytics-stats'],
        queryFn: async () => {
            const { data } = await api.get('/analytics/stats');
            return data;
        },
    });

    // Fetch Chart Data
    const { data: chartData } = useQuery({
        queryKey: ['analytics-charts'],
        queryFn: async () => {
            const { data } = await api.get('/analytics/charts');
            return data;
        },
    });

    const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const summaryCards = [
        { label: 'Total Tasks', value: stats?.total || 0, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
        { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/10' },
        { label: 'Completed', value: stats?.completed || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/10' },
        { label: 'Overdue', value: stats?.overdue || 0, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10' },
    ];

    return (
        <Layout>
            <Head>
                <title>Analytics - Task Manager</title>
            </Head>

            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Productivity Analytics</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Track your performance and task history</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {summaryCards.map((card) => (
                        <div key={card.label} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
                                <card.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{card.label}</p>
                                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Charts Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Chart */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Task Completion Status</h2>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                                    <BarChart data={chartData?.statusData || []}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis dataKey="name" tick={{ fill: '#71717a' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#71717a' }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                            {
                                                chartData?.statusData?.map((entry: any, index: number) => {
                                                    let color = '#3B82F6'; // Default Pending Blue
                                                    if (entry.name === 'Completed') color = '#10B981'; // Green
                                                    if (entry.name === 'Overdue') color = '#EF4444'; // Red
                                                    return <Cell key={`cell-${index}`} fill={color} />;
                                                })
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Priority Chart */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Task Distribution by Priority</h2>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                                    <BarChart data={chartData?.priorityData || []}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis dataKey="name" tick={{ fill: '#71717a' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#71717a' }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Activity Feed Section */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm h-fit">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Recent Activity</h2>
                        <ActivityFeed />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
