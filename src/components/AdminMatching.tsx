import { useState, useEffect } from 'react';
import { Users, Handshake, GraduationCap, Building2, Search, ChevronDown, ExternalLink, Mail, Linkedin, FileText, Trash2 } from 'lucide-react';

interface Submission {
  name: string;
  email: string;
  role: string;
  linkedin?: string;
  phone?: string;
  background: string;
  lookingFor?: string;
  interests?: string[];
  website?: string;
  companyName?: string;
  companyDescription?: string;
  message?: string;
  cvFileName?: string;
  coverFileName?: string;
  cv_url?: string;
  cover_letter_url?: string;
  type: 'partner' | 'internship' | 'opportunity' | 'general';
  submittedAt: string;
  status?: string;
}

const TYPE_CONFIG = {
  partner: { label: 'Partner', icon: Handshake, color: '#3B82F6', bg: '#EFF6FF' },
  internship: { label: 'Internship', icon: GraduationCap, color: '#8B5CF6', bg: '#F5F3FF' },
  opportunity: { label: 'Opportunity', icon: Building2, color: '#10B981', bg: '#ECFDF5' },
  general: { label: 'General', icon: Users, color: '#F59E0B', bg: '#FFFBEB' },
};

export default function AdminMatching() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Submission | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('eta-matching-submissions') || '[]');
    setSubmissions(stored.sort((a: Submission, b: Submission) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
  }, []);

  const filtered = submissions.filter(s => {
    if (filter !== 'all' && s.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || (s.companyName || '').toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    all: submissions.length,
    partner: submissions.filter(s => s.type === 'partner').length,
    internship: submissions.filter(s => s.type === 'internship').length,
    opportunity: submissions.filter(s => s.type === 'opportunity').length,
    general: submissions.filter(s => s.type === 'general').length,
  };

  const deleteSubmission = (idx: number) => {
    const realIdx = submissions.indexOf(filtered[idx]);
    const updated = [...submissions];
    updated.splice(realIdx, 1);
    setSubmissions(updated);
    localStorage.setItem('eta-matching-submissions', JSON.stringify(updated));
    setSelected(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>Matching Applications</h2>
        <a href="https://eta-matching.vercel.app" target="_blank" rel="noopener"
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--eta-gold, #C4A35A)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Matching Platform <ExternalLink size={13} />
        </a>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {(['partner', 'internship', 'opportunity', 'general'] as const).map(t => {
          const c = TYPE_CONFIG[t];
          const Icon = c.icon;
          return (
            <div key={t} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: 16, cursor: 'pointer' }}
              onClick={() => setFilter(filter === t ? 'all' : t)}>
              <Icon size={20} style={{ color: c.color, marginBottom: 8 }} />
              <p style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{counts[t]}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{c.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px 8px 32px', fontSize: 13, outline: 'none' }}
            placeholder="Search by name, email, or company..." />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', fontSize: 13, outline: 'none' }}>
          <option value="all">All Types ({counts.all})</option>
          <option value="partner">Partner ({counts.partner})</option>
          <option value="internship">Internship ({counts.internship})</option>
          <option value="opportunity">Opportunity ({counts.opportunity})</option>
          <option value="general">General ({counts.general})</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: 48, textAlign: 'center' }}>
          <Users size={32} style={{ color: 'rgba(255,255,255,0.3)', margin: '0 auto 12px' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            {submissions.length === 0 ? 'No applications yet. Share the matching platform to start receiving applications.' : 'No applications match your filter.'}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                {['Type', 'Name', 'Email', 'Role', 'Interests', 'Date', ''].map(h => (
                  <th key={h} style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const tc = TYPE_CONFIG[s.type] || TYPE_CONFIG.general;
                return (
                  <tr key={i} onClick={() => setSelected(s)} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
                    onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')} onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: tc.bg, color: tc.color, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 2 }}>{tc.label}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#fff', fontSize: 13, fontWeight: 600 }}>{s.name}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{s.email}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{s.role}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{(s.interests || []).join(', ') || '—'}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{new Date(s.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <button onClick={e => { e.stopPropagation(); deleteSubmission(i); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setSelected(null)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 480, background: '#1a1a25', height: '100%', overflowY: 'auto', padding: 32 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ background: TYPE_CONFIG[selected.type]?.bg || '#fff', color: TYPE_CONFIG[selected.type]?.color || '#000', fontSize: 12, fontWeight: 700, padding: '4px 10px' }}>
                {TYPE_CONFIG[selected.type]?.label || 'General'} Application
              </span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 20 }}>×</button>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{selected.name}</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
              Applied {new Date(selected.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              <a href={`mailto:${selected.email}`} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.1)', padding: '6px 12px', fontSize: 12, color: '#fff', textDecoration: 'none' }}>
                <Mail size={12} /> {selected.email}
              </a>
              {selected.linkedin && (
                <a href={selected.linkedin} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.1)', padding: '6px 12px', fontSize: 12, color: '#fff', textDecoration: 'none' }}>
                  <Linkedin size={12} /> LinkedIn
                </a>
              )}
              {selected.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.1)', padding: '6px 12px', fontSize: 12, color: '#fff' }}>{selected.phone}</span>}
            </div>

            {[
              { label: 'Role', value: selected.role },
              { label: 'Interests', value: (selected.interests || []).join(', ') },
              { label: 'Background', value: selected.background },
              { label: 'Looking For', value: selected.lookingFor },
              ...(selected.type === 'opportunity' ? [
                { label: 'Company', value: selected.companyName },
                { label: 'Website', value: selected.website },
                { label: 'Company Description', value: selected.companyDescription },
              ] : []),
              { label: 'Additional Notes', value: selected.message },
            ].filter(f => f.value).map((f, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{f.label}</p>
                {f.label === 'Website' ? (
                  <a href={f.value} target="_blank" rel="noopener" style={{ color: '#C4A35A', fontSize: 13, textDecoration: 'none' }}>{f.value} <ExternalLink size={10} style={{ display: 'inline' }} /></a>
                ) : (
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{f.value}</p>
                )}
              </div>
            ))}

            {(selected.cvFileName || selected.cv_url) && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>CV</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', padding: '8px 12px' }}>
                  <FileText size={14} style={{ color: '#fff' }} />
                  <span style={{ fontSize: 13, color: '#fff' }}>{selected.cvFileName || 'CV uploaded'}</span>
                  {selected.cv_url && <a href={selected.cv_url} target="_blank" rel="noopener" style={{ color: '#C4A35A', marginLeft: 'auto' }}><ExternalLink size={12} /></a>}
                </div>
              </div>
            )}

            {(selected.coverFileName || selected.cover_letter_url) && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Cover Letter</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', padding: '8px 12px' }}>
                  <FileText size={14} style={{ color: '#fff' }} />
                  <span style={{ fontSize: 13, color: '#fff' }}>{selected.coverFileName || 'Cover letter uploaded'}</span>
                  {selected.cover_letter_url && <a href={selected.cover_letter_url} target="_blank" rel="noopener" style={{ color: '#C4A35A', marginLeft: 'auto' }}><ExternalLink size={12} /></a>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
