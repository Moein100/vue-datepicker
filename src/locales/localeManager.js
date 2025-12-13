import { LOCALE_DEFINITIONS } from './localesDefinitions';
import { faIR } from 'date-fns-jalali/locale';
import { enUS, ar, zhCN } from 'date-fns/locale';
import { format as formatJalali } from 'date-fns-jalali';
import { format as formatGregorian } from 'date-fns';

const DATE_FNS_LOCALES = {
  jalali: faIR,
  gregorian: enUS,
  hijri: ar,
  chinese: zhCN,
};

export function createLocaleManager(initialLocales = {}) {
  const locales = new Map(Object.entries(initialLocales));

  Object.entries(LOCALE_DEFINITIONS).forEach(([code, config]) => {
    locales.set(code, Object.freeze({ ...config }));
  });

  let defaultLocaleCode = 'jalali';

  function validateConfig(config) {
    const requiredFields = ['months', 'weekdays', 'direction'];
    const missing = requiredFields.filter((field) => !config[field]);

    if (missing.length > 0) {
      throw new Error(`Locale config missing required fields: ${missing.join(', ')}`);
    }

    if (config.months.length !== 12) {
      throw new Error('months array must have exactly 12 items');
    }

    if (config.weekdays.length !== 7) {
      throw new Error('weekdays array must have exactly 7 items');
    }

    if (!['rtl', 'ltr'].includes(config.direction)) {
      throw new Error('direction must be "rtl" or "ltr"');
    }

    if (
      config.numberSystem &&
      !['persian', 'arabic', 'latin', 'chinese'].includes(config.numberSystem)
    ) {
      throw new Error('numberSystem must be one of: persian, arabic, latin, chinese');
    }

    if (
      config.calendarType &&
      !['jalali', 'gregorian', 'hijri', 'chinese'].includes(config.calendarType)
    ) {
      throw new Error('calendarType must be one of: jalali, gregorian, hijri, chinese');
    }
  }

  return {
    get(code) {
      const locale = locales.get(code) || locales.get(defaultLocaleCode);
      return locale ? { ...locale } : null;
    },

    has(code) {
      return locales.has(code);
    },

    register(code, config) {
      validateConfig(config);
      locales.set(code, Object.freeze({ ...config }));
    },

    setDefault(code) {
      if (!locales.has(code)) {
        throw new Error(`Locale "${code}" is not registered`);
      }
      defaultLocaleCode = code;
    },

    getDefaultCode() {
      return defaultLocaleCode;
    },

    list() {
      return Array.from(locales.keys());
    },

    getAll() {
      return Array.from(locales.entries()).map(([code, config]) => ({
        code,
        name: config.name || code,
        direction: config.direction,
        numberSystem: config.numberSystem || 'latin',
        calendarType: config.calendarType || 'jalali',
      }));
    },

    /**
     * Get month name using date-fns package
     * @param {number} month - Month number (1-12)
     * @param {string} code - Locale code
     * @returns {string} Month name from date-fns
     */
    getMonthName(month, code) {
      const localeCode = code || defaultLocaleCode;
      const dateFnsLocale = DATE_FNS_LOCALES[localeCode];

      if (dateFnsLocale?.localize?.month) {
        try {
          return dateFnsLocale.localize.month(month - 1, { width: 'wide' });
        } catch (e) {
          const locale = this.get(localeCode);
          return locale?.months?.[month - 1] || '';
        }
      }

      const locale = this.get(localeCode);
      return locale?.months?.[month - 1] || '';
    },

    /**
     * Get weekday name using date-fns package
     * @param {number} weekday - Weekday number (0-6, where 0 is Saturday)
     * @param {string} code - Locale code
     * @returns {string} Weekday name from date-fns
     */
    getWeekdayName(weekday, code) {
      const localeCode = code || defaultLocaleCode;

      // For our calendar system, 0 = Saturday, so we need to adjust
      // date-fns uses 0 = Sunday, so Saturday is 6
      const dateFnsLocale = DATE_FNS_LOCALES[localeCode];

      if (dateFnsLocale?.localize?.day) {
        try {
          const dateFnsWeekday = weekday === 0 ? 6 : weekday - 1;
          return dateFnsLocale.localize.day(dateFnsWeekday, { width: 'short' });
        } catch (e) {
          const locale = this.get(localeCode);
          return locale?.weekdays?.[weekday] || locale?.weekDays?.[weekday] || '';
        }
      }

      const locale = this.get(localeCode);
      return locale?.weekdays?.[weekday] || locale?.weekDays?.[weekday] || '';
    },

    /**
     * Get full weekday name using date-fns package
     * @param {number} weekday - Weekday number (0-6, where 0 is Saturday)
     * @param {string} code - Locale code
     * @returns {string} Full weekday name from date-fns
     */
    getWeekdayFullName(weekday, code) {
      const localeCode = code || defaultLocaleCode;
      const dateFnsLocale = DATE_FNS_LOCALES[localeCode];

      if (dateFnsLocale?.localize?.day) {
        try {
          const dateFnsWeekday = weekday === 0 ? 6 : weekday - 1;
          return dateFnsLocale.localize.day(dateFnsWeekday, { width: 'wide' });
        } catch (e) {
          const locale = this.get(localeCode);
          return (
            locale?.weekdaysFull?.[weekday] ||
            locale?.weekdays?.[weekday] ||
            locale?.weekDays?.[weekday] ||
            ''
          );
        }
      }

      const locale = this.get(localeCode);
      return (
        locale?.weekdaysFull?.[weekday] ||
        locale?.weekdays?.[weekday] ||
        locale?.weekDays?.[weekday] ||
        ''
      );
    },

    getText(key, code) {
      const locale = this.get(code || defaultLocaleCode);
      if (locale?.ui && key in locale.ui) return locale.ui[key];
      return locale?.[key] || '';
    },

    getDirection(code) {
      const locale = this.get(code || defaultLocaleCode);
      return locale?.direction || 'ltr';
    },

    getNumberSystem(code) {
      const locale = this.get(code || defaultLocaleCode);
      return locale?.numberSystem || 'latin';
    },

    getCalendarType(code) {
      const locale = this.get(code || defaultLocaleCode);
      return locale?.calendarType || 'jalali';
    },

    /**
     * Get the date-fns locale object for formatting
     * @param {string} code - Locale code
     * @returns {Locale} date-fns locale object
     */
    getDateFnsLocale(code) {
      const localeCode = code || defaultLocaleCode;
      return DATE_FNS_LOCALES[localeCode] || DATE_FNS_LOCALES.jalali;
    },

    /**
     * Format a date using date-fns with the appropriate locale
     * @param {Date} date - Date to format
     * @param {string} formatStr - Format string
     * @param {string} code - Locale code
     * @returns {string} Formatted date string
     */
    formatDate(date, formatStr, code) {
      const localeCode = code || defaultLocaleCode;
      const dateFnsLocale = this.getDateFnsLocale(localeCode);

      try {
        if (localeCode === 'jalali') {
          return formatJalali(date, formatStr, { locale: dateFnsLocale });
        } else {
          return formatGregorian(date, formatStr, { locale: dateFnsLocale });
        }
      } catch (e) {
        return '';
      }
    },
  };
}

export const localeManager = createLocaleManager();
localeManager.setDefault('jalali');
