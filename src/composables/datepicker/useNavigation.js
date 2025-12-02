import { ref, computed, watch } from 'vue';
import { parseJalaaliDate } from '../../utils/datepicker/dateParser.js';
import { VIEW_MODES, CALENDAR_CONFIG } from '../../constants/datepicker.js';
import { useI18nStore } from '@/store/i18n.js';
import { getCalendarAdapter } from '@/locales/adapters/createCalendarAdapterManager.js';


export function useNavigation(initialDate = null) {
  const i18nStore = useI18nStore();

  const adapter = computed(() => getCalendarAdapter(i18nStore.calendarType));

  const parsed = parseJalaaliDate(initialDate);
  const today = adapter.value.getToday();

  const currentYear = ref(parsed?.jy || parsed?.year || today.jy || today.year);
  const currentMonth = ref(parsed?.jm || parsed?.month || today.jm || today.month);
  const currentView = ref(VIEW_MODES.DAYS);

  watch(
    () => i18nStore.calendarType,
    () => {
      const newToday = adapter.value.getToday();
      currentYear.value = newToday.jy || newToday.year;
      currentMonth.value = newToday.jm || newToday.month;
    },
  );

  const yearRange = computed(() => {
    const years = [];
    const offset = CALENDAR_CONFIG.YEAR_RANGE_OFFSET;
    const count = CALENDAR_CONFIG.YEARS_TO_SHOW;

    for (let i = 0; i < count; i++) {
      years.push(currentYear.value - offset + i);
    }

    return years;
  });

  const daysInCurrentMonth = computed(() => {
    return adapter.value.getDaysInMonth(currentYear.value, currentMonth.value);
  });

  function nextMonth() {
    if (currentMonth.value === 12) {
      currentMonth.value = 1;
      currentYear.value++;
    } else {
      currentMonth.value++;
    }
  }

  function prevMonth() {
    if (currentMonth.value === 1) {
      currentMonth.value = 12;
      currentYear.value--;
    } else {
      currentMonth.value--;
    }
  }

  function nextYear() {
    currentYear.value++;
  }

  function prevYear() {
    currentYear.value--;
  }

  function setMonth(month) {
    if (month >= 1 && month <= 12) {
      currentMonth.value = month;
      currentView.value = VIEW_MODES.DAYS;
    }
  }

  function setYear(year) {
    currentYear.value = year;
    currentView.value = VIEW_MODES.DAYS;
  }

  function setView(view) {
    if (Object.values(VIEW_MODES).includes(view)) {
      currentView.value = view;
    }
  }

  function toggleView(view) {
    currentView.value = currentView.value === view ? VIEW_MODES.DAYS : view;
  }

  function goToDate(date) {
    if ((date?.jy && date?.jm) || (date?.year && date?.month)) {
      currentYear.value = date.jy || date.year;
      currentMonth.value = date.jm || date.month;
      currentView.value = VIEW_MODES.DAYS;
    }
  }

  function goToToday() {
    const newToday = adapter.value.getToday();
    goToDate(newToday);
  }

  function reset() {
    const initial = parseJalaaliDate(initialDate) || adapter.value.getToday();
    currentYear.value = initial.jy || initial.year;
    currentMonth.value = initial.jm || initial.month;
    currentView.value = VIEW_MODES.DAYS;
  }

  return {
    currentYear,
    currentMonth,
    currentView,

    yearRange,
    daysInCurrentMonth,

    nextMonth,
    prevMonth,
    nextYear,
    prevYear,
    setMonth,
    setYear,
    setView,
    toggleView,
    goToDate,
    goToToday,
    reset,
  };
}
