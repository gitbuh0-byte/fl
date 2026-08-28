import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Download,
  Globe2,
  Layers3,
  Mail,
  Menu,
  Play,
  Plus,
  Sparkles,
  Target,
} from 'lucide-react';
import { Lead } from '../types';
import { downloadLeadsCSV } from '../utils/csvExport';

interface LandingPageProps {
  onEnterApp: (view?: 'auth' | 'dashboard' | 'scraper' | 'pipeline' | 'automation' | 'campaigns') => void;
  sampleLeads: Lead[];
}

const workflowSteps = [
  { number: '01', title: 'Find the right accounts', text: 'Search local markets, social channels, and ad audiences from one focused workspace.' },
  { number: '02', title: 'Turn signals into timing', text: 'AI enriches every record with intent, fit, context, and a next best action.' },
  { number: '03', title: 'Make the move', text: 'Launch personalized email, voice, and follow-up sequences without leaving the pipeline.' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, sampleLeads }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDownloadSampleCSV = () => {
    downloadLeadsCSV(sampleLeads, `omnibiz_sample_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <button className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="brand-mark">O</span>
          <span>OmniBiz</span>
        </button>
        <nav className="landing-links" aria-label="Landing page navigation">
          <a href="#workflow">Workflow</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#proof">Why OmniBiz</a>
        </nav>
        <div className="landing-actions">
          <button className="text-link desktop-only" onClick={() => onEnterApp('dashboard')}>Log in</button>
          <button className="black-button nav-cta" onClick={() => onEnterApp('dashboard')}>Get started <ArrowRight size={14} /></button>
          <button className="icon-button mobile-only" style={{ backgroundColor: '#0F1C2E', color: '#FFFFFF' }} onClick={() => setIsMenuOpen((open) => !open)} aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isMenuOpen} aria-controls="landing-navigation">{isMenuOpen ? <span aria-hidden="true">×</span> : <Menu size={19} />}</button>
        </div>
        <nav id="landing-navigation" className={`landing-mobile-menu${isMenuOpen ? ' is-open' : ''}`} aria-label="Mobile navigation">
          <a href="#workflow" onClick={() => setIsMenuOpen(false)}>Workflow <ArrowRight size={14} /></a>
          <a href="#capabilities" onClick={() => setIsMenuOpen(false)}>Capabilities <ArrowRight size={14} /></a>
          <a href="#proof" onClick={() => setIsMenuOpen(false)}>Why OmniBiz <ArrowRight size={14} /></a>
        </nav>
      </header>

      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <h1>Turn CRM actions into <em>automated flows.</em></h1>
            <p className="hero-lede">Find better prospects, understand what matters, and move every conversation forward with one beautifully direct sales engine.</p>
            <div className="hero-buttons">
              <button className="black-button large-button" onClick={() => onEnterApp()}>Start building <ArrowRight size={17} /></button>
              <button className="outline-button large-button" onClick={() => onEnterApp('automation')}><Play size={14} fill="currentColor" /> See the workflow</button>
            </div>
            <div className="hero-note"><span className="note-check"><Check size={11} /></span> No credit card required <span className="note-separator" /> Built for teams that move fast</div>
          </div>
          <div className="hero-art" aria-label="OmniBiz workflow preview">
            <div className="orbit orbit-left" />
            <div className="orbit orbit-right" />
            <div className="dashboard-window">
              <div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>omnibiz / automation</span><span className="window-menu">•••</span></div>
              <div className="window-body">
                <aside className="window-sidebar"><strong>O</strong><span className="side-active"><Layers3 size={14} /></span><span><Target size={14} /></span><span><Mail size={14} /></span><span><Globe2 size={14} /></span></aside>
                <div className="workflow-canvas">
                  <div className="canvas-top"><div><small>Automation flows</small><h3>Monday prospecting</h3></div><span className="live-pill">● LIVE</span></div>
                  <div className="canvas-line line-one" /><div className="canvas-line line-two" />
                  <div className="flow-card trigger-card"><span className="flow-icon orange-icon"><Globe2 size={15} /></span><div><b>New lead discovered</b><small>Google Maps / Austin, TX</small></div><span className="flow-more">···</span></div>
                  <div className="flow-card ai-card"><span className="flow-icon yellow-icon"><Sparkles size={15} /></span><div><b>AI enrichment</b><small>Score intent and write a pitch</small></div><span className="flow-more">···</span></div>
                  <div className="flow-card email-card"><span className="flow-icon black-icon"><Mail size={15} /></span><div><b>Send tailored email</b><small>Wait 2 days, then follow up</small></div><span className="flow-more">···</span></div>
                  <div className="canvas-footer"><span><span className="avatar">AS</span> Alex Sterling</span><span>3 steps <ArrowRight size={13} /></span></div>
                </div>
              </div>
            </div>
            <div className="floating-note note-left"><span className="mini-icon"><Check size={12} /></span><div><b>Best fit found</b><small>98% match · Austin</small></div></div>
            <div className="floating-note note-right"><span className="mini-icon dark-mini"><Sparkles size={12} /></span><div><b>Pitch ready</b><small>Personalized in 4 sec</small></div></div>
          </div>
        </section>

        <section className="proof-strip" id="proof">
          <span className="proof-label">Built for the whole motion</span>
          <div className="proof-stat"><strong>3×</strong><span>faster prospect<br />activation</span></div>
          <div className="proof-stat"><strong>70%</strong><span>less manual<br />work</span></div>
          <div className="proof-stat"><strong>99.9%</strong><span>workflow<br />reliability</span></div>
          <div className="proof-stat"><strong>120+</strong><span>connected<br />apps</span></div>
        </section>

        <section className="story-section story-workflow" id="workflow">
          <div className="section-intro"><span className="section-kicker">Why OmniBiz</span><h2>Workflow<br /><em>automation</em> that matters.</h2><p>Keep every action close to the signal that started it. Less tab switching, more good conversations.</p><button className="text-arrow" onClick={() => onEnterApp('dashboard')}>Explore the workbench <ArrowRight size={15} /></button></div>
          <div className="workflow-steps">{workflowSteps.map((step) => <div className="workflow-step" key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></div>)}</div>
          <div className="big-loop loop-one" /><div className="big-loop loop-two" />
        </section>

        <section className="feature-section" id="capabilities">
          <div className="feature-copy"><span className="section-kicker">The signal layer</span><h2>Know what to do<br />before you <em>do it.</em></h2><p>OmniBiz turns scattered data into a clear point of view. Search, enrich, and prioritize from one calm command center.</p><div className="feature-list"><span><Check size={14} /> Verified local and social data</span><span><Check size={14} /> AI fit scores and custom pitches</span><span><Check size={14} /> Email, dialer, and campaign actions</span></div><button className="black-button" onClick={() => onEnterApp('scraper')}>Find your next lead <ArrowRight size={15} /></button></div>
          <div className="feature-visual"><div className="visual-grid" /><div className="metric-card metric-top"><small>Lead fit score</small><strong>94<span>/100</span></strong><div className="score-line"><i /></div></div><div className="metric-card metric-bottom"><div className="metric-title"><span className="avatar orange-avatar">JR</span><span><b>Juniper & Row</b><small>New opportunity</small></span><span className="metric-plus"><Plus size={15} /></span></div><div className="metric-tags"><span>High intent</span><span>Website visitor</span></div></div><div className="feature-spark">✦</div></div>
        </section>

        <section className="number-section"><div className="number-copy"><span className="section-kicker light-kicker">Momentum, measured</span><h2>125,412<span>+</span></h2><p>automated workflows executed</p><button className="cream-button" onClick={() => onEnterApp('automation')}>Build your first flow <ArrowRight size={15} /></button></div><div className="number-chart"><div className="chart-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="chart-line" /></div></section>

        <section className="closing-section"><div><span className="section-kicker">The next move is yours</span><h2>From planning to<br /><em>completion,</em> we’ve got it.</h2><p>OmniBiz gives your team the structure to start strong and the flexibility to keep moving.</p><button className="black-button large-button" onClick={() => onEnterApp('dashboard')}>Get started <ArrowRight size={17} /></button></div><div className="closing-mark"><ArrowDownRight size={58} strokeWidth={1.3} /></div></section>
  </main>
  <footer className="landing-footer"><div className="footer-brand"><span className="brand-mark">O</span><span>OmniBiz</span><small>Workflows in motion.</small></div><div className="footer-links"><div><b>Explore</b><button onClick={() => onEnterApp('dashboard')}>Workbench</button><button onClick={() => onEnterApp('scraper')}>Lead finder</button><button onClick={() => onEnterApp('automation')}>Automation</button></div><div><b>Company</b><a href="#proof">Why OmniBiz</a><a href="#workflow">Workflow</a><button onClick={handleDownloadSampleCSV}><Download size={13} /> Sample CSV</button></div></div><div className="footer-bottom"><span>© 2026 OmniBiz</span><span>Made for teams that follow through.</span><span className="footer-symbol">↗</span></div></footer>
  </div>
  );
};
