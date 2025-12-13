import {
  format,
  getDate,
  getMonth,
  getYear,
  getDaysInMonth,
  getDay,
  addMonths,
  addYears,
  isLeapYear,
  setYear,
  setMonth as setMonthFns,
  setDate as setDateFns,
  parse,
  isValid,
} from 'date-fns';

export const GregorianAdapter = {
  /**
   * Get today's date in Gregorian calendar
   * @returns {{jy: number, jm: number, jd: number, year: number, month: number, day: number}} Date object
   */
  getToday() {
    const now = new Date();
    return {
      jy: getYear(now),
      jm: getMonth(now) + 1, // date-fns months are 0-indexed
      jd: getDate(now),
      year: getYear(now),
      month: getMonth(now) + 1,
      day: getDate(now),
    };
  },

  /**
   * Get the number of days in a Gregorian month
   * @param {number} year - Gregorian year
   * @param {number} month - Gregorian month (1-12)
   * @returns {number} Number of days in the month
   */
  getDaysInMonth(year, month) {
    const date = this.toDateObject(year, month, 1);
    return getDaysInMonth(date);
  },

  /**
   * Convert Gregorian date to JavaScript Date object
   * @param {number} year - Gregorian year
   * @param {number} month - Gregorian month (1-12)
   * @param {number} day - Gregorian day
   * @returns {Date} JavaScript Date object
   */
  toDateObject(year, month, day) {
    let date = new Date();
    date = setYear(date, year);
    date = setMonthFns(date, month - 1); // date-fns months are 0-indexed
    date = setDateFns(date, day);
    return date;
  },

  /**
   * Add months to a date
   * @param {Date} date - JavaScript Date object
   * @param {number} months - Number of months to add (can be negative)
   * @returns {Date} New Date object with months added
   */
  addMonths(date, months) {
    return addMonths(date, months);
  },

  /**
   * Add years to a date
   * @param {Date} date - JavaScript Date object
   * @param {number} years - Number of years to add (can be negative)
   * @returns {Date} New Date object with years added
   */
  addYears(date, years) {
    return addYears(date, years);
  },

  /**
   * Parse a Gregorian date string to Date object
   * @param {string} str - Date string in various formats
   * @returns {Date|null} JavaScript Date object or null if invalid
   */
  parse(str) {
    if (!str || typeof str !== 'string') return null;

    const match = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (match) {
      const [, y, m, d] = match.map(Number);
      return this.toDateObject(y, m, d);
    }

    const parsed = parse(str, 'yyyy-MM-dd', new Date());
    return isValid(parsed) ? parsed : null;
  },

  /**
   * Format a Date object as Gregorian date string
   * @param {Date} date - JavaScript Date object
   * @returns {string} Formatted date string (YYYY-MM-DD)
   */
  format(date) {
    return format(date, 'yyyy-MM-dd');
  },

  /**
   * Get weekday for a Gregorian date (0 = Saturday, 6 = Friday)
   * @param {number} year - Gregorian year
   * @param {number} month - Gregorian month (1-12)
   * @param {number} day - Gregorian day
   * @returns {number} Weekday (0-6, where 0 is Saturday)
   */
  getWeekday(year, month, day) {
    const date = this.toDateObject(year, month, day);
    const jsDay = getDay(date);
    // JavaScript: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Persian: 0 = Saturday, 1 = Sunday, ..., 6 = Friday
    return (jsDay + 1) % 7;
  },

  /**
   * Check if a Gregorian year is a leap year
   * @param {number} year - Gregorian year
   * @returns {boolean} True if leap year, false otherwise
   */
  isLeapYear(year) {
    const date = this.toDateObject(year, 1, 1);
    return isLeapYear(date);
  },

  /**
   * Convert a Date object to Gregorian date components
   * @param {Date} date - JavaScript Date object
   * @returns {{year: number, month: number, day: number}} Gregorian date components
   */
  fromDateObject(date) {
    return {
      year: getYear(date),
      month: getMonth(date) + 1,
      day: getDate(date),
    };
  },
};
