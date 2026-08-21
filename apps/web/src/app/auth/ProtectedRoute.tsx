import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from './useAuth';
import type { AuthRole } from './AuthContext';

export function ProtectedRoute() {
  const { user, isLoading, isConfigured } = useAuth();
  const location = useLocation();

  if (isLoading) return <main className="grid min-h-screen place-items-center bg-background px-5 py-12"><p className="text-sm text-muted-foreground">Loading your session…</p></main>;
  if (!isConfigured || !user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

export function RoleRoute({ roles }: { roles: AuthRole[] }) {
  const { user } = useAuth();
  if (!user) return null;
  if (!user.role) return <Navigate to="/onboarding" replace />;
  if (!roles.includes(user.role)) return <Navigate to={user.role === 'TEACHER' ? '/teacher/dashboard' : '/dashboard'} replace />;
  return <Outlet />;
}
