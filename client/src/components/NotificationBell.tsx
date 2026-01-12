import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, AlertCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
            case 'HIGH': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
            case 'MEDIUM': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
            default: return 'text-zinc-600 bg-zinc-100 dark:bg-zinc-800/50';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <Bell size={20} className="text-zinc-600 dark:text-zinc-400" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-[480px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col">
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500 text-sm">
                                <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => markAsRead(notif.id)}
                                    className={`p-4 border-b border-zinc-100 dark:border-zinc-800 transition-colors cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${!notif.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className={`mt-0.5 h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${getPriorityColor(notif.task.priority)}`}>
                                            <AlertCircle size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-tight ${!notif.isRead ? 'font-semibold text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                                {notif.message}
                                            </p>
                                            <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500">
                                                <Clock size={10} />
                                                <span>{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</span>
                                                {notif.task.dueDate && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                                        <span>Due {new Date(notif.task.dueDate).toLocaleDateString()}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {!notif.isRead && (
                                            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 text-center">
                            <button className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium">
                                View all activity
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
