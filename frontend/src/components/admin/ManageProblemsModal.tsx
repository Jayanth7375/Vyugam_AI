import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { apiClient } from '../../api/client';

interface ManageProblemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ManageProblemsModal: React.FC<ManageProblemsModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [psId, setPsId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI & Machine Learning');
  const [domainBucket, setDomainBucket] = useState<'Software' | 'Hardware' | 'Both'>('Software');
  const [organization, setOrganization] = useState('');
  const [description, setDescription] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [complexity, setComplexity] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [datasetUrl, setDatasetUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setMsg(null);
      const res = await apiClient.post('/problems', {
        id: psId || `VYUGAM-${Math.floor(100 + Math.random() * 900)}`,
        title,
        category,
        domain_bucket: domainBucket,
        organization,
        description,
        desired_outcome: desiredOutcome,
        complexity,
        dataset_url: datasetUrl
      });

      if (res.data.success) {
        onSuccess();
        onClose();
      } else {
        setMsg(res.data.error || 'Failed to add problem statement.');
      }
    } catch (err: any) {
      setMsg(err.response?.data?.error || 'Error creating problem statement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="text-lg font-bold text-[#0a2540] flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#1755a7]" />
            <span>Publish New Problem Statement</span>
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600">
          {msg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl">
              {msg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700">PS Code (e.g. VYUGAM-009)</label>
              <input
                type="text"
                required
                value={psId}
                onChange={(e) => setPsId(e.target.value)}
                placeholder="VYUGAM-009"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1755a7] focus:ring-1 focus:ring-[#1755a7]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Domain Bucket</label>
              <select
                value={domainBucket}
                onChange={(e) => setDomainBucket(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#1755a7] focus:ring-1 focus:ring-[#1755a7]"
              >
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Both">Software & Hardware</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Automated Code Repair LLM Agent"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1755a7] focus:ring-1 focus:ring-[#1755a7]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Category *</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="AI & Machine Learning"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1755a7] focus:ring-1 focus:ring-[#1755a7]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Ministry / Organization *</label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Department of AI"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1755a7] focus:ring-1 focus:ring-[#1755a7]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1755a7] focus:ring-1 focus:ring-[#1755a7]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Desired Outcome *</label>
            <textarea
              required
              rows={2}
              value={desiredOutcome}
              onChange={(e) => setDesiredOutcome(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1755a7] focus:ring-1 focus:ring-[#1755a7]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Complexity</label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#1755a7] focus:ring-1 focus:ring-[#1755a7]"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Dataset / Code Repo URL</label>
              <input
                type="url"
                value={datasetUrl}
                onChange={(e) => setDatasetUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1755a7] focus:ring-1 focus:ring-[#1755a7]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#1755a7] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish PS'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
