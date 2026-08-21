import { AppShell } from '../components/AppShell';

const classes = [
  { name: 'Introduction to Physics', teacher: 'Dr. Mehta', lessons: 8, progress: 72 },
  { name: 'Modern World History', teacher: 'Prof. Shah', lessons: 12, progress: 46 },
];

export function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-9">
        <header>
          <p className="text-sm font-medium text-muted-foreground">Student dashboard</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your learning trace</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Pick up where you left off, revisit moments that need another pass, and see the echoes you have left behind.</p>
        </header>

        <section>
          <div className="mb-4 flex items-end justify-between"><h2 className="text-lg font-semibold">Active classes</h2><span className="text-sm text-muted-foreground">2 classes</span></div>
          <div className="grid gap-4 md:grid-cols-2">
            {classes.map((item) => (
              <article key={item.name} className="rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
                <div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold">{item.name}</h3><p className="mt-1 text-sm text-muted-foreground">{item.teacher}</p></div><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{item.lessons} lessons</span></div>
                <div className="mt-6"><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Learning progress</span><span>{item.progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${item.progress}%` }} /></div></div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-xl border bg-card p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Pending revisits</h2><span className="rounded-full bg-[#FFF2E5] px-2.5 py-1 text-xs font-medium text-[#8A541F]">3 waiting</span></div><p className="mt-3 text-sm text-muted-foreground">A few moments could benefit from another look. Revisit them when you are ready.</p><button className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Open revisits</button></article>
          <article className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">Recent Echoes</h2><div className="mt-4 space-y-3"><div className="flex gap-3"><span aria-hidden="true">💡</span><div><p className="text-sm font-medium">The relationship between force and acceleration</p><p className="text-xs text-muted-foreground">Introduction to Physics · 12:42</p></div></div><div className="flex gap-3"><span aria-hidden="true">⭐</span><div><p className="text-sm font-medium">Remember the role of trade routes</p><p className="text-xs text-muted-foreground">Modern World History · 31:08</p></div></div></div></article>
        </section>
      </div>
    </AppShell>
  );
}
