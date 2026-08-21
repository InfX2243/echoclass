export type DemoRole = 'student' | 'teacher';

const STORAGE_KEY = 'echoclass-demo-session';

export interface DemoSession {
  email: string;
  role: DemoRole;
}

export function setDemoSession(session: DemoSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getDemoSession(): DemoSession | null {
  const value = localStorage.getItem(STORAGE_KEY);
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as DemoSession;
    return parsed.role === 'student' || parsed.role === 'teacher' ? parsed : null;
  } catch {
    return null;
  }
}

export function clearDemoSession() {
  localStorage.removeItem(STORAGE_KEY);
}
