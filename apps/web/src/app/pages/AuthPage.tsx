import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { setDemoSession, type DemoRole } from '../auth/demoSession';
import { EchoClassLogo } from '../components/EchoClassLogo';

const demoAccounts = {
  'student@echoclass.demo': { password: 'Student123!', destination: '/dashboard', role: 'student' as DemoRole },
  'teacher@echoclass.demo': { password: 'Teacher123!', destination: '/teacher/dashboard', role: 'teacher' as DemoRole },
} as const;

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate();
  const isLogin = mode === 'login';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    if (!isLogin) { setError('Account registration is not connected yet. Use a demo account to explore EchoClass.'); return; }
    const normalizedEmail = email.toLowerCase();
    const account = demoAccounts[normalizedEmail as keyof typeof demoAccounts];
    if (!account || account.password !== password) { setError('Those credentials do not match an EchoClass demo account.'); return; }
    setDemoSession({ email: normalizedEmail, role: account.role });
    navigate(account.destination);
  }

  function fillDemo(emailAddress: keyof typeof demoAccounts) { setEmail(emailAddress); setPassword(demoAccounts[emailAddress].password); setError(''); }

  return <main className="grid min-h-screen place-items-center bg-background px-5 py-12"><section className="w-full max-w-md"><Link to="/" className="mb-8 flex flex-col items-center text-center"><div className="mb-4 flex items-center gap-3"><EchoClassLogo className="size-11" /><span className="text-2xl font-semibold tracking-tight">EchoClass</span></div><p className="text-sm text-muted-foreground">Every lesson leaves a trace.</p></Link><div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8"><h1 className="text-2xl font-semibold tracking-tight">{isLogin ? 'Welcome back.' : 'Create your account.'}</h1><p className="mt-2 text-sm text-muted-foreground">{isLogin ? 'Sign in with a demo account to explore the role-specific experience.' : 'Start building a learning trace with EchoClass.'}</p><form className="mt-7 space-y-5" onSubmit={handleSubmit}>{!isLogin && <label className="block text-sm font-medium">Name<input className="mt-2 h-11 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" placeholder="Your name" /></label>}<label className="block text-sm font-medium">Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="mt-2 h-11 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" placeholder="you@example.com" required /></label><label className="block text-sm font-medium">Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-2 h-11 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" required /></label>{error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}<button className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90">{isLogin ? 'Sign In' : 'Sign Up'}</button></form>{isLogin && <div className="mt-7 rounded-xl border bg-muted/40 p-4"><div className="flex items-center justify-between"><p className="text-sm font-semibold">Demo access</p><span className="text-xs text-muted-foreground">Development only</span></div><p className="mt-1 text-xs leading-5 text-muted-foreground">Choose a role to autofill credentials and open the matching dashboard.</p><div className="mt-3 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => fillDemo('student@echoclass.demo')} className="rounded-lg border bg-card p-3 text-left hover:border-foreground/20"><span className="block text-sm font-medium">Student</span><span className="mt-1 block text-xs text-muted-foreground">student@echoclass.demo</span></button><button type="button" onClick={() => fillDemo('teacher@echoclass.demo')} className="rounded-lg border bg-card p-3 text-left hover:border-foreground/20"><span className="block text-sm font-medium">Teacher</span><span className="mt-1 block text-xs text-muted-foreground">teacher@echoclass.demo</span></button></div></div>}<p className="mt-6 text-center text-sm text-muted-foreground">{isLogin ? "Don't have an account? " : 'Already have an account? '}<Link className="font-medium text-foreground underline underline-offset-4" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Sign up' : 'Sign in'}</Link></p></div></section></main>;
}
