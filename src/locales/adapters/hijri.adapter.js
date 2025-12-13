import { toHijri, toGregorian } from 'hijri-converter';

export const HijriAdapter = {
  /**
   * Get today's date in Hijri calendar
   * @returns {{jy: number, jm: number, jd: number, year: number, month: number, day: number}} Hijri date object
   */
  getToday() {
    const now = new Date();
    const hijri = toHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
    return {
      jy: hijri.hy,
      jm: hijri.hm,
      jd: hijri.hd,
      year: hijri.hy,
      month: hijri.hm,
      day: hijri.hd,
    };
  },

  /**
   * Get the number of days in a Hijri month
   * @param {number} year - Hijri year
   * @param {number} month - Hijri month (1-12)
   * @returns {number} Number of days in the month
   */
  getDaysInMonth(year, month) {
    // Odd months (1, 3, 5, 7, 9, 11) have 30 days
    // Even months (2, 4, 6, 8, 10) have 29 days
    // Month 12 has 29 days in normal years and 30 days in leap years
    if (month % 2 === 1) return 30;
    if (month !== 12) return 29;
    return this.isLeapYear(year) ? 30 : 29;
  },

  /**
   * Convert Hijri date to JavaScript Date object
   * @param {number} year - Hijri year
   * @param {number} month - Hijri month (1-12)
   * @param {number} day - Hijri day
   * @returns {Date} JavaScript Date object
   */
  toDateObject(year, month, day) {
    const gregorian = toGregorian(year, month, day);
    return new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd);
  },

  /**
   * Add months to a date
   * @param {Date} date - JavaScript Date object
   * @param {number} months - Number of months to add (can be negative)
   * @returns {Date} New Date object with months added
   */
  addMonths(date, months) {
    const gregorian = { gy: date.getFullYear(), gm: date.getMonth() + 1, gd: date.getDate() };
    const hijri = toHijri(gregorian.gy, gregorian.gm, gregorian.gd);

    let newMonth = hijri.hm + months;
    let newYear = hijri.hy;

    while (newMonth > 12) {
      newMonth -= 12;
      newYear++;
    }

    while (newMonth < 1) {
      newMonth += 12;
      newYear--;
    }

    // Adjust day if it exceeds the days in the new month
    const maxDay = this.getDaysInMonth(newYear, newMonth);
    const newDay = Math.min(hijri.hd, maxDay);

    return this.toDateObject(newYear, newMonth, newDay);
  },

  /**
   * Add years to a date
   * @param {Date} date - JavaScript Date object
   * @param {number} years - Number of years to add (can be negative)
   * @returns {Date} New Date object with years added
   */
  addYears(date, years) {
    const gregorian = { gy: date.getFullYear(), gm: date.getMonth() + 1, gd: date.getDate() };
    const hijri = toHijri(gregorian.gy, gregorian.gm, gregorian.gd);

    const newYear = hijri.hy + years;

    // Adjust day if it exceeds the days in the month
    const maxDay = this.getDaysInMonth(newYear, hijri.hm);
    const newDay = Math.min(hijri.hd, maxDay);

    return this.toDateObject(newYear, hijri.hm, newDay);
  },

  /**
   * Parse a Hijri date string to Date object
   * @param {string} str - Date string in format YYYY-MM-DD or YYYY/MM/DD
   * @returns {Date|null} JavaScript Date object or null if invalid
   */
  parse(str) {
    if (!str || typeof str !== 'string') return null;

    const match = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (!match) return null;

    const [, y, m, d] = match.map(Number);
    return this.toDateObject(y, m, d);
  },

  /**
   * Format a Date object as Hijri date string
   * @param {Date} date - JavaScript Date object
   * @returns {string} Formatted Hijri date string (YYYY-MM-DD)
   */
  format(date) {
    const gregorian = { gy: date.getFullYear(), gm: date.getMonth() + 1, gd: date.getDate() };
    const hijri = toHijri(gregorian.gy, gregorian.gm, gregorian.gd);

    const y = hijri.hy;
    const m = String(hijri.hm).padStart(2, '0');
    const d = String(hijri.hd).padStart(2, '0');

    return `${y}-${m}-${d}`;
  },

  /**
   * Get weekday for a Hijri date (0 = Saturday, 6 = Friday)
   * @param {number} year - Hijri year
   * @param {number} month - Hijri month (1-12)
   * @param {number} day - Hijri day
   * @returns {number} Weekday (0-6, where 0 is Saturday)
   */
  getWeekday(year, month, day) {
    const date = this.toDateObject(year, month, day);
    const jsDay = date.getDay();
    // JavaScript: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Persian: 0 = Saturday, 1 = Sunday, ..., 6 = Friday
    return (jsDay + 1) % 7;
  },

  /**
   * Check if a Hijri year is a leap year
   * @param {number} year - Hijri year
   * @returns {boolean} True if leap year, false otherwise
   */
  isLeapYear(year) {
    // In Hijri calendar, leap years have 355 days (instead of 354)
    // The 12th month (Dhu al-Hijjah) has 30 days in a leap year instead of 29
    return (11 * year + 14) % 30 < 11;
  },
};
