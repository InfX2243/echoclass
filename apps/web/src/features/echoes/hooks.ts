import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { echoApi } from './api';

export const echoKeys = { all: ['echoes'] as const, mine: () => [...echoKeys.all, 'mine'] as const, lesson: (lessonId: string) => [...echoKeys.all, 'lesson', lessonId] as const };

export function useMyEchoes() {
  return useQuery({
    queryKey: echoKeys.mine(),
    queryFn: echoApi.listMine,
    refetchOnWindowFocus: false,
  });
}

export function useLessonEchoes(lessonId: string) {
  return useQuery({
    queryKey: echoKeys.lesson(lessonId),
    queryFn: () => echoApi.listForLesson(lessonId),
    enabled: !!lessonId,
    refetchOnWindowFocus: false,
  });
}

export function useCreateEcho() { const qc = useQueryClient(); return useMutation({ mutationFn: echoApi.create, onSuccess: (echo) => { void qc.invalidateQueries({ queryKey: echoKeys.mine() }); void qc.invalidateQueries({ queryKey: echoKeys.lesson(echo.lessonId) }); } }); }
export function useUpdateEcho() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ echo, ...input }: { echo: import('./types').Echo; timestampSeconds: number; type: import('./types').EchoType; note?: string }) => echoApi.update(echo, input), onSuccess: (echo) => { void qc.invalidateQueries({ queryKey: echoKeys.mine() }); void qc.invalidateQueries({ queryKey: echoKeys.lesson(echo.lessonId) }); } }); }
export function useDeleteEcho() { const qc = useQueryClient(); return useMutation({ mutationFn: echoApi.remove, onSuccess: (_, echo) => { void qc.invalidateQueries({ queryKey: echoKeys.mine() }); void qc.invalidateQueries({ queryKey: echoKeys.lesson(echo.lessonId) }); } }); }
