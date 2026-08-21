import type { AuthorizedLesson, Lesson, LessonPlaybackAccess, LessonTimelineContext } from './types';

export interface LessonApiClient {
  getLesson(lessonId: string): Promise<Lesson>;
  getPlaybackAccess(lessonId: string): Promise<LessonPlaybackAccess>;
  getTimelineContext(lessonId: string): Promise<LessonTimelineContext>;
}

export async function loadAuthorizedLesson(
  client: LessonApiClient,
  lessonId: string,
): Promise<AuthorizedLesson> {
  const lesson = await client.getLesson(lessonId);

  if (lesson.status !== 'PUBLISHED') {
    throw new Error('LESSON_NOT_PUBLISHED');
  }

  const [playback, timeline] = await Promise.all([
    client.getPlaybackAccess(lessonId),
    client.getTimelineContext(lessonId),
  ]);

  return { lesson, playback, timeline };
}
