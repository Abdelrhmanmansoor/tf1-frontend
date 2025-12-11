'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Shield,
    FileText,
    Settings,
    Activity,
    LogOut,
    Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const MENU_ITEMS = [
    {
        label: 'Overview',
        href: '/dashboard/sports-admin',
        icon: LayoutDashboard
    },
    {
        label: 'Teams',
        href: '/dashboard/sports-admin/teams',
        icon: Briefcase
    },
    {
        label: 'Users',
        href: '/dashboard/sports-admin/users',
        icon: Users
    },
    {
        label: 'Permissions',
        href: '/dashboard/sports-admin/permissions',
        icon: Shield
    },
    {
        label: 'Audit Logs',
        href: '/dashboard/sports-admin/audit-logs',
        icon: FileText
    },
    {
        label: 'Settings',
        href: '/dashboard/sports-admin/settings',
        icon: Settings
    },
    {
        label: 'Analytics',
        href: '/dashboard/sports-admin/analytics',
        icon: Activity
    }
];

export default function SportsAdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Sports Admin
                </h1>
                <p className="text-xs text-slate-400 mt-1">Management Console</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }
              `}
                        >
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
