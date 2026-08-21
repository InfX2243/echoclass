import { apiClient } from '@/lib/api/client';
import type { LessonApiClient } from './api';
import type { Lesson, LessonPlaybackAccess, LessonTimelineContext } from './types';

export const lessonApiClient: LessonApiClient = {
  getLesson: (lessonId): Promise<Lesson> => apiClient.get(`/api/lessons/${lessonId}`),
  getPlaybackAccess: (lessonId): Promise<LessonPlaybackAccess> =>
    apiClient.get(`/api/lessons/${lessonId}/playback`),
  getTimelineContext: (lessonId): Promise<LessonTimelineContext> =>
    apiClient.get(`/api/lessons/${lessonId}/timeline`),
};
