import { Lunar, Solar } from 'lunar-javascript';

export const ChineseAdapter = {
  /**
   * Get today's date in Chinese lunar calendar
   * @returns {{year: number, month: number, day: number, isLeap: boolean}} Chinese lunar date object
   */
  getToday() {
    const lunar = Lunar.fromDate(new Date());
    return {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      isLeap: lunar.getMonth() < 0,
    };
  },

  /**
   * Get the number of days in a Chinese lunar month
   * @param {number} year - Chinese lunar year
   * @param {number} month - Chinese lunar month (1-12, or negative for leap month)
   * @returns {number} Number of days in the month
   */
  getDaysInMonth(year, month) {
    const solar = Solar.fromYmd(year, 1, 1);
    const lunar = Lunar.fromSolar(solar);

    const lunarYear = lunar.getYear();
    try {
      const firstDay = Lunar.fromYmd(year, month, 1);
      const lastDay = Lunar.fromYmd(year, month, 30);

      if (lastDay && lastDay.getMonth() === Math.abs(month)) {
        return 30;
      }
      return 29;
    } catch (e) {
      return 29;
    }
  },

  /**s
   * Convert Chinese lunar date to JavaScript Date object
   * @param {number} year - Chinese lunar year
   * @param {number} month - Chinese lunar month (1-12)
   * @param {number} day - Chinese lunar day
   * @returns {Date} JavaScript Date object
   */
  toDateObject(year, month, day) {
    try {
      const lunar = Lunar.fromYmd(year, month, day);
      const solar = lunar.getSolar();
      return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
    } catch (e) {
      // Fallback: return current date if conversion fails
      console.warn('Chinese date conversion failed:', { year, month, day }, e);
      return new Date();
    }
  },

  /**
   * Add months to a date
   * @param {Date} date - JavaScript Date object
   * @param {number} months - Number of months to add (can be negative)
   * @returns {Date} New Date object with months added
   */
  addMonths(date, months) {
    const lunar = Lunar.fromDate(date);

    // Calculate new month index
    let totalMonths = (lunar.getYear() - 1) * 12 + Math.abs(lunar.getMonth()) + months;
    const newYear = Math.floor(totalMonths / 12) + 1;
    const newMonth = totalMonths % 12 || 12;
    const newDay = Math.min(lunar.getDay(), this.getDaysInMonth(newYear, newMonth));

    return this.toDateObject(newYear, newMonth, newDay);
  },

  /**
   * Add years to a date
   * @param {Date} date - JavaScript Date object
   * @param {number} years - Number of years to add (can be negative)
   * @returns {Date} New Date object with years added
   */
  addYears(date, years) {
    const lunar = Lunar.fromDate(date);
    const newYear = lunar.getYear() + years;
    const month = Math.abs(lunar.getMonth());
    const day = Math.min(lunar.getDay(), this.getDaysInMonth(newYear, month));

    return this.toDateObject(newYear, month, day);
  },

  /**
   * Parse a Chinese lunar date string to Date object
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
   * Format a Date object as Chinese lunar date string
   * @param {Date} date - JavaScript Date object
   * @returns {string} Formatted Chinese lunar date string (YYYY-MM-DD)
   */
  format(date) {
    const lunar = Lunar.fromDate(date);
    const year = lunar.getYear();
    const month = Math.abs(lunar.getMonth());
    const day = lunar.getDay();
    const formatted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Indicate if it's a leap month
    return lunar.getMonth() < 0 ? `${formatted} (leap)` : formatted;
  },

  /**
   * Get weekday for a Chinese lunar date (0 = Saturday, 6 = Friday)
   * @param {number} year - Chinese lunar year
   * @param {number} month - Chinese lunar month (1-12)
   * @param {number} day - Chinese lunar day
   * @returns {number} Weekday (0-6, where 0 is Saturday)
   */
  getWeekday(year, month, day) {
    const date = this.toDateObject(year, month, day);
    // JavaScript: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Persian: 0 = Saturday, 1 = Sunday, ..., 6 = Friday
    return (date.getDay() + 1) % 7;
  },

  /**
   * Check if a Chinese lunar year is a leap year
   * @param {number} year - Chinese lunar year
   * @returns {boolean} True if leap year (has 13 months), false otherwise
   */
  isLeapYear(year) {
    try {
      const lunar = Lunar.fromYmd(year, 1, 1);
      const lunarYear = lunar.getYear();

      // A leap year in Chinese calendar has 13 months
      // We can check this by trying to access the 13th month
      try {
        Lunar.fromYmd(year, 13, 1);
        return true;
      } catch (e) {
        return false;
      }
    } catch (e) {
      return false;
    }
  },

  /**
   * Convert a Date object to Chinese lunar date components
   * @param {Date} date - JavaScript Date object
   * @returns {{year: number, month: number, day: number, isLeap: boolean}} Chinese lunar date components
   */
  fromDateObject(date) {
    const lunar = Lunar.fromDate(date);
    return {
      year: lunar.getYear(),
      month: Math.abs(lunar.getMonth()),
      day: lunar.getDay(),
      isLeap: lunar.getMonth() < 0,
    };
  },
};
