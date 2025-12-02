import { localeManager } from '@/locales/localeManager';
import { defineStore } from 'pinia';

const LOCALE_STORAGE_KEY = 'datepicker_locale';

function loadLocaleFromStorage() {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function saveLocaleToStorage(locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.log(error);
  }
}

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    currentLocale: loadLocaleFromStorage() || 'jalali',
  }),
  getters: {
    locale: (state) => localeManager.get(state.currentLocale),
    availableLocales: () => localeManager.getAll(),
    direction: (state) => localeManager.getDirection(state.currentLocale),
    numberSystem: (state) => localeManager.getNumberSystem(state.currentLocale),
    calendarType: (state) => localeManager.getCalendarType(state.currentLocale),
  },
  actions: {
    setLocale(localeCode) {
      if (localeManager.has(localeCode)) {
        this.currentLocale = localeCode;
        saveLocaleToStorage(localeCode);
      }
    },

    getMonthName(month) {
      return localeManager.getMonthName(month, this.currentLocale);
    },

    getWeekdayName(weekdays) {
      return localeManager.getWeekdayName(weekdays, this.currentLocale);
    },

    getText(key) {
      return localeManager.getText(key, this.currentLocale);
    },
  },
});
