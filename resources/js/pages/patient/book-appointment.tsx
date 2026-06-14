import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, X, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { FlashAlert } from '@/components/flash-alert';
import Swal from 'sweetalert2';
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
};

type Props = {
    availableSchedules: Schedule[];
    appointments: { data: Appointment[] };
};

export default function BookAppointment({ availableSchedules, appointments }: Props) {
    const { auth } = usePage().props;
    const user = auth.user as User;
    const { t } = useLanguage();
    const [showBooking, setShowBooking] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [selectedSession, setSelectedSession] = useState<'AM' | 'PM' | null>(null);

    const form = useForm({
        schedule_id: '',
        date: '',
        session: '',
        reason: '',
        symptoms: '',
        contact_number: '',
        allergies: '',
        current_medication: '',
        medical_history: '',
        temperature: '',
        blood_pressure: '',
        weight: '',
        priority_type: 'regular',
        notes: '',
    });

    const openBooking = (schedule: Schedule, session: 'AM' | 'PM') => {
        setSelectedSchedule(schedule);
        setSelectedSession(session);
        form.setData({
            schedule_id: String(schedule.id),
            date: schedule.date.slice(0, 10),
            session,
            reason: '',
            symptoms: '',
            contact_number: (user.phone as string) || '',
            allergies: '',
            current_medication: '',
            medical_history: '',
            temperature: '',
            blood_pressure: '',
            weight: '',
            priority_type: 'regular',
            notes: '',
        });
        setShowBooking(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/patient/book-appointment', {
            onSuccess: () => {
                setShowBooking(false);
                form.reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Appointment Booked!',
                    text: 'Your appointment has been successfully booked. You will receive a confirmation soon.',
                    confirmButtonColor: '#0787f7',
                });
            },
            onError: (errors) => {
                const errorList = Object.values(errors)
                    .flat()
                    .map((msg) => `<li class="text-left text-sm text-red-600">${msg}</li>`)
                    .join('');

                Swal.fire({
                    icon: 'error',
                    title: 'Booking Failed',
                    html: `
                        <p class="text-sm text-neutral-500 mb-3">Please fix the following errors:</p>
                        <ul class="list-disc pl-5 space-y-1">${errorList}</ul>
                    `,
                    confirmButtonColor: '#0787f7',
                    confirmButtonText: 'Got it',
                });
            },
            preserveScroll: true,
        });
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'border-amber-200 bg-amber-50 text-amber-700';
            case 'confirmed': return 'border-green-200 bg-green-50 text-green-700';
            case 'completed': return 'border-blue-200 bg-blue-50 text-blue-700';
            case 'cancelled': return 'border-red-200 bg-red-50 text-red-700';
            default: return 'border-neutral-200 bg-neutral-50 text-neutral-600';
        }
    };

    const translateStatus = (status: string) => {
        const key = status.replace('_', '');
        return t(key) || status;
    };

    const inputCls = 'h-10 w-full rounded-xl border border-neutral-200 px-4 text-sm focus:border-[#0787f7] focus:ring-2 focus:ring-[#0787f7]/10 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100';

    return (
        <>
            <Head title={t('book_appointment')} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6">
                <FlashAlert />
                {/* Hero Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0787f7] to-[#0560c9] p-6 sm:p-8">
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/70">{t('hi')}, {user.name.split(' ')[0]}!</p>
                            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{t('book_appointment')}</h1>
                            <p className="mt-2 max-w-md text-sm text-white/60">{t('choose_available_date')}</p>
                        </div>
                        <img src="/images/logo.png" alt="" className="hidden h-14 w-14 rounded-xl bg-white/10 object-contain p-2 sm:block" />
                    </div>
                </div>

                {/* Available Slots */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{t('available_slots')}</h2>
                        <span className="text-xs text-neutral-400">{availableSchedules.length} {t('dates_available')}</span>
                    </div>

                    {availableSchedules.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-16 dark:border-neutral-700">
                            <Calendar className="mb-3 h-10 w-10 text-neutral-300" />
                            <p className="text-sm font-medium text-neutral-400">{t('no_available_schedules')}</p>
                            <p className="text-xs text-neutral-300">{t('check_back_later')}</p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {availableSchedules.map((schedule) => {
                                const dateStr = schedule.date.slice(0, 10);
                                const amLeft = schedule.am_slots - schedule.am_booked;
                                const pmLeft = schedule.pm_slots - schedule.pm_booked;
                                const amAvail = amLeft > 0;
                                const pmAvail = pmLeft > 0;
                                return (
                                    <div key={schedule.id} className="group rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-all hover:border-[#0787f7]/20 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                                        <p className="mb-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                            {format(new Date(dateStr + 'T00:00:00'), 'EEE, MMM d')}
                                        </p>
                                        <div className="space-y-2">
                                            {amAvail && (
                                                <button
                                                    onClick={() => openBooking(schedule, 'AM')}
                                                    className="flex w-full items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3 transition-all hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] dark:border-blue-900/50 dark:bg-blue-900/10"
                                                >
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                        <Sun className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-xs font-bold text-blue-700 dark:text-blue-400">{t('morning')}</p>
                                                        <p className="text-[10px] text-blue-500">8:00 AM – 12:00 PM</p>
                                                    </div>
                                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">{amLeft} {t('left')}</span>
                                                </button>
                                            )}
                                            {pmAvail && (
                                                <button
                                                    onClick={() => openBooking(schedule, 'PM')}
                                                    className="flex w-full items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/50 p-3 transition-all hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] dark:border-orange-900/50 dark:bg-orange-900/10"
                                                >
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                                        <Moon className="h-4 w-4 text-orange-600" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-xs font-bold text-orange-700 dark:text-orange-400">{t('afternoon')}</p>
                                                        <p className="text-[10px] text-orange-500">1:00 PM – 5:00 PM</p>
                                                    </div>
                                                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">{pmLeft} {t('left')}</span>
                                                </button>
                                            )}
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
                        <h2 className="mb-4 text-base font-bold text-neutral-900 dark:text-neutral-100">{t('my_appointments')}</h2>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {appointments.data.map((apt) => (
                                <div key={apt.id} className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                            {format(new Date(apt.date.slice(0, 10) + 'T00:00:00'), 'MMM d, yyyy')}
                                        </p>
                                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold capitalize ${statusColor(apt.status)}`}>
                                            {translateStatus(apt.status)}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            {apt.session === 'AM' ? <Sun className="h-3 w-3 text-blue-500" /> : <Moon className="h-3 w-3 text-orange-500" />}
                                            <span className="text-xs text-neutral-600 dark:text-neutral-300">{apt.session === 'AM' ? t('morning') : t('afternoon')} {t('session')}</span>
                                        </div>
                                        <p className="text-xs text-neutral-500"><span className="font-medium text-neutral-700 dark:text-neutral-200">{t('reason')}:</span> {apt.reason}</p>
                                        {apt.queue_number && <p className="text-xs text-neutral-500"><span className="font-medium text-neutral-700 dark:text-neutral-200">{t('queue')}:</span> #{apt.queue_number}</p>}
                                        {apt.priority_type !== 'regular' && (
                                            <span className="inline-flex rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold capitalize text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">{apt.priority_type}</span>
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
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
                    <div className="w-full max-w-md animate-in slide-in-from-bottom-4 rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl dark:bg-neutral-900">
                        <div className="mb-1 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{t('confirm_booking')}</h2>
                            <button onClick={() => setShowBooking(false)} className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <X className="h-5 w-5 text-neutral-400" />
                            </button>
                        </div>
                        <p className="mb-5 text-xs text-neutral-400">
                            {selectedSchedule && format(new Date(selectedSchedule.date.slice(0, 10) + 'T00:00:00'), 'EEEE, MMMM d, yyyy')} · {selectedSession === 'AM' ? t('morning') : t('afternoon')}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                            {/* Global date error (duplicate booking) */}
                            {form.errors.date && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                                    {form.errors.date}
                                </div>
                            )}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-200">{t('reason_for_visit')} *</label>
                                    <input type="text" value={form.data.reason} onChange={(e) => form.setData('reason', e.target.value)} className={inputCls} placeholder={t('placeholder_reason')} required />
                                    {form.errors.reason && <p className="mt-1 text-xs text-red-500">{form.errors.reason}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-200">{t('contact_number')}</label>
                                    <input type="text" value={form.data.contact_number} onChange={(e) => form.setData('contact_number', e.target.value)} className={inputCls} placeholder={t('placeholder_contact')} />
                                    {form.errors.contact_number && <p className="mt-1 text-xs text-red-500">{form.errors.contact_number}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-200">{t('symptoms')}</label>
                                <input type="text" value={form.data.symptoms} onChange={(e) => form.setData('symptoms', e.target.value)} className={inputCls} placeholder={t('placeholder_symptoms')} />
                                {form.errors.symptoms && <p className="mt-1 text-xs text-red-500">{form.errors.symptoms}</p>}
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-200">{t('allergies')}</label>
                                    <input type="text" value={form.data.allergies} onChange={(e) => form.setData('allergies', e.target.value)} className={inputCls} placeholder={t('placeholder_allergies')} />
                                    {form.errors.allergies && <p className="mt-1 text-xs text-red-500">{form.errors.allergies}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-200">{t('current_medication')}</label>
                                    <input type="text" value={form.data.current_medication} onChange={(e) => form.setData('current_medication', e.target.value)} className={inputCls} placeholder={t('placeholder_medication')} />
                                    {form.errors.current_medication && <p className="mt-1 text-xs text-red-500">{form.errors.current_medication}</p>}
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-200">{t('temperature')}</label>
                                    <input type="text" value={form.data.temperature} onChange={(e) => form.setData('temperature', e.target.value)} className={inputCls} placeholder="37.5°C" />
                                    {form.errors.temperature && <p className="mt-1 text-xs text-red-500">{form.errors.temperature}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-200">{t('blood_pressure')}</label>
                                    <input type="text" value={form.data.blood_pressure} onChange={(e) => form.setData('blood_pressure', e.target.value)} className={inputCls} placeholder="120/80" />
                                    {form.errors.blood_pressure && <p className="mt-1 text-xs text-red-500">{form.errors.blood_pressure}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-200">{t('weight_kg')}</label>
                                    <input type="text" value={form.data.weight} onChange={(e) => form.setData('weight', e.target.value)} className={inputCls} placeholder="65" />
                                    {form.errors.weight && <p className="mt-1 text-xs text-red-500">{form.errors.weight}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-200">{t('medical_history')}</label>
                                <textarea value={form.data.medical_history} onChange={(e) => form.setData('medical_history', e.target.value)} rows={2} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-[#0787f7] focus:ring-2 focus:ring-[#0787f7]/10 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" placeholder={t('placeholder_history')} />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-200">{t('priority_type')} *</label>
                                <select value={form.data.priority_type} onChange={(e) => form.setData('priority_type', e.target.value)} className={inputCls}>
                                    <option value="regular">{t('regular')}</option>
                                    <option value="senior">{t('senior_citizen')}</option>
                                    <option value="pwd">{t('pwd')}</option>
                                    <option value="pregnant">{t('pregnant')}</option>
                                </select>
                                <p className="mt-1 text-[10px] text-neutral-400">{t('priority_note')}</p>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-200">{t('additional_notes')}</label>
                                <textarea value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} rows={2} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-[#0787f7] focus:ring-2 focus:ring-[#0787f7]/10 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" placeholder={t('placeholder_notes')} />
                            </div>
                            <button type="submit" disabled={form.processing} className="w-full rounded-xl bg-[#0787f7] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0787f7]/20 transition-all hover:bg-[#0670d4] active:scale-[0.98] disabled:opacity-50">
                                {form.processing ? t('booking') : t('confirm_booking_btn')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
