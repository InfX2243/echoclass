import { useQuery } from '@tanstack/react-query';

import { loadAuthorizedLesson } from './api';
import { lessonApiClient } from './client';

export function useAuthorizedLesson(lessonId: string) {
  return useQuery({
    queryKey: ['lesson', lessonId, 'authorized'],
    queryFn: () => loadAuthorizedLesson(lessonApiClient, lessonId),
    enabled: lessonId.length > 0,
    retry: false,
    // The authorized lesson response contains a short-lived playback URL. Refetching on
    // window focus replaces the <video src>, which restarts playback from the beginning.
    refetchOnWindowFocus: false,
  });
}
