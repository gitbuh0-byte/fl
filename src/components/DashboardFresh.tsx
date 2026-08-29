import React, { useState } from 'react';
import { Activity, ArrowRight, Check, DollarSign, Download, Globe2, Layers3, Mail, Megaphone, PhoneCall, Play, Plus, Search, Target, Users, Zap } from 'lucide-react';
import { Lead, Campaign, EmailCadence, FollowUpTask, PipelineStage } from '../types';
import { downloadLeadsCSV } from '../utils/csvExport';
import { ScraperWorkbench } from './ScraperWorkbench';
import { PipelineKanban } from './PipelineKanban';
import { AutomationSequences } from './AutomationSequences';
import { CampaignsManager } from './CampaignsManager';

interface DashboardFreshProps {
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
  onCreateTask: (task: FollowUpTask) => void;
  onRescheduleTask: (taskId: string, dueDate: string) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleCampaignStatus: (campaignId: string) => void;
  onCreateCampaign: (campaign: Campaign) => void;
  onSimulateWebhookLead: (campaign: Campaign) => void;
  onDownloadCSV: () => void;
  onNavigateToView?: (view: 'scraper' | 'pipeline' | 'automation' | 'campaigns') => void;
}

type DashboardMode = 'overview' | 'scraper' | 'pipeline' | 'automation' | 'campaigns';

export const DashboardFresh: React.FC<DashboardFreshProps> = (props) => {
  const [mode, setMode] = useState<DashboardMode>('overview');
  const [search, setSearch] = useState('');
  const { leads, campaigns, emailCadences, followUpTasks } = props;
  const highIntent = leads.filter((lead) => lead.leadScore >= 90).length;
  const wonDeals = leads.filter((lead) => lead.pipelineStage === 'closed_won');
  const pipelineValue = leads.reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
  const openTasks = followUpTasks.filter((task) => !task.completed);
  const visibleLeads = leads.filter((lead) => `${lead.name} ${lead.contactPerson || ''} ${lead.email}`.toLowerCase().includes(search.toLowerCase())).slice(0, 6);
  const conversionRate = leads.length ? Math.round((wonDeals.length / leads.length) * 100) : 0;
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'active').length;

  const renderMode = () => {
    if (mode === 'scraper') return <ScraperWorkbench onImportLead={props.onImportLead} onBatchImportLeads={props.onBatchImportLeads} existingLeads={leads} />;
    if (mode === 'pipeline') return <PipelineKanban leads={leads} onSelectLead={props.onSelectLead} onUpdateLeadStage={props.onUpdateLeadStage} onOpenNewLeadModal={props.onOpenNewLeadModal} onLaunchDialerForLead={props.onLaunchDialerForLead} />;
    if (mode === 'automation') return <AutomationSequences emailCadences={emailCadences} followUpTasks={followUpTasks} leads={leads} onCompleteTask={props.onCompleteTask} onCreateTask={props.onCreateTask} onRescheduleTask={props.onRescheduleTask} onDeleteTask={props.onDeleteTask} onSelectLeadById={(id) => { const lead = leads.find((item) => item.id === id); if (lead) props.onSelectLead(lead); }} onLaunchDialerForLead={props.onLaunchDialerForLead} />;
    if (mode === 'campaigns') return <CampaignsManager campaigns={campaigns} onToggleCampaignStatus={props.onToggleCampaignStatus} onCreateCampaign={props.onCreateCampaign} onSimulateWebhookLead={props.onSimulateWebhookLead} />;

    return (
      <>
        <section className="fresh-metrics">
          <div className="fresh-metric"><span><Users size={16} /> Active leads</span><strong>{leads.length}</strong><small><b>{conversionRate}%</b> closed won</small></div>
          <div className="fresh-metric"><span><Target size={16} /> High intent</span><strong>{highIntent}</strong><small>Ready for a first touch</small></div>
          <div className="fresh-metric"><span><DollarSign size={16} /> Pipeline value</span><strong>${(pipelineValue / 1000).toFixed(1)}k</strong><small><b>${(wonDeals.reduce((sum, lead) => sum + lead.dealValue, 0) / 1000).toFixed(1)}k</b> won</small></div>
          <div className="fresh-metric"><span><Zap size={16} /> Follow-ups</span><strong>{openTasks.length}</strong><small>Tasks waiting today</small></div>
        </section>

        <section className="fresh-grid">
          <div className="fresh-panel action-panel">
            <div className="fresh-panel-heading"><div><span className="fresh-kicker">Next best action</span><h2>Find your next conversation.</h2><p>Start with a market, then let OmniBiz build the context around it.</p></div><span className="fresh-panel-icon"><Globe2 size={20} /></span></div>
            <div className="fresh-action-row"><div><small>Target market</small><strong>Cosmetic dental clinics</strong></div><div><small>Location</small><strong>Austin, TX</strong></div><button className="fresh-orange-button" onClick={() => setMode('scraper')}><Play size={14} fill="currentColor" /> Find leads</button></div>
            <div className="fresh-signal"><span className="signal-dot" /> Lead finder ready <span>{activeCampaigns} active campaign sources</span><b>{openTasks.length} follow-ups</b></div>
          </div>
          <div className="fresh-panel focus-panel"><div className="fresh-panel-heading"><div><span className="fresh-kicker">Today's focus</span><h2>Keep the momentum.</h2></div><span className="fresh-panel-icon dark-icon"><Check size={19} /></span></div><div className="focus-progress"><div><strong>{Math.min(openTasks.length, 3)} of 5</strong><span>priority tasks done</span></div><div className="progress-track"><i style={{ width: `${Math.min((Math.max(openTasks.length, 2) / 5) * 100, 100)}%` }} /></div></div><button className="fresh-text-button" onClick={() => setMode('automation')}>Open follow-up queue <ArrowRight size={14} /></button></div>
        </section>

        <section className="fresh-lower-grid">
          <div className="fresh-panel lead-panel"><div className="fresh-panel-heading compact-heading"><div><span className="fresh-kicker">Recent movement</span><h2>Leads worth a look.</h2></div><button className="fresh-text-button" onClick={() => setMode('pipeline')}>View pipeline <ArrowRight size={14} /></button></div><div className="fresh-table-tools"><div className="fresh-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search leads" /></div><button className="fresh-icon-action" onClick={props.onDownloadCSV} title="Download CSV"><Download size={15} /></button><button className="fresh-icon-action" onClick={props.onOpenNewLeadModal} title="Add lead"><Plus size={15} /></button></div><div className="fresh-lead-list">{visibleLeads.map((lead) => <button className="fresh-lead-row" key={lead.id} onClick={() => props.onSelectLead(lead)}><span className="fresh-lead-avatar">{lead.name.slice(0, 1)}</span><span className="fresh-lead-name"><b>{lead.name}</b><small>{lead.contactPerson || 'New prospect'} · {lead.sourceChannel.replace('_', ' ')}</small></span><span className="fresh-lead-score">{lead.leadScore}<small>fit</small></span><span className="fresh-lead-value">${((lead.dealValue || 0) / 1000).toFixed(0)}k</span><ArrowRight size={14} /></button>)}{visibleLeads.length === 0 && <div className="fresh-empty">No leads match that search.</div>}</div></div>
          <div className="fresh-panel channel-panel"><div className="fresh-panel-heading compact-heading"><div><span className="fresh-kicker">Acquisition mix</span><h2>Where leads come from.</h2></div></div>{[['Google Maps', 'google_maps', '#0F1C2E'], ['Meta Ads', 'meta_ads', '#3d5d7d'], ['Social scraper', 'social_scrape', '#168454'], ['Web scrape', 'web_scrape', '#5b8bb8']].map(([label, source, color]) => { const count = leads.filter((lead) => lead.sourceChannel === source).length; const width = `${leads.length ? Math.max((count / leads.length) * 100, count ? 9 : 0) : 0}%`; return <div className="fresh-channel" key={source}><div><span>{label}</span><b>{count}</b></div><div className="fresh-channel-track"><i style={{ width, background: color }} /></div></div>; })}<div className="fresh-channel-footer"><span><span className="status-dot" /> {activeCampaigns} active campaign sources</span><button className="fresh-text-button" onClick={() => setMode('campaigns')}>Manage sources <ArrowRight size={14} /></button></div></div>
        </section>
      </>
    );
  };

  return <div className="fresh-dashboard"><div className="fresh-dashboard-top"><div><span className="fresh-kicker">Your sales workspace</span><h1>Your command center.</h1><p>Find people to talk to, keep track of every opportunity, and know what to do next.</p></div></div><section className="fresh-start-guide" aria-label="Getting started guide"><div className="fresh-guide-intro"><span className="fresh-kicker">A simple way to get started</span><strong>Three steps from prospect to conversation.</strong></div><div className="fresh-guide-step"><span>1</span><div><b>Find leads</b><small>Search for new prospects</small></div></div><ArrowRight size={15} className="fresh-guide-arrow" /><div className="fresh-guide-step"><span>2</span><div><b>Review your pipeline</b><small>See who needs attention</small></div></div><ArrowRight size={15} className="fresh-guide-arrow" /><div className="fresh-guide-step"><span>3</span><div><b>Follow up</b><small>Send a message or make a call</small></div></div></section>{renderMode()}</div>;
};
