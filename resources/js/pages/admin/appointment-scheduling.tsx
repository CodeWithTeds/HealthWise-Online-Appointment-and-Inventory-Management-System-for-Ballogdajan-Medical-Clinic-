import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Calendar as CalendarIcon,
    Plus,
    Pencil,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday } from 'date-fns';
import { FlashAlert } from '@/components/flash-alert';

type Schedule = {
    id: number;
    date: string;
    am_start: string;
    am_end: string;
    am_slots: number;
    am_booked: number;
    pm_start: string;
    pm_end: string;
    pm_slots: number;
    pm_booked: number;
    status: string;
    notes: string | null;
};

type PaginatedSchedules = {
    data: Schedule[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    schedules: PaginatedSchedules;
    calendarData: Schedule[];
    filters: { date_from?: string; date_to?: string; status?: string };
};

function getRolePrefix(): string {
    const path = window.location.pathname;
    if (path.startsWith('/doctor')) return '/doctor';
    return '/secretary';
}

export default function AppointmentScheduling({ schedules, calendarData, filters }: Props) {
    const params = new URLSearchParams(window.location.search);
    const initialView = params.get('view') || 'calendar';
    const [view, setView] = useState<'calendar' | 'schedules'>(initialView as 'calendar' | 'schedules');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

    const prefix = getRolePrefix();
    const isReadOnly = false; // scheduling is editable by both doctor and secretary

    const navigateMonth = (newMonth: Date) => {
        setCurrentMonth(newMonth);
        router.get(`${prefix}/appointment-scheduling`, {
            view: 'calendar',
            year: newMonth.getFullYear(),
            month: newMonth.getMonth() + 1,
        }, { preserveState: true, preserveScroll: true, only: ['calendarData'] });
    };
    const [filterDateFrom, setFilterDateFrom] = useState(filters.date_from || '');
    const [filterDateTo, setFilterDateTo] = useState(filters.date_to || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');

    const createForm = useForm({
        date_from: '',
        date_to: '',
        am_start: '08:00',
        am_end: '12:00',
        am_slots: '20',
        pm_start: '13:00',
        pm_end: '17:00',
        pm_slots: '20',
        notes: '',
    });

    const editForm = useForm({
        am_start: '',
        am_end: '',
        am_slots: '',
        pm_start: '',
        pm_end: '',
        pm_slots: '',
        status: '',
        notes: '',
    });

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = getDay(monthStart);

    const getScheduleForDate = (date: Date): Schedule | undefined => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return calendarData.find((s) => s.date.slice(0, 10) === dateStr);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(`${prefix}/appointment-scheduling`, {
            onSuccess: () => { setShowCreateModal(false); createForm.reset(); },
            preserveScroll: true,
        });
    };

    const openEdit = (schedule: Schedule) => {
        setEditingSchedule(schedule);
        editForm.setData({
            am_start: schedule.am_start.slice(0, 5),
            am_end: schedule.am_end.slice(0, 5),
            am_slots: String(schedule.am_slots),
            pm_start: schedule.pm_start.slice(0, 5),
            pm_end: schedule.pm_end.slice(0, 5),
            pm_slots: String(schedule.pm_slots),
            status: schedule.status,
            notes: schedule.notes || '',
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSchedule) return;
        editForm.put(`${prefix}/appointment-scheduling/${editingSchedule.id}`, {
            onSuccess: () => setEditingSchedule(null),
            preserveScroll: true,
        });
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-50 text-green-700';
            case 'full': return 'bg-red-50 text-red-700';
            case 'closed': return 'bg-neutral-100 text-neutral-500';
            default: return 'bg-neutral-50 text-neutral-600';
        }
    };

    const inputCls = 'h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100';

    return (
        <>
            <Head title="Appointment Scheduling" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                {/* Flash Alert */}
                <FlashAlert />

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <CalendarIcon className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Appointment Scheduling</h1>
                            <p className="text-xs text-neutral-400">AM/PM slots · First come, first served</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <button onClick={() => setView('calendar')} className={`px-3 py-1.5 text-xs font-semibold transition-colors ${view === 'calendar' ? 'bg-[#0787f7] text-white' : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300'} rounded-l-lg`}>Calendar</button>
                            <button onClick={() => setView('schedules')} className={`px-3 py-1.5 text-xs font-semibold transition-colors ${view === 'schedules' ? 'bg-[#0787f7] text-white' : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300'} rounded-r-lg`}>Schedules</button>
                        </div>
                        {!isReadOnly && (
                            <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#0787f7] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0670d4]">
                                <Plus className="h-3.5 w-3.5" />
                                Create Weekly
                            </button>
                        )}
                    </div>
                </div>

                {/* Calendar View */}
                {view === 'calendar' && (
                    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3 dark:border-neutral-700">
                            <button onClick={() => navigateMonth(subMonths(currentMonth, 1))} className="rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <ChevronLeft className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                            </button>
                            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{format(currentMonth, 'MMMM yyyy')}</h2>
                            <button onClick={() => navigateMonth(addMonths(currentMonth, 1))} className="rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <ChevronRight className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                                <div key={d} className="border-b border-r border-neutral-100 px-2 py-2 text-center text-[10px] font-semibold text-neutral-400 dark:border-neutral-700">{d}</div>
                            ))}
                            {Array.from({ length: startDay }).map((_, i) => (
                                <div key={`e-${i}`} className="min-h-[90px] border-b border-r border-neutral-100 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/30" />
                            ))}
                            {days.map((day) => {
                                const schedule = getScheduleForDate(day);
                                return (
                                    <div key={day.toISOString()} className={`min-h-[90px] border-b border-r border-neutral-100 p-1.5 dark:border-neutral-700 ${isToday(day) ? 'bg-[#0787f7]/5' : ''}`}>
                                        <p className={`text-[11px] font-medium ${isToday(day) ? 'font-bold text-[#0787f7]' : 'text-neutral-500'}`}>{format(day, 'd')}</p>
                                        {schedule && (
                                            <div className={`mt-1 space-y-0.5 ${!isReadOnly ? 'cursor-pointer' : ''}`} onClick={() => !isReadOnly && openEdit(schedule)}>
                                                <div className="rounded bg-blue-50 px-1 py-0.5">
                                                    <p className="text-[8px] font-bold text-blue-700">AM {schedule.am_booked}/{schedule.am_slots}</p>
                                                </div>
                                                <div className="rounded bg-orange-50 px-1 py-0.5">
                                                    <p className="text-[8px] font-bold text-orange-700">PM {schedule.pm_booked}/{schedule.pm_slots}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Schedules Table */}
                {view === 'schedules' && (
                    <>
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
                            <div className="flex items-center gap-1.5">
                                <label className="text-[10px] font-semibold text-neutral-500">From</label>
                                <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <label className="text-[10px] font-semibold text-neutral-500">To</label>
                                <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                            </div>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="full">Full</option>
                                <option value="closed">Closed</option>
                            </select>
                            <button onClick={() => router.get(`${prefix}/appointment-scheduling`, { view: 'schedules', date_from: filterDateFrom, date_to: filterDateTo, status: filterStatus }, { preserveState: true })} className="h-8 rounded-lg bg-[#0787f7] px-3 text-xs font-semibold text-white hover:bg-[#0670d4]">Filter</button>
                            <button onClick={() => { setFilterDateFrom(''); setFilterDateTo(''); setFilterStatus(''); router.get(`${prefix}/appointment-scheduling`, { view: 'schedules' }, { preserveState: true }); }} className="h-8 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400">Clear</button>
                        </div>
                    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                                    <tr>
                                        <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">Date</th>
                                        <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">AM Time</th>
                                        <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">AM Slots</th>
                                        <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">AM Booked</th>
                                        <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">PM Time</th>
                                        <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">PM Slots</th>
                                        <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">PM Booked</th>
                                        <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">Status</th>
                                        <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">Notes</th>
                                        <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                    {schedules.data.map((s) => (
                                        <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                            <td className="whitespace-nowrap px-3 py-2 font-medium text-neutral-900 dark:text-neutral-100">{format(new Date(s.date.slice(0, 10) + 'T00:00:00'), 'MMM d, yyyy')}</td>
                                            <td className="whitespace-nowrap px-3 py-2 text-neutral-600 dark:text-neutral-300">{s.am_start.slice(0, 5)}–{s.am_end.slice(0, 5)}</td>
                                            <td className="whitespace-nowrap px-3 py-2 text-neutral-600 dark:text-neutral-300">{s.am_slots}</td>
                                            <td className="whitespace-nowrap px-3 py-2 text-neutral-600 dark:text-neutral-300">{s.am_booked}</td>
                                            <td className="whitespace-nowrap px-3 py-2 text-neutral-600 dark:text-neutral-300">{s.pm_start.slice(0, 5)}–{s.pm_end.slice(0, 5)}</td>
                                            <td className="whitespace-nowrap px-3 py-2 text-neutral-600 dark:text-neutral-300">{s.pm_slots}</td>
                                            <td className="whitespace-nowrap px-3 py-2 text-neutral-600 dark:text-neutral-300">{s.pm_booked}</td>
                                            <td className="whitespace-nowrap px-3 py-2">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusColor(s.status)}`}>{s.status}</span>
                                            </td>
                                            <td className="max-w-[120px] truncate px-3 py-2 text-neutral-500">{s.notes || '—'}</td>
                                            <td className="px-3 py-2">
                                                {!isReadOnly && (
                                                    <button onClick={() => openEdit(s)} className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-[#0787f7] dark:hover:bg-neutral-700"><Pencil className="h-3.5 w-3.5" /></button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {schedules.data.length === 0 && (
                                        <tr><td colSpan={10} className="px-3 py-8 text-center text-neutral-400">No schedules yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {schedules.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 dark:border-neutral-700">
                                <p className="text-xs text-neutral-400">Page {schedules.current_page} of {schedules.last_page}</p>
                                <div className="flex gap-1">
                                    {schedules.links.map((link, i) => (
                                        <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} className={`rounded-md px-3 py-1 text-xs font-medium ${link.active ? 'bg-[#0787f7] text-white' : 'text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 dark:text-neutral-300'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    </>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Create Weekly Schedule</h2>
                            <button onClick={() => setShowCreateModal(false)} className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="h-5 w-5 text-neutral-400" /></button>
                        </div>
                        <p className="mb-4 text-xs text-neutral-400">Set AM & PM schedule once — applies to all days in the range.</p>
                        <form onSubmit={handleCreate} className="grid gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Date From *</label>
                                    <input type="date" value={createForm.data.date_from} onChange={(e) => createForm.setData('date_from', e.target.value)} className={inputCls} required />
                                    {createForm.errors.date_from && <p className="mt-1 text-xs text-red-500">{createForm.errors.date_from}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Date To *</label>
                                    <input type="date" value={createForm.data.date_to} onChange={(e) => createForm.setData('date_to', e.target.value)} className={inputCls} required />
                                    {createForm.errors.date_to && <p className="mt-1 text-xs text-red-500">{createForm.errors.date_to}</p>}
                                </div>
                            </div>

                            {/* AM Section */}
                            <div className="rounded-lg border border-blue-100 bg-blue-50/30 p-3 dark:border-blue-900 dark:bg-blue-900/10">
                                <p className="mb-2 text-xs font-bold text-blue-700 dark:text-blue-400">AM Schedule (8:00 AM – 12:00 PM)</p>
                                <div>
                                    <label className="mb-1 block text-[10px] font-semibold text-neutral-500">Slots</label>
                                    <input type="number" min="1" max="100" value={createForm.data.am_slots} onChange={(e) => createForm.setData('am_slots', e.target.value)} className={inputCls} required />
                                </div>
                            </div>

                            {/* PM Section */}
                            <div className="rounded-lg border border-orange-100 bg-orange-50/30 p-3 dark:border-orange-900 dark:bg-orange-900/10">
                                <p className="mb-2 text-xs font-bold text-orange-700 dark:text-orange-400">PM Schedule (1:00 PM – 5:00 PM)</p>
                                <div>
                                    <label className="mb-1 block text-[10px] font-semibold text-neutral-500">Slots</label>
                                    <input type="number" min="1" max="100" value={createForm.data.pm_slots} onChange={(e) => createForm.setData('pm_slots', e.target.value)} className={inputCls} required />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Notes</label>
                                <textarea value={createForm.data.notes} onChange={(e) => createForm.setData('notes', e.target.value)} rows={2} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Optional notes..." />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300">Cancel</button>
                                <button type="submit" disabled={createForm.processing} className="rounded-lg bg-[#0787f7] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0670d4] disabled:opacity-50">{createForm.processing ? 'Saving...' : 'Create Schedule'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingSchedule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Edit — {format(new Date(editingSchedule.date.slice(0, 10) + 'T00:00:00'), 'MMM d, yyyy')}</h2>
                            <button onClick={() => setEditingSchedule(null)} className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="h-5 w-5 text-neutral-400" /></button>
                        </div>
                        <form onSubmit={handleEdit} className="grid gap-4">
                            <div className="rounded-lg border border-blue-100 bg-blue-50/30 p-3 dark:border-blue-900 dark:bg-blue-900/10">
                                <p className="mb-2 text-xs font-bold text-blue-700 dark:text-blue-400">AM Schedule (Booked: {editingSchedule.am_booked})</p>
                                <div>
                                    <label className="mb-1 block text-[10px] font-semibold text-neutral-500">Slots</label>
                                    <input type="number" min="1" value={editForm.data.am_slots} onChange={(e) => editForm.setData('am_slots', e.target.value)} className={inputCls} required />
                                </div>
                            </div>
                            <div className="rounded-lg border border-orange-100 bg-orange-50/30 p-3 dark:border-orange-900 dark:bg-orange-900/10">
                                <p className="mb-2 text-xs font-bold text-orange-700 dark:text-orange-400">PM Schedule (Booked: {editingSchedule.pm_booked})</p>
                                <div>
                                    <label className="mb-1 block text-[10px] font-semibold text-neutral-500">Slots</label>
                                    <input type="number" min="1" value={editForm.data.pm_slots} onChange={(e) => editForm.setData('pm_slots', e.target.value)} className={inputCls} required />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Status</label>
                                    <select value={editForm.data.status} onChange={(e) => editForm.setData('status', e.target.value)} className={inputCls} required>
                                        <option value="available">Available</option>
                                        <option value="full">Full</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Notes</label>
                                    <input type="text" value={editForm.data.notes} onChange={(e) => editForm.setData('notes', e.target.value)} className={inputCls} placeholder="Optional" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setEditingSchedule(null)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300">Cancel</button>
                                <button type="submit" disabled={editForm.processing} className="rounded-lg bg-[#0787f7] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0670d4] disabled:opacity-50">{editForm.processing ? 'Saving...' : 'Update'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
