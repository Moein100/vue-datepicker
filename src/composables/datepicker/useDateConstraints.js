import { computed } from 'vue';
import { compareDates, isBetween, parseJalaaliDate } from '@/utils/datepicker';

export function useDateConstraints({ minDate = null, maxDate = null } = {}) {
  const min = parseJalaaliDate(minDate);
  const max = parseJalaaliDate(maxDate);

  const hasConstraints = computed(() => min !== null || max !== null);

  function isBeforeMin(date) {
    return min && compareDates(date, min) < 0;
  }

  function isAfterMax(date) {
    return max && compareDates(date, max) > 0;
  }

  function isDisabled(date) {
    if (!date) return true;
    return isBeforeMin(date) || isAfterMax(date);
  }

  function isEnabled(date) {
    return !isDisabled(date);
  }

  function isInAllowedRange(date) {
    if (!hasConstraints.value) return true;
    if (min && max) return isBetween(date, min, max);
    if (min) return !isBeforeMin(date);
    if (max) return !isAfterMax(date);
    return true;
  }

  function isMonthDisabled(year, month) {
    const firstDay = { jy: year, jm: month, jd: 1 };
    const lastDay = { jy: year, jm: month, jd: 31 };
    return isBeforeMin(lastDay) || isAfterMax(firstDay);
  }

  function isYearDisabled(year) {
    const firstDay = { jy: year, jm: 1, jd: 1 };
    const lastDay = { jy: year, jm: 12, jd: 29 };
    return isBeforeMin(lastDay) || isAfterMax(firstDay);
  }

  function clampDate(date) {
    if (!date) return date;
    if (isBeforeMin(date)) return { ...min };
    if (isAfterMax(date)) return { ...max };
    return date;
  }

  return {
    min,
    max,
    hasConstraints,
    isDisabled,
    isEnabled,
    isInAllowedRange,
    isMonthDisabled,
    isYearDisabled,
    clampDate,
  };
}
