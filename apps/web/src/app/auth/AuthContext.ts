import { createContext } from 'react';

export type AuthRole = 'STUDENT' | 'TEACHER';

export interface AuthUser {
  userId: string;
  username: string;
  email?: string;
  name?: string;
  role?: AuthRole;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, name: string, role: AuthRole) => Promise<{ needsConfirmation: boolean }>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
  resendConfirmationCode: (username: string) => Promise<void>;
  setRole: (role: AuthRole) => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
