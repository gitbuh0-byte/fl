import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Flame, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Video, 
  Send, 
  PhoneCall, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  MessageSquare, 
  Tag, 
  FileText,
  Volume2,
  Mic,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Lead, PipelineStage, ActivityItem } from '../types';
import { createCallSession, dispatchEmail, enrichLeadWithAI, draftPersonalizedEmail, simulateCallTurn } from '../services/apiService';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (updatedLead: Lead) => void;
  initialActionTab?: 'email' | 'call' | 'overview' | 'notes';
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateLead,
  initialActionTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'email' | 'call' | 'notes'>(initialActionTab);
  
  // AI Enrichment state
  const [isEnriching, setIsEnriching] = useState(false);

  // Email Studio state
  const [emailStep, setEmailStep] = useState(1);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isDraftingEmail, setIsDraftingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // AI Voice Call Dialer state
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [callTranscript, setCallTranscript] = useState<{ speaker: string; text: string; time: string }[]>([]);
  const [userSpokenText, setUserSpokenText] = useState('');
  const [isAIGeneratingTurn, setIsAIGeneratingTurn] = useState(false);
  const [callOutcome, setCallOutcome] = useState<'interested' | 'callback' | 'voicemail' | 'not_interested' | null>(null);

  // Notes state
  const [notesText, setNotesText] = useState(lead?.notes || '');
  const [dealValueInput, setDealValueInput] = useState(lead?.dealValue || 0);

  // Initialize draft email when modal opens or step changes
  useEffect(() => {
    if (lead && activeTab === 'email' && !emailSubject) {
      handleDraftAIEmail(1);
    }
  }, [activeTab, emailSubject, lead?.id]);

  // Call timer effect
  useEffect(() => {
    let interval: any;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen || !lead) return null;

  // AI Enrichment Handler
  const handleEnrichLead = async () => {
    setIsEnriching(true);
    try {
      const response = await enrichLeadWithAI(lead);
      if (response.enrichment) {
        const enr = response.enrichment;
        const updated: Lead = {
          ...lead,
          leadScore: enr.leadScore || lead.leadScore,
          intentLevel: enr.intentLevel || lead.intentLevel,
          dealValue: enr.estimatedDealValue || lead.dealValue,
          aiInsights: {
            summary: enr.summary,
            recommendedPitch: enr.recommendedPitch,
            keyPainPoints: enr.keyPainPoints,
            decisionMakerTitle: enr.decisionMakerTitle,
          },
          tags: Array.from(new Set([...lead.tags, ...(enr.suggestedTags || [])])),
          activityTimeline: [
            {
              id: `act_${Date.now()}`,
              type: 'enriched',
              title: 'AI Lead Intelligence Enriched',
              description: `Generated strategic pitch, key pain points, and updated fit score to ${enr.leadScore}/100.`,
              timestamp: new Date().toISOString(),
            },
            ...lead.activityTimeline,
          ],
        };
        onUpdateLead(updated);
      }
    } catch (err) {
      console.error('Enrichment error:', err);
    } finally {
      setIsEnriching(false);
    }
  };

  // Draft Email Handler
  const handleDraftAIEmail = async (step: number) => {
    setIsDraftingEmail(true);
    setEmailStep(step);
    try {
      const email = await draftPersonalizedEmail(lead, step);
      setEmailSubject(email.subject);
      setEmailBody(email.body);
    } catch (err) {
      console.error('Draft email error:', err);
    } finally {
      setIsDraftingEmail(false);
    }
  };

  // Send Email Handler
  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      const delivery = await dispatchEmail(lead, emailSubject, emailBody);
      onUpdateLead({
        ...lead,
        emailDeliveryStatus: delivery.status === 'queued' ? 'queued' : 'sent',
      });
    } catch (error) {
      console.error('Email dispatch error:', error);
      setIsSendingEmail(false);
      return;
    }

    setEmailSentSuccess(true);
    const newActivity: ActivityItem = {
      id: `act_${Date.now()}`,
      type: 'email_sent',
      title: `Email Sequence Step ${emailStep} Sent`,
      description: `Subject: "${emailSubject}" sent to ${lead.email}`,
      timestamp: new Date().toISOString(),
    };

    const updated: Lead = {
      ...lead,
      pipelineStage: lead.pipelineStage === 'new' || lead.pipelineStage === 'enriched' ? 'contacted' : lead.pipelineStage,
      emailSequenceStatus: emailStep === 1 ? 'step_1_sent' : emailStep === 2 ? 'step_2_sent' : 'completed',
      emailDeliveryStatus: 'sent',
      lastContactedAt: new Date().toISOString(),
      activityTimeline: [newActivity, ...lead.activityTimeline],
    };

    onUpdateLead(updated);
    setIsSendingEmail(false);

    setTimeout(() => {
      setEmailSentSuccess(false);
    }, 2500);
  };

  // Web Speech synthesis helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start AI Phone Call Simulator
  const handleStartCall = async () => {
    try {
      const call = await createCallSession(lead);
      onUpdateLead({
        ...lead,
        callProviderStatus: call.status === 'queued' ? 'queued' : 'connected',
      });
    } catch (error) {
      console.error('Call session error:', error);
      return;
    }
    setCallStatus('ringing');
    setCallDuration(0);
    setCallTranscript([]);
    setCallOutcome(null);

    setTimeout(() => {
      setCallStatus('connected');
      const prospectGreeting = `Hello, this is ${lead.contactPerson || 'the office'}. How can I help you today?`;
      
      setCallTranscript([
        {
          speaker: 'Prospect',
          text: prospectGreeting,
          time: '0:02',
        },
      ]);
      speakText(prospectGreeting);
    }, 1800);
  };

  // Rep submits speech in call turn
  const handleSendCallTurn = async () => {
    if (!userSpokenText.trim()) return;

    const repMessage = userSpokenText.trim();
    setUserSpokenText('');

    const newTranscript = [
      ...callTranscript,
      {
        speaker: 'AI Rep / You',
        text: repMessage,
        time: `${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')}`,
      },
    ];
    setCallTranscript(newTranscript);

    setIsAIGeneratingTurn(true);
    try {
      const response = await simulateCallTurn(lead, repMessage, newTranscript);
      setIsAIGeneratingTurn(false);

      if (response.prospectReply) {
        setCallTranscript((prev) => [
          ...prev,
          {
            speaker: 'Prospect',
            text: response.prospectReply,
            time: `${Math.floor((callDuration + 2) / 60)}:${((callDuration + 2) % 60).toString().padStart(2, '0')}`,
          },
        ]);
        speakText(response.prospectReply);

        if (response.intentScore >= 80) {
          setCallOutcome('interested');
        } else {
          setCallOutcome('callback');
        }
      }
    } catch (err) {
      setIsAIGeneratingTurn(false);
    }
  };

  // End Call & Log Activity
  const handleEndCall = () => {
    setCallStatus('ended');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const durationStr = `${Math.floor(callDuration / 60)}m ${callDuration % 60}s`;
    const outcomeTitle = 
      callOutcome === 'interested' ? 'Call Connected: Meeting Interest Confirmed' :
      callOutcome === 'callback' ? 'Call Connected: Follow-up Requested' :
      'Outbound Call Completed';

    const newActivity: ActivityItem = {
      id: `act_${Date.now()}`,
      type: 'call_connected',
      title: `${outcomeTitle} (${durationStr})`,
      description: `Spoke with ${lead.contactPerson || lead.name}. Logged dialogue transcript.`,
      timestamp: new Date().toISOString(),
    };

    const newStage: PipelineStage = 
      callOutcome === 'interested' && (lead.pipelineStage === 'new' || lead.pipelineStage === 'contacted' || lead.pipelineStage === 'enriched')
        ? 'meeting_scheduled'
        : lead.pipelineStage;

    const updated: Lead = {
      ...lead,
      pipelineStage: newStage,
      callStatus: callOutcome === 'interested' ? 'interested' : 'connected',
      callProviderStatus: 'completed',
      lastContactedAt: new Date().toISOString(),
      activityTimeline: [newActivity, ...lead.activityTimeline],
    };

    onUpdateLead(updated);
  };

  // Save Notes and Deal Value
  const handleSaveNotes = () => {
    const updated: Lead = {
      ...lead,
      notes: notesText,
      dealValue: Number(dealValueInput) || 0,
      activityTimeline: [
        {
          id: `act_${Date.now()}`,
          type: 'note_added',
          title: 'Notes & Deal Value Updated',
          description: `Updated deal value to $${Number(dealValueInput).toLocaleString()}.`,
          timestamp: new Date().toISOString(),
        },
        ...lead.activityTimeline,
      ],
    };
    onUpdateLead(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111] border border-[#222] w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Top Header - Bento */}
        <div className="p-4 sm:p-5 border-b border-[#222] bg-[#141414] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white truncate">{lead.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono bg-[#222] text-blue-400 border border-[#333]">
                  {lead.sourceChannel.replace('_', ' ')}
                </span>
                {lead.rating && (
                  <span className="text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20">
                    ★ {lead.rating} ({lead.reviewsCount} Reviews)
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">
                {lead.contactPerson || 'Decision Maker'} • {lead.title || 'Executive'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stage Selector */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#161616] p-1.5 rounded-xl border border-[#262626] font-mono">
              <span className="text-[10px] text-gray-400 uppercase font-bold px-1.5">Stage:</span>
              <select
                value={lead.pipelineStage}
                onChange={(e) => {
                  const newStage = e.target.value as PipelineStage;
                  onUpdateLead({
                    ...lead,
                    pipelineStage: newStage,
                    activityTimeline: [
                      {
                        id: `act_${Date.now()}`,
                        type: 'stage_changed',
                        title: `Pipeline Stage Updated to "${newStage}"`,
                        description: `Updated via Lead Inspector drawer.`,
                        timestamp: new Date().toISOString(),
                      },
                      ...lead.activityTimeline,
                    ],
                  });
                }}
                className="bg-[#111] text-xs font-bold text-blue-400 rounded-lg px-2 py-1 border border-[#333] focus:outline-none"
              >
                <option value="new">New Ingested</option>
                <option value="enriched">AI Enriched</option>
                <option value="contacted">Contacted</option>
                <option value="meeting_scheduled">Demo Booked</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-400 hover:text-white transition-colors cursor-pointer border border-[#2e2e2e]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Action Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-[#222] bg-[#111] text-xs font-mono">
          {[
            { id: 'overview', label: 'Intelligence & Contacts', icon: Building2 },
            { id: 'email', label: 'AI Email Studio', icon: Mail },
            { id: 'call', label: 'AI Voice Dialer', icon: PhoneCall },
            { id: 'notes', label: 'Notes & Deal Value', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-500 text-blue-400 bg-[#161616]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Main Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: OVERVIEW & INTELLIGENCE */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Information Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-[#161616] p-3.5 rounded-xl border border-[#262626] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold font-mono">Verified Phone</span>
                      <p className="text-xs font-mono font-bold text-white mt-0.5">{lead.phone || 'Not available'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('call')}
                    className="text-[11px] font-bold px-2 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 cursor-pointer font-mono"
                  >
                    Dial
                  </button>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-[#262626] bg-[#161616] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold font-mono">Verified Email</span>
                      <p className="text-xs font-mono text-white mt-0.5 truncate max-w-[140px]">{lead.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('email')}
                    className="text-[11px] font-bold px-2 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 cursor-pointer font-mono"
                  >
                    Email
                  </button>
                </div>

                <div className="bg-[#161616] p-3.5 rounded-xl border border-[#262626] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold font-mono">Website</span>
                      <p className="text-xs text-blue-400 mt-0.5 truncate max-w-[140px] font-mono">
                        {lead.website ? lead.website.replace(/^https?:\/\//, '') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  {lead.website && (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold px-2 py-1 rounded bg-[#222] text-blue-400 hover:bg-blue-600 hover:text-white flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Scraped Social Channels */}
              {lead.socialHandles && Object.keys(lead.socialHandles).length > 0 && (
                <div className="bg-[#161616] p-4 rounded-xl border border-[#262626]">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
                    Scraped Social Profiles:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2 font-mono">
                    {lead.socialHandles.linkedin && (
                      <a
                        href={lead.socialHandles.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-600/30 text-xs font-semibold hover:bg-blue-600/40"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {lead.socialHandles.instagram && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600/20 text-pink-300 border border-pink-600/30 text-xs font-semibold">
                        <Instagram className="w-3.5 h-3.5" />
                        <span>{lead.socialHandles.instagram}</span>
                      </span>
                    )}
                    {lead.socialHandles.twitter && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#222] text-blue-400 border border-[#333] text-xs font-semibold">
                        <Twitter className="w-3.5 h-3.5" />
                        <span>{lead.socialHandles.twitter}</span>
                      </span>
                    )}
                    {lead.socialHandles.facebook && (
                      <a
                        href={lead.socialHandles.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800/20 text-blue-300 border border-blue-800/30 text-xs font-semibold"
                      >
                        <Facebook className="w-3.5 h-3.5" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {lead.socialHandles.tiktok && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-600/30 text-xs font-semibold">
                        <Video className="w-3.5 h-3.5" />
                        <span>{lead.socialHandles.tiktok}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* AI Strategic Deal Intelligence Card */}
              <div className="bg-[#161616] p-5 rounded-2xl border border-[#262626] shadow-xl relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">AI Deal Intelligence & Pitch Angle</h3>
                  </div>

                  <button
                    onClick={handleEnrichLead}
                    disabled={isEnriching}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer font-mono"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isEnriching ? 'animate-spin' : ''}`} />
                    <span>{isEnriching ? 'Analyzing...' : 'Re-Enrich AI'}</span>
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {lead.aiInsights?.summary && (
                    <div className="bg-[#111] p-3 rounded-xl border border-[#222]">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] font-mono">Executive Summary:</span>
                      <p className="text-gray-300 mt-1">{lead.aiInsights.summary}</p>
                    </div>
                  )}

                  {lead.aiInsights?.recommendedPitch && (
                    <div className="bg-[#141824] p-3 rounded-xl border border-blue-900/50">
                      <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] font-mono">Recommended Sales Pitch Angle:</span>
                      <p className="text-blue-100 font-medium mt-1">{lead.aiInsights.recommendedPitch}</p>
                    </div>
                  )}

                  {lead.aiInsights?.keyPainPoints && (
                    <div className="bg-[#111] p-3 rounded-xl border border-[#222]">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] font-mono">Key Prospect Bottlenecks:</span>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-gray-300">
                        {lead.aiInsights.keyPainPoints.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 font-mono">
                  Discovery & Engagement Timeline
                </h3>
                <div className="space-y-2.5">
                  {lead.activityTimeline.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#161616] p-3 rounded-xl border border-[#262626] flex items-start gap-3"
                    >
                      <div className="p-1.5 rounded-lg bg-[#111] text-blue-400 border border-[#222] shrink-0 mt-0.5">
                        {item.type.includes('email') ? <Mail className="w-3.5 h-3.5" /> :
                         item.type.includes('call') ? <PhoneCall className="w-3.5 h-3.5" /> :
                         item.type === 'enriched' ? <Sparkles className="w-3.5 h-3.5" /> :
                         <Clock className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{item.title}</h4>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-300 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI COLD EMAIL STUDIO */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="bg-[#161616] p-4 rounded-xl border border-[#262626] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Automated Email Cadence</h3>
                  <p className="text-[11px] text-gray-400 font-mono">Personalized outreach referencing scraped niche & reviews</p>
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  {[1, 2, 3].map((step) => (
                    <button
                      key={step}
                      onClick={() => handleDraftAIEmail(step)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        emailStep === step
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#111] text-gray-400 border border-[#222]'
                      }`}
                    >
                      Step {step} {step === 1 ? '(Intro)' : step === 2 ? '(Value)' : '(Breakup)'}
                    </button>
                  ))}
                </div>
              </div>

              {isDraftingEmail ? (
                <div className="p-8 text-center bg-[#161616] rounded-xl border border-[#262626] space-y-2 font-mono">
                  <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
                  <p className="text-xs text-gray-300">Gemini is drafting high-converting cold email tailored to {lead.name}...</p>
                </div>
              ) : (
                <div className="space-y-3 font-mono">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Subject Line</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Email Body</label>
                    <textarea
                      rows={7}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full bg-[#161616] border border-[#262626] rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-gray-400">
                      Sending to: <strong className="text-blue-400">{lead.email}</strong>
                    </div>

                    <button
                      onClick={handleSendEmail}
                      disabled={isSendingEmail}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 cursor-pointer uppercase tracking-wider"
                    >
                      {emailSentSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>{isSendingEmail ? 'Dispatching...' : 'Email Dispatched!'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Dispatch Email Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INTERACTIVE AI VOICE CALL DIALER */}
          {activeTab === 'call' && (
            <div className="space-y-4">
              <div className="bg-[#161616] p-5 rounded-2xl border border-[#262626] text-center space-y-3 font-mono">
                <div className="flex items-center justify-center gap-3">
                  <div className={`p-3 rounded-2xl ${
                    callStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' :
                    callStatus === 'ringing' ? 'bg-amber-500/20 text-amber-400 animate-bounce' :
                    'bg-[#111] text-gray-400 border border-[#222]'
                  }`}>
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-white">{lead.name}</h3>
                    <p className="text-xs font-mono text-emerald-400">{lead.phone || '+1 (555) 000-0000'}</p>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold text-gray-300">
                  Status: {
                    callStatus === 'idle' ? 'Ready to Call' :
                    callStatus === 'ringing' ? 'Ringing Prospect Line...' :
                    callStatus === 'connected' ? `Live Call in Progress (${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')})` :
                    'Call Ended'
                  }
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  {callStatus === 'idle' || callStatus === 'ended' ? (
                    <button
                      onClick={handleStartCall}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 cursor-pointer uppercase tracking-wider"
                    >
                      <Phone className="w-4 h-4 fill-current" />
                      <span>Start AI Outbound Call</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleEndCall}
                      className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 cursor-pointer uppercase tracking-wider"
                    >
                      <X className="w-4 h-4" />
                      <span>Hang Up & Log Call</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Call Transcript Box */}
              {callTranscript.length > 0 && (
                <div className="bg-[#161616] p-4 rounded-xl border border-[#262626] space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs text-gray-400 border-b border-[#222] pb-2">
                    <span className="font-bold uppercase tracking-wider">Live Call Audio Transcript:</span>
                    <span className="text-[10px] text-emerald-400">Speech Synthesizer Audio Active</span>
                  </div>

                  <div className="space-y-2.5 max-h-52 overflow-y-auto">
                    {callTranscript.map((t, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl text-xs space-y-0.5 ${
                          t.speaker === 'Prospect'
                            ? 'bg-[#111] text-blue-200 border border-[#222] ml-4'
                            : 'bg-emerald-950/30 text-emerald-200 border border-emerald-900/40 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className={t.speaker === 'Prospect' ? 'text-blue-400' : 'text-emerald-400'}>
                            {t.speaker}
                          </span>
                          <span className="text-gray-500 font-mono">{t.time}</span>
                        </div>
                        <p className="leading-relaxed">{t.text}</p>
                      </div>
                    ))}
                  </div>

                  {callStatus === 'connected' && (
                    <div className="flex gap-2 pt-2 border-t border-[#222]">
                      <input
                        type="text"
                        value={userSpokenText}
                        onChange={(e) => setUserSpokenText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendCallTurn()}
                        placeholder="Type sales pitch (e.g. 'We help reduce appointment no-shows...')"
                        className="flex-1 bg-[#111] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={handleSendCallTurn}
                        disabled={isAIGeneratingTurn}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        {isAIGeneratingTurn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Pitch</span>}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NOTES & DEAL VALUE */}
          {activeTab === 'notes' && (
            <div className="space-y-4 font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Estimated Deal Value ($ USD)</label>
                  <input
                    type="number"
                    value={dealValueInput}
                    onChange={(e) => setDealValueInput(Number(e.target.value))}
                    className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Assigned Sales Rep</label>
                  <input
                    type="text"
                    value={lead.assignedTo}
                    onChange={(e) => onUpdateLead({ ...lead, assignedTo: e.target.value })}
                    className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Internal CRM Notes & Discovery Log</label>
                <textarea
                  rows={6}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Record call summaries, prospect objections, custom requests..."
                  className="w-full bg-[#161616] border border-[#262626] rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500 leading-relaxed font-mono"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer uppercase tracking-wider"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
