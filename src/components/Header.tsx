import React, { useState } from 'react';
import { BarChart3, Download, Globe2, Home, Layers3, Mail, Megaphone, Menu, Plus, Search, X } from 'lucide-react';

interface HeaderProps {
  currentView: 'landing' | 'dashboard' | 'scraper' | 'pipeline' | 'automation' | 'campaigns';
  onNavigate: (view: 'landing' | 'dashboard' | 'scraper' | 'pipeline' | 'automation' | 'campaigns') => void;
  leadsCount: number;
  pendingFollowupsCount: number;
  onOpenNewLeadModal: () => void;
  onOpenQuickScrape?: () => void;
  onDownloadCSV?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onOpenProfile?: () => void;
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
  onOpenProfile,
}) => {
  const [internalSearch, setInternalSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const query = searchQuery || internalSearch;
  const setQuery = setSearchQuery || setInternalSearch;
  const navItems = [
    { id: 'dashboard' as const, label: 'Overview', icon: <BarChart3 size={15} /> },
    { id: 'scraper' as const, label: 'Lead finder', icon: <Globe2 size={15} />, badge: 'LIVE' },
    { id: 'pipeline' as const, label: 'Pipeline', icon: <Layers3 size={15} />, count: leadsCount },
    { id: 'automation' as const, label: 'Sequences', icon: <Mail size={15} />, count: pendingFollowupsCount || undefined },
    { id: 'campaigns' as const, label: 'Campaigns', icon: <Megaphone size={15} /> },
  ];

  return (
    <header className="workspace-header">
      <div className="workspace-header-inner">
        <button className="workspace-brand" onClick={() => onNavigate('landing')} title="Back to landing page">
          <span className="workspace-mark">O</span>
          <span>OmniBiz</span>
        </button>
        <button className="workspace-menu-toggle" style={{ backgroundColor: '#0F1C2E', borderColor: '#0F1C2E', color: '#FFFFFF' }} onClick={() => setIsMenuOpen((open) => !open)} aria-label={isMenuOpen ? 'Close workspace menu' : 'Open workspace menu'} aria-expanded={isMenuOpen}>{isMenuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        <nav className={`workspace-nav${isMenuOpen ? ' is-open' : ''}`} aria-label="Workspace navigation">
          <button className={currentView === 'landing' ? 'active' : ''} onClick={() => { onNavigate('landing'); setIsMenuOpen(false); }}><Home size={15} /><span>Home</span></button>
          {navItems.map((item) => <button key={item.id} className={currentView === item.id ? 'active' : ''} onClick={() => { onNavigate(item.id); setIsMenuOpen(false); }}>{item.icon}<span>{item.label}</span>{item.badge && <b className="workspace-live">{item.badge}</b>}{item.count !== undefined && <b className="workspace-count">{item.count}</b>}</button>)}
        </nav>
        <div className="workspace-actions">
          <label className="workspace-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads" /></label>
          {onDownloadCSV && <button className="workspace-icon-action" onClick={onDownloadCSV} title="Export CSV"><Download size={15} /></button>}
          <button className="workspace-scrape" onClick={onOpenQuickScrape ? onOpenQuickScrape : () => onNavigate('scraper')}><Globe2 size={15} /> <span>Scrape</span></button>
          <button className="workspace-add" onClick={onOpenNewLeadModal}><Plus size={15} /> <span>Add</span></button>
          <button className="workspace-profile" onClick={onOpenProfile} title="Open profile">AS</button>
        </div>
      </div>
    </header>
  );
};
