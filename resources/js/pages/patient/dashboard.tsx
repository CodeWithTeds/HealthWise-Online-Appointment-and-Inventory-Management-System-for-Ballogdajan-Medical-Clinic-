import { Head, Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Calendar,
    CheckCircle2,
    XCircle,
    MessageSquare,
    Sun,
    Moon,
    Clock,
    ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import type { User } from '@/types/auth';

type Stats = {
    upcoming: number;
    completed: number;
    cancelled: number;
    feedback_given: number;
};

type NextAppointment = {
    id: number;
    date: string;
    session: string;
    reason: string;
    status: string;
    queue_number: number | null;
    priority_type: string;
} | null;

type RecentAppointment = {
    id: number;
    date: string;
    session: string;
    reason: string;
    status: string;
    queue_number: number | null;
};

type Props = {
    stats: Stats;
    nextAppointment: NextAppointment;
    recentAppointments: RecentAppointment[];
};

export default function PatientDashboard({ stats, nextAppointment, recentAppointments }: Props) {
    const { auth } = usePage().props;
    const user = auth.user as User;
    const { t } = useLanguage();

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-amber-50 text-amber-700',
            confirmed: 'bg-blue-50 text-blue-700',
            completed: 'bg-green-50 text-green-700',
            cancelled: 'bg-red-50 text-red-700',
            no_show: 'bg-neutral-100 text-neutral-600',
        };
        return styles[status] || 'bg-neutral-50 text-neutral-600';
    };

    return (
        <>
            <Head title={t('dashboard')} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Welcome */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0787f7] to-[#0560c9] p-6 sm:p-8">
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
                    <div className="relative">
                        <p className="text-sm font-medium text-white/70">{t('welcome_back')}</p>
                        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{user.name}</h1>
                        <p className="mt-2 max-w-md text-sm text-white/60">
                            {t('dashboard_subtitle')}
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
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.upcoming}</p>
                            <p className="text-xs text-neutral-400">{t('upcoming')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-500/10">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.completed}</p>
                            <p className="text-xs text-neutral-400">{t('completed')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500/10">
                            <XCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.cancelled}</p>
                            <p className="text-xs text-neutral-400">{t('cancelled')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/10">
                            <MessageSquare className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.feedback_given}</p>
                            <p className="text-xs text-neutral-400">{t('feedback_given')}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Next Appointment */}
                    <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3 dark:border-neutral-700">
                            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{t('next_appointment')}</h2>
                            <Link href="/patient/queue-status" className="text-xs font-medium text-[#0787f7] hover:underline">
                                {t('queue_status')} →
                            </Link>
                        </div>
                        <div className="p-5">
                            {nextAppointment ? (
                                <div className="flex items-start gap-4">
                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${nextAppointment.session === 'AM' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-indigo-50 dark:bg-indigo-900/20'}`}>
                                        {nextAppointment.session === 'AM' ? (
                                            <Sun className="h-6 w-6 text-amber-500" />
                                        ) : (
                                            <Moon className="h-6 w-6 text-indigo-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                            {format(new Date(nextAppointment.date), 'EEEE, MMMM d, yyyy')}
                                        </p>
                                        <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {nextAppointment.session === 'AM' ? '8:00 AM – 12:00 PM' : '1:00 PM – 5:00 PM'}
                                            </span>
                                            {nextAppointment.queue_number && (
                                                <span>Queue #{nextAppointment.queue_number}</span>
                                            )}
                                        </div>
                                        <p className="mt-2 text-xs text-neutral-400">{nextAppointment.reason}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusBadge(nextAppointment.status)}`}>
                                                {nextAppointment.status}
                                            </span>
                                            {nextAppointment.priority_type !== 'regular' && (
                                                <span className="inline-flex rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold capitalize text-purple-700">
                                                    {nextAppointment.priority_type}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-6 text-center">
                                    <Calendar className="mx-auto mb-2 h-8 w-8 text-neutral-300 dark:text-neutral-600" />
                                    <p className="text-sm text-neutral-400">{t('no_upcoming_appointments')}</p>
                                    <Link href="/patient/book-appointment" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#0787f7] hover:underline">
                                        {t('book_one_now')} <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3 dark:border-neutral-700">
                            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{t('recent_appointments')}</h2>
                            <Link href="/patient/appointment-history" className="text-xs font-medium text-[#0787f7] hover:underline">
                                {t('view_all')}
                            </Link>
                        </div>
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
                            {recentAppointments.length === 0 ? (
                                <div className="py-8 text-center">
                                    <p className="text-xs text-neutral-400">{t('no_appointments_yet')}</p>
                                </div>
                            ) : (
                                recentAppointments.map((apt) => (
                                    <div key={apt.id} className="flex items-center gap-3 px-5 py-3">
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${apt.session === 'AM' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-indigo-50 dark:bg-indigo-900/20'}`}>
                                            {apt.session === 'AM' ? (
                                                <Sun className="h-4 w-4 text-amber-500" />
                                            ) : (
                                                <Moon className="h-4 w-4 text-indigo-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                                                {format(new Date(apt.date), 'MMM d, yyyy')}
                                            </p>
                                            <p className="truncate text-[10px] text-neutral-400">{apt.reason}</p>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize ${statusBadge(apt.status)}`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-3 sm:grid-cols-3">
                    <Link
                        href="/patient/book-appointment"
                        className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-[#0787f7]/30 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <Calendar className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{t('book_appointment')}</p>
                            <p className="text-[10px] text-neutral-400">{t('schedule_new_visit')}</p>
                        </div>
                    </Link>
                    <Link
                        href="/patient/queue-status"
                        className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-[#0787f7]/30 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{t('queue_status')}</p>
                            <p className="text-[10px] text-neutral-400">{t('check_your_position')}</p>
                        </div>
                    </Link>
                    <Link
                        href="/patient/feedback"
                        className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-[#0787f7]/30 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <MessageSquare className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{t('feedback')}</p>
                            <p className="text-[10px] text-neutral-400">{t('rate_your_visits')}</p>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}
