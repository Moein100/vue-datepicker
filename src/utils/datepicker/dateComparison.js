import { compareAsc, isSameDay, isBefore as dfIsBefore, isAfter as dfIsAfter } from 'date-fns';

import { setYear, setMonth, setDate } from 'date-fns-jalali';

function toNativeDate(date) {
  if (!date) return null;

  if ('jy' in date) {
    let d = new Date();
    d = setYear(d, date.jy);
    d = setMonth(d, date.jm - 1);
    d = setDate(d, date.jd);
    return d;
  }
  if ('year' in date) {
    return new Date(date.year, date.month - 1, date.day);
  }

  return null;
}

export function compareDates(a, b) {
  const da = toNativeDate(a);
  const db = toNativeDate(b);

  if (!da || !db) return 0;

  return compareAsc(da, db);
}

export function isSameDate(a, b) {
  const da = toNativeDate(a);
  const db = toNativeDate(b);

  if (!da || !db) return false;

  return isSameDay(da, db);
}

export function isBefore(a, b) {
  const da = toNativeDate(a);
  const db = toNativeDate(b);

  if (!da || !db) return false;

  return dfIsBefore(da, db);
}

export function isAfter(a, b) {
  const da = toNativeDate(a);
  const db = toNativeDate(b);

  if (!da || !db) return false;

  return dfIsAfter(da, db);
}

export function isBetween(date, start, end) {
  const d = toNativeDate(date);
  const s = toNativeDate(start);
  const e = toNativeDate(end);

  if (!d || !s || !e) return false;

  return compareAsc(d, s) >= 0 && compareAsc(d, e) <= 0;
}

export function isBetweenExclusive(date, start, end) {
  const d = toNativeDate(date);
  const s = toNativeDate(start);
  const e = toNativeDate(end);

  if (!d || !s || !e) return false;

  return compareAsc(d, s) > 0 && compareAsc(d, e) < 0;
}

export function sortDates(dates, descending = false) {
  const sorted = [...dates].sort((a, b) => compareDates(a, b));

  return descending ? sorted.reverse() : sorted;
}
