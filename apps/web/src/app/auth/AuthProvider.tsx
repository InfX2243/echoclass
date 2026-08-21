import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { isCognitoConfigured } from '@/lib/auth/config';
import { cognitoAuth, type AuthRole } from '@/lib/auth/cognito';
import { AuthContext, type AuthUser } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isCognitoConfigured();
  const [isLoading, setIsLoading] = useState(configured);
  const [user, setUser] = useState<AuthUser | null>(() => configured ? cognitoAuth.getCurrentUser() : null);

  const refreshUser = useCallback(() => {
    setUser(configured ? cognitoAuth.getCurrentUser() : null);
  }, [configured]);

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, [refreshUser]);

  const value = useMemo(() => ({
    user,
    isLoading,
    isConfigured: configured,
    async signIn(username: string, password: string) { await cognitoAuth.signIn(username, password); refreshUser(); },
    async signUp(username: string, password: string, name: string, role: AuthRole) { const result = await cognitoAuth.signUp(username, password, name, role); return { needsConfirmation: !result.isSignUpComplete }; },
    async confirmSignUp(username: string, code: string) { await cognitoAuth.confirmSignUp(username, code); },
    async resendConfirmationCode(username: string) { await cognitoAuth.resendConfirmationCode(username); },
    async setRole(role: AuthRole) { await cognitoAuth.setRole(role); refreshUser(); },
    async signOut() { cognitoAuth.signOut(); setUser(null); },
    async getAccessToken() { return configured ? cognitoAuth.getAccessToken() : null; },
  }), [configured, isLoading, refreshUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
