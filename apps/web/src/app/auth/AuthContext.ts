import { createContext } from 'react';

export interface AuthUser { userId: string; username: string; email?: string; name?: string; }
export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, name: string) => Promise<{ needsConfirmation: boolean }>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
  resendConfirmationCode: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
