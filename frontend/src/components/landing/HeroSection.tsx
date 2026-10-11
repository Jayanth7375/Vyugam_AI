import React from 'react';
import { ArrowRight, ArrowDown, Play } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';
import { VyugamTitleEffect } from '../ui/VyugamTitleEffect';

interface HeroSectionProps {
  setActiveTab: (tab: string) => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
  onWatchIntro?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab, onWatchIntro }) => {
  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center bg-transparent overflow-hidden border-b border-slate-200/80 pt-8 pb-16">
      
      {/* Subtle Atmospheric Vignette Lighting */}
      <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-[450px] h-[450px] bg-slate-100/70 rounded-full blur-3xl pointer-events-none" />

      {/* Main 2-Column Split Hero Stage */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: Editorial Typography & Actions */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-7">
          

          {/* Gamified Live Quest Indicator */}
          <ScrollReveal direction="up" distance={15} delay={50} duration={650}>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white/90 border-2 border-purple-300 rounded-none shadow-[0_0_15px_rgba(168,85,247,0.2)] select-none">
              <span className="w-2.5 h-2.5 bg-fuchsia-500 rounded-full animate-ping" />
              <span className="text-[11px] font-mono font-black tracking-widest text-[#2e1065] uppercase flex items-center gap-1.5">
                <span>🎮 QUEST SEASON 2026</span>
                <span className="text-slate-300">•</span>
                <span className="text-fuchsia-600">LEVEL: NATIONAL ARENA</span>
              </span>
            </div>
          </ScrollReveal>

          {/* Headline in High-Contrast Luxury Serif from Image 2 */}
          <ScrollReveal direction="up" distance={20} delay={100} duration={750}>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl xl:text-[62px] font-extrabold text-[#2e1065] leading-[1.12] tracking-tight">
              SRI ESHWAR COLLEGE <br />
              <span className="text-xl sm:text-3xl lg:text-3xl xl:text-[38px] font-serif font-bold text-slate-800 block my-1 sm:my-2 uppercase tracking-normal">
                DEPARTMENT OF AI DS PROUDLY PRESENTS
              </span>
              <span className="italic font-normal font-serif uppercase tracking-tight block text-4xl sm:text-6xl lg:text-6xl xl:text-[76px] mt-1 sm:mt-2">
                <VyugamTitleEffect />
              </span>
            </h1>
          </ScrollReveal>


          {/* Action Buttons */}
          <ScrollReveal direction="up" distance={20} delay={240} duration={750}>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => setActiveTab('student-portal')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-purple-700 via-purple-900 to-[#1e0a3c] hover:from-purple-800 hover:to-indigo-900 text-white text-xs sm:text-sm font-mono font-black tracking-wider uppercase transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(147,51,234,0.35)] cursor-pointer rounded-none relative group"
              >
                <span>CREATE SQUAD</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('problems')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-purple-50/60 text-slate-800 text-xs sm:text-sm font-mono font-black tracking-wider uppercase border-2 border-purple-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs rounded-none"
              >
                <span>VIEW PROBLEM STATEMENTS</span>
                <ArrowDown className="w-4 h-4 text-purple-600" />
              </button>

              {onWatchIntro && (
                <button
                  onClick={onWatchIntro}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-purple-50 hover:bg-purple-100 text-[#2e1065] text-xs sm:text-sm font-mono font-black tracking-wider uppercase border border-purple-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs rounded-none"
                >
                  <Play className="w-3.5 h-3.5 fill-[#2e1065]" />
                  <span>WATCH INTRO</span>
                </button>
              )}
            </div>
          </ScrollReveal>

          {/* Gamified Quick HUD Strip */}
          <ScrollReveal direction="up" distance={15} delay={300} duration={750}>
            <div className="grid grid-cols-3 gap-3 pt-3 max-w-lg">
              <div className="p-2.5 bg-white border border-purple-200/90 rounded-none shadow-2xs relative">
                <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">BOUNTY POOL</div>
                <div className="text-sm font-black text-purple-900 font-mono">₹5,00,000+</div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
              </div>
              <div className="p-2.5 bg-white border border-purple-200/90 rounded-none shadow-2xs relative">
                <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">SQUAD SIZE</div>
                <div className="text-sm font-black text-purple-900 font-mono">4 PLAYERS</div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-fuchsia-500" />
              </div>
              <div className="p-2.5 bg-white border border-purple-200/90 rounded-none shadow-2xs relative">
                <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">GAUNTLET</div>
                <div className="text-sm font-black text-purple-900 font-mono">36H SURVIVAL</div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
              </div>
            </div>
          </ScrollReveal>



        </div>

        {/* RIGHT COLUMN: 3D Perspective Laptop Mockup */}
        <div className="lg:col-span-5 xl:col-span-5 flex justify-center items-center">
          <ScrollReveal direction="left" distance={28} duration={850} className="w-full">
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl py-6 select-none [perspective:1400px]">
              
              {/* Soft Ambient Radial Halo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200/35 rounded-full blur-3xl pointer-events-none" />

              {/* 3D Tilted MacBook / Laptop Chassis */}
              <div 
                className="relative transition-transform duration-700 ease-out hover:[transform:rotateY(-16deg)_rotateX(8deg)_rotateZ(1deg)]"
                style={{
                  transform: 'rotateY(-24deg) rotateX(12deg) rotateZ(2deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Screen Bezel Frame */}
                <div className="relative bg-slate-900 rounded-t-xl p-2.5 sm:p-3 shadow-2xl border-4 border-slate-300">
                  
                  {/* Webcam Dot */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-700 rounded-full" />
                  
                  {/* Screen Display Content (Brew Moment / VyugamAI Showcase) */}
                  <div className="relative bg-[#0d0914] rounded-lg overflow-hidden aspect-[16/10] flex flex-col justify-between p-3 sm:p-4 text-white border border-slate-800">
                    
                    {/* Top Mini Browser Chrome Header */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>
                      <div className="font-mono text-[9px] tracking-wider text-slate-400">vyugamai.sece.ac.in</div>
                      <div className="px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 text-[8px] font-bold">LIVE</div>
                    </div>

                    {/* Featured Visual: Official Vyugam Logo */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center my-1 relative overflow-hidden py-1 w-full">
                      {/* Ambient Golden/Purple Radial Glow */}
                      <div className="absolute inset-0 bg-radial from-purple-600/35 via-amber-600/20 to-transparent blur-2xl pointer-events-none" />

                      <img
                        src="/images/vyugam_official_logo.png?v=5"
                        alt="Vyugam AI Official Logo"
                        className="w-48 sm:w-56 md:w-64 lg:w-72 h-44 sm:h-52 md:h-60 lg:h-64 object-contain relative z-10 drop-shadow-[0_16px_32px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Bottom Screen Status Bar */}
                    <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono relative z-10">
                      <span>₹50,000+ PRIZE POOL</span>
                      <span className="text-purple-400">8 AI CHALLENGES</span>
                    </div>

                  </div>
                </div>

                {/* Laptop Keyboard Base & Hinge */}
                <div 
                  className="relative h-4 sm:h-5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-b-xl shadow-xl border-t border-slate-300"
                  style={{
                    transform: 'rotateX(55deg)',
                    transformOrigin: 'top center',
                  }}
                >
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-400/80 rounded-full" />
                </div>

                {/* Realistic Perspective Drop Shadow */}
                <div className="absolute -bottom-8 left-4 right-4 h-10 bg-slate-900/25 blur-2xl rounded-full pointer-events-none" />

              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>

    </section>
  );
};

export default HeroSection;
