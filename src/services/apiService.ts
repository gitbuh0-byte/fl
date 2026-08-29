import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getRedirectResult, signInAnonymously, signInWithRedirect, signOut } from 'firebase/auth';
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

async function ensureUserSession(email?: string): Promise<AuthUser> {
  let user = auth.currentUser;
  if (!user) {
    const result = await signInAnonymously(auth);
    user = result.user;
  }

  const uid = user.uid;
  const profile = await getDoc(getUserDoc(uid));
  const profileData = profile.exists() ? profile.data() : {};
  const resolvedEmail = (email ?? profileData.email ?? user.email ?? `${uid}@anonymous.local`).toLowerCase();
  const resolvedName = profileData.name ?? user.displayName ?? resolvedEmail.split('@')[0];

  await setDoc(getUserDoc(uid), {
    uid,
    email: resolvedEmail,
    name: resolvedName,
    updatedAt: Date.now(),
  }, { merge: true });

  localStorage.setItem(authTokenKey, uid);
  return { email: resolvedEmail, name: resolvedName };
}

export async function createSession(email: string): Promise<AuthUser> {
  return ensureUserSession(email);
}

export async function signInWithGoogle(): Promise<AuthUser> {
  await signInWithRedirect(auth, googleProvider);
  return { email: '', name: 'Google User' };
}

export async function completeGoogleRedirectSignIn(): Promise<AuthUser | null> {
  const result = await getRedirectResult(auth);
  if (!result?.user) return null;

  const user = result.user;
  const resolvedEmail = (user.email ?? `${user.uid}@google.local`).toLowerCase();
  const resolvedName = user.displayName ?? resolvedEmail.split('@')[0];

  await setDoc(getUserDoc(user.uid), {
    uid: user.uid,
    email: resolvedEmail,
    name: resolvedName,
    updatedAt: Date.now(),
  }, { merge: true });

  localStorage.setItem(authTokenKey, user.uid);
  return { email: resolvedEmail, name: resolvedName };
}

export async function getSession(): Promise<AuthUser | null> {
  const storedUid = localStorage.getItem(authTokenKey);
  if (!storedUid && !auth.currentUser) return null;

  const uid = auth.currentUser?.uid ?? storedUid;
  if (!uid) return null;

  const snap = await getDoc(getUserDoc(uid));
  if (!snap.exists()) {
    localStorage.removeItem(authTokenKey);
    return null;
  }

  const data = snap.data() as Partial<AuthUser> & { email?: string; name?: string };
  const email = (data.email ?? `${uid}@anonymous.local`).toLowerCase();
  const name = data.name ?? email.split('@')[0];
  return { email, name };
}

export async function destroySession(): Promise<void> {
  try {
    await signOut(auth);
  } catch {
    // Ignore sign-out errors in the browser-only deployment path.
  }
  localStorage.removeItem(authTokenKey);
}

export async function getAppState(): Promise<AppState> {
  const uid = auth.currentUser?.uid ?? localStorage.getItem(authTokenKey);
  if (!uid) return defaultState;

  const snap = await getDoc(getAppStateDoc(uid));
  if (!snap.exists()) {
    await setDoc(getAppStateDoc(uid), defaultState, { merge: true });
    return defaultState;
  }

  return { ...defaultState, ...(snap.data() as Partial<AppState>) };
}

export async function saveAppState(state: AppState): Promise<void> {
  const uid = auth.currentUser?.uid ?? localStorage.getItem(authTokenKey);
  if (!uid) return;
  await setDoc(getAppStateDoc(uid), state, { merge: true });
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
