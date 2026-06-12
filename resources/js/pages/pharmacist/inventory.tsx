import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import {
    Package,
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    ArrowUpCircle,
    ArrowDownCircle,
    Filter,
    AlertTriangle,
} from 'lucide-react';

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
    created_at: string;
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

type ItemFormData = {
    name: string;
    category: string;
    description: string;
    unit: string;
    quantity: string;
    minimum_stock: string;
    unit_price: string;
    expiration_date: string;
    supplier: string;
    batch_number: string;
    status: string;
};

const emptyForm: ItemFormData = {
    name: '', category: 'medicine', description: '', unit: 'pcs',
    quantity: '0', minimum_stock: '10', unit_price: '0',
    expiration_date: '', supplier: '', batch_number: '', status: 'active',
};

type AdjustFormData = { quantity: string; type: string; reason: string; notes: string };

export default function Inventory({ items, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [filterCategory, setFilterCategory] = useState(filters.category || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [filterStock, setFilterStock] = useState(filters.stock || '');
    const [showFilters, setShowFilters] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAdjust, setShowAdjust] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);

    const form = useForm<ItemFormData>({ ...emptyForm });
    const adjustForm = useForm<AdjustFormData>({ quantity: '', type: 'stock_out', reason: '', notes: '' });

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); applyFilters(); };

    const applyFilters = () => {
        router.get('/pharmacist/inventory', { search, category: filterCategory, status: filterStatus, stock: filterStock }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch(''); setFilterCategory(''); setFilterStatus(''); setFilterStock('');
        router.get('/pharmacist/inventory', {}, { preserveState: true });
    };

    const openCreate = () => {
        setEditingItem(null);
        form.setData({ ...emptyForm });
        setShowModal(true);
    };

    const openEdit = (item: InventoryItem) => {
        setEditingItem(item);
        form.setData({
            name: item.name, category: item.category, description: item.description || '',
            unit: item.unit, quantity: String(item.quantity), minimum_stock: String(item.minimum_stock),
            unit_price: item.unit_price, expiration_date: item.expiration_date?.slice(0, 10) || '',
            supplier: item.supplier || '', batch_number: item.batch_number || '', status: item.status,
        });
        setShowModal(true);
    };

    const openAdjust = (item: InventoryItem) => {
        setAdjustingItem(item);
        adjustForm.setData({ quantity: '', type: 'stock_out', reason: '', notes: '' });
        setShowAdjust(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            form.put(`/pharmacist/inventory/${editingItem.id}`, { onSuccess: () => setShowModal(false), preserveScroll: true });
        } else {
            form.post('/pharmacist/inventory', { onSuccess: () => setShowModal(false), preserveScroll: true });
        }
    };

    const handleAdjust = (e: React.FormEvent) => {
        e.preventDefault();
        if (!adjustingItem) return;
        adjustForm.patch(`/pharmacist/inventory/${adjustingItem.id}/adjust`, { onSuccess: () => setShowAdjust(false), preserveScroll: true });
    };

    const handleDelete = (item: InventoryItem) => {
        if (confirm(`Delete "${item.name}"? This cannot be undone.`)) {
            router.delete(`/pharmacist/inventory/${item.id}`, { preserveScroll: true });
        }
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
    const isExpiringSoon = (item: InventoryItem) => item.expiration_date && !isExpired(item) && new Date(item.expiration_date) <= new Date(Date.now() + 30 * 86400000);

    const inputCls = 'h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100';

    return (
        <>
            <Head title="Inventory Management" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <Package className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Inventory</h1>
                            <p className="text-xs text-neutral-400">{items.total} items</p>
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
                        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#0787f7] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0670d4]">
                            <Plus className="h-4 w-4" /> Add Item
                        </button>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                            <option value="">All Categories</option>
                            <option value="medicine">Medicine</option>
                            <option value="supply">Supply</option>
                            <option value="equipment">Equipment</option>
                        </select>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="discontinued">Discontinued</option>
                        </select>
                        <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                            <option value="">All Stock Levels</option>
                            <option value="low">Low Stock Only</option>
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
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Batch</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Status</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {items.data.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="whitespace-nowrap px-3 py-2.5">
                                            <p className="font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</p>
                                            {item.description && <p className="max-w-[160px] truncate text-[10px] text-neutral-400">{item.description}</p>}
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${categoryBadge(item.category)}`}>{item.category}</span>
                                        </td>
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
                                                <span className={`text-xs ${isExpired(item) ? 'font-bold text-red-600' : isExpiringSoon(item) ? 'font-medium text-amber-600' : 'text-neutral-600 dark:text-neutral-300'}`}>
                                                    {format(new Date(item.expiration_date), 'MMM d, yyyy')}
                                                    {isExpired(item) && <span className="ml-1 text-[10px]">EXPIRED</span>}
                                                </span>
                                            ) : <span className="text-neutral-400">—</span>}
                                        </td>
                                        <td className="max-w-[100px] truncate px-3 py-2.5 text-neutral-600 dark:text-neutral-300">{item.supplier || '—'}</td>
                                        <td className="whitespace-nowrap px-3 py-2.5 text-neutral-600 dark:text-neutral-300">{item.batch_number || '—'}</td>
                                        <td className="whitespace-nowrap px-3 py-2.5">
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${item.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>{item.status}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2.5">
                                            <div className="flex items-center gap-0.5">
                                                <button onClick={() => openAdjust(item)} className="rounded p-1 text-neutral-400 hover:bg-blue-50 hover:text-blue-600" title="Adjust Stock">
                                                    <ArrowDownCircle className="h-3.5 w-3.5" />
                                                </button>
                                                <button onClick={() => openEdit(item)} className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-[#0787f7]" title="Edit">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(item)} className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-500" title="Delete">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {items.data.length === 0 && (
                                    <tr><td colSpan={10} className="px-4 py-12 text-center text-neutral-400">No inventory items found.</td></tr>
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

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                            <button onClick={() => setShowModal(false)} className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="h-5 w-5 text-neutral-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Name *</label>
                                    <input type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className={inputCls} required />
                                    {form.errors.name && <p className="mt-1 text-xs text-red-500">{form.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Category *</label>
                                    <select value={form.data.category} onChange={(e) => form.setData('category', e.target.value)} className={inputCls}>
                                        <option value="medicine">Medicine</option>
                                        <option value="supply">Supply</option>
                                        <option value="equipment">Equipment</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Description</label>
                                <input type="text" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} className={inputCls} placeholder="Optional description" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Unit *</label>
                                    <select value={form.data.unit} onChange={(e) => form.setData('unit', e.target.value)} className={inputCls}>
                                        <option value="pcs">Pieces</option>
                                        <option value="tablets">Tablets</option>
                                        <option value="capsules">Capsules</option>
                                        <option value="bottles">Bottles</option>
                                        <option value="boxes">Boxes</option>
                                        <option value="vials">Vials</option>
                                        <option value="packs">Packs</option>
                                        <option value="rolls">Rolls</option>
                                        <option value="sets">Sets</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Quantity *</label>
                                    <input type="number" min="0" value={form.data.quantity} onChange={(e) => form.setData('quantity', e.target.value)} className={inputCls} required />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Min Stock *</label>
                                    <input type="number" min="0" value={form.data.minimum_stock} onChange={(e) => form.setData('minimum_stock', e.target.value)} className={inputCls} required />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Unit Price (₱) *</label>
                                    <input type="number" step="0.01" min="0" value={form.data.unit_price} onChange={(e) => form.setData('unit_price', e.target.value)} className={inputCls} required />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Expiration Date</label>
                                    <input type="date" value={form.data.expiration_date} onChange={(e) => form.setData('expiration_date', e.target.value)} className={inputCls} />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Supplier</label>
                                    <input type="text" value={form.data.supplier} onChange={(e) => form.setData('supplier', e.target.value)} className={inputCls} />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Batch Number</label>
                                    <input type="text" value={form.data.batch_number} onChange={(e) => form.setData('batch_number', e.target.value)} className={inputCls} />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Status</label>
                                <select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} className={inputCls}>
                                    <option value="active">Active</option>
                                    <option value="discontinued">Discontinued</option>
                                </select>
                            </div>
                            <div className="mt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300">Cancel</button>
                                <button type="submit" disabled={form.processing} className="rounded-lg bg-[#0787f7] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0670d4] disabled:opacity-50">
                                    {form.processing ? 'Saving...' : editingItem ? 'Update' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stock Adjustment Modal */}
            {showAdjust && adjustingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Adjust Stock</h2>
                            <button onClick={() => setShowAdjust(false)} className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="h-5 w-5 text-neutral-400" /></button>
                        </div>
                        <p className="mb-4 text-xs text-neutral-500">
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">{adjustingItem.name}</span> — Current stock: <span className="font-bold">{adjustingItem.quantity}</span> {adjustingItem.unit}
                        </p>
                        <form onSubmit={handleAdjust} className="grid gap-4">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Type *</label>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => adjustForm.setData('type', 'stock_in')} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${adjustForm.data.type === 'stock_in' ? 'border-green-300 bg-green-50 text-green-700' : 'border-neutral-200 text-neutral-600'}`}>
                                        <ArrowUpCircle className="h-3.5 w-3.5" /> Stock In
                                    </button>
                                    <button type="button" onClick={() => adjustForm.setData('type', 'stock_out')} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${adjustForm.data.type === 'stock_out' ? 'border-red-300 bg-red-50 text-red-700' : 'border-neutral-200 text-neutral-600'}`}>
                                        <ArrowDownCircle className="h-3.5 w-3.5" /> Stock Out
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Quantity *</label>
                                <input type="number" min="1" value={adjustForm.data.quantity} onChange={(e) => adjustForm.setData('quantity', e.target.value)} className={inputCls} required />
                                {adjustForm.errors.quantity && <p className="mt-1 text-xs text-red-500">{adjustForm.errors.quantity}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Reason *</label>
                                <select value={adjustForm.data.reason} onChange={(e) => adjustForm.setData('reason', e.target.value)} className={inputCls} required>
                                    <option value="">Select reason</option>
                                    <option value="dispensed">Dispensed to patient</option>
                                    <option value="expired">Expired</option>
                                    <option value="damaged">Damaged</option>
                                    <option value="restocked">Restocked</option>
                                    <option value="returned">Returned</option>
                                    <option value="correction">Inventory correction</option>
                                    <option value="other">Other</option>
                                </select>
                                {adjustForm.errors.reason && <p className="mt-1 text-xs text-red-500">{adjustForm.errors.reason}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Notes</label>
                                <input type="text" value={adjustForm.data.notes} onChange={(e) => adjustForm.setData('notes', e.target.value)} className={inputCls} placeholder="Optional notes..." />
                            </div>
                            <button type="submit" disabled={adjustForm.processing} className="w-full rounded-lg bg-[#0787f7] py-2.5 text-sm font-semibold text-white hover:bg-[#0670d4] disabled:opacity-50">
                                {adjustForm.processing ? 'Adjusting...' : 'Confirm Adjustment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
