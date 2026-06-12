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
        title: 'User Management',
        href: '/doctor/users',
        icon: Users,
    },
    {
        title: 'Scheduling',
        href: '/doctor/appointment-scheduling',
        icon: Calendar,
        children: [
            { title: 'Calendar', href: '/doctor/appointment-scheduling?view=calendar', icon: Calendar },
            { title: 'Schedules', href: '/doctor/appointment-scheduling?view=schedules', icon: ClipboardList },
        ],
    },
    {
        title: 'Appointments',
        href: '/doctor/appointment-management',
        icon: Users,
        children: [
            { title: 'List', href: '/doctor/appointment-management?view=list', icon: ClipboardList },
            { title: 'Priority Queue', href: '/doctor/appointment-management?view=priority', icon: Users },
        ],
    },
    {
        title: 'Patient Records',
        href: '/doctor/patient-records',
        icon: ClipboardList,
    },
    {
        title: 'Inventory',
        href: '/doctor/inventory',
        icon: Package,
    },
    {
        title: 'Inventory Alerts',
        href: '/doctor/inventory-alerts',
        icon: AlertTriangle,
    },
    {
        title: 'Reports',
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
        title: 'User Management',
        href: '/secretary/users',
        icon: Users,
    },
    {
        title: 'Scheduling',
        href: '/secretary/appointment-scheduling',
        icon: Calendar,
        children: [
            { title: 'Calendar', href: '/secretary/appointment-scheduling?view=calendar', icon: Calendar },
            { title: 'Schedules', href: '/secretary/appointment-scheduling?view=schedules', icon: ClipboardList },
        ],
    },
    {
        title: 'Appointments',
        href: '/secretary/appointment-management',
        icon: Users,
        children: [
            { title: 'List', href: '/secretary/appointment-management?view=list', icon: ClipboardList },
            { title: 'Priority Queue', href: '/secretary/appointment-management?view=priority', icon: Users },
        ],
    },
    {
        title: 'Patient Records',
        href: '/secretary/patient-records',
        icon: ClipboardList,
    },
    {
        title: 'Inventory',
        href: '/secretary/inventory',
        icon: Package,
    },
    {
        title: 'Inventory Alerts',
        href: '/secretary/inventory-alerts',
        icon: AlertTriangle,
    },
    {
        title: 'Reports',
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
        title: 'Inventory',
        href: '/pharmacist/inventory',
        icon: Package,
    },
    {
        title: 'Inventory Alerts',
        href: '/pharmacist/inventory-alerts',
        icon: AlertTriangle,
    },
];

const patientNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/patient/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Book Appointment',
        href: '/patient/book-appointment',
        icon: Calendar,
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
