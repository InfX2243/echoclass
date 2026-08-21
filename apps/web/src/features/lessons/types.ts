export type LessonStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type LessonContentType = 'VIDEO';

export interface Lesson {
  lessonId: string;
  classId: string;
  teacherId: string;
  title: string;
  description: string;
  contentType: LessonContentType;
  mediaKey: string;
  durationSeconds: number;
  status: LessonStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface LessonPlaybackAccess {
  playbackUrl: string;
  expiresAt: string;
}

export interface LessonTimelineContext {
  lessonId: string;
  durationSeconds: number;
}

export interface AuthorizedLesson {
  lesson: Lesson;
  playback: LessonPlaybackAccess;
  timeline: LessonTimelineContext;
}
