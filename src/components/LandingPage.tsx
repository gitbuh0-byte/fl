import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  PhoneCall, 
  Mail, 
  Download, 
  CheckCircle2, 
  ArrowRight, 
  Megaphone, 
  ChevronDown,
  Laptop
} from 'lucide-react';
import { Lead } from '../types';
import { downloadLeadsCSV } from '../utils/csvExport';

interface LandingPageProps {
  onEnterApp: (view?: 'dashboard' | 'scraper' | 'pipeline' | 'automation' | 'campaigns') => void;
  sampleLeads: Lead[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, sampleLeads }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleDownloadSampleCSV = () => {
    downloadLeadsCSV(sampleLeads, `leadnexus_sample_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const FAQS = [
    {
      q: 'How does LeadNexus extract real-time business data?',
      a: 'LeadNexus connects directly to Google Places API, Meta Ads webhook listeners, social channel crawlers, and website scrapers to aggregate verified business telephone numbers, direct emails, social handles, review metrics, and decision-maker contact details in seconds.'
    },
    {
      q: 'How does the Gemini 3.7 AI Enrichment engine work?',
      a: 'Once a lead is ingested, our built-in Gemini intelligence analyzes the business domain, services offered, and review sentiment to calculate a predictive Lead Fit Score (0-100), identify key operational bottlenecks, and formulate a customized cold email pitch and phone talk track.'
    },
    {
      q: 'Can I export all leads directly to CSV for my external CRM or cold email tool?',
      a: 'Yes! With a single click of the "Download CSV" button anywhere in the Kanban or Dashboard, you get a clean, standardized, RFC-compliant CSV containing verified phones, emails, social profiles, AI pitch insights, and deal stages ready for HubSpot, Salesforce, Apollo, or Instantly.'
    },
    {
      q: 'What is the AI Voice Dialer Studio?',
      a: 'LeadNexus features a fully simulated outbound voice dialer with speech synthesis. You can test objection handling, practice realistic prospect phone dialogues, and log timestamped call transcripts directly to the lead timeline.'
    },
    {
      q: 'Does it support inbound ad campaign webhooks?',
      a: 'Yes! You can track campaign budgets, CPL, and ROAS across Meta Lead Ads, Google Local Services, LinkedIn Gen Forms, and TikTok, with built-in instant lead simulation and UTM tracking.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            onClick={() => onEnterApp('dashboard')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30 text-base font-mono">
              Ω
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">LeadNexus</span>
              <span className="text-blue-500 font-medium text-[10px] px-2 py-0.5 border border-blue-500/30 rounded bg-blue-950/30 font-mono">
                PRO CRM
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 font-mono">
            <button
              onClick={handleDownloadSampleCSV}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#161616] hover:bg-[#202020] text-gray-300 border border-[#2c2c2c] text-xs font-semibold cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Sample CSV</span>
            </button>

            <button
              onClick={() => onEnterApp('dashboard')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer uppercase tracking-wider active:scale-95"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Launch App</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141824] border border-blue-500/40 text-blue-400 text-xs font-mono font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>AI-POWERED PROSPECTING & SALES CRM ENGINE</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Extract Verified B2B Leads, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Enrich with AI & Automate Outreach
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Multi-channel scraper for Google Maps, Meta Ads webhooks, and social media. 
            Instantly score intent, execute cold email drip cadences, simulate outbound AI calls, and export clean CSV datasets.
          </p>

          {/* Clean Primary Hero CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-mono">
            <button
              onClick={() => onEnterApp('dashboard')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-2xl text-sm font-bold shadow-xl shadow-blue-600/30 transition-all cursor-pointer uppercase tracking-wider active:scale-95"
            >
              <span>Launch App Workbench</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownloadSampleCSV}
              className="flex items-center gap-2 bg-[#141414] hover:bg-[#1c1c1c] text-emerald-400 border border-emerald-500/30 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Sample CSV</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: BENTO FEATURE GRID */}
      <section id="features" className="py-20 bg-[#080808] border-t border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              Engine Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything Your Sales Team Needs to Scale Outbound
            </h2>
            <p className="text-sm text-gray-400">
              From raw coordinate scraping to automated telephone voice turns and CSV exports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#111] p-6 rounded-3xl border border-[#222] shadow-xl space-y-4 hover:border-[#333] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Channel Scraper Engine</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Extract high-intent local business contacts with location queries, keyword niche targeting, Google ratings, review counts, and scraped social media handles.
              </p>
              <div className="pt-2 font-mono text-xs text-blue-400 flex items-center gap-1 cursor-pointer" onClick={() => onEnterApp('scraper')}>
                <span>Test Live Scraper</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#111] p-6 rounded-3xl border border-[#222] shadow-xl space-y-4 hover:border-[#333] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Gemini 3.7 AI Enrichment</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Automatically generate tailored sales pitches, analyze business bottlenecks, calculate lead score (0-100), and discover target decision-maker titles.
              </p>
              <div className="pt-2 font-mono text-xs text-indigo-400 flex items-center gap-1 cursor-pointer" onClick={() => onEnterApp('pipeline')}>
                <span>View AI Pitches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#111] p-6 rounded-3xl border border-[#222] shadow-xl space-y-4 hover:border-[#333] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">1-Click CSV Data Portability</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Export full CRM databases and filtered Kanban subsets directly to formatted CSV files with RFC-compliant quote escaping for instant import into any external tool.
              </p>
              <div className="pt-2 font-mono text-xs text-emerald-400 flex items-center gap-1 cursor-pointer" onClick={handleDownloadSampleCSV}>
                <span>Download Sample CSV</span>
                <Download className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#111] p-6 rounded-3xl border border-[#222] shadow-xl space-y-4 hover:border-[#333] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Voice Dialer & Speech Synthesis</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Simulate outbound phone calls with realistic conversational speech synthesis. Handle live prospect objections and auto-log transcript timelines.
              </p>
              <div className="pt-2 font-mono text-xs text-rose-400 flex items-center gap-1 cursor-pointer" onClick={() => onEnterApp('automation')}>
                <span>Open Voice Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#111] p-6 rounded-3xl border border-[#222] shadow-xl space-y-4 hover:border-[#333] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Step Cold Email Drips</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Execute automated 3-step personalized email sequences referencing scraped review data, company services, and localized geographic tags.
              </p>
              <div className="pt-2 font-mono text-xs text-amber-400 flex items-center gap-1 cursor-pointer" onClick={() => onEnterApp('automation')}>
                <span>Inspect Sequences</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#111] p-6 rounded-3xl border border-[#222] shadow-xl space-y-4 hover:border-[#333] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Ad Campaign Webhook Ingestors</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Connect Meta Ads, Google Local Search, LinkedIn, and TikTok form webhooks. Track real-time Cost Per Lead (CPL) and Pipeline ROAS automatically.
              </p>
              <div className="pt-2 font-mono text-xs text-cyan-400 flex items-center gap-1 cursor-pointer" onClick={() => onEnterApp('campaigns')}>
                <span>Manage Campaigns</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: STEP BY STEP WORKFLOW */}
      <section id="workflow" className="py-20 bg-[#050505] border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              Execution Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Raw Web Signal to Closed Deal in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
            <div className="bg-[#111] p-5 rounded-2xl border border-[#222] space-y-3 relative">
              <span className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                01
              </span>
              <h3 className="text-sm font-bold text-white font-sans">Multi-Source Ingestion</h3>
              <p className="text-gray-400 leading-relaxed font-sans text-xs">
                Crawl Google Maps coordinates or capture inbound Meta & Google Ads webhooks instantly into the unified CRM ledger.
              </p>
            </div>

            <div className="bg-[#111] p-5 rounded-2xl border border-[#222] space-y-3 relative">
              <span className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                02
              </span>
              <h3 className="text-sm font-bold text-white font-sans">AI Scoring & Enrichment</h3>
              <p className="text-gray-400 leading-relaxed font-sans text-xs">
                Gemini 3.7 parses business attributes, estimates deal size, calculates intent fit scores, and crafts strategic outreach angles.
              </p>
            </div>

            <div className="bg-[#111] p-5 rounded-2xl border border-[#222] space-y-3 relative">
              <span className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-sm">
                03
              </span>
              <h3 className="text-sm font-bold text-white font-sans">Multi-Channel Follow-ups</h3>
              <p className="text-gray-400 leading-relaxed font-sans text-xs">
                Deploy personalized 3-step email drip cadences and launch AI voice dialer sessions with conversational speech synthesis.
              </p>
            </div>

            <div className="bg-[#111] p-5 rounded-2xl border border-[#222] space-y-3 relative">
              <span className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                04
              </span>
              <h3 className="text-sm font-bold text-white font-sans">Kanban & 1-Click CSV</h3>
              <p className="text-gray-400 leading-relaxed font-sans text-xs">
                Move deals across visual pipeline stages and download RFC-compliant CSVs to power external marketing campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PRICING PLANS */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
            Predictable Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparent Plans for High-Velocity Teams
          </h2>
          <p className="text-xs text-gray-400">
            No surprise scraping fees. All plans include Gemini 3.7 AI enrichment and unlimited CSV exports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="bg-[#111] p-6 rounded-3xl border border-[#222] shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Starter SDR</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1f1f] text-gray-400">SOLO</span>
              </div>
              <div className="font-mono">
                <span className="text-3xl font-bold text-white">$79</span>
                <span className="text-gray-500 text-xs"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-300 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>1,500 Scraped Leads / mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Google Maps & Social Scraper</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Gemini AI Lead Scoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Unlimited CSV Data Exports</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onEnterApp('scraper')}
              className="w-full py-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-gray-200 border border-[#333] rounded-xl font-bold text-xs font-mono cursor-pointer transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Plan 2: Featured Pro */}
          <div className="bg-[#141824] p-6 rounded-3xl border-2 border-blue-500 shadow-2xl space-y-6 flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-mono font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              MOST POPULAR
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Agency Pro</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/40 text-blue-400 font-bold">UNLIMITED</span>
              </div>
              <div className="font-mono">
                <span className="text-3xl font-bold text-white">$199</span>
                <span className="text-gray-400 text-xs"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-200 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>10,000 Scraped Leads / mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All Inbound Webhooks (Meta, Google, LinkedIn)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI Voice Dialer & Speech Synthesis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multi-Step Automated Email Drips</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full CRM Kanban & Pipeline Analytics</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onEnterApp('dashboard')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs font-mono shadow-lg shadow-blue-600/30 cursor-pointer transition-all uppercase tracking-wider"
            >
              Start Free Trial
            </button>
          </div>

          {/* Plan 3 */}
          <div className="bg-[#111] p-6 rounded-3xl border border-[#222] shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Enterprise Scale</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1f1f] text-gray-400">SCALE</span>
              </div>
              <div className="font-mono">
                <span className="text-3xl font-bold text-white">$499</span>
                <span className="text-gray-500 text-xs"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-300 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>50,000+ Scraped Leads / mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Dedicated Scraping Proxies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Custom Gemini Model Fine-Tuning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Priority REST API Webhook Access</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onEnterApp('dashboard')}
              className="w-full py-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-gray-200 border border-[#333] rounded-xl font-bold text-xs font-mono cursor-pointer transition-all"
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-[#080808] border-t border-[#222]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-[#111] rounded-2xl border border-[#222] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-400' : 'text-gray-500'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-gray-400 font-sans text-xs leading-relaxed border-t border-[#1a1a1a]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-cyan-900/30 border border-blue-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Supercharge Your Outbound Sales Pipeline?
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto text-xs sm:text-sm">
            Start scraping verified B2B leads, scoring with Gemini AI, and exporting clean CSV datasets right now.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-mono">
            <button
              onClick={() => onEnterApp('dashboard')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-xl shadow-blue-600/40 transition-all cursor-pointer uppercase tracking-wider"
            >
              Launch Live App Workbench
            </button>
            <button
              onClick={handleDownloadSampleCSV}
              className="bg-[#111] hover:bg-[#1a1a1a] text-emerald-400 border border-emerald-500/30 px-6 py-3.5 rounded-2xl text-sm font-bold cursor-pointer font-mono"
            >
              Download Sample CSV
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 border-t border-[#222] bg-[#050505] text-[11px] font-mono text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-blue-500 font-bold">Ω LeadNexus Pro</span>
            <span>• Built with Google Gemini 3.7 & React</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onEnterApp('scraper')} className="hover:text-white cursor-pointer">Scraper</button>
            <button onClick={() => onEnterApp('pipeline')} className="hover:text-white cursor-pointer">Kanban</button>
            <button onClick={handleDownloadSampleCSV} className="hover:text-emerald-400 cursor-pointer">CSV Export</button>
            <span>© 2026 LeadNexus Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
