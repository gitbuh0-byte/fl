import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { DashboardFresh } from './components/DashboardFresh';
import { ScraperWorkbench } from './components/ScraperWorkbench';
import { PipelineKanban } from './components/PipelineKanban';
import { AutomationSequences } from './components/AutomationSequences';
import { CampaignsManager } from './components/CampaignsManager';
import { LeadDetailModal } from './components/LeadDetailModal';
import { CreateLeadModal } from './components/CreateLeadModal';
import { ProfilePage } from './components/ProfilePage';
import { AuthPage } from './components/AuthPage';
import { 
  initialLeads, 
  initialCampaigns, 
  initialCadences, 
  initialFollowUpTasks 
} from './data/initialData';
import { Lead, PipelineStage, Campaign, FollowUpTask } from './types';
import { downloadLeadsCSV } from './utils/csvExport';

export function App() {
  type AppView = 'landing' | 'auth' | 'dashboard' | 'scraper' | 'pipeline' | 'automation' | 'campaigns';
  const [dashboardInstance, setDashboardInstance] = useState(0);
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const savedView = sessionStorage.getItem('omnibiz-current-view');
    return savedView === 'auth' || savedView === 'dashboard' || savedView === 'scraper' || savedView === 'pipeline' || savedView === 'automation' || savedView === 'campaigns'
      ? savedView
      : 'landing';
  });

  useEffect(() => {
    sessionStorage.setItem('omnibiz-current-view', currentView);
  }, [currentView]);

  const handleNavigate = (view: AppView) => {
    setIsProfileOpen(false);
    if (view === 'dashboard' && currentView === 'dashboard') {
      setDashboardInstance((instance) => instance + 1);
    }
    setCurrentView(view);
  };

  // Application Data State
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [cadences] = useState(initialCadences);
  const [tasks, setTasks] = useState<FollowUpTask[]>(initialFollowUpTasks);

  // Modal / Drawer Selection State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalInitialTab, setLeadModalInitialTab] = useState<'overview' | 'email' | 'call' | 'notes'>('overview');
  const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDownloadAllLeads = () => {
    downloadLeadsCSV(leads, `omnibiz_all_leads_${new Date().toISOString().split('T')[0]}.csv`);
    showToast(`Exported ${leads.length} leads to CSV successfully!`);
  };

  // Filtered Leads according to search query
  const displayedLeads = leads.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      (l.contactPerson && l.contactPerson.toLowerCase().includes(q)) ||
      (l.phone && l.phone.includes(q)) ||
      (l.website && l.website.toLowerCase().includes(q)) ||
      (l.tags && l.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  // Lead Operations
  const handleImportLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    showToast(`Lead "${newLead.name}" imported to CRM Pipeline!`);
  };

  const handleBatchImportLeads = (newLeads: Lead[]) => {
    setLeads((prev) => [...newLeads, ...prev]);
    showToast(`Batch imported ${newLeads.length} leads into CRM Pipeline!`);
  };

  const handleUpdateLead = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    if (selectedLead?.id === updated.id) {
      setSelectedLead(updated);
    }
  };

  const handleUpdateLeadStage = (leadId: string, newStage: PipelineStage) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            pipelineStage: newStage,
            activityTimeline: [
              {
                id: `act_${Date.now()}`,
                type: 'stage_changed',
                title: `Moved to ${newStage.replace('_', ' ').toUpperCase()}`,
                description: `Pipeline stage updated.`,
                timestamp: new Date().toISOString(),
              },
              ...l.activityTimeline,
            ],
          };
        }
        return l;
      })
    );
  };

  const handleOpenLeadDetail = (lead: Lead, initialTab: 'overview' | 'email' | 'call' | 'notes' = 'overview') => {
    setSelectedLead(lead);
    setLeadModalInitialTab(initialTab);
    setIsLeadModalOpen(true);
  };

  const handleSelectLeadById = (leadId: string) => {
    const found = leads.find((l) => l.id === leadId);
    if (found) {
      handleOpenLeadDetail(found, 'overview');
    }
  };

  const handleLaunchDialerForLead = (lead: Lead) => {
    handleOpenLeadDetail(lead, 'call');
  };

  // Task Operations
  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
    );
    showToast('Task marked as completed!');
  };

  // Campaign Operations
  const handleToggleCampaignStatus = (campId: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campId
          ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
          : c
      )
    );
  };

  const handleCreateCampaign = (camp: Campaign) => {
    setCampaigns((prev) => [camp, ...prev]);
    showToast(`Campaign "${camp.name}" created with webhook ingestor!`);
  };

  const handleSimulateWebhookLead = (camp: Campaign) => {
    const channelMap: Record<string, any> = {
      'Meta Ads': 'meta_ads',
      'Google Ads': 'google_ads',
      'LinkedIn Ads': 'linkedin_ads',
      'TikTok Ads': 'tiktok_ads',
    };
    const mappedSource = channelMap[camp.platform] || 'meta_ads';

    const mockLead: Lead = {
      id: `lead_webhook_${Date.now()}`,
      name: `${camp.platform} Inbound Prospect`,
      contactPerson: 'Alex Rivera',
      title: 'Practice Director',
      email: 'alex.rivera@prospectinc.com',
      phone: '+1 (512) 887-1920',
      website: 'https://prospectinc.com',
      socialHandles: {
        linkedin: 'https://linkedin.com/company/prospect-inc',
      },
      sourceChannel: mappedSource,
      sourceDetails: {
        campaignName: camp.name,
        utmSource: camp.utmSource,
        utmMedium: camp.utmMedium,
        utmCampaign: camp.utmCampaign,
        cpl: camp.cpl || 35,
      },
      pipelineStage: 'new',
      dealValue: 14500,
      leadScore: 94,
      intentLevel: 'High',
      tags: ['Webhook Ingested', camp.name, 'High Priority'],
      notes: `Instant lead form submission from ${camp.name}.`,
      assignedTo: 'Sarah Connor',
      createdAt: new Date().toISOString(),
      emailSequenceStatus: 'enrolled',
      callStatus: 'not_called',
      activityTimeline: [
        {
          id: `act_${Date.now()}`,
          type: 'ingested',
          title: `Lead Ingested from ${camp.platform} Webhook`,
          description: `Captured via ad campaign form "${camp.name}".`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setLeads((prev) => [mockLead, ...prev]);
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === camp.id
          ? {
              ...c,
              leadsCount: (c.leadsCount || 0) + 1,
              spend: (c.spend || 0) + (c.cpl || 35),
              revenue: (c.revenue || 0) + 14500,
            }
          : c
      )
    );
    showToast(`Instant Lead Captured from ${camp.name}!`);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white ${currentView === 'landing' ? '' : 'dashboard-shell'}`}>
      {/* Bento Header & Telemetry Bar (Shown when inside the app) */}
      {currentView !== 'landing' && currentView !== 'auth' && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          leadsCount={leads.length}
          pendingFollowupsCount={tasks.filter((t) => !t.completed).length}
          onOpenNewLeadModal={() => setIsCreateLeadModalOpen(true)}
          onOpenQuickScrape={() => setCurrentView('scraper')}
          onDownloadCSV={handleDownloadAllLeads}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      )}

      {/* Main Bento Canvas Area */}
      {currentView === 'landing' ? (
        <LandingPage
          onEnterApp={(targetView) => setCurrentView(targetView || 'auth')}
          sampleLeads={leads}
        />
      ) : currentView === 'auth' ? (
        <AuthPage onBack={() => setCurrentView('landing')} onContinue={() => setCurrentView('dashboard')} />
      ) : (
        isProfileOpen ? (
          <ProfilePage onClose={() => setIsProfileOpen(false)} />
        ) : (
        <main className="dashboard-main flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {currentView === 'dashboard' && (
            <DashboardFresh
              key={dashboardInstance}
              leads={displayedLeads}
              campaigns={campaigns}
              emailCadences={cadences}
              followUpTasks={tasks}
              onSelectLead={handleOpenLeadDetail}
              onImportLead={handleImportLead}
              onBatchImportLeads={handleBatchImportLeads}
              onUpdateLeadStage={handleUpdateLeadStage}
              onOpenNewLeadModal={() => setIsCreateLeadModalOpen(true)}
              onLaunchDialerForLead={(lead) => handleOpenLeadDetail(lead, 'call')}
              onCompleteTask={handleCompleteTask}
              onToggleCampaignStatus={handleToggleCampaignStatus}
              onCreateCampaign={handleCreateCampaign}
              onSimulateWebhookLead={handleSimulateWebhookLead}
              onDownloadCSV={handleDownloadAllLeads}
              onNavigateToView={setCurrentView}
            />
          )}

          {currentView === 'scraper' && (
            <ScraperWorkbench
              onImportLead={handleImportLead}
              onBatchImportLeads={handleBatchImportLeads}
              existingLeads={leads}
            />
          )}

          {currentView === 'pipeline' && (
            <PipelineKanban
              leads={displayedLeads}
              onSelectLead={handleOpenLeadDetail}
              onUpdateLeadStage={handleUpdateLeadStage}
              onOpenNewLeadModal={() => setIsCreateLeadModalOpen(true)}
              onLaunchDialerForLead={handleLaunchDialerForLead}
            />
          )}

          {currentView === 'automation' && (
            <AutomationSequences
              emailCadences={cadences}
              followUpTasks={tasks}
              leads={leads}
              onCompleteTask={handleCompleteTask}
              onSelectLeadById={handleSelectLeadById}
              onLaunchDialerForLead={handleLaunchDialerForLead}
            />
          )}

          {currentView === 'campaigns' && (
            <CampaignsManager
              campaigns={campaigns}
              onToggleCampaignStatus={handleToggleCampaignStatus}
              onCreateCampaign={handleCreateCampaign}
              onSimulateWebhookLead={handleSimulateWebhookLead}
            />
          )}
        </main>
        )
      )}

      {/* Lead Detail & AI Outreach Drawer Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onUpdateLead={handleUpdateLead}
        initialActionTab={leadModalInitialTab}
      />

      {/* Create Lead Modal */}
      <CreateLeadModal
        isOpen={isCreateLeadModalOpen}
        onClose={() => setIsCreateLeadModalOpen(false)}
        onCreateLead={handleImportLead}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161616] text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/40 flex items-center gap-3 font-mono text-xs animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
