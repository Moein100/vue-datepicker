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

export function isValidGregorianDate(year, month, day) {
  if (!Number.isInteger(year) || year < 1 || year > 9999) return false;
  if (!Number.isInteger(month) || month < 1 || month > 12) return false;
  if (!Number.isInteger(day) || day < 1) return false;

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const maxDay = month === 2 && isLeapYear ? 29 : daysInMonth[month - 1];
  return day <= maxDay;
}

export function isValidHijriDate(year, month, day) {
  if (!Number.isInteger(year) || year < 1 || year > 9999) return false;
  if (!Number.isInteger(month) || month < 1 || month > 12) return false;
  if (!Number.isInteger(day) || day < 1 || day > 30) return false;
  return true;
}

export function isValidDate(dateObj) {
  if (!dateObj || typeof dateObj !== 'object') return false;

  if (dateObj.jy !== undefined && dateObj.jm !== undefined && dateObj.jd !== undefined) {
    return isValidJalaaliDate(dateObj.jy, dateObj.jm, dateObj.jd);
  }

  if (dateObj.year !== undefined && dateObj.month !== undefined && dateObj.day !== undefined) {
    return isValidGregorianDate(dateObj.year, dateObj.month, dateObj.day);
  }

  return false;
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

  const { jy, jm, jd, year, month, day } = dateObj;

  if (jy !== undefined && jm !== undefined && jd !== undefined) {
    if (!isValidJalaaliDate(jy, jm, jd)) {
      return null;
    }
    return { jy, jm, jd };
  }

  if (year !== undefined && month !== undefined && day !== undefined) {
    if (!isValidGregorianDate(year, month, day)) {
      return null;
    }
    return { year, month, day };
  }

  return null;
}

export function parseDate(date, options = {}) {
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
        'Invalid date object. Expected { jy, jm, jd } or { year, month, day } with valid values',
        date,
      );
    }
  } else if (strict) {
    throw new DateParseError(`Unsupported date type: ${typeof date}`, date);
  }

  return result;
}

export function parseJalaaliDate(date, options = {}) {
  return parseDate(date, options);
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
