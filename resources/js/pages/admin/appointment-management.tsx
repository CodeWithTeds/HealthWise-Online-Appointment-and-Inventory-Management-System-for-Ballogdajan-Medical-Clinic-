import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ClipboardList, Users, Search } from 'lucide-react';

type AppointmentUser = { id: number; name: string; email: string; phone: string | null };

type Appointment = {
    id: number;
    date: string;
    session: string;
    reason: string;
    symptoms: string | null;
    priority_type: string;
    status: string;
    queue_number: number | null;
    notes: string | null;
    user: AppointmentUser;
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
    priorityQueue: Appointment[];
    filters: { search?: string; date?: string };
};

function getRolePrefix(): string {
    return window.location.pathname.startsWith('/doctor') ? '/doctor' : '/secretary';
}

export default function AppointmentManagement({ appointments, priorityQueue, filters }: Props) {
    const params = new URLSearchParams(window.location.search);
    const initialView = params.get('view') || 'list';
    const [view, setView] = useState<'list' | 'priority'>(initialView as 'list' | 'priority');
    const [search, setSearch] = useState(filters.search || '');
    const [queueDate, setQueueDate] = useState(filters.date || new Date().toISOString().split('T')[0]);
    const prefix = getRolePrefix();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(`${prefix}/appointment-management`, { search, view: 'list' }, { preserveState: true });
    };

    const handleDateFilter = (date: string) => {
        setQueueDate(date);
        router.get(`${prefix}/appointment-management`, { date, view: 'priority' }, { preserveState: true });
    };

    const updateStatus = (id: number, status: string) => {
        router.patch(`${prefix}/appointments/${id}/status`, { status }, { preserveScroll: true });
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700';
            case 'confirmed': return 'bg-green-50 text-green-700';
            case 'completed': return 'bg-blue-50 text-blue-700';
            case 'cancelled': return 'bg-red-50 text-red-700';
            case 'not_arrived': return 'bg-neutral-100 text-neutral-500';
            default: return 'bg-neutral-50 text-neutral-600';
        }
    };

    const priorityBadge = (type: string) => {
        switch (type) {
            case 'senior': return 'bg-purple-50 text-purple-700';
            case 'pwd': return 'bg-indigo-50 text-indigo-700';
            case 'pregnant': return 'bg-pink-50 text-pink-700';
            default: return 'bg-neutral-50 text-neutral-500';
        }
    };

    return (
        <>
            <Head title="Appointment Management" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <ClipboardList className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Appointments</h1>
                            <p className="text-xs text-neutral-400">{appointments.total} total</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <button onClick={() => setView('list')} className={`px-3 py-1.5 text-xs font-semibold ${view === 'list' ? 'bg-[#0787f7] text-white' : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300'} rounded-l-lg`}>List</button>
                            <button onClick={() => setView('priority')} className={`px-3 py-1.5 text-xs font-semibold ${view === 'priority' ? 'bg-[#0787f7] text-white' : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300'} rounded-r-lg`}>Priority Queue</button>
                        </div>
                    </div>
                </div>

                {/* List View */}
                {view === 'list' && (
                    <>
                        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <input type="text" placeholder="Search patient..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                        </form>
                        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                                        <tr>
                                            <th className="px-3 py-2 font-semibold text-neutral-600">Patient</th>
                                            <th className="px-3 py-2 font-semibold text-neutral-600">Date</th>
                                            <th className="px-3 py-2 font-semibold text-neutral-600">Session</th>
                                            <th className="px-3 py-2 font-semibold text-neutral-600">Reason</th>
                                            <th className="px-3 py-2 font-semibold text-neutral-600">Priority</th>
                                            <th className="px-3 py-2 font-semibold text-neutral-600">Queue #</th>
                                            <th className="px-3 py-2 font-semibold text-neutral-600">Status</th>
                                            <th className="px-3 py-2 font-semibold text-neutral-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                        {appointments.data.map((apt) => (
                                            <tr key={apt.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                                <td className="whitespace-nowrap px-3 py-2 font-medium text-neutral-900 dark:text-neutral-100">{apt.user.name}</td>
                                                <td className="whitespace-nowrap px-3 py-2 text-neutral-600">{apt.date}</td>
                                                <td className="px-3 py-2"><span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${apt.session === 'AM' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>{apt.session}</span></td>
                                                <td className="max-w-[120px] truncate px-3 py-2 text-neutral-600">{apt.reason}</td>
                                                <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${priorityBadge(apt.priority_type)}`}>{apt.priority_type}</span></td>
                                                <td className="px-3 py-2 text-neutral-600">{apt.queue_number || '—'}</td>
                                                <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusBadge(apt.status)}`}>{apt.status.replace('_', ' ')}</span></td>
                                                <td className="px-3 py-2">
                                                    <select className="rounded border border-neutral-200 px-2 py-1 text-[10px] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" value={apt.status} onChange={(e) => updateStatus(apt.id, e.target.value)}>
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="not_arrived">Not Arrived</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                        {appointments.data.length === 0 && <tr><td colSpan={8} className="px-3 py-8 text-center text-neutral-400">No appointments yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                            {appointments.last_page > 1 && (
                                <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3">
                                    <p className="text-xs text-neutral-400">Page {appointments.current_page} of {appointments.last_page}</p>
                                    <div className="flex gap-1">
                                        {appointments.links.map((link, i) => (
                                            <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} className={`rounded-md px-3 py-1 text-xs font-medium ${link.active ? 'bg-[#0787f7] text-white' : 'text-neutral-600 hover:bg-neutral-100 disabled:opacity-40'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Priority Queue View */}
                {view === 'priority' && (
                    <>
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Date:</label>
                            <input type="date" value={queueDate} onChange={(e) => handleDateFilter(e.target.value)} className="h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                        </div>
                        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                            <p className="mb-3 text-xs text-neutral-400">Priority: Senior → PWD → Pregnant → Regular. Patients marked "Not Arrived" are skipped.</p>
                            {priorityQueue.length === 0 ? (
                                <p className="py-8 text-center text-sm text-neutral-400">No appointments for this date.</p>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {[0, 1, 2, 3].map((col) => {
                                        const start = col * 10;
                                        const items = priorityQueue.slice(start, start + 10);
                                        if (items.length === 0) return null;
                                        return (
                                            <div key={col} className="space-y-2">
                                                {items.map((apt, idx) => (
                                                    <div key={apt.id} className={`flex items-center gap-2 rounded-lg border p-2.5 ${apt.status === 'not_arrived' ? 'border-neutral-200 bg-neutral-50 opacity-50' : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'}`}>
                                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0787f7]/10 text-[11px] font-bold text-[#0787f7]">
                                                            {start + idx + 1}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-xs font-medium text-neutral-900 dark:text-neutral-100">{apt.user.name}</p>
                                                            <p className="truncate text-[10px] text-neutral-400">{apt.session} · {apt.reason}</p>
                                                        </div>
                                                        <div className="flex shrink-0 items-center gap-1">
                                                            {apt.priority_type !== 'regular' && (
                                                                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold capitalize ${priorityBadge(apt.priority_type)}`}>{apt.priority_type}</span>
                                                            )}
                                                            <select className="w-[70px] rounded border border-neutral-200 px-1 py-0.5 text-[9px] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" value={apt.status} onChange={(e) => updateStatus(apt.id, e.target.value)}>
                                                                <option value="pending">Pending</option>
                                                                <option value="confirmed">Confirmed</option>
                                                                <option value="completed">Done</option>
                                                                <option value="not_arrived">Not Arrived</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
