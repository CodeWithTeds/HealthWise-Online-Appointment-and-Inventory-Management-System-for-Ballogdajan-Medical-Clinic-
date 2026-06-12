import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { AlertTriangle, Package } from 'lucide-react';

type InventoryItem = {
    id: number;
    name: string;
    category: string;
    unit: string;
    quantity: number;
    minimum_stock: number;
    expiration_date: string | null;
    status: string;
};

type Props = {
    alerts: InventoryItem[];
};

export default function DoctorInventoryAlerts({ alerts }: Props) {
    const isExpired = (item: InventoryItem) => item.expiration_date && new Date(item.expiration_date) < new Date();
    const isExpiringSoon = (item: InventoryItem) => item.expiration_date && !isExpired(item) && new Date(item.expiration_date) <= new Date(Date.now() + 30 * 86400000);
    const isLow = (item: InventoryItem) => item.quantity <= item.minimum_stock;

    const expired = alerts.filter(isExpired);
    const expiringSoon = alerts.filter((i) => isExpiringSoon(i) && !isExpired(i));
    const lowStock = alerts.filter((i) => isLow(i) && !isExpired(i));

    return (
        <>
            <Head title="Inventory Alerts (View Only)" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Inventory Alerts</h1>
                        <p className="text-xs text-neutral-400">{alerts.length} items need attention · View only</p>
                    </div>
                </div>

                {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-16 dark:border-neutral-700">
                        <Package className="mb-3 h-10 w-10 text-green-400" />
                        <p className="text-sm font-medium text-green-600">All good! No alerts.</p>
                        <p className="text-xs text-neutral-400">Stock levels and expiration dates are within range.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {expired.length > 0 && (
                            <div>
                                <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-700">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px]">🚨</span>
                                    Expired ({expired.length})
                                </h2>
                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {expired.map((item) => (
                                        <div key={item.id} className="rounded-xl border border-red-200 bg-red-50/50 p-3 dark:border-red-900/50 dark:bg-red-900/10">
                                            <p className="text-xs font-bold text-red-800 dark:text-red-300">{item.name}</p>
                                            <p className="mt-1 text-[10px] text-red-600">Expired: {item.expiration_date && format(new Date(item.expiration_date), 'MMM d, yyyy')}</p>
                                            <p className="text-[10px] text-red-500">Stock: {item.quantity} {item.unit}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {expiringSoon.length > 0 && (
                            <div>
                                <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-700">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px]">⚠️</span>
                                    Expiring Soon ({expiringSoon.length})
                                </h2>
                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {expiringSoon.map((item) => (
                                        <div key={item.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-900/10">
                                            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">{item.name}</p>
                                            <p className="mt-1 text-[10px] text-amber-600">Expires: {item.expiration_date && format(new Date(item.expiration_date), 'MMM d, yyyy')}</p>
                                            <p className="text-[10px] text-amber-500">Stock: {item.quantity} {item.unit}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {lowStock.length > 0 && (
                            <div>
                                <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-700">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-[10px]">📦</span>
                                    Low Stock ({lowStock.length})
                                </h2>
                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {lowStock.map((item) => (
                                        <div key={item.id} className="rounded-xl border border-orange-200 bg-orange-50/50 p-3 dark:border-orange-900/50 dark:bg-orange-900/10">
                                            <p className="text-xs font-bold text-orange-800 dark:text-orange-300">{item.name}</p>
                                            <p className="mt-1 text-[10px] text-orange-600">Stock: {item.quantity} / min: {item.minimum_stock} {item.unit}</p>
                                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-orange-200">
                                                <div className="h-full rounded-full bg-orange-500" style={{ width: `${Math.min(100, (item.quantity / item.minimum_stock) * 100)}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
