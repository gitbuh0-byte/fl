export type PipelineStage = 
  | 'new' 
  | 'enriched' 
  | 'contacted' 
  | 'meeting_scheduled' 
  | 'proposal_sent' 
  | 'negotiation' 
  | 'closed_won' 
  | 'closed_lost';

export type LeadSource = 
  | 'google_maps' 
  | 'meta_ads' 
  | 'google_ads' 
  | 'linkedin_ads' 
  | 'tiktok_ads' 
  | 'social_scrape' 
  | 'web_scrape' 
  | 'manual';

export interface SocialHandles {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

export interface ActivityItem {
  id: string;
  type: 'ingested' | 'scraped' | 'email_sent' | 'email_replied' | 'call_made' | 'call_connected' | 'stage_changed' | 'note_added' | 'enriched';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Lead {
  id: string;
  name: string;
  contactPerson?: string;
  title?: string;
  email: string;
  phone: string;
  website: string;
  address?: string;
  city?: string;
  country?: string;
  rating?: number;
  reviewsCount?: number;
  socialHandles: SocialHandles;
  sourceChannel: LeadSource;
  sourceDetails?: {
    campaignId?: string;
    campaignName?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    searchKeyword?: string;
    searchLocation?: string;
    scrapedUrl?: string;
    adCreativeId?: string;
    cpl?: number;
  };
  pipelineStage: PipelineStage;
  dealValue: number;
  leadScore: number; // 0 - 100
  intentLevel: 'High' | 'Medium' | 'Low';
  tags: string[];
  notes: string;
  assignedTo: string;
  createdAt: string;
  lastContactedAt?: string;
  followUpDue?: string;
  emailSequenceStatus?: 'idle' | 'enrolled' | 'step_1_sent' | 'step_2_sent' | 'completed' | 'replied';
  emailDeliveryStatus?: 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed';
  callStatus?: 'not_called' | 'dialing' | 'connected' | 'voicemail' | 'interested' | 'callback_requested' | 'not_interested';
  callProviderStatus?: 'queued' | 'ringing' | 'connected' | 'completed' | 'failed';
  callRecordingTranscript?: string;
  aiInsights?: {
    summary?: string;
    recommendedPitch?: string;
    keyPainPoints?: string[];
    decisionMakerTitle?: string;
  };
  activityTimeline: ActivityItem[];
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'Google Ads' | 'Meta Ads' | 'LinkedIn Ads' | 'TikTok Ads' | string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spend: number;
  impressions?: number;
  clicks?: number;
  leadsCount: number;
  cpl: number;
  wonDealsCount?: number;
  revenue: number;
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
  adGroup?: string;
  lastLeadAt?: string;
  targetAudience?: string;
  objective?: string;
  createdAt?: string;
}

export interface ScrapedLeadResult {
  id: string;
  name: string;
  contactPerson?: string;
  title?: string;
  category?: string;
  rating?: number;
  reviewsCount?: number;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  socialHandles: SocialHandles;
  sourceUrl?: string;
  platform?: string;
  bio?: string;
  followers?: string;
  confidenceScore: number;
  isImported?: boolean;
}

export interface ScrapeJob {
  id: string;
  type: 'maps' | 'social' | 'web';
  query: string;
  location?: string;
  platform?: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  foundCount: number;
  importedCount: number;
  results: ScrapedLeadResult[];
  logs: string[];
  createdAt: string;
}

export interface EmailSequenceStep {
  stepNumber: number;
  delayDays: number;
  subject: string;
  bodyTemplate: string;
}

export interface EmailCadence {
  id: string;
  name: string;
  description: string;
  targetChannel: string;
  steps: EmailSequenceStep[];
  activeEnrollments: number;
  openRate: number;
  replyRate: number;
}

export interface FollowUpTask {
  id: string;
  leadId: string;
  leadName: string;
  leadCompany: string;
  leadPhone: string;
  leadEmail: string;
  type: 'email' | 'call' | 'meeting' | 'review' | 'proposal';
  dueDate: string;
  priority: 'urgent' | 'high' | 'medium';
  completed: boolean;
  notes?: string;
}

export interface CallSimulationLog {
  speaker: 'AI Agent' | 'Prospect';
  text: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'skeptical' | 'interested';
}
