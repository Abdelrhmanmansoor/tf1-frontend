'use client';

import { useQuery } from '@tanstack/react-query';
import sportsAdminService from '@/services/sportsAdmin';
import { Users, Briefcase, FileText, Activity, AlertCircle, Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

function SportsAdminDashboardContent() {
    const { data: dashboardData, isLoading, error } = useQuery({
        queryKey: ['sports-admin-dashboard'],
        queryFn: sportsAdminService.getDashboard
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>Failed to load dashboard data. Please check your permissions or try again.</span>
            </div>
        );
    }

    const stats = dashboardData?.stats;

    const cards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600 bg-blue-100' },
        { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: Briefcase, color: 'text-green-600 bg-green-100' },
        { label: 'Applications', value: stats?.totalApplications || 0, icon: FileText, color: 'text-purple-600 bg-purple-100' },
        { label: 'Active Users', value: stats?.activeUsers || 0, icon: Activity, color: 'text-orange-600 bg-orange-100' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500">Welcome back, Administrator.</p>
                </div>
                <div className="text-sm bg-white border border-slate-200 px-3 py-1 rounded shadow-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${card.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Since last month</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800">{card.value}</h3>
                            <p className="text-sm text-slate-500 mt-1">{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Logs Section */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Recent System Activity</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-4 py-3 font-medium">Action</th>
                                <th className="px-4 py-3 font-medium">Actor</th>
                                <th className="px-4 py-3 font-medium">Target</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dashboardData?.recentLogs?.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-medium text-slate-700">{log.action}</td>
                                    <td className="px-4 py-3 text-slate-600">{log.actor}</td>
                                    <td className="px-4 py-3 text-slate-600">{log.target}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                            {!dashboardData?.recentLogs?.length && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                                        No recent logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function SportsAdminDashboard() {
    return (
        <ProtectedRoute allowedRoles={['sports-administrator']}>
            <SportsAdminDashboardContent />
        </ProtectedRoute>
    );
}
