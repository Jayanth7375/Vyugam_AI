import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import { PencilLoader } from '../ui/loader-1';
import type { Submission } from '../../types';
import { ScoringModal } from './ScoringModal';

export const EvaluatorDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const fetchQueue = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/evaluator/queue');
      if (res.data.success) {
        setSubmissions(res.data.submissions);
      }
    } catch (err) {
      console.error('Error fetching evaluation queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#1755a7] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase">
              Jury Portal
            </span>
            <span className="text-xs text-slate-500">Vyugam AI 5-Criterion Evaluation Rubric</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a2540]">
            Evaluator Scoring Center
          </h2>
          <p className="text-xs text-slate-500">
            Review submitted team proposals, test prototype repos, and award official score points.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Submissions in Queue</div>
            <div className="text-2xl font-black text-[#1755a7] font-mono">{submissions.length}</div>
          </div>
        </div>
      </div>

      {/* Queue Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <PencilLoader size={150} text="Loading evaluation queue..." />
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl text-center border border-slate-200 text-slate-500 text-xs shadow-xs">
          No team submissions available for evaluation yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.map((sub: any) => (
            <div key={sub.id} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 relative flex flex-col justify-between shadow-xs hover:border-[#1755a7] transition-all">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#1755a7] font-bold bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                    {sub.problem_statement_id}
                  </span>
                  <span className="text-slate-600 font-semibold">{sub.team_name} ({sub.team_college})</span>
                </div>

                <h3 className="text-base font-bold text-[#0a2540] leading-snug">{sub.idea_title}</h3>

                <p className="text-xs text-slate-600 line-clamp-3">{sub.executive_summary}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Evaluations: <strong className="text-slate-800">{sub.evaluation_count || 0} Reviews</strong></div>
                  {sub.avg_score && (
                    <div className="text-xs font-bold text-[#1755a7] font-mono">Avg Score: {Math.round(sub.avg_score)} / 100</div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedSubmission(sub)}
                  className="px-4 py-2 bg-[#1755a7] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
                >
                  Score Proposal
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Scoring Modal */}
      <ScoringModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onSuccess={fetchQueue}
      />

    </div>
  );
};
