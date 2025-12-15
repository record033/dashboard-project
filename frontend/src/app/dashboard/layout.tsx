'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '@/services/auth.service';

type DashboardLayoutProps = {
    children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
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
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
                Loading dashboard...
            </div>
        );
    }

    const navItems = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'My records', href: '/dashboard/records' },
        { name: 'Users', href: '/dashboard/users' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-700">
                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                        </svg>
                        <span className="text-lg font-semibold tracking-tight">Dashboard</span>
                    </div>
                </div>

                <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative group flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}>
                                {isActive && (
                                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r" />
                                )}

                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
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
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                            />
                        </svg>
                        Sign out
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-gray-50">
                <div className="max-w-7xl mx-auto p-8">{children}</div>
            </main>
        </div>
    );
};

export default DashboardLayout;
