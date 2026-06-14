import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Calendar,
    ClipboardList,
    Package,
    AlertTriangle,
    Users,
    Bell,
    BarChart3,
    MessageSquare,
    Pill,
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
        title: 'Prescriptions',
        href: '/doctor/prescriptions',
        icon: Pill,
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
        title: 'Notifications',
        href: '/doctor/notifications',
        icon: Bell,
    },
    {
        title: 'Reports',
        href: '/doctor/reports',
        icon: BarChart3,
    },
    {
        title: 'Patient Feedback',
        href: '/doctor/patient-feedback',
        icon: MessageSquare,
    },
];

const secretaryNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/secretary/dashboard',
        icon: LayoutGrid,
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
        title: 'Appointment History',
        href: '/patient/appointment-history',
        icon: ClipboardList,
    },
    {
        title: 'Queue Status',
        href: '/patient/queue-status',
        icon: Users,
    },
    {
        title: 'Feedback',
        href: '/patient/feedback',
        icon: MessageSquare,
    },
    {
        title: 'My Prescriptions',
        href: '/patient/prescriptions',
        icon: Pill,
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
    const { auth, inventoryAlertCount, notificationCount } = usePage().props as { auth: { user: User | null }; inventoryAlertCount?: number; notificationCount?: number };
    const user = auth.user;
    const navItems = getNavItemsByRole(user?.role);

    // Inject badge count into "Inventory Alerts" nav item
    const itemsWithBadge = navItems.map((item) => {
        if (item.title === 'Inventory Alerts' && inventoryAlertCount && inventoryAlertCount > 0) {
            return { ...item, badge: inventoryAlertCount };
        }
        if (item.title === 'Notifications' && notificationCount && notificationCount > 0) {
            return { ...item, badge: notificationCount };
        }
        return item;
    });

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="[&_[data-sidebar=sidebar]]:text-white [&_[data-sidebar=sidebar]_*]:text-white/90 [&_[data-sidebar=sidebar]_[data-active=true]]:text-white"
        >
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
                <NavMain items={itemsWithBadge} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[]} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
