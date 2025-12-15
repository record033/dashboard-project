'use client';

import { useEffect, useState } from 'react';
import { UserItem, UsersService } from '@/services/user.service';

export default function UsersPage() {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await UsersService.getAll();
                setUsers(data);
            } catch (e: any) {
                if (e.response?.status === 403) {
                    setError('access denied.');
                } else {
                    setError('error loading users.');
                }
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('delete user?')) return;
        try {
            await UsersService.delete(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (e) {
            alert('error deleting user');
        }
    };

    const handleToggleRole = async (user: UserItem) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (!confirm(`change role to ${newRole}?`)) return;

        try {
            await UsersService.update(user.id, { role: newRole });
            setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
        } catch (e) {
            alert('error updating user role');
        }
    };

    if (loading) return <div className="p-8 text-gray-500">loading...</div>;
    if (error) return <div className="p-8 text-red-600 font-medium">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                <span className="bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Total: {users.length}
                </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Registered
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Updated
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user.id}</td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                                                {user.email[0].toUpperCase()}
                                            </div>
                                            {user.email}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {user.firstName ? `${user.firstName} ${user.lastName || ''}` : '-'}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => handleToggleRole(user)}
                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border transition-opacity hover:opacity-80 ${
                                                user.role === 'admin'
                                                    ? 'bg-gray-100 text-gray-800 border-gray-200'
                                                    : 'bg-green-50 text-green-700 border-green-100'
                                            }`}>
                                            {user.role.toUpperCase()}
                                        </button>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                        {new Date(user.updatedAt).toLocaleDateString()}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
