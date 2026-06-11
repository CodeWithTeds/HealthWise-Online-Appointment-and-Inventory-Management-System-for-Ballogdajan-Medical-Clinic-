import { useLanguage } from '@/contexts/language-context';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            title={language === 'en' ? 'Switch to Tagalog' : 'Switch to English'}
        >
            <Languages className="h-3.5 w-3.5" />
            <span className="font-bold">{language === 'en' ? 'EN' : 'TL'}</span>
        </button>
    );
}
