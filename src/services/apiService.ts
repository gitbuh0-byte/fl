import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getRedirectResult, signInWithRedirect, signOut } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase';
import { initialCampaigns, initialCadences, initialFollowUpTasks, initialLeads } from '../data/initialData';
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
const userKey = 'omnibiz-user';
const appStateKey = 'omnibiz-app-state';

const defaultState: AppState = {
  leads: initialLeads,
  campaigns: initialCampaigns,
  cadences: initialCadences,
  tasks: initialFollowUpTasks,
  webhookEvents: [],
  profile: { name: 'Alex Sterling', email: 'alex@omnibiz.co', notifications: { leadAlerts: true, taskReminders: true, weeklyDigest: false } },
};

function getUserDoc(uid: string) {
  return doc(db, 'users', uid);
}

function getAppStateDoc(uid: string) {
  return doc(db, 'users', uid, 'app', 'state');
}

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(userKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (parsed.email && parsed.name) {
      return { email: parsed.email, name: parsed.name };
    }
  } catch {
    // Ignore malformed persisted user data.
  }

  return null;
}

function writeStoredUser(user: AuthUser): void {
  localStorage.setItem(userKey, JSON.stringify(user));
  localStorage.setItem(authTokenKey, `demo-${user.email}`);
}

function readStoredState(): AppState | null {
  const raw = localStorage.getItem(appStateKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

function writeStoredState(state: AppState): void {
  localStorage.setItem(appStateKey, JSON.stringify(state));
}

export async function createSession(email: string): Promise<AuthUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const user: AuthUser = {
    email: normalizedEmail,
    name: normalizedEmail.split('@')[0]?.replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || 'User',
  };

  writeStoredUser(user);
  return user;
}

export async function signInWithGoogle(): Promise<AuthUser> {
  try {
    await signInWithRedirect(auth, googleProvider);
    return { email: 'google-user@demo.local', name: 'Google User' };
  } catch {
    const fallbackUser: AuthUser = { email: 'google-user@demo.local', name: 'Google User' };
    writeStoredUser(fallbackUser);
    return fallbackUser;
  }
}

export async function completeGoogleRedirectSignIn(): Promise<AuthUser | null> {
  try {
    const result = await getRedirectResult(auth);
    if (!result?.user) {
      return readStoredUser();
    }

    const user = result.user;
    const resolvedEmail = (user.email ?? `${user.uid}@google.local`).toLowerCase();
    const resolvedName = user.displayName ?? resolvedEmail.split('@')[0];
    const resolvedUser: AuthUser = { email: resolvedEmail, name: resolvedName };
    writeStoredUser(resolvedUser);
    return resolvedUser;
  } catch {
    return readStoredUser();
  }
}

export async function getSession(): Promise<AuthUser | null> {
  return readStoredUser();
}

export async function destroySession(): Promise<void> {
  try {
    await signOut(auth);
  } catch {
    // Ignore sign-out errors in the browser-only deployment path.
  }
  localStorage.removeItem(authTokenKey);
  localStorage.removeItem(userKey);
}

export async function getAppState(): Promise<AppState> {
  const uid = auth.currentUser?.uid ?? localStorage.getItem(authTokenKey);
  if (uid) {
    const snap = await getDoc(getAppStateDoc(uid));
    if (!snap.exists()) {
      await setDoc(getAppStateDoc(uid), defaultState, { merge: true });
      return defaultState;
    }

    return { ...defaultState, ...(snap.data() as Partial<AppState>) };
  }

  const storedState = readStoredState();
  return storedState ?? defaultState;
}

export async function saveAppState(state: AppState): Promise<void> {
  const uid = auth.currentUser?.uid ?? localStorage.getItem(authTokenKey);
  if (uid) {
    await setDoc(getAppStateDoc(uid), state, { merge: true });
    return;
  }

  writeStoredState(state);
}

export async function ingestCampaignLead(campaignId: string, lead: {
  eventId: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  contactPerson?: string;
}): Promise<{ lead: Lead; campaign: Campaign }> {
  const current = await getAppState();
  const nextLead: Lead = {
    ...initialLeads[0],
    id: `lead_${Date.now()}`,
    name: lead.name,
    contactPerson: lead.contactPerson || lead.name,
    email: lead.email,
    phone: lead.phone || '',
    company: lead.company,
    sourceChannel: 'manual',
    sourceDetails: { campaignId },
    pipelineStage: 'new',
    createdAt: new Date().toISOString(),
    tags: ['Imported'],
  };

  const nextCampaigns = current.campaigns.map((campaign) => (
    campaign.id === campaignId ? { ...campaign, leadsCount: campaign.leadsCount + 1 } : campaign
  ));

  const nextState: AppState = {
    ...current,
    leads: [nextLead, ...current.leads],
    campaigns: nextCampaigns,
  };

  await saveAppState(nextState);
  return { lead: nextLead, campaign: nextCampaigns.find((campaign) => campaign.id === campaignId) ?? nextCampaigns[0] };
}

export async function dispatchEmail(lead: Pick<Lead, 'id' | 'email'>, subject: string, body: string): Promise<{ status: string; provider: string; messageId: string }> {
  return { status: 'queued', provider: 'firebase', messageId: `msg_${Date.now()}` };
}

export async function createCallSession(lead: Pick<Lead, 'id' | 'phone'>): Promise<{ status: string; provider: string; callId: string }> {
  return { status: 'queued', provider: 'firebase', callId: `call_${Date.now()}` };
}

export async function scrapeGoogleMaps(params: {
  keyword: string;
  location: string;
  radius?: number;
  limit?: number;
}): Promise<{ success: boolean; results: ScrapedLeadResult[]; source: string }> {
  return {
    success: true,
    source: 'Firebase-backed demo data',
    results: [
      { id: `demo_${Date.now()}`, name: params.keyword, email: 'contact@example.com', phone: '+1 (415) 555-0101', website: 'https://example.com', address: params.location, company: params.keyword, sourceUrl: 'https://example.com', status: 'new', confidenceScore: 94 },
    ],
  };
}

export async function scrapeSocialMedia(params: {
  platform: string;
  keyword: string;
  limit?: number;
}): Promise<{ success: boolean; results: ScrapedLeadResult[] }> {
  return {
    success: true,
    results: [
      { id: `social_${Date.now()}`, name: params.keyword, email: 'contact@example.com', phone: '+1 (415) 555-0102', website: 'https://example.com', address: 'Remote', company: params.keyword, sourceUrl: 'https://example.com', status: 'new', confidenceScore: 92 },
    ],
  };
}

export async function scrapeWebDomain(url: string): Promise<{ success: boolean; result: ScrapedLeadResult }> {
  return {
    success: true,
    result: { id: `web_${Date.now()}`, name: url, email: 'contact@example.com', phone: '+1 (415) 555-0103', website: url, address: 'Remote', company: 'Website Prospect', sourceUrl: url, status: 'new', confidenceScore: 90 },
  };
}

export async function enrichLeadWithAI(lead: Partial<Lead>): Promise<any> {
  return { success: true, lead, enriched: true };
}

export async function draftPersonalizedEmail(lead: Partial<Lead>, stepNumber: number = 1): Promise<{ subject: string; body: string }> {
  return {
    subject: `Follow-up: ${lead.name ?? 'Prospect'}`,
    body: `Hi ${lead.contactPerson ?? lead.name ?? 'there'},\n\nI wanted to follow up on our conversation and share a quick summary.\n\nBest,\nYour team`,
  };
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
  return {
    prospectReply: `Thanks for the context. Let’s review the next steps for ${lead.company ?? 'your team'}.`,
    sentiment: 'neutral',
    intentScore: 72,
    suggestedNextPitch: 'Offer a quick 10-minute walkthrough and confirm the next decision-maker.',
  };
}
