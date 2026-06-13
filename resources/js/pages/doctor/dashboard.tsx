import { Head, usePage } from '@inertiajs/react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
    Calendar, Users, CheckCircle, XCircle, Clock, AlertTriangle, Package, TrendingUp,
} from 'lucide-react';
import type { User } from '@/types/auth';

type Stats = {
    today: {
        appointments: number;
        completed: number;
        pending: number;
        cancelled: number;
        new_patients: number;
        total_patients: number;
        low_stock: number;
        expired: number;
    };
    chart_7days: { date: string; appointments: number; completed: number; cancelled: number; patients: number }[];
    chart_30days: { date: string; appointments: number; completed: number }[];
    status_breakdown: { pending: number; confirmed: number; completed: number; cancelled: number; not_arrived: number };
};

type Props = { stats: Stats };

const COLORS = ['#f59e0b', '#0787f7', '#10b981', '#ef4444', '#6b7280'];

export default function DoctorDashboard({ stats }: Props) {
    const { auth } = usePage().props;
    const user = auth.user as User;

    const pieData = Object.entries(stats.status_breakdown)
        .filter(([_, v]) => v > 0)
        .map(([name, value]) => ({ name: name.replace('_', ' '), value }));

    const totalAppts = Object.values(stats.status_breakdown).reduce((a, b) => a + b, 0);

    return (
        <>
            <Head title="Doctor Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
                {/* Welcome */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-neutral-900 dark:text-neutral-100">
                            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, Dr. {user.name.split(' ').pop()}
                        </h1>
                        <p className="text-xs text-neutral-400">Here's your clinic overview for today</p>
                    </div>
                    <span className="rounded-full bg-[#0787f7]/10 px-3 py-1 text-[10px] font-bold text-[#0787f7]">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={Calendar} label="Today's Appointments" value={stats.today.appointments} color="bg-blue-500" />
                    <StatCard icon={CheckCircle} label="Completed" value={stats.today.completed} color="bg-emerald-500" />
                    <StatCard icon={Clock} label="Pending" value={stats.today.pending} color="bg-amber-500" />
                    <StatCard icon={Users} label="Total Patients" value={stats.today.total_patients} color="bg-purple-500" />
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Area Chart - 7 Day Trend */}
                    <div className="lg:col-span-2 rounded-xl border border-neutral-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Appointment Trends</h3>
                                <p className="text-[10px] text-neutral-400">Last 7 days</p>
                            </div>
                            <TrendingUp className="h-4 w-4 text-[#0787f7]" />
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={stats.chart_7days}>
                                <defs>
                                    <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0787f7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0787f7" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                                <Area type="monotone" dataKey="appointments" stroke="#0787f7" strokeWidth={2} fillOpacity={1} fill="url(#colorAppts)" name="Total" />
                                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" name="Completed" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart - Status Breakdown */}
                    <div className="rounded-xl border border-neutral-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-3">
                            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Status Breakdown</h3>
                            <p className="text-[10px] text-neutral-400">{totalAppts} total appointments</p>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                                    {pieData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
                            {pieData.map((entry, i) => (
                                <div key={entry.name} className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-[10px] capitalize text-neutral-500">{entry.name} ({entry.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Bar Chart - 30 Day Overview */}
                    <div className="rounded-xl border border-neutral-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Monthly Overview</h3>
                                <p className="text-[10px] text-neutral-400">Last 30 days</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={stats.chart_30days} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" interval={4} />
                                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                                <Bar dataKey="appointments" fill="#0787f7" radius={[3, 3, 0, 0]} name="Appointments" />
                                <Bar dataKey="completed" fill="#10b981" radius={[3, 3, 0, 0]} name="Completed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Quick Alerts */}
                    <div className="rounded-xl border border-neutral-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                        <h3 className="mb-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">Quick Alerts</h3>
                        <div className="space-y-2">
                            <AlertRow icon={Clock} label="Pending Appointments" value={stats.today.pending} color="text-amber-500" bg="bg-amber-50" />
                            <AlertRow icon={XCircle} label="Cancelled Today" value={stats.today.cancelled} color="text-red-500" bg="bg-red-50" />
                            <AlertRow icon={Users} label="New Patients Today" value={stats.today.new_patients} color="text-blue-500" bg="bg-blue-50" />
                            <AlertRow icon={AlertTriangle} label="Low Stock Items" value={stats.today.low_stock} color="text-orange-500" bg="bg-orange-50" />
                            <AlertRow icon={Package} label="Expired Items" value={stats.today.expired} color="text-red-500" bg="bg-red-50" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Calendar; label: string; value: number; color: string }) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-neutral-100 bg-white p-4 transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-neutral-50 transition-all group-hover:bg-neutral-100 dark:bg-neutral-800" />
            <div className="relative flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                    <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100">{value}</p>
                    <p className="text-[10px] font-medium text-neutral-400">{label}</p>
                </div>
            </div>
        </div>
    );
}

function AlertRow({ icon: Icon, label, value, color, bg }: { icon: typeof Calendar; label: string; value: number; color: string; bg: string }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-neutral-50 p-2.5 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                </div>
                <span className="text-xs text-neutral-600 dark:text-neutral-300">{label}</span>
            </div>
            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{value}</span>
        </div>
    );
}
