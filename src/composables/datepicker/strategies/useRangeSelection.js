import { compareDates, isBetweenExclusive, isSameDate, parseDateRange } from '@/utils/datepicker';
import { computed, readonly, ref } from 'vue';

export function useRangeSelection(initialValue = null) {
  const parsed = parseDateRange(initialValue);
  const start = ref(parsed?.start || null);
  const end = ref(parsed?.end || null);

  const selectionState = computed(() => {
    if (!start.value && !end.value) return 'empty';
    if (start.value && !end.value) return 'selecting';
    return 'complete';
  });

  function select(date) {
    const dateObj = { ...date };

    if (!start.value || (start.value && end.value)) {
      start.value = dateObj;
      end.value = null;
      return;
    }
    if (compareDates(dateObj, start.value) < 0) {
      end.value = start.value;
      start.value = dateObj;
    } else if (compareDates(dateObj, start.value) === 0) {
      start.value = null;
      end.value = null;
    } else {
      end.value = dateObj;
    }
  }

  function isSelected(date) {
    return isRangeStart(date) || isRangeEnd(date);
  }
  function isInRange(date) {
    if (!start.value || !end.value) return false;
    return isBetweenExclusive(date, start.value, end.value);
  }

  function isRangeStart(date) {
    return isSameDate(start.value, date);
  }

  function isRangeEnd(date) {
    return isSameDate(end.value, date);
  }

  function getValue() {
    if (!start.value || !end.value) return null;

    return {
      start: { ...start.value },
      end: { ...end.value },
    };
  }

  function clear() {
    start.value = null;
    end.value = null;
  }
  return {
    start: readonly(start),
    end: readonly(end),
    selectionState,

    select,
    isSelected,
    isInRange,
    isRangeStart,
    isRangeEnd,
    getValue,
    clear,
  };
}
