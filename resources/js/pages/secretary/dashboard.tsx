import { Head, Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    Users,
    ClipboardList,
    Sun,
    Moon,
} from 'lucide-react';
import type { User } from '@/types/auth';

type Stats = {
    appointments_today: number;
    pending_today: number;
    total_patients: number;
    available_schedules: number;
};

type TodayAppointment = {
    id: number;
    date: string;
    session: string;
    reason: string;
    status: string;
    queue_number: number | null;
    priority_type: string;
    user: { id: number; name: string; phone: string | null };
};

type Props = {
    stats: Stats;
    todayAppointments: TodayAppointment[];
};

export default function SecretaryDashboard({ stats, todayAppointments }: Props) {
    const { auth } = usePage().props;
    const user = auth.user as User;

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-amber-50 text-amber-700',
            confirmed: 'bg-blue-50 text-blue-700',
            completed: 'bg-green-50 text-green-700',
            cancelled: 'bg-red-50 text-red-700',
            no_show: 'bg-neutral-100 text-neutral-600',
            not_arrived: 'bg-orange-50 text-orange-700',
        };
        return styles[status] || 'bg-neutral-50 text-neutral-600';
    };

    const priorityBadge = (type: string) => {
        const styles: Record<string, string> = {
            senior: 'bg-purple-50 text-purple-700',
            pwd: 'bg-indigo-50 text-indigo-700',
            pregnant: 'bg-pink-50 text-pink-700',
            regular: 'bg-neutral-50 text-neutral-600',
        };
        return styles[type] || 'bg-neutral-50 text-neutral-600';
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Welcome */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 sm:p-8">
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
                    <div className="relative">
                        <p className="text-sm font-medium text-white/70">Welcome back,</p>
                        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{user.name}</h1>
                        <p className="mt-2 max-w-md text-sm text-white/60">
                            Manage schedules, appointments, and patient records.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <Calendar className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.appointments_today}</p>
                            <p className="text-xs text-neutral-400">Appointments Today</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/10">
                            <Clock className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.pending_today}</p>
                            <p className="text-xs text-neutral-400">Pending Today</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
                            <Users className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.total_patients}</p>
                            <p className="text-xs text-neutral-400">Total Patients</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/10">
                            <ClipboardList className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.available_schedules}</p>
                            <p className="text-xs text-neutral-400">Available Schedules</p>
                        </div>
                    </div>
                </div>

                {/* Today's Appointments */}
                <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3 dark:border-neutral-700">
                        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Today's Appointments</h2>
                        <Link href="/secretary/appointment-management" className="text-xs font-medium text-[#0787f7] hover:underline">
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
                        {todayAppointments.length === 0 ? (
                            <div className="py-8 text-center">
                                <Calendar className="mx-auto mb-2 h-8 w-8 text-neutral-300 dark:text-neutral-600" />
                                <p className="text-sm text-neutral-400">No appointments today</p>
                            </div>
                        ) : (
                            todayAppointments.map((apt) => (
                                <div key={apt.id} className="flex items-center gap-3 px-5 py-3">
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${apt.session === 'AM' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-indigo-50 dark:bg-indigo-900/20'}`}>
                                        {apt.session === 'AM' ? (
                                            <Sun className="h-4 w-4 text-amber-500" />
                                        ) : (
                                            <Moon className="h-4 w-4 text-indigo-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">{apt.user.name}</p>
                                            {apt.queue_number && (
                                                <span className="text-[10px] text-neutral-400">#{apt.queue_number}</span>
                                            )}
                                        </div>
                                        <p className="truncate text-[10px] text-neutral-400">{apt.reason}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {apt.priority_type !== 'regular' && (
                                            <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-semibold capitalize ${priorityBadge(apt.priority_type)}`}>
                                                {apt.priority_type}
                                            </span>
                                        )}
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize ${statusBadge(apt.status)}`}>
                                            {apt.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-3 sm:grid-cols-3">
                    <Link
                        href="/secretary/appointment-scheduling"
                        className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-purple-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <Calendar className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Scheduling</p>
                            <p className="text-[10px] text-neutral-400">Manage schedules</p>
                        </div>
                    </Link>
                    <Link
                        href="/secretary/appointment-management"
                        className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-purple-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <ClipboardList className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Appointments</p>
                            <p className="text-[10px] text-neutral-400">View & manage queue</p>
                        </div>
                    </Link>
                    <Link
                        href="/secretary/patient-records"
                        className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-purple-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                            <Users className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Patient Records</p>
                            <p className="text-[10px] text-neutral-400">View patient history</p>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}
