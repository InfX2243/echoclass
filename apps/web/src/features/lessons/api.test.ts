import { describe, expect, it, vi } from 'vitest';
import { loadAuthorizedLesson, type LessonApiClient } from './api';
import type { Lesson } from './types';

const lesson: Lesson = {
  lessonId: 'lesson-1',
  classId: 'class-1',
  teacherId: 'teacher-1',
  title: 'Forces and motion',
  description: 'Introduction to forces.',
  contentType: 'VIDEO',
  mediaKey: 'lessons/lesson-1/video.mp4',
  durationSeconds: 2537,
  status: 'PUBLISHED',
  createdAt: '2026-08-21T00:00:00.000Z',
  updatedAt: '2026-08-21T00:00:00.000Z',
  publishedAt: '2026-08-21T00:00:00.000Z',
};

const client: LessonApiClient = {
  getLesson: vi.fn().mockResolvedValue(lesson),
  getPlaybackAccess: vi.fn().mockResolvedValue({
    playbackUrl: 'https://media.example.test/lesson-1',
    expiresAt: '2026-08-21T01:00:00.000Z',
  }),
  getTimelineContext: vi.fn().mockResolvedValue({
    lessonId: 'lesson-1',
    durationSeconds: 2537,
  }),
};

describe('loadAuthorizedLesson', () => {
  it('loads lesson metadata, playback access, and timeline context', async () => {
    await expect(loadAuthorizedLesson(client, 'lesson-1')).resolves.toEqual({
      lesson,
      playback: {
        playbackUrl: 'https://media.example.test/lesson-1',
        expiresAt: '2026-08-21T01:00:00.000Z',
      },
      timeline: {
        lessonId: 'lesson-1',
        durationSeconds: 2537,
      },
    });
  });

  it('does not request playback access for an unpublished lesson', async () => {
    const unpublishedClient: LessonApiClient = {
      ...client,
      getLesson: vi.fn().mockResolvedValue({ ...lesson, status: 'DRAFT' }),
      getPlaybackAccess: vi.fn(),
      getTimelineContext: vi.fn(),
    };

    await expect(loadAuthorizedLesson(unpublishedClient, 'lesson-1')).rejects.toThrow(
      'LESSON_NOT_PUBLISHED',
    );
    expect(unpublishedClient.getPlaybackAccess).not.toHaveBeenCalled();
    expect(unpublishedClient.getTimelineContext).not.toHaveBeenCalled();
  });
});
