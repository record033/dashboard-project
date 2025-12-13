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
      setUsers(prev => prev.filter((u) => u.id !== id));
    } catch (e) {
      alert('error deleting user');
    }
  };

  const handleToggleRole = async (user: UserItem) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`change role to ${newRole}?`)) return;

    try {
      await UsersService.update(user.id, { role: newRole });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (e) {
      alert('error updating user role');
    }
  };

  if (loading) return <div>loading...</div>;
  if (error) return <div className="text-red-600 font-bold p-6">{error}</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
         <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Users</h2>
         <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
            Total: {users.length}
         </span>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Registration date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Updated at</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50/50 transition-colors duration-150">

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">#{user.id}</td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                        {user.email[0].toUpperCase()}
                    </div>
                    {user.email}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                   {user.firstName} {user.lastName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span 
                    onClick={() => handleToggleRole(user)}
                    className={`cursor-pointer px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border transition-all select-none ${
                    user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200' 
                        : 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
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
                    className="text-red-400 hover:text-red-600 transition-colors font-medium hover:bg-red-50 px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}