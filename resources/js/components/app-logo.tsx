import { useBranding } from '@/contexts/branding-context';

export default function AppLogo() {
    const { settings } = useBranding();

    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-md">
                <img src={settings.sidebar_logo} alt={settings.sidebar_text} className="size-10 rounded-md object-contain" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate text-base leading-tight font-bold">
                    {settings.sidebar_text}
                </span>
            </div>
        </>
    );
}
