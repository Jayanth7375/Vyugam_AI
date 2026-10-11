import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { apiClient } from '../../api/client';
import type { Announcement } from '../../types';

export const AnnouncementTicker: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    apiClient.get('/public/announcements')
      .then(res => {
        if (res.data.success) {
          setAnnouncements(res.data.announcements);
        }
      })
      .catch(() => {});
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div className="bg-[#0a2540] text-white py-1.5 px-4 text-xs md:text-sm overflow-hidden flex items-center border-b border-slate-800 shadow-sm select-none">
      <div className="flex items-center gap-1.5 bg-[#1755a7] text-white font-bold px-3 py-0.5 rounded-none text-[11px] shrink-0 tracking-wide uppercase">
        <Flame className="w-3.5 h-3.5 animate-pulse" />
        <span>ANNOUNCEMENTS</span>
      </div>
      
      <div 
        className="overflow-hidden relative w-full ml-4 flex group cursor-default" 
        title="Hover cursor to pause announcement scrolling"
      >
        {/* Track 1 */}
        <div className="flex whitespace-nowrap items-center gap-12 pr-12 shrink-0 animate-marquee group-hover:[animation-play-state:paused] text-slate-200 text-xs">
          {announcements.map((ann) => (
            <span key={ann.id} className="inline-flex items-center gap-2 font-medium">
              <span className="text-sky-300 font-bold">[{ann.category}]:</span>
              <span className="text-white">{ann.title}</span>
              <span className="text-slate-300 font-normal">| {ann.message}</span>
            </span>
          ))}
        </div>

        {/* Track 2 (Duplicate for 100% seamless infinite loop) */}
        <div className="flex whitespace-nowrap items-center gap-12 pr-12 shrink-0 animate-marquee group-hover:[animation-play-state:paused] text-slate-200 text-xs" aria-hidden="true">
          {announcements.map((ann) => (
            <span key={`dup-${ann.id}`} className="inline-flex items-center gap-2 font-medium">
              <span className="text-sky-300 font-bold">[{ann.category}]:</span>
              <span className="text-white">{ann.title}</span>
              <span className="text-slate-300 font-normal">| {ann.message}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
