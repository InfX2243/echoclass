import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { useTheme } from '../theme/ThemeProvider';
import type { Theme } from '../theme/theme.types';

const options = [
  { value: 'light' as Theme, title: 'Light', description: 'Use the light EchoClass interface.', icon: Sun },
  { value: 'dark' as Theme, title: 'Dark', description: 'Use a darker interface for low-light environments.', icon: Moon },
  { value: 'system' as Theme, title: 'System', description: 'Follow your device preference automatically.', icon: Monitor },
];

export function SettingsPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return <AppShell><div className="mx-auto max-w-3xl space-y-8"><header><p className="text-sm font-medium text-muted-foreground">Account settings</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Make EchoClass feel like yours.</h1><p className="mt-2 text-muted-foreground">Choose how the application should appear. Your preference is saved on this device.</p></header><section className="rounded-2xl border bg-card p-5 sm:p-7"><div><h2 className="text-lg font-semibold">Appearance</h2><p className="mt-1 text-sm text-muted-foreground">Current appearance: <span className="font-medium capitalize text-foreground">{resolvedTheme}</span></p></div><div className="mt-6 grid gap-3">{options.map(({ value, title, description, icon: Icon }) => { const selected = theme === value; return <button key={value} type="button" onClick={() => setTheme(value)} className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-foreground/20 hover:bg-muted/40'}`}><div className="grid size-10 place-items-center rounded-lg bg-muted"><Icon className="size-5" /></div><div className="min-w-0 flex-1"><p className="font-medium">{title}</p><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>{selected && <Check className="size-5 text-primary" aria-label="Selected" />}</button>; })}</div></section></div></AppShell>;
}
