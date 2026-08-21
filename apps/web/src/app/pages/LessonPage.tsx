import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

import { AppShell } from '../components/AppShell';
import { LessonVideoPlayer } from '@/features/lessons/LessonVideoPlayer';
import { useAuthorizedLesson } from '@/features/lessons/useAuthorizedLesson';
import type { ApiError } from '@/features/lessons/client';

function LessonState({ title, description }: { title: string; description: string }) {
  return (
    <AppShell>
      <div className="mx-auto grid min-h-[50vh] max-w-3xl place-items-center rounded-2xl border bg-card p-8 text-center">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <Link
            to="/classes"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to classes
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

export function LessonPage() {
  const { lessonId = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const lessonQuery = useAuthorizedLesson(lessonId);

  if (!lessonId) {
    return <LessonState title="Lesson not found" description="This lesson link is missing a lesson identifier." />;
  }

  if (lessonQuery.isPending) {
    return (
      <AppShell>
        <div className="grid min-h-[50vh] place-items-center">
          <div className="flex items-center gap-3 text-sm text-muted-foreground" role="status">
            <LoaderCircle className="size-5 animate-spin" />
            Loading lesson…
          </div>
        </div>
      </AppShell>
    );
  }

  if (lessonQuery.isError) {
    const error = lessonQuery.error as Partial<ApiError>;
    const title = error.status === 401 || error.status === 403 ? 'Lesson unavailable' : 'Unable to load lesson';
    const description =
      error.message === 'LESSON_NOT_PUBLISHED'
        ? 'This lesson is not published yet.'
        : error.status === 401 || error.status === 403
          ? 'You do not have access to this lesson.'
          : 'Something went wrong while loading this lesson. Please try again.';

    return <LessonState title={title} description={description} />;
  }

  const { lesson, playback, timeline } = lessonQuery.data;
  const selectedTime = Math.min(Math.max(Number(params.get('t') ?? 0), 0), timeline.durationSeconds);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to={`/classes/${lesson.classId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to class
          </Link>
          <span className="text-sm text-muted-foreground">{lesson.status}</span>
        </div>

        <header>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{lesson.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{lesson.description}</p>
        </header>

        <LessonVideoPlayer
          src={playback.playbackUrl}
          initialTime={selectedTime}
          onTimeUpdate={(time) => setParams({ t: String(Math.floor(time)) }, { replace: true })}
        />

        <section className="rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="font-semibold">Lesson information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {Math.floor(lesson.durationSeconds / 60)}:{String(lesson.durationSeconds % 60).padStart(2, '0')} · Playback access expires {new Date(playback.expiresAt).toLocaleString()}
          </p>
        </section>
      </div>
    </AppShell>
  );
}
