import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    MessageSquare,
    Star,
    Sun,
    Moon,
    Users,
    TrendingUp,
} from 'lucide-react';

type FeedbackItem = {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    appointment: {
        id: number;
        date: string;
        session: string;
        reason: string;
    } | null;
};

type PaginatedFeedback = {
    data: FeedbackItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    feedback: PaginatedFeedback;
    averageRating: number;
    totalFeedback: number;
    ratingDistribution: Record<number, number>;
};

export default function PatientFeedback({ feedback, averageRating, totalFeedback, ratingDistribution }: Props) {
    const maxCount = Math.max(...Object.values(ratingDistribution), 1);

    return (
        <>
            <Head title="Patient Feedback" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                        <MessageSquare className="h-5 w-5 text-[#0787f7]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Patient Feedback</h1>
                        <p className="text-xs text-neutral-400">Anonymous feedback from patients</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/10">
                            <Star className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{averageRating || '—'}</p>
                            <p className="text-xs text-neutral-400">Average Rating</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <Users className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{totalFeedback}</p>
                            <p className="text-xs text-neutral-400">Total Responses</p>
                        </div>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <p className="mb-2 text-xs font-semibold text-neutral-500">Rating Distribution</p>
                        <div className="space-y-1.5">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="flex items-center gap-2">
                                    <span className="w-3 text-[10px] font-bold text-neutral-500">{star}</span>
                                    <Star className="h-3 w-3 text-amber-400" />
                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                        <div
                                            className="h-full rounded-full bg-amber-400"
                                            style={{ width: `${((ratingDistribution[star] || 0) / maxCount) * 100}%` }}
                                        />
                                    </div>
                                    <span className="w-5 text-right text-[10px] text-neutral-400">{ratingDistribution[star] || 0}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="space-y-3">
                    {feedback.data.length === 0 ? (
                        <div className="rounded-xl border border-neutral-200 bg-white py-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
                            <MessageSquare className="mx-auto mb-3 h-10 w-10 text-neutral-300 dark:text-neutral-600" />
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No feedback yet</p>
                            <p className="mt-1 text-xs text-neutral-400">Patient feedback will appear here anonymously.</p>
                        </div>
                    ) : (
                        feedback.data.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl border border-neutral-200 bg-white px-5 py-4 dark:border-neutral-700 dark:bg-neutral-900"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Stars */}
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${star <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-600'}`}
                                                />
                                            ))}
                                            <span className="ml-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">{item.rating}/5</span>
                                        </div>

                                        {/* Comment */}
                                        {item.comment ? (
                                            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">"{item.comment}"</p>
                                        ) : (
                                            <p className="mt-2 text-xs italic text-neutral-400">No comment provided</p>
                                        )}

                                        {/* Appointment info (anonymous) */}
                                        {item.appointment && (
                                            <div className="mt-3 flex items-center gap-3 text-[10px] text-neutral-400">
                                                <span className="flex items-center gap-1">
                                                    {item.appointment.session === 'AM' ? (
                                                        <Sun className="h-3 w-3 text-amber-400" />
                                                    ) : (
                                                        <Moon className="h-3 w-3 text-indigo-400" />
                                                    )}
                                                    {format(new Date(item.appointment.date), 'MMM d, yyyy')} · {item.appointment.session}
                                                </span>
                                                <span>·</span>
                                                <span>{item.appointment.reason}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Anonymous badge */}
                                    <div className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[9px] font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                                        Anonymous
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {feedback.last_page > 1 && (
                    <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900">
                        <p className="text-xs text-neutral-400">
                            Page {feedback.current_page} of {feedback.last_page}
                        </p>
                        <div className="flex gap-1">
                            {feedback.links.map((link, i) => (
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
