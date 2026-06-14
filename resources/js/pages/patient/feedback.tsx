import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import {
    MessageSquare,
    Star,
    Sun,
    Moon,
    Send,
    X,
    CheckCircle2,
} from 'lucide-react';
import { FlashAlert } from '@/components/flash-alert';

type Appointment = {
    id: number;
    date: string;
    session: string;
    reason: string;
    status: string;
    queue_number: number | null;
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
    feedbackMap: Record<number, number>; // appointment_id => rating
    feedbackComments: Record<number, string | null>; // appointment_id => comment
};

export default function Feedback({ appointments, feedbackMap, feedbackComments }: Props) {
    const [ratingModal, setRatingModal] = useState<Appointment | null>(null);

    const form = useForm({
        appointment_id: '',
        rating: 0,
        comment: '',
    });

    const openRating = (apt: Appointment) => {
        setRatingModal(apt);
        form.setData({
            appointment_id: String(apt.id),
            rating: feedbackMap[apt.id] || 0,
            comment: feedbackComments[apt.id] || '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.data.rating === 0) return;
        form.post('/patient/feedback', {
            onSuccess: () => setRatingModal(null),
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Feedback" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                <FlashAlert />

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                        <MessageSquare className="h-5 w-5 text-[#0787f7]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Feedback</h1>
                        <p className="text-xs text-neutral-400">Rate and comment on your completed appointments</p>
                    </div>
                </div>

                {/* Appointments List */}
                {appointments.data.length === 0 ? (
                    <div className="rounded-xl border border-neutral-200 bg-white py-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
                        <MessageSquare className="mx-auto mb-3 h-10 w-10 text-neutral-300 dark:text-neutral-600" />
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No completed appointments yet</p>
                        <p className="mt-1 text-xs text-neutral-400">Once you complete an appointment, you can leave feedback here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {appointments.data.map((apt) => {
                            const hasRated = feedbackMap[apt.id] !== undefined;
                            const rating = feedbackMap[apt.id] || 0;

                            return (
                                <div
                                    key={apt.id}
                                    className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white px-5 py-4 dark:border-neutral-700 dark:bg-neutral-900"
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
                                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                            {format(new Date(apt.date), 'MMMM d, yyyy')}
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">{apt.reason}</p>
                                        {hasRated && (
                                            <div className="mt-1 flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-3.5 w-3.5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-600'}`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action */}
                                    <button
                                        onClick={() => openRating(apt)}
                                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                                            hasRated
                                                ? 'border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                : 'bg-[#0787f7] text-white hover:bg-[#0670d4]'
                                        }`}
                                    >
                                        {hasRated ? (
                                            <>
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Edit
                                            </>
                                        ) : (
                                            <>
                                                <Star className="h-3.5 w-3.5" />
                                                Rate
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

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

            {/* Rating Modal */}
            {ratingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Rate Your Visit</h2>
                            <button onClick={() => setRatingModal(null)} className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <X className="h-5 w-5 text-neutral-400" />
                            </button>
                        </div>

                        <p className="mb-1 text-sm text-neutral-600 dark:text-neutral-300">
                            {format(new Date(ratingModal.date), 'MMMM d, yyyy')} — {ratingModal.session} Session
                        </p>
                        <p className="mb-5 text-xs text-neutral-400">{ratingModal.reason}</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Star Rating */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">How was your experience?</label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => form.setData('rating', star)}
                                            className="rounded p-1 transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-8 w-8 ${star <= form.data.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-600'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {form.data.rating > 0 && (
                                    <p className="mt-1 text-xs text-neutral-400">
                                        {form.data.rating === 1 && 'Poor'}
                                        {form.data.rating === 2 && 'Fair'}
                                        {form.data.rating === 3 && 'Good'}
                                        {form.data.rating === 4 && 'Very Good'}
                                        {form.data.rating === 5 && 'Excellent'}
                                    </p>
                                )}
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Comment (optional)</label>
                                <textarea
                                    value={form.data.comment}
                                    onChange={(e) => form.setData('comment', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                    placeholder="Share your experience..."
                                    maxLength={500}
                                />
                                <p className="mt-1 text-right text-[10px] text-neutral-400">{form.data.comment.length}/500</p>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRatingModal(null)}
                                    className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.data.rating === 0 || form.processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#0787f7] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0670d4] disabled:opacity-50"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    {form.processing ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
