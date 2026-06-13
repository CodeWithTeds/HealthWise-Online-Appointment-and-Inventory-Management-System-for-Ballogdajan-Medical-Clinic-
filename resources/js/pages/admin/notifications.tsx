import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Bell, Calendar, XCircle, AlertTriangle, Package, Activity, Check, Trash2, Mail } from 'lucide-react';

type Notification = {
    id: number;
    type: string;
    title: string;
    message: string;
    icon: string;
    read: boolean;
    created_at: string;
    user?: { id: number; name: string; email: string } | null;
};

const iconMap: Record<string, typeof Bell> = {
    bell: Bell,
    calendar: Calendar,
    'x-circle': XCircle,
    'alert-triangle': AlertTriangle,
    package: Package,
    activity: Activity,
};

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [sendingId, setSendingId] = useState<number | null>(null);
    const [sentIds, setSentIds] = useState<Set<number>>(new Set());

    useEffect(() => { fetchNotifications(); }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await fetch('/notifications/data');
            const data = await res.json();
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        await fetch(`/notifications/${id}/read`, {
            method: 'PATCH',
            headers: { 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '' },
        });
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const markAllRead = async () => {
        await fetch('/notifications/read-all', {
            method: 'PATCH',
            headers: { 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '' },
        });
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const sendEmail = async (id: number, manualEmail?: string) => {
        setSendingId(id);
        try {
            const body: Record<string, string> = {};
            if (manualEmail) body.email = manualEmail;

            const res = await fetch(`/notifications/${id}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                setSentIds((prev) => new Set([...prev, id]));
                alert(data.message);
            } else {
                alert(data.message || 'Failed to send email.');
            }
        } catch {
            alert('Failed to send email.');
        } finally {
            setSendingId(null);
        }
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

    const typeBadge = (type: string) => {
        switch (type) {
            case 'appointment_created': return 'bg-blue-100 text-blue-700';
            case 'appointment_cancelled': return 'bg-red-100 text-red-700';
            case 'inventory_low': return 'bg-amber-100 text-amber-700';
            case 'inventory_adjusted': return 'bg-purple-100 text-purple-700';
            case 'queue_update': return 'bg-green-100 text-green-700';
            default: return 'bg-neutral-100 text-neutral-600';
        }
    };

    const typeLabel = (type: string) => {
        switch (type) {
            case 'appointment_created': return 'Appointment';
            case 'appointment_cancelled': return 'Cancelled';
            case 'inventory_low': return 'Low Stock';
            case 'inventory_adjusted': return 'Inventory';
            case 'queue_update': return 'Queue';
            default: return 'System';
        }
    };

    const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

    return (
        <>
            <Head title="Notifications" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <Bell className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Notifications</h1>
                            <p className="text-xs text-neutral-400">{unreadCount} unread · {notifications.length} total</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-xs font-semibold ${filter === 'all' ? 'bg-[#0787f7] text-white' : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300'} rounded-l-lg`}>All</button>
                            <button onClick={() => setFilter('unread')} className={`px-3 py-1.5 text-xs font-semibold ${filter === 'unread' ? 'bg-[#0787f7] text-white' : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300'} rounded-r-lg`}>Unread</button>
                        </div>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
                                <Check className="h-3.5 w-3.5" /> Mark All Read
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0787f7] border-t-transparent" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-12 text-center">
                            <Bell className="mx-auto mb-2 h-10 w-10 text-neutral-300" />
                            <p className="text-sm font-medium text-neutral-400">{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                                    <tr>
                                        <th className="w-8 px-3 py-2.5"></th>
                                        <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Type</th>
                                        <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Title</th>
                                        <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Message</th>
                                        <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Patient</th>
                                        <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Date</th>
                                        <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Status</th>
                                        <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                    {filtered.map((notif) => {
                                        const Icon = iconMap[notif.icon] || Bell;
                                        return (
                                            <tr key={notif.id} className={`transition-colors ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/5' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}>
                                                <td className="px-3 py-2.5">
                                                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${typeColor(notif.type)}`}>
                                                        <Icon className="h-3.5 w-3.5" />
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2.5">
                                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeBadge(notif.type)}`}>{typeLabel(notif.type)}</span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2.5 font-medium text-neutral-900 dark:text-neutral-100">
                                                    <div className="flex items-center gap-1.5">
                                                        {notif.title}
                                                        {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-[#0787f7]" />}
                                                    </div>
                                                </td>
                                                <td className="max-w-[250px] truncate px-3 py-2.5 text-neutral-600 dark:text-neutral-400">{notif.message}</td>
                                                <td className="whitespace-nowrap px-3 py-2.5">
                                                    {notif.user ? (
                                                        <div>
                                                            <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">{notif.user.name}</p>
                                                            <p className="text-[10px] text-neutral-400">{notif.user.email}</p>
                                                        </div>
                                                    ) : <span className="text-neutral-400">—</span>}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2.5 text-neutral-500">
                                                    {format(new Date(notif.created_at), 'MMM d, yyyy h:mm a')}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2.5">
                                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${notif.read ? 'bg-neutral-100 text-neutral-500' : 'bg-blue-100 text-blue-700'}`}>
                                                        {notif.read ? 'Read' : 'Unread'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2.5">
                                                    <div className="flex items-center gap-1">
                                                        {!notif.read && (
                                                            <button onClick={() => markAsRead(notif.id)} className="rounded p-1 text-neutral-400 hover:bg-green-50 hover:text-green-600" title="Mark as read">
                                                                <Check className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                if (notif.user?.email) {
                                                                    sendEmail(notif.id);
                                                                } else {
                                                                    const email = prompt('Enter patient email to send notification:');
                                                                    if (email) sendEmail(notif.id, email);
                                                                }
                                                            }}
                                                            disabled={sendingId === notif.id || sentIds.has(notif.id)}
                                                            className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold transition-colors ${
                                                                sentIds.has(notif.id)
                                                                    ? 'bg-green-50 text-green-600'
                                                                    : 'bg-[#0787f7]/10 text-[#0787f7] hover:bg-[#0787f7]/20'
                                                            } disabled:opacity-50`}
                                                            title={notif.user?.email ? `Send to ${notif.user.email}` : 'Send email'}
                                                        >
                                                            <Mail className="h-3 w-3" />
                                                            {sendingId === notif.id ? 'Sending...' : sentIds.has(notif.id) ? 'Sent ✓' : 'Send Email'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
