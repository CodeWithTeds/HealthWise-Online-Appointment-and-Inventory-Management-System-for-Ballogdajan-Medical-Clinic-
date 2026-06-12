import { useRef } from 'react';
import { Upload, Check } from 'lucide-react';
import { useBranding } from '@/contexts/branding-context';

const colorPresets = [
    { name: 'Slate', value: '#1e293b' },
    { name: 'Blue', value: '#1e3a5f' },
    { name: 'Indigo', value: '#312e81' },
    { name: 'Purple', value: '#4c1d95' },
    { name: 'Emerald', value: '#064e3b' },
    { name: 'Teal', value: '#134e4a' },
    { name: 'Rose', value: '#4c0519' },
    { name: 'Orange', value: '#7c2d12' },
    { name: 'Neutral', value: '#171717' },
    { name: 'Sky', value: '#0c4a6e' },
    { name: 'Cyan', value: '#164e63' },
    { name: 'Fuchsia', value: '#4a044e' },
];

export function BrandingCustomizer() {
    const { settings, updateSettings, saveSettings, saving, saved, uploadLogo } = useBranding();
    const fileRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadLogo(file);
    };

    return (
        <div className="space-y-6">
            {/* Color Palette */}
            <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-100">Sidebar Color</label>
                <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">Choose a color theme for the sidebar. Changes apply instantly.</p>
                <div className="grid grid-cols-6 gap-2.5">
                    {colorPresets.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => updateSettings({ sidebar_color: color.value })}
                            className={`group relative h-9 w-full rounded-lg transition-all hover:scale-110 ${settings.sidebar_color === color.value ? 'ring-2 ring-[#0787f7] ring-offset-2 dark:ring-offset-neutral-900' : 'ring-1 ring-neutral-200 dark:ring-neutral-700'}`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        >
                            {settings.sidebar_color === color.value && (
                                <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
                            )}
                        </button>
                    ))}
                </div>
                <div className="mt-3 flex items-center gap-3">
                    <label className="text-xs text-neutral-500 dark:text-neutral-400">Custom color:</label>
                    <input
                        type="color"
                        value={settings.sidebar_color}
                        onChange={(e) => updateSettings({ sidebar_color: e.target.value })}
                        className="h-8 w-12 cursor-pointer rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-700"
                    />
                    <span className="text-xs font-mono text-neutral-500">{settings.sidebar_color}</span>
                </div>
            </div>

            {/* Sidebar Text */}
            <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-100">Sidebar Title</label>
                <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">The text displayed next to the logo in the sidebar.</p>
                <input
                    type="text"
                    value={settings.sidebar_text}
                    onChange={(e) => updateSettings({ sidebar_text: e.target.value })}
                    maxLength={50}
                    className="h-9 w-full max-w-xs rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    placeholder="e.g., HealthWise"
                />
            </div>

            {/* Logo Upload */}
            <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-100">Sidebar Logo</label>
                <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">Upload a custom logo (max 2MB, any image format).</p>
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                        <img src={settings.sidebar_logo} alt="Logo" className="h-11 w-11 rounded-lg object-contain" />
                    </div>
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                        <Upload className="h-4 w-4" /> Upload Logo
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
            </div>

            {/* Live Preview */}
            <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-100">Preview</label>
                <div className="inline-flex items-center gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: settings.sidebar_color }}>
                    <img src={settings.sidebar_logo} alt="" className="h-9 w-9 rounded-lg object-contain" />
                    <span className="text-sm font-bold text-white">{settings.sidebar_text}</span>
                </div>
            </div>

            {/* Save Button */}
            <div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0787f7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0670d4] disabled:opacity-50"
                >
                    {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Branding'}
                </button>
                <p className="mt-1.5 text-[11px] text-neutral-400">Changes are previewed instantly. Click save to persist for all users.</p>
            </div>
        </div>
    );
}
