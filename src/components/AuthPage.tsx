import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
  onContinue: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack, onContinue }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onContinue();
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <button className="auth-back" onClick={onBack}><ArrowLeft size={15} /> Back to OmniBiz</button>
        <div className="auth-brand"><span className="brand-mark">O</span><span>OmniBiz</span></div>
        <span className="auth-kicker">Your workspace awaits</span>
        <h1>Sign in to start building.</h1>
        <p className="auth-lede">Bring your prospecting, pipeline, and follow-up work into one focused workspace.</p>
        <button className="google-button" onClick={onContinue} type="button"><span className="google-mark">G</span> Continue with Google</button>
        <div className="auth-divider"><span>or continue with email</span></div>
        <form onSubmit={handleSubmit}>
          <label className="auth-label">Work email<div className="auth-input"><Mail size={15} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required /></div></label>
          <button className="auth-submit" type="submit">Continue with email <ArrowRight size={15} /></button>
        </form>
        <small className="auth-legal">By continuing, you agree to the OmniBiz terms and privacy policy.</small>
      </div>
    </main>
  );
};
