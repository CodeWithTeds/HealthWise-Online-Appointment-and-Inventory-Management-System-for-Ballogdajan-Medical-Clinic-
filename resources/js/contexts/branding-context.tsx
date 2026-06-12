import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type BrandingSettings = {
    sidebar_color: string;
    sidebar_text: string;
    sidebar_logo: string;
};

type BrandingContextType = {
    settings: BrandingSettings;
    updateSettings: (updates: Partial<BrandingSettings>) => void;
    syncFromServer: (serverSettings: Record<string, string>) => void;
    saveSettings: () => Promise<void>;
    saving: boolean;
    saved: boolean;
    uploadLogo: (file: File) => Promise<string | null>;
};

const defaults: BrandingSettings = {
    sidebar_color: '#1e293b',
    sidebar_text: 'HealthWise',
    sidebar_logo: '/images/logo.png',
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<BrandingSettings>({ ...defaults });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [synced, setSynced] = useState(false);

    const syncFromServer = useCallback((serverSettings: Record<string, string>) => {
        if (!serverSettings) return;
        setSettings({
            sidebar_color: serverSettings.sidebar_color || defaults.sidebar_color,
            sidebar_text: serverSettings.sidebar_text || defaults.sidebar_text,
            sidebar_logo: serverSettings.sidebar_logo || defaults.sidebar_logo,
        });
    }, []);

    const updateSettings = useCallback((updates: Partial<BrandingSettings>) => {
        setSettings((prev) => ({ ...prev, ...updates }));
    }, []);

    const saveSettings = useCallback(async () => {
        setSaving(true);
        setSaved(false);
        try {
            const res = await fetch('/app-settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } finally {
            setSaving(false);
        }
    }, [settings]);

    const uploadLogo = useCallback(async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('logo', file);

        const res = await fetch('/app-settings/logo', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
            },
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            setSettings((prev) => ({ ...prev, sidebar_logo: data.url }));
            return data.url;
        }
        return null;
    }, []);

    return (
        <BrandingContext.Provider value={{ settings, updateSettings, syncFromServer, saveSettings, saving, saved, uploadLogo }}>
            {children}
        </BrandingContext.Provider>
    );
}

export function useBranding() {
    const context = useContext(BrandingContext);
    if (!context) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
}
