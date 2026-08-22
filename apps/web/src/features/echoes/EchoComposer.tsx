import { useState } from 'react';
import { useCreateEcho } from './hooks';
import type { EchoType } from './types';

const options: { value: EchoType; label: string }[] = [
  { value: 'QUESTION', label: 'Question' },
  { value: 'CONFUSION', label: 'Confusion' },
  { value: 'INSIGHT', label: 'Insight' },
  { value: 'REVIEW', label: 'Review' },
];

export function EchoComposer({ lessonId, timestampSeconds }: { lessonId: string; timestampSeconds: number }) {
  const [type, setType] = useState<EchoType>('QUESTION');
  const [note, setNote] = useState('');
  const mutation = useCreateEcho();
  const submit = (event: React.FormEvent) => { event.preventDefault(); mutation.mutate({ lessonId, timestampSeconds, type, note: note.trim() || undefined }, { onSuccess: () => setNote('') }); };
  return <form onSubmit={submit} className="rounded-2xl border bg-card p-5 sm:p-6">
    <div className="flex items-center justify-between gap-3"><div><h2 className="font-semibold">Leave an Echo</h2><p className="mt-1 text-sm text-muted-foreground">Mark this moment at {Math.floor(timestampSeconds / 60)}:{String(Math.floor(timestampSeconds % 60)).padStart(2, '0')}.</p></div><button disabled={mutation.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{mutation.isPending ? 'Saving…' : 'Save Echo'}</button></div>
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{options.map((option) => <button key={option.value} type="button" onClick={() => setType(option.value)} className={`rounded-lg border px-3 py-2 text-sm ${type === option.value ? 'border-primary bg-primary/10 font-medium' : 'hover:bg-muted'}`}>{option.label}</button>)}</div>
    <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} rows={3} placeholder="Optional note…" className="mt-4 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
    {mutation.isError && <p className="mt-2 text-sm text-destructive">Unable to save this Echo. Please try again.</p>}
  </form>;
}
