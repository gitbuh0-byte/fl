import { Campaign, EmailCadence, FollowUpTask, Lead, ScrapedLeadResult } from '../types';

export interface AppState {
  leads: Lead[];
  campaigns: Campaign[];
  cadences: EmailCadence[];
  tasks: FollowUpTask[];
  webhookEvents?: string[];
  profile?: ProfileSettings;
}

export interface ProfileSettings {
  name: string;
  email: string;
  notifications: {
    leadAlerts: boolean;
    taskReminders: boolean;
    weeklyDigest: boolean;
  };
}

export interface AuthUser {
  email: string;
  name: string;
}

const authTokenKey = 'omnibiz-auth-token';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem(authTokenKey);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createSession(email: string): Promise<AuthUser> {
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error((await res.json()).error || `Server returned ${res.status}`);
  const data = await res.json();
  localStorage.setItem(authTokenKey, data.token);
  return data.user;
}

export async function getSession(): Promise<AuthUser | null> {
  if (!localStorage.getItem(authTokenKey)) return null;
  const res = await fetch('/api/auth/session', { headers: authHeaders() });
  if (!res.ok) {
    localStorage.removeItem(authTokenKey);
    return null;
  }
  return (await res.json()).user;
}

export async function destroySession(): Promise<void> {
  await fetch('/api/auth/session', { method: 'DELETE', headers: authHeaders() });
  localStorage.removeItem(authTokenKey);
}

export async function getAppState(): Promise<AppState> {
  const res = await fetch('/api/state', { headers: authHeaders() });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return await res.json();
}

export async function saveAppState(state: AppState): Promise<void> {
  const res = await fetch('/api/state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(state),
  });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
}

export async function ingestCampaignLead(campaignId: string, lead: {
  eventId: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  contactPerson?: string;
}): Promise<{ lead: Lead; campaign: Campaign }> {
  const res = await fetch('/api/campaigns/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaignId, ...lead }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Server returned ${res.status}`);
  return data;
}

export async function dispatchEmail(lead: Pick<Lead, 'id' | 'email'>, subject: string, body: string): Promise<{ status: string; provider: string; messageId: string }> {
  const res = await fetch('/api/outreach/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ leadId: lead.id, to: lead.email, subject, body }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Server returned ${res.status}`);
  return data;
}

export async function createCallSession(lead: Pick<Lead, 'id' | 'phone'>): Promise<{ status: string; provider: string; callId: string }> {
  const res = await fetch('/api/outreach/call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ leadId: lead.id, phone: lead.phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Server returned ${res.status}`);
  return data;
}

export async function scrapeGoogleMaps(params: {
  keyword: string;
  location: string;
  radius?: number;
  limit?: number;
}): Promise<{ success: boolean; results: ScrapedLeadResult[]; source: string }> {
  try {
    const res = await fetch('/api/scrape/maps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Maps scraping error:', err);
    throw err;
  }
}

export async function scrapeSocialMedia(params: {
  platform: string;
  keyword: string;
  limit?: number;
}): Promise<{ success: boolean; results: ScrapedLeadResult[] }> {
  try {
    const res = await fetch('/api/scrape/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Social scraping error:', err);
    throw err;
  }
}

export async function scrapeWebDomain(url: string): Promise<{ success: boolean; result: ScrapedLeadResult }> {
  try {
    const res = await fetch('/api/scrape/web', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Web scraping error:', err);
    throw err;
  }
}

export async function enrichLeadWithAI(lead: Partial<Lead>): Promise<any> {
  try {
    const res = await fetch('/api/ai/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead }),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('AI Enrichment error:', err);
    throw err;
  }
}

export async function draftPersonalizedEmail(lead: Partial<Lead>, stepNumber: number = 1): Promise<{ subject: string; body: string }> {
  try {
    const res = await fetch('/api/ai/draft-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead, stepNumber }),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();
    return data.email || { subject: 'Follow up', body: 'Hello' };
  } catch (err) {
    console.error('AI Email error:', err);
    throw err;
  }
}

export async function simulateCallTurn(
  lead: Partial<Lead>,
  userSpeech: string,
  dialogueHistory: any[] = []
): Promise<{
  prospectReply: string;
  sentiment: 'positive' | 'neutral' | 'skeptical' | 'interested';
  intentScore: number;
  suggestedNextPitch?: string;
}> {
  try {
    const res = await fetch('/api/ai/simulate-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead, userSpeech, dialogueHistory }),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Call simulation error:', err);
    return {
      prospectReply: "Hello, thanks for calling. Please send details to my email.",
      sentiment: 'neutral',
      intentScore: 70,
      suggestedNextPitch: "Confirm their email and offer a 10-minute demo slot.",
    };
  }
}
