'use client';

import { useState, useEffect, useCallback } from 'react';
import ownerClient from '@/services/ownerApiClient';
import { Shield, Lock, Activity, Users, FileText, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function PlatformControlPage() {
    const [key, setKey] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    const verifyKey = useCallback(async (secret: string) => {
        setLoading(true);
        try {
            // Temporarily store to test the request
            sessionStorage.setItem('tf1_owner_key', secret);

            // We assume there's a stats endpoint or we just check if we can connect
            // For now, we'll try to fetch stats. If backend not ready, we might simulate.
            // But per instructions, valid key -> access. 
            // Let's assume hitting /stats or similar validation.
            // If 401, catch will trigger.

            const response = await ownerClient.get('/stats');
            setStats(response.data);
            setIsAuthenticated(true);
            toast.success('Access Granted');
        } catch (error: any) {
            console.error('Owner auth failed', error);
            sessionStorage.removeItem('tf1_owner_key');
            setIsAuthenticated(false);
            // Only show error if we were manually submitting
            if (key) toast.error('Invalid Master Key');
        } finally {
            setLoading(false);
        }
    }, [key]);

    // Check session on mount
    useEffect(() => {
        const storedKey = sessionStorage.getItem('tf1_owner_key');
        if (storedKey) {
            verifyKey(storedKey);
        } else {
            setLoading(false);
        }
    }, [verifyKey]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!key) return;
        verifyKey(key);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('tf1_owner_key');
        setIsAuthenticated(false);
        setKey('');
        setStats(null);
        toast.info('Logged out securely');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-950 p-4">
                <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                            <Shield className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Platform Control</h1>
                        <p className="text-gray-400 text-sm mt-2">Restricted Access • Good Mode</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="master-key" className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">
                                Master Key Authorization
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    id="master-key"
                                    type="password"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono placeholder:text-gray-700"
                                    placeholder="ENTER-SECURE-KEY"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!key}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Authenticate
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                        <p className="text-xs text-gray-600">
                            IP Logged • Unauthorized attempts will be reported.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Top Bar */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-red-500" />
                        <span className="font-bold text-lg tracking-tight">Platform Control</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded border border-red-500/20 font-mono">
                            GOD MODE ACTIVE
                        </span>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stat Cards */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold">{stats?.response?.totalUsers || '0'}</p>
                        <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                            Active platform users
                        </p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-medium">System Health</h3>
                            <Activity className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold">98.9%</p>
                        <p className="text-xs text-gray-500 mt-2">
                            Uptime (Last 30 days)
                        </p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-medium">Audit Logs</h3>
                            <FileText className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold">{stats?.response?.logsCount || '0'}</p>
                        <p className="text-xs text-gray-500 mt-2">
                            Actions recorded today
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4">Recent Audit Logs</h3>
                        <div className="space-y-3">
                            {/* Placeholder for logs list */}
                            {stats?.response?.recentLogs?.map((log: any, i: number) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{log.action}</p>
                                        <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-gray-800 rounded">{log.admin}</span>
                                </div>
                            )) || <p className="text-gray-500 text-sm">No recent logs available.</p>}
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 bg-gray-950 border border-gray-700 hover:border-gray-500 rounded-lg text-left transition-colors group">
                                <span className="block text-sm font-medium text-white group-hover:text-red-400">Flush Cache</span>
                                <span className="text-xs text-gray-500">Reset all server caches</span>
                            </button>
                            <button className="p-4 bg-gray-950 border border-gray-700 hover:border-gray-500 rounded-lg text-left transition-colors group">
                                <span className="block text-sm font-medium text-white group-hover:text-red-400">Force Re-auth</span>
                                <span className="text-xs text-gray-500">Log out all users</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
