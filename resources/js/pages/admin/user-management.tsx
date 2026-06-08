import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { User, UserRole } from '@/types/auth';
import { useState } from 'react';
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    Users,
    Check,
} from 'lucide-react';

type PaginatedUsers = {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    users: PaginatedUsers;
    filters: { search?: string };
};

type UserFormData = {
    name: string;
    email: string;
    role: UserRole | '';
    phone: string;
    gender: string;
    birthdate: string;
    address: string;
    contact_person: string;
    contact_number: string;
    blood_type: string;
    civil_status: string;
    status: string;
    password: string;
    password_confirmation: string;
};

const emptyForm: UserFormData = {
    name: '',
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
    status: 'active',
    password: '',
    password_confirmation: '',
};

function getRolePrefix(): string {
    const path = window.location.pathname;
    if (path.startsWith('/doctor')) return '/doctor';
    if (path.startsWith('/secretary')) return '/secretary';
    return '/secretary';
}

export default function UserManagement({ users, filters }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const form = useForm<UserFormData>({ ...emptyForm });

    const openCreate = () => {
        setEditingUser(null);
        form.reset();
        form.setData({ ...emptyForm });
        setShowModal(true);
    };

    const openEdit = (user: User) => {
        setEditingUser(user);
        form.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            phone: (user.phone as string) || '',
            gender: (user.gender as string) || '',
            birthdate: (user.birthdate as string) || '',
            address: (user.address as string) || '',
            contact_person: (user.contact_person as string) || '',
            contact_number: (user.contact_number as string) || '',
            blood_type: (user.blood_type as string) || '',
            civil_status: (user.civil_status as string) || '',
            status: (user.status as string) || 'active',
            password: '',
            password_confirmation: '',
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const prefix = getRolePrefix();
        if (editingUser) {
            form.put(`${prefix}/users/${editingUser.id}`, {
                onSuccess: () => setShowModal(false),
                preserveScroll: true,
            });
        } else {
            form.post(`${prefix}/users`, {
                onSuccess: () => setShowModal(false),
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            const prefix = getRolePrefix();
            router.delete(`${prefix}/users/${user.id}`, { preserveScroll: true });
        }
    };

    const handleApprove = (user: User) => {
        const prefix = getRolePrefix();
        router.patch(`${prefix}/users/${user.id}/approve`, {}, { preserveScroll: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const prefix = getRolePrefix();
        router.get(`${prefix}/users`, { search }, { preserveState: true });
    };

    const roleBadge = (role: string) => {
        const styles: Record<string, string> = {
            doctor: 'bg-emerald-50 text-emerald-700',
            secretary: 'bg-purple-50 text-purple-700',
            pharmacist: 'bg-amber-50 text-amber-700',
            patient: 'bg-blue-50 text-blue-700',
        };
        return styles[role] || 'bg-gray-50 text-gray-700';
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-50 text-green-700';
            case 'inactive': return 'bg-red-50 text-red-700';
            case 'pending': return 'bg-amber-50 text-amber-700';
            default: return 'bg-gray-50 text-gray-700';
        }
    };

    return (
        <>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0787f7]/10">
                            <Users className="h-5 w-5 text-[#0787f7]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">User Management</h1>
                            <p className="text-xs text-neutral-400">{users.total} total users</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 w-56 rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                            />
                        </form>
                        <button
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#0787f7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0670d4]"
                        >
                            <Plus className="h-4 w-4" />
                            Add New
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Name</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Email</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Role</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Phone</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Gender</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Birthdate</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Address</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Contact Person</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Contact #</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Blood Type</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Civil Status</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Status</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{user.name}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-300">{user.email}</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-300">{(user.phone as string) || '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 capitalize text-neutral-600 dark:text-neutral-300">{(user.gender as string) || '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-300">{(user.birthdate as string) || '—'}</td>
                                        <td className="max-w-[180px] truncate px-4 py-3 text-neutral-600 dark:text-neutral-300">{(user.address as string) || '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-300">{(user.contact_person as string) || '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-300">{(user.contact_number as string) || '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-300">{(user.blood_type as string) || '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 capitalize text-neutral-600 dark:text-neutral-300">{(user.civil_status as string) || '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusBadge((user.status as string) || 'active')}`}>
                                                {(user.status as string) || 'active'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                {(user.status as string) === 'pending' && (
                                                    <button
                                                        onClick={() => handleApprove(user)}
                                                        className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20"
                                                        title="Approve"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openEdit(user)}
                                                    className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-[#0787f7] dark:hover:bg-neutral-700"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan={13} className="px-4 py-8 text-center text-neutral-400">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 dark:border-neutral-700">
                            <p className="text-xs text-neutral-400">
                                Page {users.current_page} of {users.last_page} ({users.total} results)
                            </p>
                            <div className="flex gap-1">
                                {users.links.map((link, i) => (
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <X className="h-5 w-5 text-neutral-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Name *</label>
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                        required
                                    />
                                    {form.errors.name && <p className="mt-1 text-xs text-red-500">{form.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Email *</label>
                                    <input
                                        type="email"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                        required
                                    />
                                    {form.errors.email && <p className="mt-1 text-xs text-red-500">{form.errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Role *</label>
                                    <select
                                        value={form.data.role}
                                        onChange={(e) => form.setData('role', e.target.value as UserRole)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                        required
                                    >
                                        <option value="">Select role</option>
                                        <option value="patient">Patient</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="pharmacist">Pharmacist</option>
                                        <option value="secretary">Secretary</option>
                                    </select>
                                    {form.errors.role && <p className="mt-1 text-xs text-red-500">{form.errors.role}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Phone</label>
                                    <input
                                        type="text"
                                        value={form.data.phone}
                                        onChange={(e) => form.setData('phone', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                        placeholder="09XX-XXX-XXXX"
                                    />
                                    {form.errors.phone && <p className="mt-1 text-xs text-red-500">{form.errors.phone}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Gender</label>
                                    <select
                                        value={form.data.gender}
                                        onChange={(e) => form.setData('gender', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {form.errors.gender && <p className="mt-1 text-xs text-red-500">{form.errors.gender}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Birthdate</label>
                                    <input
                                        type="date"
                                        value={form.data.birthdate}
                                        onChange={(e) => form.setData('birthdate', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                    />
                                    {form.errors.birthdate && <p className="mt-1 text-xs text-red-500">{form.errors.birthdate}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Address</label>
                                    <input
                                        type="text"
                                        value={form.data.address}
                                        onChange={(e) => form.setData('address', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                        placeholder="Full address"
                                    />
                                    {form.errors.address && <p className="mt-1 text-xs text-red-500">{form.errors.address}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Status</label>
                                    <select
                                        value={form.data.status}
                                        onChange={(e) => form.setData('status', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                    >
                                        <option value="active">Active</option>
                                        <option value="pending">Pending</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    {form.errors.status && <p className="mt-1 text-xs text-red-500">{form.errors.status}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Contact Person</label>
                                    <input
                                        type="text"
                                        value={form.data.contact_person}
                                        onChange={(e) => form.setData('contact_person', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                        placeholder="Emergency contact name"
                                    />
                                    {form.errors.contact_person && <p className="mt-1 text-xs text-red-500">{form.errors.contact_person}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Contact Number</label>
                                    <input
                                        type="text"
                                        value={form.data.contact_number}
                                        onChange={(e) => form.setData('contact_number', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                        placeholder="09XX-XXX-XXXX"
                                    />
                                    {form.errors.contact_number && <p className="mt-1 text-xs text-red-500">{form.errors.contact_number}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Blood Type</label>
                                    <select
                                        value={form.data.blood_type}
                                        onChange={(e) => form.setData('blood_type', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                    >
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
                                    {form.errors.blood_type && <p className="mt-1 text-xs text-red-500">{form.errors.blood_type}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Civil Status</label>
                                    <select
                                        value={form.data.civil_status}
                                        onChange={(e) => form.setData('civil_status', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                    >
                                        <option value="">Select civil status</option>
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                        <option value="widowed">Widowed</option>
                                        <option value="separated">Separated</option>
                                    </select>
                                    {form.errors.civil_status && <p className="mt-1 text-xs text-red-500">{form.errors.civil_status}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                                        Password {editingUser ? '(leave blank to keep)' : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                        required={!editingUser}
                                    />
                                    {form.errors.password && <p className="mt-1 text-xs text-red-500">{form.errors.password}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={form.data.password_confirmation}
                                        onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm focus:border-[#0787f7] focus:ring-1 focus:ring-[#0787f7] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                        required={!editingUser}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#0787f7] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0670d4] disabled:opacity-50"
                                >
                                    {form.processing ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
