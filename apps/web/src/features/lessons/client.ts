import { apiRequest } from '@/lib/api/client';
import { cognitoAuth } from '@/lib/auth/cognito';
import type { LessonApiClient } from './api';
import type { Lesson, LessonPlaybackAccess, LessonTimelineContext } from './types';

const request = async <T>(path: string): Promise<T> => {
  const accessToken = cognitoAuth.getAccessToken();
  if (!accessToken) throw new Error('You must be signed in to access lessons');
  return apiRequest<T>(path, undefined, accessToken);
};

interface LessonResponse {
  lesson: Lesson;
}

export const lessonApiClient: LessonApiClient = {
  getLesson: async (lessonId): Promise<Lesson> => {
    const response = await request<LessonResponse>(`/api/lessons/${lessonId}`);
    return response.lesson;
  },
  getPlaybackAccess: (lessonId): Promise<LessonPlaybackAccess> =>
    request(`/api/lessons/${lessonId}/playback`),
  getTimelineContext: (lessonId): Promise<LessonTimelineContext> =>
    request(`/api/lessons/${lessonId}/timeline`),
};
