import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import type { User } from '@/types/auth';
import {
    Stethoscope,
    UserCheck,
    Pill,
    Heart,
    Calendar,
    ClipboardList,
    Package,
    Bell,
} from 'lucide-react';

const roleConfig = {
    doctor: { label: 'Doctor', icon: Stethoscope, color: 'bg-emerald-50 text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    secretary: { label: 'Secretary', icon: UserCheck, color: 'bg-purple-50 text-purple-600', badge: 'bg-purple-100 text-purple-700' },
    pharmacist: { label: 'Pharmacist', icon: Pill, color: 'bg-amber-50 text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    patient: { label: 'Patient', icon: Heart, color: 'bg-rose-50 text-rose-600', badge: 'bg-rose-100 text-rose-700' },
} as const;

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user as User;
    const config = roleConfig[user.role] ?? roleConfig.patient;
    const RoleIcon = config.icon;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Welcome Section with Logo */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-sidebar-border/50 bg-white px-8 py-12 text-center dark:border-sidebar-border dark:bg-neutral-900">
                    <img
                        src="/images/logo.png"
                        alt="HealthWise"
                        className="mb-6 h-24 w-24 object-contain"
                    />
                    <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
                        Welcome to <span className="text-[#0787f7]">HealthWise</span>
                    </h1>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        Ballogdajan Medical Clinic — Integrated Online Appointment, Patient Record & Inventory Management System
                    </p>

                    {/* User Info */}
                    <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-neutral-100 bg-neutral-50 px-5 py-2.5 dark:border-neutral-800 dark:bg-neutral-800">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${config.color}`}>
                            <RoleIcon className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{user.name}</p>
                            <p className="text-xs text-neutral-400">
                                Logged in as{' '}
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.badge}`}>
                                    {config.label}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/50 bg-white p-5 dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <Calendar className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">0</p>
                            <p className="text-xs text-neutral-400">Appointments Today</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/50 bg-white p-5 dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
                            <ClipboardList className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">0</p>
                            <p className="text-xs text-neutral-400">Patient Records</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/50 bg-white p-5 dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/10">
                            <Package className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">0</p>
                            <p className="text-xs text-neutral-400">Inventory Items</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/50 bg-white p-5 dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-500/10">
                            <Bell className="h-5 w-5 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">0</p>
                            <p className="text-xs text-neutral-400">Notifications</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
