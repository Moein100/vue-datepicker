import {
  getDaysInMonth as getJalaaliDaysInMonth,
  setYear as setJalaaliYear,
  setMonth as setJalaaliMonth,
  setDate as setJalaaliDate,
} from 'date-fns-jalali';

import { getDaysInMonth as getGregorianDaysInMonth } from 'date-fns';
export class DateParseError extends Error {
  constructor(message, input) {
    super(message);
    this.name = 'DateParseError';
    this.input = input;
  }
}

function isValidInteger(value, min, max) {
  return Number.isInteger(value) && value >= min && value <= max;
}

export function isValidJalaaliDate(year, month, day) {
  if (
    !isValidInteger(year, 1, 3000) ||
    !isValidInteger(month, 1, 12) ||
    !isValidInteger(day, 1, 31)
  ) {
    return false;
  }

  try {
    let date = new Date();
    date = setJalaaliYear(date, year);
    date = setJalaaliMonth(date, month - 1);
    date = setJalaaliDate(date, 1);

    return day <= getJalaaliDaysInMonth(date);
  } catch {
    return false;
  }
}

export function isValidGregorianDate(year, month, day) {
  if (
    !isValidInteger(year, 1, 9999) ||
    !isValidInteger(month, 1, 12) ||
    !isValidInteger(day, 1, 31)
  ) {
    return false;
  }

  try {
    const date = new Date(year, month - 1, 1);
    const maxDay = getGregorianDaysInMonth(date);

    return day <= maxDay;
  } catch {
    return false;
  }
}

export function isValidHijriDate(year, month, day) {
  return (
    isValidInteger(year, 1, 9999) && isValidInteger(month, 1, 12) && isValidInteger(day, 1, 30)
  );
}

export function isValidDate(date) {
  if (!date || typeof date !== 'object') return false;

  if ('jy' in date) {
    return isValidJalaaliDate(date.jy, date.jm, date.jd);
  }

  if ('year' in date) {
    return isValidGregorianDate(date.year, date.month, date.day);
  }

  return false;
}

function parseStringDate(input) {
  if (typeof input !== 'string') return null;

  const parts = input
    .trim()
    .split(/[\/\-\.]/)
    .map(Number);

  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return null;
  }

  const [jy, jm, jd] = parts;

  return isValidJalaaliDate(jy, jm, jd) ? { jy, jm, jd } : null;
}

function parseObjectDate(input) {
  if (!input || typeof input !== 'object') return null;

  if ('jy' in input) {
    return isValidJalaaliDate(input.jy, input.jm, input.jd)
      ? { jy: input.jy, jm: input.jm, jd: input.jd }
      : null;
  }

  if ('year' in input) {
    return isValidGregorianDate(input.year, input.month, input.day)
      ? { year: input.year, month: input.month, day: input.day }
      : null;
  }

  return null;
}

export function parseDate(input, { strict = false } = {}) {
  if (input == null) return null;

  let parsed = null;

  if (typeof input === 'string') {
    parsed = parseStringDate(input);
    if (!parsed && strict) {
      throw new DateParseError('Invalid date string', input);
    }
  }

  if (typeof input === 'object') {
    parsed = parseObjectDate(input);
    if (!parsed && strict) {
      throw new DateParseError('Invalid date object', input);
    }
  }

  if (!parsed && strict) {
    throw new DateParseError(`Unsupported date type: ${typeof input}`, input);
  }

  return parsed;
}

export function parseJalaaliDate(input, options = {}) {
  return parseDate(input, options);
}

export function parseJalaaliDateTime(input, options = {}) {
  const date = parseDate(input, options);
  if (!date || typeof input !== 'object') return date;

  return {
    ...date,
    ...(typeof input.hour === 'number' && { hour: input.hour }),
    ...(typeof input.minute === 'number' && { minute: input.minute }),
  };
}

export function parseDateRange(range, options = {}) {
  if (!range || typeof range !== 'object') return null;

  const start = parseJalaaliDateTime(range.start, options);
  const end = parseJalaaliDateTime(range.end, options);

  return start || end ? { start, end } : null;
}

export function parseMultipleDates(dates, options = {}) {
  if (!Array.isArray(dates)) return [];

  return dates.map((date) => parseJalaaliDateTime(date, options)).filter(Boolean);
}
