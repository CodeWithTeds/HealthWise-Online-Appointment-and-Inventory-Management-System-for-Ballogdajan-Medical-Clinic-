import { usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Bell, Calendar, XCircle, AlertTriangle, Package, Activity, Check } from 'lucide-react';
import type { User } from '@/types/auth';

type Notification = {
    id: number;
    type: string;
    title: string;
    message: string;
    icon: string;
    read: boolean;
    created_at: string;
};

const iconMap: Record<string, typeof Bell> = {
    bell: Bell,
    calendar: Calendar,
    'x-circle': XCircle,
    'alert-triangle': AlertTriangle,
    package: Package,
    activity: Activity,
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export function NotificationPanel() {
    const { auth, notificationCount } = usePage().props as { auth: { user: User | null }; notificationCount?: number };
    const user = auth.user;

    if (!user || !['doctor', 'secretary', 'pharmacist'].includes(user.role)) return null;

    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(notificationCount || 0);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setUnread(notificationCount || 0); }, [notificationCount]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await fetch('/notifications/data');
            const data = await res.json();
            setNotifications(data.notifications);
            setUnread(data.unread_count);
        } finally {
            setLoading(false);
        }
    };

    const togglePanel = () => {
        if (!open) fetchNotifications();
        setOpen(!open);
    };

    const markAsRead = async (id: number) => {
        await fetch(`/notifications/${id}/read`, {
            method: 'PATCH',
            headers: { 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '' },
        });
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
        setUnread((prev) => Math.max(0, prev - 1));
    };

    const markAllRead = async () => {
        await fetch('/notifications/read-all', {
            method: 'PATCH',
            headers: { 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '' },
        });
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnread(0);
    };

    const typeColor = (type: string) => {
        switch (type) {
            case 'appointment_created': return 'bg-blue-50 text-blue-600';
            case 'appointment_cancelled': return 'bg-red-50 text-red-600';
            case 'inventory_low': return 'bg-amber-50 text-amber-600';
            case 'inventory_adjusted': return 'bg-purple-50 text-purple-600';
            case 'queue_update': return 'bg-green-50 text-green-600';
            default: return 'bg-neutral-50 text-neutral-600';
        }
    };

    return (
        <div ref={panelRef} className="relative">
            <button
                onClick={togglePanel}
                className="relative rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                        {unread > 99 ? '99+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900 sm:w-96">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-700">
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Notifications</h3>
                            <p className="text-[10px] text-neutral-400">{unread} unread</p>
                        </div>
                        {unread > 0 && (
                            <button onClick={markAllRead} className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-[#0787f7] hover:bg-[#0787f7]/5">
                                <Check className="h-3 w-3" /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0787f7] border-t-transparent" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-8 text-center">
                                <Bell className="mx-auto mb-2 h-8 w-8 text-neutral-300" />
                                <p className="text-xs text-neutral-400">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const Icon = iconMap[notif.icon] || Bell;
                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => !notif.read && markAsRead(notif.id)}
                                        className={`flex gap-3 border-b border-neutral-50 px-4 py-3 transition-colors last:border-0 dark:border-neutral-800 ${
                                            !notif.read ? 'cursor-pointer bg-blue-50/30 hover:bg-blue-50/50 dark:bg-blue-900/5' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                                        }`}
                                    >
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColor(notif.type)}`}>
                                            <Icon className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className={`text-xs ${!notif.read ? 'font-bold text-neutral-900 dark:text-neutral-100' : 'font-medium text-neutral-700 dark:text-neutral-300'}`}>{notif.title}</p>
                                                {!notif.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0787f7]" />}
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">{notif.message}</p>
                                            <p className="mt-1 text-[10px] text-neutral-400">{timeAgo(notif.created_at)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
