import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const [dismissedBadges, setDismissedBadges] = useState<Record<string, number>>({});

    // Load dismissed badge counts from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('hw-dismissed-badges');
            if (stored) setDismissedBadges(JSON.parse(stored));
        } catch {}
    }, []);

    // When user is on a page with a badge, dismiss it
    useEffect(() => {
        items.forEach((item) => {
            if (item.badge && item.badge > 0 && isCurrentUrl(item.href)) {
                const key = item.href as string;
                const updated = { ...dismissedBadges, [key]: item.badge };
                setDismissedBadges(updated);
                localStorage.setItem('hw-dismissed-badges', JSON.stringify(updated));
            }
        });
    }, [items, isCurrentUrl]);

    const shouldShowBadge = (item: NavItem): boolean => {
        if (!item.badge || item.badge <= 0) return false;
        if (isCurrentUrl(item.href)) return false;
        const key = item.href as string;
        const dismissed = dismissedBadges[key];
        // Show badge only if count is different (new alerts appeared)
        if (dismissed !== undefined && dismissed >= item.badge) return false;
        return true;
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item.children && item.children.length > 0 ? (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.children.some((child) => isCurrentUrl(child.href))}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={{ children: item.title }}
                                        isActive={item.children.some((child) => isCurrentUrl(child.href))}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.children.map((child) => (
                                            <SidebarMenuSubItem key={child.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={isCurrentUrl(child.href)}
                                                >
                                                    <Link href={child.href} prefetch>
                                                        {child.icon && <child.icon />}
                                                        <span>{child.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(item.href)}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch className="relative">
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    {shouldShowBadge(item) && (
                                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                                            {item.badge! > 99 ? '99+' : item.badge}
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
