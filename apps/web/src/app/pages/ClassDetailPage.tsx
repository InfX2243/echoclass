import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, PlayCircle } from 'lucide-react';
import { AppShell } from '../components/AppShell';

const lessonData: Record<string, { name: string; teacher: string; description: string; lessons: { id: string; title: string; duration: string; status: string; }[] }> = {
  physics: { name: 'Introduction to Physics', teacher: 'Dr. Mehta', description: 'Build intuition for motion, forces, energy, and the ideas underneath them.', lessons: [
    { id: 'motion', title: 'Motion is a story of change', duration: '38 min', status: 'Completed' },
    { id: 'forces', title: 'Forces and why things move', duration: '42 min', status: 'Continue' },
    { id: 'energy', title: 'Where does energy go?', duration: '35 min', status: 'Not started' },
  ] },
  history: { name: 'Modern World History', teacher: 'Prof. Shah', description: 'Trace the people, movements, and turning points that shaped the modern world.', lessons: [
    { id: 'trade-routes', title: 'The world connected by trade', duration: '31 min', status: 'Completed' },
    { id: 'revolutions', title: 'Ideas that changed societies', duration: '44 min', status: 'Continue' },
    { id: 'industrial-age', title: 'The industrial age', duration: '39 min', status: 'Not started' },
  ] },
  biology: { name: 'Foundations of Biology', teacher: 'Dr. Rao', description: 'A visual introduction to cells, systems, inheritance, and living processes.', lessons: [
    { id: 'cells', title: 'A cell is a tiny world', duration: '29 min', status: 'Continue' },
    { id: 'systems', title: 'How living systems cooperate', duration: '36 min', status: 'Not started' },
  ] },
};

export function ClassDetailPage() {
  const { classId = 'physics' } = useParams();
  const data = lessonData[classId] ?? lessonData.physics;

  return <AppShell><div className="space-y-8">
    <Link to="/classes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to classes</Link>
    <header className="rounded-2xl border bg-card p-6 sm:p-8">
      <p className="text-sm font-medium text-muted-foreground">{data.teacher}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{data.name}</h1>
      <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{data.description}</p>
    </header>
    <section><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Published lessons</h2><span className="text-sm text-muted-foreground">{data.lessons.length} lessons</span></div>
      <div className="space-y-3">{data.lessons.map((lesson, index) => <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="flex items-center gap-4 rounded-xl border bg-card p-4 transition hover:border-foreground/20 hover:shadow-sm">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-sm font-semibold">{String(index + 1).padStart(2, '0')}</div>
        <div className="min-w-0 flex-1"><h3 className="font-medium">{lesson.title}</h3><div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Clock3 className="size-3" />{lesson.duration}</span><span>{lesson.status}</span></div></div>
        <PlayCircle className="size-5 text-muted-foreground" />
      </Link>)}</div>
    </section>
  </div></AppShell>;
}
