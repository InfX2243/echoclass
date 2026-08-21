import { useQuery } from '@tanstack/react-query';

import { loadAuthorizedLesson } from './api';
import { lessonApiClient } from './client';

export function useAuthorizedLesson(lessonId: string) {
  return useQuery({
    queryKey: ['lesson', lessonId, 'authorized'],
    queryFn: () => loadAuthorizedLesson(lessonApiClient, lessonId),
    enabled: lessonId.length > 0,
    retry: false,
  });
}
