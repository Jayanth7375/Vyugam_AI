import React from 'react';
import { ArrowRight, Cpu, ShieldCheck, HeartPulse, Atom, Eye, Coins, Bot, Leaf, Wand2, Network } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

interface SectorItem {
  id: string;
  trackNum: string;
  name: string;
  category: string;
  focus: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTORS_DATA: SectorItem[] = [
  {
    id: 'agentic-ai',
    trackNum: 'TRACK 01',
    name: 'Autonomous Neural Agents',
    category: 'AGENTIC AI',
    focus: 'Multi-agent orchestration, self-correcting workflows & autonomous cognitive execution.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    icon: Bot,
  },
  {
    id: 'quantum-ai',
    trackNum: 'TRACK 02',
    name: 'Quantum Machine Intelligence',
    category: 'QUANTUM COMPUTING',
    focus: 'Variational quantum algorithms, quantum neural networks & sub-atomic acceleration.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    icon: Atom,
  },
  {
    id: 'biomedical-ai',
    trackNum: 'TRACK 03',
    name: 'Bio-Neural Genomics & Health',
    category: 'HEALTHCARE & BIOTECH',
    focus: 'In-silico molecular synthesis, genomic sequence transformers & precision oncology.',
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80',
    icon: HeartPulse,
  },
  {
    id: 'cyber-defense',
    trackNum: 'TRACK 04',
    name: 'Cybernetic Defense & Zero-Trust AI',
    category: 'CYBERSECURITY',
    focus: 'Adversarial neural immunity, autonomous threat hunting & dark-web defense perimeters.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    icon: ShieldCheck,
  },
  {
    id: 'spatial-intelligence',
    trackNum: 'TRACK 05',
    name: 'Spatial Intelligence & Vision',
    category: 'COMPUTER VISION',
    focus: '3D Gaussian splatting, real-time spatial depth, and holographic telepresence systems.',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=600&q=80',
    icon: Eye,
  },
  {
    id: 'fintech-neural',
    trackNum: 'TRACK 06',
    name: 'FinTech Neural Dynamics & Web3',
    category: 'ALGORITHMIC FINANCE',
    focus: 'High-frequency algorithmic forecasting, fraud-immune smart contracts & decentralized risk AI.',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80',
    icon: Coins,
  },
  {
    id: 'autonomous-swarms',
    trackNum: 'TRACK 07',
    name: 'Autonomous Swarms & Edge Robotics',
    category: 'EDGE ROBOTICS',
    focus: 'Decentralized drone swarms, edge neural controllers & cooperative search robotics.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
    icon: Cpu,
  },
  {
    id: 'climate-ai',
    trackNum: 'TRACK 08',
    name: 'Eco-Neural Systems & Clean Energy',
    category: 'CLIMATE INTELLIGENCE',
    focus: 'Smart power grid optimization, agricultural hyperspectral AI & carbon modeling.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    icon: Leaf,
  },
  {
    id: 'generative-synthesis',
    trackNum: 'TRACK 09',
    name: 'Multimodal Generative Synthesis',
    category: 'GENERATIVE AI',
    focus: 'Cross-modal foundation models, real-time neural audio/video engines & world simulation.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
    icon: Wand2,
  },
  {
    id: 'neuro-symbolic',
    trackNum: 'TRACK 10',
    name: 'Neuro-Symbolic Reasoning & Logic',
    category: 'REASONING SYSTEMS',
    focus: 'Deep deductive logic architectures, formal verification & explainable AI governance.',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    icon: Network,
  },
];

interface SectorsSectionProps {
  setActiveTab: (tab: string) => void;
}

export const SectorsSection: React.FC<SectorsSectionProps> = ({ setActiveTab }) => {
  // Duplicate sectors to create an infinite, uninterrupted marquee loop
  const marqueeItems = [...SECTORS_DATA, ...SECTORS_DATA];

  return (
    <section id="sectors" className="py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden select-none scroll-mt-20">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <ScrollReveal direction="up" distance={20} duration={700} className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-none bg-purple-100/90 border border-purple-300 text-[#2e1065] text-xs font-mono font-black tracking-widest uppercase">
            <span>⚔️ 10 COMBAT DOMAINS • CHOOSE YOUR ARENA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
            Innovation Sectors <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">&amp; Challenge Arenas</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl mx-auto">
            Frontier domains curating real-world challenge bounties for VyugamAI 2026. Hover over any sector to pause and inspect.
          </p>
        </ScrollReveal>
      </div>

      {/* Marquee Track with Smooth Left and Right Vignette Fade */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Left Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />

        {/* Right Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />

        {/* Continuous Right-to-Left Scrolling Track */}
        <div className="animate-scroll-right-to-left flex gap-6 px-4">
          {marqueeItems.map((sector, index) => {
            const Icon = sector.icon;
            return (
              <div
                key={`${sector.id}-${index}`}
                onClick={() => setActiveTab('problems')}
                className="w-72 sm:w-80 shrink-0 bg-white border border-slate-200 hover:border-[#2e1065] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                {/* Sector Visual Header */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={sector.image}
                    alt={sector.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                  {/* Track Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-bold tracking-wider uppercase">
                    <Icon className="w-3 h-3 text-purple-300" />
                    <span>{sector.trackNum}</span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#2e1065]/90 text-purple-200 border border-purple-400/30 text-[9px] font-mono font-bold tracking-wider uppercase">
                    {sector.category}
                  </div>
                </div>

                {/* Sector Card Body */}
                <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#2e1065] transition-colors leading-tight">
                      {sector.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                      {sector.focus}
                    </p>
                  </div>

                  {/* Explore Link */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-[#2e1065] group-hover:text-[#3b0764]">
                    <span>EXPLORE TRACK</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default SectorsSection;
