import { authConfig } from './config';

type CognitoTokens = { accessToken: string; idToken?: string };

type CognitoUser = { userId: string; username: string; email?: string; name?: string };

const storageKey = 'echoclass-cognito-session';

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return JSON.parse(atob(normalized));
}

function decodeJwt(token: string) {
  const [, payload] = token.split('.');
  if (!payload) throw new Error('Invalid Cognito token');
  return base64UrlDecode(payload) as Record<string, unknown>;
}

function getStoredTokens(): CognitoTokens | null {
  const raw = sessionStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CognitoTokens;
    return parsed.accessToken ? parsed : null;
  } catch {
    sessionStorage.removeItem(storageKey);
    return null;
  }
}

async function cognitoRequest(action: string, body: Record<string, unknown>) {
  const response = await fetch(`https://cognito-idp.${authConfig.region}.amazonaws.com/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-amz-json-1.1', 'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}` },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as Record<string, unknown>;
  if (!response.ok) throw new Error(typeof payload.message === 'string' ? payload.message : `Cognito request failed (${response.status})`);
  return payload;
}

export const cognitoAuth = {
  async signIn(username: string, password: string) {
    const result = await cognitoRequest('InitiateAuth', { AuthFlow: 'USER_PASSWORD_AUTH', ClientId: authConfig.userPoolClientId, AuthParameters: { USERNAME: username, PASSWORD: password } });
    if (result.ChallengeName) throw new Error(`Unsupported Cognito challenge: ${String(result.ChallengeName)}`);
    const auth = result.AuthenticationResult as { AccessToken?: string; IdToken?: string } | undefined;
    if (!auth?.AccessToken) throw new Error('Cognito did not return an access token');
    sessionStorage.setItem(storageKey, JSON.stringify({ accessToken: auth.AccessToken, idToken: auth.IdToken } satisfies CognitoTokens));
  },
  async signUp(username: string, password: string, name: string) {
    const result = await cognitoRequest('SignUp', { ClientId: authConfig.userPoolClientId, Username: username, Password: password, UserAttributes: [{ Name: 'email', Value: username }, ...(name ? [{ Name: 'name', Value: name }] : [])] });
    return { isSignUpComplete: Boolean(result.UserConfirmed) };
  },
  async confirmSignUp(username: string, code: string) { await cognitoRequest('ConfirmSignUp', { ClientId: authConfig.userPoolClientId, Username: username, ConfirmationCode: code }); },
  async resendConfirmationCode(username: string) { await cognitoRequest('ResendConfirmationCode', { ClientId: authConfig.userPoolClientId, Username: username }); },
  getCurrentUser(): CognitoUser | null {
    const tokens = getStoredTokens();
    if (!tokens) return null;
    const claims = decodeJwt(tokens.accessToken);
    return { userId: String(claims.sub ?? ''), username: String(claims.username ?? claims['cognito:username'] ?? ''), email: typeof claims.email === 'string' ? claims.email : undefined, name: typeof claims.name === 'string' ? claims.name : undefined };
  },
  getAccessToken: () => getStoredTokens()?.accessToken ?? null,
  signOut: () => sessionStorage.removeItem(storageKey),
};
