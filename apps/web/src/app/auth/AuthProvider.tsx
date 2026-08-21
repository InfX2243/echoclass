import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { apiRequest } from '@/lib/api/client';
import { isCognitoConfigured } from '@/lib/auth/config';
import { cognitoAuth, type AuthRole } from '@/lib/auth/cognito';
import { AuthContext, type AuthUser } from './AuthContext';

type MeResponse = { user: { id: string; username: string; email?: string | null; role?: AuthRole | null; createdAt: string } };

function isMeResponse(value: unknown): value is MeResponse {
  if (!value || typeof value !== 'object') return false;
  const user = (value as { user?: unknown }).user;
  if (!user || typeof user !== 'object') return false;
  const candidate = user as Record<string, unknown>;
  return typeof candidate.id === 'string' && typeof candidate.username === 'string';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isCognitoConfigured();
  const [isLoading, setIsLoading] = useState(configured);
  const [user, setUser] = useState<AuthUser | null>(() => configured ? cognitoAuth.getCurrentUser() : null);

  const bootstrapApplicationUser = useCallback(async () => {
    const accessToken = configured ? cognitoAuth.getAccessToken() : null;
    if (!accessToken) { setUser(null); return; }
    const response = await apiRequest<MeResponse>('/api/v1/me', undefined, accessToken);
    if (!isMeResponse(response)) throw new Error('Application API returned an invalid /me response');
    setUser((current) => ({
      userId: response.user.id,
      username: response.user.username || current?.username || '',
      email: response.user.email ?? current?.email,
      name: current?.name,
      role: response.user.role ?? current?.role,
    }));
  }, [configured]);

  const refreshUser = useCallback(() => {
    setUser(configured ? cognitoAuth.getCurrentUser() : null);
  }, [configured]);

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      refreshUser();
      try {
        if (!cancelled) await bootstrapApplicationUser();
      } catch (error) {
        if (!cancelled) console.error('Unable to bootstrap application user', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void initialize();
    return () => { cancelled = true; };
  }, [bootstrapApplicationUser, refreshUser]);

  const value = useMemo(() => ({
    user,
    isLoading,
    isConfigured: configured,
    async signIn(username: string, password: string) { await cognitoAuth.signIn(username, password); await bootstrapApplicationUser(); },
    async signUp(username: string, password: string, name: string, role: AuthRole) { const result = await cognitoAuth.signUp(username, password, name, role); return { needsConfirmation: !result.isSignUpComplete }; },
    async confirmSignUp(username: string, code: string) { await cognitoAuth.confirmSignUp(username, code); },
    async resendConfirmationCode(username: string) { await cognitoAuth.resendConfirmationCode(username); },
    async setRole(role: AuthRole) { await cognitoAuth.setRole(role); await bootstrapApplicationUser(); },
    async signOut() { cognitoAuth.signOut(); setUser(null); },
    async getAccessToken() { return configured ? cognitoAuth.getAccessToken() : null; },
  }), [bootstrapApplicationUser, configured, isLoading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
