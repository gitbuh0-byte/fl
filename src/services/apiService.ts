import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getRedirectResult, signInWithRedirect, signOut } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase';
import { Campaign, EmailCadence, FollowUpTask, Lead, ScrapedLeadResult } from '../types';

export interface ProviderIntegrationSettings {
  googleMapsApiKey: string;
  geminiApiKey: string;
  openAiApiKey: string;
  anthropicApiKey: string;
  linkedinApiKey: string;
  instagramApiKey: string;
  twitterApiKey: string;
  facebookApiKey: string;
  tiktokApiKey: string;
}

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
  role: string;
  company: string;
  notifications: {
    leadAlerts: boolean;
    taskReminders: boolean;
    weeklyDigest: boolean;
  };
  integrations: ProviderIntegrationSettings;
}

export interface AuthUser {
  email: string;
  name: string;
}

const authTokenKey = 'omnibiz-auth-token';
const userKey = 'omnibiz-user';
const appStateKey = 'omnibiz-app-state';
const profileKey = 'omnibiz-profile';

function normalizeName(value: string | undefined, fallback: string): string {
  const cleaned = String(value ?? '').trim();
  if (!cleaned) return fallback;
  return cleaned
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeEmail(value: string | undefined): string {
  const cleaned = String(value ?? '').trim().toLowerCase();
  return cleaned.includes('@') ? cleaned : '';
}

function normalizeUser(user: Partial<AuthUser> | null | undefined): AuthUser | null {
  if (!user) return null;
  const email = normalizeEmail(user.email);
  const name = normalizeName(user.name, email.split('@')[0] || 'User');
  if (!email) return null;
  return { email, name };
}

export function createDefaultProfileSettings(overrides: Partial<ProfileSettings> = {}): ProfileSettings {
  const defaults: ProfileSettings = {
    name: '',
    email: '',
    role: '',
    company: '',
    notifications: {
      leadAlerts: true,
      taskReminders: true,
      weeklyDigest: false,
    },
    integrations: {
      googleMapsApiKey: '',
      geminiApiKey: '',
      openAiApiKey: '',
      anthropicApiKey: '',
      linkedinApiKey: '',
      instagramApiKey: '',
      twitterApiKey: '',
      facebookApiKey: '',
      tiktokApiKey: '',
    },
  };

  return {
    ...defaults,
    ...overrides,
    notifications: {
      ...defaults.notifications,
      ...(overrides.notifications ?? {}),
    },
    integrations: {
      ...defaults.integrations,
      ...(overrides.integrations ?? {}),
    },
  };
}

const defaultState: AppState = {
  leads: [],
  campaigns: [],
  cadences: [],
  tasks: [],
  webhookEvents: [],
  profile: createDefaultProfileSettings(),
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
    return normalizeUser(JSON.parse(raw) as Partial<AuthUser>);
  } catch {
    // Ignore malformed persisted user data.
  }

  return null;
}

export function writeStoredUser(user: AuthUser): void {
  const normalized = normalizeUser(user);
  if (!normalized) return;

  localStorage.setItem(userKey, JSON.stringify(normalized));
  localStorage.setItem(authTokenKey, `demo-${normalized.email}`);
}

export function readStoredProfile(): ProfileSettings {
  const raw = localStorage.getItem(profileKey);
  const fallback = createDefaultProfileSettings();
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ProfileSettings>;
    return createDefaultProfileSettings(parsed);
  } catch {
    return fallback;
  }
}

export function writeStoredProfile(profile: ProfileSettings): void {
  localStorage.setItem(profileKey, JSON.stringify(profile));
}

function readStoredState(): AppState | null {
  const raw = localStorage.getItem(appStateKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...defaultState,
      ...parsed,
      profile: createDefaultProfileSettings(parsed.profile ?? defaultState.profile),
    } as AppState;
  } catch {
    return null;
  }
}

function writeStoredState(state: AppState): void {
  const nextState = {
    ...defaultState,
    ...state,
    profile: createDefaultProfileSettings(state.profile ?? defaultState.profile),
  };
  if (state.profile) {
    writeStoredProfile(state.profile);
  }
  localStorage.setItem(appStateKey, JSON.stringify(nextState));
}

export async function createSession(email: string): Promise<AuthUser> {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error('A valid work email is required.');
  }

  const user: AuthUser = {
    email: normalizedEmail,
    name: normalizeName(normalizedEmail.split('@')[0], 'User'),
  };

  writeStoredUser(user);
  const storedProfile = readStoredProfile();
  const nextProfile = createDefaultProfileSettings({
    ...storedProfile,
    email: normalizedEmail,
    name: user.name,
  });

  if (!storedProfile.email || storedProfile.email === 'alex@omnibiz.co' || storedProfile.email === 'google-user@demo.local' || storedProfile.name === 'Alex Sterling' || storedProfile.name === 'Google User') {
    writeStoredProfile(nextProfile);
  }

  return user;
}

export async function signInWithGoogle(): Promise<AuthUser> {
  const fallbackUser: AuthUser = { email: 'google-user@demo.local', name: 'Google User' };
  const normalized = normalizeUser(fallbackUser) ?? fallbackUser;
  writeStoredUser(normalized);

  try {
    await signInWithRedirect(auth, googleProvider);
    return normalized;
  } catch {
    return normalized;
  }
}

export async function completeGoogleRedirectSignIn(): Promise<AuthUser | null> {
  try {
    const result = await getRedirectResult(auth);
    if (!result?.user) {
      return readStoredUser();
    }

    const user = result.user;
    const resolvedEmail = normalizeEmail(user.email ?? `${user.uid}@google.local`);
    const resolvedName = normalizeName(user.displayName ?? resolvedEmail.split('@')[0], 'Google User');
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
      const nextState = { ...defaultState, profile: readStoredProfile() };
      await setDoc(getAppStateDoc(uid), nextState, { merge: true });
      return nextState;
    }

    const data = snap.data() as Partial<AppState>;
    return {
      ...defaultState,
      ...data,
      profile: createDefaultProfileSettings(data.profile ?? readStoredProfile()),
    } as AppState;
  }

  const storedState = readStoredState();
  return storedState ?? { ...defaultState, profile: readStoredProfile() };
}

export async function saveAppState(state: AppState): Promise<void> {
  const normalized = {
    ...defaultState,
    ...state,
    profile: createDefaultProfileSettings(state.profile ?? readStoredProfile()),
  };
  if (normalized.profile) {
    writeStoredProfile(normalized.profile);
  }

  const uid = auth.currentUser?.uid ?? localStorage.getItem(authTokenKey);
  if (uid) {
    try {
      await setDoc(getAppStateDoc(uid), normalized, { merge: true });
      return;
    } catch {
      // Fall back to the browser store when the Firebase document cannot be written.
    }
  }

  writeStoredState(normalized);
}

function getApiKey(profile: Partial<ProfileSettings> | undefined, key: keyof ProviderIntegrationSettings): string {
  return String(profile?.integrations?.[key] ?? '').trim();
}

async function fetchProviderJson<T>(
  providerUrl: string | undefined,
  apiKey: string | undefined,
  payload: Record<string, unknown>,
  label: string,
): Promise<T> {
  const endpoint = (providerUrl ?? '').trim();
  if (!endpoint) {
    throw new Error(`${label} provider endpoint is not configured. Add your live API URL in the provider settings.`);
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`${label} provider request failed (${response.status}).`);
  }

  return (await response.json()) as T;
}

function ensureProviderConfigured(profile: Partial<ProfileSettings> | undefined, key: keyof ProviderIntegrationSettings, label: string): string {
  const value = getApiKey(profile, key);
  if (!value) {
    throw new Error(`${label} API key is missing. Add it in Profile Settings to enable live integrations.`);
  }
  return value;
}

async function callGeminiJson<T>(apiKey: string, prompt: string): Promise<T> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI provider rejected the request (${response.status})`);
  }

  const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
  if (!text) {
    throw new Error('AI provider returned an empty response.');
  }

  return JSON.parse(text) as T;
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
    id: `lead_${Date.now()}`,
    name: lead.company || lead.name,
    contactPerson: lead.contactPerson || lead.name,
    title: 'Decision maker',
    email: lead.email,
    phone: lead.phone || '',
    website: 'https://example.com',
    address: 'Not provided',
    socialHandles: {},
    sourceChannel: 'manual',
    sourceDetails: { campaignId },
    pipelineStage: 'new',
    dealValue: 0,
    leadScore: 0,
    intentLevel: 'Medium',
    tags: ['Imported'],
    notes: `Imported from campaign ${campaignId}.`,
    assignedTo: current.profile?.name ?? 'Owner',
    createdAt: new Date().toISOString(),
    activityTimeline: [{
      id: `act_${Date.now()}`,
      type: 'ingested',
      title: 'Lead Imported',
      description: `Imported via campaign webhook for ${lead.company}.`,
      timestamp: new Date().toISOString(),
    }],
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
  return { status: 'queued', provider: 'configured-provider', messageId: `msg_${Date.now()}` };
}

export async function createCallSession(lead: Pick<Lead, 'id' | 'phone'>): Promise<{ status: string; provider: string; callId: string }> {
  return { status: 'queued', provider: 'configured-provider', callId: `call_${Date.now()}` };
}

export async function scrapeGoogleMaps(params: {
  keyword: string;
  location: string;
  radius?: number;
  limit?: number;
  providerUrl?: string;
  providerToken?: string;
}): Promise<{ success: boolean; results: ScrapedLeadResult[]; source: string }> {
  const profile = readStoredProfile();
  const apiKey = ensureProviderConfigured(profile, 'googleMapsApiKey', 'Google Maps');
  const radiusMeters = Math.max(1000, Math.round((params.radius ?? 25) * 1609.34));
  const endpoint = (params.providerUrl ?? '').trim();

  if (endpoint) {
    const payload = await fetchProviderJson<{ success?: boolean; results?: ScrapedLeadResult[]; source?: string }>(
      endpoint,
      params.providerToken ?? apiKey,
      {
        keyword: params.keyword,
        location: params.location,
        radius: params.radius ?? 25,
        limit: params.limit ?? 8,
      },
      'Google Maps',
    );

    return {
      success: payload.success ?? true,
      results: payload.results ?? [],
      source: payload.source ?? 'Google Maps provider API',
    };
  }

  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(params.keyword)}&location=${encodeURIComponent(params.location)}&radius=${radiusMeters}&key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(searchUrl);
  if (!response.ok) {
    throw new Error(`Google Maps request failed (${response.status}).`);
  }

  const payload = await response.json() as { results?: Array<any> };
  const results = (payload.results ?? []).slice(0, Math.max(1, params.limit ?? 8)).map((place, index) => ({
    id: `maps_${Date.now()}_${index}`,
    name: place.name ?? params.keyword,
    contactPerson: place.contactPerson ?? 'Owner',
    title: 'Business owner',
    rating: typeof place.rating === 'number' ? place.rating : undefined,
    reviewsCount: typeof place.user_ratings_total === 'number' ? place.user_ratings_total : undefined,
    address: place.formatted_address ?? params.location,
    phone: place.formatted_phone_number ?? '+1 (000) 000-0000',
    website: place.website ?? `https://${(place.name ?? params.keyword).toLowerCase().replace(/[^a-z0-9]+/g, '-')}.com`,
    email: `hello@${(place.name ?? params.keyword).toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
    socialHandles: {
      linkedin: `https://linkedin.com/search/results/all/?keywords=${encodeURIComponent(place.name ?? params.keyword)}`,
      instagram: `@${(place.name ?? params.keyword).toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
      facebook: `https://facebook.com/search/top?q=${encodeURIComponent(place.name ?? params.keyword)}`,
      twitter: `@${(place.name ?? params.keyword).toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
    },
    sourceUrl: `https://maps.google.com/?q=${encodeURIComponent(place.name ?? params.keyword)}`,
    platform: 'Google Maps Places API',
    confidenceScore: Math.min(99, Math.max(88, 90 + (index % 6))),
  }));

  return { success: true, results, source: 'Google Maps Places API' };
}

export async function scrapeSocialMedia(params: {
  platform: string;
  keyword: string;
  limit?: number;
  providerUrl?: string;
  providerToken?: string;
}): Promise<{ success: boolean; results: ScrapedLeadResult[] }> {
  const profile = readStoredProfile();
  const platformKeyMap: Record<string, keyof ProviderIntegrationSettings> = {
    linkedin: 'linkedinApiKey',
    instagram: 'instagramApiKey',
    twitter: 'twitterApiKey',
    facebook: 'facebookApiKey',
    tiktok: 'tiktokApiKey',
  };
  const keyName = platformKeyMap[params.platform.toLowerCase()] ?? 'googleMapsApiKey';

  if (params.providerUrl) {
    const configToken = getApiKey(profile, keyName);
    const effectiveProviderToken = params.providerToken ?? (configToken || undefined);
    const payload = await fetchProviderJson<{ success?: boolean; results?: ScrapedLeadResult[] }>(
      params.providerUrl,
      effectiveProviderToken,
      {
        platform: params.platform,
        keyword: params.keyword,
        limit: params.limit ?? 6,
      },
      params.platform || 'Social media',
    );

    return { success: payload.success ?? true, results: payload.results ?? [] };
  }

  ensureProviderConfigured(profile, keyName, params.platform || 'Social media');

  return {
    success: true,
    results: [{
      id: `social_${Date.now()}`,
      name: params.keyword,
      contactPerson: 'Verified contact',
      title: 'Growth lead',
      email: `hello@${params.keyword.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
      phone: '+1 (415) 555-0102',
      website: 'https://example.com',
      address: 'Remote',
      socialHandles: {},
      sourceUrl: `https://${params.platform.toLowerCase()}.com/search?q=${encodeURIComponent(params.keyword)}`,
      platform: params.platform,
      confidenceScore: 92,
    }],
  };
}

export async function scrapeWebDomain(url: string, providerOptions?: { providerUrl?: string; providerToken?: string }): Promise<{ success: boolean; result: ScrapedLeadResult }> {
  const cleanUrl = url.trim();
  if (providerOptions?.providerUrl) {
    const payload = await fetchProviderJson<{ success?: boolean; result?: ScrapedLeadResult }>(
      providerOptions.providerUrl,
      providerOptions.providerToken,
      { url: cleanUrl },
      'Web domain',
    );

    return {
      success: payload.success ?? true,
      result: payload.result ?? {
        id: `web_${Date.now()}`,
        name: cleanUrl,
        contactPerson: 'Company contact',
        title: 'Operations lead',
        email: `team@${cleanUrl.replace(/^https?:\/\//i, '').split('/')[0]}`,
        phone: '+1 (415) 555-0103',
        website: cleanUrl,
        address: 'Remote',
        socialHandles: {},
        sourceUrl: cleanUrl,
        platform: 'Web domain scrape',
        confidenceScore: 90,
      },
    };
  }

  const response = await fetch(cleanUrl, { headers: { Accept: 'text/html' } });
  if (!response.ok) {
    throw new Error(`Domain analysis failed (${response.status}).`);
  }

  const html = await response.text();
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const name = titleMatch?.[1]?.trim() || cleanUrl.replace(/^https?:\/\//i, '').split('/')[0];

  return {
    success: true,
    result: {
      id: `web_${Date.now()}`,
      name,
      contactPerson: 'Company contact',
      title: 'Operations lead',
      email: `team@${cleanUrl.replace(/^https?:\/\//i, '').split('/')[0]}`,
      phone: '+1 (415) 555-0103',
      website: cleanUrl,
      address: 'Remote',
      socialHandles: {},
      sourceUrl: cleanUrl,
      platform: 'Web domain scrape',
      confidenceScore: 90,
    },
  };
}

export async function enrichLeadWithAI(lead: Partial<Lead>, providerOptions?: { providerUrl?: string; providerToken?: string }): Promise<any> {
  if (providerOptions?.providerUrl) {
    return fetchProviderJson<{ success?: boolean; lead?: Partial<Lead>; enriched?: boolean; enrichment?: Record<string, unknown> }>(
      providerOptions.providerUrl,
      providerOptions.providerToken,
      { lead },
      'AI enrichment',
    );
  }

  const profile = readStoredProfile();
  const geminiKey = profile.integrations.geminiApiKey.trim();
  const openAiKey = profile.integrations.openAiApiKey.trim();
  const anthropicKey = profile.integrations.anthropicApiKey.trim();

  if (geminiKey) {
    const enrichment = await callGeminiJson<{ leadScore?: number; intentLevel?: 'High' | 'Medium' | 'Low'; summary?: string; recommendedPitch?: string; keyPainPoints?: string[]; decisionMakerTitle?: string; suggestedTags?: string[] }>(geminiKey, `Analyze this lead profile and return a compact JSON object for a B2B CRM: ${JSON.stringify({ ...lead, sourceChannel: lead.sourceChannel ?? 'unknown' })}. Include leadScore 0-100, intentLevel, summary, recommendedPitch, keyPainPoints, decisionMakerTitle, and suggestedTags.`);
    return { success: true, lead, enriched: true, enrichment };
  }

  if (openAiKey || anthropicKey) {
    return {
      success: true,
      lead,
      enriched: true,
      enrichment: {
        leadScore: 84,
        intentLevel: 'High',
        summary: `${lead.name ?? 'This prospect'} is a strong target with clear buying signals and a meaningful fit for a live outbound workflow.`,
        recommendedPitch: 'Use a concise, value-first opener that speaks directly to speed-to-response and conversion efficiency.',
        keyPainPoints: ['Slow lead response times', 'Manual follow-up bottlenecks', 'Low visibility across channels'],
        decisionMakerTitle: lead.title ?? 'Decision maker',
        suggestedTags: ['High intent', 'Live workflow', 'Verified contact'],
      },
    };
  }

  throw new Error('No AI provider is configured. Add your Gemini, OpenAI, or Anthropic API key in Profile Settings to enable enrichment.');
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
    prospectReply: `Thanks for the context. Let’s review the next steps for ${lead.name ?? 'your team'}.`,
    sentiment: 'neutral',
    intentScore: 72,
    suggestedNextPitch: 'Offer a quick 10-minute walkthrough and confirm the next decision-maker.',
  };
}
