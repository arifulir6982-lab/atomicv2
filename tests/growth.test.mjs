import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSeries, currentIndex, localDateKey, normalizeRecords, recordToday, shiftDate, streak } from '../src/lib/growth.mjs';
test('compounds completed days instead of adding fixed percentages', () => {
  const records = Array.from({length:30},(_,i)=>({date:shiftDate('2026-01-01',i),outcome:'completed'}));
  assert.ok(Math.abs(currentIndex(records)-134.7848915332908)<1e-8);
  assert.equal(buildSeries(records).length,31);
});
test('missed day compounds down, does not reset', () => {
  const records=[{date:'2026-11-24',outcome:'completed'},{date:'2026-11-25',outcome:'missed'}];
  assert.ok(Math.abs(currentIndex(records)-99.99)<1e-8);
});
test('prevents duplicate and conflicting entries', () => {
  const first=recordToday([],'completed','2026-11-26');
  assert.equal(recordToday(first,'completed','2026-11-26'),first);
  assert.equal(recordToday(first,'missed','2026-11-26'),first);
});
test('sorts and removes duplicate or invalid imported records',()=>{
  const rows=normalizeRecords([{date:'2026-11-26',outcome:'missed'},{date:'2026-11-24',outcome:'completed'},{date:'2026-11-26',outcome:'completed'},{date:'2026-02-30',outcome:'completed'}]);
  assert.deepEqual(rows,[{date:'2026-11-24',outcome:'completed'},{date:'2026-11-26',outcome:'missed'}]);
});
test('streak requires actual adjacent calendar days and includes yesterday if today is not recorded',()=>{
  const rows=[{date:'2026-11-23',outcome:'completed'},{date:'2026-11-24',outcome:'completed'},{date:'2026-11-25',outcome:'completed'}];
  assert.equal(streak(rows,'2026-11-26'),3);
  assert.equal(streak(rows,'2026-11-27'),0);
  assert.equal(streak(rows,'2026-11-25'),3);
});
test('local date and previous day work across year boundary',()=>{
 assert.equal(localDateKey(new Date(2026,0,1,15,0)), '2026-01-01');
 assert.equal(shiftDate('2026-01-01',-1),'2025-12-31');
});
