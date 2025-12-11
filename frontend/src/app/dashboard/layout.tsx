'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '@/services/auth.service';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('access_token');
      router.push('/auth/login');
    }
  };

  if (!authorized) {
    return <div className="min-h-screen flex items-center justify-center">Loading..</div>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My records', href: '/dashboard/records' },
    { name: 'Users', href: '/dashboard/users' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl transition-all duration-300">
        <div className="p-6 border-b border-slate-700 flex items-center justify-center">
          <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
            DASHBOARD
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-3 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-red-200 bg-red-900/20 hover:bg-red-600 hover:text-white transition-all duration-300 border border-red-900/30 hover:border-transparent"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}