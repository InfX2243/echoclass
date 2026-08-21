import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock3, Lightbulb, Star, ThumbsDown } from 'lucide-react';
import { AppShell } from '../components/AppShell';

type Status = 'due' | 'upcoming' | 'completed';
type EchoType = 'confused' | 'important' | 'insight';

const revisits: { id: string; status: Status; type: EchoType; lesson: string; className: string; timestamp: string; message: string; when: string }[] = [
  { id: 'revisit-1', status: 'due', type: 'confused', lesson: 'Forces and why things move', className: 'Introduction to Physics', timestamp: '01:14', message: 'You marked this moment confusing 3 days ago.', when: 'Due today' },
  { id: 'revisit-2', status: 'due', type: 'important', lesson: 'The world connected by trade', className: 'Modern World History', timestamp: '20:18', message: 'You marked this moment important 5 days ago.', when: 'Due today' },
  { id: 'revisit-3', status: 'upcoming', type: 'insight', lesson: 'Motion is a story of change', className: 'Introduction to Physics', timestamp: '12:42', message: 'A useful learning moment to revisit soon.', when: 'Tomorrow' },
  { id: 'revisit-4', status: 'completed', type: 'insight', lesson: 'A cell is a tiny world', className: 'Foundations of Biology', timestamp: '08:31', message: 'You revisited this moment and marked it understood.', when: 'Completed' },
];

const typeMeta: Record<EchoType, { label: string; icon: typeof Lightbulb; className: string }> = {
  confused: { label: 'Confused', icon: ThumbsDown, className: 'bg-muted text-muted-foreground' },
  important: { label: 'Important', icon: Star, className: 'bg-[#FFF2E5] text-[#8A541F]' },
  insight: { label: 'Insight', icon: Lightbulb, className: 'bg-[#EEF9F3] text-[#286846]' },
};

export function RevisitsPage() {
  const sections: { status: Status; title: string; description: string }[] = [
    { status: 'due', title: 'Due today', description: 'A few moments are ready for another look.' },
    { status: 'upcoming', title: 'Upcoming', description: 'Moments scheduled for a little later.' },
    { status: 'completed', title: 'Completed', description: 'Moments you have already revisited.' },
  ];

  return <AppShell><div className="space-y-9">
    <header><p className="text-sm font-medium text-muted-foreground">Spaced review</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Revisit</h1><p className="mt-2 max-w-2xl text-muted-foreground">Return to the moments that mattered. A revisit is about understanding, not keeping score.</p></header>
    {sections.map((section) => { const items = revisits.filter((item) => item.status === section.status); if (!items.length) return null; return <section key={section.status}><div className="mb-4"><h2 className="text-lg font-semibold">{section.title}</h2><p className="mt-1 text-sm text-muted-foreground">{section.description}</p></div><div className="space-y-3">{items.map((item) => { const meta = typeMeta[item.type]; const Icon = meta.icon; const href = `/lessons/${item.id}?t=${item.timestamp === '20:18' ? 1218 : item.timestamp === '12:42' ? 762 : item.timestamp === '08:31' ? 511 : 74}`; return <article key={item.id} className="rounded-xl border bg-card p-5"><div className="flex items-center gap-4"><div className={`grid size-10 shrink-0 place-items-center rounded-lg ${meta.className}`}><Icon className="size-4" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold">{item.lesson}</span><span className="text-xs text-muted-foreground">{item.timestamp}</span></div><p className="mt-1 text-sm text-muted-foreground">{item.className} · {item.message}</p></div>{item.status === 'completed' ? <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF9F3] px-2.5 py-1 text-xs font-medium text-[#286846]"><Check className="size-3" />Done</span> : <Link to={href} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Revisit <ArrowRight className="size-4" /></Link>}</div>{item.status !== 'completed' && <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{item.when}</div>}</article>; })}</div></section>; })}
  </div></AppShell>;
}
