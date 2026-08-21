import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useTheme } from './theme/ThemeProvider';

function ThemeTestPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">EchoClass Theme Test</h1>

          <p className="text-muted-foreground">Current theme: {theme}</p>

          <p className="text-muted-foreground">
            Resolved theme: {resolvedTheme}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Light
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Dark
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground"
          >
            System
          </button>
        </div>

        <div className="rounded-xl border bg-card p-6 text-card-foreground">
          <h2 className="font-semibold">Theme Preview</h2>

          <p className="mt-2 text-muted-foreground">
            This card should adapt correctly to both light and dark themes.
          </p>
        </div>
      </div>
    </main>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  {
    path: '/login',
    element: <PlaceholderPage title="Login" />,
  },

  {
    path: '/register',
    element: <PlaceholderPage title="Register" />,
  },

  {
    path: '/dashboard',
    element: <ThemeTestPage />,
  },

  {
    path: '*',
    element: <PlaceholderPage title="Page Not Found" />,
  },
]);
