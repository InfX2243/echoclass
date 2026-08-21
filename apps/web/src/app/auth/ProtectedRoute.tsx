import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from './useAuth';

export function ProtectedRoute() {
  const { user, isLoading, isConfigured } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
        <p className="text-sm text-muted-foreground">Loading your session…</p>
      </main>
    );
  }

  if (!isConfigured || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
