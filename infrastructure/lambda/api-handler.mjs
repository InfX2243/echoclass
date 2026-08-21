import { verifyBearerToken } from './auth.mjs';

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const method = event.requestContext?.http?.method ?? event.httpMethod ?? 'GET';
  const path = event.rawPath ?? event.path ?? '/';

  if (method === 'GET' && path === '/health') {
    return json(200, { status: 'ok' });
  }

  try {
    const principal = await verifyBearerToken(event.headers?.authorization ?? event.headers?.Authorization);

    return json(404, {
      error: { code: 'NOT_FOUND', message: 'Route not found' },
      principal: { subject: principal.subject },
    });
  } catch (error) {
    if (error?.statusCode === 401) {
      return json(401, {
        error: { code: error.code, message: error.message },
      });
    }

    console.error('Authentication failure', error);
    return json(500, {
      error: { code: 'INTERNAL_ERROR', message: 'Unable to authenticate request' },
    });
  }
};
