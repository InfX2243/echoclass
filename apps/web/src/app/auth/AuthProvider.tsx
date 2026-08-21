import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { isCognitoConfigured } from '@/lib/auth/config';
import { cognitoAuth } from '@/lib/auth/cognito';

export interface AuthUser { userId: string; username: string; email?: string; name?: string; }
interface AuthContextValue { user: AuthUser | null; isLoading: boolean; isConfigured: boolean; signIn: (username: string, password: string) => Promise<void>; signUp: (username: string, password: string, name: string) => Promise<{ needsConfirmation: boolean }>; confirmSignUp: (username: string, code: string) => Promise<void>; resendConfirmationCode: (username: string) => Promise<void>; signOut: () => Promise<void>; getAccessToken: () => Promise<string | null>; }
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isCognitoConfigured();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(configured);
  const refreshUser = useCallback(async () => { setUser(configured ? cognitoAuth.getCurrentUser() : null); setIsLoading(false); }, [configured]);
  useEffect(() => { void refreshUser(); }, [refreshUser]);
  const value = useMemo<AuthContextValue>(() => ({ user, isLoading, isConfigured: configured,
    async signIn(username, password) { await cognitoAuth.signIn(username, password); await refreshUser(); },
    async signUp(username, password, name) { const result = await cognitoAuth.signUp(username, password, name); return { needsConfirmation: !result.isSignUpComplete }; },
    async confirmSignUp(username, code) { await cognitoAuth.confirmSignUp(username, code); },
    async resendConfirmationCode(username) { await cognitoAuth.resendConfirmationCode(username); },
    async signOut() { cognitoAuth.signOut(); setUser(null); },
    async getAccessToken() { return configured ? cognitoAuth.getAccessToken() : null; },
  }), [configured, isLoading, refreshUser, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
