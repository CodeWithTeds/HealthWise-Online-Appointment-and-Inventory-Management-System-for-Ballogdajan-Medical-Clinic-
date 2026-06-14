import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';
import {
    Pill,
    Sun,
    Moon,
    ChevronDown,
    ChevronUp,
    FileText,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

type Prescription = {
    id: number;
    diagnosis: string;
    medications: string;
    instructions: string | null;
    follow_up: string | null;
    notes: string | null;
    created_at: string;
    appointment: { id: number; date: string; session: string; reason: string } | null;
};

type Props = {
    prescriptions: Prescription[];
};

export default function PatientPrescriptions({ prescriptions }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const { t } = useLanguage();

    return (
        <>
            <Head title="My Prescriptions" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                        <Pill className="h-5 w-5 text-[#0787f7]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">My Prescriptions</h1>
                        <p className="text-xs text-neutral-400">{prescriptions.length} prescription(s)</p>
                    </div>
                </div>

                {/* List */}
                {prescriptions.length === 0 ? (
                    <div className="rounded-xl border border-neutral-200 bg-white py-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
                        <FileText className="mx-auto mb-3 h-10 w-10 text-neutral-300 dark:text-neutral-600" />
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No prescriptions yet</p>
                        <p className="mt-1 text-xs text-neutral-400">Your prescriptions from completed appointments will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {prescriptions.map((rx) => (
                            <div key={rx.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                                <div
                                    className="flex cursor-pointer items-center gap-4 px-5 py-4"
                                    onClick={() => setExpandedId(expandedId === rx.id ? null : rx.id)}
                                >
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${rx.appointment?.session === 'AM' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-indigo-50 dark:bg-indigo-900/20'}`}>
                                        {rx.appointment?.session === 'AM' ? (
                                            <Sun className="h-5 w-5 text-amber-500" />
                                        ) : (
                                            <Moon className="h-5 w-5 text-indigo-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                            {rx.appointment ? format(new Date(rx.appointment.date), 'MMMM d, yyyy') : format(new Date(rx.created_at), 'MMMM d, yyyy')}
                                        </p>
                                        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                            {rx.appointment?.reason || 'Prescription'}
                                        </p>
                                    </div>
                                    <div className="shrink-0">
                                        {expandedId === rx.id ? (
                                            <ChevronUp className="h-4 w-4 text-neutral-400" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-neutral-400" />
                                        )}
                                    </div>
                                </div>

                                {expandedId === rx.id && (
                                    <div className="border-t border-neutral-100 bg-neutral-50/50 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-800/30">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0787f7]">Diagnosis</p>
                                                <p className="mt-1 whitespace-pre-line text-sm text-neutral-700 dark:text-neutral-300">{rx.diagnosis}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0787f7]">Medications</p>
                                                <p className="mt-1 whitespace-pre-line text-sm text-neutral-700 dark:text-neutral-300">{rx.medications}</p>
                                            </div>
                                            {rx.instructions && (
                                                <div>
                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Instructions</p>
                                                    <p className="mt-1 whitespace-pre-line text-sm text-neutral-600 dark:text-neutral-400">{rx.instructions}</p>
                                                </div>
                                            )}
                                            {rx.follow_up && (
                                                <div>
                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Follow-up</p>
                                                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{rx.follow_up}</p>
                                                </div>
                                            )}
                                            {rx.notes && (
                                                <div>
                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Notes</p>
                                                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{rx.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
