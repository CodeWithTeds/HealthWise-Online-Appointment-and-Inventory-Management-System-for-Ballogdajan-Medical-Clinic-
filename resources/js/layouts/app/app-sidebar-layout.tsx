import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { BrandingSync } from '@/components/branding-sync';
import { useBranding } from '@/contexts/branding-context';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { settings } = useBranding();

    return (
        <div style={{ '--color-sidebar': settings.sidebar_color, '--color-sidebar-border': settings.sidebar_color, '--color-sidebar-accent': settings.sidebar_color + '33' } as React.CSSProperties}>
            <AppShell variant="sidebar">
                <BrandingSync />
                <AppSidebar />
                <AppContent variant="sidebar" className="overflow-x-hidden">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </AppContent>
            </AppShell>
        </div>
    );
}
