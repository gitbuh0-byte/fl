import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
  onContinue: (email: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack, onContinue, onGoogleLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await onContinue(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <button className="auth-back" onClick={onBack}><ArrowLeft size={15} /> Back to OmniBiz</button>
        <div className="auth-brand"><span className="brand-mark">O</span><span>OmniBiz</span></div>
        <span className="auth-kicker">Your workspace awaits</span>
        <h1>Sign in to start building.</h1>
        <p className="auth-lede">Bring your prospecting, pipeline, and follow-up work into one focused workspace.</p>
        <button className="google-button" onClick={() => {
          void onGoogleLogin();
        }} type="button" disabled={isSubmitting}><span className="google-mark">G</span> Continue with Google</button>
        <div className="auth-divider"><span>or continue with email</span></div>
        <form onSubmit={handleSubmit}>
          <label className="auth-label">Work email<div className="auth-input"><Mail size={15} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required /></div></label>
          <button className="auth-submit" type="submit" disabled={isSubmitting}>Continue with email <ArrowRight size={15} /></button>
        </form>
        {error && <p role="alert" className="auth-error">{error}</p>}
        <small className="auth-legal">By continuing, you agree to the OmniBiz terms and privacy policy.</small>
      </div>
    </main>
  );
};
