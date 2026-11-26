export const BASE_INDEX = 100;
export const STORAGE_KEY = 'atomic-growth-records-v1';

// Local calendar date, not UTC: UTC can move today's entry to yesterday/tomorrow.
export function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
export function shiftDate(key, offset) {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d + offset, 12);
  return localDateKey(date);
}
export function validDateKey(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const dt = new Date(y, m - 1, d, 12);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}
export function normalizeRecords(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.filter(r => {
    if (!r || !validDateKey(r.date) || !['completed', 'missed'].includes(r.outcome) || seen.has(r.date)) return false;
    seen.add(r.date);
    return true;
  }).map(r => ({ date: r.date, outcome: r.outcome })).sort((a,b) => a.date.localeCompare(b.date));
}
export function recordToday(records, outcome, day = localDateKey()) {
  if (!['completed', 'missed'].includes(outcome)) return records;
  if (!validDateKey(day) || records.some(r => r.date === day)) return records;
  return normalizeRecords([...records, { date:day, outcome }]);
}
export function buildSeries(records) {
  const sorted = normalizeRecords(records);
  if (!sorted.length) return [];
  let index = BASE_INDEX;
  // Baseline is a reference value, not a historical action.
  const data = [{date:shiftDate(sorted[0].date, -1), index:BASE_INDEX, outcome:'baseline'}];
  for (const record of sorted) {
    index *= record.outcome === 'completed' ? 1.01 : 0.99;
    data.push({ date:record.date, index, outcome:record.outcome });
  }
  return data;
}
export function currentIndex(records) {
  return normalizeRecords(records).reduce((index, r) => index * (r.outcome === 'completed' ? 1.01 : 0.99), BASE_INDEX);
}
export function streak(records, today = localDateKey()) {
  const successes = new Set(normalizeRecords(records).filter(r => r.outcome === 'completed').map(r => r.date));
  let cursor = successes.has(today) ? today : shiftDate(today, -1);
  let count = 0;
  while (successes.has(cursor)) { count++; cursor = shiftDate(cursor, -1); }
  return count;
}
