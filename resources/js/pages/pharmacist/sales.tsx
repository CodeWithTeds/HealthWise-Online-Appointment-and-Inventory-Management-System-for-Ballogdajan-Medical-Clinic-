import { Head, router, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';
import { Pill, Search, Package, Receipt, Coins, AlertTriangle, ShoppingCart, TrendingUp, Calendar, Users, X, Plus, Minus, Info } from 'lucide-react';
import { FlashAlert } from '@/components/flash-alert';
import type { User } from '@/types/auth';
import Swal from 'sweetalert2';

type Sale = {
    id: number;
    quantity: number;
    unit_price: string;
    total_amount: string;
    created_at: string;
    walk_in_name: string | null;
    patient: { id: number; name: string; email: string } | null;
    item: { id: number; name: string; unit: string; category: string } | null;
};

type PaginatedSales = {
    data: Sale[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Medicine = {
    id: number;
    name: string;
    unit: string;
    quantity: number;
    unit_price: string;
    expiration_date: string | null;
    category: string;
    description: string | null;
    minimum_stock: number;
};

type PatientOpt = { id: number; name: string; email: string; username: string };

type Props = {
    sales: PaginatedSales;
    filters: { search?: string };
    recentSales: Sale[];
    medicines: Medicine[];
    patients: PatientOpt[];
};

export default function PharmacistSales({ sales, filters, recentSales, medicines, patients }: Props) {
    const { auth } = usePage().props as { auth: { user: User } };
    const [search, setSearch] = useState(filters.search || '');
    const [medSearch, setMedSearch] = useState('');
    const [showWalkIn, setShowWalkIn] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [patientQuery, setPatientQuery] = useState('');
    const [showPatientList, setShowPatientList] = useState(false);

    const form = useForm({
        patient_id: '',
        walk_in_name: '',
        inventory_item_id: '',
        quantity: '1',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/pharmacist/sales', { search }, { preserveState: true });
    };

    const totalRevenue = useMemo(() => sales.data.reduce((sum, s) => sum + parseFloat(s.total_amount), 0), [sales]);
    const totalQty = useMemo(() => sales.data.reduce((sum, s) => sum + s.quantity, 0), [sales]);

    const filteredMedicines = useMemo(() => {
        if (!medSearch) return medicines;
        const q = medSearch.toLowerCase();
        return medicines.filter((m) => m.name.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q));
    }, [medicines, medSearch]);

    const filteredPatients = useMemo(() => {
        if (!patientQuery) return patients;
        const q = patientQuery.toLowerCase();
        return patients.filter((p) => p.name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
    }, [patients, patientQuery]);

    const totalPrice = useMemo(() => {
        if (!selectedMedicine) return 0;
        const qty = parseInt(form.data.quantity) || 0;
        return qty * parseFloat(selectedMedicine.unit_price);
    }, [selectedMedicine, form.data.quantity]);

    const openWalkIn = (med: Medicine) => {
        setSelectedMedicine(med);
        const firstPatient = patients[0];
        form.setData({ patient_id: firstPatient?.id ? String(firstPatient.id) : '', walk_in_name: '', inventory_item_id: String(med.id), quantity: '1' });
        setPatientQuery(firstPatient ? `${firstPatient.name} (${firstPatient.username})` : '');
        setShowPatientList(false);
        form.clearErrors();
        setShowWalkIn(true);
    };

    const selectPatient = (p: PatientOpt) => {
        form.setData({ patient_id: String(p.id), walk_in_name: '' });
        setPatientQuery(`${p.name} (${p.username})`);
        setShowPatientList(false);
    };

    const handleQty = (delta: number) => {
        if (!selectedMedicine) return;
        const cur = parseInt(form.data.quantity) || 1;
        const next = Math.max(1, Math.min(selectedMedicine.quantity, cur + delta));
        form.setData('quantity', String(next));
    };

    const handleWalkInSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMedicine) return;
        const qty = parseInt(form.data.quantity);
        if (qty > selectedMedicine.quantity) {
            Swal.fire({ icon: 'error', title: 'Insufficient stock', text: `Only ${selectedMedicine.quantity} ${selectedMedicine.unit} available.`, confirmButtonColor: '#0787f7' });
            return;
        }
        // Walk-in create: if patientQuery doesn't match selected patient_id, treat as free-text walk-in name
        const selectedPatient = patients.find((p) => String(p.id) === form.data.patient_id);
        const queryIsSelected = selectedPatient && patientQuery === `${selectedPatient.name} (${selectedPatient.username})`;
        const isFreeTextWalkIn = !queryIsSelected && patientQuery.trim().length > 0;
        if (isFreeTextWalkIn) {
            // Create sale with walk_in_name (patient didn't exist)
            form.setData({ patient_id: '', walk_in_name: patientQuery.trim() } as any);
            // Use router directly to send walk_in_name
            router.post('/pharmacist/sales', {
                patient_id: null,
                walk_in_name: patientQuery.trim(),
                inventory_item_id: form.data.inventory_item_id,
                quantity: form.data.quantity,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowWalkIn(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Walk-in Sale Recorded!',
                        html: `<p class="text-sm text-neutral-600">Sold <b>${qty} ${selectedMedicine.unit}</b> of <b>${selectedMedicine.name}</b> to walk-in <b>${patientQuery.trim()}</b> for <b>₱${totalPrice.toFixed(2)}</b> (no account needed).</p><p class="text-xs text-neutral-400 mt-2">Stock auto-deducted: ${selectedMedicine.quantity} → ${selectedMedicine.quantity - qty} • New walk-in created</p>`,
                        confirmButtonColor: '#0787f7',
                    });
                },
                onError: (errors: any) => {
                    const msg = Object.values(errors).flat().join('\n');
                    Swal.fire({ icon: 'error', title: 'Sale Failed', text: msg || 'Unable to record sale.', confirmButtonColor: '#0787f7' });
                },
            });
            return;
        }
        // Existing patient selected
        form.post('/pharmacist/sales', {
            preserveScroll: true,
            onSuccess: () => {
                setShowWalkIn(false);
                const patientName = patients.find((p) => String(p.id) === form.data.patient_id)?.name || patientQuery || 'patient';
                Swal.fire({
                    icon: 'success',
                    title: 'Walk-in Sale Recorded!',
                    html: `<p class="text-sm text-neutral-600">Sold <b>${qty} ${selectedMedicine.unit}</b> of <b>${selectedMedicine.name}</b> to <b>${patientName}</b> for <b>₱${totalPrice.toFixed(2)}</b>.</p><p class="text-xs text-neutral-400 mt-2">Stock auto-deducted: ${selectedMedicine.quantity} → ${selectedMedicine.quantity - qty} • Patient sees medicine/qty/price/total • No manual stock-out</p>`,
                    confirmButtonColor: '#0787f7',
                });
            },
            onError: (errors) => {
                const msg = Object.values(errors).flat().join('\n');
                Swal.fire({ icon: 'error', title: 'Sale Failed', text: msg || 'Unable to record sale.', confirmButtonColor: '#0787f7' });
            },
        });
    };

    const isLowStock = (m: Medicine) => m.quantity <= m.minimum_stock;
    const isExpiringSoon = (m: Medicine) => m.expiration_date && new Date(m.expiration_date) <= new Date(Date.now() + 30 * 86400000) && new Date(m.expiration_date) > new Date();

    return (
        <>
            <Head title="Sales Transactions" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6">
                <FlashAlert />

                {/* Header — SAME AS PATIENT */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 sm:p-8">
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/70">Welcome, {auth.user.name.split(' ')[0]}!</p>
                            <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
                                <Receipt className="h-7 w-7" /> Pharmacy — Walk-in Sales
                            </h1>
                            <p className="mt-2 max-w-md text-sm text-white/60">Same UI as patient — pharmacist records walk-in sales. Auto-deducts stock (20 → 3 = 17).</p>
                            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                                <Info className="h-3 w-3" /> Pharmacist handles all sales • Patient sees receipt
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
                                <p className="text-xs text-white/70">Revenue (this page)</p>
                                <p className="text-lg font-bold text-white">₱{totalRevenue.toFixed(2)}</p>
                            </div>
                            <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
                                <p className="text-xs text-white/70">Transactions</p>
                                <p className="text-lg font-bold text-white">{sales.total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medicines Grid — SAME AS PATIENT (pharmacist now sells) */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Available Medicines — Walk-in Sale</h2>
                        <p className="text-xs text-neutral-400">{filteredMedicines.length} medicines in stock • Click Sell Walk-in • Same cards as patient</p>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search medicines..."
                            value={medSearch}
                            onChange={(e) => setMedSearch(e.target.value)}
                            className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                    </div>
                </div>

                {filteredMedicines.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-12 dark:border-neutral-700">
                        <Package className="mb-3 h-8 w-8 text-neutral-300" />
                        <p className="text-sm text-neutral-400">No medicines found</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredMedicines.map((med) => (
                            <div key={med.id} className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                                {isLowStock(med) && (
                                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/20">
                                        <AlertTriangle className="h-3 w-3" /> Low Stock
                                    </span>
                                )}
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                                    <Pill className="h-5 w-5 text-emerald-600" />
                                </div>
                                <h3 className="pr-16 text-sm font-bold text-neutral-900 dark:text-neutral-100">{med.name}</h3>
                                {med.description && <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{med.description}</p>}
                                <div className="mt-3 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-neutral-400">Stock</span>
                                        <span className={`text-xs font-bold ${isLowStock(med) ? 'text-red-600' : 'text-neutral-900 dark:text-neutral-100'}`}>
                                            {med.quantity} {med.unit}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-neutral-400">Unit Price</span>
                                        <span className="text-sm font-bold text-emerald-600">₱{Number(med.unit_price).toFixed(2)}</span>
                                    </div>
                                    {med.expiration_date && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-neutral-400">Expires</span>
                                            <span className={`text-xs ${isExpiringSoon(med) ? 'font-bold text-amber-600' : 'text-neutral-600 dark:text-neutral-400'}`}>
                                                {format(new Date(med.expiration_date), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                    <div className={`h-full rounded-full ${isLowStock(med) ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (med.quantity / Math.max(med.minimum_stock * 3, 20)) * 100)}%` }} />
                                </div>
                                <button
                                    onClick={() => openWalkIn(med)}
                                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]"
                                >
                                    <ShoppingCart className="h-4 w-4" /> Sell Walk-in
                                </button>
                                <p className="mt-2 text-center text-[10px] text-neutral-400">Pharmacist records sale • Patient sees receipt</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Search sales — SAME AS PATIENT */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">All Sales</h2>
                        <p className="text-xs text-neutral-400">{sales.total} sales • {totalQty} units • Walk-in only • Auto-deduct</p>
                    </div>
                    <form onSubmit={handleSearch} className="relative flex w-full gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search patient or medicine..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                            />
                        </div>
                        <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                            Search
                        </button>
                        {search && (
                            <button type="button" onClick={() => { setSearch(''); router.get('/pharmacist/sales', {}, { preserveState: true }); }} className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300">
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                {/* Stats — SAME */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                            <Receipt className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{sales.total}</p>
                            <p className="text-xs text-neutral-400">Total Transactions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
                            <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{totalQty}</p>
                            <p className="text-xs text-neutral-400">Units Sold (this page)</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
                            <Coins className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">₱{totalRevenue.toFixed(2)}</p>
                            <p className="text-xs text-neutral-400">Revenue (this page)</p>
                        </div>
                    </div>
                </div>

                {/* Recent — SAME GRID */}
                {recentSales.length > 0 && (
                    <div>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            <TrendingUp className="h-4 w-4 text-emerald-600" /> Recent Auto-Deducted Sales
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {recentSales.slice(0, 5).map((s) => (
                                <div key={s.id} className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                                        <Pill className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{s.item?.name || 'Medicine'}</h4>
                                    <p className="mt-1 text-xs text-neutral-500">{s.patient?.name || s.walk_in_name || 'Walk-in'} • {s.quantity} {s.item?.unit}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-neutral-400">Total</span>
                                        <span className="text-sm font-bold text-emerald-600">₱{Number(s.total_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (s.quantity / 10) * 100)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sales Table — SAME AS PATIENT */}
                <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-700">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                                <Receipt className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Sales History</h3>
                                <p className="text-xs text-neutral-400">{sales.total} transactions • Medicine, qty, price, total — walk-in</p>
                            </div>
                        </div>
                        <div className="hidden items-center gap-2 text-xs text-neutral-500 sm:flex">
                            <Coins className="h-4 w-4 text-emerald-500" />
                            Total: <span className="font-bold text-neutral-900 dark:text-neutral-100">₱{totalRevenue.toFixed(2)}</span>
                        </div>
                    </div>

                    {sales.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <Receipt className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
                            <p className="text-sm text-neutral-400">No sales yet</p>
                            <p className="text-xs text-neutral-400">Pharmacist records walk-in sale → stock auto-deducts (20 → 3 = 17)</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300"><span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Date</span></th>
                                            <th className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300"><span className="flex items-center gap-1"><Users className="h-3 w-3" /> Patient</span></th>
                                            <th className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300"><span className="flex items-center gap-1"><Package className="h-3 w-3" /> Medicine</span></th>
                                            <th className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300">Quantity</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300">Unit Price</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300">Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                        {sales.data.map((sale) => (
                                            <tr key={sale.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                                <td className="whitespace-nowrap px-4 py-3 text-xs text-neutral-600 dark:text-neutral-400">{format(new Date(sale.created_at), 'MMM d, yyyy h:mm a')}</td>
                                                <td className="px-4 py-3"><p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{sale.patient?.name || sale.walk_in_name || 'Walk-in'}</p><p className="text-xs text-neutral-400">{sale.patient?.email || (sale.walk_in_name ? 'Walk-in (no account)' : '')}</p></td>
                                                <td className="px-4 py-3"><p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{sale.item?.name || '—'}</p><p className="text-xs text-neutral-400">{sale.item?.category} • {sale.item?.unit}</p></td>
                                                <td className="px-4 py-3"><span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">{sale.quantity} {sale.item?.unit}</span></td>
                                                <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300">₱{Number(sale.unit_price).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-sm font-bold text-emerald-600">₱{Number(sale.total_amount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {sales.last_page > 1 && (
                                <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 dark:border-neutral-700">
                                    <p className="text-xs text-neutral-400">Page {sales.current_page} of {sales.last_page} • {sales.total} sales</p>
                                    <div className="flex gap-1">
                                        {sales.links.map((link, i) => (
                                            <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} className={`rounded-md px-3 py-1 text-xs font-medium ${link.active ? 'bg-emerald-600 text-white' : 'text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 dark:text-neutral-300'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Walk-in Modal — pharmacist selects patient + qty, same as patient modal */}
            {showWalkIn && selectedMedicine && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-100"><ShoppingCart className="h-5 w-5 text-emerald-600" /> Walk-in Sale</h2>
                            <button onClick={() => setShowWalkIn(false)} className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="h-5 w-5 text-neutral-400" /></button>
                        </div>

                        <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{selectedMedicine.name}</p>
                            <p className="text-xs text-neutral-500">{selectedMedicine.description || 'Medicine'}</p>
                            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                                <div><p className="text-neutral-400">Available</p><p className="font-bold text-neutral-900 dark:text-neutral-100">{selectedMedicine.quantity} {selectedMedicine.unit}</p></div>
                                <div><p className="text-neutral-400">Unit Price</p><p className="font-bold text-emerald-600">₱{Number(selectedMedicine.unit_price).toFixed(2)}</p></div>
                            </div>
                        </div>

                        <form onSubmit={handleWalkInSubmit} className="space-y-5">
                            <div className="relative">
                                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">Patient (Walk-in) * — fillable & dropdown</label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                    <input
                                        type="text"
                                        value={patientQuery}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setPatientQuery(val);
                                            setShowPatientList(true);
                                            // If typing, clear selected patient_id unless val matches selected patient display
                                            const selected = patients.find((p) => String(p.id) === form.data.patient_id);
                                            const selectedLabel = selected ? `${selected.name} (${selected.username})` : '';
                                            if (val !== selectedLabel) {
                                                form.setData('patient_id', '');
                                                form.setData('walk_in_name', val);
                                            } else {
                                                form.setData('walk_in_name', '');
                                            }
                                            if (!val) {
                                                form.setData('patient_id', '');
                                                form.setData('walk_in_name', '');
                                            }
                                        }}
                                        onFocus={() => setShowPatientList(true)}
                                        onBlur={() => setTimeout(() => setShowPatientList(false), 150)}
                                        placeholder="Type walk-in name (e.g. Juan Cruz) or select existing patient"
                                        className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-9 text-sm placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                        required
                                    />
                                    {patientQuery && (
                                        <button type="button" onClick={() => { setPatientQuery(''); form.setData('patient_id',''); form.setData('walk_in_name',''); setShowPatientList(true); }} className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                                            <X className="h-3.5 w-3.5 text-neutral-400" />
                                        </button>
                                    )}
                                </div>
                                {/* Dropdown — filtered + walk-in create option */}
                                {showPatientList && (
                                    <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                                        {filteredPatients.length === 0 ? (
                                            <div className="p-3">
                                                <p className="text-center text-xs text-neutral-400">No existing patient found</p>
                                                {patientQuery.trim() && (
                                                    <button type="button" onClick={() => { form.setData('patient_id',''); form.setData('walk_in_name', patientQuery.trim()); setShowPatientList(false); }} className="mt-2 w-full rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700">
                                                        Create walk-in: "{patientQuery.trim()}" (no account needed)
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                {filteredPatients.slice(0, 20).map((p) => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => selectPatient(p)}
                                                        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${String(p.id) === form.data.patient_id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                                                    >
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30">{p.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{p.name}</p>
                                                            <p className="truncate text-xs text-neutral-400">{p.username} • {p.email}</p>
                                                        </div>
                                                        {String(p.id) === form.data.patient_id && <div className="h-2 w-2 rounded-full bg-emerald-600" />}
                                                    </button>
                                                ))}
                                                {patientQuery.trim() && !filteredPatients.some((p) => `${p.name} (${p.username})`.toLowerCase() === patientQuery.trim().toLowerCase() || p.name.toLowerCase() === patientQuery.trim().toLowerCase()) && (
                                                    <button type="button" onClick={() => { form.setData('patient_id',''); form.setData('walk_in_name', patientQuery.trim()); setShowPatientList(false); }} className="w-full border-t border-neutral-100 px-3 py-2.5 text-left text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-neutral-700 dark:text-emerald-400">
                                                        + Create walk-in patient "{patientQuery.trim()}" (patient didn't exist)
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                                {form.errors.patient_id && <p className="mt-1 text-xs text-red-500">{form.errors.patient_id}</p>}
                                {form.errors.walk_in_name && <p className="mt-1 text-xs text-red-500">{form.errors.walk_in_name}</p>}
                                <p className="mt-1 text-[11px] text-neutral-400">Fillable: type any walk-in name to create (no account needed) • Dropdown: select existing patient</p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">Quantity *</label>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => handleQty(-1)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"><Minus className="h-4 w-4" /></button>
                                    <input type="number" min="1" max={selectedMedicine.quantity} value={form.data.quantity} onChange={(e) => form.setData('quantity', e.target.value)} className="h-10 flex-1 rounded-xl border border-neutral-200 px-4 text-center text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" required />
                                    <button type="button" onClick={() => handleQty(1)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"><Plus className="h-4 w-4" /></button>
                                </div>
                                {form.errors.quantity && <p className="mt-1 text-xs text-red-500">{form.errors.quantity}</p>}
                                {form.errors.inventory_item_id && <p className="mt-1 text-xs text-red-500">{form.errors.inventory_item_id}</p>}
                                <p className="mt-1 text-xs text-neutral-400">Max: {selectedMedicine.quantity} {selectedMedicine.unit} • Walk-in: pharmacist records sale</p>
                            </div>

                            <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
                                <div className="flex justify-between text-sm"><span className="text-neutral-500">Medicine</span><span className="font-medium text-neutral-900 dark:text-neutral-100">{selectedMedicine.name}</span></div>
                                <div className="mt-2 flex justify-between text-sm"><span className="text-neutral-500">Qty × Price</span><span className="font-medium text-neutral-900 dark:text-neutral-100">{form.data.quantity} × ₱{Number(selectedMedicine.unit_price).toFixed(2)}</span></div>
                                <div className="mt-3 flex justify-between border-t border-neutral-200 pt-3 text-base font-bold dark:border-neutral-700"><span className="text-neutral-900 dark:text-neutral-100">Total Amount</span><span className="text-emerald-600">₱{totalPrice.toFixed(2)}</span></div>
                                <p className="mt-2 text-center text-[11px] text-neutral-400">Patient will see medicine/qty/price/total • Stock 20→17</p>
                            </div>

                            <button type="submit" disabled={form.processing} className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50">
                                {form.processing ? 'Recording...' : `Record Sale ₱${totalPrice.toFixed(2)}`}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
