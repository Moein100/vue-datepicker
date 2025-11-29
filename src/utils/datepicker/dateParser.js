import { jalaaliMonthLength } from './jalaali.js';

export class DateParseError extends Error {
  constructor(message, input) {
    super(message);
    this.name = 'DateParseError';
    this.input = input;
  }
}

export function isValidJalaaliDate(year, month, day) {
  if (!Number.isInteger(year) || year < 1 || year > 3000) return false;
  if (!Number.isInteger(month) || month < 1 || month > 12) return false;
  if (!Number.isInteger(day) || day < 1) return false;

  const maxDay = jalaaliMonthLength(year, month);
  return day <= maxDay;
}

function parseStringDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const separators = /[\/\-\.]/;
  const parts = dateStr.trim().split(separators).map(Number);

  if (parts.length !== 3 || parts.some(isNaN)) {
    return null;
  }

  const [jy, jm, jd] = parts;

  if (!isValidJalaaliDate(jy, jm, jd)) {
    return null;
  }

  return { jy, jm, jd };
}

function parseObjectDate(dateObj) {
  if (!dateObj || typeof dateObj !== 'object') return null;

  const { jy, jm, jd } = dateObj;

  if (jy === undefined || jm === undefined || jd === undefined) {
    return null;
  }

  if (!isValidJalaaliDate(jy, jm, jd)) {
    return null;
  }

  return { jy, jm, jd };
}

export function parseJalaaliDate(date, options = {}) {
  const { strict = false } = options;

  if (date === null || date === undefined) {
    return null;
  }

  let result = null;

  if (typeof date === 'string') {
    result = parseStringDate(date);
    if (!result && strict) {
      throw new DateParseError(
        `Invalid date string: "${date}". Expected format: YYYY/MM/DD or YYYY-MM-DD`,
        date,
      );
    }
  } else if (typeof date === 'object') {
    result = parseObjectDate(date);
    if (!result && strict) {
      throw new DateParseError(
        'Invalid date object. Expected { jy, jm, jd } with valid values',
        date,
      );
    }
  } else if (strict) {
    throw new DateParseError(`Unsupported date type: ${typeof date}`, date);
  }

  return result;
}

export function parseJalaaliDateTime(dateTime, options = {}) {
  if (!dateTime) return null;

  const date = parseJalaaliDate(dateTime, options);
  if (!date) return null;

  if (typeof dateTime === 'object') {
    const hour = typeof dateTime.hour === 'number' ? dateTime.hour : undefined;
    const minute = typeof dateTime.minute === 'number' ? dateTime.minute : undefined;

    return {
      ...date,
      ...(hour !== undefined && { hour }),
      ...(minute !== undefined && { minute }),
    };
  }

  return date;
}

export function parseDateRange(range, options = {}) {
  if (!range || typeof range !== 'object') return null;

  const start = parseJalaaliDateTime(range.start, options);
  const end = parseJalaaliDateTime(range.end, options);

  if (!start && !end) return null;

  return { start, end };
}

export function parseMultipleDates(dates, options = {}) {
  if (!Array.isArray(dates)) return [];

  return dates.map((d) => parseJalaaliDateTime(d, options)).filter(Boolean);
}
