import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Layers, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  DollarSign, 
  Sparkles, 
  Flame, 
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  Search, 
  Plus, 
  Download,
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Video, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { Lead, PipelineStage, LeadSource } from '../types';
import { downloadLeadsCSV } from '../utils/csvExport';

interface PipelineKanbanProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateLeadStage: (leadId: string, newStage: PipelineStage) => void;
  onOpenNewLeadModal: () => void;
  onLaunchDialerForLead: (lead: Lead) => void;
}

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({
  leads,
  onSelectLead,
  onUpdateLeadStage,
  onOpenNewLeadModal,
  onLaunchDialerForLead,
}) => {
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const STAGES: { id: PipelineStage; label: string; dotColor: string }[] = [
    { id: 'new', label: 'New Ingested', dotColor: 'bg-blue-400' },
    { id: 'enriched', label: 'AI Enriched', dotColor: 'bg-indigo-400' },
    { id: 'contacted', label: 'Contacted', dotColor: 'bg-cyan-400' },
    { id: 'meeting_scheduled', label: 'Demo Booked', dotColor: 'bg-purple-400' },
    { id: 'proposal_sent', label: 'Proposal Sent', dotColor: 'bg-amber-400' },
    { id: 'negotiation', label: 'Negotiation', dotColor: 'bg-orange-400' },
    { id: 'closed_won', label: 'Closed Won', dotColor: 'bg-emerald-400' },
    { id: 'closed_lost', label: 'Closed Lost', dotColor: 'bg-rose-400' },
  ];

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    if (selectedChannelFilter !== 'all' && lead.sourceChannel !== selectedChannelFilter) {
      return false;
    }
    if (scoreFilter === 'high' && lead.leadScore < 90) return false;
    if (scoreFilter === 'medium' && (lead.leadScore < 75 || lead.leadScore >= 90)) return false;
    if (localSearch) {
      const q = localSearch.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        (lead.contactPerson && lead.contactPerson.toLowerCase().includes(q)) ||
        (lead.phone && lead.phone.includes(q)) ||
        (lead.website && lead.website.toLowerCase().includes(q)) ||
        (lead.tags && lead.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  const handleStageChange = (lead: Lead, newStage: PipelineStage) => {
    onUpdateLeadStage(lead.id, newStage);
    if (newStage === 'closed_won') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const getNextStage = (current: PipelineStage): PipelineStage | null => {
    const order: PipelineStage[] = [
      'new',
      'enriched',
      'contacted',
      'meeting_scheduled',
      'proposal_sent',
      'negotiation',
      'closed_won',
    ];
    const idx = order.indexOf(current);
    if (idx !== -1 && idx < order.length - 1) {
      return order[idx + 1];
    }
    return null;
  };

  const getPrevStage = (current: PipelineStage): PipelineStage | null => {
    const order: PipelineStage[] = [
      'new',
      'enriched',
      'contacted',
      'meeting_scheduled',
      'proposal_sent',
      'negotiation',
      'closed_won',
    ];
    const idx = order.indexOf(current);
    if (idx > 0) {
      return order[idx - 1];
    }
    return null;
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Filter Bar - Bento Card */}
      <div className="bg-[#111] rounded-2xl p-4 border border-[#222] shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter by company, contact, phone..."
              className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Channel Filter */}
          <div className="flex items-center gap-1 bg-[#151515] p-1 rounded-xl border border-[#2a2a2a] text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-gray-500 ml-1.5" />
            <select
              value={selectedChannelFilter}
              onChange={(e) => setSelectedChannelFilter(e.target.value)}
              className="bg-transparent text-gray-300 text-xs focus:outline-none px-2 py-0.5"
            >
              <option value="all">All Channels</option>
              <option value="google_maps">Google Maps</option>
              <option value="meta_ads">Meta Ads</option>
              <option value="google_ads">Google Ads</option>
              <option value="linkedin_ads">LinkedIn Ads</option>
              <option value="tiktok_ads">TikTok Ads</option>
              <option value="social_scrape">Social Scraper</option>
              <option value="web_scrape">Web Scraper</option>
            </select>
          </div>

          {/* Score Filter */}
          <div className="flex items-center gap-1 bg-[#151515] p-1 rounded-xl border border-[#2a2a2a] text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-blue-400 ml-1.5" />
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="bg-transparent text-gray-300 text-xs focus:outline-none px-2 py-0.5"
            >
              <option value="all">All Scores</option>
              <option value="high">High Intent (90+)</option>
              <option value="medium">Medium Intent (75-89)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs text-gray-500 font-mono hidden md:inline">
            Showing <strong className="text-blue-400">{filteredLeads.length}</strong> of {leads.length} leads
          </span>

          <button
            id="kanban-download-csv-btn"
            onClick={() => downloadLeadsCSV(filteredLeads, `leadnexus_kanban_export_${new Date().toISOString().split('T')[0]}.csv`)}
            className="flex items-center gap-1.5 bg-[#181818] hover:bg-[#222] text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-mono shadow-sm"
            title="Download CSV of current pipeline leads"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={onOpenNewLeadModal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 cursor-pointer font-mono uppercase tracking-wider transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Prospect</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scrolling Canvas */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-[#222]">
        {STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.pipelineStage === stage.id);
          const stageValue = stageLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

          return (
            <div
              key={stage.id}
              className="w-80 shrink-0 bg-[#111] rounded-2xl border border-[#222] flex flex-col max-h-[calc(100vh-220px)] shadow-xl"
            >
              {/* Stage Header */}
              <div className="p-3.5 border-b border-[#222] flex items-center justify-between bg-[#141414] rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.dotColor}`} />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">{stage.label}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#1f1f1f] text-gray-400 font-mono font-bold">
                    {stageLeads.length}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-gray-300">
                  ${stageValue.toLocaleString()}
                </span>
              </div>

              {/* Stage Cards List */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#222]">
                {stageLeads.length === 0 ? (
                  <div className="h-32 border border-dashed border-[#262626] rounded-xl flex items-center justify-center text-xs text-gray-600 font-mono">
                    Empty Stage
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const next = getNextStage(lead.pipelineStage);
                    const prev = getPrevStage(lead.pipelineStage);

                    return (
                      <div
                        key={lead.id}
                        onClick={() => onSelectLead(lead)}
                        className="bg-[#161616] hover:bg-[#1a1a1a] rounded-xl p-3.5 border border-[#262626] hover:border-blue-500/50 shadow-md transition-all cursor-pointer group space-y-2.5 relative"
                      >
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono bg-[#222] text-gray-300 border border-[#333]">
                                {lead.sourceChannel === 'google_maps' ? 'Google Maps' :
                                 lead.sourceChannel === 'meta_ads' ? 'Meta Ads' :
                                 lead.sourceChannel === 'google_ads' ? 'Google Ads' :
                                 lead.sourceChannel === 'linkedin_ads' ? 'LinkedIn Ads' :
                                 'Social Scraper'}
                              </span>

                              {lead.rating && (
                                <span className="text-[10px] bg-amber-500/10 text-amber-300 px-1 py-0.2 rounded font-mono font-bold">
                                  ★ {lead.rating}
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors mt-1.5 truncate">
                              {lead.name}
                            </h4>
                            <p className="text-[11px] text-gray-400 truncate">
                              {lead.contactPerson || 'Decision Maker'} {lead.title && `• ${lead.title}`}
                            </p>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="text-xs font-mono font-bold text-emerald-400">
                              ${lead.dealValue ? lead.dealValue.toLocaleString() : '0'}
                            </span>
                            <span className="text-[10px] font-mono text-blue-400 font-semibold mt-0.5">
                              {lead.leadScore}/100
                            </span>
                          </div>
                        </div>

                        {/* Verified Contacts Strip */}
                        <div className="bg-[#111] p-2 rounded-lg text-[11px] space-y-1 border border-[#222]">
                          {lead.phone && (
                            <div className="flex items-center justify-between text-gray-300 font-mono">
                              <span className="flex items-center gap-1 text-gray-500">
                                <Phone className="w-3 h-3 text-emerald-400" />
                              </span>
                              <span className="text-emerald-400 text-[10px] font-bold">{lead.phone}</span>
                            </div>
                          )}

                          {lead.website && (
                            <div className="flex items-center justify-between text-gray-300 font-mono">
                              <span className="flex items-center gap-1 text-gray-500">
                                <Globe className="w-3 h-3 text-blue-400" />
                              </span>
                              <span className="truncate text-blue-400 text-[10px] max-w-[140px]">
                                {lead.website.replace(/^https?:\/\//, '')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Social Handles Chips */}
                        {lead.socialHandles && Object.keys(lead.socialHandles).length > 0 && (
                          <div className="flex items-center gap-1 text-[10px]">
                            {lead.socialHandles.linkedin && (
                              <span className="p-1 rounded bg-blue-600/20 text-blue-400" title="LinkedIn">
                                <Linkedin className="w-3 h-3" />
                              </span>
                            )}
                            {lead.socialHandles.instagram && (
                              <span className="p-1 rounded bg-pink-600/20 text-pink-400" title="Instagram">
                                <Instagram className="w-3 h-3" />
                              </span>
                            )}
                            {lead.socialHandles.twitter && (
                              <span className="p-1 rounded bg-[#222] text-blue-400" title="Twitter/X">
                                <Twitter className="w-3 h-3" />
                              </span>
                            )}
                            {lead.socialHandles.facebook && (
                              <span className="p-1 rounded bg-blue-800/20 text-blue-400" title="Facebook">
                                <Facebook className="w-3 h-3" />
                              </span>
                            )}
                            {lead.socialHandles.tiktok && (
                              <span className="p-1 rounded bg-purple-600/20 text-purple-400" title="TikTok">
                                <Video className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        )}

                        {/* Follow up due badge */}
                        {lead.followUpDue && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/40 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>Follow-up Due: Today</span>
                          </div>
                        )}

                        {/* Card Footer Quick Actions */}
                        <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-xs font-mono">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onLaunchDialerForLead(lead);
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-[10px] font-bold border border-blue-500/30 cursor-pointer"
                          >
                            <Phone className="w-3 h-3" />
                            <span>AI Dial</span>
                          </button>

                          {/* Quick Move Stage Buttons */}
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {prev && (
                              <button
                                title={`Move back to ${prev}`}
                                onClick={() => handleStageChange(lead, prev)}
                                className="p-1 rounded bg-[#222] hover:bg-[#333] text-gray-400 hover:text-white transition-colors cursor-pointer"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}

                            {next && (
                              <button
                                title={`Advance to ${next}`}
                                onClick={() => handleStageChange(lead, next)}
                                className="flex items-center gap-0.5 px-2 py-1 rounded bg-[#222] hover:bg-blue-600 hover:text-white text-gray-300 text-[10px] font-semibold border border-[#333] transition-colors cursor-pointer"
                              >
                                <span>Advance</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}

                            {lead.pipelineStage !== 'closed_won' && (
                              <button
                                title="Mark as Won"
                                onClick={() => handleStageChange(lead, 'closed_won')}
                                className="p-1 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 transition-colors cursor-pointer border border-emerald-500/30"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
