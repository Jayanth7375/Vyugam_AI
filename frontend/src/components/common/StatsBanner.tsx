import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import type { LiveStats } from '../../types';
import { CountingNumber } from '@/components/ui/counting-number';
import { ScrollReveal } from './ScrollReveal';

export const StatsBanner: React.FC = () => {
  const [stats, setStats] = useState<LiveStats>({
    totalTeams: 0,
    totalSubmissions: 0,
    totalStudents: 0,
    totalProblemStatements: 0,
    prizePool: '0',
    collegesParticipating: '0'
  });

  useEffect(() => {
    apiClient.get('/public/live-stats')
      .then(res => {
        if (res.data.success) {
          setStats(res.data.stats);
        }
      })
      .catch(() => {});
  }, []);

  const items = [
    { 
      label: 'ACTIVE PLAYERS', 
      sub: 'Enrolled Hackers',
      target: Number(stats.totalStudents) || 0,
      image: '/images/stats/participants.jpg' 
    },
    { 
      label: 'REGISTERED SQUADS', 
      sub: '4-Player Guilds',
      target: Number(stats.totalTeams) || 0,
      image: '/images/stats/teams.jpg' 
    },
    { 
      label: 'CAMPUS GUILDS', 
      sub: 'Institutes Joined',
      target: Number(stats.collegesParticipating) || 0,
      image: '/images/stats/colleges.jpg' 
    },
    { 
      label: 'BOUNTY REWARD POOL', 
      sub: 'Grand Finale Prizes (₹)',
      target: Number(stats.prizePool) || 0,
      image: '/images/stats/prize.jpg' 
    },
  ];

  return (
    <div className="py-8 bg-gradient-to-r from-purple-50/60 via-white to-purple-50/60 border-y border-purple-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx * 90}
              distance={24}
              duration={650}
              className="h-full"
            >
              <div 
                className="relative bg-white p-5 rounded-none border-2 border-purple-200/80 hover:border-purple-400 hover:shadow-md transition-all h-full flex flex-col justify-between group shadow-2xs"
              >
                {/* Cyber HUD Corner Accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-500 pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-none overflow-hidden shadow-sm border border-purple-200 bg-white p-0.5 group-hover:scale-105 transition-transform">
                    <img 
                      src={item.image} 
                      alt={item.label} 
                      className="w-full h-full object-cover rounded-none" 
                    />
                  </div>
                  <span className="text-[10px] font-mono font-black text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-none uppercase">
                    STAGE STAT
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-mono">
                    <CountingNumber 
                      target={item.target} 
                      transition={{ duration: 1.8, ease: "easeOut", type: "tween" }} 
                    />
                  </div>
                  <div className="text-xs font-mono font-black text-purple-900 tracking-wider uppercase mt-1">
                    {item.label}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">
                    {item.sub}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};
