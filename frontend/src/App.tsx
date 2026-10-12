import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { AnnouncementTicker } from './components/common/AnnouncementTicker';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { AboutSection } from './components/landing/AboutSection';
import { ProcessFlowSection } from './components/landing/ProcessFlowSection';
import { SectorsSection } from './components/landing/SectorsSection';
import { StatsBanner } from './components/common/StatsBanner';
import { FAQSection } from './components/landing/FAQSection';
import { ContactSection } from './components/landing/ContactSection';
import { ProblemList } from './components/problems/ProblemList';
import { StudentDashboard } from './components/student/StudentDashboard';
import { EvaluatorDashboard } from './components/evaluator/EvaluatorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/common/AuthModal';
import CursorMultifollow from './components/ui/motion-cursor-multifollow';
import { ScrollReveal } from './components/common/ScrollReveal';
import { LoginPage } from './components/ui/sign-in-page';
import { ChatBotWidget } from './components/common/ChatBotWidget';
import { useAuth } from './context/AuthContext';
import { PencilLoader } from './components/ui/loader-1';
import { BookOpen, Layers, HelpCircle, Info, ArrowRight } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });

  // List of sections in bottom-to-top order for scroll spy
  const SECTIONS = [
    { id: 'team-portal', tab: 'student-portal' },
    { id: 'contact', tab: 'contact' },
    { id: 'faq', tab: 'faq' },
    { id: 'timeline', tab: 'process' },
    { id: 'problems', tab: 'problems' },
    { id: 'about', tab: 'about' },
    { id: 'home', tab: 'home' },
  ];

  // Helper to scroll smoothly to a section
  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Synchronize state with browser URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = [
        'home', 'about', 'problems', 'process', 'timeline', 'faq', 'contact',
        'student-portal', 'team-portal', 'evaluator-portal', 'admin-portal',
        'login-page', 'login', 'signup-page', 'signup', 'register'
      ];
      if (validTabs.includes(hash)) {
        const normalizedTab =
          hash === 'login' ? 'login-page' :
          (hash === 'signup' || hash === 'register') ? 'signup-page' :
          hash === 'timeline' ? 'process' :
          hash === 'team-portal' ? 'student-portal' :
          hash;

        setActiveTab(normalizedTab);

        if (!['evaluator-portal', 'admin-portal', 'login-page', 'signup-page'].includes(normalizedTab)) {
          const targetId =
            hash === 'process' || hash === 'timeline' ? 'timeline' :
            hash === 'student-portal' || hash === 'team-portal' ? 'team-portal' :
            hash;
          scrollToSection(targetId);
        }
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync activeTab with scroll position across all sections in the Single Page Application
  useEffect(() => {
    if (['evaluator-portal', 'admin-portal', 'login-page', 'signup-page'].includes(activeTab)) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 280;

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && scrollPos >= el.offsetTop) {
          if (activeTab !== section.tab) {
            setActiveTab(section.tab);
          }
          return;
        }
      }

      if (window.scrollY < 200 && activeTab !== 'home') {
        setActiveTab('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    if (tab === 'login') {
      setActiveTab('login-page');
      window.location.hash = '#login';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (tab === 'signup' || tab === 'register') {
      setActiveTab('signup-page');
      window.location.hash = '#signup';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (tab === 'evaluator-portal' || tab === 'admin-portal') {
      setActiveTab(tab);
      window.location.hash = '#' + tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Single-page smooth scroll mapping
    const sectionMap: Record<string, string> = {
      home: 'home',
      about: 'about',
      problems: 'problems',
      process: 'timeline',
      timeline: 'timeline',
      faq: 'faq',
      contact: 'contact',
      'student-portal': 'team-portal',
      'team-portal': 'team-portal',
    };

    const targetId = sectionMap[tab] || tab;
    const normalizedTab = tab === 'timeline' ? 'process' : tab === 'team-portal' ? 'student-portal' : tab;
    setActiveTab(normalizedTab);
    window.location.hash = '#' + (targetId === 'team-portal' ? 'team-portal' : targetId === 'timeline' ? 'timeline' : targetId);

    scrollToSection(targetId);
  };

  const handleOpenAuthModal = (mode: 'login' | 'register') => {
    if (mode === 'login') {
      handleTabChange('login');
    } else {
      handleTabChange('signup');
    }
  };

  const handleCloseAuthModal = () => {
    setAuthModalState(prev => ({ ...prev, isOpen: false }));
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-screen bg-[#fbf9fe] flex flex-col items-center justify-center p-6 select-none">
        <PencilLoader size={180} text="Entering Vyugam Arena..." />
      </div>
    );
  }

  if (activeTab === 'login-page' || activeTab === 'signup-page') {
    return (
      <LoginPage
        initialMode={activeTab === 'signup-page' ? 'signup' : 'login'}
        onNavigateHome={() => handleTabChange('home')}
        onNavigateSignup={() => handleTabChange('signup')}
        onNavigateLogin={() => handleTabChange('login')}
      />
    );
  }

  const renderTabContent = () => {
    if (activeTab === 'evaluator-portal') {
      return <EvaluatorDashboard />;
    }
    if (activeTab === 'admin-portal') {
      return <AdminDashboard />;
    }

    // Single Page Application: Home -> About -> Problem Statements -> Timeline -> FAQ -> Contact -> Team Portal
    return (
      <>
        {/* 1. HOME SECTION */}
        <HeroSection
          setActiveTab={handleTabChange}
          onOpenAuthModal={handleOpenAuthModal}
        />

        {/* 2. ABOUT SECTION */}
        <AboutSection />
        <StatsBanner />
        <SectorsSection setActiveTab={handleTabChange} />

        {/* Quick Explore Dedicated Sections Directory */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
            <ScrollReveal direction="up" distance={20} duration={700} className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
                Explore <span className="text-[#2e1065]">VyugamAI 2026</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Browse dedicated event sections, guidelines, problem statements, and official squad portal.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 'about',
                  title: 'About VyugamAI',
                  desc: 'Department of AI & DS mission, vision, and core pillars of innovation.',
                  icon: Info,
                  btn: 'Explore Section'
                },
                {
                  id: 'problems',
                  title: 'Problem Statements',
                  desc: 'Multidisciplinary challenges spanning AI, Healthcare, Defense, and IoT.',
                  icon: BookOpen,
                  btn: 'Browse Challenges'
                },
                {
                  id: 'process',
                  title: 'Timeline & Process',
                  desc: 'Interactive 5-phase progression from registrations to the grand finale.',
                  icon: Layers,
                  btn: 'View Timeline'
                },
                {
                  id: 'faq',
                  title: 'Helpdesk & FAQs',
                  desc: 'Answers to eligibility rules, team formation, templates, and travel queries.',
                  icon: HelpCircle,
                  btn: 'Read FAQs'
                }
              ].map((card, idx) => (
                <ScrollReveal
                  key={card.id}
                  delay={idx * 80}
                  distance={24}
                  duration={650}
                  className="h-full"
                >
                  <div
                    onClick={() => handleTabChange(card.id)}
                    className="p-6 rounded-none bg-slate-50 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer h-full"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-none bg-white border border-slate-200 text-[#2e1065] flex items-center justify-center group-hover:bg-[#2e1065] group-hover:text-white transition-all shadow-xs">
                        <card.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2e1065] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-[#2e1065] pt-2 border-t border-slate-200">
                      <span>{card.btn}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 3. PROBLEM STATEMENTS SECTION */}
        <section id="problems" className="py-16 bg-white border-t border-slate-200 scroll-mt-20">
          <ProblemList />
        </section>

        {/* 4. TIMELINE SECTION */}
        <ProcessFlowSection />

        {/* 5. FAQS SECTION */}
        <FAQSection setActiveTab={handleTabChange} />

        {/* 6. CONTACT US SECTION */}
        <ContactSection />

        {/* 7. TEAM PORTAL SECTION */}
        <section id="team-portal" className="py-20 bg-slate-50 border-t border-slate-200 scroll-mt-20 relative">
          <span id="student-portal" className="absolute -top-20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-none bg-purple-100/90 border border-purple-300 text-[#2e1065] text-xs font-mono font-black tracking-widest uppercase">
                <span>🚀 SQUAD & INNOVATION HUB</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
                Team <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Portal</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl mx-auto">
                Manage your hackathon squad, team roster, submission repositories, and real-time evaluation status.
              </p>
            </div>
            <StudentDashboard />
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-[#2e1065] selection:text-white">
      <CursorMultifollow global />

      <AnnouncementTicker />

      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenAuthModal={handleOpenAuthModal}
      />

      <main className="flex-grow">
        {renderTabContent()}
      </main>

      <Footer setActiveTab={handleTabChange} />

      <AuthModal
        isOpen={authModalState.isOpen}
        mode={authModalState.mode}
        onClose={handleCloseAuthModal}
        onSwitchMode={(mode) => {
          if (mode === 'login') {
            handleCloseAuthModal();
            handleTabChange('login-page');
          } else {
            setAuthModalState({ isOpen: true, mode: 'register' });
          }
        }}
      />

      {/* Floating Interactive VyugamAI Assistant Chatbot */}
      <ChatBotWidget
        setActiveTab={handleTabChange}
        onOpenAuthModal={handleOpenAuthModal}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
