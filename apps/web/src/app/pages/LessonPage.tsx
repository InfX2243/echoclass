import { useRef, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { useAuthorizedLesson } from '@/features/lessons/useAuthorizedLesson';
import { useLessonEchoes } from '@/features/echoes/hooks';
import { EchoComposer } from '@/features/echoes/EchoComposer';
import type { ApiError } from '@/lib/api/errors';

function LessonState({ title, description }: { title: string; description: string }) { return <AppShell><div className="mx-auto grid min-h-[50vh] max-w-3xl place-items-center rounded-2xl border bg-card p-8 text-center"><div><h1 className="text-xl font-semibold">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p><Link to="/classes" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><ArrowLeft className="size-4" />Back to classes</Link></div></div></AppShell>; }
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export function LessonPage() {
  const { lessonId = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const lessonQuery = useAuthorizedLesson(lessonId);
  const echoesQuery = useLessonEchoes(lessonId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(Number(params.get('t') ?? 0));

  if (!lessonId) return <LessonState title="Lesson not found" description="This lesson link is missing a lesson identifier." />;
  if (lessonQuery.isPending) return <AppShell><div className="grid min-h-[50vh] place-items-center"><div className="flex items-center gap-3 text-sm text-muted-foreground" role="status"><LoaderCircle className="size-5 animate-spin" />Loading lesson…</div></div></AppShell>;
  if (lessonQuery.isError) { const error = lessonQuery.error as Partial<ApiError>; const title = error.status === 401 || error.status === 403 ? 'Lesson unavailable' : 'Unable to load lesson'; return <LessonState title={title} description={error.status === 401 || error.status === 403 ? 'You do not have access to this lesson.' : 'Something went wrong while loading this lesson. Please try again.'} />; }

  const { lesson, playback, timeline } = lessonQuery.data;
  const selectedTime = Math.min(Math.max(Number(params.get('t') ?? 0), 0), timeline.durationSeconds);
  const seekTo = (seconds: number) => { const next = Math.min(Math.max(seconds, 0), timeline.durationSeconds); if (videoRef.current) { videoRef.current.currentTime = next; void videoRef.current.play(); } setCurrentTime(next); setParams({ t: String(Math.floor(next)) }); };

  return <AppShell><div className="mx-auto max-w-6xl space-y-6">
    <div className="flex items-center justify-between"><Link to={`/classes/${lesson.classId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to class</Link><span className="text-sm text-muted-foreground">{lesson.status}</span></div>
    <header><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{lesson.title}</h1><p className="mt-2 text-sm text-muted-foreground">{lesson.description}</p></header>
    <section className="overflow-hidden rounded-2xl border bg-black"><video ref={videoRef} className="aspect-video w-full bg-black" controls preload="metadata" src={playback.playbackUrl} onLoadedMetadata={(event) => { event.currentTarget.currentTime = selectedTime; setCurrentTime(selectedTime); }} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}>Your browser does not support HTML5 video.</video></section>
    <EchoComposer lessonId={lessonId} timestampSeconds={currentTime} />
    <section className="rounded-2xl border bg-card p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Your Echoes</h2><p className="mt-1 text-sm text-muted-foreground">Click an Echo to jump back to that moment.</p></div><span className="text-sm text-muted-foreground">{echoesQuery.data?.length ?? 0}</span></div>{echoesQuery.isPending ? <p className="mt-4 text-sm text-muted-foreground">Loading Echoes…</p> : echoesQuery.isError ? <p className="mt-4 text-sm text-destructive">Unable to load Echoes.</p> : echoesQuery.data?.length ? <div className="mt-4 space-y-2">{echoesQuery.data.map((echo) => <button key={echo.id} type="button" onClick={() => seekTo(echo.timestampSeconds)} className="w-full rounded-xl border p-3 text-left hover:bg-muted"><div className="flex items-center justify-between gap-3"><span className="text-sm font-medium">{echo.type}</span><span className="text-sm font-mono text-muted-foreground">{formatTime(echo.timestampSeconds)}</span></div>{echo.note && <p className="mt-1 text-sm text-muted-foreground">{echo.note}</p>}</button>)}</div> : <div className="mt-4 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">No Echoes yet. Mark the moment you're learning from above.</div>}</section>
    <section className="rounded-2xl border bg-card p-5 sm:p-6"><h2 className="font-semibold">Lesson information</h2><p className="mt-1 text-sm text-muted-foreground">{formatTime(lesson.durationSeconds)} · Playback access expires {new Date(playback.expiresAt).toLocaleString()}</p><button type="button" className="mt-4 rounded-lg border px-3 py-2 text-sm hover:bg-muted" onClick={() => setParams({ t: String(Math.floor(currentTime)) })}>Keep current moment at {formatTime(currentTime)}</button></section>
  </div></AppShell>;
}
