import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';

const classes = [
  { id: 'physics', name: 'Introduction to Physics', teacher: 'Dr. Mehta', lessons: 8, progress: 72, description: 'Build intuition for motion, forces, energy, and the ideas underneath them.' },
  { id: 'history', name: 'Modern World History', teacher: 'Prof. Shah', lessons: 12, progress: 46, description: 'Trace the people, movements, and turning points that shaped the modern world.' },
  { id: 'biology', name: 'Foundations of Biology', teacher: 'Dr. Rao', lessons: 6, progress: 28, description: 'A visual introduction to cells, systems, inheritance, and living processes.' },
];

export function ClassesPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <p className="text-sm font-medium text-muted-foreground">Learning space</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Classes</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Your classes, lessons, and the learning traces you are building along the way.</p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((item) => (
            <Link key={item.id} to={`/classes/${item.id}`} className="group rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-sm font-semibold">{item.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div>
                <span className="text-xs text-muted-foreground">{item.lessons} lessons</span>
              </div>
              <h2 className="mt-5 font-semibold group-hover:underline group-hover:underline-offset-4">{item.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.teacher}</p>
              <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              <div className="mt-6"><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Progress</span><span>{item.progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${item.progress}%` }} /></div></div>
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-dashed bg-card/50 p-6 text-center">
          <p className="font-medium">Have a class invite?</p>
          <p className="mt-1 text-sm text-muted-foreground">Joining a class will make its published lessons available here.</p>
          <button type="button" className="mt-4 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted">Join a class</button>
        </div>
      </div>
    </AppShell>
  );
}
