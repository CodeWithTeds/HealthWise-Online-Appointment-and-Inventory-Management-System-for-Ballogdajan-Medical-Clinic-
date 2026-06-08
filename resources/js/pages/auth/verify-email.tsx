import { Head, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function VerifyEmail() {
    const { auth } = usePage().props;
    const user = auth.user as { email: string; name: string } | null;

    const [code, setCode] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const csrfToken = () =>
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

    // Send code on page load
    useEffect(() => {
        if (user?.email && !codeSent) {
            sendCode();
        }
    }, []);

    const sendCode = async () => {
        if (!user?.email) return;
        setSending(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/verification-code/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken(),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email: user.email }),
            });

            if (res.ok) {
                setCodeSent(true);
                setSuccess('Verification code sent to your email.');
                setTimeout(() => {
                    setSuccess('');
                    inputRefs.current[0]?.focus();
                }, 2000);
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to send code.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const verifyCode = async (fullCode: string) => {
        if (!user?.email) return;
        setVerifying(true);
        setError('');

        try {
            const res = await fetch('/verification-code/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken(),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email: user.email, code: fullCode }),
            });

            const data = await res.json();
            if (res.ok && data.verified) {
                setSuccess('Email verified! Redirecting...');
                // Redirect to dashboard
                window.location.href = '/dashboard';
            } else {
                setError(data.message || 'Invalid verification code.');
                setCode(['', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const handleInput = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all 4 digits entered
        if (newCode.every((d) => d !== '')) {
            setTimeout(() => verifyCode(newCode.join('')), 100);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        if (pasted.length === 4) {
            const newCode = pasted.split('');
            setCode(newCode);
            inputRefs.current[3]?.focus();
            setTimeout(() => verifyCode(pasted), 100);
        }
    };

    return (
        <>
            <Head title="Verify Email" />
            <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col items-center gap-6">
                        <img src="/images/logo.png" alt="HealthWise" className="h-16 w-16 object-contain" />

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Verify your email</h1>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                We sent a 4-digit code to{' '}
                                <strong className="text-neutral-700 dark:text-neutral-200">{user?.email}</strong>
                            </p>
                        </div>

                        {/* Code Input */}
                        <div className="flex items-center justify-center gap-3" onPaste={handlePaste}>
                            {code.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { inputRefs.current[i] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleInput(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    disabled={verifying}
                                    className="h-14 w-14 rounded-xl border-2 border-neutral-200 bg-white text-center text-2xl font-black text-neutral-900 transition-all focus:border-[#0787f7] focus:ring-2 focus:ring-[#0787f7]/20 focus:outline-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                />
                            ))}
                        </div>

                        {/* Status Messages */}
                        {verifying && (
                            <p className="text-sm font-medium text-[#0787f7]">Verifying...</p>
                        )}
                        {error && (
                            <p className="text-sm font-medium text-red-500">{error}</p>
                        )}
                        {success && (
                            <p className="text-sm font-medium text-green-600">{success}</p>
                        )}

                        {/* Resend */}
                        <div className="text-center">
                            <p className="text-xs text-neutral-400">
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    onClick={sendCode}
                                    disabled={sending}
                                    className="font-semibold text-[#0787f7] hover:underline disabled:opacity-50"
                                >
                                    {sending ? 'Sending...' : 'Resend Code'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
