import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../auth/useAuth';
import { apiClient } from '../../lib/api/client';

type ClassItem = { id: string; name: string; description: string | null; teacherId: string };

export function ClassesPage() {
  const { getAccessToken } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  async function loadClasses() {
    setLoading(true); setError(null);
    try { const token = await getAccessToken(); if (!token) throw new Error('Your session has expired. Please sign in again.'); const result = await apiClient.get<{ classes: ClassItem[] }>('/classes', token); setClasses(result.classes); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to load classes.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void loadClasses(); }, []);

  async function joinClass(event: React.FormEvent) {
    event.preventDefault(); if (!joinCode.trim()) return; setJoining(true); setError(null);
    try { const token = await getAccessToken(); if (!token) throw new Error('Your session has expired. Please sign in again.'); await apiClient.post('/invites/join', { code: joinCode.trim() }, token); setJoinCode(''); await loadClasses(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to join class.'); }
    finally { setJoining(false); }
  }

  return <AppShell><div className="space-y-8">
    <header><p className="text-sm font-medium text-muted-foreground">Learning space</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Classes</h1><p className="mt-2 max-w-2xl text-muted-foreground">Your classes and the lessons available to you.</p></header>
    {error && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
    {loading ? <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">Loading your classes…</div> : classes.length === 0 ? <EmptyState title="You haven't joined a class yet" description="Enter the invite code shared by your teacher to join your first class." action={<form onSubmit={joinClass} className="flex w-full max-w-sm gap-2"><input value={joinCode} onChange={(event) => setJoinCode(event.target.value)} placeholder="Enter invite code" className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm uppercase" aria-label="Class invite code" /><button disabled={joining} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{joining ? 'Joining…' : 'Join class'}</button></form>} /> : <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{classes.map((item) => <Link key={item.id} to={`/classes/${item.id}`} className="group rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm"><div className="flex items-start justify-between gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-sm font-semibold">{item.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div></div><h2 className="mt-5 font-semibold group-hover:underline group-hover:underline-offset-4">{item.name}</h2><p className="mt-1 text-sm text-muted-foreground">{item.description ?? 'No description provided.'}</p></Link>)}</div>
      <form onSubmit={joinClass} className="rounded-xl border border-dashed bg-card/50 p-6"><p className="font-medium">Have another class invite?</p><p className="mt-1 text-sm text-muted-foreground">Join a class with the invite code from your teacher.</p><div className="mt-4 flex max-w-sm gap-2"><input value={joinCode} onChange={(event) => setJoinCode(event.target.value)} placeholder="Invite code" className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm uppercase" aria-label="Class invite code" /><button disabled={joining} className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50">Join</button></div></form>
    </>}
  </div></AppShell>;
}
