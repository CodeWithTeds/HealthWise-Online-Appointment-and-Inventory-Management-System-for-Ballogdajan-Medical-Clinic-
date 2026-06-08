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
    ArrowRight,
    Heart,
    Stethoscope,
    Pill,
    UserCheck,
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
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* Navigation */}
                <nav className="fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur-xl">
                    <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <img src="/images/logo.png" alt="HealthWise" className="h-10 w-10 rounded-xl object-contain" />
                            <span className="text-xl font-extrabold tracking-tight text-[#11165a]">
                                Health<span className="text-[#0787f7]">Wise</span>
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden items-center gap-10 md:flex">
                            <a href="#features" className="text-[13px] font-semibold text-[#192433]/60 transition-colors hover:text-[#0787f7]">
                                Features
                            </a>
                            <a href="#about" className="text-[13px] font-semibold text-[#192433]/60 transition-colors hover:text-[#0787f7]">
                                About
                            </a>
                            <a href="#services" className="text-[13px] font-semibold text-[#192433]/60 transition-colors hover:text-[#0787f7]">
                                Services
                            </a>
                            <a href="#team" className="text-[13px] font-semibold text-[#192433]/60 transition-colors hover:text-[#0787f7]">
                                Gallery
                            </a>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden items-center gap-2 md:flex">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-full bg-[#0787f7] px-6 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-[#0787f7]/20 transition-all hover:shadow-xl hover:shadow-[#0787f7]/30"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-full px-5 py-2.5 text-[13px] font-bold text-[#192433] transition-colors hover:text-[#0787f7]"
                                    >
                                        Sign In
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-full bg-[#0787f7] px-6 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-[#0787f7]/20 transition-all hover:shadow-xl hover:shadow-[#0787f7]/30"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            className="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5 text-[#192433]" />
                            ) : (
                                <Menu className="h-5 w-5 text-[#192433]" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="border-t border-gray-50 bg-white px-6 py-5 md:hidden">
                            <div className="flex flex-col gap-4">
                                <a href="#features" className="text-sm font-semibold text-[#192433]/70">Features</a>
                                <a href="#about" className="text-sm font-semibold text-[#192433]/70">About</a>
                                <a href="#services" className="text-sm font-semibold text-[#192433]/70">Services</a>
                                <a href="#team" className="text-sm font-semibold text-[#192433]/70">Gallery</a>
                                <div className="mt-2 flex gap-3 border-t border-gray-100 pt-4">
                                    {auth.user ? (
                                        <Link href={dashboard()} className="rounded-full bg-[#0787f7] px-6 py-2.5 text-sm font-bold text-white">
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href={login()} className="text-sm font-bold text-[#192433]">Sign In</Link>
                                            {canRegister && (
                                                <Link href={register()} className="rounded-full bg-[#0787f7] px-6 py-2.5 text-sm font-bold text-white">
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
                <section className="relative min-h-screen overflow-hidden pt-18">
                    {/* Decorative blobs */}
                    <div className="absolute -top-32 right-0 h-[600px] w-[600px] rounded-full bg-[#0787f7]/[0.04] blur-3xl" />
                    <div className="absolute bottom-0 -left-32 h-[400px] w-[400px] rounded-full bg-[#11165a]/[0.03] blur-3xl" />

                    <div className="relative mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-7xl flex-col items-center justify-center px-6 py-16 lg:flex-row lg:gap-12 lg:px-8">
                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#0787f7]/[0.08] px-4 py-2">
                                <Heart className="h-3.5 w-3.5 text-[#0787f7]" />
                                <span className="text-xs font-bold tracking-wide text-[#0787f7] uppercase">Ballogdajan Medical Clinic</span>
                            </div>

                            <h1 className="mb-6 text-[#11165a]">
                                <span className="block text-5xl leading-[1.08] font-black tracking-tight sm:text-6xl lg:text-7xl">
                                    Healthcare Made
                                </span>
                                <span className="block text-5xl leading-[1.08] font-black tracking-tight sm:text-6xl lg:text-7xl">
                                    <span className="bg-gradient-to-r from-[#0787f7] to-[#0560c9] bg-clip-text text-transparent">Simple & Smart</span>
                                </span>
                            </h1>

                            <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-[#192433]/55 lg:mx-0 lg:text-lg">
                                An integrated platform for online appointments, patient records, and inventory management — built for the community of Ballogdajan, Tibiao, Antique.
                            </p>

                            <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-start">
                                {!auth.user && canRegister ? (
                                    <Link
                                        href={register()}
                                        className="group inline-flex items-center gap-2.5 rounded-full bg-[#0787f7] px-7 py-3.5 text-[13px] font-bold text-white shadow-xl shadow-[#0787f7]/25 transition-all hover:shadow-2xl hover:shadow-[#0787f7]/35"
                                    >
                                        Book an Appointment
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                ) : auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="group inline-flex items-center gap-2.5 rounded-full bg-[#0787f7] px-7 py-3.5 text-[13px] font-bold text-white shadow-xl shadow-[#0787f7]/25 transition-all hover:shadow-2xl hover:shadow-[#0787f7]/35"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="group inline-flex items-center gap-2.5 rounded-full bg-[#0787f7] px-7 py-3.5 text-[13px] font-bold text-white shadow-xl shadow-[#0787f7]/25 transition-all hover:shadow-2xl hover:shadow-[#0787f7]/35"
                                    >
                                        Sign In
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                )}
                                <a
                                    href="#features"
                                    className="inline-flex items-center gap-2 rounded-full border-2 border-[#192433]/10 px-7 py-3.5 text-[13px] font-bold text-[#192433] transition-all hover:border-[#0787f7]/30 hover:text-[#0787f7]"
                                >
                                    Explore Features
                                </a>
                            </div>

                            {/* Mini Stats */}
                            <div className="mt-14 flex items-center justify-center gap-8 lg:justify-start">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-[#11165a]">24/7</p>
                                    <p className="mt-0.5 text-[11px] font-medium text-[#192433]/40">Online Booking</p>
                                </div>
                                <div className="h-8 w-px bg-[#192433]/10" />
                                <div className="text-center">
                                    <p className="text-2xl font-black text-[#11165a]">100%</p>
                                    <p className="mt-0.5 text-[11px] font-medium text-[#192433]/40">Digital Records</p>
                                </div>
                                <div className="h-8 w-px bg-[#192433]/10" />
                                <div className="text-center">
                                    <p className="text-2xl font-black text-[#11165a]">4</p>
                                    <p className="mt-0.5 text-[11px] font-medium text-[#192433]/40">User Roles</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Hero Image */}
                        <div className="relative mt-12 flex-1 lg:mt-0">
                            <div className="relative mx-auto max-w-md lg:max-w-none">
                                <div className="overflow-hidden rounded-3xl shadow-2xl shadow-[#11165a]/10">
                                    <img
                                        src="/images/hero.png"
                                        alt="HealthWise System"
                                        className="h-auto w-full object-cover"
                                    />
                                </div>
                                {/* Floating card */}
                                <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur-sm lg:-left-8">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                                            <Shield className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[#192433]">Secure & Reliable</p>
                                            <p className="text-[10px] text-[#192433]/40">Role-based access control</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Floating card top-right */}
                                <div className="absolute -top-3 -right-3 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur-sm lg:-right-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0787f7]/10">
                                            <Calendar className="h-5 w-5 text-[#0787f7]" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[#192433]">Easy Scheduling</p>
                                            <p className="text-[10px] text-[#192433]/40">AM / PM slots available</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="relative py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto mb-16 max-w-2xl text-center">
                            <span className="mb-3 inline-block text-xs font-bold tracking-widest text-[#0787f7] uppercase">Features</span>
                            <h2 className="mb-4 text-3xl font-black tracking-tight text-[#11165a] sm:text-4xl">
                                Everything your clinic needs
                            </h2>
                            <p className="text-[15px] leading-relaxed text-[#192433]/50">
                                A complete digital solution managing appointments, records, and inventory — all in one place.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    icon: Calendar,
                                    title: 'Online Appointments',
                                    description: 'Patients book, reschedule, or cancel appointments online. View available AM/PM slots with instant confirmation.',
                                    color: 'bg-[#0787f7]/8 text-[#0787f7]',
                                },
                                {
                                    icon: ClipboardList,
                                    title: 'Patient Records',
                                    description: 'Manage patient information, consultation history, diagnoses, and prescriptions securely in one system.',
                                    color: 'bg-emerald-500/8 text-emerald-500',
                                },
                                {
                                    icon: Package,
                                    title: 'Inventory Management',
                                    description: 'Track medical supplies, monitor stock levels and expiration dates, receive low-stock alerts automatically.',
                                    color: 'bg-amber-500/8 text-amber-500',
                                },
                                {
                                    icon: Users,
                                    title: 'Multi-Role Access',
                                    description: 'Dedicated dashboards for patients, doctors, pharmacists, and secretary — each with tailored permissions.',
                                    color: 'bg-purple-500/8 text-purple-500',
                                },
                                {
                                    icon: Clock,
                                    title: 'Schedule Management',
                                    description: 'Secretary sets availability, confirms patient appointments, and manages daily patient flow efficiently.',
                                    color: 'bg-rose-500/8 text-rose-500',
                                },
                                {
                                    icon: Shield,
                                    title: 'Reports & Analytics',
                                    description: 'Generate organized reports on appointments, consultations, prescriptions, and inventory status.',
                                    color: 'bg-[#11165a]/8 text-[#11165a]',
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-[#11165a]/[0.04]"
                                >
                                    <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mb-2 text-[15px] font-bold text-[#11165a]">{feature.title}</h3>
                                    <p className="text-[13px] leading-relaxed text-[#192433]/50">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="relative overflow-hidden bg-[#f7fafd] py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid items-center gap-16 lg:grid-cols-2">
                            {/* Image grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="overflow-hidden rounded-2xl">
                                        <img src="/images/img1.jpeg" alt="Clinic" className="h-48 w-full object-cover" />
                                    </div>
                                    <div className="overflow-hidden rounded-2xl">
                                        <img src="/images/img3.jpeg" alt="Healthcare" className="h-56 w-full object-cover" />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="overflow-hidden rounded-2xl">
                                        <img src="/images/img2.jpeg" alt="Medical" className="h-56 w-full object-cover" />
                                    </div>
                                    <div className="overflow-hidden rounded-2xl">
                                        <img src="/images/img5.jpeg" alt="Care" className="h-48 w-full object-cover" />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <span className="mb-3 inline-block text-xs font-bold tracking-widest text-[#0787f7] uppercase">About Us</span>
                                <h2 className="mb-6 text-3xl font-black tracking-tight text-[#11165a] sm:text-4xl">
                                    Modernizing healthcare for our community
                                </h2>
                                <p className="mb-5 text-[15px] leading-relaxed text-[#192433]/55">
                                    HealthWise is built specifically for Ballogdajan Medical Clinic in Tibiao, Antique.
                                    It replaces manual scheduling, paper-based records, and traditional inventory logs
                                    with a streamlined digital platform.
                                </p>
                                <p className="mb-8 text-[15px] leading-relaxed text-[#192433]/55">
                                    Reduce patient waiting times, eliminate scheduling conflicts,
                                    prevent stock shortages, and maintain accurate medical records — accessible
                                    through any modern web browser on any device.
                                </p>

                                {/* Roles */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Stethoscope, label: 'Doctor', desc: 'Consultations & records' },
                                        { icon: UserCheck, label: 'Secretary', desc: 'Schedule & management' },
                                        { icon: Pill, label: 'Pharmacist', desc: 'Inventory & stock' },
                                        { icon: Heart, label: 'Patient', desc: 'Booking & history' },
                                    ].map((role, i) => (
                                        <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0787f7]/8">
                                                <role.icon className="h-4 w-4 text-[#0787f7]" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[#11165a]">{role.label}</p>
                                                <p className="text-[10px] text-[#192433]/40">{role.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works / Services */}
                <section id="services" className="relative py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto mb-16 max-w-2xl text-center">
                            <span className="mb-3 inline-block text-xs font-bold tracking-widest text-[#0787f7] uppercase">How It Works</span>
                            <h2 className="mb-4 text-3xl font-black tracking-tight text-[#11165a] sm:text-4xl">
                                Four simple steps
                            </h2>
                            <p className="text-[15px] leading-relaxed text-[#192433]/50">
                                From registration to consultation — a seamless workflow for everyone.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    step: '01',
                                    title: 'Register',
                                    description: 'Create your patient account with your basic information.',
                                    icon: Users,
                                },
                                {
                                    step: '02',
                                    title: 'Book',
                                    description: 'Choose an available AM or PM slot and request your appointment.',
                                    icon: Calendar,
                                },
                                {
                                    step: '03',
                                    title: 'Confirm',
                                    description: 'Secretary reviews and confirms your schedule. Get notified.',
                                    icon: UserCheck,
                                },
                                {
                                    step: '04',
                                    title: 'Consult',
                                    description: 'Visit the clinic. Doctor updates records & prints prescriptions.',
                                    icon: Stethoscope,
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#11165a] to-[#192433] p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#11165a]/20"
                                >
                                    <div className="absolute top-3 right-4 text-[64px] font-black leading-none text-white/[0.04]">
                                        {item.step}
                                    </div>
                                    <div className="relative">
                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0787f7]/15">
                                            <item.icon className="h-5 w-5 text-[#0787f7]" />
                                        </div>
                                        <p className="mb-1 text-[11px] font-bold text-[#0787f7]">{item.step}</p>
                                        <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                                        <p className="text-[13px] leading-relaxed text-white/45">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Gallery / Team Section */}
                <section id="team" className="bg-[#f7fafd] py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto mb-14 max-w-2xl text-center">
                            <span className="mb-3 inline-block text-xs font-bold tracking-widest text-[#0787f7] uppercase">Our Clinic</span>
                            <h2 className="mb-4 text-3xl font-black tracking-tight text-[#11165a] sm:text-4xl">
                                Serving the community
                            </h2>
                            <p className="text-[15px] leading-relaxed text-[#192433]/50">
                                Ballogdajan Medical Clinic — your trusted healthcare partner in Tibiao, Antique.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="overflow-hidden rounded-2xl">
                                <img src="/images/img1.jpeg" alt="Clinic" className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105" />
                            </div>
                            <div className="overflow-hidden rounded-2xl">
                                <img src="/images/img6.jpeg" alt="Staff" className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105" />
                            </div>
                            <div className="overflow-hidden rounded-2xl">
                                <img src="/images/img2.jpeg" alt="Services" className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0787f7] to-[#0560c9] p-10 text-center sm:p-16 lg:p-20">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 h-72 w-72 translate-x-1/4 -translate-y-1/4 rounded-full bg-white/[0.08]" />
                            <div className="absolute bottom-0 left-0 h-56 w-56 -translate-x-1/4 translate-y-1/4 rounded-full bg-white/[0.06]" />
                            <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04]" />

                            <div className="relative">
                                <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                                    Ready to experience modern healthcare?
                                </h2>
                                <p className="mx-auto mb-8 max-w-lg text-[15px] text-white/70">
                                    Join HealthWise today and enjoy hassle-free appointment booking, digital records, and efficient clinic management.
                                </p>
                                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                                    {!auth.user && canRegister && (
                                        <Link
                                            href={register()}
                                            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[13px] font-bold text-[#0787f7] shadow-lg transition-all hover:shadow-xl"
                                        >
                                            Create Your Account
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                    )}
                                    {auth.user && (
                                        <Link
                                            href={dashboard()}
                                            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[13px] font-bold text-[#0787f7] shadow-lg transition-all hover:shadow-xl"
                                        >
                                            Go to Dashboard
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                    )}
                                    {!auth.user && !canRegister && (
                                        <Link
                                            href={login()}
                                            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[13px] font-bold text-[#0787f7] shadow-lg transition-all hover:shadow-xl"
                                        >
                                            Sign In
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-100 py-10">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <div className="flex items-center gap-3">
                                <img src="/images/logo.png" alt="HealthWise" className="h-8 w-8 rounded-lg object-contain" />
                                <span className="text-lg font-extrabold tracking-tight text-[#11165a]">
                                    Health<span className="text-[#0787f7]">Wise</span>
                                </span>
                            </div>
                            <p className="text-center text-[11px] text-[#192433]/35">
                                &copy; {new Date().getFullYear()} HealthWise — Ballogdajan Medical Clinic, Tibiao, Antique.
                                A Capstone Project, University of Antique.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
