import React, { useState } from 'react';
import { ArrowLeft, Bell, Check, Mail, Save, ShieldCheck, UserRound } from 'lucide-react';

interface ProfilePageProps {
  onClose: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
  const [name, setName] = useState('Alex Sterling');
  const [email, setEmail] = useState('alex@omnibiz.co');
  const [saved, setSaved] = useState(false);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <main className="profile-page">
      <button className="profile-back" onClick={onClose}><ArrowLeft size={15} /> Back to workspace</button>
      <div className="profile-heading"><div><span className="fresh-kicker">Workspace settings</span><h1>Your profile</h1><p>Manage your account details and notification preferences.</p></div><span className="profile-large-avatar">AS</span></div>
      <div className="profile-layout">
        <form className="profile-card profile-form" onSubmit={handleSave}>
          <div className="profile-card-heading"><span className="profile-icon"><UserRound size={17} /></span><div><h2>Personal details</h2><p>How your team sees you in OmniBiz.</p></div></div>
          <label>Full name<input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>Work email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Role<input value="Sales operations lead" readOnly /></label>
          <button className="profile-save" type="submit"><Save size={15} /> {saved ? 'Changes saved' : 'Save changes'}</button>
        </form>
        <section className="profile-card">
          <div className="profile-card-heading"><span className="profile-icon blue-profile-icon"><Bell size={17} /></span><div><h2>Notifications</h2><p>Choose the updates that reach your inbox.</p></div></div>
          <label className="profile-toggle"><span><b>Lead alerts</b><small>New high-intent prospects</small></span><input type="checkbox" defaultChecked /><i><Check size={12} /></i></label>
          <label className="profile-toggle"><span><b>Task reminders</b><small>Daily follow-up queue</small></span><input type="checkbox" defaultChecked /><i><Check size={12} /></i></label>
          <label className="profile-toggle"><span><b>Weekly digest</b><small>Pipeline movement summary</small></span><input type="checkbox" /><i><Check size={12} /></i></label>
        </section>
        <section className="profile-card profile-security"><div className="profile-card-heading"><span className="profile-icon"><ShieldCheck size={17} /></span><div><h2>Account access</h2><p>Your OmniBiz workspace is protected.</p></div></div><div className="security-row"><Mail size={15} /><span><b>Verified work email</b><small>{email}</small></span><strong>Active</strong></div><div className="security-row"><ShieldCheck size={15} /><span><b>Two-factor authentication</b><small>Recommended for every workspace</small></span><button type="button">Enable</button></div></section>
      </div>
    </main>
  );
};
