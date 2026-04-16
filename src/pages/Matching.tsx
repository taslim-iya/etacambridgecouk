import { Users, Briefcase, ArrowRight, CheckCircle, ChevronDown, ChevronUp, Handshake, GraduationCap, Shield, HelpCircle, Building2, UserPlus, X, Send } from 'lucide-react';
import { useState } from 'react';

interface MatchingProps { onNavigate: (page: string) => void; }

const AUDIENCES = ['Students', 'Alumni', 'Searchers', 'Aspiring Searchers', 'Operators', 'Investors', 'Advisors', 'Independent Sponsors', 'ETA Ecosystem Professionals'];

const FAQS = [
  { q: 'Who can apply?', a: 'Cambridge ETA Matching is open to members of the broader ETA community, including students, alumni, searchers, operators, investors, advisors, and ETA-adjacent professionals.' },
  { q: 'Is this only for Cambridge students and alumni?', a: 'No. Cambridge ETA Club hosts the program, but it is intended to serve the wider ETA community.' },
  { q: 'What kinds of opportunities are included?', a: 'Partner matching, search collaborations, project-based collaboration, internships, and selected ETA-related talent opportunities.' },
  { q: 'Do you guarantee a match?', a: 'No. All applications are reviewed, but submissions do not guarantee a match or placement.' },
  { q: 'Can firms recruit through the community?', a: 'Yes. Searchers, investors, operators, and ETA-related firms can submit talent needs or internship opportunities.' },
  { q: 'Is there a cost to apply?', a: 'Currently, there is no cost to apply.' },
];

type ModalType = 'partner' | 'internship' | 'general' | 'opportunity' | null;

const ROLE_OPTIONS = ['Student', 'Alumni', 'Searcher', 'Aspiring Searcher', 'Operator', 'Investor', 'Advisor', 'Independent Sponsor', 'ETA Ecosystem Professional', 'Other'];

function ApplicationModal({ type, onClose }: { type: ModalType; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: '', linkedin: '', background: '', lookingFor: '', message: '' });

  const titles: Record<string, string> = {
    partner: 'Apply for Partner Matching',
    internship: 'Apply for Internship Matching',
    general: 'Apply for Matching',
    opportunity: 'Submit an Opportunity',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store locally for now — ready for Typeform/Tally/Supabase integration
    const submissions = JSON.parse(localStorage.getItem('eta-matching-submissions') || '[]');
    submissions.push({ ...form, type, submittedAt: new Date().toISOString() });
    localStorage.setItem('eta-matching-submissions', JSON.stringify(submissions));
    setSubmitted(true);
  };

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#e6e0d0]">
          <h2 className="font-serif text-lg font-bold text-eta-navy">{titles[type] || 'Apply'}</h2>
          <button onClick={onClose} className="text-eta-muted hover:text-eta-navy transition-colors"><X size={18} /></button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-eta-navy/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-eta-navy" />
            </div>
            <h3 className="font-serif text-xl font-bold text-eta-navy mb-2">Application received</h3>
            <p className="text-sm font-sans text-eta-muted mb-6">
              Thank you for your submission. The team will review your application and be in touch if there is a relevant match or opportunity.
            </p>
            <button onClick={onClose} className="eta-btn-primary">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-eta-muted font-sans block mb-1.5">Full Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border-2 border-[#e6e0d0] px-4 py-2.5 text-sm font-sans text-eta-navy outline-none focus:border-eta-navy transition-colors" placeholder="Your full name" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-eta-muted font-sans block mb-1.5">Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border-2 border-[#e6e0d0] px-4 py-2.5 text-sm font-sans text-eta-navy outline-none focus:border-eta-navy transition-colors" placeholder="your@email.com" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-eta-muted font-sans block mb-1.5">Your Role *</label>
              <select required value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full border-2 border-[#e6e0d0] px-4 py-2.5 text-sm font-sans text-eta-navy outline-none focus:border-eta-navy transition-colors bg-white">
                <option value="">Select your role</option>
                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-eta-muted font-sans block mb-1.5">LinkedIn Profile</label>
              <input value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
                className="w-full border-2 border-[#e6e0d0] px-4 py-2.5 text-sm font-sans text-eta-navy outline-none focus:border-eta-navy transition-colors" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-eta-muted font-sans block mb-1.5">Background *</label>
              <textarea required value={form.background} onChange={e => setForm(f => ({ ...f, background: e.target.value }))} rows={3}
                className="w-full border-2 border-[#e6e0d0] px-4 py-2.5 text-sm font-sans text-eta-navy outline-none focus:border-eta-navy transition-colors resize-none"
                placeholder={type === 'opportunity' ? 'Tell us about your organisation and the opportunity...' : 'Brief background — your experience, current role, and ETA interest...'} />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-eta-muted font-sans block mb-1.5">
                {type === 'opportunity' ? 'What are you looking for?' : 'What are you looking for? *'}
              </label>
              <textarea required={type !== 'opportunity'} value={form.lookingFor} onChange={e => setForm(f => ({ ...f, lookingFor: e.target.value }))} rows={3}
                className="w-full border-2 border-[#e6e0d0] px-4 py-2.5 text-sm font-sans text-eta-navy outline-none focus:border-eta-navy transition-colors resize-none"
                placeholder={type === 'partner' ? 'What kind of partner or collaborator are you looking for?'
                  : type === 'internship' ? 'What type of internship or role are you seeking?'
                  : type === 'opportunity' ? 'Describe the role, requirements, and ideal candidate...'
                  : 'Describe what you are looking for...'} />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-eta-muted font-sans block mb-1.5">Anything else?</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={2}
                className="w-full border-2 border-[#e6e0d0] px-4 py-2.5 text-sm font-sans text-eta-navy outline-none focus:border-eta-navy transition-colors resize-none"
                placeholder="Optional — any additional context" />
            </div>
            <div className="pt-2">
              <button type="submit" className="eta-btn-primary w-full justify-center">
                <Send size={14} /> Submit Application
              </button>
              <p className="text-[10px] font-sans text-eta-muted mt-3 text-center">
                Applications are reviewed by the club. Submission does not guarantee a match or placement.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Matching({ onNavigate }: MatchingProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <div>
      {/* Hero */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="eta-label mb-4">Cambridge ETA Matching</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-eta-navy leading-tight max-w-3xl mb-6">
            Find your search partner or ETA&nbsp;internship
          </h1>
          <p className="eta-body text-lg max-w-2xl mb-8" style={{ color: '#5a5550' }}>
            A curated matching program for members of the ETA community looking to build, buy, grow, and support businesses through entrepreneurship through acquisition.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setModal('general')} className="eta-btn-primary">Apply for Matching <ArrowRight size={15} /></button>
            <button onClick={() => setModal('opportunity')} className="eta-btn-secondary">Recruit Through the Community</button>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-[#f7f2e4] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <p className="eta-label mb-4">About the Program</p>
            <p className="font-serif text-xl sm:text-2xl text-eta-navy leading-relaxed">
              Cambridge ETA Matching helps members of the ETA community connect in practical, high-quality ways. Whether you are looking for a search partner, a project collaborator, an operating teammate, an internship, or strong ETA talent, the program is designed to create curated introductions with a focus on fit, seriousness, and relevance.
            </p>
          </div>
        </div>
      </section>

      {/* Two Program Cards */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="eta-label mb-3">Programs</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-eta-navy mb-10">Two ways to connect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Partner Matching */}
            <div className="border-2 border-[#e6e0d0] p-8 sm:p-10 hover:border-eta-navy transition-colors duration-200">
              <div className="w-12 h-12 bg-eta-navy/5 rounded-lg flex items-center justify-center mb-5">
                <Handshake size={22} className="text-eta-navy" />
              </div>
              <h3 className="font-serif text-xl font-bold text-eta-navy mb-3">Partner Matching</h3>
              <p className="eta-body mb-5" style={{ color: '#5a5550' }}>
                Find a search partner, collaborator, operator, builder, or ETA-aligned teammate for a project, search, acquisition, or long-term opportunity.
              </p>
              <ul className="space-y-2.5 mb-8">
                {['Search partner matching', 'Project collaborators', 'Operators and builders', 'Advisor and teammate introductions', 'Curated introductions based on fit'].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-eta-navy font-sans">
                    <CheckCircle size={15} className="text-eta-gold mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Search Partner', 'Collaborator', 'Operator', 'Builder', 'Advisor'].map(tag => (
                  <span key={tag} className="text-[11px] font-bold uppercase tracking-wider text-eta-muted bg-[#f7f2e4] px-3 py-1.5 font-sans">{tag}</span>
                ))}
              </div>
              <button onClick={() => setModal('partner')} className="eta-btn-primary w-full justify-center">Apply for Partner Matching <ArrowRight size={15} /></button>
            </div>

            {/* Internship Matching */}
            <div className="border-2 border-[#e6e0d0] p-8 sm:p-10 hover:border-eta-navy transition-colors duration-200">
              <div className="w-12 h-12 bg-eta-navy/5 rounded-lg flex items-center justify-center mb-5">
                <GraduationCap size={22} className="text-eta-navy" />
              </div>
              <h3 className="font-serif text-xl font-bold text-eta-navy mb-3">Internship Matching</h3>
              <p className="eta-body mb-5" style={{ color: '#5a5550' }}>
                Connect students and early-career talent with ETA-related internships across search funds, acquired businesses, investors, advisory firms, and ETA ecosystem companies.
              </p>
              <ul className="space-y-2.5 mb-8">
                {['Search fund internships', 'Deal sourcing and diligence roles', 'Portfolio and operator internships', 'ETA ecosystem opportunities', 'Curated candidate introductions'].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-eta-navy font-sans">
                    <CheckCircle size={15} className="text-eta-gold mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mb-6">
                {['For Candidates', 'For Firms', 'For Recruiters'].map(tag => (
                  <span key={tag} className="text-[11px] font-bold uppercase tracking-wider text-eta-muted bg-[#f7f2e4] px-3 py-1.5 font-sans">{tag}</span>
                ))}
              </div>
              <button onClick={() => setModal('internship')} className="eta-btn-primary w-full justify-center">Apply for Internship Matching <ArrowRight size={15} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-[#f7f2e4] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="eta-label mb-3">Open to the ETA Community</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-eta-navy mb-8">Who it's for</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {AUDIENCES.map(a => (
              <span key={a} className="bg-white border border-[#e6e0d0] text-eta-navy text-sm font-semibold font-sans px-5 py-2.5">{a}</span>
            ))}
          </div>
          <p className="eta-body" style={{ color: '#5a5550' }}>
            Cambridge ETA Matching is open to the broader ETA community, with Cambridge ETA Club acting as the convening platform.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="eta-label mb-3">Process</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-eta-navy mb-10">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Partner process */}
            <div>
              <h3 className="font-serif text-lg font-bold text-eta-navy mb-6 flex items-center gap-2">
                <Handshake size={18} /> Partner Matching
              </h3>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Apply', desc: 'Submit your background, interests, and what you are looking for in a partner or collaborator.' },
                  { step: '02', title: 'We review your profile', desc: 'The team reviews submissions for seriousness, fit, and relevance to the ETA community.' },
                  { step: '03', title: 'We make curated introductions', desc: 'Where there is a strong potential fit, we facilitate introductions between members.' },
                ].map(s => (
                  <div key={s.step} className="flex gap-4">
                    <span className="text-[11px] font-black text-eta-gold font-sans mt-1">{s.step}</span>
                    <div>
                      <p className="font-bold text-eta-navy text-sm font-sans mb-1">{s.title}</p>
                      <p className="text-sm font-sans" style={{ color: '#5a5550' }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Internship process */}
            <div>
              <h3 className="font-serif text-lg font-bold text-eta-navy mb-6 flex items-center gap-2">
                <GraduationCap size={18} /> Internship Matching
              </h3>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Candidates apply or firms submit roles', desc: 'Students and early-career professionals apply as candidates. Firms and searchers submit available opportunities.' },
                  { step: '02', title: 'We review for fit', desc: 'The team reviews both candidates and roles to identify relevant, high-quality matches.' },
                  { step: '03', title: 'We connect relevant people', desc: 'Where there is alignment, we facilitate introductions between candidates and firms.' },
                ].map(s => (
                  <div key={s.step} className="flex gap-4">
                    <span className="text-[11px] font-black text-eta-gold font-sans mt-1">{s.step}</span>
                    <div>
                      <p className="font-bold text-eta-navy text-sm font-sans mb-1">{s.title}</p>
                      <p className="text-sm font-sans" style={{ color: '#5a5550' }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-8 text-sm font-sans font-medium text-eta-muted italic">This is a curated program, not an open directory.</p>
        </div>
      </section>

      {/* Curated Approach */}
      <section className="bg-[#f7f2e4] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <div className="w-12 h-12 bg-eta-navy/5 rounded-lg flex items-center justify-center mb-5">
              <Shield size={22} className="text-eta-navy" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-eta-navy mb-4">A curated approach</h2>
            <p className="eta-body text-lg" style={{ color: '#5a5550' }}>
              Cambridge ETA Matching is designed to prioritise quality over volume. We review submissions, focus on seriousness and fit, and aim to create relevant introductions across the ETA ecosystem rather than operating as an open marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Recruit Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="border-2 border-eta-navy p-8 sm:p-12">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 bg-eta-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 size={22} className="text-white" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-eta-navy mb-2">Recruit through the community</h2>
                <p className="eta-body" style={{ color: '#5a5550' }}>
                  If you are a searcher, investor, operator, acquired company, or ETA ecosystem firm looking to recruit talented students or community members, you can submit your opportunity through Cambridge ETA Matching.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setModal('opportunity')} className="eta-btn-primary">Submit an Opportunity <ArrowRight size={15} /></button>
              <button onClick={() => onNavigate('contact')} className="eta-btn-secondary">Contact Us</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#f7f2e4] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="eta-label mb-3">Common Questions</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-eta-navy mb-8">Frequently asked questions</h2>
          <div className="max-w-3xl space-y-0">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-[#e6e0d0]">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4">
                  <span className="font-bold text-eta-navy text-sm font-sans">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} className="text-eta-muted flex-shrink-0" /> : <ChevronDown size={16} className="text-eta-muted flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="pb-5 -mt-1">
                    <p className="text-sm font-sans leading-relaxed" style={{ color: '#5a5550' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Note */}
      <section className="bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-xs font-sans text-eta-muted leading-relaxed max-w-2xl">
            Applications are reviewed by the club and used only for relevant matching and community opportunities. Submission does not guarantee a match, introduction, or placement.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-eta-navy py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">Ready to connect?</h2>
          <p className="text-sm font-sans text-white/70 mb-8 max-w-lg mx-auto">
            Whether you are looking for a search partner, an internship, or strong ETA talent, the program is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => setModal('general')} className="bg-eta-gold text-eta-navy text-sm font-bold font-sans px-6 py-3 hover:bg-eta-gold-light transition-colors duration-150 inline-flex items-center gap-2">
              Apply for Matching <ArrowRight size={15} />
            </button>
            <button onClick={() => setModal('opportunity')} className="border-2 border-white/30 text-white text-sm font-bold font-sans px-6 py-3 hover:bg-white/10 transition-colors duration-150 inline-flex items-center gap-2">
              Submit an Opportunity
            </button>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {modal && <ApplicationModal type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
