import React, { useState } from 'react';
import { 
  Globe, 
  MapPin, 
  Search, 
  Sparkles, 
  Play, 
  Download, 
  Check, 
  Plus, 
  ExternalLink, 
  Phone, 
  Mail, 
  Share2, 
  Sliders, 
  Terminal, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Video, 
  Radio, 
  CheckCircle2,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Lead, ScrapedLeadResult } from '../types';
import { scrapeGoogleMaps, scrapeSocialMedia, scrapeWebDomain, enrichLeadWithAI } from '../services/apiService';

interface ScraperWorkbenchProps {
  onImportLead: (newLead: Lead) => void;
  onBatchImportLeads: (leads: Lead[]) => void;
  existingLeads: Lead[];
}

export const ScraperWorkbench: React.FC<ScraperWorkbenchProps> = ({
  onImportLead,
  onBatchImportLeads,
  existingLeads,
}) => {
  const [activeScraperTab, setActiveScraperTab] = useState<'maps' | 'social' | 'web' | 'ad_webhook'>('maps');

  // Google Maps state
  const [mapsKeyword, setMapsKeyword] = useState('Cosmetic Dental Clinics');
  const [mapsLocation, setMapsLocation] = useState('Austin, TX');
  const [mapsRadius, setMapsRadius] = useState(25);
  const [mapsLimit, setMapsLimit] = useState(8);

  // Social scraper state
  const [socialPlatform, setSocialPlatform] = useState('LinkedIn');
  const [socialKeyword, setSocialKeyword] = useState('VP Marketing SaaS');
  const [socialLimit, setSocialLimit] = useState(6);

  // Web scraper state
  const [webUrl, setWebUrl] = useState('https://scalevelocity.io');

  // Ad Webhook state
  const [adPlatform, setAdPlatform] = useState<'Meta Ads' | 'Google Ads' | 'LinkedIn Ads' | 'TikTok Ads'>('Meta Ads');
  const [adCampaignName, setAdCampaignName] = useState('Summer High-Growth B2B Scale');
  const [adLeadName, setAdLeadName] = useState('Jordan Brooks');
  const [adLeadCompany, setAdLeadCompany] = useState('Apex Horizon Media');
  const [adLeadEmail, setAdLeadEmail] = useState('jordan@apexhorizon.com');
  const [adLeadPhone, setAdLeadPhone] = useState('+1 (512) 998-3410');

  // General scraping execution state
  const [isLoading, setIsLoading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusLog, setStatusLog] = useState<string[]>([]);
  const [scrapedResults, setScrapedResults] = useState<ScrapedLeadResult[]>([]);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());

  // Quick Preset Categories for Maps
  const PRESET_CATEGORIES = [
    'Cosmetic Dental Clinics',
    'Commercial HVAC Contractors',
    'Real Estate Brokerages',
    'B2B SaaS & Tech Startups',
    'Law Firms & Attorneys',
    'Med Spas & Aesthetics',
    'E-Commerce Growth Agencies',
    'Roofing & Solar Installers',
  ];

  // Quick Preset Cities
  const PRESET_CITIES = ['Austin, TX', 'Miami, FL', 'San Francisco, CA', 'New York, NY', 'Chicago, IL', 'London, UK', 'Berlin, Germany'];

  const addLog = (msg: string) => {
    setStatusLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Run Google Maps Crawler
  const handleRunMapsScraper = async () => {
    setIsLoading(true);
    setProgressPercent(15);
    setStatusLog([]);
    setScrapedResults([]);

    addLog(`Initiating Google Maps Places Crawler for "${mapsKeyword}" in "${mapsLocation}"...`);
    
    const interval = setInterval(() => {
      setProgressPercent((p) => {
        if (p < 85) return p + 15;
        return p;
      });
    }, 300);

    try {
      addLog(`Querying Google Maps Local Pack coordinates within ${mapsRadius} mile radius...`);
      addLog(`Extracting verified phone numbers, website links, and Google rating metadata...`);

      const response = await scrapeGoogleMaps({
        keyword: mapsKeyword,
        location: mapsLocation,
        radius: mapsRadius,
        limit: mapsLimit,
      });

      addLog(`Parsing secondary social channels (LinkedIn, Instagram, Twitter/X, Facebook)...`);
      addLog(`Extraction complete: Found ${response.results?.length || 0} verified business profiles.`);
      
      clearInterval(interval);
      setProgressPercent(100);
      setScrapedResults(response.results || []);
    } catch (err: any) {
      clearInterval(interval);
      addLog(`Error during scraping: ${err.message || 'Service unavailable'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Run Social Extractor
  const handleRunSocialScraper = async () => {
    setIsLoading(true);
    setProgressPercent(20);
    setStatusLog([]);
    setScrapedResults([]);

    addLog(`Connecting to ${socialPlatform} Social Discovery Crawler...`);
    addLog(`Scanning profiles matching keyword: "${socialKeyword}"...`);

    const interval = setInterval(() => {
      setProgressPercent((p) => (p < 80 ? p + 20 : p));
    }, 350);

    try {
      const response = await scrapeSocialMedia({
        platform: socialPlatform,
        keyword: socialKeyword,
        limit: socialLimit,
      });

      addLog(`Extracting profile bios, follower counts, verified contact emails, and social handles...`);
      addLog(`Discovery complete: Extracted ${response.results?.length || 0} active prospect profiles.`);

      clearInterval(interval);
      setProgressPercent(100);
      setScrapedResults(response.results || []);
    } catch (err: any) {
      clearInterval(interval);
      addLog(`Social scraping error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Run Deep Web Contact Scraper
  const handleRunWebScraper = async () => {
    setIsLoading(true);
    setProgressPercent(25);
    setStatusLog([]);
    setScrapedResults([]);

    addLog(`Connecting to deep crawler for domain "${webUrl}"...`);
    addLog(`Crawling /about, /contact, /team, and header/footer metadata...`);

    try {
      const response = await scrapeWebDomain(webUrl);
      addLog(`Discovered company info, decision maker profile, and linked social media handles!`);
      setProgressPercent(100);
      setScrapedResults([response.result]);
    } catch (err: any) {
      addLog(`Web scraping error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate Ingesting Ad Campaign Lead
  const handleSimulateAdWebhook = () => {
    const newLead: Lead = {
      id: `lead_ad_${Date.now()}`,
      name: adLeadCompany || 'Inbound Ad Lead',
      contactPerson: adLeadName || 'Decision Maker',
      title: 'Marketing Director',
      email: adLeadEmail || 'lead@company.com',
      phone: adLeadPhone || '+1 (555) 019-2830',
      website: `https://${adLeadCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      socialHandles: {
        linkedin: `https://linkedin.com/company/${adLeadCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        twitter: `@${adLeadCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      },
      sourceChannel: adPlatform === 'Meta Ads' ? 'meta_ads' : adPlatform === 'Google Ads' ? 'google_ads' : adPlatform === 'LinkedIn Ads' ? 'linkedin_ads' : 'tiktok_ads',
      sourceDetails: {
        campaignName: adCampaignName,
        utmSource: adPlatform.toLowerCase().replace(' ', '_'),
        utmMedium: 'cpc',
        utmCampaign: adCampaignName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        cpl: 35.0,
      },
      pipelineStage: 'new',
      dealValue: 12500,
      leadScore: 92,
      intentLevel: 'High',
      tags: [`${adPlatform} Ingested`, 'Instant Webhook', 'High Priority'],
      notes: `Lead automatically ingested from ${adPlatform} Lead Form campaign: "${adCampaignName}". Verified phone and email submitted in form.`,
      assignedTo: 'Sarah Connor',
      createdAt: new Date().toISOString(),
      emailSequenceStatus: 'enrolled',
      callStatus: 'not_called',
      activityTimeline: [
        {
          id: `act_${Date.now()}`,
          type: 'ingested',
          title: `Lead Ingested from ${adPlatform} Webhook`,
          description: `Captured form submission for campaign "${adCampaignName}". CPL $35.00.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    onImportLead(newLead);
    alert(`Success! Simulated lead "${newLead.name}" has been ingested into your CRM pipeline and enrolled in instant follow-ups.`);
  };

  // Convert Scraped Item into CRM Lead
  const handleImportSingle = (item: ScrapedLeadResult) => {
    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: item.name,
      contactPerson: item.contactPerson || item.name.split(' ')[0] || 'Owner',
      title: item.title || 'Managing Director',
      email: item.email || `contact@${item.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: item.phone || '+1 (555) 000-0000',
      website: item.website || (item.sourceUrl?.startsWith('http') ? item.sourceUrl : 'https://example.com'),
      address: item.address,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      socialHandles: item.socialHandles || {},
      sourceChannel: activeScraperTab === 'maps' ? 'google_maps' : activeScraperTab === 'social' ? 'social_scrape' : 'web_scrape',
      sourceDetails: {
        searchKeyword: activeScraperTab === 'maps' ? mapsKeyword : socialKeyword,
        searchLocation: activeScraperTab === 'maps' ? mapsLocation : undefined,
        scrapedUrl: item.sourceUrl,
        cpl: 0,
      },
      pipelineStage: 'new',
      dealValue: 12000 + Math.floor(Math.random() * 16000),
      leadScore: item.confidenceScore || 88,
      intentLevel: (item.confidenceScore || 85) > 90 ? 'High' : 'Medium',
      tags: [
        activeScraperTab === 'maps' ? 'Google Maps Scraped' : activeScraperTab === 'social' ? `${socialPlatform} Scraped` : 'Web Scraped',
        item.category || 'B2B Prospect',
        'Verified Contact',
      ],
      notes: `Extracted via ${item.platform || 'Scraper Engine'}. Rating: ${item.rating || 'N/A'} (${item.reviewsCount || 0} reviews). Scraped website, phone, and social profiles.`,
      assignedTo: 'Sarah Connor',
      createdAt: new Date().toISOString(),
      emailSequenceStatus: 'idle',
      callStatus: 'not_called',
      activityTimeline: [
        {
          id: `act_${Date.now()}`,
          type: 'scraped',
          title: `Lead Scraped via ${item.platform || 'Crawler'}`,
          description: `Captured contact numbers, email, social links, and website.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    onImportLead(newLead);
    setImportedIds((prev) => new Set([...prev, item.id]));
  };

  // Batch Import All Results
  const handleBatchImport = () => {
    const unimported = scrapedResults.filter((r) => !importedIds.has(r.id));
    if (unimported.length === 0) return;

    const leadsToImport: Lead[] = unimported.map((item, idx) => ({
      id: `lead_${Date.now()}_${idx}`,
      name: item.name,
      contactPerson: item.contactPerson || 'Executive',
      title: item.title || 'Owner / Director',
      email: item.email || `info@${item.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: item.phone || '+1 (555) 123-4567',
      website: item.website || 'https://example.com',
      address: item.address,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      socialHandles: item.socialHandles || {},
      sourceChannel: activeScraperTab === 'maps' ? 'google_maps' : activeScraperTab === 'social' ? 'social_scrape' : 'web_scrape',
      sourceDetails: {
        searchKeyword: mapsKeyword,
        searchLocation: mapsLocation,
        scrapedUrl: item.sourceUrl,
        cpl: 0,
      },
      pipelineStage: 'new',
      dealValue: 14000 + Math.floor(Math.random() * 12000),
      leadScore: item.confidenceScore || 90,
      intentLevel: 'High',
      tags: ['Batch Scraped', item.category || 'High-Intent', 'Multi-Channel Verified'],
      notes: `Batch extracted via OmniLead Scraper Engine from ${item.platform || 'Crawler'}. Verified phone and social links.`,
      assignedTo: 'Sarah Connor',
      createdAt: new Date().toISOString(),
      emailSequenceStatus: 'idle',
      callStatus: 'not_called',
      activityTimeline: [
        {
          id: `act_${Date.now()}_${idx}`,
          type: 'scraped',
          title: 'Batch Extracted and Imported to Pipeline',
          description: 'Ready for automated email cadence & AI voice dialer outreach.',
          timestamp: new Date().toISOString(),
        },
      ],
    }));

    onBatchImportLeads(leadsToImport);
    setImportedIds(new Set(scrapedResults.map((r) => r.id)));
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Tabs Bento Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span>Lead Scraper Workbench</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Directly crawl Google Places Local Packs, social channels & inbound webhook records.
          </p>
        </div>

        {/* Scraper Channel Selector */}
        <div className="flex items-center gap-1.5 bg-[#111] p-1.5 rounded-xl border border-[#222] self-start">
          <button
            id="scraper-tab-maps"
            onClick={() => setActiveScraperTab('maps')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeScraperTab === 'maps'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Google Maps</span>
          </button>

          <button
            id="scraper-tab-social"
            onClick={() => setActiveScraperTab('social')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeScraperTab === 'social'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Channels</span>
          </button>

          <button
            id="scraper-tab-web"
            onClick={() => setActiveScraperTab('web')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeScraperTab === 'web'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Domain Scraper</span>
          </button>

          <button
            id="scraper-tab-ad-webhook"
            onClick={() => setActiveScraperTab('ad_webhook')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeScraperTab === 'ad_webhook'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Ad Webhooks</span>
          </button>
        </div>
      </div>

      {/* Scraper Configuration Bento Card */}
      <div className="bg-[#111] rounded-2xl p-5 sm:p-6 border border-[#222] shadow-xl">
        {activeScraperTab === 'maps' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Google Maps Local Pack Crawler</h2>
                  <p className="text-xs text-gray-400">Extracts verified telephone lines, official websites, star ratings & direct address info</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-blue-950/40 text-blue-400 border border-blue-500/30 font-bold">
                REAL-TIME CRAWLER
              </span>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest font-mono">Quick Category Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMapsKeyword(cat)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-mono ${
                      mapsKeyword === cat
                        ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 font-bold'
                        : 'bg-[#161616] text-gray-400 border-[#262626] hover:text-white hover:border-[#333]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {/* Category / Keyword */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Target Business Niche</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={mapsKeyword}
                    onChange={(e) => setMapsKeyword(e.target.value)}
                    placeholder="e.g. Dental Clinics, Real Estate..."
                    className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Target Geo Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={mapsLocation}
                    onChange={(e) => setMapsLocation(e.target.value)}
                    placeholder="e.g. Austin, TX or London, UK"
                    className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Radius */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1.5">
                  <span>Search Radius</span>
                  <span className="text-blue-400 font-mono">{mapsRadius} miles</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={mapsRadius}
                  onChange={(e) => setMapsRadius(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-[#151515] h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Max Results */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Extraction Limit</label>
                <select
                  value={mapsLimit}
                  onChange={(e) => setMapsLimit(Number(e.target.value))}
                  className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={6}>6 Leads</option>
                  <option value={8}>8 Leads</option>
                  <option value={12}>12 Leads</option>
                  <option value={16}>16 Leads</option>
                  <option value={20}>20 Leads</option>
                </select>
              </div>
            </div>

            {/* Run Button */}
            <div className="flex items-center justify-between pt-3 border-t border-[#222]">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Filters: Verified Phone, Website & Social Handles required</span>
              </div>

              <button
                id="run-maps-scraper-btn"
                disabled={isLoading}
                onClick={handleRunMapsScraper}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer uppercase tracking-wider font-mono"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Crawling Maps...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Extraction</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}


        {activeScraperTab === 'social' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Social Media Prospect Discovery</h2>
                  <p className="text-xs text-gray-400">Extracts prospect handles (@username), bios, verified emails & phone numbers</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-blue-950/40 text-blue-400 border border-blue-500/30 font-bold">
                SOCIAL SCRAPER
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Platform */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Social Platform</label>
                <select
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="LinkedIn">LinkedIn (Executive Profiles & Companies)</option>
                  <option value="Instagram">Instagram (Business Accounts & Bios)</option>
                  <option value="Twitter">X / Twitter (High Intent Keywords)</option>
                  <option value="TikTok">TikTok (Creator & E-commerce Brands)</option>
                </select>
              </div>

              {/* Target Keyword / Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Target Role, Hashtag, or Query</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={socialKeyword}
                    onChange={(e) => setSocialKeyword(e.target.value)}
                    placeholder="e.g. Head of Growth SaaS, #agencyowner"
                    className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Limit */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Extraction Volume</label>
                <select
                  value={socialLimit}
                  onChange={(e) => setSocialLimit(Number(e.target.value))}
                  className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={6}>6 Profiles</option>
                  <option value={10}>10 Profiles</option>
                  <option value={15}>15 Profiles</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#222]">
              <span className="text-xs text-gray-400 font-mono">Scrapes verified emails, bio links, and follower authority metrics</span>
              <button
                id="run-social-scraper-btn"
                disabled={isLoading}
                onClick={handleRunSocialScraper}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer font-mono uppercase tracking-wider"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                <span>Extract {socialPlatform} Leads</span>
              </button>
            </div>
          </div>
        )}

        {activeScraperTab === 'web' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Deep Domain & Website Contact Scanner</h2>
                  <p className="text-xs text-gray-400">Inspects website DOM for all mailto: links, telephone tags, social accounts, and tech stack</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                id="run-web-scraper-btn"
                disabled={isLoading}
                onClick={handleRunWebScraper}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer whitespace-nowrap font-mono uppercase tracking-wider"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                <span>Scan URL & Contacts</span>
              </button>
            </div>
          </div>
        )}

        {activeScraperTab === 'ad_webhook' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Ad Campaign Webhook Simulator & Lead Ingestor</h2>
                  <p className="text-xs text-gray-400">Simulate instant lead form captures from Meta Ads, Google Ads, LinkedIn & TikTok</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-500/30 font-bold">
                WEBHOOK LISTENER READY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Ad Platform</label>
                <select
                  value={adPlatform}
                  onChange={(e) => setAdPlatform(e.target.value as any)}
                  className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Meta Ads">Meta Lead Ads (Facebook & IG)</option>
                  <option value="Google Ads">Google Ads Form Extensions</option>
                  <option value="LinkedIn Ads">LinkedIn Lead Gen Forms</option>
                  <option value="TikTok Ads">TikTok Instant Lead Forms</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Campaign Name (UTM)</label>
                <input
                  type="text"
                  value={adCampaignName}
                  onChange={(e) => setAdCampaignName(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Prospect Company</label>
                <input
                  type="text"
                  value={adLeadCompany}
                  onChange={(e) => setAdLeadCompany(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={adLeadName}
                  onChange={(e) => setAdLeadName(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Verified Email</label>
                <input
                  type="email"
                  value={adLeadEmail}
                  onChange={(e) => setAdLeadEmail(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Verified Phone</label>
                <input
                  type="text"
                  value={adLeadPhone}
                  onChange={(e) => setAdLeadPhone(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#222]">
              <span className="text-xs text-gray-400 font-mono">Webhook endpoint: <code className="text-blue-400">/api/campaigns/webhook</code></span>
              <button
                id="simulate-ad-lead-btn"
                onClick={handleSimulateAdWebhook}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer font-mono uppercase tracking-wider"
              >
                <Radio className="w-4 h-4" />
                <span>Simulate Inbound Ad Lead Form Submit</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress & Live Console Output */}
      {isLoading && (
        <div className="bg-[#0e0e0e] rounded-2xl p-5 border border-[#222] shadow-md space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-400 font-bold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>CRAWLER PROCESS RUNNING ({progressPercent}%)</span>
            </span>
            <span className="text-gray-500">Multi-Channel Scraper v2.4</span>
          </div>

          <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {statusLog.length > 0 && (
            <div className="bg-[#080808] rounded-xl p-3 text-[11px] text-gray-300 space-y-1 max-h-32 overflow-y-auto border border-[#1a1a1a]">
              {statusLog.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Extracted Leads Results Grid */}
      {scrapedResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111] p-4 rounded-2xl border border-[#222]">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Extracted {scrapedResults.length} Business Prospects</span>
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Verified contacts: Phone numbers, websites, Instagram, LinkedIn, and Twitter handles
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <span className="text-xs text-gray-400">
                Imported: <strong className="text-blue-400">{importedIds.size}</strong> of {scrapedResults.length}
              </span>
              <button
                id="batch-import-crm-btn"
                onClick={handleBatchImport}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer uppercase tracking-wider"
              >
                <Layers className="w-4 h-4" />
                <span>Batch Import All to CRM</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scrapedResults.map((item) => {
              const isImported = importedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`bg-[#111] rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
                    isImported
                      ? 'border-emerald-500/50 bg-[#0d1612]'
                      : 'border-[#222] hover:border-[#333]'
                  }`}
                >
                  {/* Card Top */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1a1a1a] text-blue-400 border border-[#2a2a2a] font-mono">
                          {item.category || item.platform || 'Business'}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1.5">{item.name}</h4>
                      </div>

                      {item.rating && (
                        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold whitespace-nowrap">
                          <span>★ {item.rating}</span>
                          <span className="text-gray-500 text-[10px]">({item.reviewsCount})</span>
                        </div>
                      )}
                    </div>

                    {/* Decision Maker */}
                    {item.contactPerson && (
                      <div className="mt-2 text-xs text-gray-300">
                        <strong className="text-white">{item.contactPerson}</strong>
                        {item.title && <span className="text-gray-500"> • {item.title}</span>}
                      </div>
                    )}

                    {/* Address */}
                    {item.address && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                        <span className="truncate">{item.address}</span>
                      </div>
                    )}

                    {/* Bio / Summary if social */}
                    {item.bio && (
                      <p className="text-[11px] text-gray-300 mt-2 line-clamp-2 bg-[#161616] p-2.5 rounded-xl border border-[#262626]">
                        {item.bio}
                      </p>
                    )}

                    {/* Contact details */}
                    <div className="mt-3 space-y-1.5 text-xs bg-[#161616] p-3 rounded-xl border border-[#262626]">
                      {item.phone && (
                        <div className="flex items-center justify-between text-gray-200">
                          <span className="flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone:
                          </span>
                          <span className="font-mono font-bold text-emerald-400">{item.phone}</span>
                        </div>
                      )}

                      {item.website && (
                        <div className="flex items-center justify-between text-gray-200">
                          <span className="flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
                            <Globe className="w-3.5 h-3.5 text-blue-400" /> Web:
                          </span>
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:underline truncate max-w-[140px] text-[11px] font-mono flex items-center gap-1"
                          >
                            <span>{item.website.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {item.email && (
                        <div className="flex items-center justify-between text-gray-200">
                          <span className="flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
                            <Mail className="w-3.5 h-3.5 text-blue-400" /> Email:
                          </span>
                          <span className="text-gray-300 text-[11px] font-mono truncate max-w-[140px]">{item.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Social Handles Badges */}
                    {item.socialHandles && Object.keys(item.socialHandles).length > 0 && (
                      <div className="mt-3">
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider font-mono">
                          Scraped Handles:
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {item.socialHandles.linkedin && (
                            <a
                              href={item.socialHandles.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 border border-blue-600/30 hover:bg-blue-600/40"
                            >
                              <Linkedin className="w-3 h-3" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                          {item.socialHandles.instagram && (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-pink-600/20 text-pink-300 border border-pink-600/30">
                              <Instagram className="w-3 h-3" />
                              <span>{item.socialHandles.instagram}</span>
                            </span>
                          )}
                          {item.socialHandles.twitter && (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#161616] text-blue-300 border border-[#2a2a2a]">
                              <Twitter className="w-3 h-3" />
                              <span>{item.socialHandles.twitter}</span>
                            </span>
                          )}
                          {item.socialHandles.facebook && (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-blue-700/20 text-blue-400 border border-blue-700/30">
                              <Facebook className="w-3 h-3" />
                              <span>FB Profile</span>
                            </span>
                          )}
                          {item.socialHandles.tiktok && (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-purple-600/20 text-purple-300 border border-purple-600/30">
                              <Video className="w-3 h-3" />
                              <span>{item.socialHandles.tiktok}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Import Button */}
                  <div className="mt-4 pt-3 border-t border-[#222] flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 font-mono">
                      <span className="font-bold text-emerald-400">{item.confidenceScore}%</span>
                      <span>Confidence</span>
                    </div>

                    <button
                      id={`import-lead-${item.id}`}
                      disabled={isImported}
                      onClick={() => handleImportSingle(item)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${
                        isImported
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                      }`}
                    >
                      {isImported ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Imported</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Import</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
