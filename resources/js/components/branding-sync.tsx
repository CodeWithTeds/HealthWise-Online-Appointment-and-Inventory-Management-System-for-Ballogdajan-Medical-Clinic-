import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useBranding } from '@/contexts/branding-context';

/**
 * Syncs server-side appSettings into the BrandingProvider context.
 * Must be rendered inside the Inertia component tree.
 */
export function BrandingSync() {
    const { appSettings } = usePage().props as { appSettings?: Record<string, string> };
    const { syncFromServer } = useBranding();

    useEffect(() => {
        if (appSettings) {
            syncFromServer(appSettings);
        }
    }, [appSettings, syncFromServer]);

    return null;
}
