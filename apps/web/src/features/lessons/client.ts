import type { LessonApiClient } from './api';
import type { Lesson, LessonPlaybackAccess, LessonTimelineContext } from './types';

export interface ApiError extends Error {
  status: number;
}

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: 'include',
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const error = new Error(`Lesson API request failed with status ${response.status}`) as ApiError;
    error.status = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}

export const lessonApiClient: LessonApiClient = {
  getLesson: (lessonId): Promise<Lesson> => request(`/api/lessons/${lessonId}`),
  getPlaybackAccess: (lessonId): Promise<LessonPlaybackAccess> =>
    request(`/api/lessons/${lessonId}/playback`),
  getTimelineContext: (lessonId): Promise<LessonTimelineContext> =>
    request(`/api/lessons/${lessonId}/timeline`),
};
