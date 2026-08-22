import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../auth/useAuth';
import { apiClient } from '../../lib/api/client';
import { useEffect, useState } from 'react';

type ClassItem = { id: string; name: string; description: string | null };

export function DashboardPage() {
  const { getAccessToken } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { void (async () => { try { const token = await getAccessToken(); if (token) setClasses((await apiClient.get<{ classes: ClassItem[] }>('/classes', token)).classes); } finally { setLoading(false); } })(); }, []);
  return <AppShell><div className="space-y-9">
    <header><p className="text-sm font-medium text-muted-foreground">Student dashboard</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Your learning trace</h1><p className="mt-2 max-w-2xl text-muted-foreground">Your classes and learning activity will appear here as you get started.</p></header>
    <section><div className="mb-4 flex items-end justify-between"><h2 className="text-lg font-semibold">Active classes</h2>{!loading && <span className="text-sm text-muted-foreground">{classes.length} {classes.length === 1 ? 'class' : 'classes'}</span>}</div>
      {loading ? <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading your classes…</div> : classes.length === 0 ? <EmptyState title="No classes yet" description="Join a class using the invite code from your teacher. Your classes will appear here automatically." action={<Link to="/classes" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Join a class</Link>} /> : <div className="grid gap-4 md:grid-cols-2">{classes.map((item) => <Link key={item.id} to={`/classes/${item.id}`} className="rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-sm"><h3 className="font-semibold">{item.name}</h3><p className="mt-2 text-sm text-muted-foreground">{item.description ?? 'No description provided.'}</p></Link>)}</div>}
    </section>
    <section className="grid gap-4 lg:grid-cols-2"><EmptyState title="No pending revisits" description="Revisit suggestions will appear here once you have learning activity to return to." /><EmptyState title="No Echoes yet" description="Your saved learning moments will appear here as you interact with lessons." /></section>
  </div></AppShell>;
}
