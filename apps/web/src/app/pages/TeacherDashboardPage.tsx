import { ArrowRight, BookOpen, Flame, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';

const metrics = [
  { label: 'Classes', value: '2', icon: BookOpen },
  { label: 'Students', value: '52', icon: Users },
  { label: 'Recent Echo activity', value: '25', icon: Flame },
];

const classes = [
  { id: 'physics', name: 'Introduction to Physics', students: 28, lessons: 8, activity: 'High activity' },
  { id: 'history', name: 'Modern World History', students: 24, lessons: 12, activity: 'Steady activity' },
];

const hotspots = [
  { lesson: 'Forces and why things move', className: 'Introduction to Physics', time: '10:51', echoes: 14 },
  { lesson: 'The world connected by trade', className: 'Modern World History', time: '20:18', echoes: 11 },
];

export function TeacherDashboardPage() {
  return <AppShell><div className="space-y-9">
    <header><p className="text-sm font-medium text-muted-foreground">Teacher dashboard</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">See where learning is happening.</h1><p className="mt-2 max-w-2xl text-muted-foreground">A quiet overview of your classes, lessons, and the moments students are engaging with most.</p></header>

    <section className="grid gap-4 sm:grid-cols-3">
      {metrics.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-xl border bg-card p-5"><Icon className="size-5 text-muted-foreground" /><p className="mt-5 text-2xl font-semibold">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></article>)}
    </section>

    <section><div className="mb-4 flex items-end justify-between"><div><h2 className="text-lg font-semibold">My classes</h2><p className="mt-1 text-sm text-muted-foreground">Your current teaching spaces.</p></div><button type="button" className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Create class</button></div><div className="grid gap-4 md:grid-cols-2">{classes.map((item) => <Link key={item.id} to={`/classes/${item.id}`} className="rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm"><div className="flex items-start justify-between"><div><h3 className="font-semibold">{item.name}</h3><p className="mt-1 text-sm text-muted-foreground">{item.activity}</p></div><ArrowRight className="size-4 text-muted-foreground" /></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-lg bg-muted/60 p-3"><p className="text-lg font-semibold">{item.students}</p><p className="text-xs text-muted-foreground">Students</p></div><div className="rounded-lg bg-muted/60 p-3"><p className="text-lg font-semibold">{item.lessons}</p><p className="text-xs text-muted-foreground">Lessons</p></div></div></Link>)}</div></section>

    <section className="rounded-xl border bg-card p-5 sm:p-6"><div className="mb-5"><h2 className="text-lg font-semibold">Recent hotspots</h2><p className="mt-1 text-sm text-muted-foreground">Moments with concentrated Echo activity. Activity indicates engagement, not automatically confusion.</p></div><div className="space-y-3">{hotspots.map((item) => <div key={item.lesson} className="flex items-center gap-4 rounded-lg border bg-background p-4"><div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#EEF9F3]"><Flame className="size-4 text-[#286846]" /></div><div className="min-w-0 flex-1"><p className="font-medium">{item.lesson}</p><p className="mt-1 text-xs text-muted-foreground">{item.className} · {item.time}</p></div><span className="text-sm font-medium">{item.echoes} Echoes</span></div>)}</div></section>
  </div></AppShell>;
}
