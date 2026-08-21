import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, Star, ThumbsDown } from 'lucide-react';
import { AppShell } from '../components/AppShell';

type EchoType = 'confused' | 'important' | 'insight';

const echoes: { id: string; type: EchoType; lesson: string; className: string; timestamp: string; note?: string; created: string }[] = [
  { id: 'echo-1', type: 'confused', lesson: 'Forces and why things move', className: 'Introduction to Physics', timestamp: '01:14', note: 'Why does the acceleration change even though the force looks constant here?', created: '3 days ago' },
  { id: 'echo-2', type: 'important', lesson: 'The world connected by trade', className: 'Modern World History', timestamp: '20:18', created: '5 days ago' },
  { id: 'echo-3', type: 'insight', lesson: 'Motion is a story of change', className: 'Introduction to Physics', timestamp: '12:42', note: 'This is the part that connects velocity and acceleration for me.', created: '7 days ago' },
  { id: 'echo-4', type: 'insight', lesson: 'A cell is a tiny world', className: 'Foundations of Biology', timestamp: '08:31', created: '9 days ago' },
];

const typeMeta: Record<EchoType, { label: string; icon: typeof Lightbulb; className: string }> = {
  confused: { label: 'Confused', icon: ThumbsDown, className: 'bg-muted text-muted-foreground' },
  important: { label: 'Important', icon: Star, className: 'bg-[#FFF2E5] text-[#8A541F]' },
  insight: { label: 'Insight', icon: Lightbulb, className: 'bg-[#EEF9F3] text-[#286846]' },
};

export function EchoesPage() {
  return <AppShell><div className="space-y-8">
    <header><p className="text-sm font-medium text-muted-foreground">Your learning trace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">My Echoes</h1><p className="mt-2 max-w-2xl text-muted-foreground">A private history of the moments you marked while learning. Your notes stay yours.</p></header>
    <div className="flex flex-wrap gap-2"><span className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium">All · {echoes.length}</span><span className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground">Confused · 1</span><span className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground">Important · 1</span><span className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground">Insight · 2</span></div>
    <section className="space-y-3">{echoes.map((echo) => { const meta = typeMeta[echo.type]; const Icon = meta.icon; return <article key={echo.id} className="rounded-xl border bg-card p-5"><div className="flex items-start gap-4"><div className={`grid size-10 shrink-0 place-items-center rounded-lg ${meta.className}`}><Icon className="size-4" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-3 gap-y-1"><span className="text-sm font-semibold">{meta.label}</span><span className="text-xs text-muted-foreground">{echo.timestamp}</span><span className="text-xs text-muted-foreground">{echo.created}</span></div><h2 className="mt-2 font-medium">{echo.lesson}</h2><p className="mt-1 text-sm text-muted-foreground">{echo.className}</p>{echo.note && <p className="mt-4 rounded-lg bg-muted/60 p-3 text-sm leading-6">{echo.note}</p>}<Link to={`/lessons/${echo.id}?t=${echo.timestamp === '20:18' ? 1218 : echo.timestamp === '12:42' ? 762 : echo.timestamp === '08:31' ? 511 : 74}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:underline">Open lesson <ArrowRight className="size-4" /></Link></div></div></article>; })}</section>
  </div></AppShell>;
}
