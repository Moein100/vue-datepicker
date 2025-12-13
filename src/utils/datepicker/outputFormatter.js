import { setYear, setMonth, setDate } from 'date-fns-jalali';

/**
 * @typedef {Object} GregorianDate
 * @property {number} year - Gregorian year
 * @property {number} month - Gregorian month (1–12)
 * @property {number} day - Gregorian day (1–31)
 * @property {number} [hour] - Optional hour (0–23)
 * @property {number} [minute] - Optional minute (0–59)
 */

/**
 * @typedef {Object} JalaaliDate
 * @property {number} jy - Jalaali year
 * @property {number} jm - Jalaali month (1–12)
 * @property {number} jd - Jalaali day (1–31)
 * @property {number} [hour] - Optional hour
 * @property {number} [minute] - Optional minute
 */

/**
 * @typedef {GregorianDate | JalaaliDate} AnyDate
 */

/**
 * @typedef {Object} DateRange
 * @property {AnyDate} start
 * @property {AnyDate} end
 */

/**
 * Checks if a date object is in Gregorian format.
 * @param {any} d - Input to check
 * @returns {boolean}
 */
const isGregorian = (d) =>
  d && typeof d.year === 'number' && typeof d.month === 'number' && typeof d.day === 'number';

/**
 * Checks if a date object is in Jalaali format.
 * @param {any} d - Input to check
 * @returns {boolean}
 */
const isJalaali = (d) =>
  d && typeof d.jy === 'number' && typeof d.jm === 'number' && typeof d.jd === 'number';

/**
 * Converts Jalaali or Gregorian date into a normalized Gregorian object using date-fns-jalali.
 * @param {AnyDate} date
 * @returns {{year: number, month: number, day: number} | null}
 */
const normalizeToGregorian = (date) => {
  if (isGregorian(date)) {
    return { year: date.year, month: date.month, day: date.day };
  }

  if (isJalaali(date)) {
    // Use date-fns-jalali to convert Jalali to Gregorian
    let jsDate = new Date();
    jsDate = setYear(jsDate, date.jy);
    jsDate = setMonth(jsDate, date.jm - 1);
    jsDate = setDate(jsDate, date.jd);

    return {
      year: jsDate.getFullYear(),
      month: jsDate.getMonth() + 1,
      day: jsDate.getDate(),
    };
  }

  return null;
};

/**
 * Creates a JavaScript Date from year/month/day and optional time.
 * @param {number} year
 * @param {number} month - 1–12
 * @param {number} day - 1–31
 * @param {number} [hour=0]
 * @param {number} [minute=0]
 * @returns {Date}
 */
const createJSDate = (year, month, day, hour = 0, minute = 0) => {
  return new Date(year, month - 1, day, hour, minute, 0, 0);
};

/**
 * Converts a date object (Gregorian or Jalaali) to a JS timestamp (ms).
 * @param {AnyDate} date
 * @returns {number | null} Milliseconds since UNIX epoch
 */
export const toTimestamp = (date) => {
  if (!date) return null;

  const g = normalizeToGregorian(date);
  if (!g) return null;

  const jsDate = createJSDate(g.year, g.month, g.day, date.hour ?? 0, date.minute ?? 0);
  return jsDate.getTime();
};

/**
 * Converts a date object to an ISO 8601 string.
 * @param {AnyDate} date
 * @returns {string | null}
 */
export const toISOString = (date) => {
  const timestamp = toTimestamp(date);
  return timestamp ? new Date(timestamp).toISOString() : null;
};

/**
 * Formats a date object into a custom string.
 *
 * Supported tokens:
 * - YYYY, YY
 * - MM, M
 * - DD, D
 * - HH, H
 * - mm, m
 *
 * @param {AnyDate} date
 * @param {string} [format="YYYY/MM/DD"]
 * @returns {string | null}
 */
export const toFormattedString = (date, format = 'YYYY/MM/DD') => {
  if (!date) return null;

  const year = date.jy ?? date.year;
  const month = date.jm ?? date.month;
  const day = date.jd ?? date.day;

  let output = format
    .replace('YYYY', String(year))
    .replace('YY', String(year).slice(-2))
    .replace('MM', String(month).padStart(2, '0'))
    .replace('M', String(month))
    .replace('DD', String(day).padStart(2, '0'))
    .replace('D', String(day));

  if (date.hour != null && date.minute != null) {
    output = output
      .replace('HH', String(date.hour).padStart(2, '0'))
      .replace('H', String(date.hour))
      .replace('mm', String(date.minute).padStart(2, '0'))
      .replace('m', String(date.minute));
  }

  return output;
};

/**
 * Converts to Unix timestamp (seconds).
 * @param {AnyDate} date
 * @returns {number | null}
 */
export const toUnixTimestamp = (date) => {
  const timestamp = toTimestamp(date);
  return timestamp ? Math.floor(timestamp / 1000) : null;
};

/**
 * Transforms a single date based on the output format.
 * @param {AnyDate} date
 * @param {string} format
 * @param {string} stringFormat
 * @returns {*}
 */
const transformSingleDate = (date, format, stringFormat) => {
  switch (format) {
    case OUTPUT_FORMATS.TIMESTAMP:
      return toTimestamp(date);
    case OUTPUT_FORMATS.UNIX:
      return toUnixTimestamp(date);
    case OUTPUT_FORMATS.ISO:
      return toISOString(date);
    case OUTPUT_FORMATS.STRING:
      return toFormattedString(date, stringFormat);
    case OUTPUT_FORMATS.OBJECT:
    default:
      return date;
  }
};

/**
 * Transforms a date, array of dates, or a range into a target output format.
 *
 * @param {AnyDate | AnyDate[] | DateRange} value - Input date value
 * @param {string | ((value:any)=>any)} [outputFormat="object"] - Output type or custom formatter
 * @param {string} [stringFormat="YYYY/MM/DD"] - Used only when format = "string"
 * @returns {*}
 */
export const transformOutput = (
  value,
  outputFormat = OUTPUT_FORMATS.OBJECT,
  stringFormat = 'YYYY/MM/DD',
) => {
  if (!value) return null;

  if (typeof outputFormat === 'function') {
    return outputFormat(value);
  }

  if (value.start && value.end) {
    return {
      start: transformSingleDate(value.start, outputFormat, stringFormat),
      end: transformSingleDate(value.end, outputFormat, stringFormat),
    };
  }

  if (Array.isArray(value)) {
    return value.map((d) => transformSingleDate(d, outputFormat, stringFormat));
  }

  return transformSingleDate(value, outputFormat, stringFormat);
};

/**
 * Output format types for transformation.
 * @readonly
 * @enum {string}
 */
export const OUTPUT_FORMATS = {
  OBJECT: 'object',
  TIMESTAMP: 'timestamp',
  UNIX: 'unix',
  ISO: 'iso',
  STRING: 'string',
};
