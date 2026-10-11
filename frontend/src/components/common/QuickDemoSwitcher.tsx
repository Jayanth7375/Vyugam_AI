import React from 'react';
import { Shield, UserCheck, GraduationCap, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

export const QuickDemoSwitcher: React.FC = () => {
  const { user, switchDemoRole } = useAuth();

  const roles: { role: UserRole; label: string; icon: any }[] = [
    { role: 'student', label: 'Team Leader', icon: GraduationCap },
    { role: 'evaluator', label: 'Jury / Evaluator', icon: UserCheck },
    { role: 'admin', label: 'College Admin', icon: Shield },
  ];

  return (
    <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-2.5 flex flex-wrap items-center gap-2 text-xs shadow-sm">
      <div className="flex items-center gap-1.5 px-2 text-slate-600 font-semibold border-r border-slate-200 pr-3">
        <Sparkles className="w-3.5 h-3.5 text-[#1755a7]" />
        <span>Quick Demo Switcher:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = user?.role === r.role;
          return (
            <button
              key={r.role}
              onClick={() => switchDemoRole(r.role)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                isActive
                  ? 'bg-blue-50 border-[#1755a7] text-[#1755a7] font-semibold shadow-sm ring-1 ring-[#1755a7]/20'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{r.label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#1755a7]"></span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
