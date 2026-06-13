import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import { BarChart3, Download, Filter } from 'lucide-react';

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

export default function Reports({ data, filters }: Props) {
    const [type, setType] = useState(filters.type || 'appointments');
    const [dateFrom, setDateFrom] = useState(filters.date_from || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [dateTo, setDateTo] = useState(filters.date_to || new Date().toISOString().split('T')[0]);
    const prefix = getRolePrefix();

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

    const summaryCards = () => {
        const s = data.summary as Record<string, unknown>;
        return Object.entries(s).filter(([_, v]) => typeof v !== 'object').map(([key, val]) => (
            <div key={key} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">{key.replace(/_/g, ' ')}</p>
                <p className="mt-1 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {typeof val === 'number' ? val.toLocaleString() : String(val)}
                </p>
            </div>
        ));
    };

    const summaryBreakdown = () => {
        const s = data.summary as Record<string, unknown>;
        const objects = Object.entries(s).filter(([_, v]) => typeof v === 'object' && v !== null);
        if (!objects.length) return null;

        return (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {objects.map(([key, val]) => (
                    <div key={key} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                        <p className="mb-2 text-xs font-semibold capitalize text-neutral-700 dark:text-neutral-200">{key.replace(/_/g, ' ')}</p>
                        <div className="space-y-1">
                            {Object.entries(val as Record<string, number>).map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between">
                                    <span className="text-xs capitalize text-neutral-500">{k.replace(/_/g, ' ')}</span>
                                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <BarChart3 className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Reports</h1>
                            <p className="text-xs text-neutral-400">Generate and export clinic reports</p>
                        </div>
                    </div>
                    {data.rows.length > 0 && (
                        <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                            <Download className="h-4 w-4" /> Export CSV
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Report Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                            <option value="appointments">Appointment Summary</option>
                            <option value="inventory">Inventory Usage</option>
                            <option value="low_stock">Low Stock & Expiration</option>
                            <option value="patients">Patient Visits</option>
                        </select>
                    </div>
                    {(type === 'appointments' || type === 'patients') && (
                        <>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">From</label>
                                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">To</label>
                                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                            </div>
                        </>
                    )}
                    <button onClick={generateReport} className="h-9 rounded-lg bg-[#0787f7] px-4 text-sm font-semibold text-white hover:bg-[#0670d4]">
                        Generate
                    </button>
                </div>

                {/* Report Title */}
                <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 dark:border-neutral-700 dark:bg-neutral-900">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{data.title}</h2>
                    <p className="text-xs text-neutral-400">Period: {data.period} · {data.rows.length} records</p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {summaryCards()}
                </div>

                {/* Breakdown */}
                {summaryBreakdown()}

                {/* Data Table */}
                {data.rows.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                                    <tr>
                                        {Object.keys(data.rows[0]).map((key) => (
                                            <th key={key} className="whitespace-nowrap px-3 py-2.5 font-semibold capitalize text-neutral-600 dark:text-neutral-300">
                                                {key.replace(/_/g, ' ')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                    {data.rows.map((row, i) => (
                                        <tr key={i} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
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
                )}

                {data.rows.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-16 dark:border-neutral-700">
                        <BarChart3 className="mb-3 h-10 w-10 text-neutral-300" />
                        <p className="text-sm font-medium text-neutral-400">No data for this report</p>
                        <p className="text-xs text-neutral-300">Try changing the date range or report type.</p>
                    </div>
                )}
            </div>
        </>
    );
}
