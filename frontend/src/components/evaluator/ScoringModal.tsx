import React, { useState } from 'react';
import { X, FileText, Video, Code2 } from 'lucide-react';
import { apiClient } from '../../api/client';
import type { Submission } from '../../types';

interface ScoringModalProps {
  submission: Submission | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ScoringModal: React.FC<ScoringModalProps> = ({ submission, onClose, onSuccess }) => {
  const [innovation, setInnovation] = useState<number>(16);
  const [technical, setTechnical] = useState<number>(17);
  const [feasibility, setFeasibility] = useState<number>(15);
  const [uiUx, setUiUx] = useState<number>(16);
  const [presentation, setPresentation] = useState<number>(18);
  const [comments, setComments] = useState<string>('Solid technical execution and clear implementation workflow.');
  const [decision, setDecision] = useState<'Shortlist' | 'Reject' | 'Under Review'>('Shortlist');

  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!submission) return null;

  const totalScore = Number(innovation) + Number(technical) + Number(feasibility) + Number(uiUx) + Number(presentation);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setMsg(null);
      const res = await apiClient.post('/evaluator/score', {
        submission_id: submission.id,
        innovation_score: innovation,
        technical_score: technical,
        feasibility_score: feasibility,
        ui_ux_score: uiUx,
        presentation_score: presentation,
        comments,
        decision
      });

      if (res.data.success) {
        onSuccess();
        onClose();
      } else {
        setMsg(res.data.error || 'Failed to submit score.');
      }
    } catch (err: any) {
      setMsg(err.response?.data?.error || 'Error submitting score.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-50 text-[#1755a7] font-mono font-bold px-2.5 py-0.5 rounded text-xs border border-blue-200">
                JURY SCORING SHEET
              </span>
              <span className="text-xs text-slate-500">Team Submission Evaluation</span>
            </div>
            <h3 className="text-xl font-bold text-[#0a2540] leading-snug">{submission.idea_title}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmitScore} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {msg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {msg}
            </div>
          )}

          {/* Submission Details Summary Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <span>Problem Statement: <strong className="text-[#1755a7] font-mono">{submission.problem_statement_id}</strong></span>
              <span>Category: <strong className="text-slate-800">{submission.ps_category || 'AI'}</strong></span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">{submission.executive_summary}</p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {submission.ppt_url && (
                <a href={submission.ppt_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#1755a7] font-bold hover:underline">
                  <FileText className="w-3.5 h-3.5" />
                  <span>PPT PDF</span>
                </a>
              )}
              {submission.github_url && (
                <a href={submission.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 font-bold hover:underline">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>GitHub Repo</span>
                </a>
              )}
              {submission.demo_video_url && (
                <a href={submission.demo_video_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sky-600 font-bold hover:underline">
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Vyugam AI 5 Criterion Sliders */}
          <div className="space-y-4 bg-blue-50/30 p-5 rounded-2xl border border-blue-100">
            <h4 className="text-sm font-bold text-[#0a2540] uppercase tracking-wider flex items-center justify-between">
              <span>Vyugam AI Evaluation Rubric (100 Points Max)</span>
              <span className="text-xl font-black font-mono text-[#1755a7] bg-white border border-blue-200 px-3 py-1 rounded-xl shadow-xs">
                {totalScore} / 100
              </span>
            </h4>

            {[
              { label: 'Innovation & Novelty', val: innovation, setter: setInnovation, desc: 'Uniqueness of approach and creative problem solving' },
              { label: 'Technical Feasibility & Architecture', val: technical, setter: setTechnical, desc: 'Robustness of tech stack, schema, and ML algorithms' },
              { label: 'Practical Impact & Scalability', val: feasibility, setter: setFeasibility, desc: 'Real world college / industry deployment potential' },
              { label: 'UI/UX & User Experience', val: uiUx, setter: setUiUx, desc: 'Ease of use, responsiveness, and design clarity' },
              { label: 'Presentation & Defense Quality', val: presentation, setter: setPresentation, desc: 'Clarity of pitch video, repository docs, and slides' },
            ].map((criterion, idx) => (
              <div key={idx} className="space-y-1.5 pt-2 border-t border-slate-200 first:border-0 first:pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{criterion.label}</span>
                    <p className="text-[10px] text-slate-500">{criterion.desc}</p>
                  </div>
                  <span className="font-mono font-bold text-[#1755a7] text-sm">{criterion.val} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={criterion.val}
                  onChange={(e) => criterion.setter(Number(e.target.value))}
                  className="w-full accent-[#1755a7] cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Evaluator Comments */}
          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
              Jury Evaluator Feedback & Remarks
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide constructive feedback for the team..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#1755a7] focus:ring-1 focus:ring-[#1755a7]"
            />
          </div>

          {/* Decision Selector */}
          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider mb-2">
              Final Jury Recommendation
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Shortlist', 'Under Review', 'Reject'] as const).map((dec) => (
                <button
                  key={dec}
                  type="button"
                  onClick={() => setDecision(dec)}
                  className={`py-2.5 px-3 rounded-xl font-bold border transition-all text-center ${
                    decision === dec
                      ? dec === 'Shortlist'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                        : dec === 'Reject'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm'
                        : 'bg-blue-50 border-[#1755a7] text-[#1755a7] shadow-sm'
                      : 'bg-slate-50 border-slate-300 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {dec}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-[#1755a7] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving Score...' : 'Submit Evaluation Score'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
