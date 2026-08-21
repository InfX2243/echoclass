import { Link, useLocation } from 'react-router-dom';

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const location = useLocation();
  const isLogin = mode === 'login';

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex rounded-xl bg-primary px-4 py-2 text-lg font-semibold text-primary-foreground">EchoClass</div>
          <p className="text-sm text-muted-foreground">Every lesson leaves a trace.</p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">{isLogin ? 'Welcome back.' : 'Create your account.'}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin ? 'Continue your learning journey.' : 'Start building a learning trace with EchoClass.'}
          </p>

          <form className="mt-7 space-y-5" onSubmit={(event) => event.preventDefault()}>
            {!isLogin && (
              <label className="block text-sm font-medium">Name<input className="mt-2 h-11 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" placeholder="Your name" /></label>
            )}
            <label className="block text-sm font-medium">Email<input type="email" className="mt-2 h-11 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" placeholder="you@example.com" /></label>
            <label className="block text-sm font-medium">Password<input type="password" className="mt-2 h-11 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" /></label>
            <button className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90">{isLogin ? 'Sign In' : 'Sign Up'}</button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link className="font-medium text-foreground underline underline-offset-4" to={isLogin ? '/register' : '/login'}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>
        {location.pathname !== '/login' && location.pathname !== '/register' ? null : null}
      </section>
    </main>
  );
}
