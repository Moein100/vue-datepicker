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
    mode = 'single',
    initialValue = null,
    minDate = null,
    maxDate = null,
    enableTime = false,
    timeFormat = 24,
  } = options;

  const today = jalaaliToday();
  const parsedMinDate = parseJalaaliDate(minDate);
  const parsedMaxDate = parseJalaaliDate(maxDate);

  let parsedInitial = null;
  let parsedRangeStart = null;
  let parsedRangeEnd = null;
  let parsedMultipleDates = [];

  const selectedHour = ref(null);
  const selectedMinute = ref(null);
  const selectedPeriod = ref('AM');

  if (mode === 'range' && initialValue && typeof initialValue === 'object') {
    parsedRangeStart = parseJalaaliDate(initialValue.start);
    parsedRangeEnd = parseJalaaliDate(initialValue.end);
    parsedInitial = parsedRangeStart;
  } else if (mode === 'multiple' && Array.isArray(initialValue)) {
    parsedMultipleDates = initialValue.map(parseJalaaliDate).filter(Boolean);
    parsedInitial = parsedMultipleDates[0];
  } else {
    parsedInitial = parseJalaaliDate(initialValue);
  }

  if (parsedInitial && enableTime) {
    if (parsedInitial.hour !== undefined) {
      selectedHour.value = parsedInitial.hour;
    }
    if (parsedInitial.minute !== undefined) {
      selectedMinute.value = parsedInitial.minute;
    }

    if (timeFormat === '12' && parsedInitial.hour !== undefined) {
      selectedPeriod.value = parsedInitial.hour >= 12 ? 'PM' : 'AM';
    }
  }

  const currentView = ref('days');
  const currentYear = ref(parsedInitial?.jy || today.jy);
  const currentMonth = ref(parsedInitial?.jm || today.jm);
  const selectedYear = ref(parsedInitial?.jy || null);
  const selectedMonth = ref(parsedInitial?.jm || null);
  const selectedDay = ref(parsedInitial?.jd || null);
  const confirmedDate = ref(parsedInitial ? { ...parsedInitial } : null);

  const rangeStart = ref(parsedRangeStart);
  const rangeEnd = ref(parsedRangeEnd);

  const multipleDates = ref(parsedMultipleDates);

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

  const hours = computed(() => {
    if (timeFormat === '12') {
      return Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
    }
    return Array.from({ length: 24 }, (_, i) => i);
  });

  const minutes = computed(() => {
    return Array.from({ length: 60 }, (_, i) => i);
  });

  function selectHour(hour) {
    let actualHour = hour;

    if (timeFormat === '12') {
      if (hour === 12) {
        actualHour = selectedPeriod.value === 'AM' ? 0 : 12;
      } else {
        actualHour = selectedPeriod.value === 'AM' ? hour : hour + 12;
      }
    }

    selectedHour.value = actualHour;
  }

  function selectMinute(minute) {
    selectedMinute.value = minute;
  }

  function togglePeriod() {
    if (timeFormat === '12') {
      selectedPeriod.value = selectedPeriod.value === 'AM' ? 'PM' : 'AM';

      if (selectedHour.value !== null) {
        if (selectedPeriod.value === 'PM' && selectedHour.value < 12) {
          selectedHour.value += 12;
        } else if (selectedPeriod.value === 'AM' && selectedHour.value >= 12) {
          selectedHour.value -= 12;
        }
      }
    }
  }

  const displayHour = computed(() => {
    if (selectedHour.value === null) return null;

    if (timeFormat === '12') {
      const hour12 = selectedHour.value % 12;
      return hour12 === 0 ? 12 : hour12;
    }

    return selectedHour.value;
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

  function isDateInRange(date) {
    if (!rangeStart.value || !rangeEnd.value) return false;
    return compareDates(date, rangeStart.value) > 0 && compareDates(date, rangeEnd.value) < 0;
  }

  function isRangeStartDate(date) {
    if (!rangeStart.value) return false;
    return compareDates(date, rangeStart.value) === 0;
  }

  function isRangeEndDate(date) {
    if (!rangeEnd.value) return false;
    return compareDates(date, rangeEnd.value) === 0;
  }

  function isDateInMultipleSelection(date) {
    return multipleDates.value.some((d) => compareDates(d, date) === 0);
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
        const dateObj = { jy: prevYear, jm: prevMonth, jd: day };
        days.push({
          id: `prev-${day}`,
          day,
          year: prevYear,
          month: prevMonth,
          label: toPersianNumbers(day),
          isDisabled: isDateDisabled(prevYear, prevMonth, day),
          isPrevMonth: true,
          isInRange: isDateInRange(dateObj),
          isRangeStart: isRangeStartDate(dateObj),
          isRangeEnd: isRangeEndDate(dateObj),
        });
      }
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = year === today.jy && month === today.jm && day === today.jd;
      const dateObj = { jy: year, jm: month, jd: day };

      let isSelected = false;
      if (mode === 'multiple') {
        isSelected = isDateInMultipleSelection(dateObj);
      } else {
        isSelected =
          year === selectedYear.value && month === selectedMonth.value && day === selectedDay.value;
      }

      days.push({
        id: day,
        day,
        year,
        month,
        label: toPersianNumbers(day),
        isSelected,
        isToday,
        isDisabled: isDateDisabled(year, month, day),
        isInRange: isDateInRange(dateObj),
        isRangeStart: isRangeStartDate(dateObj),
        isRangeEnd: isRangeEndDate(dateObj),
      });
    }
    const totalCells = 35;
    const remainingCells = totalCells - days.length;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    for (let day = 1; day <= remainingCells; day++) {
      const dateObj = { jy: nextYear, jm: nextMonth, jd: day };
      days.push({
        id: `next-${day}`,
        day,
        year: nextYear,
        month: nextMonth,
        label: toPersianNumbers(day),
        isDisabled: isDateDisabled(nextYear, nextMonth, day),
        isNextMonth: true,
        isInRange: isDateInRange(dateObj),
        isRangeStart: isRangeStartDate(dateObj),
        isRangeEnd: isRangeEndDate(dateObj),
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

    const clickedDate = { jy: dayObj.year, jm: dayObj.month, jd: dayObj.day };

    if (mode === 'range') {
      if (!rangeStart.value || (rangeStart.value && rangeEnd.value)) {
        rangeStart.value = clickedDate;
        rangeEnd.value = null;
      } else {
        if (compareDates(clickedDate, rangeStart.value) < 0) {
          rangeEnd.value = rangeStart.value;
          rangeStart.value = clickedDate;
        } else {
          rangeEnd.value = clickedDate;
        }
      }
    } else if (mode === 'multiple') {
      const existingIndex = multipleDates.value.findIndex(
        (d) => compareDates(d, clickedDate) === 0,
      );
      if (existingIndex !== -1) {
        multipleDates.value.splice(existingIndex, 1);
      } else {
        multipleDates.value.push(clickedDate);
      }
    } else {
      selectedYear.value = dayObj.year;
      selectedMonth.value = dayObj.month;
      selectedDay.value = dayObj.day;
    }
  }

  function confirmSelection() {
    const addTimeToDate = (date) => {
      if (!enableTime || !date) return date;

      return {
        ...date,
        hour: selectedHour.value ?? 0,
        minute: selectedMinute.value ?? 0,
      };
    };

    if (mode === 'range') {
      if (rangeStart.value && rangeEnd.value) {
        return {
          start: addTimeToDate(rangeStart.value),
          end: addTimeToDate(rangeEnd.value),
        };
      }
      return null;
    } else if (mode === 'multiple') {
      if (multipleDates.value.length > 0) {
        const sortedDates = [...multipleDates.value].sort(compareDates);
        return sortedDates.map(addTimeToDate);
      }
      return [];
    } else {
      if (selectedDate.value) {
        confirmedDate.value = addTimeToDate({ ...selectedDate.value });
        return confirmedDate.value;
      }
      return null;
    }
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
    rangeStart,
    rangeEnd,
    multipleDates,
    WEEKDAYS,
    MONTHS,
    yearRange,
    calendarDays,
    selectedDate,
    enableTime,
    selectedHour,
    selectedMinute,
    selectedPeriod,
    displayHour,
    hours,
    minutes,
    timeFormat,
    toggleView,
    selectMonth,
    selectYear,
    selectDay,
    selectHour,
    selectMinute,
    togglePeriod,
    confirmSelection,
    getMonthName,
    nextYearRange,
    prevYearRange,
    toPersianNumbers,
  };
}
