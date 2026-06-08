import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Calendar,
    ClipboardList,
    Package,
    AlertTriangle,
    Users,
    BarChart3,
    Bell,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import type { User } from '@/types/auth';

const doctorNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/doctor/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Appointment Scheduling',
        href: '/doctor/appointment-scheduling',
        icon: Calendar,
    },
    {
        title: 'Appointment Management',
        href: '/doctor/appointment-management',
        icon: Users,
    },
    {
        title: 'Patient Record Management',
        href: '/doctor/patient-records',
        icon: ClipboardList,
    },
    {
        title: 'Inventory Management',
        href: '/doctor/inventory',
        icon: Package,
    },
    {
        title: 'Inventory Alerts',
        href: '/doctor/inventory-alerts',
        icon: AlertTriangle,
    },
    {
        title: 'Report Generation',
        href: '/doctor/reports',
        icon: BarChart3,
    },
    {
        title: 'Notifications',
        href: '/doctor/notifications',
        icon: Bell,
    },
];

const secretaryNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/secretary/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Appointment Scheduling',
        href: '/secretary/appointment-scheduling',
        icon: Calendar,
    },
    {
        title: 'Appointment Management',
        href: '/secretary/appointment-management',
        icon: Users,
    },
    {
        title: 'Patient Record Management',
        href: '/secretary/patient-records',
        icon: ClipboardList,
    },
    {
        title: 'Inventory Management',
        href: '/secretary/inventory',
        icon: Package,
    },
    {
        title: 'Inventory Alerts',
        href: '/secretary/inventory-alerts',
        icon: AlertTriangle,
    },
    {
        title: 'Report Generation',
        href: '/secretary/reports',
        icon: BarChart3,
    },
    {
        title: 'Notifications',
        href: '/secretary/notifications',
        icon: Bell,
    },
];

const pharmacistNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/pharmacist/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Appointment Scheduling',
        href: '/pharmacist/appointment-scheduling',
        icon: Calendar,
    },
    {
        title: 'Appointment Management',
        href: '/pharmacist/appointment-management',
        icon: Users,
    },
    {
        title: 'Patient Record Management',
        href: '/pharmacist/patient-records',
        icon: ClipboardList,
    },
    {
        title: 'Inventory Management',
        href: '/pharmacist/inventory',
        icon: Package,
    },
    {
        title: 'Inventory Alerts',
        href: '/pharmacist/inventory-alerts',
        icon: AlertTriangle,
    },
    {
        title: 'Report Generation',
        href: '/pharmacist/reports',
        icon: BarChart3,
    },
    {
        title: 'Notifications',
        href: '/pharmacist/notifications',
        icon: Bell,
    },
];

const patientNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/patient/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Appointment Scheduling',
        href: '/patient/appointment-scheduling',
        icon: Calendar,
    },
    {
        title: 'Appointment Management',
        href: '/patient/appointment-management',
        icon: Users,
    },
    {
        title: 'Patient Record Management',
        href: '/patient/patient-records',
        icon: ClipboardList,
    },
    {
        title: 'Inventory Management',
        href: '/patient/inventory',
        icon: Package,
    },
    {
        title: 'Inventory Alerts',
        href: '/patient/inventory-alerts',
        icon: AlertTriangle,
    },
    {
        title: 'Report Generation',
        href: '/patient/reports',
        icon: BarChart3,
    },
    {
        title: 'Notifications',
        href: '/patient/notifications',
        icon: Bell,
    },
];

function getNavItemsByRole(role: string | undefined): NavItem[] {
    switch (role) {
        case 'doctor':
            return doctorNavItems;
        case 'secretary':
            return secretaryNavItems;
        case 'pharmacist':
            return pharmacistNavItems;
        case 'patient':
            return patientNavItems;
        default:
            return [{ title: 'Dashboard', href: dashboard(), icon: LayoutGrid }];
    }
}

export function AppSidebar() {
    const { auth } = usePage().props;
    const user = auth.user as User | null;
    const navItems = getNavItemsByRole(user?.role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[]} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
