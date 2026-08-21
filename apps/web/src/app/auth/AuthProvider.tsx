import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { isCognitoConfigured } from '@/lib/auth/config';
import { cognitoAuth } from '@/lib/auth/cognito';
import { AuthContext, type AuthUser } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isCognitoConfigured();
  const [user, setUser] = useState<AuthUser | null>(() => configured ? cognitoAuth.getCurrentUser() : null);
  const [isLoading, setIsLoading] = useState(false);
  const refreshUser = useCallback(() => {
    setUser(configured ? cognitoAuth.getCurrentUser() : null);
    setIsLoading(false);
  }, [configured]);
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
  const value = useMemo(() => ({ user, isLoading, isConfigured: configured,
    async signIn(username: string, password: string) { await cognitoAuth.signIn(username, password); refreshUser(); },
    async signUp(username: string, password: string, name: string) { const result = await cognitoAuth.signUp(username, password, name); return { needsConfirmation: !result.isSignUpComplete }; },
    async confirmSignUp(username: string, code: string) { await cognitoAuth.confirmSignUp(username, code); },
    async resendConfirmationCode(username: string) { await cognitoAuth.resendConfirmationCode(username); },
    async signOut() { cognitoAuth.signOut(); setUser(null); },
    async getAccessToken() { return configured ? cognitoAuth.getAccessToken() : null; },
  }), [configured, isLoading, refreshUser, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
