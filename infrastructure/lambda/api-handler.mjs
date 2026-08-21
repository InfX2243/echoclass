import { verifyBearerToken } from './auth.mjs';
import { getOrCreateUser } from './user-repository.mjs';

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const method = event.requestContext?.http?.method ?? event.httpMethod ?? 'GET';
  const path = event.rawPath ?? event.path ?? '/';

  if (method === 'GET' && path === '/health') return json(200, { status: 'ok' });

  try {
    const principal = await verifyBearerToken(event.headers?.authorization ?? event.headers?.Authorization);

    if (method === 'GET' && path === '/me') {
      const user = await getOrCreateUser(principal);
      return json(200, {
        user: {
          id: user.userId,
          username: user.username,
          email: user.email ?? null,
          createdAt: user.createdAt,
        },
      });
    }

    return json(404, { error: { code: 'NOT_FOUND', message: 'Route not found' } });
  } catch (error) {
    if (error?.statusCode === 401) return json(401, { error: { code: error.code, message: error.message } });

    console.error('API request failure', error);
    return json(500, { error: { code: 'INTERNAL_ERROR', message: 'Unable to process request' } });
  }
};
