import { Head, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import type { User } from '@/types/auth';
import {
    Stethoscope,
    UserCheck,
    Pill,
    Heart,
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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Welcome Banner */}
                <div className="flex items-center justify-between rounded-xl border border-sidebar-border/70 bg-white p-5 dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.color}`}>
                            <RoleIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                Welcome back, {user.name}
                            </h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                You are logged in as{' '}
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.badge}`}>
                                    {config.label}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
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
