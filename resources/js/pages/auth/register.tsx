import { Head, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { useState } from 'react';

type FormData = {
    name: string;
    username: string;
    email: string;
    role: string;
    phone: string;
    gender: string;
    birthdate: string;
    address: string;
    contact_person: string;
    contact_number: string;
    blood_type: string;
    civil_status: string;
    password: string;
    password_confirmation: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const steps = ['Personal Info', 'Medical & Contact', 'Account Setup'];

export default function Register() {
    const [step, setStep] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [form, setForm] = useState<FormData>({
        name: '',
        username: '',
        email: '',
        role: '',
        phone: '',
        gender: '',
        birthdate: '',
        address: '',
        contact_person: '',
        contact_number: '',
        blood_type: '',
        civil_status: '',
        password: '',
        password_confirmation: '',
    });

    const set = (key: keyof FormData, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const validateStep = (s: number): boolean => {
        const e: Errors = {};

        if (s === 0) {
            if (!form.name.trim()) e.name = 'Name is required.';
            if (!form.username.trim()) e.username = 'Username is required.';
            else if (form.username.length < 3) e.username = 'Username must be at least 3 characters.';
            if (!form.email.trim()) e.email = 'Email is required.';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
            if (!form.role) e.role = 'Role is required.';
            if (!form.phone.trim()) e.phone = 'Phone is required.';
            if (!form.gender) e.gender = 'Gender is required.';
        }

        if (s === 1) {
            if (!form.birthdate) e.birthdate = 'Birthdate is required.';
            if (!form.address.trim()) e.address = 'Address is required.';
            if (!form.civil_status) e.civil_status = 'Civil status is required.';
        }

        if (s === 2) {
            if (!form.password) e.password = 'Password is required.';
            else if (form.password.length < 8) e.password = 'Minimum 8 characters.';
            if (form.password !== form.password_confirmation) e.password_confirmation = 'Passwords do not match.';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => {
        if (validateStep(step)) setStep(step + 1);
    };

    const prev = () => setStep(step - 1);

    const submit = () => {
        if (!validateStep(2)) return;
        setProcessing(true);
        router.post('/register', form, {
            onError: (serverErrors) => {
                setErrors(serverErrors as Errors);
                // Go back to the step with the first error
                const step0Fields: (keyof FormData)[] = ['name', 'username', 'email', 'role', 'phone', 'gender'];
                const step1Fields: (keyof FormData)[] = ['birthdate', 'address', 'civil_status', 'contact_person', 'contact_number', 'blood_type'];
                const errKeys = Object.keys(serverErrors) as (keyof FormData)[];
                if (errKeys.some((k) => step0Fields.includes(k))) setStep(0);
                else if (errKeys.some((k) => step1Fields.includes(k))) setStep(1);
                else setStep(2);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const inputClass = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';
    const selectClass = inputClass;

    return (
        <>
            <Head title="Register" />

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    {steps.map((label, i) => (
                        <div key={i} className="flex flex-1 flex-col items-center">
                            <div className="flex w-full items-center">
                                {i > 0 && (
                                    <div className={`h-0.5 flex-1 transition-colors ${i <= step ? 'bg-[#0787f7]' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                                )}
                                <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                        i < step
                                            ? 'bg-[#0787f7] text-white'
                                            : i === step
                                              ? 'bg-[#0787f7] text-white ring-4 ring-[#0787f7]/20'
                                              : 'bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'
                                    }`}
                                >
                                    {i < step ? '✓' : i + 1}
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`h-0.5 flex-1 transition-colors ${i < step ? 'bg-[#0787f7]' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                                )}
                            </div>
                            <span className={`mt-1.5 text-[10px] font-medium ${i <= step ? 'text-[#0787f7]' : 'text-neutral-400'}`}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 1: Personal Info */}
            {step === 0 && (
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Juan Dela Cruz" />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username *</Label>
                        <Input id="username" value={form.username} onChange={(e) => set('username', e.target.value)} placeholder="juandelacruz" />
                        <InputError message={errors.username} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="email@example.com" />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role *</Label>
                            <select id="role" value={form.role} onChange={(e) => set('role', e.target.value)} className={selectClass}>
                                <option value="">Select role</option>
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                                <option value="pharmacist">Pharmacist</option>
                                <option value="secretary">Secretary</option>
                            </select>
                            <InputError message={errors.role} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gender *</Label>
                            <select id="gender" value={form.gender} onChange={(e) => set('gender', e.target.value)} className={selectClass}>
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <InputError message={errors.gender} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="09XX-XXX-XXXX" />
                        <InputError message={errors.phone} />
                    </div>
                </div>
            )}

            {/* Step 2: Medical & Contact */}
            {step === 1 && (
                <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="birthdate">Birthdate *</Label>
                            <Input id="birthdate" type="date" value={form.birthdate} onChange={(e) => set('birthdate', e.target.value)} />
                            <InputError message={errors.birthdate} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="civil_status">Civil Status *</Label>
                            <select id="civil_status" value={form.civil_status} onChange={(e) => set('civil_status', e.target.value)} className={selectClass}>
                                <option value="">Select status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="widowed">Widowed</option>
                                <option value="separated">Separated</option>
                            </select>
                            <InputError message={errors.civil_status} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input id="address" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Barangay, Municipality, Province" />
                        <InputError message={errors.address} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="blood_type">Blood Type</Label>
                            <select id="blood_type" value={form.blood_type} onChange={(e) => set('blood_type', e.target.value)} className={selectClass}>
                                <option value="">Select blood type</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                            <InputError message={errors.blood_type} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contact_person">Emergency Contact Person</Label>
                            <Input id="contact_person" value={form.contact_person} onChange={(e) => set('contact_person', e.target.value)} placeholder="Full name" />
                            <InputError message={errors.contact_person} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="contact_number">Emergency Contact Number</Label>
                        <Input id="contact_number" value={form.contact_number} onChange={(e) => set('contact_number', e.target.value)} placeholder="09XX-XXX-XXXX" />
                        <InputError message={errors.contact_number} />
                    </div>
                </div>
            )}

            {/* Step 3: Account Setup */}
            {step === 2 && (
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password *</Label>
                        <PasswordInput id="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Min 8 characters" name="password" />
                        <InputError message={errors.password} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm Password *</Label>
                        <PasswordInput id="password_confirmation" value={form.password_confirmation} onChange={(e) => set('password_confirmation', e.target.value)} placeholder="Confirm password" name="password_confirmation" />
                        <InputError message={errors.password_confirmation} />
                    </div>
                    <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
                        <p className="mb-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200">Account Summary</p>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-neutral-500">
                            <span>Name:</span><span className="font-medium text-neutral-700 dark:text-neutral-200">{form.name}</span>
                            <span>Email:</span><span className="font-medium text-neutral-700 dark:text-neutral-200">{form.email}</span>
                            <span>Role:</span><span className="font-medium capitalize text-neutral-700 dark:text-neutral-200">{form.role}</span>
                            <span>Phone:</span><span className="font-medium text-neutral-700 dark:text-neutral-200">{form.phone}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between gap-3">
                {step > 0 ? (
                    <button
                        type="button"
                        onClick={prev}
                        className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
                    >
                        Back
                    </button>
                ) : (
                    <div />
                )}

                {step < 2 ? (
                    <Button type="button" onClick={next}>
                        Next
                    </Button>
                ) : (
                    <Button type="button" onClick={submit} disabled={processing}>
                        {processing && <Spinner />}
                        Create Account
                    </Button>
                )}
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <TextLink href={login()}>Log in</TextLink>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Fill in your details to get started',
};
