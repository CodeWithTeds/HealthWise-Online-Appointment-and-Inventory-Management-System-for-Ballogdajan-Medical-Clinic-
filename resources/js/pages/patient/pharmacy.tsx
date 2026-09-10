import { Head, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Pill, Search, Package, AlertTriangle, Receipt, Coins, ShoppingCart, Info } from 'lucide-react';
import { FlashAlert } from '@/components/flash-alert';
import type { User } from '@/types/auth';

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

type Purchase = {
    id: number;
    quantity: number;
    unit_price: string;
    total_amount: string;
    created_at: string;
    item: {
        id: number;
        name: string;
        unit: string;
        category: string;
    };
};

type PaginatedPurchases = {
    data: Purchase[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    medicines: Medicine[];
    purchases: PaginatedPurchases;
    allPurchases: Purchase[];
};

export default function Pharmacy({ medicines, purchases, allPurchases }: Props) {
    const { auth } = usePage().props as { auth: { user: User } };
    const [search, setSearch] = useState('');

    const filteredMedicines = useMemo(() => {
        if (!search) return medicines;
        const q = search.toLowerCase();
        return medicines.filter((m) => m.name.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q));
    }, [medicines, search]);

    const totalSpent = useMemo(() => allPurchases.reduce((sum, p) => sum + parseFloat(p.total_amount), 0), [allPurchases]);

    const isLowStock = (m: Medicine) => m.quantity <= m.minimum_stock;
    const isExpiringSoon = (m: Medicine) => m.expiration_date && new Date(m.expiration_date) <= new Date(Date.now() + 30 * 86400000) && new Date(m.expiration_date) > new Date();

    return (
        <>
            <Head title="Pharmacy" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6">
                <FlashAlert />

                {/* Header — walk-in note */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 sm:p-8">
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/70">Welcome, {auth.user.name.split(' ')[0]}!</p>
                            <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
                                <Pill className="h-7 w-7" /> Pharmacy
                            </h1>
                            <p className="mt-2 max-w-md text-sm text-white/60">Walk-in only — visit the pharmacist counter to purchase. Your purchases appear below.</p>
                            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                                <Info className="h-3 w-3" /> Pharmacist handles all sales • Auto-deducts stock (20 → 3 = 17)
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
                                <p className="text-xs text-white/70">Total Spent</p>
                                <p className="text-lg font-bold text-white">₱{totalSpent.toFixed(2)}</p>
                            </div>
                            <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
                                <p className="text-xs text-white/70">Purchases</p>
                                <p className="text-lg font-bold text-white">{allPurchases.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Available Medicines</h2>
                        <p className="text-xs text-neutral-400">{filteredMedicines.length} medicines in stock • Walk-in at pharmacist counter</p>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search medicines..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                    </div>
                </div>

                {/* Medicines Grid — VIEW ONLY */}
                {filteredMedicines.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-16 dark:border-neutral-700">
                        <Package className="mb-3 h-10 w-10 text-neutral-300" />
                        <p className="text-sm font-medium text-neutral-400">No medicines found</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredMedicines.map((med) => (
                            <div key={med.id} className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
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
                                <div className="mt-4 rounded-xl bg-neutral-50 px-3 py-2.5 text-center dark:bg-neutral-800">
                                    <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                                        <ShoppingCart className="h-3.5 w-3.5" /> Walk-in at Pharmacist Counter
                                    </p>
                                    <p className="mt-1 text-[10px] text-neutral-400">Pharmacist will record sale • Auto-deduct 20→17</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Purchase History — patient sees medicine/qty/price/total */}
                <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-700">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                                <Receipt className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">My Purchases</h3>
                                <p className="text-xs text-neutral-400">{allPurchases.length} transactions • Medicine, qty, price, total</p>
                            </div>
                        </div>
                        <div className="hidden items-center gap-2 text-xs text-neutral-500 sm:flex">
                            <Coins className="h-4 w-4 text-emerald-500" />
                            Total: <span className="font-bold text-neutral-900 dark:text-neutral-100">₱{totalSpent.toFixed(2)}</span>
                        </div>
                    </div>

                    {allPurchases.length === 0 ? (
                        <div className="py-12 text-center">
                            <Receipt className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
                            <p className="text-sm text-neutral-400">No purchases yet</p>
                            <p className="text-xs text-neutral-400">Visit pharmacist counter — they will record your walk-in purchase here</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300">Date</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300">Medicine</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300">Quantity</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300">Unit Price</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300">Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                        {purchases.data.map((sale) => (
                                            <tr key={sale.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                                <td className="whitespace-nowrap px-4 py-3 text-xs text-neutral-600 dark:text-neutral-400">
                                                    {format(new Date(sale.created_at), 'MMM d, yyyy h:mm a')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{sale.item.name}</p>
                                                    <p className="text-xs text-neutral-400">{sale.item.unit}</p>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                    {sale.quantity} <span className="text-xs text-neutral-400">{sale.item.unit}</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300">₱{Number(sale.unit_price).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-sm font-bold text-emerald-600">₱{Number(sale.total_amount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {purchases.last_page > 1 && (
                                <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 dark:border-neutral-700">
                                    <p className="text-xs text-neutral-400">
                                        Page {purchases.current_page} of {purchases.last_page} • {purchases.total} purchases
                                    </p>
                                    <div className="flex gap-1">
                                        {purchases.links.map((link, i) => (
                                            <button
                                                key={i}
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                                className={`rounded-md px-3 py-1 text-xs font-medium ${link.active ? 'bg-emerald-600 text-white' : 'text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 dark:text-neutral-300'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
