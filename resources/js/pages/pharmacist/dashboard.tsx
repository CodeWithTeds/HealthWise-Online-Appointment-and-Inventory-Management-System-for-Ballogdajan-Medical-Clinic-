import { Head, Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Package,
    AlertTriangle,
    Clock,
    XCircle,
} from 'lucide-react';
import type { User } from '@/types/auth';

type Stats = {
    total_items: number;
    low_stock: number;
    expiring_soon: number;
    expired: number;
};

type AlertItem = {
    id: number;
    name: string;
    category: string;
    quantity: number;
    minimum_stock: number;
    expiration_date: string | null;
};

type Props = {
    stats: Stats;
    recentAlerts: AlertItem[];
};

export default function PharmacistDashboard({ stats, recentAlerts }: Props) {
    const { auth } = usePage().props;
    const user = auth.user as User;

    const isLowStock = (item: AlertItem) => item.quantity <= item.minimum_stock;
    const isExpiringSoon = (item: AlertItem) => {
        if (!item.expiration_date) return false;
        const exp = new Date(item.expiration_date);
        return exp <= new Date(Date.now() + 30 * 86400000) && exp > new Date();
    };
    const isExpired = (item: AlertItem) => {
        if (!item.expiration_date) return false;
        return new Date(item.expiration_date) <= new Date();
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Welcome */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-6 sm:p-8">
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
                    <div className="relative">
                        <p className="text-sm font-medium text-white/70">Welcome back,</p>
                        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{user.name}</h1>
                        <p className="mt-2 max-w-md text-sm text-white/60">
                            Manage inventory, track stock levels, and monitor expiration dates.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <Package className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.total_items}</p>
                            <p className="text-xs text-neutral-400">Total Items</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/10">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.low_stock}</p>
                            <p className="text-xs text-neutral-400">Low Stock</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500/10">
                            <Clock className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.expiring_soon}</p>
                            <p className="text-xs text-neutral-400">Expiring Soon</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500/10">
                            <XCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.expired}</p>
                            <p className="text-xs text-neutral-400">Expired</p>
                        </div>
                    </div>
                </div>

                {/* Alerts Table */}
                <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3 dark:border-neutral-700">
                        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Inventory Alerts</h2>
                        <Link href="/pharmacist/inventory-alerts" className="text-xs font-medium text-[#0787f7] hover:underline">
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
                        {recentAlerts.length === 0 ? (
                            <div className="py-8 text-center">
                                <Package className="mx-auto mb-2 h-8 w-8 text-neutral-300 dark:text-neutral-600" />
                                <p className="text-sm text-neutral-400">No alerts — everything looks good!</p>
                            </div>
                        ) : (
                            recentAlerts.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isExpired(item) ? 'bg-red-50 dark:bg-red-900/20' : isLowStock(item) ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                                        {isExpired(item) ? (
                                            <XCircle className="h-4 w-4 text-red-500" />
                                        ) : isLowStock(item) ? (
                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-orange-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">{item.name}</p>
                                        <p className="text-[10px] text-neutral-400">{item.category}</p>
                                    </div>
                                    <div className="text-right">
                                        {isLowStock(item) && (
                                            <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                                Stock: {item.quantity}/{item.minimum_stock}
                                            </span>
                                        )}
                                        {item.expiration_date && (isExpired(item) || isExpiringSoon(item)) && (
                                            <span className={`ml-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${isExpired(item) ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'}`}>
                                                {isExpired(item) ? 'Expired' : `Exp: ${format(new Date(item.expiration_date), 'MMM d')}`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                        href="/pharmacist/inventory"
                        className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-amber-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                            <Package className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Manage Inventory</p>
                            <p className="text-[10px] text-neutral-400">Add, edit, and adjust stock</p>
                        </div>
                    </Link>
                    <Link
                        href="/pharmacist/inventory-alerts"
                        className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-amber-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Inventory Alerts</p>
                            <p className="text-[10px] text-neutral-400">Low stock & expiring items</p>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}
