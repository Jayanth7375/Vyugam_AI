import React, { useEffect, useState } from 'react';
import { Users, FileText, Plus } from 'lucide-react';
import { apiClient } from '../../api/client';
import type { Team } from '../../types';
import { CreateTeamModal } from './CreateTeamModal';
import { IdeaSubmissionForm } from './IdeaSubmissionForm';

export const StudentDashboard: React.FC = () => {
  const [teamData, setTeamData] = useState<Team | null>(null);
  const [hasTeam, setHasTeam] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'submission'>('roster');

  const fetchTeam = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/teams/my-team');
      if (res.data.success) {
        setHasTeam(res.data.hasTeam);
        setTeamData(res.data.team);
      }
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading Student Portal Dashboard...</p>
      </div>
    );
  }

  if (!hasTeam) {
    return (
      <div className="py-12 max-w-4xl mx-auto px-4">
        <div className="bg-white p-10 rounded-none text-center border border-slate-200 space-y-6 shadow-2xs">
          <div className="w-16 h-16 bg-purple-50 border border-purple-200 rounded-none flex items-center justify-center mx-auto text-[#2e1065]">
            <Users className="w-8 h-8" />
          </div>

          <div className="max-w-lg mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">Register Your Hackathon Team</h2>
            <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
              Form a team of 4 students to select problem statements, collaborate on code repositories, and submit project proposals for Vyugam AI evaluation.
            </p>
          </div>

          <button
            onClick={() => setIsTeamModalOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-none bg-[#2e1065] hover:bg-[#3b0764] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 text-white" />
            <span>Create Team Now</span>
          </button>

          <CreateTeamModal
            isOpen={isTeamModalOpen}
            onClose={() => setIsTeamModalOpen(false)}
            onSuccess={fetchTeam}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#1755a7] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase">
              Team Portal
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Status: {teamData?.status?.toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a2540]">
            Team {teamData?.name}
          </h2>
          <p className="text-xs text-slate-500">
            {teamData?.college} | Track: <strong className="text-slate-800">{teamData?.track}</strong>
          </p>
        </div>

        {/* Selected Problem Statement Indicator */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md w-full relative z-10">
          <div className="text-[11px] uppercase font-bold text-slate-500 mb-1 flex items-center justify-between">
            <span>Selected Problem Statement</span>
            <span className="text-[#1755a7] font-mono font-bold">{teamData?.problem_statement_id || 'Not Selected'}</span>
          </div>
          <p className="text-xs font-semibold text-slate-800 truncate">
            {teamData?.problem_title || 'No problem statement selected yet. Explore PS portal to lock one.'}
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'roster' ? 'bg-blue-50 text-[#1755a7] border border-blue-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team Roster ({teamData?.members?.length || 0} Members)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('submission')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'submission' ? 'bg-blue-50 text-[#1755a7] border border-blue-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Idea Submission & PPT</span>
        </button>
      </div>

      {/* Tab Content 1: Roster */}
      {activeSubTab === 'roster' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamData?.members.map((m, idx) => (
              <div key={m.id || idx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 relative shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1755a7] font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0a2540]">{m.name}</h4>
                      <p className="text-[11px] text-slate-500">{m.email}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Role:</span> <strong className="text-slate-800">{m.role_in_team}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Gender:</span> <strong className="text-slate-800">{m.gender}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Proposal Submission Form */}
      {activeSubTab === 'submission' && (
        <IdeaSubmissionForm
          existingSubmission={teamData?.submission}
          onSuccess={fetchTeam}
        />
      )}

    </div>
  );
};
