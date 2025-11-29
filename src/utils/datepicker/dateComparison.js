export function compareDates(a, b) {
  if (!a || !b) return 0;
  if (a.jy !== b.jy) return a.jy - b.jy;
  if (a.jm !== b.jm) return a.jm - b.jm;
  return a.jd - b.jd;
}

export function isSameDate(a, b) {
  if (!a || !b) return false;
  return a.jy === b.jy && a.jm === b.jm && a.jd === b.jd;
}

export function isBefore(a, b) {
  return compareDates(a, b) < 0;
}

export function isAfter(a, b) {
  return compareDates(a, b) > 0;
}

export function isBetween(date, start, end) {
  if (!date || !start || !end) return false;
  return compareDates(date, start) >= 0 && compareDates(date, end) <= 0;
}

export function isBetweenExclusive(date, start, end) {
  if (!date || !start || !end) return false;
  return compareDates(date, start) > 0 && compareDates(date, end) < 0;
}

export function sortDates(dates, descending = false) {
  const sorted = [...dates].sort(compareDates);
  return descending ? sorted.reverse() : sorted;
}
