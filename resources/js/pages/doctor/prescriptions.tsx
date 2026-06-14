import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import {
    Pill,
    Plus,
    Search,
    X,
    Sun,
    Moon,
    FileText,
    Pencil,
    Download,
} from 'lucide-react';
import { FlashAlert } from '@/components/flash-alert';
import Swal from 'sweetalert2';

type Prescription = {
    id: number;
    diagnosis: string;
    medications: string;
    instructions: string | null;
    follow_up: string | null;
    notes: string | null;
    created_at: string;
    patient: { id: number; name: string; email: string };
    appointment: { id: number; date: string; session: string; reason: string } | null;
};

type PaginatedPrescriptions = {
    data: Prescription[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type CompletedAppointment = {
    id: number;
    user_id: number;
    date: string;
    session: string;
    reason: string;
    user: { id: number; name: string };
};

type Props = {
    prescriptions: PaginatedPrescriptions;
    completedAppointments: CompletedAppointment[];
    filters: { search?: string };
};

export default function Prescriptions({ prescriptions, completedAppointments, filters }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedAppointment, setSelectedAppointment] = useState<CompletedAppointment | null>(null);

    const form = useForm({
        appointment_id: '',
        patient_id: '',
        diagnosis: '',
        medications: '',
        instructions: '',
        follow_up: '',
        notes: '',
    });

    const editForm = useForm({
        diagnosis: '',
        medications: '',
        instructions: '',
        follow_up: '',
        notes: '',
    });

    const openCreate = () => {
        setSelectedAppointment(null);
        setEditingPrescription(null);
        form.reset();
        setShowModal(true);
    };

    const openEdit = (rx: Prescription) => {
        setEditingPrescription(rx);
        setSelectedAppointment(null);
        editForm.setData({
            diagnosis: rx.diagnosis,
            medications: rx.medications,
            instructions: rx.instructions || '',
            follow_up: rx.follow_up || '',
            notes: rx.notes || '',
        });
        setShowModal(true);
    };

    const selectAppointment = (apt: CompletedAppointment) => {
        setSelectedAppointment(apt);
        form.setData({
            appointment_id: String(apt.id),
            patient_id: String(apt.user_id),
            diagnosis: '',
            medications: '',
            instructions: '',
            follow_up: '',
            notes: '',
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/doctor/prescriptions', {
            onSuccess: () => {
                setShowModal(false);
                form.reset();
                Swal.fire({ icon: 'success', title: 'Prescription Created', text: 'Saved successfully.', confirmButtonColor: '#0787f7' });
            },
            onError: (errors) => {
                const list = Object.values(errors).flat().map((m) => `<li>${m}</li>`).join('');
                Swal.fire({ icon: 'error', title: 'Failed', html: `<ul class="list-disc pl-5 text-left text-sm text-red-600">${list}</ul>`, confirmButtonColor: '#0787f7' });
            },
            preserveScroll: true,
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPrescription) return;
        editForm.put(`/doctor/prescriptions/${editingPrescription.id}`, {
            onSuccess: () => {
                setShowModal(false);
                setEditingPrescription(null);
                Swal.fire({ icon: 'success', title: 'Updated', text: 'Prescription updated.', confirmButtonColor: '#0787f7' });
            },
            onError: (errors) => {
                const list = Object.values(errors).flat().map((m) => `<li>${m}</li>`).join('');
                Swal.fire({ icon: 'error', title: 'Failed', html: `<ul class="list-disc pl-5 text-left text-sm text-red-600">${list}</ul>`, confirmButtonColor: '#0787f7' });
            },
            preserveScroll: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/doctor/prescriptions', { search }, { preserveState: true });
    };

    const inputCls = 'h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100';

    return (
        <>
            <Head title="Prescriptions" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                <FlashAlert />

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <Pill className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Prescriptions</h1>
                            <p className="text-xs text-neutral-400">{prescriptions.total} total prescriptions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <input type="text" placeholder="Search patient..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-48 rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                        </form>
                        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#0787f7] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0670d4]">
                            <Plus className="h-3.5 w-3.5" />
                            New Prescription
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">Patient</th>
                                    <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">Date</th>
                                    <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">Diagnosis</th>
                                    <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">Medications</th>
                                    <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">Follow-up</th>
                                    <th className="px-3 py-2 font-semibold text-neutral-600 dark:text-neutral-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {prescriptions.data.map((rx) => (
                                    <tr key={rx.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="whitespace-nowrap px-3 py-2 font-medium text-neutral-900 dark:text-neutral-100">{rx.patient.name}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-neutral-600 dark:text-neutral-300">
                                            {rx.appointment ? format(new Date(rx.appointment.date), 'MMM d, yyyy') : format(new Date(rx.created_at), 'MMM d, yyyy')}
                                        </td>
                                        <td className="max-w-[150px] truncate px-3 py-2 text-neutral-600 dark:text-neutral-300">{rx.diagnosis}</td>
                                        <td className="max-w-[150px] truncate px-3 py-2 text-neutral-600 dark:text-neutral-300">{rx.medications}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-neutral-500">{rx.follow_up || '—'}</td>
                                        <td className="whitespace-nowrap px-3 py-2">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => openEdit(rx)} className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-[#0787f7] dark:hover:bg-neutral-700" title="Edit">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <a href={`/doctor/prescriptions/${rx.id}/pdf`} className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-green-600 dark:hover:bg-neutral-700" title="Download PDF">
                                                    <Download className="h-3.5 w-3.5" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {prescriptions.data.length === 0 && (
                                    <tr><td colSpan={6} className="px-3 py-8 text-center text-neutral-400"><FileText className="mx-auto mb-2 h-8 w-8 text-neutral-300" />No prescriptions yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {prescriptions.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 dark:border-neutral-700">
                            <p className="text-xs text-neutral-400">Page {prescriptions.current_page} of {prescriptions.last_page}</p>
                            <div className="flex gap-1">
                                {prescriptions.links.map((link, i) => (
                                    <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} className={`rounded-md px-3 py-1 text-xs font-medium ${link.active ? 'bg-[#0787f7] text-white' : 'text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 dark:text-neutral-300'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                {editingPrescription ? 'Edit Prescription' : 'New Prescription'}
                            </h2>
                            <button onClick={() => { setShowModal(false); setEditingPrescription(null); }} className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <X className="h-5 w-5 text-neutral-400" />
                            </button>
                        </div>

                        {/* Edit mode */}
                        {editingPrescription ? (
                            <form onSubmit={handleEdit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                                <div className="rounded-lg border border-[#0787f7]/20 bg-[#0787f7]/5 p-3">
                                    <p className="text-xs font-bold text-[#0787f7]">Patient: {editingPrescription.patient.name}</p>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Diagnosis *</label>
                                    <textarea value={editForm.data.diagnosis} onChange={(e) => editForm.setData('diagnosis', e.target.value)} rows={2} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" required />
                                    {editForm.errors.diagnosis && <p className="mt-1 text-xs text-red-500">{editForm.errors.diagnosis}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Medications *</label>
                                    <textarea value={editForm.data.medications} onChange={(e) => editForm.setData('medications', e.target.value)} rows={3} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" required />
                                    {editForm.errors.medications && <p className="mt-1 text-xs text-red-500">{editForm.errors.medications}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Instructions</label>
                                    <textarea value={editForm.data.instructions} onChange={(e) => editForm.setData('instructions', e.target.value)} rows={2} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Follow-up</label>
                                        <input type="text" value={editForm.data.follow_up} onChange={(e) => editForm.setData('follow_up', e.target.value)} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Notes</label>
                                        <input type="text" value={editForm.data.notes} onChange={(e) => editForm.setData('notes', e.target.value)} className={inputCls} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => { setShowModal(false); setEditingPrescription(null); }} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300">Cancel</button>
                                    <button type="submit" disabled={editForm.processing} className="rounded-lg bg-[#0787f7] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0670d4] disabled:opacity-50">
                                        {editForm.processing ? 'Saving...' : 'Update Prescription'}
                                    </button>
                                </div>
                            </form>
                        ) : !selectedAppointment ? (
                            /* Step 1: Select appointment */
                            <div>
                                <p className="mb-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300">Select a completed appointment:</p>
                                {completedAppointments.length === 0 ? (
                                    <div className="py-6 text-center"><p className="text-sm text-neutral-400">No completed appointments without prescriptions.</p></div>
                                ) : (
                                    <div className="max-h-[300px] space-y-2 overflow-y-auto">
                                        {completedAppointments.map((apt) => (
                                            <button key={apt.id} onClick={() => selectAppointment(apt)} className="flex w-full items-center gap-3 rounded-lg border border-neutral-200 p-3 text-left transition-colors hover:border-[#0787f7] hover:bg-[#0787f7]/5 dark:border-neutral-700">
                                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${apt.session === 'AM' ? 'bg-amber-50' : 'bg-indigo-50'}`}>
                                                    {apt.session === 'AM' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{apt.user.name}</p>
                                                    <p className="text-[10px] text-neutral-400">{format(new Date(apt.date), 'MMM d, yyyy')} · {apt.session} · {apt.reason}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Step 2: Create */
                            <form onSubmit={handleCreate} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                                <div className="rounded-lg border border-[#0787f7]/20 bg-[#0787f7]/5 p-3">
                                    <p className="text-xs font-bold text-[#0787f7]">Patient: {selectedAppointment.user.name}</p>
                                    <p className="text-[10px] text-neutral-500">{format(new Date(selectedAppointment.date), 'MMMM d, yyyy')} · {selectedAppointment.session} · {selectedAppointment.reason}</p>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Diagnosis *</label>
                                    <textarea value={form.data.diagnosis} onChange={(e) => form.setData('diagnosis', e.target.value)} rows={2} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Patient diagnosis..." required />
                                    {form.errors.diagnosis && <p className="mt-1 text-xs text-red-500">{form.errors.diagnosis}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Medications *</label>
                                    <textarea value={form.data.medications} onChange={(e) => form.setData('medications', e.target.value)} rows={3} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" placeholder="e.g., Amoxicillin 500mg - 3x daily for 7 days" required />
                                    {form.errors.medications && <p className="mt-1 text-xs text-red-500">{form.errors.medications}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Instructions</label>
                                    <textarea value={form.data.instructions} onChange={(e) => form.setData('instructions', e.target.value)} rows={2} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Take after meals, avoid alcohol..." />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Follow-up</label>
                                        <input type="text" value={form.data.follow_up} onChange={(e) => form.setData('follow_up', e.target.value)} className={inputCls} placeholder="e.g., After 1 week" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Notes</label>
                                        <input type="text" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} className={inputCls} placeholder="Additional notes..." />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setSelectedAppointment(null)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300">Back</button>
                                    <button type="submit" disabled={form.processing} className="rounded-lg bg-[#0787f7] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0670d4] disabled:opacity-50">
                                        {form.processing ? 'Saving...' : 'Create Prescription'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
