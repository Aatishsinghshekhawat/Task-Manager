import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { formatDistanceToNow } from 'date-fns';
import { Activity, User as UserIcon, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface ActivityLog {
    id: string;
    type: 'TASK_CREATED' | 'STATUS_UPDATED' | 'ASSIGNEE_CHANGED' | 'DUE_DATE_UPDATED' | 'PRIORITY_UPDATED';
    description: string;
    createdAt: string;
    user: {
        name: string;
    };
    task: {
        title: string;
    };
}

export default function ActivityFeed() {
    const { data: activities, isLoading } = useQuery({
        queryKey: ['activities'],
        queryFn: async () => {
            const { data } = await api.get('/analytics/activities');
            return data as ActivityLog[];
        },
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'TASK_CREATED': return <CheckCircle2 size={16} className="text-green-500" />;
            case 'STATUS_UPDATED': return <Activity size={16} className="text-blue-500" />;
            case 'ASSIGNEE_CHANGED': return <UserIcon size={16} className="text-purple-500" />;
            case 'DUE_DATE_UPDATED': return <Calendar size={16} className="text-orange-500" />;
            case 'PRIORITY_UPDATED': return <AlertCircle size={16} className="text-red-500" />;
            default: return <Clock size={16} className="text-gray-500" />;
        }
    };

    if (isLoading) {
        return <div className="p-4 text-center text-zinc-500">Loading activity...</div>;
    }

    if (!activities || activities.length === 0) {
        return <div className="p-4 text-center text-zinc-500">No recent activity.</div>;
    }

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 items-start p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="mt-1 p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md shrink-0">
                        {getIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                            {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {activity.user.name} • {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
