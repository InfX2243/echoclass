import { ArrowRight, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../auth/useAuth';
import { apiClient } from '../../lib/api/client';
import { useEffect, useState } from 'react';

type ClassItem = { id: string; name: string; description: string | null };

export function TeacherDashboardPage() {
  const { getAccessToken } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  async function loadClasses() { try { const token = await getAccessToken(); if (!token) throw new Error('Your session has expired.'); setClasses((await apiClient.get<{ classes: ClassItem[] }>('/classes', token)).classes); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to load classes.'); } finally { setLoading(false); } }
  useEffect(() => { void loadClasses(); }, []);
  async function createClass(event: React.FormEvent) { event.preventDefault(); if (!name.trim()) return; setCreating(true); setError(null); try { const token = await getAccessToken(); if (!token) throw new Error('Your session has expired.'); await apiClient.post('/classes', { name: name.trim(), description: description.trim() || undefined }, token); setName(''); setDescription(''); setShowCreate(false); await loadClasses(); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to create class.'); } finally { setCreating(false); } }
  return <AppShell><div className="space-y-9">
    <header><p className="text-sm font-medium text-muted-foreground">Teacher dashboard</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">See where learning is happening.</h1><p className="mt-2 max-w-2xl text-muted-foreground">Manage the classes you teach and build your learning spaces.</p></header>
    {error && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
    <section className="grid gap-4 sm:grid-cols-2"><article className="rounded-xl border bg-card p-5"><BookOpen className="size-5 text-muted-foreground" /><p className="mt-5 text-2xl font-semibold">{loading ? '—' : classes.length}</p><p className="mt-1 text-sm text-muted-foreground">Classes</p></article><article className="rounded-xl border bg-card p-5"><Users className="size-5 text-muted-foreground" /><p className="mt-5 text-2xl font-semibold">—</p><p className="mt-1 text-sm text-muted-foreground">Students</p></article></section>
    <section><div className="mb-4 flex items-end justify-between"><div><h2 className="text-lg font-semibold">My classes</h2><p className="mt-1 text-sm text-muted-foreground">Your current teaching spaces.</p></div><button type="button" onClick={() => setShowCreate(true)} className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Create class</button></div>
      {showCreate && <form onSubmit={createClass} className="mb-5 rounded-xl border bg-card p-5 space-y-3"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Class name" className="w-full rounded-lg border bg-background px-3 py-2 text-sm" /><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description (optional)" className="min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm" /><div className="flex gap-2"><button disabled={creating} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{creating ? 'Creating…' : 'Create class'}</button><button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button></div></form>}
      {loading ? <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading your classes…</div> : classes.length === 0 ? <EmptyState title="Create your first class" description="Your teaching space starts here. Create a class and then share its invite code with your students." action={<button type="button" onClick={() => setShowCreate(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Create class</button>} /> : <div className="grid gap-4 md:grid-cols-2">{classes.map((item) => <Link key={item.id} to={`/teacher/classes/${item.id}`} className="rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm"><div className="flex items-start justify-between"><div><h3 className="font-semibold">{item.name}</h3><p className="mt-2 text-sm text-muted-foreground">{item.description ?? 'No description provided.'}</p></div><ArrowRight className="size-4 text-muted-foreground" /></div></Link>)}</div>}
    </section>
  </div></AppShell>;
}
