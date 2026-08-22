import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../auth/useAuth';
import { apiClient } from '../../lib/api/client';
import { useEffect, useState } from 'react';

type ClassItem = { id: string; name: string; description: string | null };
type Lesson = { id: string; title: string; description?: string | null; status: string };

export function ClassDetailPage() {
  const { classId } = useParams(); const { getAccessToken } = useAuth();
  const [data, setData] = useState<ClassItem | null>(null); const [lessons, setLessons] = useState<Lesson[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  useEffect(() => { void (async () => { try { const token = await getAccessToken(); if (!token || !classId) throw new Error('Unable to load this class.'); const [classResult, lessonResult] = await Promise.all([apiClient.get<{ class: ClassItem }>(`/classes/${classId}`, token), apiClient.get<{ lessons: Lesson[] }>(`/classes/${classId}/lessons`, token)]); setData(classResult.class); setLessons(lessonResult.lessons); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to load class.'); } finally { setLoading(false); } })(); }, [classId]);
  return <AppShell><div className="space-y-8"><Link to="/classes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to classes</Link>{loading ? <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">Loading class…</div> : error || !data ? <EmptyState title="Class unavailable" description={error ?? 'This class could not be found or you no longer have access to it.'} action={<Link to="/classes" className="rounded-lg border px-4 py-2 text-sm font-medium">Back to classes</Link>} /> : <><header className="rounded-2xl border bg-card p-6 sm:p-8"><p className="text-sm font-medium text-muted-foreground">Class</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{data.name}</h1><p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{data.description ?? 'No description provided.'}</p></header><section><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Published lessons</h2><span className="text-sm text-muted-foreground">{lessons.length} lessons</span></div>{lessons.length === 0 ? <EmptyState title="No lessons yet" description="Your teacher hasn't published any lessons for this class yet. Check back soon." /> : <div className="space-y-3">{lessons.map((lesson, index) => <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="flex items-center gap-4 rounded-xl border bg-card p-4 transition hover:border-foreground/20 hover:shadow-sm"><div className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-sm font-semibold">{String(index + 1).padStart(2, '0')}</div><div className="min-w-0 flex-1"><h3 className="font-medium">{lesson.title}</h3><p className="mt-1 text-xs text-muted-foreground">{lesson.description ?? 'Open lesson to begin learning.'}</p></div><PlayCircle className="size-5 text-muted-foreground" /></Link>)}</div>}</section></>}</div></AppShell>;
}
