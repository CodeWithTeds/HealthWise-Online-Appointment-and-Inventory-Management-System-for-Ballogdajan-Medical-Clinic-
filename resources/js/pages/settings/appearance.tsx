import { Head, usePage } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import { BrandingCustomizer } from '@/components/branding-customizer';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';
import type { User } from '@/types/auth';

export default function Appearance() {
    const { auth } = usePage().props as { auth: { user: User | null } };
    const user = auth.user;
    const canCustomize = user && ['doctor', 'secretary'].includes(user.role);

    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Appearance settings"
                    description="Update your account's appearance settings"
                />
                <AppearanceTabs />

                {/* Branding Customization */}
                {canCustomize && (
                    <div className="border-t border-neutral-200 pt-6 dark:border-neutral-700">
                        <Heading
                            variant="small"
                            title="Branding"
                            description="Customize the sidebar color, logo, and title for all users"
                        />
                        <div className="mt-4">
                            <BrandingCustomizer />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance settings',
            href: editAppearance(),
        },
    ],
};
