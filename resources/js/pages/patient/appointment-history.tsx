import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import {
    ClipboardList,
    Calendar,
    Clock,
    Sun,
    Moon,
    Search,
    ChevronDown,
    ChevronUp,
    X,
} from 'lucide-react';
import { FlashAlert } from '@/components/flash-alert';

type Appointment = {
    id: number;
    date: string;
    session: string;
    reason: string;
    symptoms: string | null;
    contact_number: string | null;
    allergies: string | null;
    current_medication: string | null;
    medical_history: string | null;
    temperature: string | null;
    blood_pressure: string | null;
    weight: string | null;
    priority_type: string;
    status: string;
    queue_number: number | null;
    notes: string | null;
    created_at: string;
};

type PaginatedAppointments = {
    data: Appointment[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    appointments: PaginatedAppointments;
    filters: { status?: string; date_from?: string; date_to?: string };
};

export default function AppointmentHistory({ appointments, filters }: Props) {
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [filterDateFrom, setFilterDateFrom] = useState(filters.date_from || '');
    const [filterDateTo, setFilterDateTo] = useState(filters.date_to || '');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleFilter = () => {
        router.get('/patient/appointment-history', {
            status: filterStatus,
            date_from: filterDateFrom,
            date_to: filterDateTo,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setFilterStatus('');
        setFilterDateFrom('');
        setFilterDateTo('');
        router.get('/patient/appointment-history', {}, { preserveState: true });
    };

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
            confirmed: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
            completed: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
            cancelled: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
            no_show: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
            not_arrived: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
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
            <Head title="Appointment History" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                <FlashAlert />

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <ClipboardList className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Appointment History</h1>
                            <p className="text-xs text-neutral-400">{appointments.total} total appointments</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex items-center gap-1.5">
                        <label className="text-[10px] font-semibold text-neutral-500">From</label>
                        <input
                            type="date"
                            value={filterDateFrom}
                            onChange={(e) => setFilterDateFrom(e.target.value)}
                            className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <label className="text-[10px] font-semibold text-neutral-500">To</label>
                        <input
                            type="date"
                            value={filterDateTo}
                            onChange={(e) => setFilterDateTo(e.target.value)}
                            className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no_show">No Show</option>
                    </select>
                    <button
                        onClick={handleFilter}
                        className="h-8 rounded-lg bg-[#0787f7] px-3 text-xs font-semibold text-white hover:bg-[#0670d4]"
                    >
                        Filter
                    </button>
                    <button
                        onClick={clearFilters}
                        className="h-8 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400"
                    >
                        Clear
                    </button>
                </div>

                {/* Appointments List */}
                <div className="space-y-3">
                    {appointments.data.length === 0 ? (
                        <div className="rounded-xl border border-neutral-200 bg-white py-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
                            <ClipboardList className="mx-auto mb-3 h-10 w-10 text-neutral-300 dark:text-neutral-600" />
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No appointments found</p>
                            <p className="mt-1 text-xs text-neutral-400">Your appointment history will appear here.</p>
                        </div>
                    ) : (
                        appointments.data.map((apt) => (
                            <div
                                key={apt.id}
                                className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                            >
                                {/* Main Row */}
                                <div
                                    className="flex cursor-pointer items-center gap-4 px-5 py-4"
                                    onClick={() => setExpandedId(expandedId === apt.id ? null : apt.id)}
                                >
                                    {/* Session Icon */}
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${apt.session === 'AM' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-indigo-50 dark:bg-indigo-900/20'}`}>
                                        {apt.session === 'AM' ? (
                                            <Sun className="h-5 w-5 text-amber-500" />
                                        ) : (
                                            <Moon className="h-5 w-5 text-indigo-500" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                {format(new Date(apt.date), 'MMMM d, yyyy')}
                                            </p>
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusBadge(apt.status)}`}>
                                                {apt.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="mt-0.5 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {apt.session === 'AM' ? '8:00 AM – 12:00 PM' : '1:00 PM – 5:00 PM'}
                                            </span>
                                            {apt.queue_number && (
                                                <span>Queue #{apt.queue_number}</span>
                                            )}
                                            <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-semibold capitalize ${priorityBadge(apt.priority_type)}`}>
                                                {apt.priority_type}
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-xs text-neutral-400">{apt.reason}</p>
                                    </div>

                                    {/* Expand Icon */}
                                    <div className="shrink-0">
                                        {expandedId === apt.id ? (
                                            <ChevronUp className="h-4 w-4 text-neutral-400" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-neutral-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedId === apt.id && (
                                    <div className="border-t border-neutral-100 bg-neutral-50/50 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-800/30">
                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            <DetailItem label="Reason" value={apt.reason} />
                                            <DetailItem label="Symptoms" value={apt.symptoms} />
                                            <DetailItem label="Contact Number" value={apt.contact_number} />
                                            <DetailItem label="Allergies" value={apt.allergies} />
                                            <DetailItem label="Current Medication" value={apt.current_medication} />
                                            <DetailItem label="Medical History" value={apt.medical_history} />
                                            <DetailItem label="Temperature" value={apt.temperature ? `${apt.temperature}°C` : null} />
                                            <DetailItem label="Blood Pressure" value={apt.blood_pressure} />
                                            <DetailItem label="Weight" value={apt.weight ? `${apt.weight} kg` : null} />
                                            <DetailItem label="Notes" value={apt.notes} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {appointments.last_page > 1 && (
                    <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900">
                        <p className="text-xs text-neutral-400">
                            Page {appointments.current_page} of {appointments.last_page}
                        </p>
                        <div className="flex gap-1">
                            {appointments.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                        link.active
                                            ? 'bg-[#0787f7] text-white'
                                            : 'text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-neutral-800'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function DetailItem({ label, value }: { label: string; value: string | null }) {
    if (!value) return null;
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{label}</p>
            <p className="mt-0.5 text-xs text-neutral-700 dark:text-neutral-300">{value}</p>
        </div>
    );
}
