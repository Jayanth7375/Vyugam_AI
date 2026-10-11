import React from 'react';
import { ChevronUp } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

export const AboutSection: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="about" className="py-16 sm:py-20 bg-white/70 backdrop-blur-[2px] border-y border-slate-200/80 relative scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Style */}
        <ScrollReveal direction="up" distance={20} duration={700} className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0a2540] tracking-tight font-serif">
            What is <span className="text-[#1755a7]">VyugamAI</span>?
          </h2>

          <p className="text-xs sm:text-sm text-[#1755a7] font-bold tracking-wide">
            Ideas &times; Intelligence &times; Impact
          </p>
        </ScrollReveal>

        {/* Narrative & Story Section */}
        <ScrollReveal direction="up" distance={24} delay={100} duration={750} className="space-y-6 text-slate-800 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
          <p className="font-serif text-base sm:text-lg text-slate-900 leading-relaxed font-normal">
            VyugamAI is a premier nationwide initiative designed to engage students in solving some of the most pressing challenges faced in everyday life. Launched to foster a culture of innovation and practical problem-solving, VyugamAI provides a dynamic platform for students to develop and showcase their creative solutions to real-world problems. By encouraging participants to think critically and innovatively, the hackathon aims to bridge the gap between academic knowledge and practical application.
          </p>

          <p className="text-slate-600 leading-relaxed">
            Since its inception, VyugamAI has garnered significant success in promoting out-of-the-box thinking among young minds, particularly engineering students from across India. Each edition has built on the previous one, refining its approach and expanding its impact. The hackathon not only offers students an opportunity to showcase their skills but also encourages collaboration with industry experts, government agencies, and other stakeholders.
          </p>
        </ScrollReveal>

      </div>

      {/* Floating Scroll to Top Button */}
      <div className="absolute bottom-6 right-6">
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-none bg-[#1755a7] hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
          title="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>

    </section>
  );
};

export default AboutSection;
