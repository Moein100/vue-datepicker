import { ref, computed } from 'vue';
import { localeManager } from '@/locales/localeManager.js';
import { toLocalizedNumbers } from '@/locales/numberFormatter.js';

export function useDatePickerLocale(initialLocale = 'jalali  ') {
  const currentLocale = ref(initialLocale);

  const localeConfig = computed(() => localeManager.get(currentLocale.value) || {});

  const direction = computed(() => localeConfig.value?.direction || 'rtl');
  const numberSystem = computed(() => localeConfig.value?.numberSystem || 'persian');
  const calendarType = computed(() => localeConfig.value?.calendarType || 'jalali');
  const availableLocales = computed(() => localeManager.getAll());

  function setLocale(code) {
    if (localeManager.has(code)) {
      currentLocale.value = code;
    } else {
      console.warn(`Locale "${code}" is not registered`);
    }
  }

  const getMonthName = (month) => localeManager.getMonthName(month, currentLocale.value);
  const getWeekdayName = (weekday) => localeManager.getWeekdayName(weekday, currentLocale.value);
  const getWeekdayFullName = (weekday) =>
    localeManager.getWeekdayFullName(weekday, currentLocale.value);
  const getText = (key) => localeManager.getText(key, currentLocale.value);
  const formatNumber = (value) => toLocalizedNumbers(value, numberSystem.value);

  return {
    currentLocale,
    localeConfig,
    availableLocales,
    direction,
    numberSystem,
    calendarType,
    setLocale,
    getMonthName,
    getWeekdayName,
    getWeekdayFullName,
    getText,
    formatNumber,
  };
}
