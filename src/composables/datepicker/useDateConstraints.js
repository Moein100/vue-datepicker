import { compareDates, isBetween, parseJalaaliDate } from '@/utils/datepicker';
import { computed } from 'vue';

export function useDateConstraints(options = {}) {
  const { minDate = null, maxDate = null } = options;

  const min = parseJalaaliDate(minDate);
  const max = parseJalaaliDate(maxDate);

  const hasConstraints = computed(() => {
    return min !== null || max !== null;
  });

  function isDisabled(date) {
    if (!date) return true;

    if (min && compareDates(date, min) < 0) {
      return true;
    }

    if (max && compareDates(date, max) < 0) {
      return true;
    }
    return false;
  }

  function isEnabled(date) {
    return !isDisabled(date);
  }

  function isInAllowedRange(date) {
    if (!hasConstraints.value) return true;

    if (min && max) {
      return isBetween(date, min, max);
    }

    if (min) {
      return compareDates(date, min) >= 0;
    }

    if (max) {
      return compareDates(date, max) <= 0;
    }

    return true;
  }

  function isMonthDisabled(year, month) {
    const firstDay = { jy: year, jm: month, jd: 1 };
    const lastDay = { jy: year, jm: month, jd: 31 };

    if (min && compareDates(lastDay, min) < 0) {
      return true;
    }

    if (max && compareDates(firstDay, max) > 0) {
      return true;
    }

    return false;
  }

  function isYearDisabled(year) {
    const firstDay = { jy: year, jm: 1, jd: 1 };
    const lastDay = { jy: year, jm: 12, jd: 29 };

    if (min && compareDates(lastDay, min) < 0) {
      return true;
    }

    if (max && compareDates(firstDay, max) > 0) {
      return true;
    }

    return false;
  }

  function clampDate(date) {
    if (!date) return date;

    if (min && compareDates(date, min) < 0) {
      return { ...min };
    }

    if (max && compareDates(date, max) > 0) {
      return { ...max };
    }

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
