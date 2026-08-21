import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Lightbulb, Play, Star, ThumbsDown, Volume2 } from 'lucide-react';
import { AppShell } from '../components/AppShell';

type EchoType = 'confused' | 'important' | 'insight';

const echoes: { time: number; label: string; type: EchoType; count: number }[] = [
  { time: 74, label: 'Why does acceleration change here?', type: 'confused', count: 4 },
  { time: 188, label: 'This connects force to motion.', type: 'insight', count: 8 },
  { time: 326, label: 'Remember this definition.', type: 'important', count: 12 },
  { time: 611, label: 'A useful example.', type: 'insight', count: 6 },
];

const styles: Record<EchoType, string> = { confused: 'border-muted-foreground/20 bg-muted', important: 'border-[#F4A14B]/40 bg-[#FFF2E5]', insight: 'border-[#5CB88A]/40 bg-[#EEF9F3]' };

export function LessonPage() {
  const [params, setParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<EchoType | null>(null);
  const selectedTime = Number(params.get('t') ?? 188);
  const selected = useMemo(() => echoes.reduce((a, b) => Math.abs(b.time - selectedTime) < Math.abs(a.time - selectedTime) ? b : a), echoes[0]), [selectedTime]);

  const selectMoment = (time: number) => setParams({ t: String(time) });
  const format = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return <AppShell><div className="mx-auto max-w-6xl space-y-6">
    <div className="flex items-center justify-between"><Link to="/classes/physics" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Introduction to Physics</Link><span className="text-sm text-muted-foreground">Lesson 2 of 8</span></div>
    <header><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Forces and why things move</h1><p className="mt-2 text-sm text-muted-foreground">Dr. Mehta · 42 min</p></header>

    <section className="overflow-hidden rounded-2xl border bg-black">
      <div className="aspect-video grid place-items-center bg-[#101827] text-white/80"><div className="text-center"><div className="mx-auto grid size-14 place-items-center rounded-full bg-white/10"><Play className="ml-1 size-6 fill-current" /></div><p className="mt-3 text-sm">Lesson video</p></div></div>
      <div className="flex items-center gap-4 px-4 py-3 text-white"><Play className="size-4 fill-current" /><div className="h-1.5 flex-1 rounded-full bg-white/20"><div className="h-full w-[31%] rounded-full bg-[#F4A14B]" /></div><span className="text-xs">13:08 / 42:17</span><Volume2 className="size-4" /></div>
    </section>

    <section className="rounded-2xl border bg-card p-5 sm:p-6"><h2 className="font-semibold">What do you think about this moment?</h2><p className="mt-1 text-sm text-muted-foreground">Leave an Echo here. You can revisit it later.</p><div className="mt-5 grid gap-3 sm:grid-cols-3">
      {([['confused', ThumbsDown, 'Confused'], ['important', Star, 'Important'], ['insight', Lightbulb, 'Insight']] as const).map(([type, Icon, label]) => <button key={type} type="button" onClick={() => setSelectedType(type)} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${selectedType === type ? styles[type] : 'bg-background hover:bg-muted'}`}><Icon className="size-4" />{label}</button>)}
    </div></section>

    <section className="rounded-2xl border bg-card p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Echo Timeline</h2><p className="mt-1 text-sm text-muted-foreground">Learning activity across this lesson</p></div><span className="text-xs text-muted-foreground">42:17</span></div>
      <div className="relative mt-7 h-14"><div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-muted" />{echoes.map((echo) => <button key={echo.time} type="button" aria-label={`Jump to ${format(echo.time)}: ${echo.label}`} onClick={() => selectMoment(echo.time)} className={`absolute top-2 -translate-x-1/2 rounded-full border-2 border-background transition hover:scale-110 ${selected.time === echo.time ? 'size-7 ring-2 ring-ring' : 'size-5'} ${echo.type === 'important' ? 'bg-[#F4A14B]' : echo.type === 'insight' ? 'bg-[#5CB88A]' : 'bg-muted-foreground'}`} style={{ left: `${(echo.time / 2537) * 100}%` }}><span className="sr-only">{format(echo.time)}</span></button>)}</div>
      <div className="flex justify-between text-[11px] text-muted-foreground"><span>00:00</span><span>21:08</span><span>42:17</span></div>
    </section>

    <section className={`rounded-2xl border p-5 sm:p-6 ${styles[selected.type]}`}><div className="flex items-start gap-3"><div className="mt-0.5">{selected.type === 'important' ? <Star className="size-5" /> : selected.type === 'insight' ? <Lightbulb className="size-5" /> : <ThumbsDown className="size-5" />}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><h2 className="font-semibold">{selected.label}</h2><span className="text-xs">{format(selected.time)}</span></div><p className="mt-2 text-sm text-muted-foreground">{selected.count} learners marked this moment. This is a shared learning hotspot.</p><div className="mt-4 rounded-lg border bg-background/60 p-4"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Teacher response</p><p className="mt-2 text-sm leading-6">“Pause here and connect this idea to the example we just discussed. The change in acceleration is the clue.”</p></div><button type="button" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"><Check className="size-4" />Got it</button></div></div></section>
  </div></AppShell>;
}
