import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import { Package, Search, Filter, AlertTriangle, Eye } from 'lucide-react';

type InventoryItem = {
    id: number;
    name: string;
    category: string;
    description: string | null;
    unit: string;
    quantity: number;
    minimum_stock: number;
    unit_price: string;
    expiration_date: string | null;
    supplier: string | null;
    batch_number: string | null;
    status: string;
};

type PaginatedItems = {
    data: InventoryItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    items: PaginatedItems;
    filters: { search?: string; category?: string; status?: string; stock?: string };
};

export default function DoctorInventory({ items, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [filterCategory, setFilterCategory] = useState(filters.category || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); applyFilters(); };

    const applyFilters = () => {
        router.get('/doctor/inventory', { search, category: filterCategory }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch(''); setFilterCategory('');
        router.get('/doctor/inventory', {}, { preserveState: true });
    };

    const categoryBadge = (cat: string) => {
        switch (cat) {
            case 'medicine': return 'bg-blue-50 text-blue-700';
            case 'supply': return 'bg-green-50 text-green-700';
            case 'equipment': return 'bg-purple-50 text-purple-700';
            default: return 'bg-neutral-50 text-neutral-600';
        }
    };

    const isLow = (item: InventoryItem) => item.quantity <= item.minimum_stock;
    const isExpired = (item: InventoryItem) => item.expiration_date && new Date(item.expiration_date) < new Date();

    return (
        <>
            <Head title="Inventory (View Only)" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <Package className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Inventory</h1>
                            <p className="text-xs text-neutral-400">{items.total} items · <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> View only</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <input type="text" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-48 rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                        </form>
                        <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300">
                            <Filter className="h-3.5 w-3.5" /> Filters
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                            <option value="">All Categories</option>
                            <option value="medicine">Medicine</option>
                            <option value="supply">Supply</option>
                            <option value="equipment">Equipment</option>
                        </select>
                        <button onClick={applyFilters} className="h-8 rounded-lg bg-[#0787f7] px-3 text-xs font-semibold text-white hover:bg-[#0670d4]">Apply</button>
                        <button onClick={clearFilters} className="h-8 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700">Clear</button>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Item</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Category</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Stock</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Unit</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Price</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Expiration</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Supplier</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {items.data.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="whitespace-nowrap px-3 py-2.5">
                                            <p className="font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</p>
                                            {item.description && <p className="max-w-[160px] truncate text-[10px] text-neutral-400">{item.description}</p>}
                                        </td>
                                        <td className="px-3 py-2.5"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${categoryBadge(item.category)}`}>{item.category}</span></td>
                                        <td className="whitespace-nowrap px-3 py-2.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-sm font-bold ${isLow(item) ? 'text-red-600' : 'text-neutral-900 dark:text-neutral-100'}`}>{item.quantity}</span>
                                                {isLow(item) && <AlertTriangle className="h-3 w-3 text-red-500" />}
                                            </div>
                                            <p className="text-[10px] text-neutral-400">min: {item.minimum_stock}</p>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2.5 text-neutral-600 dark:text-neutral-300">{item.unit}</td>
                                        <td className="whitespace-nowrap px-3 py-2.5 text-neutral-600 dark:text-neutral-300">₱{Number(item.unit_price).toFixed(2)}</td>
                                        <td className="whitespace-nowrap px-3 py-2.5">
                                            {item.expiration_date ? (
                                                <span className={`text-xs ${isExpired(item) ? 'font-bold text-red-600' : 'text-neutral-600 dark:text-neutral-300'}`}>
                                                    {format(new Date(item.expiration_date), 'MMM d, yyyy')}
                                                    {isExpired(item) && <span className="ml-1 text-[10px]">EXPIRED</span>}
                                                </span>
                                            ) : <span className="text-neutral-400">—</span>}
                                        </td>
                                        <td className="max-w-[100px] truncate px-3 py-2.5 text-neutral-600 dark:text-neutral-300">{item.supplier || '—'}</td>
                                        <td className="whitespace-nowrap px-3 py-2.5">
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${item.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>{item.status}</span>
                                        </td>
                                    </tr>
                                ))}
                                {items.data.length === 0 && (
                                    <tr><td colSpan={8} className="px-4 py-12 text-center text-neutral-400">No inventory items found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {items.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 dark:border-neutral-700">
                            <p className="text-xs text-neutral-400">Page {items.current_page} of {items.last_page} · {items.total} items</p>
                            <div className="flex gap-1">
                                {items.links.map((link, i) => (
                                    <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} className={`rounded-md px-3 py-1 text-xs font-medium ${link.active ? 'bg-[#0787f7] text-white' : 'text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 dark:text-neutral-300'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
