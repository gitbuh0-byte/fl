import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  MapPin, 
  Megaphone, 
  Mail, 
  PhoneCall, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Flame, 
  Globe, 
  Layers, 
  Zap, 
  Activity, 
  ArrowRight,
  Download,
  Plus,
  Play,
  Search,
  Filter,
  RefreshCw,
  Sliders,
  Send,
  Volume2,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Lead, Campaign, EmailCadence, FollowUpTask, PipelineStage, ScrapedLeadResult } from '../types';
import { downloadLeadsCSV } from '../utils/csvExport';
import { ScraperWorkbench } from './ScraperWorkbench';
import { PipelineKanban } from './PipelineKanban';
import { AutomationSequences } from './AutomationSequences';
import { CampaignsManager } from './CampaignsManager';
import { scrapeGoogleMaps, enrichLeadWithAI } from '../services/apiService';

interface DashboardViewProps {
  leads: Lead[];
  campaigns: Campaign[];
  emailCadences: EmailCadence[];
  followUpTasks: FollowUpTask[];
  onSelectLead: (lead: Lead, tab?: 'overview' | 'email' | 'call' | 'notes') => void;
  onImportLead: (newLead: Lead) => void;
  onBatchImportLeads: (leads: Lead[]) => void;
  onUpdateLeadStage: (leadId: string, newStage: PipelineStage) => void;
  onOpenNewLeadModal: () => void;
  onLaunchDialerForLead: (lead: Lead) => void;
  onCompleteTask: (taskId: string) => void;
  onToggleCampaignStatus: (campaignId: string) => void;
  onCreateCampaign: (campaign: Campaign) => void;
  onSimulateWebhookLead: (campaign: Campaign) => void;
  onDownloadCSV: () => void;
  onNavigateToView?: (view: 'scraper' | 'pipeline' | 'automation' | 'campaigns') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  campaigns,
  emailCadences,
  followUpTasks,
  onSelectLead,
  onImportLead,
  onBatchImportLeads,
  onUpdateLeadStage,
  onOpenNewLeadModal,
  onLaunchDialerForLead,
  onCompleteTask,
  onToggleCampaignStatus,
  onCreateCampaign,
  onSimulateWebhookLead,
  onDownloadCSV,
  onNavigateToView,
}) => {
  // Sub-view mode inside the Dashboard
  const [activeDashboardMode, setActiveDashboardMode] = useState<
    'all_in_one' | 'scraper' | 'pipeline' | 'automation' | 'campaigns'
  >('all_in_one');

  // Quick Scraper Widget state
  const [quickKeyword, setQuickKeyword] = useState('Cosmetic Dental Clinics');
  const [quickLocation, setQuickLocation] = useState('Austin, TX');
  const [isQuickScraping, setIsQuickScraping] = useState(false);
  const [quickScrapeResults, setQuickScrapeResults] = useState<ScrapedLeadResult[]>([]);
  const [quickScrapeSuccess, setQuickScrapeSuccess] = useState(false);

  // Table filter state
  const [tableSearch, setTableSearch] = useState('');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');

  // Key Metrics Calculations
  const totalPipelineValue = leads.reduce((acc, l) => acc + (l.dealValue || 0), 0);
  const wonDeals = leads.filter(l => l.pipelineStage === 'closed_won');
  const totalWonRevenue = wonDeals.reduce((acc, l) => acc + (l.dealValue || 0), 0);
  const totalAdSpend = campaigns.reduce((acc, c) => acc + (c.spend ?? (c as any).spent ?? 0), 0);
  const totalAdLeads = campaigns.reduce((acc, c) => acc + (c.leadsCount ?? (c as any).leadsGenerated ?? 0), 0);
  const avgCPL = totalAdLeads > 0 ? (totalAdSpend / totalAdLeads).toFixed(2) : '0.00';
  const winRate = leads.length > 0 ? ((wonDeals.length / leads.length) * 100).toFixed(1) : '0.0';
  const highIntentLeads = leads.filter(l => l.leadScore >= 90);
  const pendingTasks = followUpTasks.filter(t => !t.completed);

  // Channel Breakdown
  const channelCounts: Record<string, number> = {
    'Google Maps': 0,
    'Meta Ads': 0,
    'Google Ads': 0,
    'LinkedIn Ads': 0,
    'TikTok Ads': 0,
    'Social Scraper': 0,
    'Web Scraper': 0,
  };

  leads.forEach(l => {
    if (l.sourceChannel === 'google_maps') channelCounts['Google Maps']++;
    else if (l.sourceChannel === 'meta_ads') channelCounts['Meta Ads']++;
    else if (l.sourceChannel === 'google_ads') channelCounts['Google Ads']++;
    else if (l.sourceChannel === 'linkedin_ads') channelCounts['LinkedIn Ads']++;
    else if (l.sourceChannel === 'tiktok_ads') channelCounts['TikTok Ads']++;
    else if (l.sourceChannel === 'social_scrape') channelCounts['Social Scraper']++;
    else if (l.sourceChannel === 'web_scrape') channelCounts['Web Scraper']++;
    else channelCounts['Google Maps']++;
  });

  const BENTO_COLORS: Record<string, string> = {
    'Google Maps': '#2563eb', // Blue-600
    'Meta Ads': '#f43f5e',    // Rose-500
    'Google Ads': '#10b981',  // Emerald-500
    'LinkedIn Ads': '#6366f1',// Indigo-500
    'TikTok Ads': '#ec4899',  // Pink-500
    'Social Scraper': '#f59e0b', // Amber-500
    'Web Scraper': '#06b6d4', // Cyan-500
  };

  // Pipeline Stage Funnel Counts
  const countNew = leads.filter(l => l.pipelineStage === 'new').length;
  const countEnriched = leads.filter(l => l.pipelineStage === 'enriched').length;
  const countContacted = leads.filter(l => l.pipelineStage === 'contacted').length;
  const countBooked = leads.filter(l => l.pipelineStage === 'meeting_scheduled').length;
  const countProposal = leads.filter(l => l.pipelineStage === 'proposal_sent').length;
  const countWon = wonDeals.length;

  // Handle Quick Scrape from Dashboard Widget
  const handleRunQuickScrape = async () => {
    if (isQuickScraping) return;
    setIsQuickScraping(true);
    setQuickScrapeSuccess(false);
    try {
      const response = await scrapeGoogleMaps({
        keyword: quickKeyword,
        location: quickLocation,
        radius: 25,
        limit: 4,
      });
      if (response && response.results) {
        setQuickScrapeResults(response.results);
        setQuickScrapeSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsQuickScraping(false);
    }
  };

  const handleImportSingleScrape = (item: ScrapedLeadResult) => {
    const newLead: Lead = {
      id: `lead_dash_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: item.name || 'Discovered Business',
      contactPerson: item.contactPerson || 'Practice Owner',
      title: item.title || 'Owner / Director',
      email: item.email || `contact@${item.website?.replace('https://', '').replace('/', '') || 'domain.com'}`,
      phone: item.phone || '+1 (512) 555-0100',
      website: item.website || 'https://example.com',
      address: item.address,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      socialHandles: item.socialHandles || {},
      sourceChannel: 'google_maps',
      sourceDetails: {
        searchKeyword: quickKeyword,
        searchLocation: quickLocation,
      },
      pipelineStage: 'new',
      dealValue: Math.floor(Math.random() * 15000) + 5000,
      leadScore: item.confidenceScore || 88,
      intentLevel: (item.confidenceScore || 88) > 85 ? 'High' : 'Medium',
      tags: ['Google Maps', quickKeyword, quickLocation],
      notes: item.bio || 'Scraped from Dashboard Live Engine.',
      assignedTo: 'Sarah Connor',
      createdAt: new Date().toISOString(),
      emailSequenceStatus: 'idle',
      callStatus: 'not_called',
      activityTimeline: [
        {
          id: `act_${Date.now()}`,
          type: 'ingested',
          title: 'Scraped from Google Maps',
          description: `Extracted via Dashboard Quick Scraper in ${quickLocation}.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    onImportLead(newLead);
    setQuickScrapeResults(prev => prev.filter(r => r.id !== item.id));
  };

  const handleImportAllScraped = () => {
    const newLeads: Lead[] = quickScrapeResults.map((item, idx) => ({
      id: `lead_batch_${Date.now()}_${idx}`,
      name: item.name || 'Discovered Business',
      contactPerson: item.contactPerson || 'Practice Owner',
      title: item.title || 'Managing Director',
      email: item.email || `contact@${item.website?.replace('https://', '').replace('/', '') || 'domain.com'}`,
      phone: item.phone || '+1 (512) 555-0100',
      website: item.website || 'https://example.com',
      address: item.address,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      socialHandles: item.socialHandles || {},
      sourceChannel: 'google_maps',
      sourceDetails: {
        searchKeyword: quickKeyword,
        searchLocation: quickLocation,
      },
      pipelineStage: 'new',
      dealValue: Math.floor(Math.random() * 15000) + 5000,
      leadScore: item.confidenceScore || 88,
      intentLevel: 'High',
      tags: ['Google Maps Batch', quickKeyword],
      notes: item.bio || 'Extracted in batch from Dashboard.',
      assignedTo: 'Sarah Connor',
      createdAt: new Date().toISOString(),
      emailSequenceStatus: 'idle',
      callStatus: 'not_called',
      activityTimeline: [
        {
          id: `act_${Date.now()}`,
          type: 'ingested',
          title: 'Batch Ingested from Live Scraper',
          description: `Discovered in ${quickLocation}.`,
          timestamp: new Date().toISOString(),
        },
      ],
    }));

    onBatchImportLeads(newLeads);
    setQuickScrapeResults([]);
  };

  // Filtered Leads for Table
  const tableFilteredLeads = leads.filter(l => {
    const matchesSearch = 
      !tableSearch ||
      l.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      l.contactPerson?.toLowerCase().includes(tableSearch.toLowerCase()) ||
      l.phone?.includes(tableSearch);
    
    const matchesSource = 
      selectedSourceFilter === 'all' || l.sourceChannel === selectedSourceFilter;

    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Universal Dashboard Control & Sub-View Switcher */}
      <div className="bg-[#111] border border-[#222] rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none font-mono text-xs">
          <button
            id="dash-tab-all-in-one"
            onClick={() => setActiveDashboardMode('all_in_one')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeDashboardMode === 'all_in_one'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Command Center</span>
          </button>

          <button
            id="dash-tab-scraper"
            onClick={() => setActiveDashboardMode('scraper')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeDashboardMode === 'scraper'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Live Scraper</span>
          </button>

          <button
            id="dash-tab-pipeline"
            onClick={() => setActiveDashboardMode('pipeline')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeDashboardMode === 'pipeline'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Pipeline Kanban ({leads.length})</span>
          </button>

          <button
            id="dash-tab-automation"
            onClick={() => setActiveDashboardMode('automation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeDashboardMode === 'automation'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-rose-400" />
            <span>Dialer & Email Drips</span>
            {pendingTasks.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <button
            id="dash-tab-campaigns"
            onClick={() => setActiveDashboardMode('campaigns')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeDashboardMode === 'campaigns'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span>Ad Webhooks ({campaigns.length})</span>
          </button>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2 font-mono text-xs w-full lg:w-auto justify-end">
          <button
            id="dash-download-csv-btn"
            onClick={onDownloadCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#161616] hover:bg-[#202020] text-emerald-400 border border-emerald-500/30 font-bold transition-all cursor-pointer shadow-sm"
            title="Download full CSV export of all CRM records"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          <button
            id="dash-create-prospect-btn"
            onClick={onOpenNewLeadModal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Prospect</span>
          </button>
        </div>
      </div>

      {/* RENDER DEDICATED EMBEDDED VIEWS WHEN SELECTED */}
      {activeDashboardMode === 'scraper' && (
        <ScraperWorkbench
          onImportLead={onImportLead}
          onBatchImportLeads={onBatchImportLeads}
          existingLeads={leads}
        />
      )}

      {activeDashboardMode === 'pipeline' && (
        <PipelineKanban
          leads={leads}
          onSelectLead={onSelectLead}
          onUpdateLeadStage={onUpdateLeadStage}
          onOpenNewLeadModal={onOpenNewLeadModal}
          onLaunchDialerForLead={onLaunchDialerForLead}
        />
      )}

      {activeDashboardMode === 'automation' && (
        <AutomationSequences
          emailCadences={emailCadences}
          followUpTasks={followUpTasks}
          leads={leads}
          onCompleteTask={onCompleteTask}
          onSelectLeadById={(leadId) => {
            const found = leads.find(l => l.id === leadId);
            if (found) onSelectLead(found);
          }}
          onLaunchDialerForLead={onLaunchDialerForLead}
        />
      )}

      {activeDashboardMode === 'campaigns' && (
        <CampaignsManager
          campaigns={campaigns}
          onToggleCampaignStatus={onToggleCampaignStatus}
          onCreateCampaign={onCreateCampaign}
          onSimulateWebhookLead={onSimulateWebhookLead}
        />
      )}

      {/* ALL-IN-ONE MASTER COMMAND CENTER MODE */}
      {activeDashboardMode === 'all_in_one' && (
        <div className="space-y-6">
          {/* Top Bento Row: 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat Card 1: Total Active Leads */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-5 flex flex-col justify-between hover:border-[#333] transition-colors shadow-lg">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold font-mono">Total Leads</div>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-baseline gap-2 mt-4 font-mono">
                <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{leads.length}</span>
                <span className="text-emerald-400 text-xs font-bold font-mono">+{leads.length > 0 ? 14 : 0}%</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1 font-mono">
                {highIntentLeads.length} high-intent scored ({winRate}% win rate)
              </div>
            </div>

            {/* Stat Card 2: Avg. Scraping Rate */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-5 flex flex-col justify-between hover:border-[#333] transition-colors shadow-lg">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold font-mono">Crawl Velocity</div>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2 mt-4 font-mono">
                <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">48.2</span>
                <span className="text-gray-400 text-xs font-mono">leads / min</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1 font-mono">
                Google Places & Social Media Engine
              </div>
            </div>

            {/* Stat Card 3: Total Pipeline Value */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-5 flex flex-col justify-between hover:border-[#333] transition-colors shadow-lg">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold font-mono">Pipeline Value</div>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2 mt-4 font-mono">
                <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  ${(totalPipelineValue / 1000).toFixed(1)}k
                </span>
                <span className="text-emerald-400 text-xs font-bold font-mono">+${(totalWonRevenue / 1000).toFixed(1)}k won</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1 font-mono">
                {wonDeals.length} deals closed won
              </div>
            </div>

            {/* Stat Card 4: Paid Ad CPL & Ingest */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-5 flex flex-col justify-between hover:border-[#333] transition-colors shadow-lg">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold font-mono">Avg Paid CPL</div>
                <Target className="w-4 h-4 text-rose-500" />
              </div>
              <div className="flex items-baseline gap-2 mt-4 font-mono">
                <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">${avgCPL}</span>
                <span className="text-blue-400 text-xs font-mono font-bold">{campaigns.length} Webhooks</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1 font-mono">
                Organic Scraping Cost: $0.00
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION 1: EMBEDDED LIVE QUICK SCRAPER + ACQUISITION SOURCES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Embedded Live Mini Scraper Engine Widget (Col 7) */}
            <div className="lg:col-span-7 bg-[#111] border border-[#222] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Live Quick Scraper</h3>
                      <p className="text-[11px] text-gray-500">Extract high-intent local business leads directly from this dashboard</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveDashboardMode('scraper')}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Workbench</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Scraper Input Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 font-mono text-xs">
                  <div className="sm:col-span-6">
                    <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Target Niche / Keyword</label>
                    <input
                      type="text"
                      value={quickKeyword}
                      onChange={(e) => setQuickKeyword(e.target.value)}
                      placeholder="e.g. Cosmetic Dentists, HVAC Contractors"
                      className="w-full bg-[#161616] border border-[#2c2c2c] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Location / Market</label>
                    <input
                      type="text"
                      value={quickLocation}
                      onChange={(e) => setQuickLocation(e.target.value)}
                      placeholder="e.g. Austin, TX"
                      className="w-full bg-[#161616] border border-[#2c2c2c] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-end">
                    <button
                      onClick={handleRunQuickScrape}
                      disabled={isQuickScraping}
                      className="w-full h-[35px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                    >
                      {isQuickScraping ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>{isQuickScraping ? 'Crawl' : 'Scrape'}</span>
                    </button>
                  </div>
                </div>

                {/* Scraped Results Stream */}
                {quickScrapeResults.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#222] space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Discovered {quickScrapeResults.length} Verified Prospects
                      </span>
                      <button
                        onClick={handleImportAllScraped}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                      >
                        + Import All to Pipeline
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {quickScrapeResults.map((res) => (
                        <div
                          key={res.placeId}
                          className="bg-[#161616] p-2.5 rounded-xl border border-[#282828] flex items-center justify-between gap-3 text-xs font-mono"
                        >
                          <div className="truncate">
                            <span className="font-bold text-white truncate block">{res.title}</span>
                            <span className="text-[10px] text-gray-400 truncate block">
                              {res.phone} • Rating: {res.rating}★ ({res.reviewsCount} reviews)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/40 text-blue-400 font-bold">
                              Fit: {res.aiLeadFitScore}/100
                            </span>
                            <button
                              onClick={() => handleImportSingleScrape(res)}
                              className="px-2 py-1 rounded-lg bg-[#222] hover:bg-blue-600 hover:text-white text-gray-300 text-[10px] font-bold cursor-pointer transition-colors"
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!quickScrapeResults.length && (
                <div className="mt-4 p-3 rounded-xl bg-[#161616]/70 border border-[#242424] flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>Targeting Google Maps & Places API directory</span>
                  <span className="text-emerald-400 text-[11px] font-bold">Latency: 18ms</span>
                </div>
              )}
            </div>

            {/* Lead Acquisition Source Distribution (Col 5) */}
            <div className="lg:col-span-5 bg-[#111] border border-[#222] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Acquisition Channels</h3>
                    <p className="text-[11px] text-gray-500">Live breakdown across organic crawlers and ad webhooks</p>
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-950/40 border border-blue-500/30 px-2 py-0.5 rounded">
                    REAL-TIME
                  </span>
                </div>

                {/* Visual Distribution Bars */}
                <div className="space-y-3 font-mono text-xs">
                  {[
                    { label: 'Google Maps Places', count: channelCounts['Google Maps'], color: 'bg-blue-600', textCol: 'text-blue-400' },
                    { label: 'Meta Ads Webhooks', count: channelCounts['Meta Ads'], color: 'bg-rose-500', textCol: 'text-rose-400' },
                    { label: 'LinkedIn Lead Gen', count: channelCounts['LinkedIn Ads'], color: 'bg-indigo-500', textCol: 'text-indigo-400' },
                    { label: 'Social Media Crawlers', count: channelCounts['Social Scraper'] + channelCounts['Web Scraper'], color: 'bg-emerald-500', textCol: 'text-emerald-400' },
                  ].map((chan) => {
                    const pct = leads.length > 0 ? Math.round((chan.count / leads.length) * 100) : 0;
                    return (
                      <div key={chan.label} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-300">{chan.label}</span>
                          <span className={`${chan.textCol} font-bold`}>{chan.count} leads ({pct}%)</span>
                        </div>
                        <div className="w-full bg-[#202020] h-1.5 rounded-full overflow-hidden">
                          <div className={`${chan.color} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#222] flex items-center justify-between text-xs font-mono text-gray-400">
                <span>Total Active Pipeline: <strong className="text-white">{leads.length}</strong></span>
                <button
                  onClick={() => setActiveDashboardMode('pipeline')}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <span>Open Kanban</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION 2: INTERACTIVE PIPELINE KANBAN PREVIEW */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Interactive Pipeline Stage Funnel
                </h3>
                <p className="text-[11px] text-gray-500">
                  Track, advance, or call high-intent leads across all conversion stages
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={onDownloadCSV}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-[#222] text-emerald-400 border border-emerald-500/30 font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Kanban CSV</span>
                </button>
                <button
                  onClick={() => setActiveDashboardMode('pipeline')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer"
                >
                  <span>Full Kanban Board</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 5-Column Compact Interactive Stage Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
              {[
                { stage: 'new' as PipelineStage, title: 'New Leads', count: countNew, color: 'border-blue-500/40 bg-blue-950/20 text-blue-400' },
                { stage: 'enriched' as PipelineStage, title: 'AI Enriched', count: countEnriched, color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-400' },
                { stage: 'contacted' as PipelineStage, title: 'Contacted', count: countContacted, color: 'border-amber-500/40 bg-amber-950/20 text-amber-400' },
                { stage: 'meeting_scheduled' as PipelineStage, title: 'Booked Demo', count: countBooked, color: 'border-purple-500/40 bg-purple-950/20 text-purple-400' },
                { stage: 'closed_won' as PipelineStage, title: 'Closed Won', count: countWon, color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400' },
              ].map((col) => {
                const stageLeads = leads.filter(l => l.pipelineStage === col.stage);
                return (
                  <div key={col.stage} className="bg-[#161616] rounded-xl border border-[#262626] p-3 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${col.color}`}>
                          {col.title}
                        </span>
                        <span className="font-bold text-white text-xs">{col.count}</span>
                      </div>

                      <div className="mt-2.5 space-y-2 max-h-56 overflow-y-auto pr-0.5">
                        {stageLeads.slice(0, 3).map((lead) => (
                          <div
                            key={lead.id}
                            onClick={() => onSelectLead(lead)}
                            className="bg-[#111] p-2.5 rounded-lg border border-[#282828] hover:border-blue-500/60 transition-all cursor-pointer group space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white group-hover:text-blue-400 truncate text-[11px]">
                                {lead.name}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-bold">
                                ${((lead.dealValue || 0) / 1000).toFixed(0)}k
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-gray-500">
                              <span className="truncate">{lead.phone || 'No phone'}</span>
                              <span className="text-blue-400 font-bold">{lead.leadScore} pts</span>
                            </div>
                            <div className="pt-1 border-t border-[#222] flex items-center justify-between text-[9px] text-gray-400">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onLaunchDialerForLead(lead);
                                }}
                                className="flex items-center gap-0.5 text-rose-400 hover:text-rose-300 font-bold"
                              >
                                <PhoneCall className="w-2.5 h-2.5" /> Call
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectLead(lead, 'email');
                                }}
                                className="flex items-center gap-0.5 text-amber-400 hover:text-amber-300 font-bold"
                              >
                                <Mail className="w-2.5 h-2.5" /> Pitch
                              </button>
                            </div>
                          </div>
                        ))}

                        {stageLeads.length === 0 && (
                          <div className="text-center py-4 text-[10px] text-gray-600 italic">
                            No prospects in this stage
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveDashboardMode('pipeline')}
                      className="w-full text-center text-[10px] text-gray-500 hover:text-blue-400 font-bold pt-1 cursor-pointer"
                    >
                      View All ({stageLeads.length}) →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MIDDLE SECTION 3: AUTOMATION DIALER & AD WEBHOOK SIMULATION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Follow-up Sequences & Voice Dialer Quick Widget (Col 6) */}
            <div className="lg:col-span-6 bg-[#111] border border-[#222] rounded-2xl p-5 flex flex-col justify-between shadow-xl space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Outbound Voice Dialer</h3>
                      <p className="text-[11px] text-gray-500">AI simulated speech calls & pending follow-up queue</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveDashboardMode('automation')}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <span>Voice Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  {leads.slice(0, 3).map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-[#161616] p-3 rounded-xl border border-[#282828] flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-white">{lead.name}</div>
                        <div className="text-[11px] text-gray-400">{lead.contactPerson} • {lead.phone}</div>
                      </div>

                      <button
                        onClick={() => onLaunchDialerForLead(lead)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Launch Call</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#161616] border border-[#282828] flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Scheduled Email Cadence: <strong className="text-white">3-Step Drip Active</strong></span>
                <span className="text-emerald-400 font-bold">72% Open Rate</span>
              </div>
            </div>

            {/* Inbound Ad Campaigns & Webhook Ingestor (Col 6) */}
            <div className="lg:col-span-6 bg-[#111] border border-[#222] rounded-2xl p-5 flex flex-col justify-between shadow-xl space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Inbound Ad Campaigns</h3>
                      <p className="text-[11px] text-gray-500">Live webhook ingestors for Meta, Google & LinkedIn</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveDashboardMode('campaigns')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Ads</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  {campaigns.slice(0, 3).map((camp) => (
                    <div
                      key={camp.id}
                      className="bg-[#161616] p-3 rounded-xl border border-[#282828] flex items-center justify-between gap-3"
                    >
                      <div className="truncate">
                        <div className="font-bold text-white truncate">{camp.name}</div>
                        <div className="text-[10px] text-gray-400">
                          {camp.platform} • CPL: ${camp.cpl || 35} • Leads: {camp.leadsCount || 0}
                        </div>
                      </div>

                      <button
                        onClick={() => onSimulateWebhookLead(camp)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                        title="Simulate instant lead form submission from this campaign"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Simulate Lead</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#161616] border border-[#282828] flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Webhook Endpoints: <strong className="text-emerald-400">24/7 Active</strong></span>
                <span className="text-blue-400 font-bold">0% Drop Rate</span>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: COMPREHENSIVE CRM LEAD INGESTION LEDGER TABLE */}
          <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#222] bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#e0e0e0]">
                  Full CRM Lead Ingestion Ledger ({leads.length})
                </span>
              </div>

              {/* Table Controls */}
              <div className="flex items-center gap-2 text-xs">
                {/* Search */}
                <div className="flex items-center bg-[#111] px-3 py-1.5 rounded-xl border border-[#333] focus-within:border-blue-500">
                  <Search className="w-3.5 h-3.5 text-gray-500 mr-2" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Filter ledger..."
                    className="w-28 sm:w-40 bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none"
                  />
                </div>

                {/* Source Filter */}
                <select
                  value={selectedSourceFilter}
                  onChange={(e) => setSelectedSourceFilter(e.target.value)}
                  className="bg-[#111] border border-[#333] text-gray-300 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                >
                  <option value="all">All Sources</option>
                  <option value="google_maps">Google Maps</option>
                  <option value="meta_ads">Meta Ads</option>
                  <option value="google_ads">Google Ads</option>
                  <option value="linkedin_ads">LinkedIn Ads</option>
                </select>

                {/* Download CSV */}
                <button
                  id="ledger-download-csv-btn"
                  onClick={() => downloadLeadsCSV(tableFilteredLeads, `leadnexus_ledger_${new Date().toISOString().split('T')[0]}.csv`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 font-bold transition-colors cursor-pointer"
                  title="Download CSV of filtered ledger leads"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-[#0c0c0c] text-gray-500 border-b border-[#222] text-[11px] uppercase">
                    <th className="p-3.5">Business / Prospect</th>
                    <th className="p-3.5">Contact Person</th>
                    <th className="p-3.5">Phone & Email</th>
                    <th className="p-3.5">Source Channel</th>
                    <th className="p-3.5">Stage</th>
                    <th className="p-3.5">Lead Fit</th>
                    <th className="p-3.5 text-right">Deal Value</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202020]">
                  {tableFilteredLeads.slice(0, 8).map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="hover:bg-[#181818] transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 font-bold text-white">
                        <div className="hover:text-blue-400 transition-colors">{lead.name}</div>
                        <div className="text-[10px] text-gray-500 font-normal">{lead.website || 'No website'}</div>
                      </td>
                      <td className="p-3.5 text-gray-300">
                        <div>{lead.contactPerson || 'Practice Lead'}</div>
                        <div className="text-[10px] text-gray-500">{lead.title || 'Executive'}</div>
                      </td>
                      <td className="p-3.5 text-gray-300">
                        <div className="text-emerald-400 font-bold">{lead.phone || 'N/A'}</div>
                        <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{lead.email}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          lead.sourceChannel === 'google_maps' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                          lead.sourceChannel === 'meta_ads' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                          lead.sourceChannel === 'google_ads' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                        }`}>
                          {lead.sourceChannel.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-[10px] font-bold text-gray-300 uppercase px-2 py-0.5 rounded bg-[#202020]">
                          {lead.pipelineStage.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-blue-400 font-bold">{lead.leadScore}/100</span>
                      </td>
                      <td className="p-3.5 text-right font-bold text-emerald-400">
                        ${lead.dealValue?.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onLaunchDialerForLead(lead)}
                            className="p-1.5 rounded-lg bg-[#202020] hover:bg-rose-600 text-gray-300 hover:text-white transition-colors cursor-pointer"
                            title="Call with AI Voice Dialer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectLead(lead, 'email')}
                            className="p-1.5 rounded-lg bg-[#202020] hover:bg-amber-600 text-gray-300 hover:text-white transition-colors cursor-pointer"
                            title="Draft AI Pitch Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-[#0d0d0d] border-t border-[#222] flex items-center justify-between text-xs text-gray-400 font-mono">
              <span>Showing top {Math.min(8, tableFilteredLeads.length)} of {leads.length} records</span>
              <button
                onClick={() => setActiveDashboardMode('pipeline')}
                className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Manage in Full Pipeline Kanban</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
