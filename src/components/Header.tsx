import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  BarChart3, 
  Mail, 
  Megaphone, 
  Plus, 
  Search, 
  Globe, 
  MapPin, 
  TrendingUp,
  Activity,
  Zap,
  Download,
  Sparkles,
  Home
} from 'lucide-react';
import { Lead } from '../types';

interface HeaderProps {
  currentView: 'landing' | 'dashboard' | 'scraper' | 'pipeline' | 'automation' | 'campaigns';
  onNavigate: (view: 'landing' | 'dashboard' | 'scraper' | 'pipeline' | 'automation' | 'campaigns') => void;
  leadsCount: number;
  pendingFollowupsCount: number;
  onOpenNewLeadModal: () => void;
  onOpenQuickScrape?: () => void;
  onDownloadCSV?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  leadsCount,
  pendingFollowupsCount,
  onOpenNewLeadModal,
  onOpenQuickScrape,
  onDownloadCSV,
  searchQuery = '',
  setSearchQuery,
}) => {
  const [internalSearch, setInternalSearch] = useState('');
  const query = searchQuery || internalSearch;
  const setQuery = setSearchQuery || setInternalSearch;

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a] border-b border-[#222] text-[#e0e0e0] shadow-2xl">
      {/* Top Telemetry Ticker */}
      <div className="bg-[#050505] px-4 sm:px-8 py-1.5 border-b border-[#222] text-[11px] flex items-center justify-between font-mono">
        <div className="flex items-center gap-4 overflow-x-auto text-gray-400 whitespace-nowrap scrollbar-none">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="tracking-widest uppercase">System Status: Optimal</span>
          </div>
          <span className="text-[#333]">|</span>
          <div className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Leads: <strong className="text-white font-bold">{leadsCount}</strong></span>
          </div>
          <span className="text-[#333]">|</span>
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Scraping Rate: <strong className="text-amber-300">48.2/min</strong></span>
          </div>
          <span className="text-[#333]">|</span>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>API Latency: <strong className="text-blue-300">24ms</strong></span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 text-gray-400">
          <button
            onClick={() => onNavigate('landing')}
            className="px-2 py-0.5 rounded bg-blue-950/40 text-blue-400 text-[10px] font-bold border border-blue-500/30 hover:bg-blue-900/50 cursor-pointer flex items-center gap-1"
          >
            <Home className="w-3 h-3" />
            <span>LANDING PAGE</span>
          </button>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">
            UTC {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Main Bento Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => onNavigate('landing')}
            title="View Landing Page"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30 text-base">
              Ω
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  LeadNexus
                </h1>
                <span className="text-blue-500 font-medium text-xs px-2 py-0.5 border border-blue-500/30 rounded bg-blue-950/30">
                  PRO
                </span>
              </div>
            </div>
          </div>

          {/* Bento Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#111] p-1.5 rounded-xl border border-[#222]">
            <button
              id="nav-tab-landing"
              onClick={() => onNavigate('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Landing</span>
            </button>

            <button
              id="nav-tab-dashboard"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              id="nav-tab-scraper"
              onClick={() => onNavigate('scraper')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentView === 'scraper'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scraper</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                LIVE
              </span>
            </button>

            <button
              id="nav-tab-pipeline"
              onClick={() => onNavigate('pipeline')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentView === 'pipeline'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Kanban</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#222] text-gray-300 font-mono">
                {leadsCount}
              </span>
            </button>

            <button
              id="nav-tab-automation"
              onClick={() => onNavigate('automation')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentView === 'automation'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              <span>Dialer & Drips</span>
              {pendingFollowupsCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            <button
              id="nav-tab-campaigns"
              onClick={() => onNavigate('campaigns')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentView === 'campaigns'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Ad Campaigns</span>
            </button>
          </nav>

          {/* Search Pill & User Profile Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden xl:flex items-center bg-[#151515] px-3 py-1.5 rounded-full border border-[#333] focus-within:border-blue-500 transition-colors w-48">
              <input
                id="global-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search leads..."
                className="w-full bg-transparent border-none text-xs text-[#e0e0e0] placeholder-gray-600 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            </div>

            {onDownloadCSV && (
              <button
                id="header-download-csv-btn"
                onClick={onDownloadCSV}
                className="hidden sm:flex items-center gap-1 bg-[#161616] hover:bg-[#202020] text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono"
                title="Export all leads to CSV file"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">CSV</span>
              </button>
            )}

            <button
              id="quick-scrape-btn"
              onClick={onOpenQuickScrape ? onOpenQuickScrape : () => onNavigate('scraper')}
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer uppercase tracking-wider text-[11px]"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Scrape</span>
            </button>

            <button
              id="add-manual-lead-btn"
              onClick={onOpenNewLeadModal}
              className="flex items-center gap-1 bg-[#161616] hover:bg-[#202020] text-gray-200 border border-[#2e2e2e] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Lead</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-[#222]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                AS
              </div>
              <span className="text-xs font-medium text-gray-300 hidden xl:inline">Alex Sterling</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden overflow-x-auto gap-2 py-2 border-t border-[#222] text-xs scrollbar-none font-mono">
          {[
            { id: 'landing', label: 'Landing Page', icon: Home },
            { id: 'dashboard', label: 'Overview', icon: BarChart3 },
            { id: 'scraper', label: 'Scraper Engine', icon: Globe },
            { id: 'pipeline', label: `Kanban (${leadsCount})`, icon: Layers },
            { id: 'automation', label: 'Follow-ups & Calls', icon: Mail },
            { id: 'campaigns', label: 'Ad Channels', icon: Megaphone },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#111] text-gray-400 border border-[#222]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

