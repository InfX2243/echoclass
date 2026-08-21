import type { Lesson, LessonPlaybackAccess, LessonTimelineContext } from './types';

export const DEMO_LESSON_ID = 'demo-intro-to-echoclass';

const demoLesson: Lesson = {
  lessonId: DEMO_LESSON_ID,
  classId: 'demo-class',
  teacherId: 'demo-teacher',
  title: 'Welcome to EchoClass',
  description: 'A local demo lesson used to verify video playback before cloud storage is connected.',
  contentType: 'VIDEO',
  mediaKey: 'videos/sample-lesson.mp4',
  durationSeconds: 60,
  status: 'PUBLISHED',
  createdAt: '2026-08-21T00:00:00.000Z',
  updatedAt: '2026-08-21T00:00:00.000Z',
  publishedAt: '2026-08-21T00:00:00.000Z',
};

export function isMockLessonsEnabled() {
  return import.meta.env.VITE_USE_MOCK_LESSONS === 'true';
}

export function getMockLesson(lessonId: string): Lesson {
  if (lessonId !== DEMO_LESSON_ID) {
    throw new Error('LESSON_NOT_FOUND');
  }

  return demoLesson;
}

export function getMockPlaybackAccess(lessonId: string): LessonPlaybackAccess {
  getMockLesson(lessonId);

  return {
    playbackUrl: '/videos/sample-lesson.mp4',
    expiresAt: '2099-01-01T00:00:00.000Z',
  };
}

export function getMockTimelineContext(lessonId: string): LessonTimelineContext {
  const lesson = getMockLesson(lessonId);

  return {
    lessonId,
    durationSeconds: lesson.durationSeconds,
  };
}
