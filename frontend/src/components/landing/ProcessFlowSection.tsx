import React, { useState, useEffect, useRef } from 'react';
import { Users, FileSearch, Lightbulb, Code2, Flag, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

interface TimelinePhase {
  id: number;
  phaseNumber: string;
  title: string;
  desc: string;
  badge: string;
  icon: React.ElementType;
  dateRange: string;
}

export const ProcessFlowSection: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progressHeight, setProgressHeight] = useState<number>(0);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const phases: TimelinePhase[] = [
    {
      id: 1,
      phaseNumber: '01',
      title: 'Squad Assembly & Team Formation',
      desc: 'Form a squad of 4 students. Register student details, select college ID verification, and nominate squad leaders.',
      badge: 'STAGE 01 • SQUAD ASSEMBLY',
      icon: Users,
      dateRange: 'Jun - Aug 2026'
    },
    {
      id: 2,
      phaseNumber: '02',
      title: 'Problem Statement Selection',
      desc: 'Explore curated AI, hardware, cybersecurity, and software problem bounties published by leading industry leaders.',
      badge: 'STAGE 02 • BOUNTY CLAIM',
      icon: FileSearch,
      dateRange: 'Aug - Sep 2026'
    },
    {
      id: 3,
      phaseNumber: '03',
      title: 'Idea & Architecture Blueprint',
      desc: 'Prepare the technical architecture presentation PPT, solution executive summary, and submit initial design proposals.',
      badge: 'STAGE 03 • BLUEPRINT DRAFT',
      icon: Lightbulb,
      dateRange: 'Sep - Oct 2026'
    },
    {
      id: 4,
      phaseNumber: '04',
      title: 'Prototype & Code Walkthrough',
      desc: 'Develop the working software model or hardware prototype, upload GitHub repository links, and submit video walkthroughs.',
      badge: 'STAGE 04 • JURY GAUNTLET',
      icon: Code2,
      dateRange: 'Oct - Nov 2026'
    },
    {
      id: 5,
      phaseNumber: '05',
      title: 'The Grand Finale Live Gauntlet',
      desc: 'Shortlisted finalist squads participate in the 36-hour continuous hackathon finale live at Sri Eshwar Campus before jury evaluation.',
      badge: 'FINAL BOSS • 36H ARENA',
      icon: Flag,
      dateRange: 'Dec 2026'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress percentage relative to the timeline container
      const totalH = rect.height;
      const relativeTop = windowHeight * 0.45 - rect.top;
      let pct = (relativeTop / totalH) * 100;
      pct = Math.max(0, Math.min(100, pct));
      
      setProgressHeight(pct);

      // Determine active index
      const segmentSize = 100 / phases.length;
      const calculatedIdx = Math.min(phases.length - 1, Math.max(0, Math.floor((pct + segmentSize * 0.3) / segmentSize)));
      setActiveIdx(calculatedIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [phases.length]);

  return (
    <section id="timeline" className="py-20 bg-slate-50 border-t border-slate-200 relative overflow-hidden scroll-mt-20">
      <span id="process" className="absolute -top-20" />
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Style */}
        <ScrollReveal direction="up" distance={20} duration={700} className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-none bg-purple-100/90 border border-purple-300 text-[#2e1065] text-xs font-mono font-black tracking-widest uppercase">
            <span>🎮 LEVEL ROADMAP • 5 BATTLE STAGES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
            Hackathon Quest <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Progression &amp; Stages</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Scroll to level up through the 5 battle stages from squad formation to the 36-hour survival finale.
          </p>
        </ScrollReveal>

        {/* Vertical Timeline Container */}
        <div ref={timelineRef} className="relative py-8">
          
          {/* Background Straight Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 rounded-full"></div>

          {/* Filled Purple Progress Straight Line */}
          <div 
            className="absolute left-6 md:left-1/2 top-0 w-1 bg-gradient-to-b from-[#2e1065] via-purple-600 to-purple-400 -translate-x-1/2 rounded-full transition-all duration-150 ease-out"
            style={{ height: `${progressHeight}%` }}
          ></div>

          {/* Moving Flag Icon Indicator with Custom User Flag */}
          <div 
            className="absolute left-6 md:left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-200 ease-out"
            style={{ top: `${progressHeight}%` }}
          >
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-xl border-2 border-red-200 animate-bounce">
              <img 
                src="/images/timeline_flag.png" 
                alt="Timeline Progress Flag" 
                className="w-7 h-7 object-contain"
              />
            </div>
          </div>

          {/* Timeline Nodes & Cards */}
          <div className="space-y-12 sm:space-y-16 relative z-10">
            {phases.map((phase, idx) => {
              const Icon = phase.icon;
              const isActive = idx <= activeIdx;
              const isCurrent = idx === activeIdx;
              const isEven = idx % 2 === 0;

              return (
                <div 
                  key={phase.id}
                  className={`flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-6 md:gap-0`}
                >
                  
                  {/* Content Card Side */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'} pl-14 md:pl-0`}>
                    <ScrollReveal
                      direction={isEven ? "left" : "right"}
                      distance={28}
                      duration={700}
                    >
                      <div 
                        className={`p-6 rounded-none border transition-all duration-300 shadow-xs relative ${
                          isCurrent
                            ? 'bg-white border-[#2e1065] shadow-md ring-2 ring-purple-600/20 scale-[1.02]'
                            : isActive
                            ? 'bg-white border-slate-300'
                            : 'bg-slate-100/80 border-slate-200 opacity-85'
                        }`}
                      >
                        {/* Header Badge Row */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-none uppercase tracking-wider ${
                            isCurrent
                              ? 'bg-[#2e1065] text-white'
                              : isActive
                              ? 'bg-[#3b0764] text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {phase.badge}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 font-mono">
                            {phase.dateRange}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className={`text-lg sm:text-xl font-black capitalize mb-2 ${
                          isCurrent ? 'text-[#2e1065]' : 'text-slate-900'
                        }`}>
                          {phase.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {phase.desc}
                        </p>

                        {/* Status indicator pill */}
                        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold">
                          {isActive ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{isCurrent ? 'Current Active Phase' : 'Completed Stage'}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">Upcoming Stage</span>
                          )}
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>

                  {/* Center Node Circle */}
                  <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 ${isCurrent ? 'border-[#2e1065]' : 'border-slate-300'} flex items-center justify-center z-20 shadow-xs`}>
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isCurrent
                          ? 'bg-[#2e1065] text-white'
                          : isActive
                          ? 'bg-[#3b0764] text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {phase.icon === Flag ? (
                        <img src="/images/timeline_flag.png" alt="Grand Finale Flag" className="w-4 h-4 object-contain" />
                      ) : (
                        React.createElement(Icon as React.ComponentType<{ className?: string }>, { className: 'w-3.5 h-3.5' })
                      )}
                    </div>
                  </div>

                  {/* Empty side for layout symmetry on desktop */}
                  <div className="hidden md:block w-1/2"></div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
