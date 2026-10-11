import React, { useState } from 'react';
import { X, Users, UserPlus, Trash2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [teamName, setTeamName] = useState('');
  const [college, setCollege] = useState(user?.college || 'Sri Eshwar College of Engineering');
  const [track, setTrack] = useState('Software');
  const [members, setMembers] = useState<Array<{ name: string; email: string; role_in_team: string; gender: string; college_id_no: string; year_of_study: string }>>([
    { name: '', email: '', role_in_team: 'Full Stack Developer', gender: 'Female', college_id_no: '', year_of_study: '3rd Year' },
    { name: '', email: '', role_in_team: 'AI / Data Engineer', gender: 'Male', college_id_no: '', year_of_study: '3rd Year' },
    { name: '', email: '', role_in_team: 'UI / UX & Research', gender: 'Female', college_id_no: '', year_of_study: '3rd Year' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddMember = () => {
    if (members.length >= 3) return;
    setMembers(prev => [
      ...prev,
      { name: '', email: '', role_in_team: 'AI / Data Engineer', gender: 'Male', college_id_no: '', year_of_study: '3rd Year' }
    ]);
  };

  const handleRemoveMember = (idx: number) => {
    setMembers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: string, value: string) => {
    setMembers(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setError('Please provide a unique team name.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const res = await apiClient.post('/teams/create', {
        name: teamName,
        college,
        track,
        members: members.filter(m => m.name.trim() && m.email.trim())
      });

      if (res.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.data.error || 'Failed to create team.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error creating team.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-none max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-none text-[#2e1065]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Create New Hackathon Team</h3>
              <p className="text-xs font-semibold text-slate-800">Vyugam AI Guideline: Team of 4 students with recommended female participation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 rounded-none bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-none font-semibold">
              {error}
            </div>
          )}

          {/* Team Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-900 font-bold mb-1">Team Name *</label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Neural Knights"
                className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-2 text-slate-900 focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-900 font-bold mb-1">College / Institute *</label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-2 text-slate-900 focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-900 font-bold mb-1">Track Category</label>
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-2 text-slate-900 focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065] focus:outline-none"
            >
              <option value="Software">Software Track</option>
              <option value="Hardware">Hardware & Embedded Track</option>
            </select>
          </div>

          {/* Team Leader Badge */}
          <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-none flex items-center justify-between text-slate-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2e1065]" />
              <span className="font-medium">Team Leader (1 of 4): <strong className="text-[#2e1065] font-bold">{user?.name}</strong> ({user?.email})</span>
            </div>
            <span className="text-[10px] bg-[#2e1065] text-white px-2 py-0.5 rounded-none font-bold uppercase">Leader</span>
          </div>

          {/* Members List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                Team Members (3 Additional for Team of 4 Students)
              </h4>
              <button
                type="button"
                onClick={handleAddMember}
                disabled={members.length >= 3}
                className="flex items-center gap-1 text-[#2e1065] hover:text-[#3b0764] font-bold disabled:opacity-40 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            {members.map((m, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-none space-y-2 relative">
                <div className="flex items-center justify-between text-slate-800 font-bold">
                  <span>Student Member #{idx + 2} of 4</span>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    required
                    value={m.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    className="bg-white border border-slate-300 rounded-none px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065]"
                  />
                  <input
                    type="email"
                    placeholder="Student Email (@sece.ac.in) *"
                    required
                    value={m.email}
                    onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                    className="bg-white border border-slate-300 rounded-none px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Role (e.g. AI Dev, Fullstack)"
                    value={m.role_in_team}
                    onChange={(e) => handleMemberChange(idx, 'role_in_team', e.target.value)}
                    className="bg-white border border-slate-300 rounded-none px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065]"
                  />
                  <select
                    value={m.gender}
                    onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                    className="bg-white border border-slate-300 rounded-none px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="College Roll No (e.g. SECE23CS01)"
                    value={m.college_id_no}
                    onChange={(e) => handleMemberChange(idx, 'college_id_no', e.target.value)}
                    className="bg-white border border-slate-300 rounded-none px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-none font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#2e1065] hover:bg-[#3b0764] text-white font-bold rounded-none shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Registering Team...' : 'Create Team of 4'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
