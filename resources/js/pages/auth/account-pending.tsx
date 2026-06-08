import { Head, Link } from '@inertiajs/react';

export default function AccountPending() {
    return (
        <>
            <Head title="Account Pending Approval" />
            <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
                <div className="w-full max-w-sm text-center">
                    <img src="/images/logo.png" alt="HealthWise" className="mx-auto mb-6 h-16 w-16 object-contain" />

                    <h1 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        Account Pending Approval
                    </h1>
                    <p className="mb-6 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                        Your account has been created successfully but needs to be approved by the clinic administrator before you can access the system.
                    </p>

                    <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4 text-left dark:border-amber-900 dark:bg-amber-900/20">
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">What happens next?</p>
                        <ul className="mt-2 space-y-1 text-xs text-amber-600 dark:text-amber-300">
                            <li>• The clinic secretary will review your registration</li>
                            <li>• Once approved, you can log in and access your dashboard</li>
                            <li>• This usually takes less than 24 hours</li>
                        </ul>
                    </div>

                    <div className="mt-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-[#0787f7] hover:underline"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
