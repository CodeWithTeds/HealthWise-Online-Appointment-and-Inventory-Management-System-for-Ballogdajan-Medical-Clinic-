import { useBranding } from '@/contexts/branding-context';

export default function AppLogo() {
    const { settings } = useBranding();

    return (
        <>
            <div className="flex aspect-square size-12 items-center justify-center rounded-md lg:size-14">
                <img src={settings.sidebar_logo} alt={settings.sidebar_text} className="size-12 rounded-md object-contain lg:size-14" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate text-lg leading-tight font-bold lg:text-xl">
                    {settings.sidebar_text}
                </span>
            </div>
        </>
    );
}
