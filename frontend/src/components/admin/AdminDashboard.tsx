import React, { useEffect, useState } from 'react';
import { Plus, Trophy } from 'lucide-react';
import { apiClient } from '../../api/client';
import { ManageProblemsModal } from './ManageProblemsModal';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddPsOpen, setIsAddPsOpen] = useState(false);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/admin/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        Loading Admin Analytics & Control Dashboard...
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Admin Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#1755a7] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase">
              Admin Control Center
            </span>
            <span className="text-xs text-slate-500">College Hackathon Host Command</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a2540]">
            Vyugam AI Hackathon Management
          </h2>
          <p className="text-xs text-slate-500">
            Monitor real-time participation metrics, issue announcements, and review evaluator scoreboards.
          </p>
        </div>

        <button
          onClick={() => setIsAddPsOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1755a7] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Publish Problem Statement</span>
        </button>
      </div>

      {/* Grid of Key Admin Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Registered Teams', val: stats.totalTeams, sub: 'Active Student Squads' },
          { label: 'Proposals Submitted', val: stats.totalSubmissions, sub: 'In Evaluation Pipeline' },
          { label: 'Jury Evaluated', val: stats.totalEvaluated, sub: 'Scored Submissions' },
          { label: 'Problem Statements', val: stats.totalProblemStatements, sub: 'Live Challenges' },
        ].map((st, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-semibold">{st.label}</div>
            <div className="text-2xl font-black text-[#1755a7] font-mono my-1">{st.val}</div>
            <div className="text-[10px] text-slate-400">{st.sub}</div>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#1755a7]" />
            <h3 className="text-base font-bold text-[#0a2540]">Live Evaluator Score Leaderboard</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Weighted Average Scoring</span>
        </div>

        {data?.topTeams && data.topTeams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Team Name</th>
                  <th className="p-3">College</th>
                  <th className="p-3">Idea Title</th>
                  <th className="p-3 text-right">Avg Jury Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.topTeams.map((team: any, idx: number) => (
                  <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#1755a7]">#{idx + 1}</td>
                    <td className="p-3 font-bold text-[#0a2540]">{team.team_name}</td>
                    <td className="p-3 text-slate-500">{team.college}</td>
                    <td className="p-3 text-slate-800">{team.idea_title}</td>
                    <td className="p-3 text-right font-mono font-black text-[#1755a7] text-sm">
                      {Math.round(team.avg_score)} / 100
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500">No evaluations submitted yet.</div>
        )}
      </div>

      {/* Manage PS Modal */}
      <ManageProblemsModal
        isOpen={isAddPsOpen}
        onClose={() => setIsAddPsOpen(false)}
        onSuccess={fetchAdminData}
      />

    </div>
  );
};
