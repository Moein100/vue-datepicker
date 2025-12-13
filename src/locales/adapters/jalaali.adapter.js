import {
  format as formatJalali,
  getDate,
  getMonth,
  getYear,
  getDaysInMonth,
  getDay,
  addMonths as addMonthsJalali,
  addYears as addYearsJalali,
  isLeapYear as isLeapYearJalali,
  setYear,
  setMonth,
  setDate,
} from 'date-fns-jalali';

export const JalaaliAdapter = {
  /**
   * Get today's date in Jalali calendar
   * @returns {{jy: number, jm: number, jd: number}} Jalali date object
   */
  getToday() {
    const now = new Date();
    return {
      jy: getYear(now),
      jm: getMonth(now) + 1, // date-fns months are 0-indexed
      jd: getDate(now),
    };
  },

  /**
   * Get the number of days in a Jalali month
   * @param {number} year - Jalali year
   * @param {number} month - Jalali month (1-12)
   * @returns {number} Number of days in the month
   */
  getDaysInMonth(year, month) {
    const date = this.toDateObject(year, month, 1);
    return getDaysInMonth(date);
  },

  /**
   * Convert Jalali date to JavaScript Date object
   * @param {number} year - Jalali year
   * @param {number} month - Jalali month (1-12)
   * @param {number} day - Jalali day
   * @returns {Date} JavaScript Date object
   */
  toDateObject(year, month, day) {
    let date = new Date();
    date = setYear(date, year);
    date = setMonth(date, month - 1);
    date = setDate(date, day);
    return date;
  },

  /**
   * Add months to a date
   * @param {Date} date - JavaScript Date object
   * @param {number} months - Number of months to add (can be negative)
   * @returns {Date} New Date object with months added
   */
  addMonths(date, months) {
    return addMonthsJalali(date, months);
  },

  /**
   * Add years to a date
   * @param {Date} date - JavaScript Date object
   * @param {number} years - Number of years to add (can be negative)
   * @returns {Date} New Date object with years added
   */
  addYears(date, years) {
    return addYearsJalali(date, years);
  },

  /**
   * Parse a Jalali date string to Date object
   * @param {string} str - Date string in format YYYY-MM-DD or YYYY/MM/DD
   * @returns {Date|null} JavaScript Date object or null if invalid
   */
  parse(str) {
    if (!str) return null;

    const match = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (!match) return null;

    const y = Number(match[1]);
    const m = Number(match[2]);
    const d = Number(match[3]);

    return this.toDateObject(y, m, d);
  },

  /**
   * Format a Date object as Jalali date string
   * @param {Date} date - JavaScript Date object
   * @returns {string} Formatted Jalali date string (YYYY-MM-DD)
   */
  format(date) {
    return formatJalali(date, 'yyyy-MM-dd');
  },

  /**
   * Get weekday for a Jalali date (0 = Saturday, 6 = Friday)
   * @param {number} jy - Jalali year
   * @param {number} jm - Jalali month (1-12)
   * @param {number} jd - Jalali day
   * @returns {number} Weekday (0-6, where 0 is Saturday)
   */
  getWeekday(jy, jm, jd) {
    const date = this.toDateObject(jy, jm, jd);
    const jsDay = getDay(date);
    // JavaScript: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Persian: 0 = Saturday, 1 = Sunday, ..., 6 = Friday
    return (jsDay + 1) % 7;
  },

  /**
   * Check if a Jalali year is a leap year
   * @param {number} jy - Jalali year
   * @returns {boolean} True if leap year, false otherwise
   */
  isLeapYear(jy) {
    const date = this.toDateObject(jy, 1, 1);
    return isLeapYearJalali(date);
  },
};
