import { ref, computed } from 'vue';
import { jalaaliToday, jalaaliMonthLength } from '../../utils/datepicker/jalaali.js';
import { parseJalaaliDate } from '../../utils/datepicker/dateParser.js';
import { VIEW_MODES, CALENDAR_CONFIG } from '../../constants/datepicker.js';

export function useNavigation(initialDate = null) {
  const parsed = parseJalaaliDate(initialDate);
  const today = jalaaliToday();

  const currentYear = ref(parsed?.jy || today.jy);
  const currentMonth = ref(parsed?.jm || today.jm);
  const currentView = ref(VIEW_MODES.DAYS);

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
    return jalaaliMonthLength(currentYear.value, currentMonth.value);
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
    if (date?.jy && date?.jm) {
      currentYear.value = date.jy;
      currentMonth.value = date.jm;
      currentView.value = VIEW_MODES.DAYS;
    }
  }

  function goToToday() {
    goToDate(today);
  }

  function reset() {
    const initial = parseJalaaliDate(initialDate) || today;
    currentYear.value = initial.jy;
    currentMonth.value = initial.jm;
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
