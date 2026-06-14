import { usePage } from '@inertiajs/react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type FlashProps = {
    flash?: { success?: string; error?: string };
};

export function FlashAlert() {
    const { flash } = usePage().props as FlashProps;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        }
    }, [flash]);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [visible, message]);

    if (!visible || !message) return null;

    const isSuccess = type === 'success';

    return (
        <div
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm transition-all ${
                isSuccess
                    ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300'
            }`}
            role="alert"
        >
            {isSuccess ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
            ) : (
                <XCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            )}
            <span className="flex-1 font-medium">{message}</span>
            <button
                onClick={() => setVisible(false)}
                className="shrink-0 rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Dismiss"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}
