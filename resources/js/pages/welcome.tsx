import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import {
    Calendar,
    ClipboardList,
    Package,
    Shield,
    Clock,
    Users,
    ChevronRight,
    Menu,
    X,
} from 'lucide-react';
import { useState } from 'react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="HealthWise — Ballogdajan Medical Clinic">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Rift:wght@300;400;500;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* Navigation */}
                <nav className="fixed top-0 right-0 left-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0787f7]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </div>
                            <span
                                className="text-xl tracking-wide text-[#1b2634]"
                                style={{ fontFamily: "'Rift', sans-serif", fontWeight: 700 }}
                            >
                                HEALTHWISE
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden items-center gap-8 md:flex">
                            <a href="#features" className="text-sm font-medium text-[#1b2634]/70 transition-colors hover:text-[#0787f7]">
                                Features
                            </a>
                            <a href="#about" className="text-sm font-medium text-[#1b2634]/70 transition-colors hover:text-[#0787f7]">
                                About
                            </a>
                            <a href="#services" className="text-sm font-medium text-[#1b2634]/70 transition-colors hover:text-[#0787f7]">
                                Services
                            </a>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden items-center gap-3 md:flex">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-lg bg-[#0787f7] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0670d4]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-lg px-4 py-2 text-sm font-semibold text-[#1b2634] transition-colors hover:text-[#0787f7]"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-[#0787f7] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0670d4]"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6 text-[#1b2634]" />
                            ) : (
                                <Menu className="h-6 w-6 text-[#1b2634]" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="border-t border-gray-100 bg-white px-5 py-4 md:hidden">
                            <div className="flex flex-col gap-3">
                                <a href="#features" className="text-sm font-medium text-[#1b2634]/70">Features</a>
                                <a href="#about" className="text-sm font-medium text-[#1b2634]/70">About</a>
                                <a href="#services" className="text-sm font-medium text-[#1b2634]/70">Services</a>
                                <div className="mt-3 flex gap-3 border-t border-gray-100 pt-3">
                                    {auth.user ? (
                                        <Link href={dashboard()} className="rounded-lg bg-[#0787f7] px-5 py-2 text-sm font-semibold text-white">
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href={login()} className="text-sm font-semibold text-[#1b2634]">Log in</Link>
                                            {canRegister && (
                                                <Link href={register()} className="rounded-lg bg-[#0787f7] px-5 py-2 text-sm font-semibold text-white">
                                                    Get Started
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-16">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#0787f7]/5" />
                        <div className="absolute top-60 -left-20 h-[300px] w-[300px] rounded-full bg-[#0787f7]/3" />
                    </div>

                    <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-5 py-20 lg:flex-row lg:gap-16 lg:px-8">
                        {/* Left Content */}
                        <div className="max-w-xl text-center lg:text-left">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#0787f7]/20 bg-[#0787f7]/5 px-4 py-1.5">
                                <span className="h-2 w-2 rounded-full bg-[#0787f7]" />
                                <span className="text-xs font-medium text-[#0787f7]">Ballogdajan Medical Clinic</span>
                            </div>

                            <h1
                                className="mb-5 text-[#1b2634]"
                                style={{ fontFamily: "'Rift', sans-serif", fontWeight: 800 }}
                            >
                                <span className="block text-4xl leading-tight tracking-wide sm:text-5xl lg:text-6xl">
                                    YOUR HEALTH,
                                </span>
                                <span className="block text-4xl leading-tight tracking-wide sm:text-5xl lg:text-6xl">
                                    OUR <span className="text-[#0787f7]">PRIORITY</span>
                                </span>
                            </h1>

                            <p className="mb-8 text-base leading-relaxed text-[#1b2634]/60 sm:text-lg">
                                An integrated system for online appointments, patient records, and inventory management. 
                                Streamlining healthcare delivery for the community of Ballogdajan, Tibiao, Antique.
                            </p>

                            <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-start">
                                {!auth.user && canRegister ? (
                                    <Link
                                        href={register()}
                                        className="group inline-flex items-center gap-2 rounded-xl bg-[#0787f7] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0787f7]/25 transition-all hover:bg-[#0670d4] hover:shadow-xl hover:shadow-[#0787f7]/30"
                                    >
                                        Book an Appointment
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                ) : auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="group inline-flex items-center gap-2 rounded-xl bg-[#0787f7] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0787f7]/25 transition-all hover:bg-[#0670d4] hover:shadow-xl hover:shadow-[#0787f7]/30"
                                    >
                                        Go to Dashboard
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="group inline-flex items-center gap-2 rounded-xl bg-[#0787f7] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0787f7]/25 transition-all hover:bg-[#0670d4] hover:shadow-xl hover:shadow-[#0787f7]/30"
                                    >
                                        Log in
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                )}
                                <a
                                    href="#features"
                                    className="inline-flex items-center gap-2 rounded-xl border border-[#1b2634]/10 px-7 py-3.5 text-sm font-semibold text-[#1b2634] transition-all hover:border-[#0787f7]/30 hover:text-[#0787f7]"
                                >
                                    Learn More
                                </a>
                            </div>

                            {/* Stats */}
                            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-gray-100 pt-8">
                                <div>
                                    <p className="text-2xl font-bold text-[#1b2634]" style={{ fontFamily: "'Rift', sans-serif" }}>24/7</p>
                                    <p className="mt-1 text-xs text-[#1b2634]/50">Online Access</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#1b2634]" style={{ fontFamily: "'Rift', sans-serif" }}>100%</p>
                                    <p className="mt-1 text-xs text-[#1b2634]/50">Digital Records</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#1b2634]" style={{ fontFamily: "'Rift', sans-serif" }}>Fast</p>
                                    <p className="mt-1 text-xs text-[#1b2634]/50">Scheduling</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="relative mt-12 w-full max-w-md lg:mt-0 lg:max-w-lg">
                            <div className="relative">
                                {/* Card Stack Visual */}
                                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl shadow-[#1b2634]/5">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                                            <Calendar className="h-5 w-5 text-[#0787f7]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#1b2634]">Upcoming Appointment</p>
                                            <p className="text-xs text-[#1b2634]/50">Today's Schedule</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between rounded-lg bg-[#f8fafc] p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-[#0787f7]/15" />
                                                <div>
                                                    <p className="text-xs font-medium text-[#1b2634]">General Checkup</p>
                                                    <p className="text-[11px] text-[#1b2634]/40">Dr. Santos</p>
                                                </div>
                                            </div>
                                            <span className="rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-600">
                                                Confirmed
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg bg-[#f8fafc] p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-[#0787f7]/10" />
                                                <div>
                                                    <p className="text-xs font-medium text-[#1b2634]">Follow-up Visit</p>
                                                    <p className="text-[11px] text-[#1b2634]/40">Dr. Reyes</p>
                                                </div>
                                            </div>
                                            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                                                Pending
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg bg-[#f8fafc] p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-[#0787f7]/8" />
                                                <div>
                                                    <p className="text-xs font-medium text-[#1b2634]">Lab Results Review</p>
                                                    <p className="text-[11px] text-[#1b2634]/40">Dr. Cruz</p>
                                                </div>
                                            </div>
                                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-[#0787f7]">
                                                AM Slot
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating badge */}
                                <div className="absolute -right-4 -bottom-4 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                                            <Shield className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold text-[#1b2634]">Secure Records</p>
                                            <p className="text-[10px] text-[#1b2634]/40">Role-based access</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-[#f8fafc] py-20 lg:py-28">
                    <div className="mx-auto max-w-7xl px-5 lg:px-8">
                        <div className="mb-14 text-center">
                            <p className="mb-2 text-sm font-semibold tracking-wider text-[#0787f7] uppercase">Features</p>
                            <h2
                                className="text-3xl tracking-wide text-[#1b2634] sm:text-4xl"
                                style={{ fontFamily: "'Rift', sans-serif", fontWeight: 700 }}
                            >
                                EVERYTHING IN ONE PLACE
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-[#1b2634]/60">
                                Manage appointments, patient records, and medical inventory through a single, unified platform designed for Ballogdajan Medical Clinic.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    icon: Calendar,
                                    title: 'Online Appointments',
                                    description: 'Book, reschedule, or cancel appointments online. View available AM and PM slots with real-time confirmation.',
                                },
                                {
                                    icon: ClipboardList,
                                    title: 'Patient Records',
                                    description: 'Securely manage patient information, consultation history, diagnoses, and prescriptions in one digital system.',
                                },
                                {
                                    icon: Package,
                                    title: 'Inventory Tracking',
                                    description: 'Monitor medical supplies, track stock levels, manage expiration dates, and receive low-stock alerts.',
                                },
                                {
                                    icon: Users,
                                    title: 'Role-Based Access',
                                    description: 'Dedicated dashboards for administrators, doctors, pharmacists, and patients with appropriate permissions.',
                                },
                                {
                                    icon: Clock,
                                    title: 'Schedule Management',
                                    description: 'Clinic staff can set consultation availability, confirm patient appointments, and manage daily patient flow.',
                                },
                                {
                                    icon: Shield,
                                    title: 'Reports & Analytics',
                                    description: 'Generate organized reports on appointments, consultations, prescriptions, and inventory status.',
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="group rounded-xl border border-gray-100 bg-white p-6 transition-all hover:border-[#0787f7]/20 hover:shadow-lg hover:shadow-[#0787f7]/5"
                                >
                                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#0787f7]/8 transition-colors group-hover:bg-[#0787f7]/15">
                                        <feature.icon className="h-5 w-5 text-[#0787f7]" />
                                    </div>
                                    <h3 className="mb-2 text-base font-semibold text-[#1b2634]">{feature.title}</h3>
                                    <p className="text-sm leading-relaxed text-[#1b2634]/55">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-20 lg:py-28">
                    <div className="mx-auto max-w-7xl px-5 lg:px-8">
                        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                            <div>
                                <p className="mb-2 text-sm font-semibold tracking-wider text-[#0787f7] uppercase">About</p>
                                <h2
                                    className="mb-6 text-3xl tracking-wide text-[#1b2634] sm:text-4xl"
                                    style={{ fontFamily: "'Rift', sans-serif", fontWeight: 700 }}
                                >
                                    MODERNIZING HEALTHCARE<br />FOR OUR COMMUNITY
                                </h2>
                                <p className="mb-5 leading-relaxed text-[#1b2634]/60">
                                    HealthWise is developed specifically for Ballogdajan Medical Clinic in Tibiao, Antique. 
                                    It replaces manual scheduling, paper-based records, and traditional inventory logs with 
                                    a streamlined digital platform.
                                </p>
                                <p className="mb-8 leading-relaxed text-[#1b2634]/60">
                                    The system reduces patient waiting times, eliminates scheduling conflicts, 
                                    prevents stock shortages, and ensures accurate medical record keeping — all accessible 
                                    through any modern web browser.
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-lg border border-gray-100 p-4">
                                        <p className="text-2xl font-bold text-[#0787f7]" style={{ fontFamily: "'Rift', sans-serif" }}>4</p>
                                        <p className="mt-1 text-sm text-[#1b2634]/50">User Roles</p>
                                    </div>
                                    <div className="rounded-lg border border-gray-100 p-4">
                                        <p className="text-2xl font-bold text-[#0787f7]" style={{ fontFamily: "'Rift', sans-serif" }}>AM/PM</p>
                                        <p className="mt-1 text-sm text-[#1b2634]/50">Session Slots</p>
                                    </div>
                                </div>
                            </div>

                            {/* Visual */}
                            <div className="relative">
                                <div className="rounded-2xl bg-[#1b2634] p-8">
                                    <div className="mb-6 flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-[#0787f7]" />
                                        <div className="h-3 w-3 rounded-full bg-[#0787f7]/40" />
                                        <div className="h-3 w-3 rounded-full bg-[#0787f7]/20" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                                                <Users className="h-4 w-4 text-white/80" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-2 w-24 rounded bg-white/20" />
                                                <div className="mt-1.5 h-1.5 w-16 rounded bg-white/10" />
                                            </div>
                                            <div className="rounded-md bg-[#0787f7]/20 px-2 py-1">
                                                <span className="text-[10px] font-medium text-[#0787f7]">Admin</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                                                <ClipboardList className="h-4 w-4 text-white/80" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-2 w-20 rounded bg-white/20" />
                                                <div className="mt-1.5 h-1.5 w-14 rounded bg-white/10" />
                                            </div>
                                            <div className="rounded-md bg-green-500/20 px-2 py-1">
                                                <span className="text-[10px] font-medium text-green-400">Doctor</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                                                <Package className="h-4 w-4 text-white/80" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-2 w-28 rounded bg-white/20" />
                                                <div className="mt-1.5 h-1.5 w-18 rounded bg-white/10" />
                                            </div>
                                            <div className="rounded-md bg-amber-500/20 px-2 py-1">
                                                <span className="text-[10px] font-medium text-amber-400">Pharmacist</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                                                <Calendar className="h-4 w-4 text-white/80" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-2 w-22 rounded bg-white/20" />
                                                <div className="mt-1.5 h-1.5 w-12 rounded bg-white/10" />
                                            </div>
                                            <div className="rounded-md bg-purple-500/20 px-2 py-1">
                                                <span className="text-[10px] font-medium text-purple-400">Patient</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="bg-[#1b2634] py-20 lg:py-28">
                    <div className="mx-auto max-w-7xl px-5 lg:px-8">
                        <div className="mb-14 text-center">
                            <p className="mb-2 text-sm font-semibold tracking-wider text-[#0787f7] uppercase">Services</p>
                            <h2
                                className="text-3xl tracking-wide text-white sm:text-4xl"
                                style={{ fontFamily: "'Rift', sans-serif", fontWeight: 700 }}
                            >
                                HOW IT WORKS
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-white/50">
                                A simple workflow for patients, staff, doctors, and pharmacists.
                            </p>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    step: '01',
                                    title: 'Register',
                                    description: 'Create your patient account with basic information and secure credentials.',
                                },
                                {
                                    step: '02',
                                    title: 'Book',
                                    description: 'Choose an available AM or PM slot and submit your appointment request.',
                                },
                                {
                                    step: '03',
                                    title: 'Confirm',
                                    description: 'Clinic staff reviews and confirms your schedule. Get notified instantly.',
                                },
                                {
                                    step: '04',
                                    title: 'Consult',
                                    description: 'Visit the clinic. Your doctor updates records and prints prescriptions.',
                                },
                            ].map((item, index) => (
                                <div key={index} className="text-center">
                                    <p
                                        className="mb-3 text-4xl text-[#0787f7]"
                                        style={{ fontFamily: "'Rift', sans-serif", fontWeight: 800 }}
                                    >
                                        {item.step}
                                    </p>
                                    <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-white/45">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 lg:py-28">
                    <div className="mx-auto max-w-7xl px-5 lg:px-8">
                        <div className="relative overflow-hidden rounded-2xl bg-[#0787f7] px-8 py-14 text-center sm:px-14 lg:py-20">
                            {/* Decorative */}
                            <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10" />
                            <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/10" />

                            <div className="relative">
                                <h2
                                    className="mb-4 text-3xl tracking-wide text-white sm:text-4xl"
                                    style={{ fontFamily: "'Rift', sans-serif", fontWeight: 700 }}
                                >
                                    READY TO GET STARTED?
                                </h2>
                                <p className="mx-auto mb-8 max-w-lg text-white/80">
                                    Join HealthWise and experience a modern approach to healthcare management at Ballogdajan Medical Clinic.
                                </p>
                                {!auth.user && canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#0787f7] transition-all hover:bg-white/90"
                                    >
                                        Create Your Account
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                )}
                                {auth.user && (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#0787f7] transition-all hover:bg-white/90"
                                    >
                                        Go to Dashboard
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-100 bg-white py-10">
                    <div className="mx-auto max-w-7xl px-5 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0787f7]">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </div>
                                <span
                                    className="text-lg tracking-wide text-[#1b2634]"
                                    style={{ fontFamily: "'Rift', sans-serif", fontWeight: 700 }}
                                >
                                    HEALTHWISE
                                </span>
                            </div>
                            <p className="text-center text-xs text-[#1b2634]/40">
                                &copy; {new Date().getFullYear()} HealthWise — Ballogdajan Medical Clinic, Tibiao, Antique. 
                                A Capstone Project by BSIS Students, University of Antique.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
