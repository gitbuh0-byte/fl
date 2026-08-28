import React, { useState } from 'react';
import { 
  Megaphone, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Plus, 
  ExternalLink, 
  Play, 
  Pause, 
  Radio, 
  Layers, 
  CheckCircle2, 
  Copy, 
  BarChart3,
  Globe
} from 'lucide-react';
import { Campaign } from '../types';

interface CampaignsManagerProps {
  campaigns: Campaign[];
  onToggleCampaignStatus: (campaignId: string) => void;
  onCreateCampaign: (campaign: Campaign) => void;
  onSimulateWebhookLead: (campaign: Campaign) => void;
}

export const CampaignsManager: React.FC<CampaignsManagerProps> = ({
  campaigns,
  onToggleCampaignStatus,
  onCreateCampaign,
  onSimulateWebhookLead,
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // New campaign form state
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<'meta_ads' | 'google_ads' | 'linkedin_ads' | 'tiktok_ads'>('meta_ads');
  const [budget, setBudget] = useState(3000);
  const [targetAudience, setTargetAudience] = useState('Dental Clinic Owners & Practice Managers');
  const [objective, setObjective] = useState('High-Intent Phone & Email Form Submissions');

  const totalSpend = campaigns.reduce((sum, c) => sum + (c.spend ?? (c as any).spent ?? 0), 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.leadsCount ?? (c as any).leadsGenerated ?? 0), 0);
  const avgCPL = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const totalPipelineRevenue = campaigns.reduce((sum, c) => sum + (c.revenue ?? (c as any).pipelineRevenue ?? 0), 0);

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText('https://omnilead-crm.internal/api/campaigns/webhook');
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newCamp: Campaign = {
      id: `camp_${Date.now()}`,
      name,
      platform,
      status: 'active',
      budget,
      spend: 0,
      leadsCount: 0,
      cpl: 0,
      revenue: 0,
      targetAudience,
      objective,
      utmSource: platform.replace('_', '-'),
      utmMedium: 'cpc',
      utmCampaign: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateCampaign(newCamp);
    setShowNewModal(false);
    setName('');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Bento Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <span>Ad Campaigns & Inbound Channels</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Track lead costs (CPL), ROI, and instant webhook ingestors across Meta, Google Ads, LinkedIn & TikTok.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={handleCopyWebhook}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111] border border-[#222] hover:bg-[#1a1a1a] text-xs font-semibold text-gray-300 transition-colors cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <span>{copiedWebhook ? 'Webhook Copied!' : 'Copy Webhook URL'}</span>
          </button>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111] p-5 rounded-2xl border border-[#222] shadow-xl space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Total Ad Spend</span>
          <p className="text-2xl font-bold text-white font-mono">${totalSpend.toLocaleString()}</p>
          <span className="text-[11px] text-gray-400 font-mono">Across 4 ad channels</span>
        </div>

        <div className="bg-[#111] p-5 rounded-2xl border border-[#222] shadow-xl space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Inbound Leads</span>
          <p className="text-2xl font-bold text-blue-400 font-mono">{totalLeads}</p>
          <span className="text-[11px] text-emerald-400 font-mono">+24.5% vs last cycle</span>
        </div>

        <div className="bg-[#111] p-5 rounded-2xl border border-[#222] shadow-xl space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Average CPL</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono">${avgCPL.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-400 font-mono">-12% acquisition cost</span>
        </div>

        <div className="bg-[#111] p-5 rounded-2xl border border-[#222] shadow-xl space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Pipeline Revenue</span>
          <p className="text-2xl font-bold text-white font-mono">${totalPipelineRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-blue-400 font-mono">{(totalPipelineRevenue / (totalSpend || 1)).toFixed(1)}x ROAS Ratio</span>
        </div>
      </div>

      {/* Campaigns Table & Management Bento Card */}
      <div className="bg-[#111] rounded-2xl border border-[#222] shadow-xl overflow-hidden">
        <div className="p-5 border-b border-[#222] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Active Marketing Campaigns & Ingestors</h2>
          <span className="text-xs font-mono text-gray-400">{campaigns.length} Integrated Channels</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141414] text-gray-400 font-bold uppercase tracking-wider border-b border-[#222] font-mono">
              <tr>
                <th className="p-4">Campaign Name & Objective</th>
                <th className="p-4">Platform</th>
                <th className="p-4">Status</th>
                <th className="p-4">Budget / Spent</th>
                <th className="p-4">Leads</th>
                <th className="p-4">CPL</th>
                <th className="p-4">Pipeline Value</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-[#161616] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{camp.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{camp.objective}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-1">
                      UTM: ?utm_source={camp.utmSource}&utm_campaign={camp.utmCampaign}
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase font-mono bg-[#1a1a1a] text-blue-400 border border-[#2e2e2e]">
                      {camp.platform.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="p-4 font-mono">
                    <button
                      onClick={() => onToggleCampaignStatus(camp.id)}
                      className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer ${
                        camp.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-[#222] text-gray-400 border border-[#333]'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${camp.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
                      <span>{camp.status === 'active' ? 'Active' : 'Paused'}</span>
                    </button>
                  </td>

                  <td className="p-4 font-mono">
                    <div className="text-white font-bold">${((camp.spend ?? (camp as any).spent) || 0).toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500">of ${camp.budget.toLocaleString()}</div>
                  </td>

                  <td className="p-4 font-mono font-bold text-blue-400 text-sm">
                    {(camp.leadsCount ?? (camp as any).leadsGenerated) || 0}
                  </td>

                  <td className="p-4 font-mono font-bold text-emerald-400">
                    ${camp.cpl ? camp.cpl.toFixed(2) : '0.00'}
                  </td>

                  <td className="p-4 font-mono font-bold text-gray-200">
                    ${((camp.revenue ?? (camp as any).pipelineRevenue) || 0).toLocaleString()}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => onSimulateWebhookLead(camp)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer font-mono"
                    >
                      Simulate Lead
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Campaign */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111] border border-[#222] w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">Connect New Ad Campaign Ingestor</h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 High Intent Dental Retargeting"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Ad Network</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="meta_ads">Meta Lead Ads (FB & IG)</option>
                    <option value="google_ads">Google Search & Local Ads</option>
                    <option value="linkedin_ads">LinkedIn Lead Gen Forms</option>
                    <option value="tiktok_ads">TikTok Instant Forms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Monthly Budget ($)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Target Audience Persona</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#222] text-gray-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md cursor-pointer uppercase tracking-wider"
                >
                  Create & Generate Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
