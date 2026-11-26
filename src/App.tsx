import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, CircleHelp, Minus, TrendingUp } from 'lucide-react';
import HabitNotebook from './components/HabitNotebook';
import GrowthChart from './components/GrowthChart';
import { buildSeries, currentIndex, localDateKey, normalizeRecords, recordToday, STORAGE_KEY, streak } from './lib/growth.mjs';
import type { Outcome, RecordEntry } from './lib/growth.mjs';

function loadRecords(): RecordEntry[] {
  try { return normalizeRecords(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
  catch { return []; }
}
const formatIndex = (value:number) => value.toFixed(2);

export default function App() {
  const [records,setRecords] = useState<RecordEntry[]>(loadRecords);
  const [saveError,setSaveError] = useState(false);
  const today = localDateKey();
  const todaysRecord = records.find(r=>r.date===today);
  const data = useMemo(()=>buildSeries(records),[records]);
  const index = useMemo(()=>currentIndex(records),[records]);
  const change = (index - 100);
  const positive = change >= 0;
  const currentStreak = streak(records,today);
  const completed = records.filter(r=>r.outcome==='completed').length;
  const dateText = new Date(`${today}T12:00:00`).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  function submit(outcome:Outcome) {
    if(todaysRecord) return;
    const next = recordToday(records,outcome,today);
    try {
      localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
      setRecords(next);
      setSaveError(false);
    } catch { setSaveError(true); }
  }
  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><TrendingUp size={21} strokeWidth={2.5}/></div><div><div className="brand-name">ATOMIC<span className="brand-period">.</span></div><div className="brand-subtitle">YOUR GROWTH, MEASURED DAILY</div></div></div>
      <div className="header-right"><span className="market-light"/><span>PERSONAL GROWTH MARKET</span><span className="header-divider"/><span className="current-date">{dateText}</span></div>
    </header>
    <main className="main-content">
      <div className="intro-line"><div className="section-heading"><span className="eyebrow">YOUR PERSONAL INDEX</span><h1>Growth over time<span className="heading-period">.</span></h1><p>One decision a day. A trajectory you can see.</p></div><div className="market-label"><span className="market-light"/> LIVE RECORD <span className="small-bar">/</span> <span>{String(records.length).padStart(2,'0')} DAYS LOGGED</span></div></div>
      <section className="chart-card">
        <div className="chart-header"><div><span className="chart-kicker">ATOMIC GROWTH INDEX <CircleHelp size={13} aria-label="Growth index uses a 1% daily compound change"/></span><div className="price-line"><span className="big-index">{formatIndex(index)}</span><span className={`change-pill ${positive?'positive':'negative'}`}>{positive?<ArrowUpRight size={16}/>:<ArrowDownRight size={16}/>} {change>=0?'+':''}{change.toFixed(2)}%</span></div><div className="price-caption">BASE 100.00 <span>·</span> ALL-TIME PERFORMANCE</div></div><div className="chart-legend"><span className="legend-line" style={{background:positive?'#49e2a0':'#fb777c'}}/> GROWTH INDEX</div></div>
        <GrowthChart data={data} positive={positive}/>
        <div className="chart-footer"><span>DAY-BY-DAY COMPOUND GROWTH</span><span>COMPLETED +1% <span className="footer-sep">/</span> MISSED −1%</span></div>
      </section>
      <div className="lower-grid">
        <section className="decision-card"><div className="panel-topline"><span className="eyebrow">DAILY COMMITMENT</span><span className="day-tag">{today}</span></div><h2>Today's decision</h2><p>Did you show up for your commitment today?</p>
          <HabitNotebook/>
          {todaysRecord ? <div className={`recorded-state ${todaysRecord.outcome==='completed'?'done':'missed'}`}><div className="state-icon">{todaysRecord.outcome==='completed'?<Check size={21}/>:<Minus size={21}/>}</div><div><strong>{todaysRecord.outcome==='completed'?'Completed for today':'Missed for today'}</strong><span>Your decision is recorded. Come back tomorrow.</span></div></div> : <div className="decision-actions"><button type="button" className="complete-button" onClick={()=>submit('completed')}><Check size={19} strokeWidth={3}/> I COMPLETED MY TASK <ArrowUpRight size={18}/></button><button type="button" className="miss-button" onClick={()=>submit('missed')}>I MISSED TODAY <ArrowDownRight size={15}/></button></div>}
          {saveError && <p role="alert" className="save-error">Unable to save your entry. Check browser storage settings and try again.</p>}
          <div className="decision-note">One entry per day. A recorded decision cannot be changed.</div>
        </section>
        <section className="stats-card"><div className="panel-topline"><span className="eyebrow">CURRENT PERFORMANCE</span><span className="stats-symbol">↗</span></div><div className="stats-row"><div className="stat"><span>GROWTH INDEX</span><strong>{formatIndex(index)}</strong><small>Started at 100.00</small></div><div className="stat"><span>OVERALL CHANGE</span><strong className={positive?'green-text':'red-text'}>{change>=0?'+':''}{change.toFixed(2)}%</strong><small>Since your first day</small></div><div className="stat"><span>CURRENT STREAK</span><strong>{currentStreak}<span className="stat-unit">d</span></strong><small>Consecutive days</small></div></div><div className="stats-bottom">{records.length ? `${completed} completed out of ${records.length} recorded days` : 'Your growth starts with one recorded day.'}</div></section>
      </div>
      <footer className="site-footer"><span>ATOMIC <span className="footer-dot">●</span> THE GROWTH MARKET</span><span>SMALL IMPROVEMENTS COMPOUND.</span><span>DATA STORED ON THIS DEVICE ONLY</span></footer>
    </main>
  </div>;
}
