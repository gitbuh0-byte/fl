import React, { useState } from 'react';
import { ArrowLeft, Bell, Check, Mail, Save, ShieldCheck, UserRound } from 'lucide-react';
import { ProfileSettings, createDefaultProfileSettings } from '../services/apiService';

interface ProfilePageProps {
  onClose: () => void;
  profile: ProfileSettings;
  onSaveProfile: (profile: ProfileSettings) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onClose, profile, onSaveProfile }) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [role, setRole] = useState(profile.role);
  const [company, setCompany] = useState(profile.company);
  const [notifications, setNotifications] = useState(profile.notifications);
  const [integrations, setIntegrations] = useState(profile.integrations);
  const [saved, setSaved] = useState(false);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    onSaveProfile(createDefaultProfileSettings({ name, email, role, company, notifications, integrations }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const updateIntegration = (key: keyof typeof integrations, value: string) => {
    setIntegrations((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="profile-page">
      <button className="profile-back" onClick={onClose}><ArrowLeft size={15} /> Back to workspace</button>
      <div className="profile-heading"><div><span className="fresh-kicker">Workspace settings</span><h1>Your profile</h1><p>Manage account details, notification preferences, and live provider keys.</p></div><span className="profile-large-avatar">AS</span></div>
      <div className="profile-layout">
        <form className="profile-card profile-form" onSubmit={handleSave}>
          <div className="profile-card-heading"><span className="profile-icon"><UserRound size={17} /></span><div><h2>Personal details</h2><p>How your team sees you in OmniBiz.</p></div></div>
          <label>Full name<input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>Work email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Role<input value={role} onChange={(event) => setRole(event.target.value)} /></label>
          <label>Company<input value={company} onChange={(event) => setCompany(event.target.value)} /></label>
          <button className="profile-save" type="submit"><Save size={15} /> {saved ? 'Changes saved' : 'Save changes'}</button>
        </form>
        <section className="profile-card">
          <div className="profile-card-heading"><span className="profile-icon blue-profile-icon"><Bell size={17} /></span><div><h2>Notifications</h2><p>Choose the updates that reach your inbox.</p></div></div>
          <label className="profile-toggle"><span><b>Lead alerts</b><small>New high-intent prospects</small></span><input type="checkbox" checked={notifications.leadAlerts} onChange={(event) => setNotifications({ ...notifications, leadAlerts: event.target.checked })} /><i><Check size={12} /></i></label>
          <label className="profile-toggle"><span><b>Task reminders</b><small>Daily follow-up queue</small></span><input type="checkbox" checked={notifications.taskReminders} onChange={(event) => setNotifications({ ...notifications, taskReminders: event.target.checked })} /><i><Check size={12} /></i></label>
          <label className="profile-toggle"><span><b>Weekly digest</b><small>Pipeline movement summary</small></span><input type="checkbox" checked={notifications.weeklyDigest} onChange={(event) => setNotifications({ ...notifications, weeklyDigest: event.target.checked })} /><i><Check size={12} /></i></label>
        </section>
        <section className="profile-card profile-security">
          <div className="profile-card-heading"><span className="profile-icon"><ShieldCheck size={17} /></span><div><h2>Provider access</h2><p>Store the live keys needed for Google Maps, social scraping, and AI enrichment.</p></div></div>
          <div className="space-y-3">
            <label>Google Maps API Key<input type="password" value={integrations.googleMapsApiKey} onChange={(event) => updateIntegration('googleMapsApiKey', event.target.value)} /></label>
            <label>Gemini API Key<input type="password" value={integrations.geminiApiKey} onChange={(event) => updateIntegration('geminiApiKey', event.target.value)} /></label>
            <label>OpenAI API Key<input type="password" value={integrations.openAiApiKey} onChange={(event) => updateIntegration('openAiApiKey', event.target.value)} /></label>
            <label>Anthropic API Key<input type="password" value={integrations.anthropicApiKey} onChange={(event) => updateIntegration('anthropicApiKey', event.target.value)} /></label>
            <label>LinkedIn API Key<input type="password" value={integrations.linkedinApiKey} onChange={(event) => updateIntegration('linkedinApiKey', event.target.value)} /></label>
            <label>Instagram API Key<input type="password" value={integrations.instagramApiKey} onChange={(event) => updateIntegration('instagramApiKey', event.target.value)} /></label>
            <label>Twitter/X API Key<input type="password" value={integrations.twitterApiKey} onChange={(event) => updateIntegration('twitterApiKey', event.target.value)} /></label>
            <label>Facebook API Key<input type="password" value={integrations.facebookApiKey} onChange={(event) => updateIntegration('facebookApiKey', event.target.value)} /></label>
            <label>TikTok API Key<input type="password" value={integrations.tiktokApiKey} onChange={(event) => updateIntegration('tiktokApiKey', event.target.value)} /></label>
          </div>
          <div className="security-row"><Mail size={15} /><span><b>Verified work email</b><small>{email}</small></span><strong>Active</strong></div>
          <div className="security-row"><ShieldCheck size={15} /><span><b>Workspace protection</b><small>Keys stay in your saved profile settings</small></span><button type="button">Protected</button></div>
        </section>
      </div>
    </main>
  );
};
