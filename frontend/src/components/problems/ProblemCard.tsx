import React from 'react';
import { Building, Layers, ArrowRight } from 'lucide-react';
import type { ProblemStatement } from '../../types';

interface ProblemCardProps {
  problem: ProblemStatement;
  onSelect: (problem: ProblemStatement) => void;
  isSelected?: boolean;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onSelect, isSelected }) => {
  const getComplexityBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getDomainBadge = (domain: string) => {
    switch (domain) {
      case 'Software':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Hardware':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className={`vyugam-card rounded-none p-6 flex flex-col justify-between transition-all duration-300 relative group ${
      isSelected ? 'ring-2 ring-[#1755a7] border-[#1755a7]' : ''
    }`}>
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#0a2540] text-white font-mono font-bold px-3 py-1 rounded-none text-xs tracking-wider">
              {problem.id}
            </span>
            <span className={`px-2.5 py-0.5 rounded-none text-xs font-bold border ${getDomainBadge(problem.domain_bucket)}`}>
              {problem.domain_bucket}
            </span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-none text-xs font-bold border ${getComplexityBadge(problem.complexity)}`}>
            {problem.complexity} Level
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#0a2540] group-hover:text-[#1755a7] transition-colors leading-snug mb-3">
          {problem.title}
        </h3>

        {/* Organization */}
        <div className="flex items-center gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-none border border-slate-200">
          <Building className="w-4 h-4 text-[#1755a7] shrink-0" />
          <span className="truncate font-semibold">{problem.organization}</span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {problem.description}
        </p>

        {/* Category pill */}
        <div className="flex items-center gap-2 text-xs mb-6">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-800 font-semibold">{problem.category}</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <div className="text-[11px] text-slate-500 font-medium">
          Submissions: <span className="font-bold text-[#0a2540]">{problem.submissions_count} Teams</span>
        </div>

        <button
          onClick={() => onSelect(problem)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-none bg-[#0a2540] hover:bg-[#1755a7] text-white transition-all shadow-xs group/btn"
        >
          <span>Explore PS</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
