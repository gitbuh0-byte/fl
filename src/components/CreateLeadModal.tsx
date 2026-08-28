import React, { useState } from 'react';
import { X, Plus, Building2, User, Mail, Phone, Globe, DollarSign, MapPin } from 'lucide-react';
import { Lead, LeadSource, PipelineStage } from '../types';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLead: (lead: Lead) => void;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({
  isOpen,
  onClose,
  onCreateLead,
}) => {
  if (!isOpen) return null;

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [sourceChannel, setSourceChannel] = useState<LeadSource>('google_maps');
  const [dealValue, setDealValue] = useState(15000);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) return;

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      name: companyName,
      contactPerson: contactPerson || 'Decision Maker',
      title: title || 'Owner',
      email: email || `contact@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: phone || '+1 (555) 000-0000',
      website: website ? (website.startsWith('http') ? website : `https://${website}`) : 'https://example.com',
      address: address || 'Austin, TX',
      socialHandles: {},
      sourceChannel,
      sourceDetails: {
        searchKeyword: 'Direct Entry',
        cpl: 0,
      },
      pipelineStage: 'new',
      dealValue: Number(dealValue) || 12000,
      leadScore: 85,
      intentLevel: 'Medium',
      tags: ['Manual Entry', 'Direct Prospect'],
      notes: notes || 'Directly added to OmniLead CRM.',
      assignedTo: 'Sarah Connor',
      createdAt: new Date().toISOString(),
      emailSequenceStatus: 'idle',
      callStatus: 'not_called',
      activityTimeline: [
        {
          id: `act_${Date.now()}`,
          type: 'ingested',
          title: 'Lead Created Manually in CRM',
          description: `Initialized with deal value $${Number(dealValue).toLocaleString()}.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    onCreateLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111] border border-[#222] w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#222] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">Create CRM Prospect</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-gray-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
          <div>
            <label className="block font-bold text-gray-300 mb-1">Company / Business Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Health Partners"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-300 mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Dr. Emily Thorne"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-300 mb-1">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Managing Partner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-300 mb-1">Verified Phone</label>
              <input
                type="text"
                placeholder="+1 (512) 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="emily@apexhealth.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-300 mb-1">Website URL</label>
              <input
                type="text"
                placeholder="https://apexhealth.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-300 mb-1">Source Channel</label>
              <select
                value={sourceChannel}
                onChange={(e) => setSourceChannel(e.target.value as any)}
                className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="google_maps">Google Maps</option>
                <option value="meta_ads">Meta Ads</option>
                <option value="google_ads">Google Ads</option>
                <option value="linkedin_ads">LinkedIn Ads</option>
                <option value="tiktok_ads">TikTok Ads</option>
                <option value="social_scrape">Social Scraper</option>
                <option value="web_scrape">Web Scraper</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-300 mb-1">Estimated Deal Value ($ USD)</label>
            <input
              type="number"
              value={dealValue}
              onChange={(e) => setDealValue(Number(e.target.value))}
              className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#222] text-gray-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30 cursor-pointer uppercase tracking-wider"
            >
              Add to CRM Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
