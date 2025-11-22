import { computed, ref } from 'vue';
import { toPersianNumbers } from '@/utils/toPersianNumbers';
import {
  jalaaliToday,
  jalaaliMonthLength,
  getJalaaliMonthName,
  getJalaaliWeekdays,
  getJalaaliWeekday,
} from '@/utils/jalaali';

function parseJalaaliDate(date) {
  if (!date) return null;

  if (typeof date === 'string') {
    const parts = date.split('/').map(Number);
    if (parts.length === 3) {
      return { jy: parts[0], jm: parts[1], jd: parts[2] };
    }
    return null;
  }

  if (typeof date === 'object' && date.jy && date.jm && date.jd) {
    return { jy: date.jy, jm: date.jm, jd: date.jd };
  }

  return null;
}

function compareDates(a, b) {
  if (a.jy !== b.jy) return a.jy - b.jy;
  if (a.jm !== b.jm) return a.jm - b.jm;
  return a.jd - b.jd;
}

export function useDatePicker(options = {}) {
  const {
    locale = 'fa',
    initialValue = null,
    minDate = null,
    maxDate = null,
  } = options;

  const today = jalaaliToday();
  const parsedInitial = parseJalaaliDate(initialValue);
  const parsedMinDate = parseJalaaliDate(minDate);
  const parsedMaxDate = parseJalaaliDate(maxDate);


  const currentView = ref('days');
  const currentYear = ref(parsedInitial?.jy || today.jy);
  const currentMonth = ref(parsedInitial?.jm || today.jm);
  const selectedYear = ref(parsedInitial?.jy || null);
  const selectedMonth = ref(parsedInitial?.jm || null);
  const selectedDay = ref(parsedInitial?.jd || null);
  const confirmedDate = ref(parsedInitial ? { ...parsedInitial } : null);


  const WEEKDAYS = computed(() => getJalaaliWeekdays(locale));
  const MONTHS = computed(() => Array.from({ length: 12 }, (_, i) => i + 1));

  const selectedDate = computed(() => {
    if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) {
      return null;
    }
    return {
      jy: selectedYear.value,
      jm: selectedMonth.value,
      jd: selectedDay.value,
    };
  });

  const yearRange = computed(() => {
    const years = [];
    for (let i = currentYear.value - 5; i <= currentYear.value + 6; i++) {
      years.push(i);
    }
    return years;
  });


  function isDateDisabled(year, month, day) {
    const date = { jy: year, jm: month, jd: day };

    if (parsedMinDate && compareDates(date, parsedMinDate) < 0) {
      return true;
    }

    if (parsedMaxDate && compareDates(date, parsedMaxDate) > 0) {
      return true;
    }

    return false;
  }

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
          year: prevYear,
          month: prevMonth,
          label: toPersianNumbers(day),
          isDisabled: isDateDisabled(prevYear, prevMonth, day),
          isPrevMonth: true,
        });
      }
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = year === today.jy && month === today.jm && day === today.jd;
      const isSelected =
        year === selectedYear.value &&
        month === selectedMonth.value &&
        day === selectedDay.value;

      days.push({
        id: day,
        day,
        year,
        month,
        label: toPersianNumbers(day),
        isSelected,
        isToday,
        isDisabled: isDateDisabled(year, month, day),
      });
    }
    const totalCells = 35;
    const remainingCells = totalCells - days.length;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        id: `next-${day}`,
        day,
        year: nextYear,
        month: nextMonth,
        label: toPersianNumbers(day),
        isDisabled: isDateDisabled(nextYear, nextMonth, day),
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
    currentView.value = 'days';
  }

  function selectYear(year) {
    currentYear.value = year;
    currentView.value = 'days';
  }

  function selectDay(dayObj) {
    if (dayObj.isDisabled) return;

    if (dayObj.isPrevMonth || dayObj.isNextMonth) {
      currentYear.value = dayObj.year;
      currentMonth.value = dayObj.month;
    }

    selectedYear.value = dayObj.year;
    selectedMonth.value = dayObj.month;
    selectedDay.value = dayObj.day;
  }

  function confirmSelection() {
    if (selectedDate.value) {
      confirmedDate.value = { ...selectedDate.value };
      return confirmedDate.value;
    }
    return null;
  }

  function getMonthName(month) {
    return getJalaaliMonthName(month, locale);
  }

  function nextYearRange() {
    currentYear.value += 1;
  }

  function prevYearRange() {
    currentYear.value -= 1;
  }

  return {
    currentView,
    currentYear,
    currentMonth,
    selectedYear,
    selectedMonth,
    selectedDay,
    confirmedDate,
    WEEKDAYS,
    MONTHS,
    yearRange,
    calendarDays,
    selectedDate,
    toggleView,
    selectMonth,
    selectYear,
    selectDay,
    confirmSelection,
    getMonthName,
    nextYearRange,
    prevYearRange,
    toPersianNumbers,
  };
}
