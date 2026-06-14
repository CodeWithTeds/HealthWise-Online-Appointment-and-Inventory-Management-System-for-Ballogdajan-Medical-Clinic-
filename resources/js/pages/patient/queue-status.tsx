import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Users,
    Clock,
    Sun,
    Moon,
    RefreshCw,
    Hash,
    AlertCircle,
    Calendar,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { FlashAlert } from '@/components/flash-alert';

type MyAppointment = {
    id: number;
    date: string;
    session: string;
    queue_number: number | null;
    priority_type: string;
    status: string;
    reason: string;
};

type QueueItem = {
    id: number;
    name: string;
    queue_number: number | null;
    priority_type: string;
    status: string;
    is_me: boolean;
};

type Props = {
    myAppointment: MyAppointment | null;
    queue: QueueItem[];
    position: number | null;
    totalInQueue: number;
};

export default function QueueStatus({ myAppointment, queue, position, totalInQueue }: Props) {
    const { t } = useLanguage();

    const refresh = () => {
        router.reload();
    };

    const priorityBadge = (type: string) => {
        const styles: Record<string, string> = {
            senior: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
            pwd: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
            pregnant: 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
            regular: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
        };
        return styles[type] || 'bg-neutral-100 text-neutral-600';
    };

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-amber-50 text-amber-700',
            confirmed: 'bg-blue-50 text-blue-700',
            not_arrived: 'bg-orange-50 text-orange-700',
        };
        return styles[status] || 'bg-neutral-50 text-neutral-600';
    };

    return (
        <>
            <Head title={t('queue_status_title')} />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                <FlashAlert />

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <Users className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{t('queue_status_title')}</h1>
                            <p className="text-xs text-neutral-400">{t('queue_subtitle')}</p>
                        </div>
                    </div>
                    <button
                        onClick={refresh}
                        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        {t('refresh')}
                    </button>
                </div>

                {/* No Appointment */}
                {!myAppointment && (
                    <div className="rounded-xl border border-neutral-200 bg-white py-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
                        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-neutral-300 dark:text-neutral-600" />
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{t('no_upcoming_appointment')}</p>
                        <p className="mt-1 text-xs text-neutral-400">{t('no_pending_appointments')}</p>
                    </div>
                )}

                {/* My Position Card */}
                {myAppointment && position && (
                    <div className="rounded-2xl border border-[#0787f7]/20 bg-gradient-to-br from-[#0787f7]/5 to-white p-6 dark:from-[#0787f7]/10 dark:to-neutral-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#0787f7]">{t('your_position')}</p>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-neutral-900 dark:text-neutral-100">{position}</span>
                                    <span className="text-lg text-neutral-400">/ {totalInQueue}</span>
                                </div>
                                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                    {position === 1 ? t('youre_next') : `${position - 1} ${t('patients_ahead')}`}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 dark:bg-neutral-800">
                                    <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                                        {format(new Date(myAppointment.date), 'MMM d, yyyy')}
                                    </span>
                                </div>
                                <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${myAppointment.session === 'AM' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-indigo-50 dark:bg-indigo-900/20'}`}>
                                    {myAppointment.session === 'AM' ? (
                                        <Sun className="h-4 w-4 text-amber-500" />
                                    ) : (
                                        <Moon className="h-4 w-4 text-indigo-500" />
                                    )}
                                    <span className={`text-xs font-bold ${myAppointment.session === 'AM' ? 'text-amber-700 dark:text-amber-400' : 'text-indigo-700 dark:text-indigo-400'}`}>
                                        {myAppointment.session === 'AM' ? t('am_session') : t('pm_session')}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-neutral-400">
                                    Queue #{myAppointment.queue_number}
                                </p>
                                <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${priorityBadge(myAppointment.priority_type)}`}>
                                    {myAppointment.priority_type}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Queue List */}
                {myAppointment && queue.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="border-b border-neutral-100 px-5 py-3 dark:border-neutral-700">
                            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                Queue — {format(new Date(myAppointment.date), 'MMMM d, yyyy')} · {myAppointment.session} Session
                            </h2>
                            <p className="text-[10px] text-neutral-400">{totalInQueue} {t('patients_in_queue')}</p>
                        </div>
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
                            {queue.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center gap-4 px-5 py-3 ${item.is_me ? 'bg-[#0787f7]/5 dark:bg-[#0787f7]/10' : ''}`}
                                >
                                    {/* Position */}
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.is_me ? 'bg-[#0787f7] text-white' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'}`}>
                                        {index + 1}
                                    </div>

                                    {/* Name */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${item.is_me ? 'font-bold text-[#0787f7]' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                            {item.is_me ? `${item.name} (${t('you')})` : item.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                                                <Hash className="h-2.5 w-2.5" />{item.queue_number}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex items-center gap-1.5">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize ${priorityBadge(item.priority_type)}`}>
                                            {item.priority_type}
                                        </span>
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize ${statusBadge(item.status)}`}>
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
