import { useState } from 'react';
import { BookOpen, Plus, X } from 'lucide-react';
const KEY = 'atomic-habit-notebook-v1';
export function loadHabits(): string[] {
  try { const data: unknown = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(data) ? data.filter((v): v is string => typeof v === 'string') : []; } catch { return []; }
}
export default function HabitNotebook() {
  const [habits, setHabits] = useState(loadHabits);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  function save(next: string[]) {
    try { localStorage.setItem(KEY, JSON.stringify(next)); setHabits(next); setError(''); return true; }
    catch { setError('Could not save your notebook. Check browser storage.'); return false; }
  }
  function add() {
    const name = draft.trim();
    if (!name) return;
    if (habits.some(h => h.toLowerCase() === name.toLowerCase())) { setError('This habit already exists.'); return; }
    if (save([...habits, name])) setDraft('');
  }
  return <div className="notebook">
    <button type="button" className="notebook-toggle" aria-expanded={open} aria-controls="habit-notebook" onClick={() => setOpen(!open)}><BookOpen size={17}/> Habit notebook <span>{habits.length}</span></button>
    {habits.length > 0 && !open && <div className="habit-tags">{habits.map(h => <span className="habit-tag" key={h}>{h}</span>)}</div>}
    {open && <div id="habit-notebook" className="notebook-panel"><p>Define the habits behind your daily commitment. Tags do not change the index individually.</p><form className="habit-form" onSubmit={e => {e.preventDefault(); add();}}><input aria-label="New habit" placeholder="e.g. Read 10 pages" value={draft} maxLength={80} onChange={e => setDraft(e.target.value)}/><button type="submit" aria-label="Add habit" disabled={!draft.trim()}><Plus size={18}/> Add</button></form><div className="habit-tags">{habits.map(h => <span className="habit-tag" key={h}>{h}<button type="button" aria-label={`Remove ${h}`} onClick={() => save(habits.filter(v => v !== h))}><X size={14}/></button></span>)}</div>{error && <p role="alert" className="save-error">{error}</p>}</div>}
  </div>;
}
