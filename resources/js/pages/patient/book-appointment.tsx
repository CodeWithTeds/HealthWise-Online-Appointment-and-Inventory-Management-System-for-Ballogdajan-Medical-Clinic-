import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { format, isToday, isBefore, startOfToday } from 'date-fns';
import { Calendar, Clock, X, CheckCircle } from 'lucide-react';
import type { User } from '@/types/auth';

type Schedule = {
    id: number;
    date: string;
    am_slots: number;
    am_booked: number;
    pm_slots: number;
    pm_booked: number;
    status: string;
};

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
    created_at: string;
};

type Props = {
    availableSchedules: Schedule[];
    appointments: { data: Appointment[] };
};

export default function BookAppointment({ availableSchedules, appointments }: Props) {
    const { auth } = usePage().props;
    const user = auth.user as User;
    const [showBooking, setShowBooking] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [selectedSession, setSelectedSession] = useState<'AM' | 'PM' | null>(null);

    const form = useForm({
        schedule_id: '',
        date: '',
        session: '',
        reason: '',
        symptoms: '',
        priority_type: 'regular',
        notes: '',
    });

    const openBooking = (schedule: Schedule, session: 'AM' | 'PM') => {
        setSelectedSchedule(schedule);
        setSelectedSession(session);
        form.setData({
            schedule_id: String(schedule.id),
            date: schedule.date,
            session,
            reason: '',
            symptoms: '',
            priority_type: 'regular',
            notes: '',
        });
        setShowBooking(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/patient/book-appointment', {
            onSuccess: () => { setShowBooking(false); form.reset(); },
            preserveScroll: true,
        });
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

    const inputCls = 'h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100';

    return (
        <>
            <Head title="Book Appointment" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 sm:p-6">
                {/* Welcome Card */}
                <div className="rounded-2xl bg-gradient-to-r from-[#0787f7] to-[#0560c9] p-5 text-white sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm opacity-80">Hi, {user.name.split(' ')[0]}!</p>
                            <h1 className="mt-1 text-xl font-bold sm:text-2xl">Book an Appointment</h1>
                            <p className="mt-1 text-xs opacity-70 sm:text-sm">Select an available slot below. First come, first served.</p>
                        </div>
                        <img src="/images/logo.png" alt="" className="hidden h-16 w-16 rounded-xl bg-white/10 object-contain p-2 sm:block" />
                    </div>
                </div>

                {/* Available Schedules */}
                <div>
                    <h2 className="mb-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">Available Slots</h2>
                    {availableSchedules.length === 0 ? (
                        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
                            <Calendar className="mx-auto mb-2 h-8 w-8 text-neutral-300" />
                            <p className="text-sm text-neutral-400">No available schedules at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {availableSchedules.map((schedule) => {
                                const amFull = schedule.am_booked >= schedule.am_slots;
                                const pmFull = schedule.pm_booked >= schedule.pm_slots;
                                return (
                                    <div key={schedule.id} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-[#0787f7]" />
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                {format(new Date(schedule.date + 'T00:00:00'), 'EEE, MMM d, yyyy')}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => !amFull && openBooking(schedule, 'AM')}
                                                disabled={amFull}
                                                className={`rounded-lg p-3 text-center transition-all ${amFull ? 'cursor-not-allowed bg-neutral-100 opacity-50 dark:bg-neutral-800' : 'border border-blue-100 bg-blue-50 hover:border-blue-300 hover:shadow-sm dark:border-blue-900 dark:bg-blue-900/20'}`}
                                            >
                                                <p className="text-[10px] font-bold text-blue-600 uppercase">AM</p>
                                                <p className="text-xs text-blue-800 dark:text-blue-300">8:00 – 12:00</p>
                                                <p className="mt-1 text-[10px] text-blue-600">{schedule.am_slots - schedule.am_booked} slots left</p>
                                            </button>
                                            <button
                                                onClick={() => !pmFull && openBooking(schedule, 'PM')}
                                                disabled={pmFull}
                                                className={`rounded-lg p-3 text-center transition-all ${pmFull ? 'cursor-not-allowed bg-neutral-100 opacity-50 dark:bg-neutral-800' : 'border border-orange-100 bg-orange-50 hover:border-orange-300 hover:shadow-sm dark:border-orange-900 dark:bg-orange-900/20'}`}
                                            >
                                                <p className="text-[10px] font-bold text-orange-600 uppercase">PM</p>
                                                <p className="text-xs text-orange-800 dark:text-orange-300">1:00 – 5:00</p>
                                                <p className="mt-1 text-[10px] text-orange-600">{schedule.pm_slots - schedule.pm_booked} slots left</p>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* My Appointments */}
                {appointments.data.length > 0 && (
                    <div>
                        <h2 className="mb-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">My Appointments</h2>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {appointments.data.map((apt) => (
                                <div key={apt.id} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                            {format(new Date(apt.date + 'T00:00:00'), 'MMM d, yyyy')}
                                        </span>
                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusBadge(apt.status)}`}>
                                            {apt.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-xs text-neutral-500">
                                        <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Session:</span> {apt.session}</p>
                                        <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Reason:</span> {apt.reason}</p>
                                        {apt.queue_number && <p><span className="font-medium text-neutral-700 dark:text-neutral-300">Queue #:</span> {apt.queue_number}</p>}
                                        {apt.priority_type !== 'regular' && (
                                            <p><span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold capitalize text-purple-700">{apt.priority_type}</span></p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {showBooking && selectedSchedule && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
                    <div className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl dark:bg-neutral-900">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Book Appointment</h2>
                                <p className="text-xs text-neutral-400">
                                    {format(new Date(selectedSchedule.date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')} · {selectedSession}
                                </p>
                            </div>
                            <button onClick={() => setShowBooking(false)} className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <X className="h-5 w-5 text-neutral-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Reason for Visit *</label>
                                <input type="text" value={form.data.reason} onChange={(e) => form.setData('reason', e.target.value)} className={inputCls} placeholder="e.g., General checkup, follow-up" required />
                                {form.errors.reason && <p className="mt-1 text-xs text-red-500">{form.errors.reason}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Symptoms</label>
                                <input type="text" value={form.data.symptoms} onChange={(e) => form.setData('symptoms', e.target.value)} className={inputCls} placeholder="e.g., Headache, fever, cough" />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Priority Type *</label>
                                <select value={form.data.priority_type} onChange={(e) => form.setData('priority_type', e.target.value)} className={inputCls}>
                                    <option value="regular">Regular</option>
                                    <option value="senior">Senior Citizen (60+)</option>
                                    <option value="pwd">Person with Disability (PWD)</option>
                                    <option value="pregnant">Pregnant</option>
                                </select>
                                <p className="mt-1 text-[10px] text-neutral-400">Priority patients are served first in the queue.</p>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Additional Notes</label>
                                <textarea value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} rows={2} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Any special requests..." />
                            </div>
                            <button type="submit" disabled={form.processing} className="mt-2 w-full rounded-lg bg-[#0787f7] py-3 text-sm font-bold text-white shadow-lg shadow-[#0787f7]/20 transition-all hover:bg-[#0670d4] disabled:opacity-50">
                                {form.processing ? 'Booking...' : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
