import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import {
    ClipboardList,
    Search,
    ChevronDown,
    ChevronRight,
    User as UserIcon,
    Phone,
    MapPin,
    Droplets,
    Heart,
    Calendar,
    Activity,
    Thermometer,
    Weight,
    Pill,
    AlertCircle,
    FileText,
    Filter,
} from 'lucide-react';

type PatientAppointment = {
    id: number;
    date: string;
    session: string;
    reason: string;
    symptoms: string | null;
    priority_type: string;
    status: string;
    queue_number: number | null;
    notes: string | null;
    contact_number: string | null;
    allergies: string | null;
    current_medication: string | null;
    medical_history: string | null;
    temperature: string | null;
    blood_pressure: string | null;
    weight: string | null;
};

type Patient = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    gender: string | null;
    birthdate: string | null;
    address: string | null;
    contact_person: string | null;
    contact_number: string | null;
    blood_type: string | null;
    civil_status: string | null;
    status: string | null;
    created_at: string;
    appointments_count: number;
};

type PaginatedPatients = {
    data: Patient[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    patients: PaginatedPatients;
    filters: { search?: string; gender?: string; blood_type?: string; civil_status?: string };
};

function getRolePrefix(): string {
    const path = window.location.pathname;
    if (path.startsWith('/doctor')) return '/doctor';
    return '/secretary';
}

export default function PatientRecords({ patients, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [filterGender, setFilterGender] = useState(filters.gender || '');
    const [filterBlood, setFilterBlood] = useState(filters.blood_type || '');
    const [filterCivil, setFilterCivil] = useState(filters.civil_status || '');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [loadingAppts, setLoadingAppts] = useState(false);
    const [appointments, setAppointments] = useState<Record<number, PatientAppointment[]>>({});
    const prefix = getRolePrefix();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get(`${prefix}/patient-records`, {
            search,
            gender: filterGender,
            blood_type: filterBlood,
            civil_status: filterCivil,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setFilterGender('');
        setFilterBlood('');
        setFilterCivil('');
        router.get(`${prefix}/patient-records`, {}, { preserveState: true });
    };

    const toggleExpand = async (patientId: number) => {
        if (expandedId === patientId) {
            setExpandedId(null);
            return;
        }
        setExpandedId(patientId);

        if (!appointments[patientId]) {
            setLoadingAppts(true);
            try {
                const res = await fetch(`${prefix}/patient-records/${patientId}/appointments`);
                const data = await res.json();
                setAppointments((prev) => ({ ...prev, [patientId]: data }));
            } catch {
                // fail silently
            } finally {
                setLoadingAppts(false);
            }
        }
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'confirmed': return 'bg-green-50 text-green-700 border-green-200';
            case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
            case 'not_arrived': return 'bg-neutral-100 text-neutral-500 border-neutral-200';
            default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
        }
    };

    const priorityBadge = (type: string) => {
        switch (type) {
            case 'senior': return 'bg-purple-50 text-purple-700';
            case 'pwd': return 'bg-indigo-50 text-indigo-700';
            case 'pregnant': return 'bg-pink-50 text-pink-700';
            default: return 'bg-neutral-50 text-neutral-500';
        }
    };

    const calculateAge = (birthdate: string | null) => {
        if (!birthdate) return null;
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    const hasActiveFilters = filterGender || filterBlood || filterCivil;

    return (
        <>
            <Head title="Patient Records" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <ClipboardList className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Patient Records</h1>
                            <p className="text-xs text-neutral-400">{patients.total} registered patients</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 w-56 rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                            />
                        </form>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                                hasActiveFilters
                                    ? 'border-[#0787f7] bg-[#0787f7]/5 text-[#0787f7]'
                                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300'
                            }`}
                        >
                            <Filter className="h-3.5 w-3.5" />
                            Filters
                            {hasActiveFilters && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0787f7] text-[9px] font-bold text-white">!</span>}
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
                        <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                            <option value="">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <select value={filterBlood} onChange={(e) => setFilterBlood(e.target.value)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                            <option value="">All Blood Types</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        <select value={filterCivil} onChange={(e) => setFilterCivil(e.target.value)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs focus:border-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                            <option value="">All Civil Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="widowed">Widowed</option>
                            <option value="separated">Separated</option>
                        </select>
                        <button onClick={applyFilters} className="h-8 rounded-lg bg-[#0787f7] px-3 text-xs font-semibold text-white hover:bg-[#0670d4]">Apply</button>
                        <button onClick={clearFilters} className="h-8 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400">Clear</button>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                                <tr>
                                    <th className="w-8 px-2 py-2.5"></th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Patient</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Contact</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Age / Gender</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Blood</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Civil Status</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Address</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Emergency Contact</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Visits</th>
                                    <th className="px-3 py-2.5 font-semibold text-neutral-600 dark:text-neutral-300">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {patients.data.map((patient) => (
                                    <>
                                        <tr
                                            key={patient.id}
                                            onClick={() => toggleExpand(patient.id)}
                                            className="cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                        >
                                            <td className="px-2 py-2.5 text-center">
                                                {expandedId === patient.id ? (
                                                    <ChevronDown className="mx-auto h-3.5 w-3.5 text-[#0787f7]" />
                                                ) : (
                                                    <ChevronRight className="mx-auto h-3.5 w-3.5 text-neutral-400" />
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0787f7]/20 to-[#0787f7]/5">
                                                        <UserIcon className="h-3.5 w-3.5 text-[#0787f7]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{patient.name}</p>
                                                        <p className="text-[10px] text-neutral-400">{patient.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2.5">
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="h-3 w-3 text-neutral-400" />
                                                    <span className="text-neutral-600 dark:text-neutral-300">{patient.phone || '—'}</span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2.5 text-neutral-600 dark:text-neutral-300">
                                                {patient.birthdate ? (
                                                    <span>{calculateAge(patient.birthdate)} yrs / <span className="capitalize">{patient.gender || '—'}</span></span>
                                                ) : (
                                                    <span className="capitalize">{patient.gender || '—'}</span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2.5">
                                                {patient.blood_type ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">
                                                        <Droplets className="h-2.5 w-2.5" />
                                                        {patient.blood_type}
                                                    </span>
                                                ) : (
                                                    <span className="text-neutral-400">—</span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2.5 capitalize text-neutral-600 dark:text-neutral-300">{patient.civil_status || '—'}</td>
                                            <td className="max-w-[140px] truncate px-3 py-2.5 text-neutral-600 dark:text-neutral-300">
                                                {patient.address ? (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 shrink-0 text-neutral-400" />
                                                        <span className="truncate">{patient.address}</span>
                                                    </div>
                                                ) : '—'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2.5 text-neutral-600 dark:text-neutral-300">
                                                {patient.contact_person ? (
                                                    <div>
                                                        <p className="text-xs">{patient.contact_person}</p>
                                                        <p className="text-[10px] text-neutral-400">{patient.contact_number || ''}</p>
                                                    </div>
                                                ) : '—'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2.5">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#0787f7]/10 px-2 py-0.5 text-[10px] font-bold text-[#0787f7]">
                                                    <Calendar className="h-2.5 w-2.5" />
                                                    {patient.appointments_count}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2.5 text-neutral-500">
                                                {format(new Date(patient.created_at), 'MMM d, yyyy')}
                                            </td>
                                        </tr>

                                        {/* Expanded Row - Appointment History */}
                                        {expandedId === patient.id && (
                                            <tr key={`${patient.id}-detail`}>
                                                <td colSpan={10} className="bg-neutral-50/50 px-0 py-0 dark:bg-neutral-800/30">
                                                    <div className="border-l-4 border-[#0787f7] px-6 py-4">
                                                        <div className="mb-3 flex items-center gap-2">
                                                            <Activity className="h-4 w-4 text-[#0787f7]" />
                                                            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Appointment History</h3>
                                                            <span className="text-[10px] text-neutral-400">({patient.appointments_count} total)</span>
                                                        </div>

                                                        {loadingAppts && !appointments[patient.id] ? (
                                                            <div className="flex items-center gap-2 py-4">
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0787f7] border-t-transparent" />
                                                                <span className="text-xs text-neutral-400">Loading records...</span>
                                                            </div>
                                                        ) : appointments[patient.id]?.length === 0 ? (
                                                            <p className="py-4 text-xs text-neutral-400">No appointment records found.</p>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {appointments[patient.id]?.map((apt) => (
                                                                    <div key={apt.id} className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
                                                                        {/* Appointment header row */}
                                                                        <div className="flex flex-wrap items-center gap-3">
                                                                            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                                                {format(new Date(apt.date.slice(0, 10) + 'T00:00:00'), 'MMM d, yyyy')}
                                                                            </span>
                                                                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${apt.session === 'AM' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                                                                                {apt.session === 'AM' ? '☀ Morning' : '🌙 Afternoon'}
                                                                            </span>
                                                                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${statusBadge(apt.status)}`}>
                                                                                {apt.status.replace('_', ' ')}
                                                                            </span>
                                                                            {apt.priority_type !== 'regular' && (
                                                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${priorityBadge(apt.priority_type)}`}>
                                                                                    {apt.priority_type}
                                                                                </span>
                                                                            )}
                                                                            {apt.queue_number && (
                                                                                <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                                                                                    Q#{apt.queue_number}
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        {/* Appointment details grid */}
                                                                        <div className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
                                                                            <div className="flex items-start gap-1.5">
                                                                                <FileText className="mt-0.5 h-3 w-3 shrink-0 text-neutral-400" />
                                                                                <div>
                                                                                    <p className="text-[10px] font-medium text-neutral-500">Reason</p>
                                                                                    <p className="text-xs text-neutral-700 dark:text-neutral-200">{apt.reason}</p>
                                                                                </div>
                                                                            </div>
                                                                            {apt.symptoms && (
                                                                                <div className="flex items-start gap-1.5">
                                                                                    <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-neutral-400" />
                                                                                    <div>
                                                                                        <p className="text-[10px] font-medium text-neutral-500">Symptoms</p>
                                                                                        <p className="text-xs text-neutral-700 dark:text-neutral-200">{apt.symptoms}</p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {apt.temperature && (
                                                                                <div className="flex items-start gap-1.5">
                                                                                    <Thermometer className="mt-0.5 h-3 w-3 shrink-0 text-neutral-400" />
                                                                                    <div>
                                                                                        <p className="text-[10px] font-medium text-neutral-500">Temperature</p>
                                                                                        <p className="text-xs text-neutral-700 dark:text-neutral-200">{apt.temperature}</p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {apt.blood_pressure && (
                                                                                <div className="flex items-start gap-1.5">
                                                                                    <Heart className="mt-0.5 h-3 w-3 shrink-0 text-neutral-400" />
                                                                                    <div>
                                                                                        <p className="text-[10px] font-medium text-neutral-500">Blood Pressure</p>
                                                                                        <p className="text-xs text-neutral-700 dark:text-neutral-200">{apt.blood_pressure}</p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {apt.weight && (
                                                                                <div className="flex items-start gap-1.5">
                                                                                    <Weight className="mt-0.5 h-3 w-3 shrink-0 text-neutral-400" />
                                                                                    <div>
                                                                                        <p className="text-[10px] font-medium text-neutral-500">Weight</p>
                                                                                        <p className="text-xs text-neutral-700 dark:text-neutral-200">{apt.weight} kg</p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {apt.allergies && (
                                                                                <div className="flex items-start gap-1.5">
                                                                                    <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-red-400" />
                                                                                    <div>
                                                                                        <p className="text-[10px] font-medium text-red-500">Allergies</p>
                                                                                        <p className="text-xs text-neutral-700 dark:text-neutral-200">{apt.allergies}</p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {apt.current_medication && (
                                                                                <div className="flex items-start gap-1.5">
                                                                                    <Pill className="mt-0.5 h-3 w-3 shrink-0 text-neutral-400" />
                                                                                    <div>
                                                                                        <p className="text-[10px] font-medium text-neutral-500">Medication</p>
                                                                                        <p className="text-xs text-neutral-700 dark:text-neutral-200">{apt.current_medication}</p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {apt.medical_history && (
                                                                                <div className="flex items-start gap-1.5 sm:col-span-2">
                                                                                    <ClipboardList className="mt-0.5 h-3 w-3 shrink-0 text-neutral-400" />
                                                                                    <div>
                                                                                        <p className="text-[10px] font-medium text-neutral-500">Medical History</p>
                                                                                        <p className="text-xs text-neutral-700 dark:text-neutral-200">{apt.medical_history}</p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {apt.notes && (
                                                                                <div className="flex items-start gap-1.5 sm:col-span-2">
                                                                                    <FileText className="mt-0.5 h-3 w-3 shrink-0 text-neutral-400" />
                                                                                    <div>
                                                                                        <p className="text-[10px] font-medium text-neutral-500">Notes</p>
                                                                                        <p className="text-xs text-neutral-700 dark:text-neutral-200">{apt.notes}</p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                                {patients.data.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-12 text-center">
                                            <UserIcon className="mx-auto mb-2 h-8 w-8 text-neutral-300" />
                                            <p className="text-sm font-medium text-neutral-400">No patients found</p>
                                            <p className="text-xs text-neutral-300">Try adjusting your search or filters.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {patients.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 dark:border-neutral-700">
                            <p className="text-xs text-neutral-400">
                                Page {patients.current_page} of {patients.last_page} · {patients.total} patients
                            </p>
                            <div className="flex gap-1">
                                {patients.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                            link.active
                                                ? 'bg-[#0787f7] text-white'
                                                : 'text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-neutral-800'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
