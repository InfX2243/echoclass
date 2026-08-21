import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, ClipboardList, Home, MessageCircle, User } from 'lucide-react';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/classes', label: 'Classes', icon: BookOpen },
  { to: '/echoes', label: 'My Echoes', icon: MessageCircle },
  { to: '/revisits', label: 'Revisit', icon: ClipboardList },
  { to: '/profile', label: 'Profile', icon: User },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-sidebar px-5 py-7 lg:block">
        <NavLink to="/dashboard" className="mb-10 block px-3">
          <div className="text-xl font-semibold tracking-tight text-foreground">EchoClass</div>
          <div className="mt-1 text-xs text-muted-foreground">Every lesson leaves a trace.</div>
        </NavLink>
        <nav className="space-y-1" aria-label="Primary navigation">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur lg:ml-64">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="lg:hidden">
            <div className="font-semibold">EchoClass</div>
            <div className="text-xs text-muted-foreground">Every lesson leaves a trace.</div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">Welcome back</span>
            <div className="grid size-9 place-items-center rounded-full bg-secondary text-sm font-medium">EC</div>
          </div>
        </div>
      </header>

      <main className="lg:ml-64">
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t bg-sidebar/95 p-2 backdrop-blur lg:hidden" aria-label="Mobile navigation">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center gap-1 rounded-md py-2 text-[11px] ${isActive ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
