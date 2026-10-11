import React from 'react';
import { Clock } from 'lucide-react';
import { VaporCountdown } from '../ui/countdown-vapor-digits';

export const CountdownTimer: React.FC = () => {
  // Target deadline: October 25, 2026 23:59:59 IST
  const targetTime = new Date('2026-10-25T23:59:59').getTime();

  return (
    <div className="bg-white p-4 sm:p-5 md:px-7 md:py-6 rounded-none border border-slate-300 shadow-sm relative">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
        
        {/* Left: Clock Icon + Stage & Deadline Details */}
        <div className="flex items-center gap-3.5 text-left w-full lg:w-auto">
          <div className="w-12 h-12 rounded-none bg-[#f0f7ff] border border-blue-200/80 flex items-center justify-center text-[#1755a7] shrink-0 shadow-xs">
            <Clock className="w-6 h-6 stroke-[2] animate-pulse" />
          </div>
          <div>
            <h4 className="font-serif font-black text-xs sm:text-sm md:text-[15px] text-[#0a2540] uppercase tracking-wider leading-snug">
              Registration &amp; Proposal Deadline
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Grand Finale Selection Stage
            </p>
          </div>
        </div>

        {/* Right: Vapor Countdown with sublimating curl-noise particles */}
        <div className="flex items-center justify-center shrink-0 text-[#0a2540]">
          <VaporCountdown
            targetDate={targetTime}
            labels={["DAYS", "HOURS", "MINUTES", "SECONDS"]}
            color="#0a2540"
            className="text-[#0a2540]"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              columnGap: "1.1em",
              rowGap: "0.35rem",
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default CountdownTimer;
