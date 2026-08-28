import React, { useState } from 'react';
import { 
  Mail, 
  PhoneCall, 
  Clock, 
  CheckCircle2, 
  Play, 
  Pause, 
  Sparkles, 
  Plus, 
  Send, 
  Users, 
  TrendingUp, 
  Calendar, 
  AlertCircle,
  Volume2,
  Check
} from 'lucide-react';
import { EmailCadence, FollowUpTask, Lead } from '../types';

interface AutomationSequencesProps {
  emailCadences: EmailCadence[];
  followUpTasks: FollowUpTask[];
  leads: Lead[];
  onCompleteTask: (taskId: string) => void;
  onSelectLeadById: (leadId: string) => void;
  onLaunchDialerForLead: (lead: Lead) => void;
}

export const AutomationSequences: React.FC<AutomationSequencesProps> = ({
  emailCadences,
  followUpTasks,
  leads,
  onCompleteTask,
  onSelectLeadById,
  onLaunchDialerForLead,
}) => {
  const [selectedCadence, setSelectedCadence] = useState<EmailCadence>(emailCadences[0]);
  const [activeSubTab, setActiveSubTab] = useState<'cadences' | 'dialer_studio' | 'task_queue'>('cadences');
  const [testLeadName, setTestLeadName] = useState('Dr. Marcus Vance');
  const [testLeadCompany, setTestLeadCompany] = useState('Apex Dental Care');
  const [testLeadCity, setTestLeadCity] = useState('Austin');

  const pendingTasks = followUpTasks.filter(t => !t.completed);
  const completedTasks = followUpTasks.filter(t => t.completed);

  // Replace variable chips in template
  const renderSamplePreview = (template: string) => {
    return template
      .replace(/{{name}}/g, testLeadName)
      .replace(/{{company}}/g, testLeadCompany)
      .replace(/{{city}}/g, testLeadCity)
      .replace(/{{category}}/g, 'Cosmetic Dentistry')
      .replace(/{{sourceChannel}}/g, 'Google Maps');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header & Subtabs Bento Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span>Automated Follow-ups & AI Dialer</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Automated multi-step email cadences, outbound AI voice dialer, and actionable task queues.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#111] p-1.5 rounded-xl border border-[#222] self-start">
          <button
            onClick={() => setActiveSubTab('cadences')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${
              activeSubTab === 'cadences'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Drip Cadences</span>
          </button>

          <button
            onClick={() => setActiveSubTab('dialer_studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${
              activeSubTab === 'dialer_studio'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>AI Voice Dialer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('task_queue')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${
              activeSubTab === 'task_queue'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Task Queue ({pendingTasks.length})</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: EMAIL CADENCES */}
      {activeSubTab === 'cadences' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Cadences List */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">Active Automated Sequences</h2>
            {emailCadences.map((cad) => (
              <div
                key={cad.id}
                onClick={() => setSelectedCadence(cad)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedCadence.id === cad.id
                    ? 'bg-[#141824] border-blue-500 shadow-xl'
                    : 'bg-[#111] border-[#222] hover:border-[#333]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1f1f1f] text-blue-400 border border-[#2a2a2a] font-mono">
                    {cad.targetChannel}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{cad.openRate}% Open</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2">{cad.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cad.description}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 pt-2 border-t border-[#222] font-mono">
                  <span>{cad.steps.length} Automated Steps</span>
                  <span><strong className="text-white">{cad.activeEnrollments}</strong> Leads Enrolled</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Sequence Steps Visualizer */}
          <div className="lg:col-span-2 bg-[#111] rounded-2xl p-6 border border-[#222] shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
              <div>
                <h3 className="text-base font-bold text-white">{selectedCadence.name}</h3>
                <p className="text-xs text-gray-400">{selectedCadence.description}</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-gray-400">Open Rate: <strong className="text-emerald-400">{selectedCadence.openRate}%</strong></span>
                <span className="text-gray-400">Reply Rate: <strong className="text-blue-400">{selectedCadence.replyRate}%</strong></span>
              </div>
            </div>

            {/* Sequence Steps */}
            <div className="space-y-4">
              {selectedCadence.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="bg-[#161616] rounded-xl p-4 border border-[#262626] space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center text-xs font-bold font-mono">
                        {step.stepNumber}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {step.delayDays === 0 ? 'Trigger Immediately (<2m of scrape/ingest)' : `Delay: ${step.delayDays} Days After Step ${step.stepNumber - 1}`}
                      </span>
                    </div>

                    <span className="text-[11px] text-gray-500 font-mono">
                      Dynamic Personalization Active
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-gray-400 font-mono">
                      Subject: <strong className="text-gray-200">{renderSamplePreview(step.subject)}</strong>
                    </div>
                    <div className="bg-[#111] p-3.5 rounded-xl border border-[#222] text-gray-300 whitespace-pre-line font-mono text-[11px] leading-relaxed">
                      {renderSamplePreview(step.bodyTemplate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: AI VOICE DIALER STUDIO */}
      {activeSubTab === 'dialer_studio' && (
        <div className="space-y-4">
          <div className="bg-[#111] rounded-2xl p-6 border border-[#222] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Outbound AI Voice Dialer & Smart Qualifier</h2>
                  <p className="text-xs text-gray-400">
                    Instantly dial leads extracted from Google Maps, Meta Ads, and social channels with speech synthesis.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-blue-950/40 text-blue-400 text-xs font-mono font-bold border border-blue-500/30">
                VOICE SYNTHESIS READY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#161616] p-4 rounded-xl border border-[#262626] space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase font-mono">Average Call Response</span>
                <p className="text-2xl font-bold text-white font-mono">1m 42s</p>
                <span className="text-[11px] text-emerald-400 font-mono">+18% faster connection vs standard</span>
              </div>

              <div className="bg-[#161616] p-4 rounded-xl border border-[#262626] space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase font-mono">Positive Booking Rate</span>
                <p className="text-2xl font-bold text-blue-400 font-mono">41.8%</p>
                <span className="text-[11px] text-gray-400 font-mono">Verified telephone lines</span>
              </div>

              <div className="bg-[#161616] p-4 rounded-xl border border-[#262626] space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase font-mono">Objection Accuracy</span>
                <p className="text-2xl font-bold text-emerald-400 font-mono">94.2%</p>
                <span className="text-[11px] text-gray-400 font-mono">Gemini 3.7 B2B resolution</span>
              </div>
            </div>

            {/* Quick Dial Leads Table */}
            <div className="pt-4 border-t border-[#222]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 font-mono">
                Prospects Ready for AI Voice Outreach:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {leads.filter(l => l.phone).slice(0, 6).map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-between gap-3 hover:border-[#333] transition-colors"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{lead.name}</h4>
                      <p className="text-[11px] text-gray-400">{lead.contactPerson} • <span className="font-mono text-emerald-400">{lead.phone}</span></p>
                    </div>

                    <button
                      onClick={() => onLaunchDialerForLead(lead)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer whitespace-nowrap font-mono uppercase tracking-wider"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Launch Call</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: TASK QUEUE */}
      {activeSubTab === 'task_queue' && (
        <div className="space-y-4">
          <div className="bg-[#111] rounded-2xl p-6 border border-[#222] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Daily Follow-Up Tasks & Reminders</h2>
                <p className="text-xs text-gray-400">High-priority manual calls, email cadence approvals, and demo reviews</p>
              </div>
              <span className="text-xs font-mono text-blue-400 bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-900/50">
                {pendingTasks.length} Pending Tasks
              </span>
            </div>

            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#161616] p-4 rounded-xl border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#333] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        task.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        task.priority === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {task.priority}
                      </span>
                      <h4 className="text-xs font-bold text-white">{task.leadCompany} ({task.leadName})</h4>
                    </div>

                    <p className="text-xs text-gray-300 mt-1">{task.notes}</p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1.5 font-mono">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Clock className="w-3 h-3" /> Due: {task.dueDate}
                      </span>
                      <span>•</span>
                      <span>{task.leadPhone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center font-mono">
                    <button
                      onClick={() => onSelectLeadById(task.leadId)}
                      className="px-3 py-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-gray-200 text-xs font-semibold border border-[#333] cursor-pointer"
                    >
                      Open Lead
                    </button>

                    <button
                      onClick={() => onCompleteTask(task.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  </div>
                </div>
              ))}

              {pendingTasks.length === 0 && (
                <div className="text-center py-12 border border-dashed border-[#262626] rounded-xl space-y-2 font-mono">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-white">All Follow-Up Tasks Complete!</p>
                  <p className="text-xs text-gray-500">Your pipeline is up to date.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
