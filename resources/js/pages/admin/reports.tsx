import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import { BarChart3, Download, TrendingUp, Package, Users, AlertTriangle, Calendar, Activity } from 'lucide-react';

type ReportData = {
    type: string;
    title: string;
    period: string;
    summary: Record<string, unknown>;
    rows: Record<string, unknown>[];
};

type Props = {
    data: ReportData;
    filters: { type?: string; date_from?: string; date_to?: string };
};

function getRolePrefix(): string {
    const path = window.location.pathname;
    if (path.startsWith('/doctor')) return '/doctor';
    return '/secretary';
}

const reportTypes = [
    { value: 'appointments', label: 'Appointments', icon: Calendar, color: 'from-blue-500 to-blue-600' },
    { value: 'inventory', label: 'Inventory', icon: Package, color: 'from-purple-500 to-purple-600' },
    { value: 'low_stock', label: 'Low Stock', icon: AlertTriangle, color: 'from-amber-500 to-orange-500' },
    { value: 'patients', label: 'Patients', icon: Users, color: 'from-emerald-500 to-teal-600' },
];

export default function Reports({ data, filters }: Props) {
    const [type, setType] = useState(filters.type || 'appointments');
    const [dateFrom, setDateFrom] = useState(filters.date_from || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [dateTo, setDateTo] = useState(filters.date_to || new Date().toISOString().split('T')[0]);
    const prefix = getRolePrefix();

    const activeReport = reportTypes.find((r) => r.value === type) || reportTypes[0];

    const generateReport = () => {
        router.get(`${prefix}/reports`, { type, date_from: dateFrom, date_to: dateTo }, { preserveState: true });
    };

    const exportCSV = () => {
        if (!data.rows.length) return;
        const headers = Object.keys(data.rows[0]);
        const csvRows = data.rows.map((row) =>
            headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
        );
        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.type}_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
                {/* Hero Header */}
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${activeReport.color} p-5 sm:p-6`}>
                    <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <activeReport.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white sm:text-xl">{data.title}</h1>
                                <p className="text-xs text-white/70">Period: {data.period} · {data.rows.length} records</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {data.rows.length > 0 && (
                                <button onClick={exportCSV} className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30">
                                    <Download className="h-3.5 w-3.5" /> Export CSV
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Report Type Tabs + Date Filter */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
                        {reportTypes.map((rt) => (
                            <button
                                key={rt.value}
                                onClick={() => { setType(rt.value); }}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                    type === rt.value
                                        ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100'
                                        : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
                                }`}
                            >
                                <rt.icon className="h-3 w-3" />
                                {rt.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        {(type === 'appointments' || type === 'patients') && (
                            <>
                                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                                <span className="text-[10px] text-neutral-400">to</span>
                                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                            </>
                        )}
                        <button onClick={generateReport} className="h-8 rounded-lg bg-[#0787f7] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#0670d4]">Generate</button>
                    </div>
                </div>

                {/* Summary Stats */}
                {Object.keys(data.summary).length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                        {Object.entries(data.summary).filter(([_, v]) => typeof v !== 'object').map(([key, val]) => (
                            <div key={key} className="group relative overflow-hidden rounded-xl border border-neutral-100 bg-white p-3 transition-all hover:border-neutral-200 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-[#0787f7]/5 transition-all group-hover:bg-[#0787f7]/10" />
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">{key.replace(/_/g, ' ')}</p>
                                <p className="mt-0.5 text-xl font-black text-neutral-900 dark:text-neutral-100">
                                    {typeof val === 'number' ? val.toLocaleString() : String(val)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Breakdown Cards */}
                {Object.entries(data.summary).filter(([_, v]) => typeof v === 'object' && v !== null).length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {Object.entries(data.summary).filter(([_, v]) => typeof v === 'object' && v !== null).map(([key, val]) => (
                            <div key={key} className="rounded-xl border border-neutral-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
                                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">{key.replace(/_/g, ' ')}</p>
                                <div className="space-y-1.5">
                                    {Object.entries(val as Record<string, number>).map(([k, v]) => {
                                        const total = Object.values(val as Record<string, number>).reduce((a, b) => a + b, 0);
                                        const pct = total > 0 ? (v / total) * 100 : 0;
                                        return (
                                            <div key={k}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] capitalize text-neutral-600 dark:text-neutral-300">{k.replace(/_/g, ' ')}</span>
                                                    <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100">{v}</span>
                                                </div>
                                                <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                                                    <div className="h-full rounded-full bg-[#0787f7]" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Data Table */}
                {data.rows.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-neutral-100 bg-neutral-50/80 dark:border-neutral-700 dark:bg-neutral-800/50">
                                    <tr>
                                        {Object.keys(data.rows[0]).map((key) => (
                                            <th key={key} className="whitespace-nowrap px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                                {key.replace(/_/g, ' ')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                                    {data.rows.map((row, i) => (
                                        <tr key={i} className="transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                                            {Object.values(row).map((val, j) => (
                                                <td key={j} className="whitespace-nowrap px-3 py-2 text-neutral-700 dark:text-neutral-300">
                                                    {val !== null && val !== undefined ? String(val) : '—'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-16 dark:border-neutral-700">
                        <Activity className="mb-3 h-10 w-10 text-neutral-300" />
                        <p className="text-sm font-medium text-neutral-400">No data for this report</p>
                        <p className="text-xs text-neutral-300">Try changing the date range or report type.</p>
                    </div>
                )}
            </div>
        </>
    );
}
