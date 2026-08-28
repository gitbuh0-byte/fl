import { Lead, ScrapedLeadResult } from '../types';

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
