import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { validatePassword } from '../services/apiService';

interface AuthPageProps {
  onBack: () => void;
  onContinue: (email: string, password: string) => Promise<void>;
  onCreateAccount: (fullName: string, email: string, password: string, confirmPassword?: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack, onContinue, onCreateAccount, onGoogleLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const passwordRequirements = validatePassword(password);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name to create an account.');
        return;
      }

      const passwordPolicyError = validatePassword(password);
      if (!email.trim() || passwordPolicyError) {
        setError(passwordPolicyError || 'Use a valid work email and a strong password.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setIsSubmitting(true);
      try {
        await onCreateAccount(fullName, email, password, confirmPassword);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to create your account');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const passwordPolicyError = validatePassword(password);
    if (!email.trim() || passwordPolicyError) {
      setError(passwordPolicyError || 'Use a valid work email and a strong password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onContinue(email, password);
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
        <h1>{mode === 'signup' ? 'Create your account.' : 'Sign in to start building.'}</h1>
        <p className="auth-lede">Bring your prospecting, pipeline, and follow-up work into one focused workspace.</p>
        <div className="auth-mode-toggle" style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <button type="button" className={mode === 'signin' ? 'auth-submit' : 'google-button'} style={{ flex: 1 }} onClick={() => setMode('signin')}>
            Sign in
          </button>
          <button type="button" className={mode === 'signup' ? 'auth-submit' : 'google-button'} style={{ flex: 1 }} onClick={() => setMode('signup')}>
            Create account
          </button>
        </div>
        <button className="google-button" onClick={() => {
          void onGoogleLogin();
        }} type="button" disabled={isSubmitting}><span className="google-mark">G</span> Continue with Google</button>
        <div className="auth-divider"><span>{mode === 'signup' ? 'or create your account' : 'or continue with email'}</span></div>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className="auth-label">Full name<div className="auth-input"><Mail size={15} /><input type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your full name" required /></div></label>
          )}
          <label className="auth-label">Work email<div className="auth-input"><Mail size={15} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required /></div></label>
          <label className="auth-label">Password<div className="auth-input"><Mail size={15} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 8 chars, 1 symbol, 1 number" required minLength={8} /></div></label>
          {mode === 'signup' && (
            <label className="auth-label">Confirm password<div className="auth-input"><Mail size={15} /><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm your password" required minLength={8} /></div></label>
          )}
          {password && passwordRequirements && <p className="auth-error" style={{ marginTop: 8 }}>{passwordRequirements}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>{mode === 'signup' ? 'Create account' : 'Continue with email'} <ArrowRight size={15} /></button>
        </form>
        {error && <p role="alert" className="auth-error">{error}</p>}
        <small className="auth-legal">By continuing, you agree to the OmniBiz terms and privacy policy.</small>
      </div>
    </main>
  );
};
