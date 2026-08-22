import { apiRequest } from '@/lib/api/client';
import { cognitoAuth } from '@/lib/auth/cognito';
import type { Echo, EchoType } from './types';

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = cognitoAuth.getAccessToken();
  if (!token) throw new Error('You must be signed in to manage Echoes');
  return apiRequest<T>(path, init, token);
};

interface EchoesResponse { echoes: Echo[] }
interface EchoResponse { echo: Echo }

export const echoApi = {
  listMine: async (): Promise<Echo[]> => (await request<EchoesResponse>('/api/echoes')).echoes,
  listForLesson: async (lessonId: string): Promise<Echo[]> => (await request<EchoesResponse>(`/api/lessons/${lessonId}/echoes`)).echoes,
  create: async (input: { lessonId: string; timestampSeconds: number; type: EchoType; note?: string }): Promise<Echo> =>
    (await request<EchoResponse>('/api/echoes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) })).echo,
  update: async (echo: Echo, input: { timestampSeconds: number; type: EchoType; note?: string }): Promise<Echo> =>
    (await request<EchoResponse>(`/api/lessons/${echo.lessonId}/echoes/${echo.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) })).echo,
  remove: async (echo: Echo): Promise<void> => { await request(`/api/lessons/${echo.lessonId}/echoes/${echo.id}`, { method: 'DELETE' }); },
};
