import { computed, ref } from 'vue';
import { toPersianNumbers } from '@/utils/toPersianNumbers';
import {
  jalaaliToday,
  jalaaliMonthLength,
  getJalaaliMonthName,
  getJalaaliWeekdays,
  getJalaaliWeekday,
} from '@/utils/jalaali';

export function useDatePicker(options = {}) {
  const { locale = 'fa' } = options;

  const today = jalaaliToday();
  const currentView = ref('days');
  const currentYear = ref(today.jy);
  const currentMonth = ref(today.jm);
  const selectedYear = ref(today.jy);
  const selectedMonth = ref(today.jm);
  const selectedDay = ref(null);

  const WEEKDAYS = computed(() => getJalaaliWeekdays(locale));
  const MONTHS = computed(() => Array.from({ length: 12 }, (_, i) => i + 1));

  const yearRange = computed(() => {
    const years = [];
    for (let i = currentYear.value - 5; i <= currentYear.value + 6; i++) {
      years.push(i);
    }
    return years;
  });

  const calendarDays = computed(() => {
    const year = currentYear.value;
    const month = currentMonth.value;
    const daysInMonth = jalaaliMonthLength(year, month);
    const firstDayWeekday = getJalaaliWeekday(year, month, 1);

    const days = [];

    if (firstDayWeekday > 0) {
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const prevMonthDays = jalaaliMonthLength(prevYear, prevMonth);

      for (let i = firstDayWeekday - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        days.push({
          id: `prev-${day}`,
          day,
          label: toPersianNumbers(day),
          isDisabled: false,
          isPrevMonth: true,
        });
      }
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = year === today.jy && month === today.jm && day === today.jd;
      const isSelected =
        year === selectedYear.value && month === selectedMonth.value && day === selectedDay.value;

      days.push({
        id: day,
        day,
        label: toPersianNumbers(day),
        isSelected,
        isToday,
        isDisabled: false,
      });
    }

    const totalCells = 35;
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        id: `next-${day}`,
        day,
        label: toPersianNumbers(day),
        isDisabled: false,
        isNextMonth: true,
      });
    }

    return days;
  });

  function toggleView(view) {
    currentView.value = currentView.value === view ? 'days' : view;
  }

  function selectMonth(month) {
    currentMonth.value = month;
    selectedMonth.value = month;
    currentView.value = 'days';
  }

  function selectYear(year) {
    currentYear.value = year;
    selectedYear.value = year;
    currentView.value = 'days';
  }

  function selectDay(day) {
    if (day.isEmpty || day.isDisabled) return;
    selectedDay.value = day.day;
    selectedYear.value = currentYear.value;
    selectedMonth.value = currentMonth.value;
  }

  function getMonthName(month) {
    return getJalaaliMonthName(month, locale);
  }

  return {
    currentView,
    currentYear,
    currentMonth,
    selectedYear,
    selectedMonth,
    selectedDay,

    WEEKDAYS,
    MONTHS,
    yearRange,
    calendarDays,

    toggleView,
    selectMonth,
    selectYear,
    selectDay,
    getMonthName,
    toPersianNumbers,
  };
}
