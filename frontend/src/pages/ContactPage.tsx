import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { apiClient } from '../api/client';

interface ContactPageProps {
  setActiveTab: (tab: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ setActiveTab }) => {
  const [pageData, setPageData] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [responseMsg, setResponseMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    apiClient.get('/public/pages/contact')
      .then(res => {
        if (res.data.success && res.data.page) {
          setPageData(res.data.page);
        }
      })
      .catch(err => {
        console.warn('Using fallback contact data:', err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSending(true);
      setResponseMsg(null);
      const res = await apiClient.post('/public/contact', { name, email, subject, message });
      if (res.data.success) {
        setResponseMsg({ type: 'success', text: res.data.message || 'Message sent successfully! We will get back to you shortly.' });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setResponseMsg({ type: 'error', text: res.data.error || 'Failed to send message.' });
      }
    } catch (err: any) {
      setResponseMsg({ type: 'error', text: err.response?.data?.error || 'Error sending message.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Page Header */}
      <section className="bg-gradient-to-b from-white via-purple-50/30 to-slate-50 border-b border-slate-200 py-12 lg:py-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <button onClick={() => setActiveTab('home')} className="hover:text-[#2e1065] transition-colors cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-[#2e1065]">Contact Us</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-purple-50 border border-purple-200 text-[#2e1065] text-xs font-bold shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>CENTRAL HELPDESK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-serif">
            Contact <span className="text-[#2e1065]">Organizing Committee</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl">
            {pageData?.subtitle || 'Our support team is available to assist with team registration, problem statement verification, and portal access.'}
          </p>
        </div>
      </section>

      {/* Main Contact Content */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200 flex-grow">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Contact Details Card */}
            <div className="bg-slate-50 p-8 sm:p-10 rounded-none border border-slate-200 space-y-6 flex flex-col justify-between shadow-2xs">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-serif">
                  <MessageSquare className="w-5 h-5 text-[#2e1065]" />
                  <span>Contact Center Information</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Have questions regarding team composition, eligibility, or problem statements? Reach out to our dedicated support committee.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-none shadow-2xs">
                  <MapPin className="w-5 h-5 text-[#2e1065] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Department of AI &amp; Data Science</div>
                    <div className="text-slate-600 mt-1">Sri Eshwar College of Engineering, COIMBATORE - 641 202</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-none shadow-2xs">
                  <Mail className="w-5 h-5 text-[#2e1065] shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Official Communication</div>
                    <div className="text-slate-600 mt-1">hackathon@sece.ac.in</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-none shadow-2xs">
                  <Phone className="w-5 h-5 text-[#2e1065] shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Helpline Coordinator</div>
                    <div className="text-slate-600 mt-1">+91 94899 99999 / +91 98765 43210</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-none border border-slate-200 space-y-5 shadow-2xs">
              <h3 className="text-xl font-bold text-slate-900 font-serif">Send Us a Direct Message</h3>

              {responseMsg && (
                <div className={`p-4 rounded-none flex items-center gap-3 text-xs font-semibold border ${
                  responseMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                  {responseMsg.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
                  <span>{responseMsg.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arjun Vikram"
                    className="w-full bg-slate-50 border border-slate-300 rounded-none px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email (@sece.ac.in) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arjun@sece.ac.in"
                    className="w-full bg-slate-50 border border-slate-300 rounded-none px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject or Query Title"
                  className="w-full bg-slate-50 border border-slate-300 rounded-none px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your query or request..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-none px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065]"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 px-6 rounded-none bg-[#2e1065] hover:bg-[#3b0764] text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>{isSending ? 'Sending...' : 'Send Message to Organizing Team'}</span>
              </button>
            </form>

          </div>

        </div>
      </section>

    </div>
  );
};
