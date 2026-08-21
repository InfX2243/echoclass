import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import type { AuthRole } from '../auth/AuthContext';

export function RoleOnboardingPage() {
  const navigate = useNavigate();
  const { setRole } = useAuth();
  const [role, setSelectedRole] = useState<AuthRole>('STUDENT');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function continueWithRole() {
    setBusy(true); setError('');
    try {
      await setRole(role);
      navigate(role === 'TEACHER' ? '/teacher/dashboard' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save your role.');
    } finally { setBusy(false); }
  }

  return <main className="grid min-h-screen place-items-center bg-background px-5 py-12"><section className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-sm sm:p-8"><h1 className="text-2xl font-semibold tracking-tight">Tell us how you’ll use EchoClass.</h1><p className="mt-2 text-sm text-muted-foreground">Choose your role so we can take you to the right experience.</p><div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setSelectedRole('STUDENT')} className={`rounded-xl border p-4 text-left ${role === 'STUDENT' ? 'border-primary ring-1 ring-primary' : ''}`}><span className="font-medium">Student</span><span className="mt-1 block text-sm text-muted-foreground">Learn, practice and revisit lessons.</span></button><button type="button" onClick={() => setSelectedRole('TEACHER')} className={`rounded-xl border p-4 text-left ${role === 'TEACHER' ? 'border-primary ring-1 ring-primary' : ''}`}><span className="font-medium">Teacher</span><span className="mt-1 block text-sm text-muted-foreground">Create classes and manage lessons.</span></button></div>{error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}<button type="button" disabled={busy} onClick={continueWithRole} className="mt-6 h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50">{busy ? 'Saving…' : 'Continue'}</button></section></main>;
}
