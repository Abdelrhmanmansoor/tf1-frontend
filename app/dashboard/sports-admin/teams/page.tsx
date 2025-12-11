'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import sportsAdminService from '@/services/sportsAdmin';
import { ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TeamsPage() {
    const queryClient = useQueryClient();

    const { data: teams, isLoading } = useQuery({
        queryKey: ['admin-teams'],
        queryFn: sportsAdminService.getTeams
    });

    const verifyTeamMutation = useMutation({
        mutationFn: (teamId: string) => sportsAdminService.verifyTeam(teamId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
            toast.success('Team verified successfully');
        },
        onError: () => {
            toast.error('Failed to verify team');
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Teams Management</h1>
                    <p className="text-slate-500">Manage and verify sports teams.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Team Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Registration #</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {teams?.map((team: any) => (
                                <tr key={team.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{team.name}</td>
                                    <td className="px-6 py-4 capitalize">{team.type}</td>
                                    <td className="px-6 py-4 font-mono text-slate-500">{team.registrationNumber || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        {team.verified ? (
                                            <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium border border-green-100">
                                                <CheckCircle2 className="w-3 h-3" /> Verified
                                            </span>
                                        ) : (
                                            <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs font-medium">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!team.verified && (
                                            <button
                                                onClick={() => verifyTeamMutation.mutate(team.id)}
                                                disabled={verifyTeamMutation.isPending}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                <ShieldCheck className="w-3 h-3" />
                                                Verify
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {teams?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        No teams found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
