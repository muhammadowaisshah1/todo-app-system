'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    CheckCircleIcon,
    CalendarIcon,
    TagIcon,
    ArrowLeftOnRectangleIcon,
    SunIcon,
    MoonIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const menuItems = [
    { name: 'All Tasks', icon: HomeIcon, href: '/dashboard' },
    { name: 'Completed', icon: CheckCircleIcon, href: '/dashboard?filter=completed' },
    { name: 'Today', icon: CalendarIcon, href: '/dashboard?filter=today' },
    { name: 'Priority', icon: TagIcon, href: '/dashboard?filter=priority' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);

    useEffect(() => {
        setMounted(true);
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/');
    };

    const isActive = (path: string) => pathname === path;

    if (!mounted) return null;

    return (
        <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-card/50 backdrop-blur-xl border-r border-border/50 shadow-lg transition-all duration-300">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-border/50 bg-gradient-to-r from-card to-card/80">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="text-xl font-black tracking-tight gradient-text">Prism AI</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-3 mt-2">
                    Workspace
                </div>
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${isActive(item.href)
                                ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-600 dark:text-cyan-400 shadow-sm'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:scale-105'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                        {isActive(item.href) && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full my-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />
                        )}
                    </Link>
                ))}
            </nav>

            {/* User Profile & Settings */}
            <div className="p-4 border-t border-border/50 space-y-4 bg-gradient-to-t from-muted/20 to-transparent">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all">
                    <span className="text-sm font-semibold">Theme</span>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 dark:from-blue-500 dark:to-purple-600 text-white hover:scale-110 transition-all duration-300 shadow-lg"
                    >
                        {theme === 'dark' ? (
                            <SunIcon className="w-4 h-4" />
                        ) : (
                            <MoonIcon className="w-4 h-4" />
                        )}
                    </button>
                </div>

                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-border/30 hover:shadow-lg transition-all duration-300">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-cyan-500/30">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover:scale-110"
                        title="Logout"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
