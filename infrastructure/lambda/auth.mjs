const COGNITO_ISSUER = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;
const JWKS_URL = new URL(`${COGNITO_ISSUER}/.well-known/jwks.json`);
let jwksCache;
let jwksCacheExpiresAt = 0;

const unauthorized = (message) => { const error = new Error(message); error.statusCode = 401; error.code = 'UNAUTHORIZED'; return error; };
const decodeBase64Url = (value) => Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
const parseJwt = (token) => { const parts = token.split('.'); if (parts.length !== 3) throw unauthorized('Invalid bearer token'); try { return { header: JSON.parse(decodeBase64Url(parts[0]).toString('utf8')), payload: JSON.parse(decodeBase64Url(parts[1]).toString('utf8')), signature: decodeBase64Url(parts[2]), signingInput: Buffer.from(`${parts[0]}.${parts[1]}`) }; } catch { throw unauthorized('Invalid bearer token'); } };
const getJwks = async () => { if (jwksCache && Date.now() < jwksCacheExpiresAt) return jwksCache; const response = await fetch(JWKS_URL); if (!response.ok) throw new Error('Unable to load Cognito signing keys'); const body = await response.json(); if (!Array.isArray(body.keys)) throw new Error('Invalid Cognito signing keys'); jwksCache = body.keys; jwksCacheExpiresAt = Date.now() + 60 * 60 * 1000; return jwksCache; };
const verifySignature = async ({ header, signature, signingInput }) => { if (header.alg !== 'RS256' || !header.kid) throw unauthorized('Unsupported bearer token'); const key = (await getJwks()).find((candidate) => candidate.kid === header.kid); if (!key) throw unauthorized('Unknown bearer token key'); const cryptoKey = await crypto.subtle.importKey('jwk', key, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']); const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, signature, signingInput); if (!valid) throw unauthorized('Invalid bearer token signature'); };

const getCognitoAttributes = async (accessToken) => {
  const response = await fetch(`https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/`, { method: 'POST', headers: { 'content-type': 'application/x-amz-json-1.1', 'x-amz-target': 'AWSCognitoIdentityProviderService.GetUser' }, body: JSON.stringify({ AccessToken: accessToken }) });
  if (!response.ok) throw unauthorized('Unable to resolve Cognito user');
  const body = await response.json();
  return Object.fromEntries((body.UserAttributes ?? []).map((attribute) => [attribute.Name, attribute.Value]));
};

export const verifyBearerToken = async (authorizationHeader) => {
  if (!authorizationHeader?.startsWith('Bearer ')) throw unauthorized('Missing bearer token');
  const token = authorizationHeader.slice('Bearer '.length).trim();
  if (!token) throw unauthorized('Missing bearer token');
  const parsed = parseJwt(token);
  await verifySignature(parsed);
  const now = Math.floor(Date.now() / 1000);
  const { payload } = parsed;
  if (payload.iss !== COGNITO_ISSUER) throw unauthorized('Invalid token issuer');
  if (payload.token_use !== 'access') throw unauthorized('Invalid token use');
  if (payload.client_id !== process.env.COGNITO_APP_CLIENT_ID) throw unauthorized('Invalid token audience');
  if (typeof payload.exp !== 'number' || payload.exp <= now) throw unauthorized('Expired bearer token');
  const attributes = await getCognitoAttributes(token);
  return { subject: payload.sub, username: payload.username, clientId: payload.client_id, claims: { ...payload, email: attributes.email, name: attributes.name, 'custom:role': attributes['custom:role'] } };
};
